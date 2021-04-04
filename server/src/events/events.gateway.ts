import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { SocketService } from '../socket/socket.service';

@WebSocketGateway(3002)
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private static readonly logger = new Logger(EventsGateway.name);
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    EventsGateway.logger.debug(`WebSocketGateway afterInit`);
    this.socketService.socket = server;
  }

  handleConnection() {
    EventsGateway.logger.debug(`handleConnection`);
  }

  handleDisconnect() {
    EventsGateway.logger.debug(`handleDisconnect`);
  }

  @SubscribeMessage('newJobId')
  handleMessage(client, data) {
    EventsGateway.logger.debug(`newJobId ${data}`);
    return {
      event: 'gotNewJobId',
      data,
    };
  }
}
