import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";


@Injectable({})
export class UserService {
  private users: User[] = [];

  getUsers(): User[] {
    return this.users
  }

  findUser(id: string): User | undefined {
    return this.users.find((user: User) => user.id === id)
  }
}