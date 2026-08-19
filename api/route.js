// Vercel 서버리스 함수 — 대중교통 길찾기 프록시
// Kakao 로컬 API로 목적지 이름 → 좌표 변환 후, ODsay API로 대중교통 경로를 검색합니다.
//
// 필요한 환경변수:
//   ODSAY_API_KEY  — lab.odsay.com 에서 발급 (대중교통 길찾기)
//   KAKAO_REST_KEY — developers.kakao.com 에서 발급한 REST API 키 (장소 이름 → 좌표)
//
// 사용법: /api/route?dest=수원역&sx=126.9732&sy=37.3017
//         (sx=출발지 경도, sy=출발지 위도. 없으면 sname=정류장이름 으로 대체 가능)
export default async function handler(req, res) {
  const odsayKey = (process.env.ODSAY_API_KEY || "").trim();
  const kakaoKey = (process.env.KAKAO_REST_KEY || "").trim();
  if (!odsayKey) {
    res.status(200).json({ ok: false, error: "ODSAY_API_KEY 환경변수가 없습니다. lab.odsay.com에서 키를 발급받아 Vercel에 등록하세요." });
    return;
  }
  const { dest, sx, sy, sname } = req.query;
  if (!dest) {
    res.status(400).json({ ok: false, error: "dest 파라미터가 필요합니다. 예: /api/route?dest=수원역&sx=126.97&sy=37.30" });
    return;
  }

  async function geocode(query, biasX, biasY) {
    if (!kakaoKey) {
      throw new Error("KAKAO_REST_KEY 환경변수가 없습니다. developers.kakao.com에서 REST API 키를 발급받아 등록하세요.");
    }
    let url = "https://dapi.kakao.com/v2/local/search/keyword.json?size=5&query=" + encodeURIComponent(query);
    if (biasX && biasY) url += "&x=" + encodeURIComponent(biasX) + "&y=" + encodeURIComponent(biasY);
    const data = await (await fetch(url, { headers: { Authorization: "KakaoAK " + kakaoKey } })).json();
    const doc = data.documents && data.documents[0];
    if (!doc) throw new Error("장소를 찾지 못했습니다: " + query);
    return { x: doc.x, y: doc.y, name: doc.place_name };
  }

  try {
    let start;
    if (sx && sy) start = { x: sx, y: sy, name: sname || "출발지" };
    else if (sname) start = await geocode(sname);
    else throw new Error("출발지 정보(sx,sy 또는 sname)가 필요합니다.");

    const target = await geocode(dest, start.x, start.y);

    const oUrl =
      "https://api.odsay.com/v1/api/searchPubTransPathT" +
      "?SX=" + start.x + "&SY=" + start.y +
      "&EX=" + target.x + "&EY=" + target.y +
      "&apiKey=" + encodeURIComponent(odsayKey);
    // ODsay 웹 키는 등록된 도메인의 Referer를 검사하므로 서버 호출에도 붙여준다
    const data = await (await fetch(oUrl, {
      headers: { Referer: "https://smart-bus-kiosk.vercel.app/" }
    })).json();

    if (data.error) {
      const e = Array.isArray(data.error) ? data.error[0] : data.error;
      throw new Error("ODsay: " + (e.msg || e.message || JSON.stringify(e)));
    }
    const raw = (data.result && data.result.path) || [];
    if (!raw.length) throw new Error("대중교통 경로를 찾지 못했습니다.");

    const paths = raw.slice(0, 5).map((p) => {
      const info = p.info || {};
      const subs = p.subPath || [];
      return {
        totalTime: info.totalTime,                 // 총 소요 시간(분)
        payment: info.payment,                     // 요금(원)
        mapObj: info.mapObj || "",                 // 실제 경로 선형 조회용 (loadLane)
        transfers: Math.max(0, (info.busTransitCount || 0) + (info.subwayTransitCount || 0) - 1),
        walkTime: subs.filter((s) => s.trafficType === 3).reduce((a, s) => a + (s.sectionTime || 0), 0),
        steps: subs
          .filter((s) => !(s.trafficType === 3 && !(s.sectionTime > 0)))  // 0분짜리 도보 구간 제거
          .map((s) => ({
            type: s.trafficType === 3 ? "walk" : s.trafficType === 2 ? "bus" : "subway",
            time: s.sectionTime || 0,
            stations: s.stationCount || 0,
            line: s.lane && s.lane[0] ? (s.lane[0].busNo || s.lane[0].name || "") : "",
            from: s.startName || "",
            to: s.endName || ""
          }))
      };
    });

    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json({ ok: true, start, destination: target, paths });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
