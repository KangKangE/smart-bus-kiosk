// Vercel 서버리스 함수 — 서울시 버스 도착정보 프록시
// 공공데이터포털 API는 브라우저에서 직접 호출하면 CORS로 차단되고 키가 노출되므로
// 이 함수가 중간에서 대신 호출해 줍니다.
//
// 사용 전 준비:
//   Vercel 대시보드 → Settings → Environment Variables 에
//   BUS_API_KEY = 공공데이터포털 "일반 인증키(Decoding)" 값 등록
//
// 호출 예: /api/arrivals?arsId=01120  (arsId = 정류장 ARS 번호, 하이픈 제외)
export default async function handler(req, res) {
  const arsId = String(req.query.arsId || "").replace(/[^0-9]/g, "");
  if (!arsId) {
    res.status(400).json({ error: "arsId 쿼리 파라미터가 필요합니다. 예: /api/arrivals?arsId=01120" });
    return;
  }
  if (!process.env.BUS_API_KEY) {
    res.status(500).json({ error: "BUS_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }

  // 키가 이미 URL 인코딩된 형태(Encoding 키, % 포함)면 그대로 쓰고,
  // Decoding 키면 인코딩해서 사용 — 어느 쪽을 넣어도 동작하게 처리
  const rawKey = process.env.BUS_API_KEY.trim();
  const serviceKey = rawKey.includes("%") ? rawKey : encodeURIComponent(rawKey);

  const url =
    "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid" +
    "?serviceKey=" + serviceKey +
    "&arsId=" + arsId +
    "&resultType=json";

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    // 15초 캐시 — 같은 정류장을 여러 사람이 봐도 API 호출 횟수를 아낌
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "버스 API 호출에 실패했습니다.", detail: String(e) });
  }
}
