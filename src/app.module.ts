import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GameService } from './services/game.service';
import { DatabaseService } from './services/database.service';
import { GameSocketGateway } from './services/game-socket.gateway';
import { gameResolver } from './game.resolver';
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
  ],
  providers: [gameResolver, GameSocketGateway, GameService, DatabaseService],
})
export class AppModule {}
