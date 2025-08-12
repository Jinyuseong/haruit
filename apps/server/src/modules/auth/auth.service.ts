import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, name: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, name, password: hashed },
    });
    return { message: '회원가입 성공', user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');

    return { message: '로그인 성공', user };
  }
}
