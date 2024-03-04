import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/createUser.dto";


@Injectable({})
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users
  }

  findUser(id: string): User | undefined {
    return this.users.find((user: User) => user.id === id)
  }

  createUser(userDto: CreateUserDto): User {
    const newUser = {} as User;
    newUser.id = uuidv4();
    newUser.login = userDto.login;
    newUser.password = userDto.password;
    newUser.version = 1;
    newUser.createdAt = new Date().getTime();
    newUser.updatedAt = new Date().getTime();
    this.users = [...this.users, newUser];

    return newUser;
  }

  updateUserPassword(userToChange: User, newPassword: string): User {
    const updatedUser = userToChange;
    updatedUser.password = newPassword;
    updatedUser.version = userToChange.version + 1;
    updatedUser.updatedAt = new Date().getTime();
    this.users = this.users.map((user) => {
      if(user.id === updatedUser.id) {
        return updatedUser;
      }
      return user;
    });

    return updatedUser;
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user: User) => user.id !== id)
  }
}