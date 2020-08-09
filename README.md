# Tic Tac Toe - Backend

The stack used in this project:
1. nodejs
2. nestjs
3. typescript
4. graphql
5. websocket

No database is used and the data is gone after the service is stopped. Although a database handler layer is written so that database can be easily added.

To make the project realtime, websocket is used. Users are added on connection event by their name and deleted on disconnection event. Then cleints must listen to events that are emitted in code to take proper actions (in this solution user names must be unique otherwise a single-targeted message will be sent to all users with similar names although it can be redesigned).

Dependecy injection is used in `game.resolver` to inject different services.

The endpoint of the service is:  
http://localhost:3000/graphql

### functions

Create new game  
```mutation{ createGame(firstPlayerName: "{name}") }```

Get list of open games so that the second player can choose which one to join   
```
query { getOpenGames { 
                id, 
                firstPlayerName
                } }
```

Joining a created game (the gameId can be obtained from the `getOpenGames` response)    
```mutation{ joinGame(gameId: "{gameId}", secondPlayerName: "{name}") }```

Getting the entire game object by id  
```
query { getGameById(gameId: "{gameId}") { 
                        id,
                        firstPlayerName, 
                        secondPlayerName, 
                        secondPlayerMoves, 
                        firstPlayerMoves, 
                        firstPlayerNumberOfWins, 
                        totalPlays, 
                        secondPlayerNumberOfWins,
                        nextTurn } }
```

Move function is used to play the game. This function will be used until the game is finished.     
```
mutation { move(gameId: "{gameId}",
           playerName: "{firstOrSecondPlayerName}", 
           position: {positionNumber}) }
```  
Note: Position number must be a number between 1 to 9 (according to the following board).
```  
board:
  1   2   3
  4   5   6
  7   8   9
```


This function is used to restart the game:  
```mutation { resetGame(gameId: "{gameId}") }```