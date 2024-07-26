import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'id',
    required: false,
    default: null,
  })
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'name',
    required: true,
    default: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'email',
    required: true,
    default: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    default: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
