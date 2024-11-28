import cv2
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
import os
import time
from utils import geometric_median, cosine_similarity, load_all_embeddings

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
mtcnn = MTCNN(keep_all=True, device=device)
inception_resnet = InceptionResnetV1(pretrained="vggface2").to(device).eval()

current_frames = []
frame_count = 0
max_frames = 150
is_check_mode = False 

embeddings_path = "ML/embeddings/"


if not os.path.exists(embeddings_path):
    os.makedirs(embeddings_path)

def compare_embeddings(current_embedding, all_embeddings):
    best_match = None
    best_score = 0.0

    for student_id, stored_embedding in all_embeddings:
        similarity_score = cosine_similarity(current_embedding, stored_embedding)
        print(f"Comparing with student {student_id}, similarity score: {similarity_score}")

        if similarity_score > best_score:
            best_score = similarity_score
            best_match = student_id

    return best_match, best_score

def preprocess_and_generate_embedding(image):
    if image is None:
        print("Error: Received empty frame.")
        return None

    faces, _ = mtcnn.detect(image)

    if faces is None or len(faces) == 0:
        print("No face detected.")
        return None

    largest_face_index = np.argmax([face[2] - face[0] for face in faces])  
    x1, y1, x2, y2 = map(int, faces[largest_face_index])  
    cropped_face = image[y1:y2, x1:x2]

    cropped_face = cv2.resize(cropped_face, (160, 160))
    cropped_face = (cropped_face - 127.5) / 128.0  
    cropped_face = cropped_face.transpose(2, 0, 1)
    cropped_face = torch.tensor(cropped_face, dtype=torch.float32).unsqueeze(0).to(device)

    embedding = inception_resnet(cropped_face)
    return embedding.detach().cpu().numpy().flatten()

@socketio.on("frame")
def handle_frame(data):
    global frame_count, is_check_mode
    if frame_count >= max_frames and not is_check_mode:
        emit("message", f"Capture stopped after {max_frames} frames.")
        stop_capture()
        return

    try:
        frame_data = data["frame"]
        nparr = np.frombuffer(base64.b64decode(frame_data.split(',')[1]), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            print("Error: Failed to decode image.")
            emit("message", "Failed to decode image.")
            return

        embedding = preprocess_and_generate_embedding(img)

        if embedding is not None:
            current_frames.append(embedding)
            frame_count += 1
            print(f"Embedding generated, current count: {len(current_frames)}")
        else:
            emit("message", "No face detected in the frame.")
    except Exception as e:
        print(f"Error handling frame: {e}")
        emit("message", "Error processing frame.")

@socketio.on("start")
def start_capture():
    global current_frames, frame_count, is_check_mode
    current_frames = []
    frame_count = 0
    is_check_mode = False 
    emit("message", "Started capturing frames...")

@socketio.on("stop")
def stop_capture():
    if len(current_frames) > 0:
        median_embedding = geometric_median(np.array(current_frames))
        print(f"Generated Median Embedding: {median_embedding}")
        save_embedding(median_embedding)
        emit("median_embedding", median_embedding.tolist())  
        emit("message", "Capture stopped. Embedding generated.")
    else:
        emit("message", "No frames captured. Please try again.")

@socketio.on("check")
def check_attendance():
    global is_check_mode
    is_check_mode = True 

    all_embeddings = load_all_embeddings() 
    if not all_embeddings:
        emit("message", "No embeddings found. Register students first.")
        return

    print(f"Loaded embeddings: {len(all_embeddings)}")  
    emit("message", "Started checking attendance...")

    cap = cv2.VideoCapture(0)
    cv2.namedWindow("Checking...")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        embedding = preprocess_and_generate_embedding(frame)

        if embedding is None:
            continue

        print(f"Checking embedding: {embedding}")  # Debug log
        best_match, best_score = compare_embeddings(embedding, all_embeddings)

        print(f"Best match: {best_match}, Best score: {best_score}")  # Debug log

        if best_score > 0.8:  # Threshold for similarity
            # Display name or ID of the student
            emit("similarity_score", best_score)  # Send similarity score to frontend
            emit("message", f"Attendance recorded for student ID: {best_match} with score: {best_score}.")
            break
        else:
            emit("message", f"Not recognized, score: {best_score}")

    cap.release()
    cv2.destroyAllWindows()

def save_embedding(embedding):
    student_id = str(int(time.time()))  # Unique ID based on timestamp
    embedding_path = os.path.join(embeddings_path, f"{student_id}.npy")
    np.save(embedding_path, embedding)  # Save embedding as a .npy file

def load_all_embeddings():
    embeddings = []
    for filename in os.listdir(embeddings_path):
        if filename.endswith(".npy"):
            student_embedding = np.load(os.path.join(embeddings_path, filename))
            student_id = filename.split(".")[0]
            embeddings.append((student_id, student_embedding))
    print(f"Loaded {len(embeddings)} embeddings.")  # Debug log
    return embeddings

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)