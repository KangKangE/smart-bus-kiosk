// Vercel 서버리스 함수 — 목적지 후보 검색 (Kakao 키워드 검색 상위 5곳)
// 음성으로 말한 목적지가 맞는지 확인시켜 줄 후보 목록을 만듭니다.
//
// 사용법: /api/places?q=수원역&x=126.97&y=37.30  (x,y = 검색 기준 좌표, 선택)
export default async function handler(req, res) {
  const kakaoKey = (process.env.KAKAO_REST_KEY || "").trim();
  if (!kakaoKey) {
    res.status(200).json({ ok: false, error: "KAKAO_REST_KEY 환경변수가 없습니다." });
    return;
  }
  const { q, x, y } = req.query;
  if (!q) {
    res.status(400).json({ ok: false, error: "q 파라미터가 필요합니다." });
    return;
  }
  let url = "https://dapi.kakao.com/v2/local/search/keyword.json?size=5&query=" + encodeURIComponent(q);
  if (x && y) url += "&x=" + encodeURIComponent(x) + "&y=" + encodeURIComponent(y);

  try {
    const data = await (await fetch(url, { headers: { Authorization: "KakaoAK " + kakaoKey } })).json();
    const places = (data.documents || []).map((d) => ({
      name: d.place_name,
      address: d.road_address_name || d.address_name || "",
      category: d.category_group_name || "",
      x: d.x,
      y: d.y
    }));
    res.status(200).json({ ok: true, places });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
}
