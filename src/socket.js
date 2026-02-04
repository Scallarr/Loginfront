import { io } from "socket.io-client";

const socket = io("https://login-ue7d.onrender.com", {
  transports: ["websocket"],
});

export default socket;
