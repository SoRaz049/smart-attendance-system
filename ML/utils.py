import numpy as np
from scipy.spatial.distance import cosine
import os

# Function to calculate geometric median
def geometric_median(points, eps=1e-5):
    x = np.median(points, axis=0)  # Initialize with median
    while True:
        dist = np.linalg.norm(points - x, axis=1)
        nonzero_dist = dist > eps
        if nonzero_dist.any():
            weights = 1 / dist[nonzero_dist]
            weighted_sum = np.sum(weights[:, None] * points[nonzero_dist], axis=0)
            x_new = weighted_sum / np.sum(weights)
            if np.linalg.norm(x_new - x) < eps:
                break
            x = x_new
        else:
            break
    return x

# Function to compute cosine similarity between two vectors
def cosine_similarity(v1, v2):
    return 1 - cosine(v1, v2)

# Load embeddings from files
def load_all_embeddings(embeddings_path="ML/embeddings/"):
    embeddings = []
    for filename in os.listdir(embeddings_path):
        if filename.endswith(".npy"):
            student_embedding = np.load(os.path.join(embeddings_path, filename))
            student_id = filename.split(".")[0]
            embeddings.append((student_id, student_embedding))
    return embeddings
