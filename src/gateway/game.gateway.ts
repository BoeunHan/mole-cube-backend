import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { CubeAction } from 'src/common/types';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Record<string, string> = {};
  private cubeHistories: CubeAction[] = [];

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

  @SubscribeMessage('rotateCube')
  handleRotateCube(client: Socket, action: CubeAction) {
    this.cubeHistories.push(action);
    console.log(this.cubeHistories);
    this.server.emit('cubeHistoriesUpdate', this.cubeHistories);
  }
}
