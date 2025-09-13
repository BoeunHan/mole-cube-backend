import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Record<string, string> = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    delete this.players[client.data.userId];

    this.server.emit('playersUpdate', this.players);
  }

  @SubscribeMessage('setNickname')
  handleSetNickname(
    client: Socket,
    { userId, nickname }: { userId: string; nickname: string },
  ) {
    this.players[userId] = nickname;
    client.data.userId = userId;

    this.server.emit('playersUpdate', this.players);
  }
}
