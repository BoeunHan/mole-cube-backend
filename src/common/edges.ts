import { Face } from './enums';

export type EdgePosition = 'top' | 'bottom' | 'left' | 'right';

export interface AdjacentEdgeInfo {
  face: Face;
  edge: EdgePosition;
  reverse: boolean;
}

export const adjacentEdgesMap: Record<Face, AdjacentEdgeInfo[]> = {
  [Face.R]: [
    {
      face: Face.U,
      edge: 'right',
      reverse: false,
    },
    {
      face: Face.B,
      edge: 'right',
      reverse: true,
    },
    {
      face: Face.D,
      edge: 'right',
      reverse: false,
    },
    {
      face: Face.F,
      edge: 'right',
      reverse: true,
    },
  ],
  [Face.L]: [
    {
      face: Face.U,
      edge: 'left',
      reverse: true,
    },
    {
      face: Face.F,
      edge: 'left',
      reverse: false,
    },
    {
      face: Face.D,
      edge: 'left',
      reverse: true,
    },
    {
      face: Face.B,
      edge: 'left',
      reverse: false,
    },
  ],
  [Face.U]: [
    {
      face: Face.B,
      edge: 'top',
      reverse: false,
    },
    {
      face: Face.R,
      edge: 'right',
      reverse: true,
    },
    {
      face: Face.F,
      edge: 'top',
      reverse: false,
    },
    {
      face: Face.L,
      edge: 'right',
      reverse: true,
    },
  ],
  [Face.D]: [
    {
      face: Face.F,
      edge: 'bottom',
      reverse: true,
    },
    {
      face: Face.R,
      edge: 'left',
      reverse: false,
    },
    {
      face: Face.B,
      edge: 'bottom',
      reverse: true,
    },
    {
      face: Face.L,
      edge: 'left',
      reverse: false,
    },
  ],
  [Face.F]: [
    {
      face: Face.U,
      edge: 'top',
      reverse: true,
    },
    {
      face: Face.R,
      edge: 'top',
      reverse: false,
    },
    {
      face: Face.D,
      edge: 'top',
      reverse: true,
    },
    {
      face: Face.L,
      edge: 'top',
      reverse: false,
    },
  ],
  [Face.B]: [
    {
      face: Face.U,
      edge: 'bottom',
      reverse: false,
    },
    {
      face: Face.L,
      edge: 'bottom',
      reverse: true,
    },
    {
      face: Face.D,
      edge: 'bottom',
      reverse: false,
    },
    {
      face: Face.R,
      edge: 'bottom',
      reverse: true,
    },
  ],
};
