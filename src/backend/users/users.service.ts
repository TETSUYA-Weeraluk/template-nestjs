import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';
import { Prisma } from '@prisma/client';
import { hashPassword } from 'src/lib/bcrypt';

@Injectable()
export class UsersService {
  private includeSelect: Prisma.UserSelect = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private db: DbService) {}

  create(createUserDto: CreateUserDto) {
    return this.db.$transaction(async (prisma: Prisma.TransactionClient) => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (findUser) {
        throw new BadRequestException('User already exists');
      }

      return prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: await hashPassword(createUserDto.password),
        },
        select: this.includeSelect,
      });
    });
  }

  findAll() {
    return this.db.user.findMany({
      select: this.includeSelect,
    });
  }

  findOne(id: string) {
    return this.db.user.findUnique({
      where: {
        id: id,
      },
      select: this.includeSelect,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.db.$transaction(async (prisma: Prisma.TransactionClient) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
        },
        select: this.includeSelect,
      });
    });
  }

  remove(id: string) {
    return this.db.$transaction(async (prisma: Prisma.TransactionClient) => {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return prisma.user.delete({
        where: {
          id: id,
        },
      });
    });
  }
}
