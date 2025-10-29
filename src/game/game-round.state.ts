import { CubeAction, CubeActionHistory } from 'src/common/types';
import { CubeStatus } from 'src/common/cube-status';

export class GameRoundState {
  currentRound = 0;
  isOpen = false;
  currentPlayerId?: string; // 현재 차례인 플레이어 ID
  playerQueue: string[] = []; // 플레이어 순서
  openedAt: Date | null = null;
  closedAt: Date | null = null;
  actionHistories: CubeActionHistory[] = [];
  cubeStatus = new CubeStatus('easy');

  join(playerId: string) {
    if (this.playerQueue.length === 0) this.currentPlayerId = playerId;
    if (!this.playerQueue.includes(playerId)) this.playerQueue.push(playerId);
  }

  leave(playerId: string) {
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
