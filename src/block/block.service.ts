import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(userId: number, blockedUserId: number) {
    if (userId === blockedUserId) {
      throw new ForbiddenException('User cannot block himself');
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.blockedUsers.includes(blockedUserId)) {
      throw new ForbiddenException(`User already Blocked by UserId ${userId}`);
    }
    const buser = await this.prisma.user.findUnique({
      where: { id: blockedUserId },
    });

    if (!buser) {
      throw new NotFoundException('Blocked user not exists');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        blockedUsers: {
          push: blockedUserId,
        },
      },
    });

    return { message: `User ${blockedUserId} blocked successfully.` };
  }

  async unblockUser(userId: number, bid: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const buser = await this.prisma.user.findUnique({
      where: { id: bid },
    });
    if (!buser) {
      throw new NotFoundException('Blocked User not exists');
    }
    if (!user.blockedUsers.includes(bid)) {
      throw new ForbiddenException(`User not in block list`);
    }
    const ubusers = user.blockedUsers.filter((id) => id !== bid);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        blockedUsers: ubusers,
      },
    });
    return { message: `User ${bid} unblocked successfully.` };
  }
}
