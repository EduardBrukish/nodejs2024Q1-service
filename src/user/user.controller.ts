import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CommonNotFoundException } from "../exception/not-found.exception"

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): string {
    return this.userService.getUsers()
  }

  @Get(':id')
  getUser(@Param('id') id: string): string {
    const user = this.userService.findUser(id)

    if(!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return `You are trying to get user by id: ${id}`
  } 
}