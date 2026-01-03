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

# --- Import AI Models & Utils ---
try:
    from model.aodnet import AODNet
    from model.aqi_regressor import AQIRegressor
    from utils.image_checks import is_day_image
    from utils.preprocess import preprocess
    from utils.features import extract_haze_features
except ImportError as e:
    print(f"⚠️ Warning: Could not import AI modules. Error: {e}")

# Load environment variables
load_dotenv()

app = Flask(__name__)
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

# --- Load AI Models ---
device = "cuda" if torch.cuda.is_available() else "cpu"
aod_model = None
aqi_model = None

def load_models():
    global aod_model, aqi_model
    try:
        print(f"🔄 Loading AI models on {device}...")

        # Load AODNet
        aod = AODNet().to(device)
        aod.load_state_dict(torch.load("model/aodnet.pth", map_location=device))
        aod.eval()
        aod_model = aod
        print("✅ AODNet loaded.")

        # Load AQI Regressor
        aqi = AQIRegressor().to(device)
        aqi.load_state_dict(torch.load("model/aqi_regressor.pth", map_location=device))
        aqi.eval()
        aqi_model = aqi
        print("✅ AQI Regressor loaded.")

    except Exception as e:
        print(f"⚠️ Error loading AI models: {e}")

load_models()

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



@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if not aod_model or not aqi_model:
        return jsonify({'error': 'AI models not loaded'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save temp file
        filename = f"temp_{datetime.now().timestamp()}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        img = cv2.imread(filepath)
        if img is None:
            os.remove(filepath)
            return jsonify({'error': 'Invalid image'}), 400

        # Day/Night Check
        if not is_day_image(img):
            os.remove(filepath)
            return jsonify({
                'error': 'Night image detected. Please upload a daytime image.'
            }), 400

        # 🔧 FIX 1: Proper preprocessing (RGB handled in preprocess.py)
        tensor_img = preprocess(img, device)

        with torch.no_grad():
            # AODNet inference
            _, K = aod_model(tensor_img)

            # 🔧 FIX 2: Correct feature extraction
            features = extract_haze_features(tensor_img, K)

            # 🔧 FIX 3: Feature normalization
            features = (features - features.mean()) / (features.std() + 1e-6)

            # 🔧 FIX 4: Safe AQI prediction with sigmoid scaling
            raw_output = aqi_model(features.unsqueeze(0))
            estimated_aqi = torch.sigmoid(raw_output).item() * 500

            # 🔧 FIX 5: Hard clamp for safety
            estimated_aqi = max(0, min(500, estimated_aqi))
            
            print("Features:", features.tolist())
            print("AQI output:", estimated_aqi)

        os.remove(filepath)

        # AQI Category
        if estimated_aqi <= 50:
            category = "Good"
        elif estimated_aqi <= 100:
            category = "Moderate"
        elif estimated_aqi <= 150:
            category = "Unhealthy for Sensitive Groups"
        elif estimated_aqi <= 200:
            category = "Unhealthy"
        elif estimated_aqi <= 300:
            category = "Very Unhealthy"
        else:
            category = "Hazardous"

        return jsonify({
            'status': 'success',
            'aqi': round(estimated_aqi, 2),
            'category': category,
            'message': 'Analysis completed successfully'
        })

    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({'error': 'Analysis failed'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
