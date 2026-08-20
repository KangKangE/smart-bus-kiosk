// Vercel 서버리스 함수 — TAGO 정류장/도시/노선 검색
//
// 사용법:
//   /api/find-station                                → 전국 도시 목록  { ok, cities:[{code,name}] }
//   /api/find-station?cityCode=31010&name=성균관대   → 정류장 이름 검색 { ok, stations:[{nodeId,name,nodeNo,cityCode,lat,lng}] }
//   /api/find-station?cityCode=31010&routeNo=92      → 노선번호 검색 (원본 응답, 디버그용)
//   /api/find-station?cityCode=31010&routeId=GGB...  → 노선 경유 정류장 (원본 응답, 디버그용)
//
// 정류장 이름 검색은 「국토교통부_(TAGO)_버스정류소정보」 활용신청이 필요합니다.
export default async function handler(req, res) {
  const key = (process.env.BUS_API_KEY || "").trim();
  if (!key) {
    res.status(500).json({ ok: false, error: "BUS_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }
  const serviceKey = key.includes("%") ? key : encodeURIComponent(key);
  const { cityCode, name, routeNo, routeId } = req.query;
  const BASE = "http://apis.data.go.kr/1613000/";

  const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

  // TAGO는 간헐적으로 HTTP_ERROR(코드 04)를 반환 → 최대 3회 재시도
  const fetchTagoJson = async (u) => {
    let last = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const data = await (await fetch(u)).json();
        const err = data && data.OpenAPI_ServiceResponse && data.OpenAPI_ServiceResponse.cmmMsgHeader;
        const code = err && String(err.returnReasonCode);
        // 일시적 오류(HTTP_ERROR 04, 서비스 지연 등)만 재시도, 인증(30)·정상은 그대로
        if (code && code !== "30" && /HTTP|ERROR|지연|SERVICE/i.test(err.errMsg || err.returnAuthMsg || "")) {
          last = data;
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        return data;
      } catch (e) {
        last = { error: String(e) };
        await new Promise((r) => setTimeout(r, 400));
      }
    }
    return last;
  };
  const tagoItems = (data) => {
    const authErr = data && data.OpenAPI_ServiceResponse && data.OpenAPI_ServiceResponse.cmmMsgHeader;
    if (authErr) {
      throw new Error(String(authErr.returnReasonCode) === "30"
        ? "이 기능에 필요한 TAGO 서비스가 활용신청되지 않았습니다. 공공데이터포털에서 「국토교통부_(TAGO)_버스정류소정보」를 활용신청하세요."
        : "TAGO 오류: " + (authErr.errMsg || authErr.returnReasonCode));
    }
    const header = data && data.response && data.response.header;
    if (!header || String(header.resultCode) !== "00") {
      throw new Error("TAGO 오류: " + (header ? header.resultMsg : "응답 형식 오류"));
    }
    return toArray(data.response.body && data.response.body.items && data.response.body.items.item);
  };

  try {
    if (cityCode && name) {
      const url = BASE + "BusSttnInfoInqireService/getSttnNoList" +
        "?serviceKey=" + serviceKey +
        "&cityCode=" + encodeURIComponent(cityCode) +
        "&nodeNm=" + encodeURIComponent(name) +
        "&numOfRows=50&pageNo=1&_type=json";
      const items = tagoItems(await fetchTagoJson(url));
      res.status(200).json({
        ok: true,
        stations: items.map((it) => ({
          nodeId: it.nodeid,
          name: it.nodenm,
          nodeNo: it.nodeno || "",
          cityCode: String(cityCode),
          lat: it.gpslati,
          lng: it.gpslong
        }))
      });
      return;
    }

    if (cityCode && (routeNo || routeId)) {
      const url = routeNo
        ? BASE + "BusRouteInfoInqireService/getRouteNoList?serviceKey=" + serviceKey +
          "&cityCode=" + encodeURIComponent(cityCode) + "&routeNo=" + encodeURIComponent(routeNo) + "&numOfRows=50&pageNo=1&_type=json"
        : BASE + "BusRouteInfoInqireService/getRouteAcctoThrghSttnList?serviceKey=" + serviceKey +
          "&cityCode=" + encodeURIComponent(cityCode) + "&routeId=" + encodeURIComponent(routeId) + "&numOfRows=300&pageNo=1&_type=json";
      res.status(200).json(await fetchTagoJson(url));
      return;
    }

    // 파라미터 없음 → 도시 목록 (승인된 버스노선정보 서비스 사용)
    const url = BASE + "BusRouteInfoInqireService/getCtyCodeList?serviceKey=" + serviceKey + "&_type=json";
    const items = tagoItems(await fetchTagoJson(url));
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).json({
      ok: true,
      cities: items.map((it) => ({ code: String(it.citycode), name: it.cityname }))
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
