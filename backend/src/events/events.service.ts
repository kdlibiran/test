import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  emitToAll<T = unknown>(event: string, payload: T) {
    this.eventsGateway.emitToAll(event, payload);
  }

  emitToUser<T = unknown>(userId: string, event: string, payload: T) {
    this.eventsGateway.emitToUser(userId, event, payload);
  }
}