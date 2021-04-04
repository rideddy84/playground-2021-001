import { Injectable } from '@nestjs/common';
import { Server } from 'ws';

@Injectable()
export class SocketService {
  public socket: Server = null;
}
