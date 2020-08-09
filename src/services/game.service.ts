import { Injectable } from '@nestjs/common';
import { IGame } from 'src/models/game';
import { database } from 'src/database/db';

@Injectable()
export class GameService {
  isMoveValid(position: number, game: IGame): boolean {
    if (!database.validMoves.includes(position)) return false;
    if (game.firstPlayerMoves?.includes(position)) return false;
    if (game.secondPlayerMoves?.includes(position)) return false;
    return true;
  }
  isPlayerInGame(playerName: string, game: IGame): boolean {
    if (
      game.firstPlayerName != playerName &&
      game.secondPlayerName != playerName
    )
      return false;
    return true;
  }
  isGameEndedWithNoWinner(game: IGame): boolean {
    const numberOfAllMoves: number = database.validMoves.length;
    const numberOfFirstPlayerMoves: number = game.firstPlayerMoves.length;
    const numberOfSecondPlayerMoves: number = game.firstPlayerMoves.length;

    if (
      numberOfFirstPlayerMoves + numberOfSecondPlayerMoves >=
      numberOfAllMoves
    )
      return true;
    return false;
  }

  getWinner(game: IGame): string {
    for (const winCase of database.winningCases) {
      if (winCase.every(p => game.firstPlayerMoves.includes(p)))
        return game.firstPlayerName;
      if (winCase.every(p => game.secondPlayerMoves.includes(p)))
        return game.secondPlayerName;
    }
    return null;
  }
  canGameContinue(game: IGame): boolean {
    if (this.isGameEndedWithNoWinner(game)) return false;
    if (this.getWinner(game) != null) return false;
    return true;
  }
}
