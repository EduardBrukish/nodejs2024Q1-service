import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { User } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/user.dto";


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

  deleteUser(id: string): void {
    this.users = this.users.filter((user: User) => user.id !== id)
  }
}