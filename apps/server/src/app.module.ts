import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionsModule } from './missions/missions.module'; // ✅ 기존 모듈
import { UsersModule } from './users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',      // DBeaver랑 똑같이
      port: 5432,
      username: 'postgres',   // 설치 시 만든 유저명
      password: '1234',     // 설치 시 만든 비번
      database: 'testdb',     // 아까 만든 DB
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: true,      // 개발용: 자동 테이블 생성
    }),
    MissionsModule,
    UsersModule,
    AuthModule, // 기존 모듈 그대로
  ],
})
export class AppModule {}
