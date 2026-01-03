from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "VisionAQI Flask Backend is running!"
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "VisionAQI-Backend"
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
