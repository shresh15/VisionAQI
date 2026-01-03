import torch
import torch.nn as nn
class AODNet(nn.Module):
    def __init__(self):
        super(AODNet, self).__init__()

        self.conv1 = nn.Conv2d(3, 3, 3, padding=1)
        self.conv2 = nn.Conv2d(3, 3, 3, padding=1)
        self.conv3 = nn.Conv2d(3, 3, 3, padding=1)
        self.conv4 = nn.Conv2d(3, 3, 3, padding=1)
        self.conv5 = nn.Conv2d(12, 3, 3, padding=1)

        self.relu = nn.ReLU()

    def forward(self, x):
        x1 = self.relu(self.conv1(x))
        x2 = self.relu(self.conv2(x1))
        x3 = self.relu(self.conv3(x2))
        x4 = self.relu(self.conv4(x3))

        concat = torch.cat([x1, x2, x3, x4], dim=1)
        K = self.relu(self.conv5(concat))

        J = K * x - K + 1
        return J,K
