// Vercel 서버리스 함수 — TAGO 정류장 검색 (정류장 nodeId 찾기용)
// 사용 전: 공공데이터포털에서 「국토교통부_(TAGO)_버스정류소정보」 활용신청 필요
//
// 사용법:
//   /api/find-station?cityCode=31010&name=성균관대   → 이름으로 정류장 검색 (nodeId 확인)
//   /api/find-station                                → 전국 도시코드 목록 조회
export default async function handler(req, res) {
  const key = (process.env.BUS_API_KEY || "").trim();
  if (!key) {
    res.status(500).json({ error: "BUS_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }
  const serviceKey = key.includes("%") ? key : encodeURIComponent(key);
  const { cityCode, name } = req.query;

  let url;
  if (cityCode && name) {
    url =
      "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList" +
      "?serviceKey=" + serviceKey +
      "&cityCode=" + encodeURIComponent(cityCode) +
      "&nodeNm=" + encodeURIComponent(name) +
      "&numOfRows=30&pageNo=1&_type=json";
  } else {
    url =
      "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCtyCodeList" +
      "?serviceKey=" + serviceKey + "&_type=json";
  }

  try {
    const data = await (await fetch(url)).json();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: "TAGO 정류소 API 호출 실패", detail: String(e) });
  }
}
