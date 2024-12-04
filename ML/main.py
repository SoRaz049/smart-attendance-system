import cv2
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64
import os
from pymongo import MongoClient
from utils import geometric_median, cosine_similarity
import requests

# MongoDB setup
MONGODB_URI = "mongodb+srv://prajal2:pass123@cluster0.fibti.mongodb.net"
client = MongoClient(MONGODB_URI)
db = client['smart_attendance']
students_collection = db['students']

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
mtcnn = MTCNN(keep_all=True, device=device)
inception_resnet = InceptionResnetV1(pretrained="vggface2").to(device).eval()

current_frames = []
frame_count = 0
max_frames = 150
is_registering = False
is_checking = False
student_id = None

embeddings_path = "ML/embeddings/"
if not os.path.exists(embeddings_path):
    os.makedirs(embeddings_path)


# MongoDB operations
def add_student_to_db(student_id, name, details):
    student_data = {
        "_id": student_id,
        "name": name,
        "details": details
    }
    students_collection.insert_one(student_data)


def get_student_details(student_id):
    return students_collection.find_one({"_id": student_id})


# Function to preprocess and generate embedding
def preprocess_and_generate_embedding(image):
    if image is None:
        print("Error: Received empty frame.")
        return None

    faces, _ = mtcnn.detect(image)

    if faces is None or len(faces) == 0:
        print("No face detected.")
        return None

    largest_face_index = np.argmax([face[2] - face[0] for face in faces])  # Largest face
    x1, y1, x2, y2 = map(int, faces[largest_face_index])  # Bounding box
    cropped_face = image[y1:y2, x1:x2]

    cropped_face = cv2.resize(cropped_face, (160, 160))
    cropped_face = (cropped_face - 127.5) / 128.0  # Normalize
    cropped_face = cropped_face.transpose(2, 0, 1)
    cropped_face = torch.tensor(cropped_face, dtype=torch.float32).unsqueeze(0).to(device)

    embedding = inception_resnet(cropped_face)
    return embedding.detach().cpu().numpy().flatten()


# WebSocket events
@socketio.on("register-start")
def start_capture(data):
    global current_frames, frame_count, is_registering, student_id
    current_frames = []
    frame_count = 0
    is_registering = True
    student_id = data["studentId"]
    emit("reg_3", {"succcess":2, "message":"Started capturing frame"})


@socketio.on("register-frame")
def handle_frame(data):
    global is_registering, student_id
    if not is_registering:
        emit("reg_3", {"success":2, "message":"Please start registration first"})
        return
    print("Frame Received")
    global frame_count
    if frame_count >= max_frames:
        is_registering = False
        # emit("reg_2", f"Capture stopped after {max_frames} frames.")
        stop_capture()
        return

    try:
        frame_data = data["frame"]
        nparr = np.frombuffer(base64.b64decode(frame_data.split(",")[1]), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            print("Failed to decode image.")
            return

        embedding = preprocess_and_generate_embedding(img)

        if embedding is not None:
            print("Embedding Generated", frame_count)
            emit("reg_1", {"message":f"Embedding Generated {frame_count}/{max_frames}"})
            current_frames.append(embedding)
            frame_count += 1
        else:
            emit("reg_2", {"success":0, "message":"No face detected in the frame."})
    except Exception as e:
        emit("reg_3", {"success":0, "message":f"Error processing frame. Please check terminal"})


@socketio.on("register-stop")
def stop_capture():
    global is_registering, student_id, max_frames
    is_registering = False
    if len(current_frames) >= max_frames:
        # Calculate and save median embedding
        median_embedding = geometric_median(np.array(current_frames))
        np.save(os.path.join(embeddings_path, f"{student_id}.npy"), median_embedding)
        is_registering = False
        emit("reg_2",{"success":1, "message": "Registration completed successfully!"})
    else:
        emit("reg_2", {"success":0, "message": "Not enough data. Please try again."})

@socketio.on("face-check-start")
def start_check():
    global is_checking
    is_checking = True
    # emit("check_1", {"message":"Checking Face"})
    print("Checking Face")

@socketio.on("face-check-stop")
def stop_check():
    global is_checking
    is_checking = False
    # emit("check_1", {"message":"Checking Stopped"})
    print("Checking Stopped")

@socketio.on("face-check")
def check_attendance(data):
    global is_checking, student_id
    if not is_checking:
        emit("check_3", {"success":2, "message":"Please start checking first"})
        return
    print("Checking Attendance")


    best_score = 0.0

    # Load stored embeddings
    embeddings = []
    for filename in os.listdir(embeddings_path):
        if filename.endswith(".npy"):
            embeddings.append((filename.split(".")[0], np.load(os.path.join(embeddings_path, filename))))

    # Preprocess frame
    frame_data = data["frame"]
    nparr = np.frombuffer(base64.b64decode(frame_data.split(",")[1]), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    embedding = preprocess_and_generate_embedding(img)

    if embedding is None:
        emit("check_2", {"success":0, "message":"No face detected."})
        return
    # print("Face Detected")
    # Compare embeddings
    for stored_id, stored_embedding in embeddings:
        similarity_score = cosine_similarity(embedding, stored_embedding)
        if similarity_score > best_score:
            best_score = similarity_score
            student_id = stored_id

    if best_score > 0.8: 
        # response = requests.post("http://localhost:3000/attendance", json = {"studentId": student_id} )
        print(f"Student recognized: {student_id}")
        emit("check_2", {"success":1, "message":f"Student recognized: {student_id}"})
        # print(response)
    else:
        emit("check_2", {"success":0, "message":"No matching student found."})


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
