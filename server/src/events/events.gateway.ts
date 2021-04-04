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

@WebSocketGateway(3002)
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private static readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    EventsGateway.logger.debug(`WebSocketGateway afterInit`);
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
