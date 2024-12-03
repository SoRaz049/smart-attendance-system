import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import fs from "fs";
import path from "path";

export function setupWebSocket(server: HttpServer): void {
  const io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  const framesFolder = path.resolve(__dirname, "frames");

  if (!fs.existsSync(framesFolder)) {
    fs.mkdirSync(framesFolder, { recursive: true });
    console.log(`Frames folder created at: ${framesFolder}`);
  }

  io.on("connection", (socket) => {
    console.log("User connected to websocket: ", socket.id);

    socket.on("message", (msg) => {
      console.log("Message: ", msg);
    });

    socket.on("check", (frame) => {
      console.log("Frame received.");

      // const base64Data = frame.frame.replace(/^data:image\/jpeg;base64,/, "");

      // // const fileName = `frame_${Date.now()}.jpg`;
      // const fileName = `decoded_frame.jpg`;

      // const filePath = path.join(framesFolder, fileName);

      // fs.writeFile(filePath, base64Data, "base64", (err) => {
      //   if (err) {
      //     console.error("Error decoding and saving frame:", err);
      //   } else {
      //     console.log(`Frame successfully saved at: ${filePath}`);
      //   }
      // });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
