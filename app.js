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
    prompt: "현재 키오스크는 광화문역 정류장에 설치되어 있습니다. 사용자의 언어와 이동 목적을 파악하고, 현재 위치를 기준으로 이용 가능한 버스 노선, 예상 도착 시간, 환승 횟수와 보행 구간을 짧고 명확하게 안내하세요. 노약자에게는 저상버스를 우선 안내하세요.",
    endpoint: "https://api.example.kr/bus/arrivals",
    geminiKey: ""
  };

  var STORAGE_KEY = "smart-bus-settings";

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
    settings: Object.assign({}, DEFAULT_SETTINGS)
  };

  var recognitionRef = null;
  var idleTimer = null;
  var aiRequestToken = 0;

  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) state.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(stored));
  } catch (e) { /* 저장된 설정이 없거나 손상됨 */ }

  /* ---------- 유틸 ---------- */
  function localeFor(lang) {
    return lang === "KO" ? "ko-KR" : lang === "JA" ? "ja-JP" : lang === "ZH" ? "zh-CN" : "en-US";
  }

  function formatTime() {
    if (!state.now) return "--:--";
    return state.now.toLocaleTimeString(localeFor(state.language), { hour: "2-digit", minute: "2-digit" });
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = localeFor(state.language);
    u.rate = 0.86;
    window.speechSynthesis.speak(u);
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
    var arsId = String(state.settings.stationId || "").replace(/[^0-9]/g, "");
    if (!arsId) return;
    fetch("/api/arrivals?arsId=" + arsId)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var items = data && data.msgBody && data.msgBody.itemList;
        if (!items || !items.length) throw new Error("no data");
        var buses = items
          .map(function (it) {
            return {
              number: it.rtNm,
              direction: it.adirection ? it.adirection + " 방면" : "",
              minutes: parseArrMsg(it.arrmsg1),
              next: parseArrMsg(it.arrmsg2),
              msg1: it.arrmsg1 || "",
              lowFloor: it.busType1 === "1"
            };
          })
          .filter(function (b) {
            return b.number && b.msg1 && b.msg1.indexOf("운행종료") === -1;
          });
        if (!buses.length) throw new Error("no running bus");
        buses.sort(function (a, b) {
          return (a.minutes == null ? 999 : a.minutes) - (b.minutes == null ? 999 : b.minutes);
        });
        state.liveBuses = buses.slice(0, 6);
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

  function busDirection(bus) {
    return typeof bus.direction === "string" ? bus.direction : bus.direction[state.language];
  }

  /* ---------- Gemini AI 연동 ---------- */
  var GEMINI_MODEL = "gemini-3.5-flash-lite";
  var GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent";

  function geminiCall(body) {
    return fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": state.settings.geminiKey.trim()
      },
      body: JSON.stringify(body)
    });
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
    return s.prompt +
      "\n\n[정류장 정보]\n이름: " + s.stationName + " (" + s.stationId + ")\n주소: " + s.address +
      "\n\n[버스 도착 정보]\n" + busInfo +
      "\n\n[길찾기 정보]\n강남역 방면: 470번 직행 (4분 후 도착, 약 32분 소요, 12개 정류장, 환승 없음), 대안 741번 (7분 후 도착, 약 37분 소요, 14개 정류장)." +
      "\n\n사용자의 말을 듣고 반드시 아래 형식의 JSON 하나만 출력하세요:\n" +
      '{"screen": "arrival | routes | routeDetail | station | home", "speech": "음성으로 읽어줄 답변"}\n' +
      "- screen 선택 기준: 버스 도착 시간 질문이면 arrival, 목적지·길찾기 질문이면 routes, 특정 경로의 자세한 탑승 방법이면 routeDetail, 정류장 위치·주변 시설 질문이면 station, 인사말이나 그 외 질문이면 home\n" +
      "- speech: 반드시 " + langName + "(으)로, 노약자가 이해하기 쉬운 1~3개의 짧은 문장으로 답하세요.";
  }

  function askGemini(userText) {
    var token = ++aiRequestToken;
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
        var valid = ["arrival", "routes", "routeDetail", "station", "home"];
        setScreen(valid.indexOf(result.screen) !== -1 ? result.screen : "routes");
        if (result.speech) speak(result.speech);
      })
      .catch(function () {
        /* 키 오류·네트워크 오류 시 키워드 방식으로 대체 */
        if (token !== aiRequestToken || state.screen !== "listening") return;
        interpretCommand(userText);
      });
  }

  function setScreen(next) {
    state.screen = next;
    render();
  }

  function goHome() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setScreen("home");
  }

  function goBack() {
    setScreen(state.screen === "routeDetail" ? "routes" : "home");
  }

  /* ---------- 음성 인식 ---------- */
  function interpretCommand(text) {
    var t = text.toLowerCase();
    if (t.indexOf("도착") !== -1 || t.indexOf("arrival") !== -1 || t.indexOf("470") !== -1 || t.indexOf("버스 언제") !== -1) {
      setScreen("arrival");
    } else if (t.indexOf("정류장") !== -1 || t.indexOf("where am i") !== -1 || t.indexOf("현재 위치") !== -1) {
      setScreen("station");
    } else {
      setScreen("routes");
    }
  }

  function startListening() {
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

    var rec = new Recognition();
    rec.lang = localeFor(state.language);
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = function (e) {
      var text = e.results[0][0].transcript;
      state.transcript = text;
      render();
      if (state.settings.geminiKey && state.settings.geminiKey.trim()) {
        askGemini(text);
      } else {
        window.setTimeout(function () { interpretCommand(text); }, 800);
      }
    };
    rec.onerror = function () {
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

  function cancelListening() {
    if (recognitionRef) recognitionRef.stop();
    recognitionRef = null;
    setScreen("home");
  }

  function openArrivalWithVoice() {
    setScreen("arrival");
    speak(state.language === "KO"
      ? "가장 빠른 버스는 470번이며, 약 3분 뒤 도착합니다."
      : "Bus 470 is arriving in about 3 minutes.");
  }

  function selectLanguage(id) {
    state.language = id;
    setScreen("home");
    var msg = id === "KO" ? "한국어 안내를 시작합니다."
      : id === "JA" ? "日本語の案内を開始します。"
      : id === "ZH" ? "开始中文服务。"
      : "English guidance is now active.";
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
    return (
      '<div class="greeting">' +
        '<p class="eyebrow">' + t.station + "</p>" +
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
        '<button class="home-button" data-action="home">' + icon("home", 27) + t.home + "</button>" +
      "</div>"
    );
  }

  function renderRoutes() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var s = state.settings;
    function fact(label, value) {
      return "<div><span>" + label + "</span><strong>" + value + "</strong></div>";
    }
    return (
      '<div class="routes-view content-view">' +
        '<div class="result-heading route-heading">' +
          "<div>" +
            '<p class="eyebrow">' + s.stationName + " → " + (ko ? "강남역" : "Gangnam Station") + "</p>" +
            "<h1>" + t.routeTitle + "</h1>" +
          "</div>" +
          '<button class="listen-button" data-action="speak-routes">' + icon("speaker", 30) + t.speak + "</button>" +
        "</div>" +
        '<article class="route-card recommended">' +
          '<div class="recommend-ribbon">' + icon("check", 22) + t.fastest + "</div>" +
          '<div class="route-number"><span>' + t.direct + "</span><strong>470</strong></div>" +
          '<div class="route-facts">' +
            fact(ko ? "버스 도착" : "Arrival", ko ? "4분 후" : "4 min") +
            fact(ko ? "예상 시간" : "Travel time", ko ? "약 32분" : "32 min") +
            fact(ko ? "이동" : "Stops", ko ? "12개 정류장" : "12 stops") +
            fact(ko ? "환승" : "Transfers", ko ? "없음" : "None") +
          "</div>" +
          '<button class="detail-button" data-action="detail">' + t.detail + icon("arrow", 28) + "</button>" +
        "</article>" +
        '<article class="route-card alternate">' +
          '<div class="route-number"><span>' + (ko ? "다른 경로" : "Alternative") + "</span><strong>741</strong></div>" +
          '<div class="route-facts">' +
            fact(ko ? "버스 도착" : "Arrival", ko ? "7분 후" : "7 min") +
            fact(ko ? "예상 시간" : "Travel time", ko ? "약 37분" : "37 min") +
            fact(ko ? "이동" : "Stops", ko ? "14개 정류장" : "14 stops") +
            fact(ko ? "환승" : "Transfers", ko ? "없음" : "None") +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function renderRouteDetail() {
    var t = STRINGS[state.language];
    var ko = state.language === "KO";
    var s = state.settings;
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
              nearby("광화문역 6번 출구", "1분") +
              nearby("세종문화회관", "3분") +
              nearby("서울역사박물관", "8분") +
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
    function esc(v) {
      return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
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
            '<label>정류장 주소<input data-field="address" value="' + esc(s.address) + '"></label>' +
          "</section>" +
          '<section class="settings-section">' +
            '<div class="settings-section-title">' +
              "<span>" + icon("mic", 29) + "</span>" +
              "<div><h2>AI 기본 프롬프트</h2><p>모든 음성 질문에 공통으로 적용할 안내 원칙입니다.</p></div>" +
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
              "<div><h2>Gemini AI 음성 연동</h2><p>무료 Gemini API 키를 넣으면 음성 질문을 AI가 이해하고 답합니다.</p></div>" +
            "</div>" +
            '<label>Gemini API 키<input data-field="geminiKey" type="password" placeholder="AIza..." value="' + esc(s.geminiKey || "") + '"></label>' +
            '<button class="test-button' + (state.geminiTest === "ok" ? " test-success" : state.geminiTest === "fail" ? " test-fail" : "") + '" data-action="gemini-test"' + (state.geminiTest === "testing" ? " disabled" : "") + ">" + geminiButtonHtml() + "</button>" +
            (state.geminiTest === "fail" && state.geminiErrorMsg
              ? '<p class="test-error">' + esc(state.geminiErrorMsg) + "</p>"
              : "") +
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
      case "saved": body = renderSaved(); break;
    }
    screenEl.innerHTML = backHtml + body;

    resetIdleTimer();
  }

  /* ---------- 자동 홈 복귀 (90초 무동작) ---------- */
  function resetIdleTimer() {
    if (idleTimer) window.clearTimeout(idleTimer);
    idleTimer = null;
    if (state.screen === "home" || state.screen === "settings") return;
    idleTimer = window.setTimeout(function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setScreen("home");
    }, 90000);
  }

  window.addEventListener("pointerdown", function () {
    if (idleTimer) resetIdleTimer();
  });
  window.addEventListener("keydown", function () {
    if (idleTimer) resetIdleTimer();
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
      case "listen": startListening(); break;
      case "cancel": cancelListening(); break;
      case "arrival": setScreen("arrival"); break;
      case "arrival-voice": openArrivalWithVoice(); break;
      case "routes": setScreen("routes"); break;
      case "station": setScreen("station"); break;
      case "language": setScreen("language"); break;
      case "settings": setScreen("settings"); break;
      case "detail": setScreen("routeDetail"); break;
      case "bus-row":
        if (btn.getAttribute("data-bus") === "470") setScreen("routeDetail");
        break;
      case "select-lang":
        selectLanguage(btn.getAttribute("data-lang"));
        break;
      case "speak-arrivals":
        (function () {
          var list = getBuses().filter(function (b) { return b.minutes != null; }).slice(0, 3);
          if (!list.length) {
            speak(ko ? "지금은 도착 예정인 버스 정보가 없습니다." : "There is no arrival information right now.");
            return;
          }
          if (ko) {
            speak(list.map(function (b) {
              return b.number + "번 버스는 " + (b.minutes <= 0 ? "곧" : b.minutes + "분 뒤");
            }).join(", ") + " 도착합니다.");
          } else {
            speak(list.map(function (b) {
              return "Bus " + b.number + " arrives " + (b.minutes <= 0 ? "soon" : "in " + b.minutes + " minutes");
            }).join(", ") + ".");
          }
        })();
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
        speak(ko
          ? "이곳은 " + s.stationName + " 정류장입니다. 정류장 번호는 " + s.stationId + "입니다. 근처에 광화문역 6번 출구와 세종문화회관이 있습니다."
          : "This is " + s.stationName + " bus stop, stop number " + s.stationId + ". Gwanghwamun Station exit 6 and Sejong Center are nearby.");
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
        if (!state.settings.geminiKey || !state.settings.geminiKey.trim()) {
          state.geminiTest = "fail";
          state.geminiErrorMsg = "키를 입력해 주세요.";
          render();
          break;
        }
        state.geminiTest = "testing";
        updateGeminiButton();
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
        loadArrivals();
        setScreen("saved");
        break;
    }
  });

  /* 설정 입력 (포커스 유지를 위해 전체 렌더링 없이 상태만 갱신) */
  document.addEventListener("input", function (e) {
    var field = e.target.getAttribute && e.target.getAttribute("data-field");
    if (!field) return;
    state.settings[field] = e.target.value;
    if (field === "endpoint" && state.testState !== "idle") {
      state.testState = "idle";
      updateTestButton();
    }
    if (field === "geminiKey" && state.geminiTest !== "idle") {
      state.geminiTest = "idle";
      state.geminiErrorMsg = "";
      updateGeminiButton();
      var msgEl = document.querySelector(".test-error");
      if (msgEl) msgEl.remove();
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
  if (["arrival", "routes", "routeDetail", "station", "language", "settings"].indexOf(initialScreen) !== -1) {
    state.screen = initialScreen;
  }
  render();
  loadArrivals();
})();
