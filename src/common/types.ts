import { Face } from './enums';

export interface CubeAction {
  face: Face;
  clockwise: boolean;
  timestamp: number;
}

export interface CubeActionHistory {
  userId: string;
  nickname: string;
  action: CubeAction;
}
