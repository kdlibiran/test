import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { EventsModule } from '../events/events.module';
import { CounterRepository } from './counter.repository';

@Module({
  imports: [EventsModule],
  controllers: [CounterController],
  providers: [CounterService, CounterRepository],
})
export class CounterModule {}
