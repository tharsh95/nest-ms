import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import * as jwt from 'jsonwebtoken';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search')
  searchUsers(
    @Headers('authorization') authorization: string,
    @Query('username') username?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
  ) {
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.decode(token) as unknown as { sub: number };
    const userId = decodedToken.sub;
    const minAgeInt = minAge ? parseInt(minAge, 10) : undefined;
    const maxAgeInt = maxAge ? parseInt(maxAge, 10) : undefined;
    return this.userService.searchUsers(
      +userId,
      username,
      minAgeInt,
      maxAgeInt,
    );
  }

  @Post('token')
  async generateToken(@Body('userId') userId: number) {
    const token = await this.userService.generateToken(userId);
    return { token };
  }

  @Post('create')
  create(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }

  @Get('getAll')
  getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    console.log(typeof id);
    return this.userService.getOne(+id);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto) {
    return this.userService.update(+id, dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
