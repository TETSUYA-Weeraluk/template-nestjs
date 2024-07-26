import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGaurd } from 'src/guard/auth-gaurd.guard';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'User created' })
  @ApiOperation({
    description: '### This API use for create User',
    summary: 'Create user',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOkResponse({ description: 'Get list user' })
  @ApiOperation({
    description: '### This API use for get list user',
    summary: 'Get list user',
  })
  @UseGuards(AuthGaurd)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ description: 'User find' })
  @ApiOperation({
    description: '### This API use for find User',
    summary: 'Find user',
  })
  @UseGuards(AuthGaurd)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOkResponse({ description: 'User updated' })
  @ApiOperation({
    description: '### This API use for update User',
    summary: 'Update user',
  })
  @UseGuards(AuthGaurd)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOkResponse({ description: 'User deleted' })
  @ApiOperation({
    description: '### This API use for delete User',
    summary: 'Delete user',
  })
  @UseGuards(AuthGaurd)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
