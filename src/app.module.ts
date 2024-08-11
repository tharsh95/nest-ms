import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { BlockController } from './block/block.controller';
import { BlockService } from './block/block.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ ttl: 15000, max: 15 }),
    PrismaModule,
    UserModule,
    BlockModule,
  ],
  controllers: [UserController, BlockController],
  providers: [UserService, BlockService],
})
export class AppModule {}
