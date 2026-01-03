import torch

def extract_haze_features(image, K):
    # Normalize K safely
    K = torch.clamp(K, 0, 1)

    haze_strength = 1 - K.mean()
    haze_variation = K.std()

    brightness = image.mean()
    contrast = image.std()

    features = torch.tensor([
        haze_strength.item(),
        haze_variation.item(),
        brightness.item(),
        contrast.item()
    ], dtype=torch.float32)

    return features
