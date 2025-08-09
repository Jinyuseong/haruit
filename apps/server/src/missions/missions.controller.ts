import { Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { MissionsService } from './missions.service';
import type { Mission, Category } from './missions.service';

type CreateMissionDto = {
  text: string;
  exp: number;
  category: Category; // 'today' | 'daily'
};

@Controller('missions') // => /api/missions
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  getMissions(): Mission[] {
    return this.missionsService.findAll();
  }

  @Patch(':id/toggle')
  toggleMission(@Param('id') id: string) {
    const updated = this.missionsService.toggleDone(Number(id));
    if (!updated) throw new Error('Mission not found');
    return updated;
  }

  // ✅ 추가: POST /api/missions
  @Post()
  createMission(@Body() body: CreateMissionDto) {
    const { text, exp, category } = body ?? {};
    if (!text || typeof exp !== 'number' || !['today', 'daily'].includes(category as any)) {
      throw new Error('Invalid body');
    }
    return this.missionsService.create(text, exp, category);
  }
}
