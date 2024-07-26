import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.split(' ')[1];

    const payload = await this.authService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = payload;
    return true;
  }
}
