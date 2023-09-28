import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';

import { getRMQConfig } from './configs/rmq.config';
import { getJwtConfig } from './configs/jwt.config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    JwtModule.registerAsync(getJwtConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
    ScheduleModule.forRoot(),
    PassportModule,
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
