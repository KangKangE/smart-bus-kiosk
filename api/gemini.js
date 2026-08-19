// Vercel 서버리스 함수 — Gemini AI 프록시
// 키를 사이트 화면이 아니라 서버 환경변수로 관리합니다.
//
// 필요한 환경변수: GEMINI_API_KEY (aistudio.google.com/apikey 에서 발급)
//
// GET  /api/gemini  → { ok: true, configured: true/false }  (키 설정 여부 확인)
// POST /api/gemini  → Gemini generateContent 호출 결과 그대로 반환
const GEMINI_MODEL = "gemini-3.5-flash-lite";

export default async function handler(req, res) {
  const key = (process.env.GEMINI_API_KEY || "").trim();

  if (req.method === "GET") {
    res.status(200).json({ ok: true, configured: !!key });
    return;
  }

  if (!key) {
    res.status(500).json({ error: { message: "GEMINI_API_KEY 환경변수가 없습니다. Vercel Settings → Environment Variables에 등록하세요." } });
    return;
  }

  try {
    const upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(req.body)
      }
    );
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ error: { message: "Gemini 호출 실패: " + String(e) } });
  }
}
