import { UserEventEmitter } from './user.event-emitter';
import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { IUser } from '@purpleschool/interfaces';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Injectable()
export class UserService {
  constructor(
    private readonly userRespository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) {}

  public async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existingUser = await this.userRespository.findUserById(id);

    if (!existingUser) {
      throw new Error('Такого пользователя не существует');
    }

    const userEntity = new UserEntity(existingUser).updateProfile(
      user.displayName
    );
    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const existingUser = await this.userRespository.findUserById(userId);

    if (!existingUser) {
      throw new Error('Такого пользователя нет');
    }

    const userEntity = new UserEntity(existingUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();
    await this.updateUser(user);
    return { paymentLink };
  }

  public async checkPayment(userId: string, courseId: string) {
    const existingUser = await this.userRespository.findUserById(userId);

    if (!existingUser) {
      throw new Error('Такого пользователя нет');
    }

    const userEntity = new UserEntity(existingUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.updateUser(user);
    return { status };
  }

  private updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRespository.updateUser(user),
    ]);
  }
}
