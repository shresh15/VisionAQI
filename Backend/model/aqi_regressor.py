import torch.nn as nn
class AQIRegressor(nn.Module):
    def __init__(self):
        super(AQIRegressor, self).__init__()

        self.model = nn.Sequential(
            nn.Linear(4, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )

    def forward(self, x):
        return self.model(x)