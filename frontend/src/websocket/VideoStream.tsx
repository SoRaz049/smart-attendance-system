"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Initialize the socket outside the component
const socket = io("http://localhost:3001");

const VideoStreamHandler = () => {
  const [sendFrames, setSendFrames] = useState(false);

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

    return () => {
      // Clean up socket listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
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
          socket.emit("frame", { frame });
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
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [sendFrames]);

  return (
    <div>
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
      {/* <button
        onClick={() => {
          setSendFrames(!sendFrames);
        }}
      >
        {" "}
        {sendFrames ? "Stop" : "Start"}
      </button> */}
    </div>
  );
};

export default VideoStreamHandler;
