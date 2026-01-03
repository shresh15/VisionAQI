import torch
from model.aodnet import AODNet

model = AODNet()
model.load_state_dict(
    torch.load("model/aodnet.pth", map_location="cpu")
)
print("Model loaded successfully!")
