// Vercel 서버리스 함수 — 사용 데이터 로그 저장 (Supabase)
//
// 필요한 환경변수:
//   SUPABASE_URL         — Supabase 프로젝트 URL (https://xxxx.supabase.co)
//   SUPABASE_SERVICE_KEY — Supabase service_role 키 (Settings → API)
//
// 사전 준비: Supabase SQL Editor에서 events 테이블 생성 (README 참고)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST만 지원합니다." });
    return;
  }
  const url = (process.env.SUPABASE_URL || "").trim().replace(/\/$/, "");
  const key = (process.env.SUPABASE_SERVICE_KEY || "").trim();
  if (!url || !key) {
    res.status(200).json({ ok: false, error: "SUPABASE_URL / SUPABASE_SERVICE_KEY 환경변수가 없습니다." });
    return;
  }

  const b = req.body || {};
  const row = {
    device_id: String(b.deviceId || "").slice(0, 64),
    session_id: String(b.sessionId || "").slice(0, 64),
    lang: String(b.lang || "").slice(0, 8),
    event_type: String(b.type || "unknown").slice(0, 40),
    payload: (b.payload && typeof b.payload === "object") ? b.payload : {}
  };

  try {
    const r = await fetch(url + "/rest/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: "Bearer " + key,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row)
    });
    res.status(200).json({ ok: r.ok, status: r.status });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
}
