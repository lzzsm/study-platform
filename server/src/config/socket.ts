import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // middleware de autenticação — só aceita conexões com token válido
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token não fornecido."));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };
      (socket as any).userId = payload.id;
      next();
    } catch {
      next(new Error("Token inválido."));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;

    // cada usuário entra numa sala com seu próprio id
    // assim podemos emitir eventos só pra ele
    socket.join(`user:${userId}`);

    socket.on("disconnect", () => {
      socket.leave(`user:${userId}`);
    });
  });

  return io;
}

// exporta o io pra usar em qualquer service
export function getIO(): SocketServer {
  if (!io) throw new Error("Socket.IO não inicializado.");
  return io;
}
