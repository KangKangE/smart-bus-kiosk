// Vercel 서버리스 함수 — TAGO 정류장/노선 검색 (정류장 nodeId 찾기용)
//
// 사용법:
//   /api/find-station?cityCode=31010&name=성균관대     → 이름으로 정류장 검색 (버스정류소정보 서비스 필요)
//   /api/find-station?cityCode=31010&routeNo=92        → 노선번호로 노선 검색 (버스노선정보 서비스)
//   /api/find-station?cityCode=31010&routeId=GGB...    → 해당 노선의 경유 정류장 목록 (버스노선정보 서비스)
//   /api/find-station                                  → 전국 도시코드 목록 (버스노선정보 서비스)
export default async function handler(req, res) {
  const key = (process.env.BUS_API_KEY || "").trim();
  if (!key) {
    res.status(500).json({ error: "BUS_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }
  const serviceKey = key.includes("%") ? key : encodeURIComponent(key);
  const { cityCode, name, routeNo, routeId } = req.query;
  const BASE = "http://apis.data.go.kr/1613000/";

  let url;
  if (cityCode && name) {
    url = BASE + "BusSttnInfoInqireService/getSttnNoList" +
      "?serviceKey=" + serviceKey +
      "&cityCode=" + encodeURIComponent(cityCode) +
      "&nodeNm=" + encodeURIComponent(name) +
      "&numOfRows=50&pageNo=1&_type=json";
  } else if (cityCode && routeNo) {
    url = BASE + "BusRouteInfoInqireService/getRouteNoList" +
      "?serviceKey=" + serviceKey +
      "&cityCode=" + encodeURIComponent(cityCode) +
      "&routeNo=" + encodeURIComponent(routeNo) +
      "&numOfRows=50&pageNo=1&_type=json";
  } else if (cityCode && routeId) {
    url = BASE + "BusRouteInfoInqireService/getRouteAcctoThrghSttnList" +
      "?serviceKey=" + serviceKey +
      "&cityCode=" + encodeURIComponent(cityCode) +
      "&routeId=" + encodeURIComponent(routeId) +
      "&numOfRows=300&pageNo=1&_type=json";
  } else {
    url = BASE + "BusRouteInfoInqireService/getCtyCodeList" +
      "?serviceKey=" + serviceKey + "&_type=json";
  }

  try {
    const data = await (await fetch(url)).json();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "TAGO API 호출 실패", detail: String(e) });
  }
}
