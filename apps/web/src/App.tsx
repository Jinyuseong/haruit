// apps/web/src/App.tsx
import { useEffect, useMemo, useState, type FormEvent } from "react";

type Category = "today" | "daily";
type Mission = { id: number; text: string; exp: number; done: boolean; category: Category };

const API = "http://localhost:3000/api";

export default function App() {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [error, setError] = useState("");

  // 추가 폼 상태
  const [showForm, setShowForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [newExp, setNewExp] = useState<number>(5);
  const [newCategory, setNewCategory] = useState<Category>("today");

  const resetForm = () => {
    setNewText("");
    setNewExp(5);
    setNewCategory("today");
  };

  // 목록 불러오기
  const load = async () => {
    try {
      const res = await fetch(`${API}/missions`);
      if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
      const data = (await res.json()) as Mission[];
      setMissions(data);
    } catch (e: any) {
      setError(String(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 완료 토글
  const toggle = async (id: number) => {
    try {
      // 낙관적 업데이트
      setMissions((prev) =>
        prev ? prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)) : prev
      );

      const res = await fetch(`${API}/missions/${id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
      const updated = (await res.json()) as Mission;

      // 서버 값으로 동기화
      setMissions((prev) =>
        prev ? prev.map((m) => (m.id === id ? updated : m)) : prev
      );
    } catch (e: any) {
      setError(String(e));
      load(); // 실패 시 원복
    }
  };

  // 생성
  const createMission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = {
        text: newText.trim(),
        exp: Number(newExp),
        category: newCategory,
      };
      if (!body.text || Number.isNaN(body.exp)) {
        alert("내용과 exp를 확인해줘!");
        return;
      }
      const res = await fetch(`${API}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`서버 응답 오류: ${res.status}`);
      const created = (await res.json()) as Mission;
      setMissions((prev) => (prev ? [created, ...prev] : [created]));
      resetForm();
      setShowForm(false);
    } catch (e: any) {
      setError(String(e));
    }
  };

  const todayList = useMemo(() => (missions || []).filter((m) => m.category === "today"), [missions]);
  const dailyList = useMemo(() => (missions || []).filter((m) => m.category === "daily"), [missions]);

  if (error) return <div style={{ padding: 24 }}>에러: {error}</div>;
  if (!missions) return <div style={{ padding: 24 }}>불러오는 중...</div>;

  return (
    <div style={{ padding: 20, paddingBottom: 80, fontFamily: "system-ui" }}>
      {/* 상단 방 영역 */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          height: 200,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          gap: 12,
          background: "#f8fafc",
        }}
      >
        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <div style={{ width: 40, height: 60, border: "2px solid #94a3b8", borderRadius: 4 }} />
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>가구</div>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "3px solid #334155",
              display: "inline-block",
              background: "#e2e8f0",
            }}
          />
          <div style={{ fontWeight: 700, marginTop: 8 }}>하루 하나</div>
        </div>

        <div style={{ justifySelf: "center", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "2px dashed #94a3b8", borderRadius: 8 }} />
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>소품</div>
        </div>
      </div>

      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>— 하루 할 일 —</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#0ea5e9",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          + 추가
        </button>
      </div>

      {/* 추가 폼 */}
      {showForm && (
        <form onSubmit={createMission} style={{ marginTop: 12, display: "grid", gap: 8, maxWidth: 420 }}>
          <input
            placeholder="미션 내용 (예: 책 10페이지 읽기)"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
          />
          <input
            type="number"
            min={0}
            placeholder="경험치 (exp)"
            value={newExp}
            onChange={(e) => setNewExp(Number(e.target.value))}
            style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as Category)}
            style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 8 }}
          >
            <option value="today">오늘</option>
            <option value="daily">매일</option>
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#10b981", color: "#fff", fontWeight: 800 }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#e2e8f0", fontWeight: 800 }}
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 오늘의 할 일 */}
      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>오늘의 할 일 체크리스트</h2>
        <ul style={{ marginTop: 10, lineHeight: 1.9 }}>
          {todayList.map((m) => (
            <li key={m.id}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() => toggle(m.id)}
                  style={{ marginRight: 8 }}
                />
                <strong>[+{m.exp}xp]</strong> {m.text} {m.done ? "✅" : ""}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* 매일 해야하는 일 */}
      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>매일 해야하는 일 체크리스트</h2>
        <ul style={{ marginTop: 10, lineHeight: 1.9 }}>
          {dailyList.map((m) => (
            <li key={m.id}>
              <label style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() => toggle(m.id)}
                  style={{ marginRight: 8 }}
                />
                <strong>[+{m.exp}xp]</strong> {m.text} {m.done ? "✅" : ""}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* 하단 탭 */}
      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#f8fafc",
          borderTop: "1px solid #e5e7eb",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          height: 56,
        }}
      >
        {["공부", "코디", "Home/인테리어", "Shop"].map((label) => (
          <button
            key={label}
            style={{
              border: "none",
              background: "transparent",
              fontWeight: 700,
              color: "#334155",
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
