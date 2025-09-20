import { Face } from './enums';

export interface CubeAction {
  face: Face;
  clockwise: boolean;
  timestamp: number;
}

export interface CubeActionHistory {
  nickname: string;
  action: CubeAction;
}
