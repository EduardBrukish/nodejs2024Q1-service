import { Controller, Get, Param, UsePipes, ParseUUIDPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CommonNotFoundException } from "../exception/not-found.exception"
import { User } from "./interfaces/user.interface"; 

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): User[] {
    return this.userService.getUsers()
  }

  @Get(':id')
  @UsePipes(ParseUUIDPipe)
  getUser(@Param('id') id: string): User {
    const user = this.userService.findUser(id)

    if(!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  } 
}