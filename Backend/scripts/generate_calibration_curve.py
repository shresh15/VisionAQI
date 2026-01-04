import numpy as np
import matplotlib.pyplot as plt
import os

# Ensure static directory exists
os.makedirs("static", exist_ok=True)

# 1. Calibration Points
haze_x = np.array([1.0, 1.2, 1.4, 1.6, 1.8, 2.0])
aqi_y  = np.array([15, 55, 110, 170, 280, 400])

# 2. Polynomial regression
coeffs = np.polyfit(haze_x, aqi_y, 2)
polynomial_model = np.poly1d(coeffs)

# 3. Smooth curve
x_smooth = np.linspace(0.8, 2.2, 100)
y_smooth = polynomial_model(x_smooth)

# 4. Plot
plt.figure(figsize=(10, 6))
plt.scatter(haze_x, aqi_y, color='red', label='Calibration Anchor Points', s=100)
plt.plot(x_smooth, y_smooth, color='blue', linewidth=3, label='Polynomial Regression Curve')

plt.title('Haze Intensity vs Predicted AQI', fontsize=16)
plt.xlabel('Mean Haze (K)', fontsize=12)
plt.ylabel('AQI', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()

# AQI bands
plt.axhspan(0, 50, color='green', alpha=0.1)
plt.axhspan(50, 100, color='yellow', alpha=0.1)
plt.axhspan(100, 150, color='orange', alpha=0.1)
plt.axhspan(150, 200, color='red', alpha=0.1)
plt.axhspan(200, 300, color='purple', alpha=0.1)
plt.axhspan(300, 500, color='maroon', alpha=0.1)

# 5. Save image (IMPORTANT)
plt.savefig("static/calibration_curve.png", dpi=150, bbox_inches="tight")
plt.close()

print("✅ Calibration curve saved at static/calibration_curve.png")
print("Polynomial formula:", polynomial_model)
