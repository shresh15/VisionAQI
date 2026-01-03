from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import torch
from model.aodnet import AODNet
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('DB_NAME', 'visionaqi')
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')

# Initialize MongoDB client
try:
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    users_collection = db['users']
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None
    users_collection = None

# JWT Token Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
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

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "VisionAQI Flask Backend is running!"
    })

@app.route('/api/health')
def health_check():
    mongo_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "healthy",
        "service": "VisionAQI-Backend",
        "mongodb": mongo_status
    })

# Signup Endpoint
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate input
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user_doc = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': user_id,
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Login Endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# Verify Token Endpoint
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

# Load AI Model
device = "cuda" if torch.cuda.is_available() else "cpu"
try:
    model = AODNet().to(device)
    model.load_state_dict(
        torch.load("model/aodnet.pth", map_location=device)
    )
    model.eval()
    print(f"✅ AI Model loaded successfully on {device}")
except Exception as e:
    print(f"⚠️ AI Model could not be loaded: {e}")
    model = None

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)



from flask import Flask, request, render_template
import cv2
import torch
import os

from models.aodnet import AODNet
from models.aqi_regressor import AQIRegressor
from utils.image_checks import is_day_image
from utils.preprocessing import preprocess
from utils.features import extract_haze_features

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load models
aod = AODNet().to(device)
aod.load_state_dict(torch.load("models/aodnet.pth", map_location=device))
aod.eval()

aqi_model = AQIRegressor().to(device)
aqi_model.load_state_dict(torch.load("models/aqi_cnn.pth", map_location=device))
aqi_model.eval()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["image"]
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        img = cv2.imread(path)

        if not is_day_image(img):
            return "❌ Rejected: Night / Dark image"

        tensor = preprocess(img, device)

        with torch.no_grad():
            _, K = aod(tensor)
            features = extract_haze_features(K)
            pred_norm = aqi_model(features.unsqueeze(0)).item()

        aqi = pred_norm * 500.0
        return f"Estimated AQI: {aqi:.2f}"

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
