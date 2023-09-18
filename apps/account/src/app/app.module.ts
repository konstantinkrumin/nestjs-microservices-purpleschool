import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule } from 'nestjs-rmq';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { getRMQConfig } from './configs/rmq.config';
import { getMongoConfig } from './configs/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    MongooseModule.forRootAsync(getMongoConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
