import {
  Controller,
  Get,
  Delete,
  Param,
  UsePipes,
  ParseUUIDPipe,
  Body,
  Post,
  Put,
  HttpException,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiNotFoundResponse, ApiBadRequestResponse, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonNotFoundException } from '../exception/not-found.exception';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [UserDto] })
  getUsers(): User[] {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'The record has been successfully created.', type: UserDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({description: 'User with ID ${id} not found'})
  @UsePipes(ParseUUIDPipe)
  getUser(@Param('id') id: string): User {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Post()
  @ApiCreatedResponse({ description: 'The user has been successfully created.', type: UserDto})
  @ApiBadRequestResponse({ description: 'Body does not contain required fields' })
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): UserDto {
    const newUser = this.userService.createUser(createUserDto);
    return newUser;
  }

  @Put(':id')
  @ApiOkResponse({ description: 'The record has been successfully updated.', type: UserDto })
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({description: 'User with ID ${id} not found'})
  @ApiForbiddenResponse ({description: 'Wrong user password'})
  @UsePipes(new ValidationPipe())
  updateUserPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserPasswordDto: UpdatePasswordDto,
  ): UserDto {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserPasswordDto.oldPassword !== user.password) {
      throw new HttpException(`Wrong user password`, HttpStatus.FORBIDDEN);
    }

    const updatedUser = this.userService.updateUserPassword(
      user,
      updateUserPasswordDto.newPassword,
    );
    return updatedUser;
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'User with ID ${id} was deleted successfully'})
  @ApiBadRequestResponse({ description: 'Invalid Id' })
  @ApiNotFoundResponse({description: 'User with ID ${id} not found'})
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseUUIDPipe)
  deleteUser(@Param('id') id: string): string {
    const user = this.userService.findUser(id);

    if (!user) {
      throw new CommonNotFoundException(`User with ID ${id} not found`);
    }

    this.userService.deleteUser(id);

    return `User with ID ${id} was deleted successfully`;
  }
}
