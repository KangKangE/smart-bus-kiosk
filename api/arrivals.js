// Vercel 서버리스 함수 — 버스 도착정보 프록시
// 두 가지 데이터 소스를 지원하고, 응답을 공통 형식으로 정리해서 돌려줍니다.
//   1) 서울시:  /api/arrivals?arsId=01120
//   2) TAGO(전국·경기도 포함): /api/arrivals?cityCode=31010&nodeId=GGB233000723
//
// 공통 응답: { ok: true, source: "seoul"|"tago", buses: [{ number, direction, minutes, next, lowFloor }] }
// 환경변수: BUS_API_KEY = 공공데이터포털 일반 인증키 (Encoding/Decoding 모두 가능)
export default async function handler(req, res) {
  const key = (process.env.BUS_API_KEY || "").trim();
  if (!key) {
    res.status(500).json({ ok: false, error: "BUS_API_KEY 환경변수가 설정되지 않았습니다." });
    return;
  }
  const serviceKey = key.includes("%") ? key : encodeURIComponent(key);
  const { arsId, cityCode, nodeId } = req.query;

  try {
    let buses;
    let source;

    if (cityCode && nodeId) {
      /* ---------- TAGO (국토교통부) — 경기도 등 전국 ---------- */
      source = "tago";
      const url =
        "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList" +
        "?serviceKey=" + serviceKey +
        "&cityCode=" + encodeURIComponent(cityCode) +
        "&nodeId=" + encodeURIComponent(nodeId) +
        "&numOfRows=50&pageNo=1&_type=json";
      const data = await (await fetch(url)).json();
      const header = data && data.response && data.response.header;
      if (!header || String(header.resultCode) !== "00") {
        res.status(200).json({
          ok: false, source,
          error: header ? header.resultCode + ": " + header.resultMsg : "TAGO 응답 형식 오류",
          raw: data
        });
        return;
      }
      let items = (data.response.body && data.response.body.items && data.response.body.items.item) || [];
      if (!Array.isArray(items)) items = [items]; // 결과가 1건이면 객체로 옴
      const byRoute = {};
      for (const it of items) {
        const no = String(it.routeno);
        const min = Math.max(0, Math.round(Number(it.arrtime) / 60));
        const prev = Number(it.arrprevstationcnt);
        if (!byRoute[no]) {
          byRoute[no] = {
            number: no,
            direction: it.routetp || "",           // TAGO는 방면 정보가 없어 노선 유형을 표시
            times: [{ min, prev: isFinite(prev) ? prev : null }],
            routeId: it.routeid ? String(it.routeid) : "",
            lowFloor: it.vehicletp === "저상버스"
          };
        } else {
          byRoute[no].times.push({ min, prev: isFinite(prev) ? prev : null });
        }
      }
      buses = Object.values(byRoute).map((r) => {
        r.times.sort((a, b) => a.min - b.min);  // 같은 노선의 도착 시간이 순서 없이 와서 정렬 필요
        return {
          number: r.number,
          direction: r.direction,
          minutes: r.times[0].min,
          next: r.times.length > 1 ? r.times[1].min : null,
          prevStops: r.times[0].prev,            // 이 정류장까지 남은 정류장 수 (현재 위치)
          routeId: r.routeId,
          lowFloor: r.lowFloor
        };
      });
    } else {
      /* ---------- 서울시 ---------- */
      const ars = String(arsId || "").replace(/[^0-9]/g, "");
      if (!ars) {
        res.status(400).json({ ok: false, error: "arsId 또는 cityCode+nodeId 파라미터가 필요합니다." });
        return;
      }
      source = "seoul";
      const url =
        "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid" +
        "?serviceKey=" + serviceKey + "&arsId=" + ars + "&resultType=json";
      const data = await (await fetch(url)).json();
      const h = data && data.msgHeader;
      if (!h || String(h.headerCd) !== "0") {
        res.status(200).json({ ok: false, source, error: h ? h.headerMsg : "서울 API 응답 형식 오류" });
        return;
      }
      let items = (data.msgBody && data.msgBody.itemList) || [];
      if (!Array.isArray(items)) items = [items];
      const parseMsg = (m) => {
        if (!m) return null;
        if (m.includes("곧 도착")) return 0;
        const x = m.match(/(\d+)분/);
        return x ? parseInt(x[1], 10) : null;
      };
      buses = items
        .filter((it) => it.arrmsg1 && !it.arrmsg1.includes("운행종료"))
        .map((it) => ({
          number: it.rtNm,
          direction: it.adirection ? it.adirection + " 방면" : "",
          minutes: parseMsg(it.arrmsg1),
          next: parseMsg(it.arrmsg2),
          lowFloor: it.busType1 === "1"
        }));
    }

    buses.sort((a, b) =>
      (a.minutes == null ? 999 : a.minutes) - (b.minutes == null ? 999 : b.minutes)
    );
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    res.status(200).json({ ok: true, source, buses: buses.slice(0, 20) });
  } catch (e) {
    res.status(502).json({ ok: false, error: "버스 API 호출에 실패했습니다.", detail: String(e) });
  }
}
