import torch

def extract_haze_features(K):
    return torch.tensor([
        K.mean().item(),
        K.std().item(),
        K.max().item(),
        K.min().item()
    ], dtype=torch.float32)
