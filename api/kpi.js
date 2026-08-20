// Vercel 서버리스 함수 — KPI 집계 (Supabase events 테이블)
// 최근 이벤트 최대 5,000건을 읽어 핵심 지표를 계산해 돌려줍니다.
export default async function handler(req, res) {
  const url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const key = (process.env.SUPABASE_SERVICE_KEY || "").trim();
  if (!url || !key) {
    res.status(200).json({ ok: false, error: "SUPABASE_URL / SUPABASE_SERVICE_KEY 환경변수가 없습니다." });
    return;
  }

  try {
    const r = await fetch(
      url + "/rest/v1/events?select=created_at,session_id,lang,event_type,payload&order=created_at.desc&limit=5000",
      { headers: { apikey: key, Authorization: "Bearer " + key } }
    );
    if (!r.ok) throw new Error("Supabase 조회 실패: HTTP " + r.status);
    const rows = await r.json();

    const count = (t) => rows.filter((e) => e.event_type === t).length;
    const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null);
    const avg = (arr) => (arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : null);
    const tally = (list) => {
      const m = {};
      list.forEach((k) => { if (k) m[k] = (m[k] || 0) + 1; });
      return Object.entries(m).sort((a, b) => b[1] - a[1]);
    };

    const sessions = new Set(rows.map((e) => e.session_id)).size;
    const voiceOk = rows.filter((e) => e.event_type === "voice_result");
    const voiceErr = count("voice_error");
    const confs = voiceOk
      .map((e) => Number(e.payload && e.payload.confidence))
      .filter((n) => isFinite(n) && n > 0);

    const aiRows = rows.filter((e) => e.event_type === "ai_intent");
    const aiMs = aiRows.map((e) => Number(e.payload && e.payload.ms)).filter((n) => isFinite(n));
    const aiFallback = count("ai_fallback");

    const rs = count("route_search");
    const rf = count("route_search_fail");
    const selects = rows.filter((e) => e.event_type === "route_select");
    const selTop = selects.filter((e) => Number(e.payload && e.payload.index) === 0).length;

    const ratingRows = rows.filter((e) => e.event_type === "rating");
    const stars = ratingRows
      .map((e) => Number(e.payload && e.payload.stars))
      .filter((n) => isFinite(n) && n >= 1 && n <= 5);
    const starDist = [1, 2, 3, 4, 5].map((n) => stars.filter((s) => s === n).length);
    const comments = ratingRows
      .map((e) => e.payload && e.payload.comment)
      .filter((c) => c && String(c).trim())
      .slice(0, 20);

    const langs = tally(rows.filter((e) => e.event_type === "language_select").map((e) => e.payload && e.payload.selected));
    const dests = tally(rows.filter((e) => e.event_type === "route_search").map((e) => e.payload && e.payload.found)).slice(0, 5);
    const idles = tally(rows.filter((e) => e.event_type === "idle_timeout").map((e) => e.payload && e.payload.screen));

    res.status(200).json({
      ok: true,
      kpi: {
        totalEvents: rows.length,
        sessions,
        period: rows.length ? { from: rows[rows.length - 1].created_at, to: rows[0].created_at } : null,
        voice: {
          attempts: voiceOk.length + voiceErr,
          success: voiceOk.length,
          successRate: pct(voiceOk.length, voiceOk.length + voiceErr),
          avgConfidence: confs.length ? Math.round(avg(confs) * 100) : null
        },
        ai: {
          calls: aiRows.length,
          avgMs: aiMs.length ? Math.round(avg(aiMs)) : null,
          fallback: aiFallback,
          fallbackRate: pct(aiFallback, aiRows.length + aiFallback)
        },
        route: {
          searches: rs,
          fails: rf,
          successRate: pct(rs, rs + rf),
          selects: selects.length,
          topPickRate: pct(selTop, selects.length)
        },
        rating: {
          count: stars.length,
          avg: stars.length ? Math.round(avg(stars) * 100) / 100 : null,
          dist: starDist,
          comments: comments
        },
        langs,
        dests,
        idles
      }
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
