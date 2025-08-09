import { Module } from '@nestjs/common';
import { MissionsModule } from './missions/missions.module'; // ✅ 경로/이름 확인

@Module({
  imports: [MissionsModule],
})
export class AppModule {}
