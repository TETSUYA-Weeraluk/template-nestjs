import { Injectable, UnauthorizedException } from '@nestjs/common';
import { comparePassword } from 'src/lib/bcrypt';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { DbService } from 'src/db/db.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  userSelect: Prisma.UserSelect = {
    id: true,
    email: true,
    passwordHash: true,
  };
  constructor(private db: DbService) {}

  async validateUser(email: string, password: string) {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
      select: this.userSelect,
    });

    if (user && comparePassword(password, user.passwordHash)) {
      return user;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordMatch = await comparePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      info: userWithoutPassword,
      token: token,
    };
  }

  async verifyToken(token: string) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
