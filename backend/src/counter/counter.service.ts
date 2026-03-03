import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';
import { CounterRepository } from './counter.repository';

@Injectable()
export class CounterService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly counterRepository: CounterRepository,
  ) {}

  async getCurrent(userId: number) {
    const counter = await this.counterRepository.getByUserId(userId);

    return { value: counter?.count ?? 0 };
  }

  async increment(userId: number) {
    const counter = await this.counterRepository.incrementForUser(userId);

    const payload = { value: counter.count };
    this.eventsService.emitToUser(String(userId), 'counter:total', payload);
    return payload;
  }

  async decrement(userId: number) {
    const counter = await this.counterRepository.decrementForUser(userId);

    const payload = { value: counter.count };
    this.eventsService.emitToUser(String(userId), 'counter:total', payload);
    return payload;
  }
}
