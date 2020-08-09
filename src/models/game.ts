export interface IGame {
  id: string;
  firstPlayerName: string;
  secondPlayerName?: string;
  firstPlayerMoves?: number[];
  secondPlayerMoves?: number[];
  firstPlayerNumberOfWins?: number;
  secondPlayerNumberOfWins?: number;
  totalPlays?: number;
  nextTurn?: string;
}
export interface IDbSchema {
  games?: IGame[];
}
