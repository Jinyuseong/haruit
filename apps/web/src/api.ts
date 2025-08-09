// apps/web/src/api.ts
const BASE = "http://localhost:3000/api";

// 미션 목록
export async function fetchMissions() {
  const res = await fetch(`${BASE}/missions`);
  if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
  return res.json();
}

// 미션 완료 토글
export async function toggleMission(id: number) {
  const res = await fetch(`${BASE}/missions/${id}/toggle`, { method: "PATCH" });
  if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
  return res.json();
}
