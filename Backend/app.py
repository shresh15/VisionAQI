from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import cv2
import torch
import numpy as np
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from model.aodnet import AODNet
from model.aqi_regressor import AQIRegressor

# --- Import AI Models & Utils ---
try:
    
    from utils.image_checks import is_day_image
    from utils.preprocess import preprocess
    from utils.features import extract_haze_features
except ImportError as e:
    print(f"⚠️ Warning: Could not import AI modules. Error: {e}")

# Load environment variables
load_dotenv()

app = Flask(
    __name__,
    static_folder="static",
    static_url_path="/static"
)
CORS(app)

# --- Configuration ---
MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('DB_NAME', 'visionaqi')
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- MongoDB Connection ---
try:
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users_collection = db['users']
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None
    users_collection = None

# --- Load Model & Statistics ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Models
aod_model = AODNet().to(device)
aod_model.load_state_dict(torch.load("model/aodnet.pth", map_location=device))
aod_model.eval()

aqi_model = AQIRegressor().to(device)
aqi_model.load_state_dict(torch.load("model/aqi_regressor.pth", map_location=device))
aqi_model.eval()

# --- Training Statistics from haze_aqi_dataset.csv ---
# Order: [mean_haze, std_haze, max_haze, min_haze]
train_mean = torch.tensor([1.552576, 0.142549, 1.931332, 0.995442], device=device).float()
train_std = torch.tensor([0.116868, 0.037032, 0.063219, 0.076424], device=device).float()

import numpy as np




# --- Auth Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]

            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})

            if not current_user:
                return jsonify({'error': 'User not found'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- Routes ---

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "VisionAQI Backend is running",
        "models_loaded": aod_model is not None and aqi_model is not None
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "mongodb": "connected" if db else "disconnected",
        "models": {
            "aod_net": "loaded" if aod_model else "failed",
            "aqi_regressor": "loaded" if aqi_model else "failed"
        }
    })

# --- Auth Endpoints ---

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    if users_collection is None:
        return jsonify({'error': 'Database unavailable'}), 503
        
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'error': 'Required fields missing'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'Email already registered'}), 409
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_doc = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {'id': user_id, 'name': name, 'email': email}
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    if users_collection is None:
        return jsonify({'error': 'Database unavailable'}), 503

    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = users_collection.find_one({'email': email})
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {'id': str(user['_id']), 'name': user['name'], 'email': user['email']}
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_token(current_user):
    return jsonify({
        'user': {
            'id': str(current_user['_id']),
            'name': current_user['name'],
            'email': current_user['email']
        }
    }), 200

# --- Analysis Endpoint ---


train_mean = torch.tensor([1.552576, 0.142549, 1.931332, 0.995442], device=device)
train_std = torch.tensor([0.116868, 0.037032, 0.063219, 0.076424], device=device)

# These are the same anchor points we used for your graph and dataset
haze_x = np.array([1.0, 1.2, 1.4, 1.6, 1.8, 2.0])
aqi_y  = np.array([15,  55,  110, 170, 280, 400])
coeffs = np.polyfit(haze_x, aqi_y, 2)
polynomial_model = np.poly1d(coeffs)

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if not aod_model:
        return jsonify({'error': 'AOD Model not loaded'}), 503

    file = request.files.get('image')
    if not file or file.filename == '':
        return jsonify({'error': 'No image provided'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, f"temp_{datetime.now().timestamp()}.jpg")
    file.save(filepath)

    try:
        # 1. Load Image
        img = cv2.imread(filepath)
        if not is_day_image(img):
            os.remove(filepath)
            return jsonify({'error': 'Night image detected. Use a day image.'}), 400

        # 2. Preprocess to Tensor
        tensor_img = preprocess(img, device)

        with torch.no_grad():
            # Extract K (Haze/Transmission related map) from your AOD-Net
            _, K = aod_model(tensor_img)
            mean_haze = torch.mean(K).item()

        # 3. --- THE POLYNOMIAL REGRESSION FIX ---
        # Instead of using a second 'aqi_model', use the math curve
        raw_aqi = polynomial_model(mean_haze)
        
        # Clamp between 0 and 500 (Standard AQI Max)
        estimated_aqi = np.clip(raw_aqi, 0, 500)
        # ----------------------------------------

        # 4. Category Logic (EPA Standards)
        if estimated_aqi <= 55:
            category = "Good"
            color = "#00e400"
        elif estimated_aqi <= 110:
            category = "Moderate"
            color = "#ffff00"
        elif estimated_aqi <= 170:
            category = "Unhealthy for Sensitive Groups"
            color = "#ff7e00"
        elif estimated_aqi <= 280:
            category = "Unhealthy"
            color = "#ff0000"
        elif estimated_aqi <= 400:
            category = "Very Unhealthy"
            color = "#8f3f97"
        else:
            category = "Hazardous"
            color = "#7e0023"

        # Cleanup
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            'status': 'success',
            'aqi': round(float(estimated_aqi), 2),
            'category': category,
            'color': color,
            'mean_haze': round(mean_haze, 4)
        })

    except Exception as e:

        if os.path.exists(filepath): os.remove(filepath)

        print(f"Error: {e}")

        return jsonify({'error': 'Analysis failed'}), 500

if __name__ == '__main__':

    port = int(os.getenv('PORT', 5000))

    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'

    app.run(host='0.0.0.0', port=port, debug=debug)