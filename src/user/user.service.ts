import { Injectable } from "@nestjs/common";

@Injectable({})
export class UserService {
  getUsers() {
    return 'Users are here'
  }

  findUser(id: string): string | null {
    return null
  }
}