import { Face } from './enums';

export interface CubeAction {
  face: Face;
  clockwise: boolean;
  timestamp: number;
}
