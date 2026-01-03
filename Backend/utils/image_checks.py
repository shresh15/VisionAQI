import cv2
import numpy as np

def get_image_stats(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Day/Night
    is_day = gray.mean() > 60
    
    # 2. Blur (Laplacian)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # 3. Exposure
    dark_ratio = np.mean(gray < 30)
    bright_ratio = np.mean(gray > 225)
    
    return {
        "is_day": is_day,
        "blur_score": blur_score,
        "is_poor_exposure": dark_ratio > 0.4 or bright_ratio > 0.4
    }