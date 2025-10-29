import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { CubeAction } from 'src/common/types';
import { GameRoundState } from 'src/game/game-round.state';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players: Record<string, string> = {};
  private roundState = new GameRoundState();

  onModuleInit() {
    this.startRound();
  }

  private startRound() {
    this.roundState.openNextRound();

    this.server.emit('startRound', this.roundState);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('initGameRound', this.roundState.getDisplayInfo());
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
    if (!this.roundState.isOpen) return;

    const userId = client.data.userId as string;
    const nickname = this.players[userId];
    const history = this.roundState.rotateCube(userId, nickname, action);
    this.server.emit('cubeHistoryUpdate', history);
  }
}
