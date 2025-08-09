import { Injectable } from '@nestjs/common';

export type Category = 'today' | 'daily';

export interface Mission {
  id: number;
  text: string;
  exp: number;
  done: boolean;
  category: Category;
}

@Injectable()
export class MissionsService {
  private nextId = 4;

  // 데모 데이터
  private missions: Mission[] = [
    { id: 1, text: '책 10페이지 읽기', exp: 5, done: false, category: 'today' },
    { id: 2, text: '운동 10분 하기',   exp: 8, done: false, category: 'daily' },
    { id: 3, text: '감사일기 쓰기',     exp: 4, done: false, category: 'today' },
  ];

  findAll(): Mission[] {
    return this.missions;
  }

  toggleDone(id: number): Mission | undefined {
    const m = this.missions.find((x) => x.id === id);
    if (!m) return undefined;
    m.done = !m.done;
    return m;
  }

  // ✅ 추가: 생성
  create(text: string, exp: number, category: Category): Mission {
    const mission: Mission = {
      id: this.nextId++,
      text,
      exp,
      done: false,
      category,
    };
    this.missions.push(mission);
    return mission;
  }
}
