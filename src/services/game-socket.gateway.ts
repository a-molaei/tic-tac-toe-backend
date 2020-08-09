import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'socket' })
export class GameSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  public onlineUsers = {};
  handleConnection(@ConnectedSocket() client: Socket): void {
    const name: string = client.handshake.query.name;
    if (name) if (!(name in this.onlineUsers)) this.onlineUsers[name] = client;
  }
  handleDisconnect(@ConnectedSocket() client: Socket): void {
    const name: string = client.handshake.query.name;
    if (name) if (name in this.onlineUsers) delete this.onlineUsers[name];
  }
}
