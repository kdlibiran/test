import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const auth = client.handshake.auth as {
      userId?: string | number;
    };

    const userId = auth?.userId;
    if (!userId) {
      this.logger.warn(`Client ${client.id} missing userId; disconnecting`);
      client.disconnect();
      return;
    }

    const room = String(userId);
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitToAll<T = unknown>(event: string, payload: T) {
    Logger.log(`Emitting to all: ${event}`, payload);
    this.server.emit(event, payload);
  }

  emitToUser<T = unknown>(userId: string, event: string, payload: T) {
    Logger.log(`Emitting to user ${userId}: ${event}`, payload);
    this.server.to(String(userId)).emit(event, payload);
  }
}
