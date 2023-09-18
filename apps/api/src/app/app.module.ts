import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { getRMQConfig } from './configs/rmq.config';
import { getJwtConfig } from './configs/jwt.config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJwtConfig()),
    PassportModule,
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
