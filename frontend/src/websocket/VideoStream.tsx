"use client";

import { CheckCircle2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Initialize the socket outside the component
const socket = io("http://localhost:5000");

const VideoStreamHandler = () => {
  const [sendFrames, setSendFrames] = useState(false);
  const [message, setMessage] = useState<String>("");
  const [mode, setMode] = useState<"register" | "check">("check");
  const [reg_1, setReg_1] = useState({
    message: "",
  });
  const [reg_2, setReg_2] = useState({
    message: "",
  });
  const [reg_3, setReg_3] = useState({
    message: "",
  });
  const [check_1, setCheck_1] = useState({
    message: "",
  });
  const [check_2, setCheck_2] = useState({
    message: "",
  });
  const [check_3, setCheck_3] = useState({
    message: "",
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("WebSocket connection established");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.on("reg_1", (msg) => {
      console.log(msg);
      setReg_1({ ...reg_1, message: msg.message });
    });

    socket.on("reg_2", (msg) => {
      console.log(msg);
      setReg_2({ ...reg_2, message: msg.message });
    });

    socket.on("reg_3", (msg) => {
      console.log(msg);
      setReg_3({ ...reg_3, message: msg.message });
    });

    socket.on("check_1", (msg) => {
      console.log(msg);
      setCheck_1({ ...check_1, message: msg.message });
    });

    socket.on("check_2", (msg) => {
      console.log(msg.message);
      setCheck_2({ ...check_2, message: msg.message });
    });

    socket.on("check_3", (msg) => {
      console.log(msg);
      setCheck_3({ ...check_3, message: msg.message });
    });

    // Message received
    const handleMessage = (msg: string) => {
      console.log("Message Received: ", msg);
      setMessage(msg);

      // Reset the timeout for clearing the message
      //@ts-ignore
      if (window.messageTimeout) {
        //@ts-ignore
        clearTimeout(window.messageTimeout);
      }

      // Clear the message after 3 seconds
      //@ts-ignore
      window.messageTimeout = setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    socket.on("message", handleMessage);

    return () => {
      // Clean up socket listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startCamera();
  }, []);

  const captureFrame = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const frame = canvas.toDataURL("image/jpeg");

        if (socket.connected) {
          // socket.emit("register-frame", { frame });
          socket.emit(mode === "check" ? "face-check" : "register-frame", {
            frame,
          });
        } else {
          console.warn("Socket is not connected");
        }
      }
    }
  };

  useEffect(() => {
    if (!sendFrames) return;
    const interval = setInterval(() => {
      captureFrame();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sendFrames]);

  return (
    <div className="relative">
      {message && (
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className=" text-center z-10 "
        >
          <p
            style={{
              backgroundColor: "#1CBB9B",
              color: "white",
              opacity: 0.6,
              width: "24rem",
              padding: "0.5rem 1rem",
            }}
            className=" w-96 py-1 flex gap-2 justify-center items-center rounded-md"
          >
            {message}
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        width="1000"
        height="750"
        style={{ transform: "scaleX(-1)" }}
      ></video>
      <canvas
        ref={canvasRef}
        width="1000"
        height="750"
        style={{ display: "none" }}
      ></canvas>
      <button
        onClick={() => {
          setMode("check");
          setSendFrames(!sendFrames);
          if (sendFrames) {
            // socket.emit("register-stop");
            socket.emit("face-check-stop");
          } else {
            // socket.emit("register-start", { studentId: "1234569999" });
            socket.emit("face-check-start");
          }
        }}
      >
        {" "}
        {sendFrames ? "Stop Check" : "Start Check"}
      </button>
      <button
        // className="ml-6"
        style={{ marginLeft: "2rem" }}
        onClick={() => {
          setMode("register");
          setSendFrames(!sendFrames);
          if (sendFrames) {
            socket.emit("register-stop");
          } else {
            socket.emit("register-start", { studentId: "aayan" });
          }
        }}
      >
        {" "}
        {sendFrames ? "Stop Register" : "Start Register"}
      </button>
      <p>{reg_1.message}</p>
      <p>{reg_2.message}</p>
      <p>{reg_3.message}</p>
      <p>{check_1.message}</p>
      <p>{check_2.message}</p>
      <p>{check_3.message}</p>
    </div>
  );
};

export default VideoStreamHandler;
