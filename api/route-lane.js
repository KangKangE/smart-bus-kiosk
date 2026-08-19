// Vercel 서버리스 함수 — 경로의 실제 선형(지도에 그릴 좌표들) 조회
// ODsay 길찾기 결과의 mapObj 값을 받아 loadLane API로 실제 경로 좌표를 가져옵니다.
//
// 사용법: /api/route-lane?mapObj=<searchPubTransPathT 결과의 info.mapObj>
// 응답: { ok: true, lanes: [{ points: [{x,y}, ...] }, ...] }  (대중교통 구간 순서대로)
export default async function handler(req, res) {
  const odsayKey = (process.env.ODSAY_API_KEY || "").trim();
  if (!odsayKey) {
    res.status(200).json({ ok: false, error: "ODSAY_API_KEY 환경변수가 없습니다." });
    return;
  }
  const { mapObj } = req.query;
  if (!mapObj) {
    res.status(400).json({ ok: false, error: "mapObj 파라미터가 필요합니다." });
    return;
  }

  try {
    const url =
      "https://api.odsay.com/v1/api/loadLane" +
      "?mapObject=" + encodeURIComponent("0:0@" + mapObj) +
      "&apiKey=" + encodeURIComponent(odsayKey);
    const data = await (await fetch(url, {
      headers: { Referer: "https://smart-bus-kiosk.vercel.app/" }
    })).json();

    if (data.error) {
      const e = Array.isArray(data.error) ? data.error[0] : data.error;
      throw new Error("ODsay: " + (e.msg || e.message || JSON.stringify(e)));
    }
    const rawLanes = (data.result && data.result.lane) || [];
    const lanes = rawLanes.map((lane) => ({
      type: lane.type,
      points: (lane.section || []).flatMap((sec) =>
        (sec.graphPos || []).map((g) => ({ x: g.x, y: g.y }))
      )
    })).filter((l) => l.points.length > 0);

    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json({ ok: true, lanes });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
