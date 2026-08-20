/* 말하는 스마트 정류장 — 음성 기반 버스 정류장 키오스크 */
(function () {
  "use strict";

  /* ---------- 아이콘 ---------- */
  var ICON_PATHS = {
    arrow: '<path d="m9 18 6-6-6-6"></path>',
    back: '<path d="m15 18-6-6 6-6"></path><path d="M9 12h10"></path>',
    bus: '<rect x="4" y="3" width="16" height="15" rx="3"></rect><path d="M4 11h16M8 18v3m8-3v3M8 7h.01M16 7h.01M8 15h.01M16 15h.01"></path>',
    check: '<path d="m5 12 4 4L19 6"></path>',
    clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    gear: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"></path>',
    home: '<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10M9 20v-6h6v6"></path>',
    language: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>',
    location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
    map: '<path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z"></path><path d="M8 3v15M16 6v15"></path>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"></path>',
    refresh: '<path d="M20 7v5h-5"></path><path d="M19 12a7 7 0 1 1-2-5"></path>',
    route: '<circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="6" r="2"></circle><path d="M6 16V9a3 3 0 0 1 3-3h7M9 18h9"></path>',
    speaker: '<path d="M11 5 6 9H3v6h3l5 4Z"></path><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"></path>',
    walk: '<circle cx="13" cy="4" r="2"></circle><path d="m10 21 2-6-3-3 2-5 4 3h3M14 15l3 6M7 21l2-5"></path>',
    wheelchair: '<circle cx="9" cy="4" r="2"></circle><path d="M9 7v6h5l3 5M9 10H6a4 4 0 1 0 7 5"></path>',
    x: '<path d="m6 6 12 12M18 6 6 18"></path>'
  };

  function icon(name, size) {
    size = size || 32;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON_PATHS[name] + "</svg>";
  }

  function esc(v) {
    return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- 다국어 문구 ---------- */
  var STRINGS = {
    KO: {
      languageName: "한국어",
      station: "광화문역 버스정류장",
      help: "무엇을 도와드릴까요?",
      intro: "버튼을 누르고 편하게 말씀해 주세요.",
      voice: "눌러서 말하기",
      example: "예: “강남역 가는 버스 알려줘”",
      arrival: "버스 도착 시간",
      arrivalHint: "곧 오는 버스를 확인해요",
      route: "목적지 길찾기",
      routeHint: "어떤 버스를 타는지 알려드려요",
      info: "정류장 정보",
      infoHint: "현재 위치와 주변 시설을 확인해요",
      listening: "네, 듣고 있어요.",
      listeningHint: "가고 싶은 곳이나 궁금한 버스를 말씀해 주세요.",
      listenStatus: "음성 인식 중",
      cancel: "취소",
      arrivalsTitle: "곧 도착하는 버스예요.",
      speak: "안내 듣기",
      home: "처음 화면으로",
      soon: "곧 도착",
      next: "다음",
      minute: "분 후",
      routeTitle: "강남역까지 가는 방법이에요.",
      direct: "환승 없이 한 번에",
      fastest: "가장 빠른 길",
      detail: "상세 경로 보기",
      stationInfo: "현재 정류장 정보",
      current: "현재 위치",
      nearby: "주변 시설",
      chooseLanguage: "안내 언어를 선택해 주세요",
      voiceGuide: "선택한 언어로 화면과 음성을 안내합니다."
    },
    EN: {
      languageName: "English",
      station: "Gwanghwamun Bus Stop",
      help: "How can I help you?",
      intro: "Tap the button and ask your question.",
      voice: "Tap to speak",
      example: "Try: “How do I get to Gangnam?”",
      arrival: "Bus arrivals",
      arrivalHint: "See which bus is coming soon",
      route: "Find a route",
      routeHint: "Find the best bus to your destination",
      info: "Stop information",
      infoHint: "View this stop and nearby places",
      listening: "I’m listening.",
      listeningHint: "Tell me where you want to go or which bus you need.",
      listenStatus: "Listening",
      cancel: "Cancel",
      arrivalsTitle: "Buses arriving soon",
      speak: "Listen",
      home: "Home",
      soon: "Arriving",
      next: "Next",
      minute: " min",
      routeTitle: "Routes to Gangnam Station",
      direct: "Direct · no transfer",
      fastest: "Fastest route",
      detail: "View details",
      stationInfo: "Bus stop information",
      current: "You are here",
      nearby: "Nearby",
      chooseLanguage: "Choose your language",
      voiceGuide: "The screen and voice will use your selected language."
    },
    JA: {
      languageName: "日本語",
      station: "光化門駅 バス停",
      help: "何をお手伝いしましょうか？",
      intro: "ボタンを押して、ゆっくり話してください。",
      voice: "押して話す",
      example: "例：「江南駅まで行きたいです」",
      arrival: "バス到着情報",
      arrivalHint: "まもなく来るバスを確認",
      route: "目的地までの行き方",
      routeHint: "乗るバスをご案内します",
      info: "バス停情報",
      infoHint: "現在地と周辺施設を確認",
      listening: "聞いています。",
      listeningHint: "行きたい場所やバスを話してください。",
      listenStatus: "音声認識中",
      cancel: "取消",
      arrivalsTitle: "まもなく到着するバス",
      speak: "音声案内",
      home: "最初に戻る",
      soon: "まもなく",
      next: "次",
      minute: "分後",
      routeTitle: "江南駅までの行き方",
      direct: "乗換なし",
      fastest: "最速ルート",
      detail: "詳細を見る",
      stationInfo: "バス停情報",
      current: "現在地",
      nearby: "周辺施設",
      chooseLanguage: "言語を選んでください",
      voiceGuide: "選択した言語で画面と音声をご案内します。"
    },
    ZH: {
      languageName: "中文",
      station: "光化门站公交车站",
      help: "需要什么帮助？",
      intro: "请点击按钮后慢慢说。",
      voice: "点击说话",
      example: "例如：“怎么去江南站？”",
      arrival: "公交到站信息",
      arrivalHint: "查看即将到站的公交",
      route: "查找路线",
      routeHint: "告诉您该乘坐哪辆公交",
      info: "车站信息",
      infoHint: "查看当前位置和周边设施",
      listening: "我在听。",
      listeningHint: "请说出目的地或公交车号。",
      listenStatus: "正在识别语音",
      cancel: "取消",
      arrivalsTitle: "即将到站的公交",
      speak: "播放语音",
      home: "返回首页",
      soon: "即将到站",
      next: "下一班",
      minute: "分钟后",
      routeTitle: "前往江南站的路线",
      direct: "无需换乘",
      fastest: "最快路线",
      detail: "查看详情",
      stationInfo: "公交车站信息",
      current: "当前位置",
      nearby: "周边设施",
      chooseLanguage: "请选择语言",
      voiceGuide: "屏幕和语音将使用所选语言。"
    }
  };

  /* ---------- 시연 데이터 ---------- */
  var BUSES = [
    { number: "470", direction: { KO: "강남역 방면", EN: "To Gangnam", JA: "江南駅方面", ZH: "开往江南站" }, minutes: 3, next: 12, lowFloor: true },
    { number: "741", direction: { KO: "서울역 방면", EN: "To Seoul Station", JA: "ソウル駅方面", ZH: "开往首尔站" }, minutes: 7, next: 16, lowFloor: true },
    { number: "402", direction: { KO: "동대문 방면", EN: "To Dongdaemun", JA: "東大門方面", ZH: "开往东大门" }, minutes: 11, next: 23, lowFloor: false }
  ];

  var LANGUAGES = [
    { id: "KO", native: "한국어", helper: "Korean" },
    { id: "EN", native: "English", helper: "영어" },
    { id: "JA", native: "日本語", helper: "일본어" },
    { id: "ZH", native: "中文", helper: "중국어" }
  ];

  var DEFAULT_SETTINGS = {
    stationName: "광화문역",
    stationId: "01-120",
    address: "서울특별시 종로구 세종대로 172",
    prompt: "현재 키오스크는 [기본 위치] 정류장에 설치되어 있습니다. 사용자의 언어와 이동 목적을 파악하고, 현재 위치를 기준으로 이용 가능한 버스 노선, 예상 도착 시간, 환승 횟수와 보행 구간을 짧고 명확하게 안내하세요. 노약자에게는 저상버스를 우선 안내하세요. 또한, 우선순위를 판단하여 빠른 이동을 원하는 사용자에게는 가장 빠른 도착 경로를 우선적으로 안내하고, 노약자나 외국인에게는 최소한의 환승과 단순한 경로를 안내하세요.",
    endpoint: "https://api.example.kr/bus/arrivals",
    cityCode: "",            // 비우면 서울(arsId 방식), 채우면 TAGO 방식 (예: 수원 31010)
    lat: "37.5713",          // 정류장 위도 (길찾기 출발점, 정류장 검색으로 자동 입력)
    lng: "126.9769"          // 정류장 경도
  };

  var STORAGE_KEY = "smart-bus-settings";
  var LANG_KEY = "smart-bus-language";
  var RECENT_KEY = "smart-bus-recent-dests";

  /* ---------- 상태 ---------- */
  var state = {
    screen: "home",          // home | listening | arrival | routes | routeDetail | station | language | settings | saved
    language: "KO",
    now: null,
    transcript: "",
    voiceSupported: true,
    testState: "idle",       // idle | testing | ok
    geminiTest: "idle",      // idle | testing | ok | fail
    geminiErrorMsg: "",      // 연결 테스트 실패 시 구글이 보낸 실제 오류 메시지
    liveBuses: null,         // 실시간 도착 데이터 (프록시 연결 성공 시 시연 데이터 대신 사용)
    route: null,             // 실제 길찾기 결과 {destination, pref, chosen, alternate}
    routeLoading: false,
    routeError: "",
    cities: null,            // TAGO 도시 목록 (정류장 검색용)
    citySel: "",
    stationQuery: "",
    stationResults: null,
    stationSearchMsg: "",
    nearby: null,            // 주변 시설 (Kakao 카테고리 검색 결과)
    geminiAvailable: null,   // Vercel에 GEMINI_API_KEY가 설정돼 있는지 (null=확인 중)
    rated: {},               // 만족도 평가 완료 여부 (중복 방지)
    ratingStars: {},         // 제출 전 선택한 별점 (화면별)
    ratingDraft: {},         // 제출 전 입력한 의견 (화면별, 재렌더 시 보존)
    destConfirm: null,       // 목적지 확인 단계 {query, pref, candidates}
    confirmListening: false, // 목적지 확인 화면에서 예/아니오 음성을 듣는 중
    kpi: null,               // KPI 집계 결과
    kpiError: "",
    events: null,            // 로그 화면의 현재 페이지 이벤트 목록
    eventsTotal: null,       // 전체 로그 개수
    eventsDevice: "",        // 특정 사용자(기기)만 보기 필터
    logPage: 0,              // 로그 페이지 (0부터)
    recording: false,        // Gemini 오디오 녹음 중 (완료 버튼 표시용)
    busRoute: null,          // 선택한 버스의 노선도 {bus, stops, ourIndex, busIndex}
    busRouteError: "",
    settings: Object.assign({}, DEFAULT_SETTINGS)
  };

  var recognitionRef = null;
  var idleTimer = null;
  var aiRequestToken = 0;

  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) state.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(stored));
  } catch (e) { /* 저장된 설정이 없거나 손상됨 */ }

  // 예전 버전의 고정 프롬프트(특정 정류장 이름이 박힌 것)는 새 자동화 템플릿으로 교체
  if (!state.settings.prompt ||
      (state.settings.prompt.indexOf("[기본 위치]") === -1 && state.settings.prompt.indexOf("정류장에 설치되어") !== -1)) {
    state.settings.prompt = DEFAULT_SETTINGS.prompt;
  }

  // 저장된 언어 불러오기 (없으면 첫 화면에서 언어 선택부터)
  var storedLang = null;
  try { storedLang = window.localStorage.getItem(LANG_KEY); } catch (e) {}
  if (storedLang && STRINGS[storedLang]) state.language = storedLang;

  function getRecentDests() {
    try { return JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]"); } catch (e) { return []; }
  }

  function addRecentDest(name) {
    if (!name) return;
    var list = getRecentDests().filter(function (n) { return n !== name; });
    list.unshift(name);
    try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5))); } catch (e) {}
  }

  /* ---------- 사용 데이터 로깅 (KPI 측정용, Supabase 저장) ---------- */
  var deviceId = "dev-unknown";
  try {
    deviceId = window.localStorage.getItem("smart-bus-device");
    if (!deviceId) {
      deviceId = "dev-" + Math.random().toString(36).slice(2, 10);
      window.localStorage.setItem("smart-bus-device", deviceId);
    }
  } catch (e) {}
  var sessionId = "s-" + Math.random().toString(36).slice(2, 10);

  function logEvent(type, payload) {
    try {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          deviceId: deviceId,
          sessionId: sessionId,
          lang: state.language,
          type: type,
          payload: payload || {}
        })
      }).catch(function () {});
    } catch (e) { /* 로깅 실패는 서비스 동작에 영향 없음 */ }
  }

  /* ---------- 유틸 ---------- */
  function localeFor(lang) {
    return lang === "KO" ? "ko-KR" : lang === "JA" ? "ja-JP" : lang === "ZH" ? "zh-CN" : "en-US";
  }

  function formatTime() {
    if (!state.now) return "--:--";
    return state.now.toLocaleTimeString(localeFor(state.language), { hour: "2-digit", minute: "2-digit" });
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    var u = new SpeechSynthesisUtterance(text);
    u.lang = localeFor(state.language);
    u.rate = 0.86;
    // cancel() 직후 speak()를 바로 부르면 크롬에서 소리가 안 나는 버그가 있어 약간 지연
    window.setTimeout(function () {
      try { window.speechSynthesis.speak(u); window.speechSynthesis.resume(); } catch (e) {}
    }, 70);
  }

  /* ---------- 실시간 버스 도착 데이터 (Vercel 프록시 /api/arrivals) ---------- */
  var liveTimer = null;

  function parseArrMsg(msg) {
    if (!msg) return null;
    if (msg.indexOf("곧 도착") !== -1) return 0;
    var m = msg.match(/(\d+)분/);
    return m ? parseInt(m[1], 10) : null;
  }

  function loadArrivals() {
    var s = state.settings;
    var url;
    if (s.cityCode && s.cityCode.trim()) {
      // TAGO 방식 (경기도 등): 정류장 ID 칸에 nodeId, 도시코드 칸에 cityCode
      url = "/api/arrivals?cityCode=" + encodeURIComponent(s.cityCode.trim()) +
        "&nodeId=" + encodeURIComponent(String(s.stationId || "").trim());
    } else {
      var arsId = String(s.stationId || "").replace(/[^0-9]/g, "");
      if (!arsId) return;
      url = "/api/arrivals?arsId=" + arsId;
    }
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.ok || !data.buses || !data.buses.length) throw new Error("no data");
        var buses = data.buses.map(function (b) {
          return {
            number: b.number,
            direction: b.direction || "",
            minutes: b.minutes,
            next: b.next,
            msg1: "",
            routeId: b.routeId || "",
            prevStops: (typeof b.prevStops === "number") ? b.prevStops : null,
            lowFloor: !!b.lowFloor
          };
        });
        state.liveBuses = buses;   // 정류장의 모든 노선을 표시
        if (!liveTimer) liveTimer = window.setInterval(loadArrivals, 30000);
        if (state.screen === "home" || state.screen === "arrival") render();
      })
      .catch(function () {
        /* 프록시 없음(로컬 실행)·키 미설정·심야 운행종료 → 시연 데이터 유지 */
      });
  }

  function getBuses() {
    return state.liveBuses || BUSES;
  }

  /* ---------- 버스 노선도 + 현재 위치 ---------- */
  function openBusRoute(number) {
    var bus = getBuses().filter(function (b) { return String(b.number) === String(number); })[0];
    if (!bus) return;
    state.busRoute = null;
    state.busRouteError = "";
    setScreen("busRoute");
    var s = state.settings;
    if (!bus.routeId || !s.cityCode) {
      state.busRouteError = "이 정류장은 노선도 정보를 제공하지 않아요.";
      render();
      return;
    }
    fetch("/api/find-station?cityCode=" + encodeURIComponent(s.cityCode) + "&routeId=" + encodeURIComponent(bus.routeId))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = d && d.response && d.response.body && d.response.body.items && d.response.body.items.item;
        if (!items) throw new Error("no stops");
        if (!Array.isArray(items)) items = [items];
        var stops = items
          .map(function (it) { return { name: it.nodenm, ord: Number(it.nodeord), nodeId: String(it.nodeid) }; })
          .filter(function (x) { return x.name; })
          .sort(function (a, b) { return a.ord - b.ord; });
        if (!stops.length) throw new Error("empty");
        var ourIndex = -1;
        for (var i = 0; i < stops.length; i++) {
          if (stops[i].nodeId === String(s.stationId)) { ourIndex = i; break; }
        }
        if (ourIndex < 0) ourIndex = stops.findIndex(function (x) { return x.name.indexOf(s.stationName.split(".")[0]) !== -1; });
        var busIndex = (ourIndex >= 0 && bus.prevStops != null) ? ourIndex - bus.prevStops : -1;
        state.busRoute = { bus: bus, stops: stops, ourIndex: ourIndex, busIndex: busIndex };
        if (state.screen === "busRoute") render();
      })
      .catch(function () {
        state.busRouteError = "노선도를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
        if (state.screen === "busRoute") render();
      });
  }

  function renderBusRoute() {
    var ko = state.language === "KO";
    var br = state.busRoute;
    var head =
      '<div class="busroute-view content-view">' +
        '<div class="result-heading compact-heading"><div>' +
          '<p class="eyebrow">' + (ko ? "버스 노선도" : "Bus route") + "</p>" +
          "<h1>" + (state.busRoute ? esc(state.busRoute.bus.number) + (ko ? "번 버스" : "") : (ko ? "노선도" : "Route")) + "</h1>" +
        "</div></div>";
    if (state.busRouteError) return head + '<p class="route-error">' + esc(state.busRouteError) + "</p></div>";
    if (!br) return head + '<p class="station-msg">노선도를 불러오는 중…</p></div>';

    var b = br.bus;
    var summary =
      '<div class="busroute-summary">' +
        "<span>" + icon("bus", 24) +
          (ko ? (b.prevStops != null
            ? "지금 " + b.prevStops + "개 정류장 전에 있어요 · 약 " + b.minutes + "분 후 도착"
            : "약 " + b.minutes + "분 후 도착")
            : "Arriving in " + b.minutes + " min") + "</span>" +
      "</div>";

    // 우리 정류장 주변 위주로 보여주기 (전 구간은 너무 길 수 있음)
    var stops = br.stops;
    var startI = Math.max(0, (br.busIndex >= 0 ? br.busIndex : br.ourIndex) - 1);
    var endI = Math.min(stops.length - 1, br.ourIndex + 4);
    if (br.ourIndex < 0) { startI = 0; endI = Math.min(stops.length - 1, 12); }
    var items = "";
    for (var i = startI; i <= endI; i++) {
      var isOur = i === br.ourIndex;
      var isBus = i === br.busIndex;
      items +=
        '<div class="busroute-stop' + (isOur ? " stop-our" : "") + '">' +
          '<span class="stop-dot' + (isBus ? " stop-dot-bus" : "") + '">' + (isBus ? icon("bus", 20) : "") + "</span>" +
          '<span class="stop-name">' + esc(stops[i].name) + "</span>" +
          (isOur ? '<span class="stop-here">' + (ko ? "여기 승차" : "Board here") + "</span>" : "") +
          (isBus && !isOur ? '<span class="stop-buslabel">' + (ko ? "버스 위치" : "Bus here") + "</span>" : "") +
        "</div>";
    }
    return head + summary +
      '<div class="busroute-list">' + items + "</div>" +
      (startI > 0 || endI < stops.length - 1 ? '<p class="station-msg">' + (ko ? "정류장이 많아 주변 구간만 표시했어요." : "Showing nearby stops only.") + "</p>" : "") +
      '<button class="home-button" data-action="arrival">' + icon("back", 26) + (ko ? "도착 정보로" : "Back") + "</button>" +
    "</div>";
  }

  function busDirection(bus) {
    return typeof bus.direction === "string" ? bus.direction : bus.direction[state.language];
  }

  /* ---------- 실제 길찾기 (Vercel 프록시 /api/route → Kakao + ODsay) ---------- */
  function transitLegs(path) {
    return path.steps.filter(function (st) { return st.type !== "walk"; });
  }

  function firstLeg(path) {
    return transitLegs(path)[0] || null;
  }

  function sortPaths(paths, pref) {
    var sorted = paths.slice();
    if (pref === "fast") {
      sorted.sort(function (a, b) { return a.totalTime - b.totalTime; });
    } else {
      // 쉬운 길: 환승 적게 → 걷기 적게 → 시간 짧게
      sorted.sort(function (a, b) {
        return (a.transfers - b.transfers) || (a.walkTime - b.walkTime) || (a.totalTime - b.totalTime);
      });
    }
    return sorted.slice(0, 3);   // 경로는 최대 3개까지
  }

  function currentPath() {
    var r = state.route;
    if (!r || !r.paths || !r.paths.length) return null;
    return r.paths[r.selected || 0];
  }

  var routeCache = {};

  function performRouteSearch(destText, pref, coords) {
    var s = state.settings;
    state.routeError = "";
    state.destConfirm = null;
    // 같은 목적지+옵션은 캐시 사용 (ODsay 무료 사용량 절약)
    var cacheKey = (coords && coords.name ? coords.name : destText) + "|" + (pref || "simple") + "|" + s.stationId;
    if (routeCache[cacheKey]) {
      state.routeLoading = false;
      state.route = routeCache[cacheKey];
      state.route.selected = 0;
      addRecentDest(state.route.destination);
      setScreen("routes");
      speakRouteSummary();
      return;
    }
    state.routeLoading = true;
    state.route = null;
    setScreen("routes");
    var qs = "dest=" + encodeURIComponent(destText) + "&pref=" + (pref || "simple");
    if (coords && coords.x && coords.y) {
      qs += "&destX=" + encodeURIComponent(coords.x) +
        "&destY=" + encodeURIComponent(coords.y) +
        "&destName=" + encodeURIComponent(coords.name || destText);
    }
    if (s.lng && s.lat) {
      qs += "&sx=" + encodeURIComponent(s.lng) + "&sy=" + encodeURIComponent(s.lat) +
        "&sname=" + encodeURIComponent(s.stationName || "");
    } else {
      qs += "&sname=" + encodeURIComponent(s.stationName || "");
    }
    fetch("/api/route?" + qs)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        state.routeLoading = false;
        if (!data || !data.ok || !data.paths || !data.paths.length) {
          var raw = (data && data.error) || "";
          state.routeError = /quota|exceeded|할당량/i.test(raw)
            ? "오늘 경로 검색 무료 사용량을 모두 사용했어요. 잠시 후(내일) 다시 이용해 주세요."
            : /장소를 찾지|not found|찾지 못/i.test(raw)
              ? "그 목적지를 찾지 못했어요. 더 정확한 이름으로 다시 말씀해 주세요."
              : (raw || "경로를 찾지 못했습니다.");
          logEvent("route_search_fail", { query: destText, error: raw || "unknown" });
          if (state.screen === "routes") render();
          return;
        }
        state.route = {
          destination: data.destination.name,
          start: data.start,
          dest: data.destination,
          pref: pref || "simple",
          paths: sortPaths(data.paths, pref),
          selected: 0
        };
        routeCache[cacheKey] = state.route;   // 같은 목적지 재검색 시 ODsay 호출 아낌
        addRecentDest(data.destination.name);
        logEvent("route_search", {
          query: destText,
          found: data.destination.name,
          pref: pref || "simple",
          results: state.route.paths.length,
          topTime: state.route.paths[0] ? state.route.paths[0].totalTime : null
        });
        if (state.screen === "routes" || state.screen === "routeDetail") render();
        speakRouteSummary();
      })
      .catch(function () {
        state.routeLoading = false;
        state.routeError = "경로 서버에 연결하지 못했습니다. 배포된 사이트에서 시도해 주세요.";
        if (state.screen === "routes") render();
      });
  }

  /* ---------- 음성 출력이 끝난 뒤에 듣기 시작 (TTS가 마이크에 섞이지 않도록) ---------- */
  function speakThen(text, onDone) {
    var started = false;
    var go = function () { if (started) return; started = true; onDone(); };
    if (!("speechSynthesis" in window)) { go(); return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = localeFor(state.language);
    u.rate = 0.86;
    u.onend = go;
    u.onerror = go;
    window.speechSynthesis.speak(u);
    // onend가 안 오는 브라우저 대비 폴백 (실제 발화보다 넉넉히)
    window.setTimeout(go, Math.min(13000, 3600 + text.length * 95));
  }

  function stopRecognition() {
    if (recognitionRef) { try { recognitionRef.stop(); } catch (e) {} recognitionRef = null; }
    state.confirmListening = false;
  }

  /* 목적지 확인 화면에서 예/아니오·후보 이름을 듣는다 (화면 전환 없이) */
  function listenOnConfirm() {
    if (!state.destConfirm) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return; // 음성 불가 기기 → 버튼으로 선택
    var rec = new Recognition();
    rec.lang = localeFor(state.language);
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = function (e) {
      var text = e.results[0][0].transcript;
      var confidence = e.results[0][0].confidence;
      logEvent("voice_result", {
        transcript: text,
        confidence: typeof confidence === "number" ? Math.round(confidence * 100) / 100 : null,
        context: "confirm"
      });
      state.confirmListening = false;
      handleConfirmVoice(text);
    };
    rec.onerror = function () { state.confirmListening = false; if (state.screen === "routes") render(); };
    rec.onend = function () { recognitionRef = null; if (state.confirmListening) { state.confirmListening = false; if (state.screen === "routes") render(); } };
    recognitionRef = rec;
    state.confirmListening = true;
    try { rec.start(); if (state.screen === "routes") render(); }
    catch (e) { state.confirmListening = false; }
  }

  /* ---------- 목적지 확인 단계 (음성 인식 오류 보완) ----------
     음성으로 들은 목적지의 후보 장소들을 보여주고
     "이 도착지가 맞나요?"를 확인받은 뒤 경로를 검색한다 */
  function confirmDestination(query, pref) {
    var s = state.settings;
    stopRecognition();
    state.routeLoading = false;
    state.route = null;
    state.routeError = "";
    var url = "/api/places?q=" + encodeURIComponent(query);
    if (s.lng && s.lat) url += "&x=" + encodeURIComponent(s.lng) + "&y=" + encodeURIComponent(s.lat);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok || !d.places || !d.places.length) {
          // 후보를 못 찾으면 이름 그대로 경로 검색 시도
          performRouteSearch(query, pref);
          return;
        }
        state.destConfirm = { query: query, pref: pref || "simple", candidates: d.places };
        setScreen("routes", true);
        var first = d.places[0].name;
        logEvent("dest_confirm_shown", { query: query, first: first, count: d.places.length });
        // 질문을 말한 뒤(음성이 끝난 뒤에) 예/아니오를 듣는다
        speakThen({
          KO: "말씀하신 목적지가 " + first + " 맞나요? 맞으면 '네'라고, 아니면 '아니요'라고 말씀하시거나 아래 목록에서 골라주세요.",
          EN: "Did you mean " + first + "? Say yes or no, or choose from the list below.",
          JA: "目的地は" + first + "でよろしいですか？「はい」か「いいえ」でお答えいただくか、下のリストから選んでください。",
          ZH: "您的目的地是" + first + "吗？请说“是”或“不是”，也可以从下面的列表中选择。"
        }[state.language], function () {
          if (state.destConfirm && state.screen === "routes") listenOnConfirm();
        });
      })
      .catch(function () { performRouteSearch(query, pref); });
  }

  function pickCandidate(idx, how) {
    var dc = state.destConfirm;
    if (!dc || !dc.candidates[idx]) return;
    stopRecognition();
    var c = dc.candidates[idx];
    logEvent("dest_pick", { index: idx, name: c.name, query: dc.query, how: how || "tap" });
    // 목적지 확인 = 음성 인식 성공 검증: 첫 제안 채택은 정확, 다른 후보는 보정
    logEvent("dest_confirm_result", { result: idx === 0 ? "confirmed" : "corrected", index: idx, how: how || "tap" });
    performRouteSearch(dc.query, dc.pref, c);
  }

  /* '아니요' → 목적지를 다시 말하도록 안내하고 듣기 */
  function reAskDestination() {
    var dc = state.destConfirm;
    logEvent("dest_confirm_result", { result: "rejected", query: dc ? dc.query : "" });
    stopRecognition();
    state.destConfirm = null;
    state.transcript = "";
    state.screen = "listening";
    render();
    speakThen({
      KO: "다시 어디로 가실지 말씀해 주세요.",
      EN: "Please say your destination again.",
      JA: "行き先をもう一度お話しください。",
      ZH: "请再说一次您的目的地。"
    }[state.language], function () {
      if (state.screen === "listening") startRecognitionCore();
    });
  }

  function isYes(t) {
    var w = ["네", "네네", "예", "맞아", "맞어", "맞습니다", "맞아요", "응", "그래", "좋아", "yes", "yeah", "yep", "correct", "right", "はい", "そう", "对", "是的", "对的"];
    for (var i = 0; i < w.length; i++) if (t.indexOf(w[i]) !== -1) return true;
    return false;
  }
  function isNo(t) {
    var w = ["아니", "아뇨", "아니요", "아니에요", "틀려", "틀렸", "no", "nope", "wrong", "いいえ", "違う", "ちがう", "不是", "不对", "错"];
    for (var i = 0; i < w.length; i++) if (t.indexOf(w[i]) !== -1) return true;
    return false;
  }

  function handleConfirmVoice(text) {
    var dc = state.destConfirm;
    if (!dc) return;
    var t = text.toLowerCase().replace(/\s/g, "");
    // 명확한 '아니요' → 목적지 다시 받기
    if (isNo(t) && !isYes(t)) { reAskDestination(); return; }
    // 명확한 '네' → 첫 제안 채택
    if (isYes(t)) { pickCandidate(dc.sel || 0, "voice-yes"); return; }
    // 후보 이름과 두 글자씩 겹치는 정도로 가장 비슷한 후보 선택
    var best = -1, bestScore = 0;
    dc.candidates.forEach(function (c, i) {
      var name = c.name.toLowerCase().replace(/\s/g, "");
      var hit = 0, total = Math.max(1, name.length - 1);
      for (var j = 0; j < name.length - 1; j++) {
        if (t.indexOf(name.substr(j, 2)) !== -1) hit++;
      }
      var score = hit / total;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    if (best >= 0 && bestScore >= 0.3) { pickCandidate(best, "voice-match"); return; }
    // 후보와 전혀 다른 말이면 새 목적지로 다시 확인 (보정 시도로 기록)
    logEvent("dest_confirm_result", { result: "rejected", query: dc.query, reason: "different" });
    confirmDestination(text, dc.pref);
  }

  function routeSummaryText(lang) {
    var r = state.route;
    if (!r) return "";
    var c = currentPath();
    if (!c) return "";
    var leg = firstLeg(c);
    var lastStep = c.steps[c.steps.length - 1];
    var lastWalk = lastStep && lastStep.type === "walk" && lastStep.time > 0 ? lastStep : null;
    if (lang === "KO") {
      var t1 = leg
        ? (leg.type === "bus"
          ? leg.from + " 정류장에서 " + leg.line + "번 버스를 타세요."
          : leg.from + "에서 " + leg.line + " 지하철을 타세요.")
        : "도보로 이동하세요.";
      var t2 = leg ? " " + leg.to + "에서 내리세요." : "";
      var t3 = c.transfers > 0 ? " 환승은 " + c.transfers + "번 있습니다." : " 환승은 없습니다.";
      var t4 = lastWalk ? " 내린 뒤 " + lastWalk.time + "분 정도 걸으면 도착합니다." : "";
      return r.destination + "까지 안내해 드릴게요. " + t1 + t2 + t3 + t4 + " 모두 " + c.totalTime + "분쯤 걸립니다.";
    }
    var e1 = leg
      ? (leg.type === "bus"
        ? "Take bus " + leg.line + " from " + leg.from + "."
        : "Take the " + leg.line + " subway from " + leg.from + ".")
      : "You can walk there.";
    var e2 = leg ? " Get off at " + leg.to + "." : "";
    var e3 = c.transfers > 0 ? " There are " + c.transfers + " transfer(s)." : " No transfers.";
    var e4 = lastWalk ? " Then walk about " + lastWalk.time + " minutes." : "";
    return "Route to " + r.destination + ". " + e1 + e2 + e3 + e4 + " Total about " + c.totalTime + " minutes.";
  }

  function speakRouteSummary() {
    var base = routeSummaryText(state.language === "KO" ? "KO" : "EN");
    if (!base) return;
    if (state.geminiAvailable && state.language !== "KO" && state.language !== "EN") {
      // 일본어·중국어는 Gemini가 현재 언어로 자연스럽게 바꿔 말하도록
      var langName = { JA: "日本語", ZH: "中文" }[state.language] || "English";
      geminiCall({
        systemInstruction: { parts: [{ text: "당신은 버스 정류장 안내원입니다. 사용자가 주는 경로 안내문을 " + langName + "로, 노약자가 이해하기 쉬운 짧은 문장으로 바꿔 말하세요. 바꾼 문장만 출력하세요." }] },
        contents: [{ role: "user", parts: [{ text: base }] }]
      })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (d) {
          var out = d && d.candidates && d.candidates[0].content.parts[0].text;
          speak(out || base);
        })
        .catch(function () { speak(base); });
    } else {
      speak(base);
    }
  }

  /* ---------- 카카오 실제 지도 ---------- */
  var kakaoMapsReady = false;

  function subwayColor(name) {
    var n = name || "";
    if (n.indexOf("1호선") !== -1) return "#0052A4";
    if (n.indexOf("2호선") !== -1) return "#00A84D";
    if (n.indexOf("3호선") !== -1) return "#EF7C1C";
    if (n.indexOf("4호선") !== -1) return "#00A5DE";
    if (n.indexOf("5호선") !== -1) return "#996CAC";
    if (n.indexOf("6호선") !== -1) return "#CD7C2F";
    if (n.indexOf("7호선") !== -1) return "#747F00";
    if (n.indexOf("8호선") !== -1) return "#E6186C";
    if (n.indexOf("9호선") !== -1) return "#BDB092";
    if (n.indexOf("신분당") !== -1) return "#D4003B";
    if (n.indexOf("분당") !== -1) return "#F5A200";
    if (n.indexOf("경의") !== -1) return "#77C4A3";
    return "#7c39b0";
  }

  function ensureKakaoMaps(cb) {
    if (kakaoMapsReady) { cb(); return; }
    if (typeof kakao === "undefined" || !kakao.maps) return; // SDK 로드 실패(로컬 실행 등) → 그림 지도 유지
    kakao.maps.load(function () {
      kakaoMapsReady = true;
      cb();
    });
  }

  function mapLabel(text) {
    return '<div class="map-label">' + text + "</div>";
  }

  function mountMaps() {
    ensureKakaoMaps(function () {
      var s = state.settings;

      if (state.screen === "station") {
        var el = document.querySelector(".station-map");
        var lat = parseFloat(s.lat), lng = parseFloat(s.lng);
        if (el && isFinite(lat) && isFinite(lng)) {
          el.classList.add("real-map");
          el.innerHTML = "";
          var pos = new kakao.maps.LatLng(lat, lng);
          var map = new kakao.maps.Map(el, { center: pos, level: 3 });   // 50m 축척: 건물 단위로 보임
          map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
          new kakao.maps.Marker({ position: pos, map: map });
          new kakao.maps.CustomOverlay({
            position: pos,
            content: mapLabel(s.stationName + " " + (s.stationId || "")),
            yAnchor: 2.4
          }).setMap(map);
        }
      }

      // 목적지 확인 화면: 현재 선택된 후보 위치를 지도로 표시
      if (state.screen === "routes" && state.destConfirm && state.destConfirm.candidates.length) {
        var elc = document.querySelector(".confirm-map");
        var c0 = state.destConfirm.candidates[state.destConfirm.sel || 0];
        var clat = parseFloat(c0.y), clng = parseFloat(c0.x);
        if (elc && isFinite(clat) && isFinite(clng)) {
          elc.classList.add("real-map");
          elc.innerHTML = "";
          var cpos = new kakao.maps.LatLng(clat, clng);
          var cmap = new kakao.maps.Map(elc, { center: cpos, level: 4 });
          cmap.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
          new kakao.maps.Marker({ position: cpos, map: cmap });
          new kakao.maps.CustomOverlay({ position: cpos, content: mapLabel(c0.name), yAnchor: 2.4 }).setMap(cmap);
        }
      }

      if (state.screen === "routeDetail" && state.route && state.route.dest && state.route.start) {
        var el2 = document.querySelector(".route-map");
        var r = state.route;
        var path = currentPath();
        var sLat = parseFloat(r.start.y), sLng = parseFloat(r.start.x);
        var eLat = parseFloat(r.dest.y), eLng = parseFloat(r.dest.x);
        if (el2 && path && isFinite(sLat) && isFinite(sLng) && isFinite(eLat) && isFinite(eLng)) {
          el2.classList.add("real-map");
          el2.innerHTML = "";
          var p1 = new kakao.maps.LatLng(sLat, sLng);
          var p2 = new kakao.maps.LatLng(eLat, eLng);
          var map2 = new kakao.maps.Map(el2, { center: p2, level: 7 });
          map2.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
          new kakao.maps.Marker({ position: p1, map: map2 });
          new kakao.maps.Marker({ position: p2, map: map2 });
          new kakao.maps.CustomOverlay({ position: p1, content: mapLabel(s.stationName), yAnchor: 2.4 }).setMap(map2);
          new kakao.maps.CustomOverlay({ position: p2, content: mapLabel(r.destination), yAnchor: 2.4 }).setMap(map2);
          var bounds = new kakao.maps.LatLngBounds();
          bounds.extend(p1);
          bounds.extend(p2);

          // 지도 왼쪽 아래 범례: 이 경로에 실제 나오는 구간들만 표시
          (function () {
            var koLang = state.language === "KO";
            var items = [];
            var walkAdded = false;
            path.steps.forEach(function (st) {
              if (st.type === "walk") {
                if (!walkAdded) {
                  items.push("<span><i class='line-sample line-walk'></i>" + (koLang ? "도보" : "Walk") + "</span>");
                  walkAdded = true;
                }
              } else {
                var color = st.type === "subway" ? subwayColor(st.line) : "#0b4dc9";
                items.push("<span><i class='line-sample' style='background:" + color + "'></i>" + st.line + "</span>");
              }
            });
            var legend = document.createElement("div");
            legend.className = "map-legend";
            legend.innerHTML = items.join("");
            el2.appendChild(legend);
          })();

          var walkLine = function (from, to) {
            new kakao.maps.Polyline({
              path: [from, to],
              strokeWeight: 4,
              strokeColor: "#7a8698",
              strokeOpacity: 0.85,
              strokeStyle: "shortdot"     // 도보 구간은 회색 점선
            }).setMap(map2);
          };

          var drawStraight = function () {
            walkLine(p1, p2);
            map2.setBounds(bounds, 60);
          };

          var drawLanes = function (lanes) {
            var legs = transitLegs(path);
            var prev = p1;
            lanes.forEach(function (lane, i) {
              var pts = lane.points.map(function (g) { return new kakao.maps.LatLng(g.y, g.x); });
              if (!pts.length) return;
              walkLine(prev, pts[0]);   // 이전 지점 → 승차 지점 도보
              var leg = legs[i];
              var color = leg && leg.type === "subway" ? subwayColor(leg.line) : "#0b4dc9";
              new kakao.maps.Polyline({
                path: pts,
                strokeWeight: 6,
                strokeColor: color,
                strokeOpacity: 0.9        // 버스·지하철 구간은 실선 (지하철은 노선 색)
              }).setMap(map2);
              pts.forEach(function (pt) { bounds.extend(pt); });
              if (leg) {
                new kakao.maps.CustomOverlay({
                  position: pts[Math.floor(pts.length / 2)],
                  content: '<div class="map-line-chip" style="background:' + color + '">' + leg.line + "</div>",
                  yAnchor: 0.5
                }).setMap(map2);
              }
              prev = pts[pts.length - 1];
            });
            walkLine(prev, p2);          // 하차 지점 → 목적지 도보
            map2.setBounds(bounds, 60);
          };

          if (path._lanes) {
            drawLanes(path._lanes);
          } else if (path.mapObj) {
            fetch("/api/route-lane?mapObj=" + encodeURIComponent(path.mapObj))
              .then(function (res) { return res.json(); })
              .then(function (d) {
                if (d && d.ok && d.lanes && d.lanes.length) {
                  path._lanes = d.lanes;
                  drawLanes(d.lanes);
                } else {
                  drawStraight();
                }
              })
              .catch(drawStraight);
          } else {
            drawStraight();
          }
        }
      }
    });
  }

  /* ---------- 주변 시설 (정류장 정보 화면) ---------- */
  var nearbyLoading = false;

  function ensureNearby() {
    var s = state.settings;
    if (state.nearby || nearbyLoading || !s.lat || !s.lng) return;
    nearbyLoading = true;
    fetch("/api/nearby?x=" + encodeURIComponent(s.lng) + "&y=" + encodeURIComponent(s.lat))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        nearbyLoading = false;
        if (d && d.ok && d.places && d.places.length) {
          state.nearby = d.places;
          if (state.screen === "station") render();
        }
      })
      .catch(function () { nearbyLoading = false; });
  }

  /* ---------- 정류장 좌표 보정 ----------
     정류장 ID를 직접 입력한 경우 좌표가 기본값(광화문)으로 남아
     지도·길찾기 출발점이 어긋나는 문제를 자동으로 고친다 */
  function ensureStationCoords() {
    var s = state.settings;
    if (!s.cityCode || !s.stationId || !s.stationName) return;
    var isDefault = s.lat === DEFAULT_SETTINGS.lat && s.lng === DEFAULT_SETTINGS.lng;
    if (s.lat && s.lng && !isDefault) return;
    var searchName = s.stationName.split(".")[0].split("(")[0].trim();
    fetch("/api/find-station?cityCode=" + encodeURIComponent(s.cityCode) + "&name=" + encodeURIComponent(searchName))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok || !d.stations) return;
        var match = d.stations.filter(function (st) {
          return String(st.nodeId) === String(s.stationId);
        })[0];
        if (match && match.lat && match.lng) {
          s.lat = String(match.lat);
          s.lng = String(match.lng);
          state.nearby = null;
          try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
          if (state.screen === "station" || state.screen === "routeDetail") render();
        }
      })
      .catch(function () {});
  }

  /* ---------- KPI 집계 (관리자용) ---------- */
  function loadKpi() {
    fetch("/api/kpi")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) state.kpi = d.kpi;
        else state.kpiError = (d && d.error) || "KPI 집계에 실패했습니다.";
        if (state.screen === "kpi") render();
      })
      .catch(function () {
        state.kpiError = "KPI 서버에 연결하지 못했습니다. 배포된 사이트에서 확인해 주세요.";
        if (state.screen === "kpi") render();
      });
  }

  var LOG_PAGE_SIZE = 10;

  function loadLog() {
    var url = "/api/events?limit=" + LOG_PAGE_SIZE + "&offset=" + (state.logPage * LOG_PAGE_SIZE);
    if (state.eventsDevice) url += "&device=" + encodeURIComponent(state.eventsDevice);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        state.events = (d && d.ok && d.events) ? d.events : [];
        state.eventsTotal = (d && typeof d.total === "number") ? d.total : null;
        if (state.screen === "log") render();
      })
      .catch(function () { state.events = []; if (state.screen === "log") render(); });
  }

  function deleteEvent(id) {
    fetch("/api/events?id=" + encodeURIComponent(id), { method: "DELETE" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) {
          state.events = null;   // 현재 페이지 다시 로드 (뒤 기록이 앞으로 당겨짐)
          render();
          loadLog();
        }
      })
      .catch(function () {});
  }

  function renderKpi() {
    var k = state.kpi;
    if (state.kpiError) {
      return '<div class="kpi-view content-view"><p class="route-error">' + state.kpiError + "</p></div>";
    }
    if (!k) {
      return '<div class="kpi-view content-view"><div class="result-heading compact-heading"><div>' +
        '<p class="eyebrow">KIOSK KPI</p><h1>집계 중…</h1></div></div></div>';
    }
    function tile(label, value, sub) {
      return '<div class="kpi-tile"><span>' + label + "</span><strong>" + value + "</strong>" +
        (sub ? "<small>" + sub + "</small>" : "") + "</div>";
    }
    function fmtPct(v) { return v == null ? "—" : v + "%"; }
    function barList(title, entries) {
      if (!entries || !entries.length) return "";
      var max = entries[0][1] || 1;
      return '<div class="kpi-bars"><h2>' + title + "</h2>" + entries.map(function (e) {
        var w = Math.max(4, Math.round(e[1] / max * 100));
        return '<div class="kpi-bar-row"><span class="kpi-bar-label">' + e[0] + "</span>" +
          '<div class="kpi-bar-track"><div class="kpi-bar-fill" style="width:' + w + '%"></div></div>' +
          "<b>" + e[1] + "</b></div>";
      }).join("") + "</div>";
    }
    var period = k.period
      ? new Date(k.period.from).toLocaleDateString("ko-KR") + " ~ " + new Date(k.period.to).toLocaleDateString("ko-KR") + " · 이벤트 " + k.totalEvents + "건"
      : "아직 수집된 데이터가 없습니다.";
    return (
      '<div class="kpi-view content-view">' +
        '<div class="result-heading compact-heading">' +
          "<div>" +
            '<p class="eyebrow">KIOSK KPI</p>' +
            "<h1>사용 데이터 통계</h1>" +
            '<p class="settings-intro">' + period + "</p>" +
          "</div>" +
          '<div class="kpi-head-actions">' +
            '<button class="listen-button" data-action="log">' + icon("map", 24) + "로그</button>" +
            '<button class="listen-button" data-action="kpi-refresh">' + icon("refresh", 26) + "새로고침</button>" +
          "</div>" +
        "</div>" +
        '<div class="kpi-grid">' +
          tile("사용 세션", k.sessions + "회", "기기 방문 기준") +
          tile("음성 인식 성공률", fmtPct(k.voice.successRate), "시도 " + k.voice.attempts + "회 · 평균 신뢰도 " + (k.voice.avgConfidence == null ? "—" : k.voice.avgConfidence + "%")) +
          tile("AI 인식 품질 (문장 정확도)", fmtPct(k.stt.clearRate), "판정 " + k.stt.judged + "건 · 평균 " + (k.stt.avgQuality == null ? "—" : k.stt.avgQuality + "/5")) +
          tile("AI 의도 파악", k.ai.calls + "건", "평균 응답 " + (k.ai.avgMs == null ? "—" : k.ai.avgMs + "ms") + " · 대체동작 " + fmtPct(k.ai.fallbackRate)) +
          tile("길찾기 성공률", fmtPct(k.route.successRate), "성공 " + k.route.searches + " · 실패 " + k.route.fails) +
          tile("목적지 음성 확인 성공률", fmtPct(k.destConfirm.recogRate), "확인 " + k.destConfirm.total + "회 · 첫 제안 정확 " + fmtPct(k.destConfirm.topRate) + " · 재요청 " + k.destConfirm.rejected) +
          tile("추천 경로 채택률", fmtPct(k.route.topPickRate), "경로 상세보기 " + k.route.selects + "회") +
          tile("만족도 (5점 만점)", (k.rating.avg == null ? "—" : k.rating.avg.toFixed(2) + "점"), "평가 " + k.rating.count + "건") +
        "</div>" +
        (function () {
          var d = k.rating.dist || [];
          if (!k.rating.count) return "";
          var entries = [5, 4, 3, 2, 1].map(function (n) { return [n + "점", d[n - 1] || 0]; });
          return barList("별점 분포", entries);
        })() +
        barList("언어별 선택 횟수", k.langs) +
        barList("인기 목적지 TOP 5", k.dests) +
        barList("이탈(5분 무응답)이 발생한 화면", k.idles) +
        (function () {
          var cs = k.rating.comments || [];
          if (!cs.length) return "";
          return '<div class="kpi-bars"><h2>최근 의견</h2>' +
            cs.map(function (c) { return '<p class="kpi-comment">“' + esc(String(c)) + '”</p>'; }).join("") +
            "</div>";
        })() +
      "</div>"
    );
  }

  var EVENT_LABELS = {
    session_start: "세션 시작", screen_view: "화면 이동", language_select: "언어 선택",
    voice_result: "음성 인식", voice_error: "인식 오류", ai_intent: "AI 의도",
    ai_fallback: "AI 대체", keyword_intent: "키워드 의도", stt_quality: "인식 품질",
    route_search: "길찾기", route_search_fail: "길찾기 실패", route_select: "경로 선택",
    dest_confirm_shown: "목적지 확인", dest_pick: "목적지 선택", dest_confirm_result: "확인 결과",
    idle_timeout: "5분 이탈", rating: "만족도 평가"
  };

  function renderLog() {
    var totalPages = state.eventsTotal != null ? Math.max(1, Math.ceil(state.eventsTotal / LOG_PAGE_SIZE)) : null;
    var head =
      '<div class="log-view content-view">' +
        '<div class="result-heading compact-heading">' +
          "<div>" +
            '<p class="eyebrow">DATA LOG</p>' +
            "<h1>개별 기록 · 삭제</h1>" +
            '<p class="settings-intro">' +
              (state.eventsTotal != null ? "전체 " + state.eventsTotal + "건" : "기록 목록") +
              (state.eventsDevice ? " · 사용자 “" + esc(state.eventsDevice.replace(/^dev-/, "")) + "”만 표시 중" : "") +
            "</p>" +
          "</div>" +
          '<div class="kpi-head-actions">' +
            (state.eventsDevice ? '<button class="listen-button" data-action="events-alldevice">전체 사용자</button>' : "") +
            '<button class="listen-button" data-action="log-refresh">' + icon("refresh", 24) + "새로고침</button>" +
          "</div>" +
        "</div>";

    if (!state.events) return head + '<p class="station-msg">기록을 불러오는 중…</p></div>';
    if (!state.events.length) {
      return head + '<p class="station-msg">표시할 기록이 없습니다.</p>' +
        (state.logPage > 0 ? '<div class="log-pager"><button class="secondary-button" data-action="log-prev">‹ 이전</button></div>' : "") +
        "</div>";
    }

    var rows = state.events.map(function (e) {
      var when = new Date(e.created_at).toLocaleString("ko-KR", {
        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      var label = EVENT_LABELS[e.event_type] || e.event_type;
      var pay = "";
      try { pay = JSON.stringify(e.payload || {}); } catch (x) { pay = ""; }
      if (pay === "{}") pay = "";
      var dev = (e.device_id || "").replace(/^dev-/, "");
      return (
        '<div class="event-row">' +
          '<span class="event-time">' + when + "</span>" +
          '<button class="event-dev" data-action="events-device" data-device="' + esc(e.device_id || "") + '" title="이 사용자 기록만 보기">' + esc(dev || "-") + "</button>" +
          '<span class="event-type">' + esc(label) + "</span>" +
          '<span class="event-payload" title="' + esc(pay) + '">' + esc(pay.slice(0, 90)) + "</span>" +
          '<button class="event-del" data-action="event-delete" data-id="' + e.id + '" aria-label="삭제">' + icon("x", 20) + "</button>" +
        "</div>"
      );
    }).join("");

    var hasNext = totalPages != null ? (state.logPage + 1 < totalPages) : (state.events.length === LOG_PAGE_SIZE);
    var pager =
      '<div class="log-pager">' +
        '<button class="secondary-button" data-action="log-prev"' + (state.logPage <= 0 ? " disabled" : "") + ">‹ 이전</button>" +
        '<span class="log-page-num">' + (state.logPage + 1) + (totalPages != null ? " / " + totalPages : "") + " 페이지</span>" +
        '<button class="secondary-button" data-action="log-next"' + (hasNext ? "" : " disabled") + ">다음 ›</button>" +
      "</div>";

    return head + '<div class="event-list">' + rows + "</div>" + pager + "</div>";
  }

  /* ---------- 정류장 검색 (관리자 설정) ---------- */
  var citiesLoading = false;
  function ensureCities() {
    if (state.cities || citiesLoading) return;
    citiesLoading = true;
    fetch("/api/find-station")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        citiesLoading = false;
        if (d && d.ok && d.cities && d.cities.length) {
          state.cities = d.cities;
          if (state.screen === "settings") render();
        }
      })
      .catch(function () { citiesLoading = false; });
  }

  /* ---------- Gemini AI 연동 (키는 Vercel 환경변수 GEMINI_API_KEY, /api/gemini 프록시 사용) ---------- */
  function geminiCall(body) {
    return fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  function checkGemini() {
    fetch("/api/gemini")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        state.geminiAvailable = !!(d && d.configured);
        if (state.screen === "settings") render();
      })
      .catch(function () { state.geminiAvailable = false; });
  }

  function buildGeminiSystemPrompt() {
    var s = state.settings;
    var langName = { KO: "한국어", EN: "English", JA: "日本語", ZH: "中文" }[state.language];
    var busInfo = getBuses().map(function (b) {
      var dir = typeof b.direction === "string" ? b.direction : b.direction.KO;
      return b.number + "번 (" + dir + "): " +
        (b.minutes == null ? (b.msg1 || "정보 없음") : b.minutes + "분 후 도착") +
        (b.next != null ? ", 다음 버스 " + b.next + "분 후" : "") +
        ", " + (b.lowFloor ? "저상버스" : "일반버스");
    }).join("\n");
    var basePrompt = (s.prompt || "").replace(/\[기본 위치\]/g, s.stationName);
    return basePrompt +
      "\n\n[정류장 정보]\n이름: " + s.stationName + " (" + s.stationId + ")\n주소: " + s.address +
      "\n\n[버스 도착 정보]\n" + busInfo +
      "\n\n[길찾기 정보]\n강남역 방면: 470번 직행 (4분 후 도착, 약 32분 소요, 12개 정류장, 환승 없음), 대안 741번 (7분 후 도착, 약 37분 소요, 14개 정류장)." +
      "\n\n사용자의 말을 듣고 반드시 아래 형식의 JSON 하나만 출력하세요:\n" +
      '{"screen": "arrival | routes | routeDetail | station | home", "speech": "음성으로 읽어줄 답변", "destination": "목적지 이름", "routePref": "simple | fast", "sttQuality": 1~5, "sttClear": true/false}\n' +
      "- screen 선택 기준: 버스 도착 시간 질문이면 arrival, 어딘가로 가는 방법·길찾기 질문이면 routes, 특정 경로의 자세한 탑승 방법이면 routeDetail, 정류장 위치·주변 시설 질문이면 station, 인사말이나 그 외 질문이면 home\n" +
      "- destination: 길찾기 질문일 때만 목적지 이름을 넣으세요 (예: 수원역). 그 외에는 빈 문자열.\n" +
      "- 장소 이름(동네, 역, 건물 등)이 포함된 질문은 대부분 길찾기(routes)입니다. '안녕하세요' 같은 명확한 인사말일 때만 home을 쓰세요.\n" +
      "- routePref: 사용자가 '빨리', '급해', '가장 빠르게' 같은 서두르는 표현을 쓰면 fast, 그 외에는 simple (환승과 걷기가 적은 쉬운 길 우선).\n" +
      "- sttQuality: 음성 인식된 이 문장이 버스 정류장에서 할 만한 자연스럽고 말이 되는 요청인지 1~5로 평가하세요 (5=완전히 자연스럽고 명확함, 3=대체로 알아들을 수 있음, 1=깨졌거나 뜻이 통하지 않아 오인식으로 보임).\n" +
      "- sttClear: 오인식 없이 제대로 인식된 문장으로 보이면 true, 어색하거나 깨져 보이면 false.\n" +
      "- 길찾기 질문이면 speech는 '경로를 찾아드릴게요' 수준으로 아주 짧게 하세요. 상세 안내는 시스템이 따로 말합니다.\n" +
      "- speech: 반드시 " + langName + "(으)로, 노약자가 이해하기 쉬운 1~3개의 짧은 문장으로 답하세요.";
  }

  // Gemini 결과(의도)를 화면/음성에 반영 — 텍스트 STT·오디오 인식 공용
  function applyIntent(result, userText, t0, source) {
    logEvent("ai_intent", {
      query: userText,
      screen: result.screen || "",
      destination: result.destination || "",
      routePref: result.routePref || "",
      source: source || "stt",
      ms: Date.now() - t0
    });
    var q = Number(result.sttQuality);
    if (isFinite(q) && q >= 1 && q <= 5) {
      logEvent("stt_quality", {
        query: userText,
        quality: Math.round(q),
        clear: result.sttClear !== false && q >= 3,
        source: source || "stt"
      });
    }
    var routeAsk = /(어떻게 가|가는 ?법|가고 ?싶|까지|가려면|how (do|can) i get|way to|行き方|怎么去)/i.test(userText || "");
    if (result.screen === "home" && (result.destination || routeAsk)) result.screen = "routes";
    if (result.screen === "routes" && result.destination) {
      confirmDestination(result.destination, result.routePref === "fast" ? "fast" : "simple");
      return;
    }
    var valid = ["arrival", "routes", "routeDetail", "station", "home"];
    setScreen(valid.indexOf(result.screen) !== -1 ? result.screen : "routes", !!result.speech);
    if (result.speech) speak(result.speech);
  }

  function askGemini(userText) {
    var token = ++aiRequestToken;
    var t0 = Date.now();
    geminiCall({
      systemInstruction: { parts: [{ text: buildGeminiSystemPrompt() }] },
      contents: [{ role: "user", parts: [{ text: userText }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        return JSON.parse(data.candidates[0].content.parts[0].text);
      })
      .then(function (result) {
        if (token !== aiRequestToken || state.screen !== "listening") return;
        applyIntent(result, userText, t0, "stt");
      })
      .catch(function () {
        if (token !== aiRequestToken || state.screen !== "listening") return;
        logEvent("ai_fallback", { query: userText, ms: Date.now() - t0 });
        interpretCommand(userText);
      });
  }

  /* ---------- Gemini 오디오 인식 (브라우저 STT 대신 녹음→Gemini 전사+의도) ----------
     Gemini는 webm을 안 받아 WAV(16kHz 모노)로 변환해 보낸다.
     녹음 실패·미지원·오류 시에는 브라우저 STT로 자동 대체 */
  var mediaStream = null, mediaRecorder = null, audioChunks = [], recAudioCtx = null;
  var recSilenceTimer = null, recMaxTimer = null, recSpoke = false;

  function stopGeminiVoice() {
    try { if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop(); } catch (e) {}
  }

  function cleanupRec() {
    state.recording = false;
    if (recSilenceTimer) { clearInterval(recSilenceTimer); recSilenceTimer = null; }
    if (recMaxTimer) { clearTimeout(recMaxTimer); recMaxTimer = null; }
    if (mediaStream) { try { mediaStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} mediaStream = null; }
    if (recAudioCtx) { try { recAudioCtx.close(); } catch (e) {} recAudioCtx = null; }
  }

  function startGeminiVoice() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined" ||
        !(window.AudioContext || window.webkitAudioContext)) {
      startListening(); // 녹음 미지원 → STT
      return;
    }
    state.transcript = "";
    state.screen = "listening";
    state.voiceSupported = true;
    render();

    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      mediaStream = stream;
      audioChunks = [];
      recSpoke = false;
      var token = ++aiRequestToken;

      var mime = "";
      ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].some(function (m) {
        if (MediaRecorder.isTypeSupported(m)) { mime = m; return true; } return false;
      });
      mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (e) { if (e.data && e.data.size) audioChunks.push(e.data); };
      mediaRecorder.onstop = function () {
        cleanupRec();
        if (token !== aiRequestToken) return;
        var blob = new Blob(audioChunks, { type: (mediaRecorder && mediaRecorder.mimeType) || "audio/webm" });
        if (!blob.size) { interpretFallback(token); return; }
        state.transcript = state.language === "KO" ? "인식하는 중…" : "Recognizing…";
        render();
        blobToWav(blob).then(function (wavB64) {
          sendAudioToGemini(wavB64, token);
        }).catch(function () { interpretFallback(token); });
      };

      // 무음 감지 자동 종료
      var AC = window.AudioContext || window.webkitAudioContext;
      recAudioCtx = new AC();
      var src = recAudioCtx.createMediaStreamSource(stream);
      var analyser = recAudioCtx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      var buf = new Uint8Array(analyser.frequencyBinCount);
      var quietMs = 0;
      recSilenceTimer = window.setInterval(function () {
        analyser.getByteTimeDomainData(buf);
        var sum = 0;
        for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / buf.length);
        if (rms > 0.045) { recSpoke = true; quietMs = 0; }
        else if (recSpoke) {
          quietMs += 150;
          if (quietMs >= 1100) stopGeminiVoice(); // 말 끝난 뒤 약 1.1초 침묵이면 종료
        }
      }, 150);
      recMaxTimer = window.setTimeout(stopGeminiVoice, 9000); // 최대 9초

      mediaRecorder.start();
      state.recording = true;
      if (state.screen === "listening") render();
    }).catch(function () {
      cleanupRec();
      startListening(); // 마이크 권한 거부 등 → STT
    });
  }

  function interpretFallback(token) {
    if (token !== aiRequestToken) return;
    logEvent("voice_error", { error: "audio-empty" });
    startListening();
  }

  function sendAudioToGemini(wavB64, token) {
    var t0 = Date.now();
    geminiCall({
      systemInstruction: { parts: [{ text: buildGeminiSystemPrompt() +
        "\n\n[중요] 아래는 사용자의 실제 음성입니다. 먼저 음성을 정확히 받아쓰고(transcript), 지명·버스번호 같은 고유명사는 한국 지명 기준으로 가장 그럴듯하게 판단하세요. 그런 다음 위 규칙대로 JSON을 만드세요. JSON에 \"transcript\" 항목(받아쓴 문장)도 반드시 포함하세요." }] },
      contents: [{ role: "user", parts: [
        { inlineData: { mimeType: "audio/wav", data: wavB64 } },
        { text: "이 음성을 처리해 주세요." }
      ] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
    })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (data) { return JSON.parse(data.candidates[0].content.parts[0].text); })
      .then(function (result) {
        if (token !== aiRequestToken || state.screen !== "listening") return;
        var transcript = result.transcript || "";
        logEvent("voice_result", { transcript: transcript, confidence: null, source: "gemini-audio" });
        state.transcript = transcript;
        render();
        applyIntent(result, transcript, t0, "gemini-audio");
      })
      .catch(function () {
        if (token !== aiRequestToken || state.screen !== "listening") return;
        startListening(); // Gemini 오디오 실패 → STT 대체
      });
  }

  // webm/ogg Blob → 16kHz 모노 16bit WAV(base64)
  function blobToWav(blob) {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = new AC();
    return blob.arrayBuffer().then(function (ab) {
      return ctx.decodeAudioData(ab);
    }).then(function (audioBuf) {
      var ch0 = audioBuf.getChannelData(0);
      var srcRate = audioBuf.sampleRate, dstRate = 16000;
      var ratio = srcRate / dstRate;
      var outLen = Math.floor(ch0.length / ratio);
      var pcm = new Int16Array(outLen);
      for (var i = 0; i < outLen; i++) {
        var s = ch0[Math.floor(i * ratio)] || 0;
        s = Math.max(-1, Math.min(1, s));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      try { ctx.close(); } catch (e) {}
      // WAV 헤더
      var bytes = new Uint8Array(44 + pcm.length * 2);
      var dv = new DataView(bytes.buffer);
      function ws(off, str) { for (var k = 0; k < str.length; k++) dv.setUint8(off + k, str.charCodeAt(k)); }
      ws(0, "RIFF"); dv.setUint32(4, 36 + pcm.length * 2, true); ws(8, "WAVE");
      ws(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
      dv.setUint32(24, dstRate, true); dv.setUint32(28, dstRate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
      ws(36, "data"); dv.setUint32(40, pcm.length * 2, true);
      for (var j = 0; j < pcm.length; j++) dv.setInt16(44 + j * 2, pcm[j], true);
      // base64 인코딩
      var bin = "";
      for (var b = 0; b < bytes.length; b++) bin += String.fromCharCode(bytes[b]);
      return btoa(bin);
    });
  }

  function setScreen(next, silent) {
    if (state.screen !== next) logEvent("screen_view", { screen: next, from: state.screen });
    state.screen = next;
    render();
    if (!silent) announceScreen(next);
  }

  /* ---------- 화면 진입 시 음성 안내 (시각장애인·어르신·외국인 배려) ---------- */
  function arrivalsSpeechText() {
    var lang = state.language;
    var list = getBuses().filter(function (b) { return b.minutes != null; }).slice(0, 3);
    if (!list.length) {
      return {
        KO: "지금은 도착 예정인 버스 정보가 없습니다.",
        EN: "There is no arrival information right now.",
        JA: "現在、到着予定のバス情報はありません。",
        ZH: "目前没有公交到站信息。"
      }[lang];
    }
    if (lang === "KO") {
      return list.map(function (b) {
        return b.number + "번 버스는 " + (b.minutes <= 0 ? "곧" : b.minutes + "분 뒤");
      }).join(", ") + " 도착합니다.";
    }
    if (lang === "JA") {
      return list.map(function (b) {
        return b.number + "番バスは" + (b.minutes <= 0 ? "まもなく" : b.minutes + "分後に");
      }).join("、") + "到着します。";
    }
    if (lang === "ZH") {
      return list.map(function (b) {
        return b.number + "路公交车" + (b.minutes <= 0 ? "即将" : b.minutes + "分钟后");
      }).join("，") + "到站。";
    }
    return list.map(function (b) {
      return "Bus " + b.number + " arrives " + (b.minutes <= 0 ? "soon" : "in " + b.minutes + " minutes");
    }).join(", ") + ".";
  }

  function announceArrivals() {
    speak(arrivalsSpeechText());
  }

  /* 의견을 음성으로 받아 입력칸에 채운다 (평가 화면) */
  function dictateComment(ctx) {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var ta = document.getElementById("rating-comment-" + ctx);
    if (!Recognition) {
      if (ta) ta.setAttribute("placeholder", "이 기기에서는 음성 입력을 지원하지 않아요. 직접 입력해 주세요.");
      return;
    }
    var micBtn = document.querySelector('.rating-mic[data-ctx="' + ctx + '"]');
    if (micBtn) micBtn.classList.add("mic-active");
    var rec = new Recognition();
    rec.lang = localeFor(state.language);
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = function (e) {
      var text = e.results[0][0].transcript;
      var box = document.getElementById("rating-comment-" + ctx);
      var prev = box ? box.value : (state.ratingDraft[ctx] || "");
      var combined = prev ? (prev + " " + text) : text;
      state.ratingDraft[ctx] = combined;
      if (box) box.value = combined;
    };
    rec.onerror = function () {};
    rec.onend = function () { recognitionRef = null; if (micBtn) micBtn.classList.remove("mic-active"); };
    recognitionRef = rec;
    try { rec.start(); } catch (e) { if (micBtn) micBtn.classList.remove("mic-active"); }
  }

  /* ---------- 만족도 평가 (별점 5점 + 의견) ---------- */
  function ratingBlock(ctx) {
    var ko = state.language === "KO";
    var lang = state.language;
    if (state.rated[ctx]) {
      return '<div class="rating-block rating-done">' +
        (ko ? "소중한 의견 감사합니다!" : lang === "JA" ? "ご意見ありがとうございます！" : lang === "ZH" ? "感谢您的反馈！" : "Thank you for your feedback!") +
        "</div>";
    }
    var selected = state.ratingStars[ctx] || 0;
    var stars = "";
    for (var i = 1; i <= 5; i++) {
      stars += '<button class="star-btn' + (i <= selected ? " star-on" : "") + '" data-action="rate-star" data-ctx="' +
        esc(ctx) + '" data-value="' + i + '" aria-label="' + i + (ko ? "점" : " stars") + '">' +
        (i <= selected ? "★" : "☆") + "</button>";
    }
    var question = ko ? "이 안내에 얼마나 만족하시나요?"
      : lang === "JA" ? "このご案内にどのくらい満足されましたか？"
      : lang === "ZH" ? "您对此信息的满意度如何？"
      : "How satisfied are you with this guidance?";
    var placeholder = ko ? "의견을 남겨주세요 (선택)"
      : lang === "JA" ? "ご意見をお書きください（任意）"
      : lang === "ZH" ? "请留下您的意见（可选）"
      : "Leave a comment (optional)";
    var submitLabel = ko ? "평가 보내기" : lang === "JA" ? "送信" : lang === "ZH" ? "提交" : "Submit";
    var micLabel = ko ? "음성으로 의견 말하기" : lang === "JA" ? "音声で意見を話す" : lang === "ZH" ? "用语音留言" : "Speak your comment";
    return (
      '<div class="rating-block rating-stars-block">' +
        '<span class="rating-q">' + question + "</span>" +
        '<div class="star-row" data-ctx="' + esc(ctx) + '">' + stars + "</div>" +
        '<div class="rating-comment-row">' +
          '<textarea class="rating-comment" id="rating-comment-' + esc(ctx) + '" rows="2" placeholder="' + placeholder + '"></textarea>' +
          '<button class="rating-mic" data-action="rate-voice" data-ctx="' + esc(ctx) + '" aria-label="' + micLabel + '" title="' + micLabel + '">' + icon("mic", 26) + "</button>" +
        "</div>" +
        '<button class="primary-button rating-submit" data-action="rate-submit" data-ctx="' + esc(ctx) + '"' +
          (selected ? "" : " disabled") + ">" + submitLabel + "</button>" +
      "</div>"
    );
  }

  function speakStationInfo() {
    var s = state.settings;
    var lang = state.language;
    var text = {
      KO: "이곳은 " + s.stationName + " 정류장입니다. 정류장 번호는 " + s.stationId + "입니다. 주변 시설은 화면의 지도에서 확인하실 수 있어요.",
      EN: "This is " + s.stationName + " bus stop, stop number " + s.stationId + ". You can see nearby places on the map.",
      JA: "ここは" + s.stationName + "バス停です。停留所番号は" + s.stationId + "です。周辺施設は画面の地図でご確認ください。",
      ZH: "这里是" + s.stationName + "公交车站，站点编号" + s.stationId + "。周边设施请查看屏幕上的地图。"
    }[lang];
    speak(text);
  }

  function announceScreen(screen) {
    var t = STRINGS[state.language];
    var lang = state.language;
    switch (screen) {
      case "home":
        speak(t.help + " " + t.intro);
        break;
      case "language":
        speak(t.chooseLanguage);
        break;
      case "arrival":
        announceArrivals();
        break;
      case "station":
        speakStationInfo();
        break;
      case "routes":
        if (state.routeLoading) {
          speak({ KO: "경로를 찾고 있어요. 잠시만 기다려 주세요.", EN: "Finding your route. One moment please.", JA: "ルートを検索しています。少々お待ちください。", ZH: "正在查找路线，请稍候。" }[lang]);
        } else if (state.route) {
          speakRouteSummary();
        } else {
          speak({ KO: "어디로 가시나요? 목적지를 말하거나 입력해 주세요.", EN: "Where would you like to go? Say or type your destination.", JA: "どちらへ行かれますか？行き先を話すか入力してください。", ZH: "您要去哪里？请说出或输入目的地。" }[lang]);
        }
        break;
      case "routeDetail":
        if (state.route) speakRouteSummary();
        break;
      case "settings":
        speak("관리자 설정 화면입니다.");
        break;
      case "kpi":
        speak("사용 데이터 KPI 통계 화면입니다.");
        break;
      case "log":
        speak("개별 기록 화면입니다.");
        break;
      case "busRoute":
        break;
      case "saved":
        speak(lang === "KO" ? "설정이 저장되었습니다." : "Settings saved.");
        break;
    }
  }

  function goHome() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setScreen("home");
  }

  function goBack() {
    setScreen(state.screen === "routeDetail" ? "routes"
      : state.screen === "kpi" ? "settings"
      : state.screen === "log" ? "kpi"
      : state.screen === "busRoute" ? "arrival"
      : "home");
  }

  /* ---------- 음성 인식 ---------- */
  function interpretCommand(text) {
    var t = text.toLowerCase();
    var target;
    if (t.indexOf("도착") !== -1 || t.indexOf("arrival") !== -1 || t.indexOf("470") !== -1 || t.indexOf("버스 언제") !== -1) {
      target = "arrival";
    } else if (t.indexOf("정류장") !== -1 || t.indexOf("where am i") !== -1 || t.indexOf("현재 위치") !== -1) {
      target = "station";
    } else {
      target = "routes";
    }
    logEvent("keyword_intent", { query: text, screen: target });
    setScreen(target);
  }

  function startListening() {
    // 안내 음성이 나오는 중이면 즉시 중단 — 스피커 소리가 마이크에 섞여 인식을 오염시킴
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    state.transcript = "";
    state.screen = "listening";

    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      state.voiceSupported = false;
      render();
      return;
    }
    state.voiceSupported = true;
    render();
    startRecognitionCore();
  }

  /* 인식 시작(핵심) — 화면 전환·음성 정지는 호출부에서 처리 */
  function startRecognitionCore() {
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { state.voiceSupported = false; render(); return; }
    var rec = new Recognition();
    rec.lang = localeFor(state.language);
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = function (e) {
      var text = e.results[0][0].transcript;
      var confidence = e.results[0][0].confidence;
      logEvent("voice_result", {
        transcript: text,
        confidence: typeof confidence === "number" ? Math.round(confidence * 100) / 100 : null
      });
      state.transcript = text;
      render();
      if (state.destConfirm) {
        // 목적지 확인 중: "네" 또는 후보 이름을 말하면 그 후보 선택
        window.setTimeout(function () { handleConfirmVoice(text); }, 400);
      } else if (state.geminiAvailable) {
        askGemini(text);
      } else {
        window.setTimeout(function () { interpretCommand(text); }, 800);
      }
    };
    rec.onerror = function (e) {
      logEvent("voice_error", { error: (e && e.error) || "unknown" });
      state.voiceSupported = false;
      render();
    };
    rec.onend = function () { recognitionRef = null; };
    recognitionRef = rec;
    try { rec.start(); } catch (e) {
      state.voiceSupported = false;
      render();
    }
  }

  // 마이크: Gemini가 켜져 있으면 오디오 인식, 아니면 브라우저 STT
  function beginVoice() {
    if (state.geminiAvailable) startGeminiVoice();
    else startListening();
  }

  function cancelListening() {
    aiRequestToken++;               // 진행 중인 인식 결과 무시
    stopGeminiVoice();
    cleanupRec();
    if (recognitionRef) { try { recognitionRef.stop(); } catch (e) {} }
    recognitionRef = null;
    setScreen("home");
  }

  function openArrivalWithVoice() {
    setScreen("arrival");   // 화면 진입 안내가 실제 도착 정보를 음성으로 읽어줌
  }

  function selectLanguage(id) {
    state.language = id;
    try { window.localStorage.setItem(LANG_KEY, id); } catch (e) {}
    logEvent("language_select", { selected: id });
    setScreen("home", true);
    var msg = id === "KO" ? "한국어 안내를 시작합니다. 무엇을 도와드릴까요?"
      : id === "JA" ? "日本語の案内を開始します。何をお手伝いしましょうか？"
      : id === "ZH" ? "开始中文服务。需要什么帮助？"
      : "English guidance is now active. How can I help you?";
    window.setTimeout(function () { speak(msg); }, 80);
  }

  /* ---------- 화면 템플릿 ---------- */
  function renderTopbar() {
    var t = STRINGS[state.language];
    var s = state.settings;
    return (
      '<button class="brand" data-action="home" aria-label="' + t.home + '">' +
        '<span class="brand-mark">' + icon("bus", 26) + "</span>" +
        "<span>말하는 정류장</span>" +
      "</button>" +
      '<button class="station-pill" data-action="station">' +
        '<span class="status-dot"></span>' +
        "<span>" + s.stationName + " · " + s.stationId + "</span>" +
      "</button>" +
      '<div class="top-actions">' +
        '<span class="time" aria-label="현재 시각 ' + formatTime() + '">' + formatTime() + "</span>" +
        '<button class="language-button" data-action="language">' +
          icon("language", 25) + t.languageName + icon("arrow", 20) +
        "</button>" +
      "</div>"
    );
  }

  function renderFooter() {
    var ko = state.language === "KO";
    return (
      "<span>" + icon("speaker", 23) + (ko ? "모든 안내를 소리로 들을 수 있어요." : "Audio guidance is available on every screen.") + "</span>" +
      "<div>" +
        '<span class="demo-label">' + (state.liveBuses ? (ko ? "실시간 데이터" : "Live data") : (ko ? "시연 데이터" : "Demo data")) + "</span>" +
        '<button data-action="settings">' + icon("gear", 21) + (ko ? "관리자 설정" : "Settings") + "</button>" +
        "<span>" + (ko ? "긴급 문의 120" : "Help 120") + "</span>" +
      "</div>"
    );
  }

  function renderHome() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var stationLabel = state.settings.stationName +
      (ko ? " 버스정류장" : state.language === "JA" ? " バス停" : state.language === "ZH" ? " 公交车站" : " Bus Stop");
    return (
      '<div class="greeting">' +
        '<p class="eyebrow">' + stationLabel + "</p>" +
        "<h1>" + t.help + "</h1>" +
        "<p>" + t.intro + "</p>" +
      "</div>" +
      '<button class="voice-button" data-action="listen" aria-label="' + t.voice + '">' +
        '<span class="voice-icon">' + icon("mic", 66) + "</span>" +
        '<span class="voice-label">' + t.voice + "</span>" +
        '<span class="voice-hint">' + t.example + "</span>" +
      "</button>" +
      '<div class="quick-grid" aria-label="빠른 메뉴">' +
        '<button class="quick-card" data-action="arrival-voice">' +
          '<span class="quick-icon">' + icon("clock", 38) + "</span>" +
          "<span><strong>" + t.arrival + "</strong><small>" + t.arrivalHint + "</small></span>" +
          (function () {
            var b0 = getBuses()[0];
            var eta = b0.minutes == null ? (ko ? "곧" : "soon")
              : b0.minutes <= 0 ? (ko ? "곧" : "soon")
              : b0.minutes + (ko ? "분" : " min");
            return '<span class="arrival-preview"><b>' + b0.number + "</b><em>" + eta + "</em></span>";
          })() +
        "</button>" +
        '<button class="quick-card" data-action="routes">' +
          '<span class="quick-icon">' + icon("route", 38) + "</span>" +
          "<span><strong>" + t.route + "</strong><small>" + t.routeHint + "</small></span>" +
          icon("arrow", 30) +
        "</button>" +
        '<button class="quick-card" data-action="station">' +
          '<span class="quick-icon">' + icon("map", 38) + "</span>" +
          "<span><strong>" + t.info + "</strong><small>" + t.infoHint + "</small></span>" +
          icon("arrow", 30) +
        "</button>" +
      "</div>"
    );
  }

  function renderListening() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var heard = state.transcript;
    return (
      '<div class="listening-panel" role="status" aria-live="polite">' +
        '<div class="listening-orbit">' +
          '<span class="wave wave-one"></span>' +
          '<span class="wave wave-two"></span>' +
          '<span class="listening-core">' + icon("mic", 72) + "</span>" +
        "</div>" +
        '<p class="eyebrow">' + (heard ? (ko ? "이렇게 들었어요" : "I heard") : t.listenStatus) + "</p>" +
        "<h1>" + (heard ? "“" + heard + "”" : t.listening) + "</h1>" +
        '<p class="listening-copy">' + (heard ? (ko ? "가장 알맞은 정보를 찾고 있어요." : "Finding the best answer…") : t.listeningHint) + "</p>" +
        (state.recording
          ? '<button class="example-chip" data-action="voice-stop">' + (ko ? "✓ 말 다 했어요" : "✓ Done speaking") + "</button>"
          : "") +
        (!state.voiceSupported
          ? '<p class="support-note">' + (ko ? "이 기기에서는 예시 질문을 눌러 화면을 체험할 수 있어요." : "Voice input is unavailable here. Choose a sample question below.") + "</p>"
          : "") +
        '<div class="sample-questions">' +
          '<button data-action="routes">' + (ko ? "“강남역 가는 버스 알려줘”" : "“How do I get to Gangnam?”") + "</button>" +
          '<button data-action="arrival">' + (ko ? "“470번 언제 와?”" : "“When does bus 470 arrive?”") + "</button>" +
        "</div>" +
        '<button class="cancel-button" data-action="cancel">' + icon("x", 30) + t.cancel + "</button>" +
      "</div>"
    );
  }

  function renderArrival() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var rows = getBuses().map(function (bus, i) {
      var eta = bus.minutes == null ? (bus.msg1 || "-") : (bus.minutes <= 3 ? t.soon : bus.minutes + t.minute);
      var nextLine = bus.next != null ? t.next + " " + bus.next + t.minute : "&nbsp;";
      return (
        '<button class="bus-row ' + (i === 0 ? "bus-row-featured" : "") + '" data-action="bus-row" data-bus="' + bus.number + '">' +
          '<div class="bus-number"><span>' + (ko ? "간선" : "BUS") + "</span><strong>" + bus.number + "</strong></div>" +
          '<div class="bus-direction">' +
            "<strong>" + busDirection(bus) + "</strong>" +
            "<span>" + (ko
              ? "현재 위치에서 승차 · " + (bus.lowFloor ? "저상버스" : "일반버스")
              : "Board here · " + (bus.lowFloor ? "Low-floor bus" : "Standard bus")) + "</span>" +
          "</div>" +
          (bus.lowFloor ? '<span class="accessible">' + icon("wheelchair", 27) + (ko ? "저상" : "Accessible") + "</span>" : "") +
          '<div class="bus-time">' +
            "<strong>" + eta + "</strong>" +
            "<span>" + nextLine + "</span>" +
          "</div>" +
        "</button>"
      );
    }).join("");
    return (
      '<div class="arrival-view content-view">' +
        '<div class="result-heading">' +
          "<div>" +
            '<p class="eyebrow">' + (ko ? "실시간 도착 정보" : "LIVE ARRIVALS") + "</p>" +
            "<h1>" + t.arrivalsTitle + "</h1>" +
            '<p class="updated"><span class="live-dot"></span> ' + (ko ? "방금 업데이트" : "Updated just now") + "</p>" +
          "</div>" +
          '<button class="listen-button" data-action="speak-arrivals">' + icon("speaker", 30) + t.speak + "</button>" +
        "</div>" +
        '<div class="arrival-list">' + rows + "</div>" +
        ratingBlock("arrival") +
        '<button class="home-button" data-action="home">' + icon("home", 27) + t.home + "</button>" +
      "</div>"
    );
  }

  function renderRoutes() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var s = state.settings;
    var r = state.route;
    function fact(label, value) {
      return "<div><span>" + label + "</span><strong>" + value + "</strong></div>";
    }
    function stepsLine(path) {
      return path.steps.map(function (st) {
        return st.type === "walk" ? (ko ? "도보 " : "Walk ") + st.time + (ko ? "분" : "m") : st.line;
      }).join(" → ");
    }
    function routeCard(path, i) {
      var leg = firstLeg(path);
      var lineLabel = leg ? leg.line : (ko ? "도보" : "Walk");
      var ribbon = r.pref === "fast" ? (ko ? "가장 빠른 길" : "Fastest route") : (ko ? "가장 쉬운 길" : "Easiest route");
      var legs = transitLegs(path);
      var boardLine = "";
      if (legs.length) {
        boardLine =
          '<div class="route-board-line">' +
            '<span class="stop-tag">' + (ko ? "승차" : "ON") + "</span>" + legs[0].from +
            ' <span class="stop-arrow">→</span> ' +
            '<span class="stop-tag stop-tag-off">' + (ko ? "하차" : "OFF") + "</span>" + legs[legs.length - 1].to +
          "</div>";
      }
      return (
        '<article class="route-card ' + (i === 0 ? "recommended" : "route-other") + '">' +
          (i === 0 ? '<div class="recommend-ribbon">' + icon("check", 22) + ribbon + "</div>" : "") +
          '<div class="route-number"><span>' +
            (path.transfers === 0 ? t.direct : (ko ? "환승 " + path.transfers + "회" : path.transfers + " transfer(s)")) +
          "</span><strong>" + lineLabel + "</strong></div>" +
          '<div class="route-main">' +
            '<div class="route-facts">' +
              fact(ko ? "총 시간" : "Total", (ko ? "약 " : "") + path.totalTime + (ko ? "분" : " min")) +
              fact(ko ? "환승" : "Transfer", path.transfers === 0 ? (ko ? "없음" : "None") : path.transfers + (ko ? "회" : "")) +
              fact(ko ? "걷기" : "Walk", path.walkTime + (ko ? "분" : " min")) +
              fact(ko ? "요금" : "Fare", path.payment ? path.payment + (ko ? "원" : "₩") : "-") +
            "</div>" +
            '<div class="route-steps-line">' + stepsLine(path) + "</div>" +
            boardLine +
          "</div>" +
          '<button class="detail-button" data-action="route-select" data-idx="' + i + '">' + t.detail + icon("arrow", 28) + "</button>" +
        "</article>"
      );
    }
    var destSearch =
      '<div class="dest-search">' +
        '<button class="mic-inline" data-action="listen" aria-label="' + (ko ? "음성으로 목적지 말하기" : "Say your destination") + '">' + icon("mic", 28) + "</button>" +
        '<input id="dest-input" placeholder="' + (ko ? "목적지를 말하거나 입력하세요 (예: 수원역)" : "Say or type a destination") + '">' +
        '<button class="primary-button" data-action="route-search">' + icon("route", 24) + (ko ? "경로 찾기" : "Find route") + "</button>" +
      "</div>";

    /* 목적지 확인 단계: "이 도착지가 맞나요?" */
    if (state.destConfirm) {
      var dc = state.destConfirm;
      var sel = dc.sel || 0;
      var selCand = dc.candidates[sel];
      return (
        '<div class="routes-view content-view">' +
          '<div class="result-heading route-heading"><div>' +
            '<p class="eyebrow">' + (ko ? "목적지 확인 · “" + dc.query + "”" : "Confirm · “" + dc.query + "”") + "</p>" +
            "<h1>" + (ko ? "이 도착지가 맞나요?" : state.language === "JA" ? "この目的地でよろしいですか？" : state.language === "ZH" ? "是这个目的地吗？" : "Is this your destination?") + "</h1>" +
          "</div></div>" +
          (state.confirmListening
            ? '<div class="confirm-listening">' + icon("mic", 22) +
                (ko ? "듣고 있어요 · “네” 또는 “아니요”라고 말씀해 주세요"
                    : state.language === "JA" ? "聞いています · 「はい」か「いいえ」"
                    : state.language === "ZH" ? "正在聆听 · 请说“是”或“不是”"
                    : "Listening · say “yes” or “no”") + "</div>"
            : "") +
          '<div class="confirm-card">' +
            '<div class="confirm-map" aria-label="' + esc(selCand.name) + ' 위치 지도"></div>' +
            '<div class="confirm-info">' +
              '<span class="confirm-badge">' + icon("location", 20) + (sel === 0 ? (ko ? "가장 가까운 곳" : "Best match") : (ko ? "선택한 곳" : "Selected")) + "</span>" +
              "<strong>" + esc(selCand.name) + "</strong>" +
              '<p class="confirm-addr">' + esc(selCand.address || (ko ? "주소 정보 없음" : "No address")) + "</p>" +
              (selCand.category ? '<p class="confirm-cat">' + esc(selCand.category) + "</p>" : "") +
              '<button class="primary-button" data-action="dest-pick" data-idx="' + sel + '">' + icon("check", 26) + (ko ? "네, 여기 맞아요" : "Yes, this one") + "</button>" +
            "</div>" +
          "</div>" +
          (dc.candidates.length > 1
            ? '<p class="recent-title">' + (ko ? "다른 곳이면 눌러서 위치를 확인하세요" : "Tap another to see it on the map") + "</p>" +
              '<div class="candidate-list">' + dc.candidates.map(function (p, ci) {
                return '<button class="' + (ci === sel ? "cand-selected" : "") + '" data-action="dest-select" data-idx="' + ci + '">' +
                  (ci === sel ? '<span class="cand-check">' + icon("check", 18) + "</span>" : "") +
                  "<strong>" + esc(p.name) + "</strong>" +
                  "<span>" + icon("location", 15) + esc(p.address || "") + "</span>" +
                  "</button>";
              }).join("") + "</div>"
            : "") +
          '<div class="confirm-actions">' +
            '<button class="secondary-button" data-action="confirm-listen">' + icon("mic", 24) + (ko ? "다시 듣기" : "Listen again") + "</button>" +
            '<button class="secondary-button" data-action="dest-cancel">' + icon("x", 24) + (ko ? "처음부터" : "Cancel") + "</button>" +
          "</div>" +
        "</div>"
      );
    }

    if (state.routeLoading) {
      return (
        '<div class="routes-view content-view">' +
          '<div class="result-heading route-heading"><div>' +
            '<p class="eyebrow">' + s.stationName + " → …</p>" +
            "<h1>" + (ko ? "경로를 찾고 있어요…" : "Finding routes…") + "</h1>" +
          "</div></div>" +
        "</div>"
      );
    }

    if (r) {
      var title = ko ? r.destination + "까지 가는 방법이에요."
        : state.language === "JA" ? r.destination + "までの行き方"
        : state.language === "ZH" ? "前往" + r.destination + "的路线"
        : "Routes to " + r.destination;
      return (
        '<div class="routes-view content-view">' +
          '<div class="result-heading route-heading">' +
            "<div>" +
              '<p class="eyebrow">' + s.stationName + " → " + r.destination + "</p>" +
              "<h1>" + title + "</h1>" +
            "</div>" +
            '<button class="listen-button" data-action="speak-route-live">' + icon("speaker", 30) + t.speak + "</button>" +
          "</div>" +
          destSearch +
          r.paths.map(function (p, i) { return routeCard(p, i); }).join("") +
        "</div>"
      );
    }

    // 아직 검색한 경로가 없을 때: 목적지 입력 안내
    return (
      '<div class="routes-view content-view">' +
        '<div class="result-heading route-heading">' +
          "<div>" +
            '<p class="eyebrow">' + s.stationName + " → ?</p>" +
            "<h1>" + (ko ? "어디로 가시나요?" : state.language === "JA" ? "どちらへ行かれますか？" : state.language === "ZH" ? "您要去哪里？" : "Where would you like to go?") + "</h1>" +
          "</div>" +
        "</div>" +
        destSearch +
        (state.routeError ? '<p class="route-error">' + state.routeError + "</p>" : "") +
        (function () {
          var recent = getRecentDests();
          var chips = recent.length
            ? recent.map(function (n) {
                return '<button data-action="route-sample" data-dest="' + n + '">' + n + "</button>";
              }).join("")
            : '<button data-action="route-sample" data-dest="수원역">' + (ko ? "수원역" : "Suwon Station") + "</button>" +
              '<button data-action="route-sample" data-dest="강남역">' + (ko ? "강남역" : "Gangnam Station") + "</button>" +
              '<button data-action="route-sample" data-dest="서울역">' + (ko ? "서울역" : "Seoul Station") + "</button>";
          return (
            '<p class="recent-title">' +
              (recent.length
                ? (ko ? "최근 목적지" : state.language === "JA" ? "最近の目的地" : state.language === "ZH" ? "最近目的地" : "Recent destinations")
                : (ko ? "이런 곳은 어떠세요?" : "Try one of these")) +
            "</p>" +
            '<div class="sample-questions">' + chips + "</div>"
          );
        })() +
      "</div>"
    );
  }

  function renderRouteDetail() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var s = state.settings;
    var r = state.route;

    if (r && currentPath()) {
      var c = currentPath();
      var leg = firstLeg(c);
      var stepsHtml = "";
      c.steps.forEach(function (st, i) {
        if (i > 0) stepsHtml += '<div class="journey-line"></div>';
        var iconName = st.type === "walk" ? "walk" : st.type === "subway" ? "route" : "bus";
        var cls = st.type === "walk" ? "walk-step" : (i === 0 ? "current-step" : "bus-step");
        var label, strongText, stopsRow = "", metaText = "";
        if (st.type === "walk") {
          label = ko ? "도보 이동" : "Walk";
          strongText = ko ? "걸어서 약 " + st.time + "분" : "Walk about " + st.time + " min";
          var walkFrom = i === 0 ? s.stationName : (c.steps[i - 1].to || "");
          var walkTo = i === c.steps.length - 1 ? r.destination : (c.steps[i + 1].from || "");
          if (walkFrom && walkTo) {
            stopsRow = '<p class="stop-names">' + walkFrom + ' <span class="stop-arrow">→</span> ' + walkTo + "</p>";
          } else {
            metaText = ko ? "안내 표지를 따라 이동하세요" : "Follow the signs";
          }
        } else {
          var isBus = st.type === "bus";
          label = isBus ? (ko ? "버스 승차" : "Bus") : (ko ? "지하철 승차" : "Subway");
          strongText = isBus
            ? (ko ? st.line + "번 버스 타기" : "Board bus " + st.line)
            : (ko ? st.line + " 타기" : "Take the " + st.line);
          stopsRow =
            '<p class="stop-names">' +
              '<span class="stop-tag">' + (ko ? "승차" : "ON") + "</span>" + st.from +
              ' <span class="stop-arrow">→</span> ' +
              '<span class="stop-tag stop-tag-off">' + (ko ? "하차" : "OFF") + "</span>" + st.to +
            "</p>";
          metaText = isBus
            ? (ko ? st.stations + "개 정류장 · 약 " + st.time + "분" : st.stations + " stops · " + st.time + " min")
            : (ko ? st.stations + "개 역 · 약 " + st.time + "분" : st.stations + " stations · " + st.time + " min");
        }
        // 지도의 경로선과 같은 모양의 선 견본 (도보=회색 점선, 버스=파랑, 지하철=노선색)
        var lineSample = st.type === "walk"
          ? '<span class="line-sample line-walk"></span>'
          : '<span class="line-sample" style="background:' + (st.type === "subway" ? subwayColor(st.line) : "#0b4dc9") + '"></span>';
        stepsHtml +=
          '<div class="journey-step">' +
            '<span class="step-icon ' + cls + '">' + icon(iconName, 28) + "</span>" +
            "<div><span>" + label + " " + lineSample + "</span><strong>" + strongText + "</strong>" +
              stopsRow +
              (metaText ? '<p class="step-meta">' + metaText + "</p>" : "") +
            "</div>" +
          "</div>";
      });
      var h1Text = leg
        ? (leg.type === "bus"
          ? (ko ? leg.line + "번 버스를 이용하세요." : "Take bus " + leg.line + ".")
          : (ko ? leg.line + " 지하철을 이용하세요." : "Take the " + leg.line + "."))
        : (ko ? "걸어서 갈 수 있어요." : "You can walk there.");
      return (
        '<div class="route-detail-view content-view">' +
          '<div class="result-heading compact-heading">' +
            "<div>" +
              '<p class="eyebrow">' + s.stationName + " → " + r.destination + "</p>" +
              "<h1>" + h1Text + "</h1>" +
            "</div>" +
            '<div class="eta-card"><span>' + (ko ? "총 예상 시간" : "Total time") + "</span><strong>" + (ko ? "약 " + c.totalTime + "분" : c.totalTime + " min") + "</strong></div>" +
          "</div>" +
          '<div class="journey-layout">' +
            '<div class="journey-steps">' + stepsHtml + "</div>" +
            '<div class="route-map" aria-label="경로 지도">' +
              '<div class="map-road road-a"></div>' +
              '<div class="map-road road-b"></div>' +
              '<div class="route-path"></div>' +
              '<span class="map-pin pin-start">' + icon("location", 26) + s.stationName + "</span>" +
              '<span class="map-pin pin-end">' + icon("location", 26) + r.destination + "</span>" +
              (leg ? '<span class="map-bus">' + icon(leg.type === "subway" ? "route" : "bus", 25) + leg.line + "</span>" : "") +
            "</div>" +
          "</div>" +
          '<div class="route-bottom">' +
            "<span>" + icon("walk", 28) +
              (ko ? "걷는 구간은 총 " + c.walkTime + "분이에요. 천천히 이동하세요."
                  : "Total walking time is " + c.walkTime + " min. Take your time.") + "</span>" +
            '<button class="primary-button" data-action="speak-route-live">' + icon("speaker", 29) + t.speak + "</button>" +
          "</div>" +
          ratingBlock("route:" + r.destination) +
        "</div>"
      );
    }

    return (
      '<div class="route-detail-view content-view">' +
        '<div class="result-heading compact-heading">' +
          "<div>" +
            '<p class="eyebrow">' + s.stationName + " → " + (ko ? "강남역" : "Gangnam Station") + "</p>" +
            "<h1>" + (ko ? "470번 버스를 이용하세요." : "Take bus 470.") + "</h1>" +
          "</div>" +
          '<div class="eta-card"><span>' + (ko ? "총 예상 시간" : "Total time") + "</span><strong>" + (ko ? "약 32분" : "32 min") + "</strong></div>" +
        "</div>" +
        '<div class="journey-layout">' +
          '<div class="journey-steps">' +
            '<div class="journey-step">' +
              '<span class="step-icon current-step">' + icon("location", 28) + "</span>" +
              "<div><span>" + t.current + "</span><strong>" + (ko ? "광화문 정류장" : "Gwanghwamun stop") + "</strong><p>" + (ko ? "현재 위치에서 기다리세요" : "Wait at your current stop") + "</p></div>" +
            "</div>" +
            '<div class="journey-line"></div>' +
            '<div class="journey-step">' +
              '<span class="step-icon bus-step">' + icon("bus", 30) + "</span>" +
              "<div><span>" + (ko ? "4분 후 도착" : "Arrives in 4 min") + "</span><strong>" + (ko ? "470번 버스 승차" : "Board bus 470") + "</strong><p>" + (ko ? "약 28분 이동 · 12개 정류장" : "Ride 28 min · 12 stops") + "</p></div>" +
            "</div>" +
            '<div class="journey-line"></div>' +
            '<div class="journey-step">' +
              '<span class="step-icon walk-step">' + icon("walk", 30) + "</span>" +
              "<div><span>" + (ko ? "하차 후" : "After getting off") + "</span><strong>" + (ko ? "강남역까지 2분 걷기" : "Walk 2 min to Gangnam Station") + "</strong><p>" + (ko ? "횡단보도를 건너 오른쪽으로 이동" : "Cross the street and turn right") + "</p></div>" +
            "</div>" +
          "</div>" +
          '<div class="route-map" aria-label="광화문역에서 강남역까지의 버스 경로 지도">' +
            '<div class="map-road road-a"></div>' +
            '<div class="map-road road-b"></div>' +
            '<div class="river"><span>한강</span></div>' +
            '<div class="route-path"></div>' +
            '<span class="map-pin pin-start">' + icon("location", 26) + "광화문</span>" +
            '<span class="map-pin pin-end">' + icon("location", 26) + "강남역</span>" +
            '<span class="map-bus">' + icon("bus", 25) + "470</span>" +
          "</div>" +
        "</div>" +
        '<div class="route-bottom">' +
          "<span>" + icon("wheelchair", 28) + (ko ? "저상버스 운행 · 휠체어 승차 가능" : "Low-floor accessible bus") + "</span>" +
          '<button class="primary-button" data-action="speak-detail">' + icon("speaker", 29) + t.speak + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function renderStation() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var s = state.settings;
    function nearby(name, minutes) {
      return "<div><span>" + icon("walk", 27) + name + "</span><strong>" + minutes + "</strong></div>";
    }
    return (
      '<div class="station-view content-view">' +
        '<div class="result-heading compact-heading">' +
          "<div>" +
            '<p class="eyebrow">' + t.current + "</p>" +
            "<h1>" + t.stationInfo + "</h1>" +
          "</div>" +
          '<button class="listen-button" data-action="speak-station">' + icon("speaker", 30) + t.speak + "</button>" +
        "</div>" +
        '<div class="station-layout">' +
          '<div class="station-map">' +
            '<span class="street street-one">세종대로</span>' +
            '<span class="street street-two">사직로</span>' +
            '<span class="place place-palace">광화문</span>' +
            '<span class="place place-center">세종문화회관</span>' +
            '<span class="place place-subway">6번 출구</span>' +
            '<span class="you-are-here">' + icon("bus", 30) + s.stationName + "<small>" + s.stationId + "</small></span>" +
          "</div>" +
          '<aside class="station-details">' +
            '<div class="station-summary">' +
              '<span class="summary-icon">' + icon("location", 34) + "</span>" +
              "<div><span>" + t.current + "</span><strong>" + s.stationName + "</strong><p>" + s.address + "</p></div>" +
            "</div>" +
            '<div class="nearby-list">' +
              "<h2>" + t.nearby + "</h2>" +
              (state.nearby
                ? state.nearby.map(function (p) {
                    var min = Math.max(1, Math.round(p.distance / 67)); // 도보 약 67m/분
                    return nearby(p.name, min + (ko ? "분" : " min"));
                  }).join("")
                : nearby("광화문역 6번 출구", ko ? "1분" : "1 min") +
                  nearby("세종문화회관", ko ? "3분" : "3 min") +
                  nearby("서울역사박물관", ko ? "8분" : "8 min")) +
            "</div>" +
            '<button class="primary-button full-button" data-action="arrival-voice">' + icon("clock", 29) + (ko ? "이 정류장 도착 정보" : "View arrivals") + "</button>" +
          "</aside>" +
        "</div>" +
      "</div>"
    );
  }

  function renderLanguage() {
    var t = STRINGS[state.language];
    var buttons = LANGUAGES.map(function (lang) {
      var selected = state.language === lang.id;
      return (
        '<button class="' + (selected ? "selected-language" : "") + '" data-action="select-lang" data-lang="' + lang.id + '">' +
          "<span>" + lang.native + "</span>" +
          "<small>" + lang.helper + "</small>" +
          (selected ? "<b>" + icon("check", 23) + "</b>" : "") +
        "</button>"
      );
    }).join("");
    return (
      '<div class="language-view content-view">' +
        '<div class="language-heading">' +
          '<span class="language-hero">' + icon("language", 52) + "</span>" +
          '<p class="eyebrow">LANGUAGE · 언어</p>' +
          "<h1>" + t.chooseLanguage + "</h1>" +
          "<p>" + t.voiceGuide + "</p>" +
        "</div>" +
        '<div class="language-grid">' + buttons + "</div>" +
      "</div>"
    );
  }

  function testButtonHtml() {
    var st = state.testState;
    return (st === "ok" ? icon("check", 25) : icon("refresh", 25)) + " " +
      (st === "testing" ? "확인 중…" : st === "ok" ? "연결 확인" : "연결 테스트");
  }

  function geminiButtonHtml() {
    var st = state.geminiTest;
    return (st === "ok" ? icon("check", 25) : st === "fail" ? icon("x", 25) : icon("refresh", 25)) + " " +
      (st === "testing" ? "확인 중…" : st === "ok" ? "연결 확인" : st === "fail" ? "연결 실패" : "연결 테스트");
  }

  function renderSettings() {
    var s = state.settings;
    return (
      '<div class="settings-view content-view">' +
        '<div class="result-heading compact-heading">' +
          "<div>" +
            '<p class="eyebrow">KIOSK ADMIN</p>' +
            "<h1>정류장 안내 설정</h1>" +
            '<p class="settings-intro">설치 위치마다 정류장 정보와 AI의 기본 안내 원칙을 바꿀 수 있습니다.</p>' +
          "</div>" +
          '<span class="connection-badge"><span></span>' + (state.liveBuses ? "실시간 데이터 연결됨" : "시연 데이터 연결됨") + "</span>" +
        "</div>" +
        '<div class="settings-grid">' +
          '<section class="settings-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("location", 29) + "</span>" +
              "<div><h2>키오스크 기본 위치</h2><p>첫 화면과 음성 안내에 표시됩니다.</p></div>" +
            "</div>" +
            '<div class="field-row">' +
              '<label>정류장 이름<input data-field="stationName" value="' + esc(s.stationName) + '"></label>' +
              '<label>정류장 ID<input data-field="stationId" value="' + esc(s.stationId) + '"></label>' +
            "</div>" +
            '<div class="field-row">' +
              '<label>정류장 주소<input data-field="address" value="' + esc(s.address) + '"></label>' +
              '<label>도시코드 (서울은 비움 · 수원 31010)<input data-field="cityCode" placeholder="예: 31010" value="' + esc(s.cityCode || "") + '"></label>' +
            "</div>" +
            (function () {
              if (!state.cities) {
                return '<p class="station-msg">정류장 검색 도구를 준비하는 중입니다… (배포된 사이트에서 사용 가능)</p>';
              }
              var sel = String(state.citySel || s.cityCode || "31010");
              var opts = state.cities.map(function (c) {
                return '<option value="' + c.code + '"' + (String(c.code) === sel ? " selected" : "") + ">" + c.name + "</option>";
              }).join("");
              var results = "";
              if (state.stationResults && state.stationResults.length) {
                results = '<div class="station-results">' + state.stationResults.map(function (st, i) {
                  return '<button type="button" data-action="station-pick" data-idx="' + i + '">' +
                    esc(st.name) + (st.nodeNo ? " (" + st.nodeNo + ")" : "") + "</button>";
                }).join("") + "</div>";
              } else if (state.stationSearchMsg) {
                results = '<p class="station-msg">' + esc(state.stationSearchMsg) + "</p>";
              }
              return (
                '<div class="station-search">' +
                  "<label>도시 선택<select id=\"city-select\">" + opts + "</select></label>" +
                  '<label>정류장 이름으로 검색<input id="station-query" value="' + esc(state.stationQuery || "") + '" placeholder="예: 성균관대"></label>' +
                  '<button type="button" class="test-button" data-action="station-search">' + icon("refresh", 22) + " 검색</button>" +
                "</div>" + results
              );
            })() +
          "</section>" +
          '<section class="settings-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("mic", 29) + "</span>" +
              "<div><h2>AI 기본 프롬프트</h2><p>[기본 위치]는 위에서 설정한 정류장 이름으로 자동 치환됩니다.</p></div>" +
            "</div>" +
            '<textarea data-field="prompt">' + esc(s.prompt) + "</textarea>" +
            '<div class="prompt-tips"><span>✓ 짧은 문장</span><span>✓ 저상버스 우선</span><span>✓ 사용자 언어 감지</span></div>' +
          "</section>" +
          '<section class="settings-section api-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("refresh", 29) + "</span>" +
              "<div><h2>버스 데이터 연결</h2><p>운영 환경에서는 지자체 실시간 API를 연결합니다.</p></div>" +
            "</div>" +
            '<label>도착 정보 API URL<input data-field="endpoint" value="' + esc(s.endpoint) + '"></label>' +
            '<button class="test-button' + (state.testState === "ok" ? " test-success" : "") + '" data-action="test"' + (state.testState === "testing" ? " disabled" : "") + ">" + testButtonHtml() + "</button>" +
          "</section>" +
          '<section class="settings-section api-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("speaker", 29) + "</span>" +
              "<div><h2>Gemini AI 음성 연동</h2><p>키는 Vercel 환경변수 GEMINI_API_KEY로 관리됩니다. 여기서는 연결 상태만 확인합니다.</p></div>" +
            "</div>" +
            '<div class="gemini-status ' + (state.geminiAvailable === true ? "status-ok" : state.geminiAvailable === false ? "status-bad" : "") + '">' +
              (state.geminiAvailable === true ? "환경변수 감지됨 — 연결 테스트로 최종 확인하세요"
                : state.geminiAvailable === false ? "GEMINI_API_KEY 환경변수가 없습니다 (Vercel Settings → Environment Variables)"
                : "환경변수 확인 중…") +
            "</div>" +
            '<button class="test-button' + (state.geminiTest === "ok" ? " test-success" : state.geminiTest === "fail" ? " test-fail" : "") + '" data-action="gemini-test"' + (state.geminiTest === "testing" ? " disabled" : "") + ">" + geminiButtonHtml() + "</button>" +
            (state.geminiTest === "fail" && state.geminiErrorMsg
              ? '<p class="test-error">' + esc(state.geminiErrorMsg) + "</p>"
              : "") +
          "</section>" +
          '<section class="settings-section api-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("clock", 29) + "</span>" +
              "<div><h2>사용 데이터 KPI</h2><p>수집된 사용 데이터를 집계해 지표로 보여줍니다.</p></div>" +
            "</div>" +
            "<div></div>" +
            '<button class="primary-button" data-action="kpi">' + icon("check", 24) + " KPI 통계 보기</button>" +
          "</section>" +
        "</div>" +
        '<div class="settings-actions">' +
          '<button class="secondary-button" data-action="home">취소</button>' +
          '<button class="primary-button" data-action="save">변경사항 저장</button>' +
        "</div>" +
      "</div>"
    );
  }

  function renderSaved() {
    return (
      '<div class="saved-view">' +
        '<span class="saved-icon">' + icon("check", 65) + "</span>" +
        '<p class="eyebrow">저장 완료</p>' +
        "<h1>정류장 설정을 적용했습니다.</h1>" +
        "<p>변경한 위치와 기본 프롬프트가 이 기기에 저장되었습니다.</p>" +
        '<button class="primary-button" data-action="home">' + icon("home", 29) + "키오스크로 돌아가기</button>" +
      "</div>"
    );
  }

  /* ---------- 렌더링 ---------- */
  function render() {
    var screenEl = document.getElementById("screen");
    var showBack = ["home", "listening", "saved"].indexOf(state.screen) === -1;

    document.getElementById("topbar").innerHTML = renderTopbar();
    document.getElementById("footer").innerHTML = renderFooter();

    screenEl.className = "screen view-" + state.screen + " " + (state.screen === "home" ? "home-screen" : "result-screen");

    var backHtml = showBack
      ? '<button class="back-button" data-action="back">' + icon("back", 28) + (state.language === "KO" ? "이전" : "Back") + "</button>"
      : "";

    var body = "";
    switch (state.screen) {
      case "home": body = renderHome(); break;
      case "listening": body = renderListening(); break;
      case "arrival": body = renderArrival(); break;
      case "routes": body = renderRoutes(); break;
      case "routeDetail": body = renderRouteDetail(); break;
      case "station": body = renderStation(); break;
      case "language": body = renderLanguage(); break;
      case "settings": body = renderSettings(); break;
      case "kpi": body = renderKpi(); break;
      case "log": body = renderLog(); break;
      case "busRoute": body = renderBusRoute(); break;
      case "saved": body = renderSaved(); break;
    }
    screenEl.innerHTML = backHtml + body;

    resetIdleTimer();
    if (state.screen === "station") ensureNearby();
    mountMaps();
    // 평가 의견 입력값 복원 (버스 실시간 갱신 등으로 재렌더돼도 유실되지 않도록)
    Object.keys(state.ratingDraft).forEach(function (ctx) {
      var ta = document.getElementById("rating-comment-" + ctx);
      if (ta && state.ratingDraft[ctx]) ta.value = state.ratingDraft[ctx];
    });
  }

  /* ---------- 5분 무조작 시 첫 화면(언어 선택)으로 복귀 ---------- */
  function resetIdleTimer() {
    if (idleTimer) window.clearTimeout(idleTimer);
    idleTimer = null;
    // 언어 선택(이미 첫 화면)·관리자 화면·음성 인식 중에는 타이머 없음
    if (["language", "settings", "kpi", "log", "busRoute", "listening"].indexOf(state.screen) !== -1) return;
    idleTimer = window.setTimeout(function () {
      logEvent("idle_timeout", { screen: state.screen });
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      state.route = null;
      state.routeError = "";
      state.destConfirm = null;
      state.transcript = "";
      state.rated = {};
      state.ratingStars = {};
      state.ratingDraft = {};
      setScreen("language");
    }, 300000);
  }

  ["pointerdown", "keydown", "wheel", "touchmove"].forEach(function (evt) {
    window.addEventListener(evt, function () {
      if (idleTimer) resetIdleTimer();
    }, { passive: true });
  });

  /* ---------- 이벤트 ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var s = state.settings;
    var ko = state.language === "KO";

    switch (btn.getAttribute("data-action")) {
      case "home": goHome(); break;
      case "back": goBack(); break;
      case "listen": beginVoice(); break;
      case "voice-stop": stopGeminiVoice(); break;
      case "cancel": cancelListening(); break;
      case "arrival": setScreen("arrival"); break;
      case "arrival-voice": openArrivalWithVoice(); break;
      case "routes":
        // 길찾기를 새로 열 때는 이전 검색 결과를 비우고 처음부터
        state.route = null;
        state.routeError = "";
        state.routeLoading = false;
        state.destConfirm = null;
        setScreen("routes");
        break;
      case "dest-pick":
        pickCandidate(parseInt(btn.getAttribute("data-idx"), 10) || 0, "tap");
        break;
      case "dest-select":
        if (state.destConfirm) {
          state.destConfirm.sel = parseInt(btn.getAttribute("data-idx"), 10) || 0;
          render();
        }
        break;
      case "confirm-listen":
        listenOnConfirm();
        break;
      case "dest-cancel":
        stopRecognition();
        state.destConfirm = null;
        setScreen("routes");
        break;
      case "kpi":
        state.kpi = null;
        state.kpiError = "";
        setScreen("kpi");
        loadKpi();
        break;
      case "kpi-refresh":
        state.kpi = null;
        state.kpiError = "";
        render();
        loadKpi();
        break;
      case "log":
        state.events = null;
        state.eventsTotal = null;
        state.logPage = 0;
        setScreen("log");
        loadLog();
        break;
      case "log-refresh":
        state.events = null;
        render();
        loadLog();
        break;
      case "log-prev":
        if (state.logPage > 0) { state.logPage--; state.events = null; render(); loadLog(); }
        break;
      case "log-next":
        state.logPage++; state.events = null; render(); loadLog();
        break;
      case "events-device":
        state.eventsDevice = btn.getAttribute("data-device") || "";
        state.logPage = 0;
        state.events = null;
        render();
        loadLog();
        break;
      case "events-alldevice":
        state.eventsDevice = "";
        state.logPage = 0;
        state.events = null;
        render();
        loadLog();
        break;
      case "event-delete":
        deleteEvent(btn.getAttribute("data-id"));
        break;
      case "station": setScreen("station"); break;
      case "language": setScreen("language"); break;
      case "settings": setScreen("settings"); ensureCities(); break;
      case "detail": setScreen("routeDetail"); break;
      case "route-search":
        (function () {
          var inp = document.getElementById("dest-input");
          var v = inp ? inp.value.trim() : "";
          if (v) performRouteSearch(v, "simple");
        })();
        break;
      case "route-sample":
        performRouteSearch(btn.getAttribute("data-dest"), "simple");
        break;
      case "route-select":
        if (state.route) {
          state.route.selected = parseInt(btn.getAttribute("data-idx"), 10) || 0;
          logEvent("route_select", { index: state.route.selected, dest: state.route.destination });
          setScreen("routeDetail");
        }
        break;
      case "rate-star":
        (function () {
          var ctx = btn.getAttribute("data-ctx");
          var value = parseInt(btn.getAttribute("data-value"), 10) || 0;
          // 이미 입력한 의견을 다시 그리며 잃지 않도록 보존
          var ta = document.getElementById("rating-comment-" + ctx);
          state.ratingStars[ctx] = value;
          state.ratingDraft = state.ratingDraft || {};
          if (ta) state.ratingDraft[ctx] = ta.value;
          render();
          var restored = document.getElementById("rating-comment-" + ctx);
          if (restored && state.ratingDraft[ctx]) restored.value = state.ratingDraft[ctx];
        })();
        break;
      case "rate-voice":
        dictateComment(btn.getAttribute("data-ctx"));
        break;
      case "rate-submit":
        (function () {
          var ctx = btn.getAttribute("data-ctx");
          var stars = state.ratingStars[ctx] || 0;
          if (!stars) return;
          var ta = document.getElementById("rating-comment-" + ctx);
          var comment = ((ta ? ta.value : state.ratingDraft[ctx]) || "").trim().slice(0, 500);
          state.rated[ctx] = true;
          delete state.ratingDraft[ctx];
          logEvent("rating", { stars: stars, comment: comment, context: ctx });
          render();
          speak(state.language === "KO" ? "소중한 의견 감사합니다."
            : state.language === "JA" ? "ご意見ありがとうございます。"
            : state.language === "ZH" ? "感谢您的反馈。"
            : "Thank you for your feedback.");
        })();
        break;
      case "speak-route-live":
        speakRouteSummary();
        break;
      case "station-search":
        (function () {
          var sel = document.getElementById("city-select");
          var q = document.getElementById("station-query");
          if (!sel || !q) return;
          state.citySel = sel.value;
          state.stationQuery = q.value;
          if (!q.value.trim()) {
            state.stationSearchMsg = "정류장 이름을 입력해 주세요.";
            state.stationResults = null;
            render();
            return;
          }
          state.stationSearchMsg = "검색 중…";
          state.stationResults = null;
          render();
          fetch("/api/find-station?cityCode=" + encodeURIComponent(sel.value) + "&name=" + encodeURIComponent(q.value.trim()))
            .then(function (r) { return r.json(); })
            .then(function (d) {
              if (d && d.ok && d.stations && d.stations.length) {
                state.stationResults = d.stations.slice(0, 8);
                state.stationSearchMsg = "";
              } else {
                state.stationResults = null;
                state.stationSearchMsg = (d && d.error) || "검색 결과가 없습니다.";
              }
              if (state.screen === "settings") render();
            })
            .catch(function () {
              state.stationSearchMsg = "검색에 실패했습니다. 배포된 사이트에서 시도해 주세요.";
              if (state.screen === "settings") render();
            });
        })();
        break;
      case "station-pick":
        (function () {
          var i = parseInt(btn.getAttribute("data-idx"), 10);
          var st = state.stationResults && state.stationResults[i];
          if (!st) return;
          var city = (state.cities || []).filter(function (c) { return String(c.code) === String(st.cityCode); })[0];
          state.settings.stationName = st.name;
          state.settings.stationId = String(st.nodeId);
          state.settings.cityCode = String(st.cityCode);
          state.settings.lat = String(st.lat || "");
          state.settings.lng = String(st.lng || "");
          state.settings.address = (city ? city.name + " " : "") + st.name + " 정류장";
          state.stationResults = null;
          state.stationSearchMsg = "✓ 선택됨: " + st.name + " — 아래 '변경사항 저장'을 눌러야 적용됩니다.";
          render();
        })();
        break;
      case "bus-row":
        openBusRoute(btn.getAttribute("data-bus"));
        break;
      case "select-lang":
        selectLanguage(btn.getAttribute("data-lang"));
        break;
      case "speak-arrivals":
        announceArrivals();
        break;
      case "speak-routes":
        speak(ko
          ? "환승 없이 470번 버스를 이용하는 경로를 추천합니다. 버스는 4분 후 도착하며 강남역까지 약 32분 걸립니다."
          : "Take bus 470 directly. It arrives in 4 minutes and the trip takes about 32 minutes.");
        break;
      case "speak-detail":
        speak(ko
          ? "현재 정류장에서 4분 후 도착하는 470번 버스를 타세요. 12개 정류장을 이동한 뒤 강남역에서 하차하세요."
          : "At this stop, board bus 470 arriving in 4 minutes. Ride for 12 stops and get off at Gangnam Station.");
        break;
      case "speak-station":
        speakStationInfo();
        break;
      case "test":
        state.testState = "testing";
        updateTestButton();
        window.setTimeout(function () {
          state.testState = "ok";
          updateTestButton();
        }, 850);
        break;
      case "gemini-test":
        state.geminiTest = "testing";
        updateGeminiButton();
        checkGemini();
        geminiCall({
          contents: [{ role: "user", parts: [{ text: "안녕" }] }],
          generationConfig: { maxOutputTokens: 5 }
        }).then(function (res) {
          if (res.ok) {
            state.geminiTest = "ok";
            state.geminiErrorMsg = "";
            render();
            return;
          }
          return res.json().then(function (e) {
            state.geminiTest = "fail";
            state.geminiErrorMsg = "오류 " + res.status + ": " +
              (e && e.error && e.error.message ? e.error.message : "알 수 없는 오류");
            render();
          }, function () {
            state.geminiTest = "fail";
            state.geminiErrorMsg = "오류 " + res.status;
            render();
          });
        }).catch(function (err) {
          state.geminiTest = "fail";
          state.geminiErrorMsg = "네트워크 오류: " + err;
          render();
        });
        break;
      case "save":
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings)); } catch (err) {}
        state.liveBuses = null;   // 정류장이 바뀌었을 수 있으니 실시간 데이터 다시 불러오기
        state.nearby = null;      // 주변 시설도 새 위치 기준으로 다시 검색
        loadArrivals();
        setScreen("saved");
        break;
    }
  });

  /* 설정 입력 (포커스 유지를 위해 전체 렌더링 없이 상태만 갱신) */
  document.addEventListener("input", function (e) {
    // 평가 의견은 입력할 때마다 초안으로 저장 (재렌더 시 복원용)
    if (e.target.classList && e.target.classList.contains("rating-comment")) {
      var cctx = (e.target.id || "").replace("rating-comment-", "");
      if (cctx) state.ratingDraft[cctx] = e.target.value;
      return;
    }
    var field = e.target.getAttribute && e.target.getAttribute("data-field");
    if (!field) return;
    state.settings[field] = e.target.value;
    if (field === "endpoint" && state.testState !== "idle") {
      state.testState = "idle";
      updateTestButton();
    }
  });

  function updateTestButton() {
    var btn = document.querySelector('[data-action="test"]');
    if (!btn) return;
    btn.className = "test-button" + (state.testState === "ok" ? " test-success" : "");
    btn.disabled = state.testState === "testing";
    btn.innerHTML = testButtonHtml();
  }

  function updateGeminiButton() {
    var btn = document.querySelector('[data-action="gemini-test"]');
    if (!btn) return;
    btn.className = "test-button" + (state.geminiTest === "ok" ? " test-success" : state.geminiTest === "fail" ? " test-fail" : "");
    btn.disabled = state.geminiTest === "testing";
    btn.innerHTML = geminiButtonHtml();
  }

  /* ---------- 시계 ---------- */
  window.setInterval(function () {
    state.now = new Date();
    var timeEl = document.querySelector(".time");
    if (timeEl) {
      var text = formatTime();
      timeEl.textContent = text;
      timeEl.setAttribute("aria-label", "현재 시각 " + text);
    }
  }, 1000);
  state.now = new Date();

  /* ---------- 시작 ---------- */
  var initialScreen = (window.location.hash || "").replace("#", "");
  if (["arrival", "routes", "routeDetail", "station", "language", "settings", "kpi"].indexOf(initialScreen) !== -1) {
    state.screen = initialScreen;
  } else {
    state.screen = "language";   // 첫 화면은 항상 언어 선택
  }
  render();
  loadArrivals();
  checkGemini();
  ensureStationCoords();
  if (state.screen === "settings") ensureCities();
  logEvent("session_start", { screen: state.screen, station: state.settings.stationName });
})();
