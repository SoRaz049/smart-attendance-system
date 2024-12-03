"use client";

import React, { useEffect, useState } from "react";
import VideoStreamHandler from "../../websocket/VideoStream";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
} from "lucide-react";
import { io } from "socket.io-client";

const VideoPage = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    // Simulating attendance marking
    setTimeout(() => setAttendanceMarked(true), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle className="text-center">Start Attendance</CardTitle>
        </CardHeader>
        <CardContent className=" relative flex flex-col items-center">
          <p className="text-center text-gray-600 mb-4 text-sm">
            We are capturing your face to mark your attendance. Please look
            directly at the camera.
          </p>
          {isCameraOpen ? (
            <div className="relative w-full">
              <VideoStreamHandler />
            </div>
          ) : (
            <div className="w-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Camera is closed</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {/* {isCameraOpen && (
            <Button onClick={handleCloseCamera} className="mt-4 bg-blue">
              Close Camera
            </Button>
          )} */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoPage;
