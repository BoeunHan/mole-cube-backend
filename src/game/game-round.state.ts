import { CubeAction, CubeActionHistory } from 'src/common/types';
import { CubeStatus } from 'src/common/cube-status';
import EventEmitter from 'events';

export class GameRoundState extends EventEmitter {
  currentRound = 0;
  isOpen = false;
  currentPlayerId?: string; // 현재 차례인 플레이어 ID
  playerQueue: string[] = []; // 플레이어 순서
  turnEndTime: number = 0;
  openedAt: Date | null = null;
  closedAt: Date | null = null;
  actionHistories: CubeActionHistory[] = [];
  cubeStatus = new CubeStatus('easy');

  private TURN_TIME = 10;
  private turnTimeout?: NodeJS.Timeout;

  join(playerId: string) {
    if (!this.playerQueue.includes(playerId)) {
      this.playerQueue.push(playerId);
    }

    if (this.playerQueue.length === 1) {
      this.currentPlayerId = playerId;
      this.scheduleTurnTimeout();
      this.emitTurnUpdated();
    }
  }

  leave(playerId: string) {
    // 한 명 남았는데 나가는 경우
    if (this.playerQueue.length === 1) {
      this.currentPlayerId = undefined;
      this.turnEndTime = 0;
      return;
    }

    // 현재 차례인 사람이 나가는 경우
    if (this.currentPlayerId === playerId) {
      this.setNextTurn(playerId);
    }

    this.playerQueue = this.playerQueue.filter((player) => player !== playerId);
  }

  private setNextTurn(playerId: string) {
    const queue = this.playerQueue;
    const currentIndex = queue.indexOf(playerId);

    if (currentIndex === -1) {
      console.error('플레이어가 playerQueue에 없습니다.');
      return;
    }
    const nextIndex = (currentIndex + 1) % queue.length;
    this.currentPlayerId = queue[nextIndex];
    this.scheduleTurnTimeout();
    this.emitTurnUpdated();
  }

  private scheduleTurnTimeout() {
    const currentPlayerId = this.currentPlayerId;
    if (!currentPlayerId) return;
    if (this.turnTimeout) clearTimeout(this.turnTimeout);

    this.turnEndTime = Date.now() + this.TURN_TIME * 1000;
    this.turnTimeout = setTimeout(() => {
      this.setNextTurn(currentPlayerId);
    }, this.TURN_TIME * 1000);
  }

  private emitTurnUpdated() {
    this.emit('turnUpdated', {
      currentPlayerId: this.currentPlayerId,
      turnEndTime: this.turnEndTime,
    });
  }

  openNextRound() {
    this.currentRound++;
    this.isOpen = true;
    this.openedAt = new Date();
    this.closedAt = null;
    this.actionHistories = [];
    this.cubeStatus = new CubeStatus('easy');
  }

  close() {
    this.isOpen = false;
    this.closedAt = new Date();
  }

  rotateCube(userId: string, action: CubeAction) {
    this.cubeStatus.rotateCubeFace(action.face, action.clockwise);

    const timestamp = Date.now();
    const history = { userId, timestamp, action };
    this.actionHistories.push(history);
    this.setNextTurn(userId);
    return history;
  }

  getDisplayInfo() {
    return {
      currentRound: this.currentRound,
      playerQueue: this.playerQueue,
      currentPlayerId: this.currentPlayerId,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      actionHistories: this.actionHistories,
      faceColors: this.cubeStatus.faceColors,
    };
  }
}
