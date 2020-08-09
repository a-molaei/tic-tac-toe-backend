import { Injectable } from '@nestjs/common';
import { IGame } from 'src/models/game';
import { database } from '../database/db';

@Injectable()
export class DatabaseService {
  readOpenGames(): IGame[] {
    const openGames: IGame[] = database.data.games?.filter(
      g => g.secondPlayerName == null,
    );
    return openGames;
  }
  createGame(firstPlayerName: string): void {
    const gameId: string = Math.random()
      .toString(36)
      .substr(2, 9);
    const newGame: IGame = {
      id: gameId,
      firstPlayerName: firstPlayerName,
      firstPlayerMoves: [],
      secondPlayerMoves: [],
      firstPlayerNumberOfWins: 0,
      secondPlayerNumberOfWins: 0,
      totalPlays: 0,
      nextTurn: firstPlayerName,
    };
    database.data.games.push(newGame);
  }
  joinGame(gameId: string, secondPlayerName: string): void {
    const existingGame: IGame = database.data.games.find(g => g.id == gameId);
    existingGame.secondPlayerName = secondPlayerName;
  }
  getGameById(gameId: string): IGame {
    const game: IGame = database.data.games.find(g => g.id == gameId);
    return game;
  }
  setPlayerMove(gameId: string, playerName: string, position: number): void {
    const game: IGame = database.data.games.find(g => g.id == gameId);
    if (playerName == game.firstPlayerName) {
      game.firstPlayerMoves.push(position);
      game.nextTurn = game.secondPlayerName;
    }
    if (playerName == game.secondPlayerName) {
      game.secondPlayerMoves.push(position);
      game.nextTurn = game.firstPlayerName;
    }
  }
  increaseNumberOfWins(gameId: string, playerName: string): void {
    const game: IGame = database.data.games.find(g => g.id == gameId);
    if (playerName == game.firstPlayerName) game.firstPlayerNumberOfWins += 1;
    if (playerName == game.secondPlayerName) game.secondPlayerName += 1;
  }
  increaseNumberOfAllPlayes(gameId: string): void {
    const game: IGame = database.data.games.find(g => g.id == gameId);
    game.totalPlays += 1;
  }
  resetGame(gameId: string): void {
    const game: IGame = database.data.games.find(g => g.id == gameId);
    game.firstPlayerMoves = [];
    game.secondPlayerMoves = [];
  }
}
