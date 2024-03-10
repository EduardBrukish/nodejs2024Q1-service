import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/user.entity';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUser(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();

    const user = await this.userRepository.create(newUser);
    return await this.userRepository.save(user);
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }

    const updatedUser = Object.assign({}, user);
    updatedUser.password = updatePasswordDto.newPassword;
    updatedUser.version = updatedUser.version + 1;
    updatedUser.updatedAt = new Date().getTime();

    return await this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
