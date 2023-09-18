import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AccountRegister } from '@purpleschool/contracts';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() userId: string) {}
}
