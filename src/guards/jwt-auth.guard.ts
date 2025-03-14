import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    console.log('Usuario autenticado:', user);
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return user;
  }
}
