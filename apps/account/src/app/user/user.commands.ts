import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { AccountChangeProfile } from '@purpleschool/contracts';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRespository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async userInfo(
    @Body() { user, id }: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    const existingUser = await this.userRespository.findUserById(id);

    if (!existingUser) {
      throw new Error('Такого пользователя не существует');
    }

    const userEntity = new UserEntity(existingUser).updateProfile(
      user.displayName
    );
    await this.userRespository.updateUser(userEntity);

    return {};
  }
}
