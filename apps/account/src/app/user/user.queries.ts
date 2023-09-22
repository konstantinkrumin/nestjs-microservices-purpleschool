import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { AccountUserCourses, AccountUserInfo } from '@purpleschool/contracts';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserQueries {
  constructor(private readonly userRespository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(
    @Body() { id }: AccountUserInfo.Request
  ): Promise<AccountUserInfo.Response> {
    const user = await this.userRespository.findUserById(id);
    return { user };
  }

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userCourses(
    @Body() { id }: AccountUserCourses.Request
  ): Promise<AccountUserCourses.Response> {
    const user = await this.userRespository.findUserById(id);
    return { courses: user.courses };
  }
}
