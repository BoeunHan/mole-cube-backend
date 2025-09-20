import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CubeStatus } from 'src/common/cube-status';
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
  private cubeStatus: CubeStatus;
  private cubeHistories: CubeAction[] = [];

  constructor() {
    this.cubeStatus = new CubeStatus(3);
  }

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
    client.broadcast.emit('rotateCube:server', action);
  }
}
