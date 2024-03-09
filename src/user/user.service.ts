import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entity/user.entity';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUser(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const newUser = {} as UserEntity;
    newUser.id = uuidv4();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();

    const user = this.userRepository.create(newUser);
    return await this.userRepository.save(user);
  }

  async updateUserPassword(
    id: string,
    newPassword: string,
  ): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return undefined;
    }

    const updatedUser = Object.assign({}, user);
    updatedUser.password = newPassword;
    updatedUser.version = updatedUser.version + 1;
    updatedUser.updatedAt = new Date().getTime();
    // this.users = this.users.map((user) => {
    //   if (user.id === updatedUser.id) {
    //     return updatedUser;
    //   }
    //   return user;
    // });

    // const { password, ...userToReturn } = updatedUser;

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
