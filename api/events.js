// Vercel 서버리스 함수 — 이벤트 개별 조회/삭제 (관리자용, Supabase)
//   GET    /api/events?limit=60&device=dev-xxx&type=rating  → 최근 기록 목록
//   DELETE /api/events?id=123                               → 한 건 삭제
export default async function handler(req, res) {
  const url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const key = (process.env.SUPABASE_SERVICE_KEY || "").trim();
  if (!url || !key) {
    res.status(200).json({ ok: false, error: "SUPABASE_URL / SUPABASE_SERVICE_KEY 환경변수가 없습니다." });
    return;
  }
  const headers = { apikey: key, Authorization: "Bearer " + key };

  try {
    if (req.method === "DELETE") {
      const id = String(req.query.id || "").replace(/[^0-9]/g, "");
      if (!id) { res.status(400).json({ ok: false, error: "id가 필요합니다." }); return; }
      const r = await fetch(url + "/rest/v1/events?id=eq." + id, {
        method: "DELETE",
        headers: Object.assign({ Prefer: "return=minimal" }, headers)
      });
      res.status(200).json({ ok: r.ok, status: r.status });
      return;
    }

    // GET: 최근 기록 목록
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 60));
    let q = "/rest/v1/events?select=id,created_at,device_id,session_id,lang,event_type,payload" +
      "&order=created_at.desc&limit=" + limit;
    if (req.query.device) q += "&device_id=eq." + encodeURIComponent(req.query.device);
    if (req.query.type) q += "&event_type=eq." + encodeURIComponent(req.query.type);
    const r = await fetch(url + q, { headers });
    if (!r.ok) throw new Error("Supabase 조회 실패: HTTP " + r.status);
    res.status(200).json({ ok: true, events: await r.json() });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
