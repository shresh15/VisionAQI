import cv2
import torch

def preprocess(img, device):
    img = cv2.resize(img, (256,256))
    img = torch.tensor(img).permute(2,0,1).float()/255.0
    return img.unsqueeze(0).to(device)
