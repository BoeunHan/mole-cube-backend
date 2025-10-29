import { Face } from './enums';

export interface CubeAction {
  face: Face;
  clockwise: boolean;
}

export interface CubeActionHistory {
  userId: string;
  nickname: string;
  timestamp: number;
  action: CubeAction;
}
