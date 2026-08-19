// Vercel 서버리스 함수 — 정류장 주변 시설 검색 (Kakao 로컬 카테고리 검색)
// 노약자에게 유용한 시설(지하철역·병원·약국) 중 가장 가까운 곳을 하나씩 돌려줍니다.
//
// 사용법: /api/nearby?x=126.9732&y=37.3017   (x=경도, y=위도)
// 필요한 환경변수: KAKAO_REST_KEY
export default async function handler(req, res) {
  const kakaoKey = (process.env.KAKAO_REST_KEY || "").trim();
  if (!kakaoKey) {
    res.status(200).json({ ok: false, error: "KAKAO_REST_KEY 환경변수가 없습니다." });
    return;
  }
  const { x, y } = req.query;
  if (!x || !y) {
    res.status(400).json({ ok: false, error: "x(경도), y(위도) 파라미터가 필요합니다." });
    return;
  }

  const categories = [
    ["SW8", "지하철역"],
    ["HP8", "병원"],
    ["PM9", "약국"]
  ];

  try {
    const places = [];
    for (const [code, label] of categories) {
      const url =
        "https://dapi.kakao.com/v2/local/search/category.json" +
        "?category_group_code=" + code +
        "&x=" + encodeURIComponent(x) + "&y=" + encodeURIComponent(y) +
        "&radius=1200&sort=distance&size=1";
      const data = await (await fetch(url, { headers: { Authorization: "KakaoAK " + kakaoKey } })).json();
      const doc = data.documents && data.documents[0];
      if (doc) {
        places.push({ name: doc.place_name, distance: Number(doc.distance), category: label });
      }
    }
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).json({ ok: true, places });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
