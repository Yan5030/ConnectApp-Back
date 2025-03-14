// src/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto} from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, 
    private readonly configService: ConfigService
  ) {}


  async generateToken(user: { id: string; email: string }) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      }
    );
  }
  async register(registerDto: RegisterDto) {
    const { name, email, password, birthday } = registerDto;
    
    const existingUser = await this.userRepository.findOne({where: {email} })
      if (existingUser) {
        throw new BadRequestException ('Email is already in use')
      }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = this.userRepository.create({ name, email, password: hashedPassword,birthday });
    await this.userRepository.save(user);
    
    return {
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new Error('Invalid credentials');
  //   }
    
  //   const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  //   const token = await new SignJWT({ id: user.id, email: user.email })
  //     .setProtectedHeader({ alg: 'HS256' })
  //     .setIssuedAt()
  //     .setExpirationTime('1h')
  //     .sign(secret);
    
  //   return {
  //     success: true,
  //     message: 'Login successful',
  //     user: { id: user.id, name: user.name, email: user.email, token },
  //   };
  // }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
  
    // Delegamos la generación del token a AuthService
    const token = await this.generateToken(user);
  
    return {
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, token },
    };
  }
}
