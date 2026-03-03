import { Injectable } from '@nestjs/common';
import { prisma } from '../db';

@Injectable()
export class AuthRepository {
  async findByEmail(email: string) {
    if (!email) {
      return null;
    }

    return prisma.user.findUnique({
      where: { email },
    });
  }

  createUser(name: string, email: string, passwordHash: string) {
    return prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
