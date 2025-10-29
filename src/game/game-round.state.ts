import { CubeAction, CubeActionHistory } from 'src/common/types';
import { CubeStatus } from 'src/common/cube-status';

export class GameRoundState {
  currentRound = 0;
  isOpen = false;
  openedAt: Date | null = null;
  closedAt: Date | null = null;
  actionHistories: CubeActionHistory[] = [];
  cubeStatus = new CubeStatus('easy');

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

  rotateCube(userId: string, nickname: string, action: CubeAction) {
    this.cubeStatus.rotateCubeFace(action.face, action.clockwise);

    const timestamp = Date.now();
    const history = { userId, nickname, timestamp, action };
    this.actionHistories.push(history);
    return history;
  }

  getDisplayInfo() {
    return {
      currentRound: this.currentRound,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      actionHistories: this.actionHistories,
      faceColors: this.cubeStatus.faceColors,
    };
  }
}
