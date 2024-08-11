import {
  Controller,
  Param,
  Headers,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { BlockService } from './block.service';
import * as jwt from 'jsonwebtoken';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('block')
@UseInterceptors(CacheInterceptor)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get('/:blockedUserId')
  async blockUser(
    @Param('blockedUserId') blockedUserId: number,
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.decode(token) as unknown as { sub: number };

    const userId = decodedToken.sub;
    return this.blockService.blockUser(+userId, +blockedUserId);
  }

  @Get('unblock/:blockedUserId')
  async unblockUser(
    @Param('blockedUserId') blockedUserId: number,
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as unknown as { sub: number };
    const userId = decodedToken.sub;
    return this.blockService.unblockUser(+userId, +blockedUserId);
  }
}
