import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { getJwtConfig } from '../configs/jwt.config';

@Module({
  imports: [UserModule, JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
