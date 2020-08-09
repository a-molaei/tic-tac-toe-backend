import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { GameSocketGateway } from './services/game-socket.gateway';
import { Socket } from 'socket.io';

import { IGame } from 'src/models/game';
import { GameService } from 'src/services/game.service';
import { DatabaseService } from 'src/services/database.service';

@Resolver()
export class gameResolver {
  // Injections
  constructor(
    private gateway: GameSocketGateway,
    private gameService: GameService,
    private dbService: DatabaseService,
  ) {}

  @Mutation('createGame')
  createGame(@Args('firstPlayerName') firstPlayerName: string): string {
    this.dbService.createGame(firstPlayerName);
    return 'game created';
  }

  @Query('getOpenGames')
  getOpenGames(): IGame[] {
    return this.dbService.readOpenGames();
  }

  @Query('getGameById')
  getGameById(@Args('gameId') gameId: string): IGame {
    return this.dbService.getGameById(gameId);
  }

  @Mutation('joinGame')
  joinGame(
    @Args('gameId') gameId: string,
    @Args('secondPlayerName') secondPlayerName: string,
  ): string {
    const game: IGame = this.dbService.getGameById(gameId);
    if (game.firstPlayerName == secondPlayerName)
      return "Your name must be different from the first player's name";

    this.dbService.joinGame(gameId, secondPlayerName);
    const firstPlayer: Socket = this.gateway.onlineUsers[game.firstPlayerName];
    firstPlayer?.emit('whoJoinedTheGame', secondPlayerName);

    return 'You successfully joined the game';
  }

  @Mutation('move')
  move(
    @Args('gameId') gameId: string,
    @Args('playerName') playerName: string,
    @Args('position') position: number,
  ): string {
    const game: IGame = this.dbService.getGameById(gameId);

    if (!this.gameService.isPlayerInGame(playerName, game))
      return 'You are not in this game!';

    if (!this.gameService.canGameContinue(game))
      return 'Game has finished. You need to restart the game!';

    if (!this.gameService.isMoveValid(position, game)) return 'invalid move';
    if (game.nextTurn != playerName) return 'Not your turn';

    this.dbService.setPlayerMove(gameId, playerName, position);

    const firstPlayerSocket: Socket = this.gateway.onlineUsers[
      game.firstPlayerName
    ];
    const secondPlayerSocket: Socket = this.gateway.onlineUsers[
      game.secondPlayerName
    ];
    firstPlayerSocket?.emit('newMove', {
      playerName: playerName,
      position: position,
    });
    secondPlayerSocket?.emit('newMove', {
      playerName: playerName,
      position: position,
    });

    if (this.gameService.isGameEndedWithNoWinner(game)) {
      firstPlayerSocket?.emit('gameEndedWithNoWinner');
      secondPlayerSocket?.emit('gameEndedWithNoWinner');
      this.dbService.increaseNumberOfAllPlayes(gameId);
      return 'Game ended with no winner';
    }

    const winner: string = this.gameService.getWinner(game);
    if (winner != null) {
      firstPlayerSocket?.emit('win', playerName);
      secondPlayerSocket?.emit('win', playerName);
      this.dbService.increaseNumberOfWins(gameId, winner);
      this.dbService.increaseNumberOfAllPlayes(gameId);
      return winner + ' won the game!';
    }

    return 'Done! Next turn: ' + game.nextTurn;
  }

  @Mutation('resetGame')
  resetGame(@Args('gameId') gameId: string): string {
    this.dbService.resetGame(gameId);
    return 'game restarted';
  }
}
