import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithoutPassword } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable({})
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  findUser(id: string): User | undefined {
    return this.users.find((user: User) => user.id === id);
  }

  createUser(userDto: CreateUserDto): UserWithoutPassword {
    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();
    this.users = [...this.users, newUser];

    const { password, ...userToReturn } = newUser;

    return userToReturn;
  }

  updateUserPassword(
    userToChange: User,
    newPassword: string,
  ): UserWithoutPassword {
    const updatedUser = userToChange;
    updatedUser.password = newPassword;
    updatedUser.version = userToChange.version + 1;
    updatedUser.updatedAt = new Date().getTime();
    this.users = this.users.map((user) => {
      if (user.id === updatedUser.id) {
        return updatedUser;
      }
      return user;
    });

    const { password, ...userToReturn } = updatedUser;

    return userToReturn;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user: User) => user.id !== id);
  }
}
