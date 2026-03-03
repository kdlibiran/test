import { Injectable } from '@nestjs/common';
import { prisma } from '../db';

@Injectable()
export class CounterRepository {
  getByUserId(userId: number) {
    return prisma.counter.findUnique({
      where: { userId },
    });
  }

  async incrementForUser(userId: number) {
    return prisma.counter.upsert({
      where: { userId },
      update: { count: { increment: 1 } },
      create: { userId, count: 1 },
    });
  }

  async decrementForUser(userId: number) {
    return prisma.counter.upsert({
      where: { userId },
      update: { count: { decrement: 1 } },
      create: { userId, count: 0 },
    });
  }
}
