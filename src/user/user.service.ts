import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable({})
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly secretKey = 'your-secret-key';

  async create(dto: UserDto) {
    try {
      const data = await this.prisma.user.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          username: dto.username,
          birthdate: dto.birthdate,
        },
      });
      return data;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
    }
  }

  async generateToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = { sub: userId };

    const options = {
      expiresIn: '1h',
    };

    const token = jwt.sign(payload, this.secretKey, options);

    return token;
  }
  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return user;
  }
  async update(id: number, dto: UserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          name: dto.name,
          surname: dto.surname,
          username: dto.username,
          birthdate: dto.birthdate,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      if (e.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
      if (e.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return { msg: 'Deleted User Successfully' };
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async searchUsers(
    userId: number,
    username?: string,
    minAge?: number,
    maxAge?: number,
  ) {
    const now = new Date();
    const whereClause: Prisma.UserWhereInput = {};

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blockedUsers: true },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    if (username) {
      whereClause.username = {
        contains: username,
      };
    }
    if (minAge !== undefined || maxAge !== undefined) {
      const dateConditions: Prisma.DateTimeFilter = {};

      if (minAge !== undefined) {
        const minBirthdate = new Date(
          now.getFullYear() - minAge,
          now.getMonth(),
          now.getDate(),
        );
        dateConditions.lte = minBirthdate;
      }

      if (maxAge !== undefined) {
        const maxBirthdate = new Date(
          now.getFullYear() - maxAge,
          now.getMonth(),
          now.getDate(),
        );
        console.log(maxBirthdate);
        dateConditions.gte = maxBirthdate; // Users born on or after this date
      }
      whereClause.birthdate = dateConditions;
    }
    if (currentUser.blockedUsers.length > 0) {
      whereClause.id = {
        notIn: currentUser.blockedUsers,
      };
    }
    const users = await this.prisma.user.findMany({
      where: whereClause,
    });

    return users;
  }
}
