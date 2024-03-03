import { Controller, Get, Delete, Param, UsePipes, ParseUUIDPipe, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CommonNotFoundException } from "../exception/not-found.exception"
import { User } from "./interfaces/user.interface"; 
import { CreateUserDto } from "./dto/user.dto";

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

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = this.userService.createUser(createUserDto);
    return newUser;
  }

  @Delete(':id')
  @UsePipes(ParseUUIDPipe)
  deleteUser(@Param('id') id: string): string {
    const user = this.userService.findUser(id)

    if(!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    this.userService.deleteUser(id)

    return `User with ID ${id} was deleted successfully`;
  } 
}