import { adjacentEdgesMap, EdgePosition } from './edges';
import { Color, Face } from './enums';

export const DEFAULT_CUBE_COLORS: Record<Face, Color> = {
  [Face.R]: Color.RED,
  [Face.L]: Color.BLUE,
  [Face.U]: Color.GREEN,
  [Face.D]: Color.YELLOW,
  [Face.F]: Color.ORANGE,
  [Face.B]: Color.WHITE,
};

export class CubeStatus {
  faceColors: Record<Face, Color[][]>;

  constructor() {
    this.faceColors = this.createCubeColors(3);
  }

  private createCubeColors(size: number): Record<Face, Color[][]> {
    const createCubeFace = (face: Face) =>
      Array.from({ length: size }, () =>
        Array.from({ length: size }, () => DEFAULT_CUBE_COLORS[face]),
      );

    return {
      [Face.R]: createCubeFace(Face.R),
      [Face.L]: createCubeFace(Face.L),
      [Face.U]: createCubeFace(Face.U),
      [Face.D]: createCubeFace(Face.D),
      [Face.F]: createCubeFace(Face.F),
      [Face.B]: createCubeFace(Face.B),
    };
  }

  rotateCubeFace(face: Face, clockwise: boolean) {
    const currentColors = this.faceColors[face];
    const isOpposite = face === Face.L || face === Face.U || face === Face.B;

    const rotatedColors = this.rotateMatrix(
      currentColors,
      isOpposite ? !clockwise : clockwise,
    );

    this.faceColors[face] = rotatedColors;

    const adjEdges = adjacentEdgesMap[face];

    const edges: Color[][] = adjEdges.map(({ face, edge, reverse }) => {
      let edgeColors = this.getEdgeColors(face, edge);
      const edgeReverse = clockwise ? reverse : !reverse;
      if (edgeReverse) edgeColors = edgeColors.slice().reverse();
      return edgeColors;
    });

    adjEdges.forEach(({ face, edge }, idx) => {
      const fromIdx = (idx + (clockwise ? 3 : 1)) % 4;
      const fromEdgeColors = edges[fromIdx];
      this.setEdgeColors(face, edge, fromEdgeColors);
    });
  }

  private rotateMatrix(matrix: Color[][], clockwise: boolean) {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array.from({ length: N }));

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (clockwise) result[j][N - 1 - i] = matrix[i][j];
        else result[N - 1 - j][i] = matrix[i][j];
      }
    }
    return result as Color[][];
  }

  private getEdgeColors(face: Face, edge: EdgePosition) {
    const matrix = this.faceColors[face];
    const N = matrix.length;
    const colors: Color[] = [];

    for (let i = 0; i < N; i++) {
      switch (edge) {
        case 'top':
          colors.push(matrix[i][N - 1]);
          break;
        case 'bottom':
          colors.push(matrix[i][0]);
          break;
        case 'left':
          colors.push(matrix[0][i]);
          break;
        case 'right':
          colors.push(matrix[N - 1][i]);
          break;
      }
    }

    return colors;
  }

  private setEdgeColors(face: Face, edge: EdgePosition, colors: Color[]) {
    const matrix = this.faceColors[face];
    const N = matrix.length;
    for (let i = 0; i < N; i++) {
      switch (edge) {
        case 'top':
          matrix[i][N - 1] = colors[i];
          break;
        case 'bottom':
          matrix[i][0] = colors[i];
          break;
        case 'left':
          matrix[0][i] = colors[i];
          break;
        case 'right':
          matrix[N - 1][i] = colors[i];
          break;
      }
    }
  }
}
