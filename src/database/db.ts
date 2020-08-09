import { IDbSchema } from 'src/models/game';

// board:
//  1   2   3
//  4   5   6
//  7   8   9

export class GameDatabase {
  public data: IDbSchema = {
    games: [],
  };
  public validMoves: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public winningCases: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
}

export const database = new GameDatabase();
