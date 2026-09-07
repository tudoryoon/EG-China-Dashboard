const companies = window.dashboardCompanies ?? [];
const usOverviewData = window.usOverviewData ?? { quarterLabels: [], m7Quarterly: [] };
const llmDashboardData = window.llmDashboardData ?? { updatedAt: "", colors: {}, snapshots: [], revenue: null, scaleSpeed: null, openAiUsers: null, openAiAgentUsers: null, anthropicAdoption: null, methodology: [], sources: [] };
const cloudDashboardData = window.cloudDashboardData ?? { labels: [], colors: {}, yoyGrowth: null, margin: null, revenue: null };
const capexDashboardData = window.capexDashboardData ?? {
  quarterLabels: [],
  cashLabels: [],
  annualLabels: [],
  colors: {},
  quarterlyCapex: null,
  quarterlyYoy: null,
  annualCapex: null,
  quarterlyOcf: null,
  quarterlyCapexToOcf: null,
  cashHistory: null,
  debtHistory: null,
  debtToCash: null,
};
const m7PriceData = window.m7PriceData ?? { updatedAt: "", startDate: "2017-01-01", defaultRange: "max", ranges: [], items: {} };
const marketPriceData = window.marketPriceData ?? { updatedAt: "", startDate: "2017-01-01", defaultRange: "max", ranges: [], items: {} };
const studyData = window.studyData ?? { updatedAt: "", startDate: "2025-01-01", defaultRange: "max", ranges: [], dashboards: {} };
const studyDataCenterDeals = window.studyDataCenterDeals ?? { updatedAt: "", scope: "", companies: [], statusLegend: [], deals: [] };
const studyEtfFlowData = window.studyEtfFlowData ?? { updatedAt: "", startDate: "", defaultRange: "ytd", ranges: [], methodology: {}, sources: [], items: {} };
const studyCdsData = window.studyCdsData ?? { updatedAt: "", generatedAt: "", startDate: "", defaultRange: "1y", ranges: [], source: {}, methodology: {}, dates: [], items: {} };
const studyCalendarData = window.studyCalendarData ?? {
  updatedAt: "",
  timezone: "America/New_York",
  displayTimezone: "Asia/Seoul",
  methodology: {},
  weeks: [],
  fallbackSources: [],
};
const trendSearchData = window.trendSearchData ?? { updatedAt: "", generatedAt: "", source: {}, requests: [] };
const trendSearchConfig = window.egTrendSearchConfig ?? { apiUrl: "" };
const marketMacroData = window.marketMacroData ?? { updatedAt: "", startDate: "2017-01-01", defaultRange: "max", ranges: [], panels: {} };
const marketValuationData = window.marketValuationData ?? { updatedAt: "", startDate: "1981-01-01", defaultRange: "max", ranges: [], series: {} };
const marketVixData = window.marketVixData ?? {
  updatedAt: "",
  generatedAt: "",
  startDate: "2017-01-01",
  defaultRange: "1y",
  ranges: [],
  source: {},
  family: {},
  curve: {},
  snapshots: [],
};
const macroIndicatorsData = window.macroIndicatorsData ?? { updatedAt: "", commonStartMonth: "2016-01", indicators: [], categories: [] };
let marketRsData = window.marketRsData ?? {
  updatedAt: "",
  benchmark: { symbol: "^GSPC", label: "S&P 500" },
  historyDates: [],
  historyRanges: [],
  universes: {},
  scoring: { label: "", description: "" },
  rows: [],
  histories: {},
};
const marketCanslimData = window.marketCanslimData ?? { updatedAt: "", scope: {}, profiles: {} };
const marketCanslimEarningsData = window.marketCanslimEarningsData ?? { updatedAt: "", scope: {}, profiles: {} };
let marketTrendScoreData = window.marketTrendScoreData ?? {
  updatedAt: "",
  historyDates: [],
  ranges: [],
  universes: {},
  scoring: { label: "", description: "" },
  rows: {},
  histories: {},
};
const marketRsFinancialsData = window.marketRsFinancialsData ?? {
  updatedAt: "",
  scope: {},
  metrics: [],
  financials: {},
};
const memorySpotData = window.memoryData ?? window.memorySpotData ?? { updatedAt: "", source: {}, cadence: {}, groups: [], dashboards: { featuredKeys: [], basketPanels: [] } };
const memorySpotHistoryData = window.memoryDataHistoryData ?? window.memorySpotHistoryData ?? null;
const studyMemoryCapaData = window.studyMemoryCapaData ?? { updatedAt: "", unit: "", scope: "", quarters: [], legend: [], sections: {} };
const gpuCloudData = window.gpuCloudData ?? { updatedAt: "", source: {}, items: [], dashboard: {} };
const gpuCloudHistoryData = window.gpuCloudHistoryData ?? null;
const ornnGpuIndexData = window.ornnGpuIndexData ?? { updatedAt: "", source: {}, defaultGpu: "h100_sxm", defaultRange: "3m", ranges: [], series: {} };
const egGpuRentalIndexData = window.egGpuRentalIndexData ?? { updatedAt: "", source: {}, methodology: {}, labels: [], indexValues: [], models: {} };
const infraGridData = window.infraGridData ?? { updatedAt: "", source: {}, items: [], fuelColors: {} };
const openrouterRankingsData = window.openrouterRankingsData ?? {
  updatedAt: "",
  generatedAt: "",
  source: {},
  defaultLeaderboard: "week",
  leaderboardViews: [],
  charts: {},
  leaderboards: {},
};
const tokenPriceIndexData = window.tokenPriceIndexData ?? { updatedAt: "", source: {}, methodology: {}, latest: {}, series: {}, comparison: {} };
const memorySpotRuntime = {
  loading: false,
  loaded: false,
  error: "",
  labels: [],
  updatedAt: "",
  items: {},
};
const GITHUB_REPO_OWNER = "tudoryoon";
const GITHUB_REPO_NAME = "EG-China-Dashboard";
const gpuCloudRuntime = {
  loading: false,
  loaded: false,
  error: "",
  labels: [],
  updatedAt: "",
  items: {},
};

const primaryTabMeta = {
  Taiwan: { label: "China & HK & Taiwan", className: "is-taiwan", currencies: ["NTD", "USD"], defaultCurrency: "NTD" },
};

const screeningSubtabMeta = {
  VIX: { label: "VIX" },
  Breadth: { label: "Breadth" },
  RS: { label: "RS" },
  TrendScore: { label: "추세스코어" },
  Canslim: { label: "CANSLIM" },
};

const marketSubtabMeta = {
  Index: { label: "Index" },
  Macro: { label: "Macro" },
  Liquidity: { label: "Liquidity" },
  Valuation: { label: "Valuation" },
  FxCommodities: { label: "FX & Commodities" },
};

const techSubtabMeta = {
  LLM: { label: "LLM" },
  Cloud: { label: "Cloud" },
  BigTech: { label: "Capex & FCF" },
  PowerInfra: { label: "Power Infra" },
};

const flowsSubtabMeta = {
  EtfStatus: { label: "ETF 현황" },
  Cds: { label: "CDS" },
};

const researchSubtabMeta = {
  DataCenter: { label: "Data Center" },
  MemoryCapa: { label: "Memory CAPA" },
  Comparisons: { label: "NVDA vs Memory" },
  M7: { label: "M7" },
  TrendSearch: { label: "Trend 검색" },
};

const marketIndexSubtabMeta = {
  Trend: { label: "Index Trend" },
  Total: { label: "Total Dashboard" },
};

const aiDataSubtabMeta = {
  TokenPrice: { label: "Token Price" },
  OpenRouter: { label: "OpenRouter" },
  MemorySpot: { label: "Memory Data" },
  GPUCloud: { label: "GPU Rental Price" },
};

const studyDataCenterSortOptions = [
  { key: "dateDesc", label: "최신순" },
  { key: "dateAsc", label: "오래된순" },
];

const MARKET_BREADTH_SOURCE_URL = "https://stockbee.blogspot.com/p/mm.html";
const MARKET_BREADTH_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1O6OhS7ciA8zwfycBfGPbP2fWJnR0pn2UUvFZVDP9jpE/pubhtml?widget=true&headers=false";

const marketReferenceItems = [
  {
    name: "S&P 500",
    bucket: "US Large Cap",
    benchmarkTicker: "^GSPC",
    etfTicker: "SPY",
    chartTicker: "SPY",
    description: "Broad US large-cap benchmark with the deepest liquidity and options ecosystem.",
  },
  {
    name: "NASDAQ 100",
    bucket: "US Growth / Tech",
    benchmarkTicker: "^NDX",
    etfTicker: "QQQ",
    chartTicker: "QQQ",
    description: "Mega-cap growth and platform-tech heavy benchmark widely used for AI and software exposure.",
  },
  {
    name: "Dow Jones",
    bucket: "US Blue Chip",
    benchmarkTicker: "^DJI",
    etfTicker: "DIA",
    chartTicker: "DIA",
    description: "Price-weighted blue-chip benchmark representing mature US leaders.",
  },
  {
    name: "Russell 2000",
    bucket: "US Small Cap",
    benchmarkTicker: "^RUT",
    etfTicker: "IWM",
    chartTicker: "IWM",
    description: "Small-cap breadth gauge often used for domestic cyclical and risk-on tracking.",
  },
  {
    name: "M7 Index ETF",
    bucket: "US Mega-cap Theme",
    benchmarkTicker: "MAGS Basket",
    etfTicker: "MAGS",
    chartTicker: "MAGS",
    description: "Concentrated Magnificent 7 ETF for pure mega-cap platform exposure.",
  },
  {
    name: "VanEck Semiconductor ETF",
    bucket: "Semiconductor",
    benchmarkTicker: "MVSMHTR",
    etfTicker: "SMH",
    chartTicker: "SMH",
    description: "Flagship semi ETF covering leading fabless, foundry, memory, and equipment names.",
  },
];

const currencyMeta = {
  NTD: { label: "NT$", decimals: 1, suffix: "B" },
  USD: { label: "$", decimals: 1, suffix: "B" },
};

const yearColors = ["#2563eb", "#7c3aed", "#f59e0b", "#14b8a6", "#d93025", "#0f172a"];
const SERIES_START_YEAR = 2021;
const SERIES_START_MONTH = 1;
const TOTAL_DASHBOARD_COLOR_BY_KEY = {
  "market:sp500": "#111827",
  "market:nasdaq100": "#2563eb",
  "market:dowjones": "#6b7280",
  "market:russell2000": "#8b5cf6",
  "market:sox": "#dc2626",
  "market:vkospi": "#7c3aed",
  "market:smh": "#dc2626",
  "macro:policy:fed_funds": "#e11d48",
  "macro:policy:inflation_5y": "#f97316",
  "macro:policy:real_5y": "#dc2626",
  "macro:gdp:real_gdp_annualized": "#8b5cf6",
  "macro:rates:us2y": "#0f766e",
  "macro:rates:us5y": "#22c55e",
  "macro:rates:us10y": "#14b8a6",
  "macro:rates:us30y": "#06b6d4",
  "macro:rates:us10y_minus_us30y": "#475569",
  "macro:rates:jp2y": "#f59e0b",
  "macro:rates:jp10y": "#f97316",
  "macro:rates:jp30y": "#ef4444",
  "macro:dxy:dxy": "#7c3aed",
  "macro:energy:wti": "#16a34a",
  "macro:energy:brent": "#65a30d",
  "macro:energy:dubai": "#f97316",
  "macro:natural_gas:henry_hub": "#0f766e",
  "macro:natural_gas:lng_jkm": "#2563eb",
  "macro:metals:gold": "#d4a017",
  "macro:metals:silver": "#94a3b8",
  "macro:metals:copper": "#b45309",
  "macro:strategic:uranium": "#16a34a",
  "macro:strategic:iron_ore": "#b45309",
  "macro:strategic:nickel": "#64748b",
  "macro:strategic:zinc": "#0ea5e9",
  "indicator:headline_cpi_yoy": "#7c3aed",
  "indicator:core_cpi_yoy": "#db2777",
  "indicator:headline_pce_yoy": "#0f766e",
  "indicator:core_pce_yoy": "#14b8a6",
  "indicator:final_demand_ppi_yoy": "#f97316",
  "indicator:core_ppi_yoy": "#dc2626",
};
const MARKET_PRICE_EMA_OPTIONS = [20, 50, 100, 200];
const MARKET_TREND_PRICE_CHART_TYPES = [
  { key: "candle", label: "Candle" },
  { key: "line", label: "Line" },
];
const MARKET_PRICE_TREND_INDEX_OPTIONS = [
  { key: "sp500", label: "S&P 500" },
  { key: "dowjones", label: "Dow Jones" },
  { key: "nasdaq100", label: "NASDAQ 100" },
  { key: "sox", label: "SOX" },
  { key: "russell2000", label: "Russell 2000" },
  { key: "vkospi", label: "VKOSPI" },
];
const BRIEFING_ROTATION_DISTRIBUTION_BENCHMARKS = [
  {
    key: "qqq",
    label: "QQQ",
    itemKey: "nasdaq100",
    couplingLabel: "high QQQ",
    description: "NASDAQ 100 기준입니다. 빅테크/성장주와 같이 움직이는지 보기에 좋습니다.",
  },
  {
    key: "sox",
    label: "SOX",
    itemKey: "sox",
    couplingLabel: "high SOX",
    description: "필라델피아 반도체지수 기준입니다. 반도체 사이클과의 연동성을 봅니다.",
  },
];
const BRIEFING_ROTATION_DISTRIBUTION_X_AXES = [
  { key: "score", label: "Score", title: "Rotation Score", kind: "score", description: "1D/1W/2W/1M 초과수익률을 가중한 기존 Rotation Score입니다." },
  { key: "1w", label: "1W", title: "1W relative return", kind: "return", description: "최근 1주 섹터 혼합수익률에서 선택 지수 수익률을 뺀 값입니다." },
  { key: "2w", label: "2W", title: "2W relative return", kind: "return", description: "최근 2주 섹터 혼합수익률에서 선택 지수 수익률을 뺀 값입니다." },
  { key: "1m", label: "1M", title: "1M relative return", kind: "return", description: "최근 1개월 섹터 혼합수익률에서 선택 지수 수익률을 뺀 값입니다." },
  { key: "3m", label: "3M", title: "3M relative return", kind: "return", description: "최근 3개월 섹터 혼합수익률에서 선택 지수 수익률을 뺀 값입니다." },
  { key: "6m", label: "6M", title: "6M relative return", kind: "return", description: "최근 6개월 섹터 혼합수익률에서 선택 지수 수익률을 뺀 값입니다." },
];
const BRIEFING_ROTATION_DISTRIBUTION_PERIODS = {
  "1w": 5,
  "2w": 10,
  "1m": 21,
  "3m": 63,
  "6m": 126,
};
const BRIEFING_ROTATION_DISTRIBUTION_CORR_WINDOWS = [
  { key: "1m", label: "1M", sessions: 21, description: "최근 21거래일 기준입니다. 짧은 국면 변화를 민감하게 봅니다." },
  { key: "2m", label: "2M", sessions: 42, description: "최근 42거래일 기준입니다. 단기 노이즈와 추세의 균형을 봅니다." },
  { key: "3m", label: "3M", sessions: 63, description: "최근 63거래일 기준입니다. 기본값이며 3개월 동행성을 봅니다." },
];
const MARKET_RS_CAP_RANGES = [
  { key: "all", label: "All", min: 0, max: Number.POSITIVE_INFINITY },
  { key: "200m-1b", label: "$200M-$1B", min: 200_000_000, max: 1_000_000_000 },
  { key: "1b-10b", label: "$1B-$10B", min: 1_000_000_000, max: 10_000_000_000 },
  { key: "10b-100b", label: "$10B-$100B", min: 10_000_000_000, max: 100_000_000_000 },
  { key: "100b-plus", label: "$100B+", min: 100_000_000_000, max: Number.POSITIVE_INFINITY },
];

const ENABLE_TREND_SCORE_LIMITED_CARDS = true;
const TREND_SCORE_CARD_BATCH_SIZE = 100;
const ENABLE_RS_LIMITED_CARDS = true;
const RS_CARD_BATCH_SIZE = 100;
const ENABLE_CANSLIM_LIMITED_CARDS = true;
const CANSLIM_CARD_BATCH_SIZE = 100;

const FX_CURRENCY_OPTIONS = [
  { key: "KRW", label: "KRW", name: "Korean Won", seriesKey: "krw_usd", quoteConvention: "unitsPerUsd" },
  { key: "USD", label: "USD", name: "US Dollar", seriesKey: null, quoteConvention: "usd" },
  { key: "JPY", label: "JPY", name: "Japanese Yen", seriesKey: "jpy_usd", quoteConvention: "unitsPerUsd" },
  { key: "EUR", label: "EUR", name: "Euro", seriesKey: "eur_usd", quoteConvention: "usdPerUnit" },
  { key: "GBP", label: "GBP", name: "British Pound", seriesKey: "gbp_usd", quoteConvention: "usdPerUnit" },
  { key: "CHF", label: "CHF", name: "Swiss Franc", seriesKey: "chf_usd", quoteConvention: "unitsPerUsd" },
  { key: "CNY", label: "CNY", name: "Chinese Yuan", seriesKey: "cny_usd", quoteConvention: "unitsPerUsd" },
];

const state = {
  tab: "Taiwan",
  screeningView: "RS",
  asiaView: "Taiwan",
  marketView: "Index",
  marketIndexView: "Trend",
  techView: "LLM",
  flowsView: "EtfStatus",
  researchView: "DataCenter",
  aiDataView: "TokenPrice",
  currency: "NTD",
  sector: "All",
  query: "",
  sort: "marketCapDesc",
  m7PriceMode: "relative",
  m7PriceRange: "3y",
  studyMemoryCapaSection: "dram",
  studyRange: studyData.defaultRange ?? "max",
  studyCdsRange: studyCdsData.defaultRange ?? "1y",
  studyCdsIndexSelection: ["sox"],
  studyCdsCompanySelection: ["GOOGL", "MSFT", "NVDA", "META", "ORCL", "AMZN"],
  studyEtfFlowRange: studyEtfFlowData.defaultRange ?? "ytd",
  studyDataCenterCompany: "All",
  studyDataCenterSort: "dateDesc",
  trendSearchRequestId: trendSearchData.requests?.[0]?.id ?? "",
  trendSearchKeywords: (trendSearchData.requests?.[0]?.keywords ?? ["NVIDIA", "OpenAI", "HBM"]).join(", "),
  trendSearchGeo: trendSearchData.requests?.[0]?.geo ?? "US",
  trendSearchMode: trendSearchData.requests?.[0]?.mode ?? "web",
  trendSearchRange: trendSearchData.requests?.[0]?.range ?? "today 12-m",
  trendSearchLines: { raw: true, sma7: true, sma20: true },
  trendSearchLiveRequest: null,
  trendSearchStatus: "",
  trendSearchLoading: false,
  marketPriceRange: "3y",
  marketTrendRange: "3y",
  marketTrendIndex: "sp500",
  marketTrendChartType: "candle",
  marketTrendEmas: [20, 100],
  marketTrendCustomStart: "",
  marketTrendCustomEnd: "",
  marketVixMetricsRange: "3y",
  marketVixMetricsCustomStart: "",
  marketVixMetricsCustomEnd: "",
  marketVixFamilyRange: "3y",
  marketVixFamilyCustomStart: "",
  marketVixFamilyCustomEnd: "",
  marketVixFixedIncomeRange: "3y",
  marketVixFixedIncomeCustomStart: "",
  marketVixFixedIncomeCustomEnd: "",
  marketMacroRanges: Object.fromEntries(
    Object.keys(marketMacroData?.panels ?? {}).map((key) => [key, key === "liquidity_net" ? "max" : "3y"]),
  ),
  marketMacroCustomRanges: {},
  marketMacroSelections: Object.fromEntries(
    Object.entries(marketMacroData?.panels ?? {}).map(([panelKey, panel]) => [
      panelKey,
      panelKey === "liquidity_net" && panel?.series?.fed_assets
        ? ["fed_assets"]
        : Object.keys(panel?.series ?? {}),
    ]),
  ),
  fxBaseCurrency: "KRW",
  fxQuoteCurrency: "USD",
  marketValuationRange: "3y",
  marketValuationCustomStart: "",
  marketValuationCustomEnd: "",
  marketValuationSelection: ["cape", "dailyCapeProxy", "sp500"],
  totalDashboardRange: "3y",
  totalDashboardSelection: [
    "market:nasdaq100",
    "macro:rates:us10y",
    "macro:rates:us30y",
    "macro:rates:us10y_minus_us30y",
  ],
  totalDashboardCustomStart: "",
  totalDashboardCustomEnd: "",
  briefingMapRange: "1d",
  briefingRotationSectorKey: "",
  briefingRotationDistributionBenchmark: "qqq",
  briefingRotationDistributionXAxis: "score",
  briefingRotationDistributionCorrWindow: "3m",
  rsUniverse: "all",
  rsHistoryRange: "1y",
  rsSelectedTicker: "",
  rsMonitorSelectedTicker: "",
  rsFilter: "all",
  rsBriefingSector: "briefingAll",
  rsMarketCapRange: "all",
  rsCustomMarketCapMin: "",
  rsCustomMarketCapMax: "",
  rsScoreRange: "all",
  rsCustomScoreMin: "",
  rsCustomScoreMax: "",
  rsNewHighBriefingOnly: true,
  rsNewHighLargeCapOnly: true,
  rsPeriodLeadersBriefingOnly: true,
  rsPeriodLeadersLargeCapOnly: true,
  rsLeaderSort: "rs",
  rsTableSortKey: "rs",
  rsTableSortDirection: "desc",
  rsVisibleCardCount: RS_CARD_BATCH_SIZE,
  rsPriceChartType: "candle",
  rsVolumeVisible: true,
  rsChartSeries: {
    rs: true,
    ema10: false,
    ema20: true,
    ema50: false,
    ema100: true,
    ema200: false,
  },
  trendScoreUniverse: "all",
  trendScoreRange: "1y",
  trendScoreSelectedTicker: "",
  trendScoreMarketCapRange: "all",
  trendScoreCustomMarketCapMin: "",
  trendScoreCustomMarketCapMax: "",
  trendScoreScoreRange: "all",
  trendScoreCustomScoreMin: "",
  trendScoreCustomScoreMax: "",
  trendScoreClimaxRange: "all",
  trendScoreCustomClimaxMin: "",
  trendScoreCustomClimaxMax: "",
  trendScoreBriefingSector: "briefingAll",
  trendScoreTableSortKey: "rank",
  trendScoreTableSortDirection: "asc",
  trendScoreVisibleCardCount: TREND_SCORE_CARD_BATCH_SIZE,
  canslimSelectedTicker: "",
  canslimUniverse: "all",
  canslimBriefingSector: "briefingAll",
  canslimSort: "canslimDesc",
  canslimVisibleCardCount: CANSLIM_CARD_BATCH_SIZE,
  macroIndicatorKey: "",
  macroSeriesKey: "",
  macroHistoryMode: "common",
  macroDashboardRange: "3y",
  macroDashboardCustomStart: "",
  macroDashboardCustomEnd: "",
  macroDashboardSelection: [
    "market:sp500",
    "policy:fed_funds",
    "rates:us2y",
    "rates:us10y",
  ],
  memorySpotRanges: {},
  infraRanges: Object.fromEntries(
    Object.keys(infraGridData?.panels ?? {}).map((key) => [key, infraGridData.defaultRange ?? "3y"]),
  ),
  infraSelections: Object.fromEntries(
    Object.entries(infraGridData?.panels ?? {}).map(([panelKey, panel]) => [
      panelKey,
      Object.keys(panel?.series ?? {}),
    ]),
  ),
  ornnGpuKey: ornnGpuIndexData.defaultGpu ?? "h100_sxm",
  ornnGpuRange: "3y",
  openrouterLeaderboardView: openrouterRankingsData.defaultLeaderboard ?? "week",
  openrouterOpennessFilter: "all",
  openrouterScale: "linear",
};

const DASHBOARD_ROUTE_META = {
  Taiwan: {
    slug: "taiwan", viewStateKey: "asiaView", defaultView: "Taiwan",
    views: { Taiwan: "overview", HongKongRS: "hong-kong-rs", HongKongTrend: "hong-kong-trend", ChinaRS: "china-rs", ChinaTrend: "china-trend" },
  },
};

let isApplyingDashboardRoute = false;

function findDashboardRouteKey(values, slug) {
  const normalizedSlug = String(slug ?? "").toLowerCase();
  return Object.keys(values ?? {}).find((key) => values[key].toLowerCase() === normalizedSlug) ?? "";
}

function getDashboardRouteParts(hash = window.location.hash) {
  return String(hash ?? "")
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part).toLowerCase();
      } catch {
        return part.toLowerCase();
      }
    });
}

function buildDashboardRouteHash() {
  const tabKey = DASHBOARD_ROUTE_META[state.tab] ? state.tab : "Taiwan";
  const route = DASHBOARD_ROUTE_META[tabKey];
  const parts = [route.slug];

  if (route.viewStateKey) {
    const viewKey = route.views[state[route.viewStateKey]] ? state[route.viewStateKey] : route.defaultView;
    parts.push(route.views[viewKey]);
    const nestedRoute = route.nestedViews?.[viewKey];
    if (nestedRoute) {
      const nestedViewKey = nestedRoute.views[state[nestedRoute.viewStateKey]]
        ? state[nestedRoute.viewStateKey]
        : nestedRoute.defaultView;
      parts.push(nestedRoute.views[nestedViewKey]);
    }
  }

  return `#/${parts.join("/")}`;
}

function applyDashboardRouteFromHash(hash = window.location.hash) {
  const parts = getDashboardRouteParts(hash);
  const requestedTab = Object.keys(DASHBOARD_ROUTE_META).find(
    (tabKey) => DASHBOARD_ROUTE_META[tabKey].slug === parts[0],
  );
  const tabKey = requestedTab || "Taiwan";
  const route = DASHBOARD_ROUTE_META[tabKey];

  state.tab = tabKey;
  state.currency = tabKey === "Taiwan" ? primaryTabMeta.Taiwan.defaultCurrency : "USD";

  if (route.viewStateKey) {
    const viewKey = findDashboardRouteKey(route.views, parts[1]) || route.defaultView;
    state[route.viewStateKey] = viewKey;
    const nestedRoute = route.nestedViews?.[viewKey];
    if (nestedRoute) {
      const nestedViewKey = findDashboardRouteKey(nestedRoute.views, parts[2]) || nestedRoute.defaultView;
      state[nestedRoute.viewStateKey] = nestedViewKey;
    }
  }

  return buildDashboardRouteHash();
}

function syncDashboardRoute({ replace = false } = {}) {
  if (isApplyingDashboardRoute) {
    return;
  }
  const nextHash = buildDashboardRouteHash();
  if (window.location.hash === nextHash) {
    return;
  }
  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
  window.history[replace ? "replaceState" : "pushState"]({ dashboardRoute: nextHash }, "", nextUrl);
}

function handleDashboardRouteChange() {
  if (window.location.hash === buildDashboardRouteHash()) {
    return;
  }
  isApplyingDashboardRoute = true;
  const canonicalHash = applyDashboardRouteFromHash();
  render();
  isApplyingDashboardRoute = false;
  if (window.location.hash !== canonicalHash) {
    syncDashboardRoute({ replace: true });
  }
}

const marketCanslimAnalysisCache = new Map();
let marketCanslimDirectionCache = null;
const marketRsRowByTicker = new Map((marketRsData.rows ?? []).map((row) => [row.ticker, row]));

const usScreeningData = { rs: marketRsData, trend: marketTrendScoreData };
const asiaScreeningData = {};
const asiaScreeningLoads = {};
const asiaScreeningErrors = {};
const screeningContextStates = {};
let screeningContext = "us";
const screeningStateKeys = Object.keys(state).filter((key) => key.startsWith("rs") || key.startsWith("trendScore") || key === "query");
const defaultScreeningState = structuredClone(Object.fromEntries(screeningStateKeys.map((key) => [key, state[key]])));

function getAsiaScreeningRegion() {
  if (state.tab !== "Taiwan") return "";
  if (state.asiaView.startsWith("HongKong")) return "hk";
  if (state.asiaView.startsWith("China")) return "cn";
  return "";
}

function setScreeningContext(region = "us") {
  if (screeningContext === region) return;
  screeningContextStates[screeningContext] = structuredClone(Object.fromEntries(screeningStateKeys.map((key) => [key, state[key]])));
  const next = screeningContextStates[region] ?? {
    ...structuredClone(defaultScreeningState), rsBriefingSector: "all", trendScoreBriefingSector: "all",
    rsNewHighBriefingOnly: false, rsPeriodLeadersBriefingOnly: false,
    rsNewHighLargeCapOnly: false, rsPeriodLeadersLargeCapOnly: false,
  };
  Object.assign(state, next);
  const data = region === "us" ? usScreeningData : asiaScreeningData[region];
  marketRsData = data.rs;
  marketTrendScoreData = data.trend;
  marketRsRowByTicker.clear();
  marketRsData.rows.forEach((row) => marketRsRowByTicker.set(row.ticker, row));
  screeningContext = region;
  if (searchInput) searchInput.value = state.query;
}

function ensureAsiaScreeningLoaded(region) {
  if (asiaScreeningData[region]) return true;
  if (!asiaScreeningLoads[region] && !asiaScreeningErrors[region]) {
    asiaScreeningLoads[region] = fetch(`./data/asia-${region}-screening.json`, { cache: "no-cache" })
      .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
      .then((data) => {
        if (!data.rs?.rows?.length || !data.trend?.rows?.all?.length) throw new Error("Empty screening data");
        asiaScreeningData[region] = data;
      })
      .catch((error) => { asiaScreeningErrors[region] = error.message; })
      .finally(() => { delete asiaScreeningLoads[region]; if (getAsiaScreeningRegion() === region) render(); });
  }
  return false;
}

function renderAsiaScreening(region) {
  const data = asiaScreeningData[region];
  if (!data) {
    companyGrid.classList.add("hidden");
    usOverviewRoot.classList.remove("hidden");
    usOverviewRoot.innerHTML = `<p>${asiaScreeningErrors[region] ? "데이터를 불러오지 못했습니다." : "종목 데이터를 불러오는 중..."}</p>${asiaScreeningErrors[region] ? '<button type="button" data-asia-retry>다시 시도</button>' : ""}`;
    usOverviewRoot.querySelector("[data-asia-retry]")?.addEventListener("click", () => { delete asiaScreeningErrors[region]; render(); });
    return;
  }
  if (state.asiaView.endsWith("Trend")) renderMarketTrendScoreOverview();
  else renderMarketRsOverview();
  const labels = document.createTreeWalker(usOverviewRoot, NodeFilter.SHOW_TEXT);
  while (labels.nextNode()) {
    labels.currentNode.textContent = labels.currentNode.textContent.replaceAll("Daily Briefing 종목", "관심종목").replaceAll("Daily Briefing", "관심종목").replaceAll("Briefing Sector", "분류").replaceAll("Briefing", "분류").replaceAll("switch NASDAQ100/S&P500", "filter the regional universe");
  }
  const meta = data.meta;
  summaryText.textContent = `${meta.label} · ${meta.covered}/${meta.requested} 종목 · 주가 ${meta.currency} / 시총 USD · 상대추세 기준 ${meta.benchmarkLabel}`;
  const note = document.createElement("details");
  note.className = "asia-screening-sources";
  const provisional = data.rs.rows.filter((row) => row.provisional).length;
  const missing = Object.keys(meta.missing ?? {});
  note.innerHTML = `<summary>구성종목 출처 · 데이터 기준</summary><p>${escapeHtml(meta.benchmarkNote)}. RS는 각 시장의 현재 개별주 유니버스에서 계산하며 ETF는 순위 산출에서 제외합니다. 1년 미만 이력 ${provisional}개는 가용 기간 RS이며, 200거래일 미만 추세스코어는 미산출입니다. 과거 RS도 현재 구성종목 기준입니다.</p><p>${meta.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} (${source.count})</a>`).join(" · ")}</p>${missing.length ? `<p>수집 누락: ${escapeHtml(missing.join(", "))}</p>` : ""}`;
  usOverviewRoot.prepend(note);
}

const charts = [];
let marketRsDetailChart = null;
let marketRsVolumeChart = null;
let marketTrendDetailChart = null;

const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const sortBox = document.querySelector(".sortbox");
const countrySwitch = document.querySelector("#country-switch");
const subtabSwitch = document.querySelector("#subtab-switch");
const nestedSubtabSwitch = document.querySelector("#nested-subtab-switch");
const nestedSubtabRow = document.querySelector("#nested-subtab-row");
const currencySwitch = document.querySelector("#currency-switch");
const sectorChips = document.querySelector("#sector-chips");
const companyGrid = document.querySelector("#company-grid");
const summaryText = document.querySelector("#summary-text");
const cardTemplate = document.querySelector("#company-card-template");
const usOverviewRoot = document.querySelector("#us-overview");
const toolbarRow = document.querySelector(".toolbar .toolbar-row-filters");
const brandMeta = document.querySelector(".brand-meta");
const headerCalendarLink = document.querySelector("#header-calendar-link");
let searchRenderTimer = null;

function resetTrendScoreCardLimit() {
  state.trendScoreVisibleCardCount = TREND_SCORE_CARD_BATCH_SIZE;
}

function resetRsCardLimit() {
  state.rsVisibleCardCount = RS_CARD_BATCH_SIZE;
}

function resetCanslimCardLimit() {
  state.canslimVisibleCardCount = CANSLIM_CARD_BATCH_SIZE;
}

function formatKstDateTime(dateText) {
  if (!dateText) {
    return "";
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

async function refreshBrandMeta() {
  if (!brandMeta) {
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits/main`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) {
      return;
    }
    const payload = await response.json();
    const committedAt = payload?.commit?.committer?.date;
    const formatted = formatKstDateTime(committedAt);
    if (formatted) {
      brandMeta.textContent = `Updated ${formatted} KST`;
    }
  } catch (error) {
    console.warn("Failed to refresh brand meta", error);
  }
}

function formatCompactDollarMillions(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  }
  return `$${value.toFixed(0)}M`;
}

function formatShortIsoDate(dateText) {
  if (!dateText) {
    return "-";
  }
  const [year, month] = dateText.split("-");
  return `${year.slice(2)}/${month}`;
}

function normalizeMarketTickerSearch(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.(us|uw|uq|un|n|o)$/i, "")
    .replace(/\s+(us|equity)$/i, "");
}

function marketTickerSearchTerms(ticker, name = "") {
  const normalizedTicker = normalizeMarketTickerSearch(ticker);
  const terms = [
    normalizedTicker,
    `${normalizedTicker} us`,
    String(ticker ?? "").trim().toLowerCase(),
    String(name ?? "").trim().toLowerCase(),
  ];
  return [...new Set(terms.filter(Boolean))];
}

function formatFullIsoDate(dateText) {
  if (!dateText) {
    return "-";
  }
  const [year, month, day] = dateText.split("-");
  if (!year || !month || !day) {
    return dateText;
  }
  return `${year}-${month}-${day}`;
}

function formatMonthLabel(monthText) {
  if (!monthText) {
    return "-";
  }
  const [year, month] = monthText.split("-");
  if (!year || !month) {
    return monthText;
  }
  return `${year.slice(2)}/${month}`;
}

function toDateKey(dateText) {
  if (!dateText) {
    return "";
  }
  return dateText.length === 7 ? `${dateText}-01` : dateText;
}

function toDateInputValue(dateText) {
  return toDateKey(dateText);
}

function formatRangeAxisDate(dateText, rangeKey) {
  if (!dateText) {
    return "-";
  }
  const [year, month, day] = dateText.split("-");
  if (rangeKey === "1m") {
    return `${month}/${day}`;
  }
  return `${year.slice(2)}/${month}`;
}

function buildMonthlyTickIndexes(labels, maxCount = 10) {
  if (!Array.isArray(labels) || !labels.length) {
    return [];
  }
  const stride = Math.max(1, Math.ceil(labels.length / maxCount));
  const ticks = [];
  for (let index = 0; index < labels.length; index += stride) {
    ticks.push(index);
  }
  const unique = [...new Set(ticks)].sort((a, b) => a - b);
  const deduped = [];
  let lastLabel = "";
  unique.forEach((index) => {
    const label = formatMonthLabel(labels[index]);
    if (label && label !== lastLabel) {
      deduped.push(index);
      lastLabel = label;
    }
  });
  return deduped;
}

function diffUtcDays(startText, endText) {
  const start = new Date(`${startText}T00:00:00Z`);
  const end = new Date(`${endText}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function diffUtcMonths(startText, endText) {
  const start = new Date(`${startText}T00:00:00Z`);
  const end = new Date(`${endText}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }
  return Math.max(
    0,
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()),
  );
}

function getRegularTickStep(labels, rangeKey) {
  if (!labels?.length) {
    return { mode: "none", step: 1 };
  }
  if (rangeKey === "1m") {
    return { mode: "days", step: 7 };
  }
  if (rangeKey === "3m" || rangeKey === "6m") {
    return { mode: "months", step: 1 };
  }
  if (rangeKey === "1y") {
    return { mode: "months", step: 2 };
  }
  if (rangeKey === "ytd") {
    return { mode: "months", step: 1 };
  }
  if (rangeKey === "3y") {
    return { mode: "months", step: 3 };
  }
  if (rangeKey === "5y") {
    return { mode: "months", step: 6 };
  }

  const startLabel = labels[0];
  const endLabel = labels[labels.length - 1];
  const spanDays = diffUtcDays(startLabel, endLabel);
  const spanMonths = diffUtcMonths(startLabel, endLabel);
  if (spanDays <= 45) {
    return { mode: "days", step: 7 };
  }
  if (spanMonths <= 6) {
    return { mode: "months", step: 1 };
  }
  if (spanMonths <= 18) {
    return { mode: "months", step: 2 };
  }
  if (spanMonths <= 48) {
    return { mode: "months", step: 3 };
  }
  if (spanMonths <= 96) {
    return { mode: "months", step: 6 };
  }
  return { mode: "months", step: 12 };
}

function buildRegularDateTickIndexes(labels, rangeKey) {
  if (!labels?.length) {
    return [];
  }

  const config = getRegularTickStep(labels, rangeKey);
  const ticks = [];
  let lastIndex = -1;
  let lastDayTick = null;
  let lastMonthBucket = null;
  const firstDate = new Date(`${labels[0]}T00:00:00Z`);
  const firstMonthBase = firstDate.getUTCFullYear() * 12 + firstDate.getUTCMonth();

  labels.forEach((label, index) => {
    const date = new Date(`${label}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    if (config.mode === "days") {
      if (!lastDayTick || date.getTime() - lastDayTick >= config.step * 86400000) {
        ticks.push(index);
        lastIndex = index;
        lastDayTick = date.getTime();
      }
      return;
    }

    const monthBucket = date.getUTCFullYear() * 12 + date.getUTCMonth();
    const relativeBucket = monthBucket - firstMonthBase;
    if (relativeBucket % config.step !== 0) {
      return;
    }
    if (monthBucket !== lastMonthBucket) {
      ticks.push(index);
      lastIndex = index;
      lastMonthBucket = monthBucket;
    }
  });

  const uniqueTicks = [...new Set(ticks)];
  const dedupedTicks = [];
  let lastLabel = "";
  uniqueTicks.forEach((index) => {
    const label = formatRangeAxisDate(labels[index], rangeKey);
    if (label && label !== lastLabel) {
      dedupedTicks.push(index);
      lastLabel = label;
    }
  });

  return dedupedTicks;
}

function capDateTickIndexes(labels, indexes, rangeKey, maxCount) {
  if (!Array.isArray(indexes) || indexes.length <= maxCount) {
    return indexes;
  }
  if (!Number.isFinite(maxCount) || maxCount < 2) {
    return indexes;
  }

  const stride = Math.max(1, Math.ceil(indexes.length / maxCount));
  const sampled = indexes.filter((_, index) => index % stride === 0);
  const unique = [...new Set(sampled)].sort((a, b) => a - b);
  const deduped = [];
  let lastLabel = "";
  unique.forEach((index) => {
    const label = formatRangeAxisDate(labels[index], rangeKey);
    if (label && label !== lastLabel) {
      deduped.push(index);
      lastLabel = label;
    }
  });
  return deduped;
}

function getMacroTickIndexes(labels, rangeKey, chartWidth = 0) {
  const baseIndexes = buildRegularDateTickIndexes(labels, rangeKey);
  const width = Number(chartWidth) || 0;
  let maxCount = 7;

  if (width && width < 560) {
    maxCount = 4;
  } else if (width && width < 760) {
    maxCount = 5;
  } else if (width && width < 980) {
    maxCount = 6;
  }

  if (rangeKey === "1m") {
    maxCount = Math.min(maxCount, 5);
  } else if (rangeKey === "3m" || rangeKey === "6m") {
    maxCount = Math.min(maxCount, 6);
  }

  return capDateTickIndexes(labels, baseIndexes, rangeKey, maxCount);
}

function shiftDateByRange(dateText, rangeKey, minStartDate = "2017-01-01", availableDates = []) {
  if (!dateText || rangeKey === "max") {
    return minStartDate;
  }
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return minStartDate;
  }
  if (rangeKey === "ytd") {
    const yearStart = `${date.getUTCFullYear()}-01-01`;
    const priorYearClose = [...(availableDates ?? [])]
      .map((value) => toDateKey(value))
      .filter((value) => value && value >= minStartDate && value < yearStart)
      .sort()
      .at(-1);
    return priorYearClose ?? `${date.getUTCFullYear() - 1}-12-31`;
  }

  const rangeMap = {
    "1m": { unit: "month", value: 1 },
    "3m": { unit: "month", value: 3 },
    "6m": { unit: "month", value: 6 },
    "1y": { unit: "year", value: 1 },
    "3y": { unit: "year", value: 3 },
    "5y": { unit: "year", value: 5 },
    "10y": { unit: "year", value: 10 },
  };
  const config = rangeMap[rangeKey];
  if (!config) {
    return minStartDate;
  }

  if (config.unit === "month") {
    date.setUTCMonth(date.getUTCMonth() - config.value);
  } else {
    date.setUTCFullYear(date.getUTCFullYear() - config.value);
  }
  return date.toISOString().slice(0, 10);
}

function buildRelativePriceChartPayload(priceData, rangeKey) {
  const items = Object.entries(priceData?.items ?? {});
  const allDates = [...new Set(items.flatMap(([, item]) => item.dates ?? []))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = allDates[allDates.length - 1];
  const startDate = shiftDateByRange(latestDate, rangeKey, priceData?.startDate ?? "2017-01-01", allDates);
  const selectedLabels = allDates.filter((label) => label >= startDate);

  const datasets = items.map(([key, item]) => {
    const dateIndex = new Map();
    (item.dates ?? []).forEach((date, index) => {
      dateIndex.set(date, index);
    });
    const baseDate = selectedLabels.find((label) => dateIndex.has(label));
    const baseIndex = baseDate ? dateIndex.get(baseDate) : null;
    const baseValue = baseIndex !== null && baseIndex !== undefined ? item.values?.[baseIndex] : null;

    const values = selectedLabels.map((label) => {
      if (!Number.isFinite(baseValue)) {
        return null;
      }
      const pointIndex = dateIndex.get(label);
      if (pointIndex === undefined) {
        return null;
      }
      const pointValue = item.values?.[pointIndex];
      if (!Number.isFinite(pointValue)) {
        return null;
      }
      return Number(((pointValue / baseValue) * 100).toFixed(2));
    });

    return {
      key,
      label: item.label,
      data: values,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: item.isIndex ? 3 : 2.2,
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
    };
  });

  return { labels: selectedLabels, datasets };
}

function createRelativePriceChart(canvas, priceData, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildRelativePriceChartPayload(priceData, rangeKey);
  const allValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 80;
  const maxValue = allValues.length ? Math.max(...allValues) : 180;
  const yMin = Math.floor((minValue - 5) / 10) * 10;
  const yMax = Math.ceil((maxValue + 5) / 10) * 10;

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0).map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}`,
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: rangeKey === "ytd" ? "Prior-year close = 100" : "Start = 100",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createM7RelativeChart(canvas, rangeKey) {
  createRelativePriceChart(canvas, m7PriceData, rangeKey);
}

function formatM7MarketCap(value, digits = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  if (Math.abs(numeric) >= 1000) {
    return `$${(numeric / 1000).toFixed(digits)}T`;
  }
  return `$${numeric.toFixed(0)}B`;
}

function buildM7MarketCapChartPayload(rangeKey) {
  const items = Object.entries(m7PriceData?.items ?? {});
  const allDates = [...new Set(items.flatMap(([, item]) => item.dates ?? []))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = allDates[allDates.length - 1];
  const startDate = shiftDateByRange(latestDate, rangeKey, m7PriceData?.startDate ?? "2017-01-01", allDates);
  const labels = allDates.filter((label) => label >= startDate);
  const datasets = items.map(([key, item]) => {
    const dateIndex = new Map((item.dates ?? []).map((date, index) => [date, index]));
    return {
      key,
      label: item.label,
      data: labels.map((label) => {
        const pointIndex = dateIndex.get(label);
        const value = pointIndex === undefined ? null : item.marketCaps?.[pointIndex];
        return Number.isFinite(value) ? value : null;
      }),
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: 2.2,
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
    };
  });
  return { labels, datasets };
}

function createM7MarketCapChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }
  const payload = buildM7MarketCapChartPayload(rangeKey);
  const chart = new Chart(canvas, {
    type: "line",
    data: payload,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatM7MarketCap(context.parsed.y, 2)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0).map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatM7MarketCap(value),
            maxTicksLimit: 7,
          },
          title: { display: true, text: "Market Cap (USD)", color: "#8d8d86" },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function createMarketRelativeChart(canvas, rangeKey) {
  createRelativePriceChart(canvas, marketPriceData, rangeKey);
}

function formatStudyTrillion(value, digits = 2) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric < 0 ? "-" : "";
  return `${sign}$${Math.abs(numeric).toFixed(digits)}T`;
}

function formatStudyRatio(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(2)}x`;
}

function getStudyMemoryDashboard() {
  return studyData?.dashboards?.memoryVsNvda ?? null;
}

function buildStudyMemoryPayload(rangeKey) {
  const panel = getStudyMemoryDashboard();
  const dates = panel?.dates ?? [];
  if (!panel || !dates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = dates[dates.length - 1];
  const startDate = shiftDateByRange(latestDate, rangeKey, studyData?.startDate ?? "2025-01-01", dates);
  const startIndex = Math.max(
    0,
    dates.findIndex((label) => label >= startDate),
  );
  const labels = dates.slice(startIndex >= 0 ? startIndex : 0);
  const series = panel.series ?? {};
  const seriesConfig = [
    { key: "memoryBasket", width: 3.2, order: 1 },
    { key: "nvda", width: 3.2, order: 2 },
    { key: "coreMemoryBasket", width: 1.8, dash: [8, 5], order: 3 },
    { key: "samsung", width: 1.5, dash: [6, 5], order: 4 },
    { key: "skHynix", width: 1.5, dash: [6, 5], order: 5 },
    { key: "micron", width: 1.5, dash: [6, 5], order: 6 },
    { key: "cxmt", width: 1.9, dash: [3, 4], order: 7 },
  ];

  const datasets = seriesConfig
    .map((config) => {
      const item = series[config.key];
      if (!item?.values?.length) {
        return null;
      }
      return {
        label: item.label,
        data: item.values.slice(startIndex >= 0 ? startIndex : 0),
        borderColor: item.color,
        backgroundColor: item.color,
        borderWidth: config.width,
        borderDash: config.dash ?? [],
        tension: 0.22,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        spanGaps: true,
        order: config.order,
      };
    })
    .filter(Boolean);

  return { labels, datasets };
}

function createStudyMemoryVsNvdaChart(canvas, rangeKey) {
  if (typeof Chart === "undefined" || !canvas) {
    return;
  }

  const payload = buildStudyMemoryPayload(rangeKey);
  const values = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(Number(value))));
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 5;
  const yMin = Math.max(0, Math.floor((minValue - 0.1) * 10) / 10);
  const yMax = Math.ceil((maxValue + 0.15) * 10) / 10;
  const tickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const tickSet = new Set(tickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatStudyTrillion(context.parsed.y, 3)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatStudyTrillion(value, 1),
            maxTicksLimit: 7,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

const TREND_SEARCH_COLORS = ["#0f766e", "#2563eb", "#d97706", "#7c3aed", "#dc2626"];

function normalizeTrendSearchKeywords(value) {
  return [...new Set(String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean))].slice(0, 5);
}

function formatTrendSearchMode(mode) {
  return mode === "youtube" ? "YouTube Search" : "Web Search";
}

function formatTrendSearchGeo(geo) {
  if (!geo) return "Global";
  if (geo === "KR") return "Korea";
  if (geo === "US") return "United States";
  return geo;
}

function formatTrendSearchRange(range) {
  const labels = {
    "today 3-m": "90D",
    "today 12-m": "1Y",
    "today 5-y": "5Y",
  };
  return labels[range] ?? range;
}

function calculateTrendSearchAverage(values, window) {
  const output = [];
  const validValues = [];
  (values ?? []).forEach((value) => {
    const numeric = Number(value);
    validValues.push(Number.isFinite(numeric) ? numeric : null);
    const observations = validValues.slice(Math.max(0, validValues.length - window)).filter(Number.isFinite);
    output.push(observations.length ? observations.reduce((sum, item) => sum + item, 0) / observations.length : null);
  });
  return output;
}

function findSavedTrendSearchRequest(keywords, geo, mode, range) {
  const targetKeywords = normalizeTrendSearchKeywords(keywords).map((value) => value.toLowerCase());
  return (trendSearchData.requests ?? []).find((request) => {
    const requestKeywords = normalizeTrendSearchKeywords(request.keywords ?? []).map((value) => value.toLowerCase());
    return (
      requestKeywords.length === targetKeywords.length &&
      requestKeywords.every((value, index) => value === targetKeywords[index]) &&
      (request.geo ?? "") === geo &&
      (request.mode ?? "web") === mode &&
      (request.range ?? "today 12-m") === range
    );
  });
}

function getActiveTrendSearchRequest() {
  if (state.trendSearchLiveRequest?.labels?.length) {
    return state.trendSearchLiveRequest;
  }
  const requestById = (trendSearchData.requests ?? []).find((request) => request.id === state.trendSearchRequestId);
  if (requestById?.labels?.length) {
    return requestById;
  }
  return findSavedTrendSearchRequest(
    state.trendSearchKeywords,
    state.trendSearchGeo,
    state.trendSearchMode,
    state.trendSearchRange,
  );
}

function buildTrendSearchExploreUrl(keywords, geo, mode, range) {
  const url = new URL("https://trends.google.com/trends/explore");
  url.searchParams.set("date", range);
  if (geo) url.searchParams.set("geo", geo);
  if (mode === "youtube") url.searchParams.set("gprop", "youtube");
  url.searchParams.set("q", keywords.join(","));
  return url.toString();
}

function buildTrendSearchApiUrl(keywords, geo, mode, range) {
  const endpoint = String(trendSearchConfig.apiUrl ?? "").trim();
  if (!endpoint) return "";
  const url = new URL(endpoint);
  url.searchParams.set("q", keywords.join(","));
  url.searchParams.set("geo", geo);
  url.searchParams.set("mode", mode);
  url.searchParams.set("range", range);
  return url.toString();
}

function createTrendSearchChart(canvas, request) {
  if (typeof Chart === "undefined" || !canvas || !request?.labels?.length) {
    return;
  }
  const tickIndexes = buildMonthlyTickIndexes(request.labels, 10);
  const tickSet = new Set(tickIndexes);
  const chartLines = state.trendSearchLines ?? {};
  const datasets = (request.series ?? []).flatMap((series, index) => {
    const color = TREND_SEARCH_COLORS[index % TREND_SEARCH_COLORS.length];
    const raw = (series.values ?? []).map((value) => (Number.isFinite(Number(value)) ? Number(value) : null));
    const lines = [];
    if (chartLines.raw !== false) {
      lines.push({
        label: series.label,
        data: raw,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 12,
        tension: 0.16,
        spanGaps: true,
      });
    }
    if (chartLines.sma7 !== false) {
      lines.push({
        label: `${series.label} 7MA`,
        data: calculateTrendSearchAverage(raw, 7),
        borderColor: color,
        borderWidth: 1.6,
        borderDash: [7, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.2,
        spanGaps: true,
      });
    }
    if (chartLines.sma20 !== false) {
      lines.push({
        label: `${series.label} 20MA`,
        data: calculateTrendSearchAverage(raw, 20),
        borderColor: color,
        borderWidth: 1.5,
        borderDash: [2, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.2,
        spanGaps: true,
      });
    }
    return lines;
  });

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: request.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 14 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toFixed(context.dataset.label.includes("MA") ? 1 : 0)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(request.labels[value], "1y") : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#8d8d86", callback: (value) => `${value}`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function buildTrendSearchSnapshotMarkup(request) {
  return (request?.series ?? [])
    .map((series, index) => {
      const values = (series.values ?? []).map(Number).filter(Number.isFinite);
      const latest = values.at(-1);
      const average = calculateTrendSearchAverage(series.values ?? [], 7).filter(Number.isFinite).at(-1);
      const tone = TREND_SEARCH_COLORS[index % TREND_SEARCH_COLORS.length];
      return `
        <article class="trend-search-snapshot" style="--trend-search-color: ${tone}">
          <span>${escapeHtml(series.label)}</span>
          <strong>${Number.isFinite(latest) ? latest.toFixed(0) : "-"}</strong>
          <small>7MA ${Number.isFinite(average) ? average.toFixed(1) : "-"}</small>
        </article>`;
    })
    .join("");
}

async function runTrendSearch() {
  const keywords = normalizeTrendSearchKeywords(state.trendSearchKeywords);
  if (!keywords.length) {
    state.trendSearchStatus = "키워드를 하나 이상 입력해 주세요.";
    renderTrendSearchOverview();
    return;
  }
  state.trendSearchKeywords = keywords.join(", ");
  const saved = findSavedTrendSearchRequest(keywords, state.trendSearchGeo, state.trendSearchMode, state.trendSearchRange);
  if (saved?.labels?.length) {
    state.trendSearchLiveRequest = null;
    state.trendSearchRequestId = saved.id;
    state.trendSearchStatus = "저장된 일별 스냅샷을 불러왔습니다.";
    renderTrendSearchOverview();
    return;
  }

  const apiUrl = buildTrendSearchApiUrl(keywords, state.trendSearchGeo, state.trendSearchMode, state.trendSearchRange);
  if (!apiUrl) {
    state.trendSearchStatus = "라이브 검색 프록시가 아직 연결되지 않았습니다. 아래 저장 검색을 사용하거나 Google Trends에서 직접 열 수 있습니다.";
    renderTrendSearchOverview();
    return;
  }

  state.trendSearchLoading = true;
  state.trendSearchStatus = "Google Trends를 조회하고 있습니다.";
  renderTrendSearchOverview();
  try {
    const response = await fetch(apiUrl);
    const payload = await response.json();
    if (!response.ok || payload?.error) {
      throw new Error(payload?.error || `Search failed (${response.status})`);
    }
    state.trendSearchLiveRequest = payload;
    state.trendSearchRequestId = "";
    state.trendSearchStatus = "라이브 조회 완료";
  } catch (error) {
    state.trendSearchStatus = `라이브 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`;
  } finally {
    state.trendSearchLoading = false;
    renderTrendSearchOverview();
  }
}

function renderTrendSearchOverview() {
  destroyCharts();
  const activeRequest = getActiveTrendSearchRequest();
  const keywords = normalizeTrendSearchKeywords(state.trendSearchKeywords);
  const exploreUrl = buildTrendSearchExploreUrl(keywords, state.trendSearchGeo, state.trendSearchMode, state.trendSearchRange);
  const savedRequests = trendSearchData.requests ?? [];
  const savedMarkup = savedRequests
    .map((request) => `
      <button type="button" class="trend-search-saved-chip${request.id === state.trendSearchRequestId && !state.trendSearchLiveRequest ? " active" : ""}" data-trend-search-saved="${escapeHtml(request.id)}">
        ${escapeHtml(request.label || request.keywords?.join(" / ") || "Saved search")}
      </button>`)
    .join("");
  const lineMarkup = [
    ["raw", "Interest"],
    ["sma7", "7MA"],
    ["sma20", "20MA"],
  ]
    .map(([key, label]) => `
      <button type="button" class="trend-search-line-toggle${state.trendSearchLines?.[key] !== false ? " active" : ""}" data-trend-search-line="${key}">
        <span></span>${label}
      </button>`)
    .join("");
  const chartMarkup = activeRequest?.labels?.length
    ? `<div class="trend-search-chart-wrap"><canvas data-trend-search-chart aria-label="Google Trends interest and moving average chart"></canvas></div>`
    : `<div class="trend-search-empty">저장된 Google Trends 데이터가 아직 없습니다. 다음 일별 업데이트 후 기본 검색이 채워집니다.</div>`;
  const sourceLabel = state.trendSearchLiveRequest ? "Live proxy" : activeRequest ? "Daily cached snapshot" : "Waiting for first refresh";
  const statusMarkup = state.trendSearchStatus
    ? `<div class="trend-search-status${state.trendSearchStatus.includes("실패") || state.trendSearchStatus.includes("연결") ? " is-warning" : ""}">${escapeHtml(state.trendSearchStatus)}</div>`
    : "";

  companyGrid.classList.add("hidden");
  usOverviewRoot.classList.remove("hidden");
  usOverviewRoot.innerHTML = `
    <section class="trend-search-page">
      <section class="us-panel trend-search-panel">
        <header class="trend-search-head">
          <div>
            <p>SEARCH DEMAND MONITOR</p>
            <h2>Google Trends + Moving Average</h2>
            <span>검색 관심도 0-100 상대지수입니다. 절대 검색량이 아니며, 5Y에서는 7/20 관측치 기준 이평선으로 표시됩니다.</span>
          </div>
          <a class="market-breadth-link" href="${escapeHtml(trendSearchData.source?.url || "https://trends.google.com/trends/")}" target="_blank" rel="noreferrer">Google Trends</a>
        </header>
        <form class="trend-search-form" id="trend-search-form">
          <label class="trend-search-field is-keywords">
            <span>키워드</span>
            <input id="trend-search-keywords" type="text" maxlength="180" value="${escapeHtml(state.trendSearchKeywords)}" placeholder="NVIDIA, OpenAI, HBM" />
          </label>
          <label class="trend-search-field">
            <span>지역</span>
            <select id="trend-search-geo">
              <option value=""${state.trendSearchGeo === "" ? " selected" : ""}>Global</option>
              <option value="US"${state.trendSearchGeo === "US" ? " selected" : ""}>United States</option>
              <option value="KR"${state.trendSearchGeo === "KR" ? " selected" : ""}>Korea</option>
            </select>
          </label>
          <label class="trend-search-field">
            <span>검색 유형</span>
            <select id="trend-search-mode">
              <option value="web"${state.trendSearchMode === "web" ? " selected" : ""}>Web Search</option>
              <option value="youtube"${state.trendSearchMode === "youtube" ? " selected" : ""}>YouTube Search</option>
            </select>
          </label>
          <label class="trend-search-field">
            <span>기간</span>
            <select id="trend-search-range">
              <option value="today 3-m"${state.trendSearchRange === "today 3-m" ? " selected" : ""}>90D</option>
              <option value="today 12-m"${state.trendSearchRange === "today 12-m" ? " selected" : ""}>1Y</option>
              <option value="today 5-y"${state.trendSearchRange === "today 5-y" ? " selected" : ""}>5Y</option>
            </select>
          </label>
          <button type="submit" class="trend-search-submit"${state.trendSearchLoading ? " disabled" : ""}>${state.trendSearchLoading ? "조회 중" : "검색"}</button>
          <a class="trend-search-external" href="${escapeHtml(exploreUrl)}" target="_blank" rel="noreferrer">Google Trends 열기</a>
        </form>
        <div class="trend-search-underbar">
          <div class="trend-search-saved-row">${savedMarkup || "<span>저장 검색 준비 중</span>"}</div>
          <div class="trend-search-line-row">${lineMarkup}</div>
        </div>
        ${statusMarkup}
        <div class="trend-search-context">
          <span>${escapeHtml(formatTrendSearchMode(activeRequest?.mode ?? state.trendSearchMode))}</span>
          <span>${escapeHtml(formatTrendSearchGeo(activeRequest?.geo ?? state.trendSearchGeo))}</span>
          <span>${escapeHtml(formatTrendSearchRange(activeRequest?.range ?? state.trendSearchRange))}</span>
          <span>${escapeHtml(sourceLabel)}</span>
          ${activeRequest?.updatedAt ? `<span>Updated ${escapeHtml(formatKstDateTime(activeRequest.updatedAt) || activeRequest.updatedAt)}</span>` : ""}
        </div>
        ${chartMarkup}
        ${activeRequest?.series?.length ? `<div class="trend-search-snapshot-grid">${buildTrendSearchSnapshotMarkup(activeRequest)}</div>` : ""}
        <footer class="trend-search-note">
          100은 현재 검색 조건 안에서 가장 높은 상대 관심도입니다. 동일 조건 안의 비교에는 유용하지만 서로 다른 요청의 수치를 절대 검색량처럼 비교하면 안 됩니다.
        </footer>
      </section>
    </section>
  `;

  if (activeRequest?.labels?.length) {
    createTrendSearchChart(usOverviewRoot.querySelector("[data-trend-search-chart]"), activeRequest);
  }

  usOverviewRoot.querySelector("#trend-search-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.trendSearchKeywords = usOverviewRoot.querySelector("#trend-search-keywords")?.value ?? "";
    state.trendSearchGeo = usOverviewRoot.querySelector("#trend-search-geo")?.value ?? "US";
    state.trendSearchMode = usOverviewRoot.querySelector("#trend-search-mode")?.value ?? "web";
    state.trendSearchRange = usOverviewRoot.querySelector("#trend-search-range")?.value ?? "today 12-m";
    state.trendSearchLiveRequest = null;
    runTrendSearch();
  });
  usOverviewRoot.querySelectorAll("[data-trend-search-saved]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = savedRequests.find((item) => item.id === button.dataset.trendSearchSaved);
      if (!request) return;
      state.trendSearchRequestId = request.id;
      state.trendSearchKeywords = (request.keywords ?? []).join(", ");
      state.trendSearchGeo = request.geo ?? "";
      state.trendSearchMode = request.mode ?? "web";
      state.trendSearchRange = request.range ?? "today 12-m";
      state.trendSearchLiveRequest = null;
      state.trendSearchStatus = "저장된 일별 스냅샷을 불러왔습니다.";
      renderTrendSearchOverview();
    });
  });
  usOverviewRoot.querySelectorAll("[data-trend-search-line]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.trendSearchLine;
      state.trendSearchLines = { ...state.trendSearchLines, [key]: state.trendSearchLines?.[key] === false };
      renderTrendSearchOverview();
    });
  });
}

function buildMemoryCapaYearHeaders(quarters) {
  const groups = [];
  (quarters ?? []).forEach((quarter) => {
    const previous = groups[groups.length - 1];
    if (previous?.year === quarter.year) {
      previous.count += 1;
    } else {
      groups.push({ year: quarter.year, count: 1 });
    }
  });
  return groups
    .map((group) => `<th class="memory-capa-year-head" colspan="${group.count}">${escapeHtml(group.year)}</th>`)
    .join("");
}

function renderMemoryCapaSourceLinks(sources) {
  return (sources ?? [])
    .map(
      (source) => `
        <a class="study-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(source.label)}
        </a>`,
    )
    .join("");
}

function parseMemoryCapaModelValue(value) {
  const normalized = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return normalized ? Number(normalized[0]) : null;
}

function renderMemoryCapaModelValue(values, index, showYoy = true, yoyLabels = null) {
  const value = values?.[index] ?? "-";
  const current = parseMemoryCapaModelValue(value);
  const previous = index > 0 ? parseMemoryCapaModelValue(values?.[index - 1]) : null;
  let yoyLabel = index === 0 ? "기준" : "N/A";
  let yoyTone = "base";
  if (Number.isFinite(current) && Number.isFinite(previous) && previous !== 0) {
    const yoy = ((current / previous) - 1) * 100;
    yoyLabel = `YoY ${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}%`;
    yoyTone = yoy > 0.05 ? "positive" : yoy < -0.05 ? "negative" : "flat";
  }
  if (Array.isArray(yoyLabels) && yoyLabels[index]) {
    yoyLabel = String(yoyLabels[index]);
    yoyTone = yoyLabel.includes("+") ? "positive" : yoyLabel.includes("-") ? "negative" : "base";
  }
  return `
    <td>
      <strong class="memory-capa-model-value">${escapeHtml(value)}</strong>
      ${showYoy ? `<small class="memory-capa-model-yoy memory-capa-model-yoy-${yoyTone}">${escapeHtml(yoyLabel)}</small>` : ""}
    </td>`;
}

function renderMemoryCapaAnnualModel(section) {
  const model = section?.annualModel;
  if (!model?.rows?.length || !model?.years?.length) {
    return "";
  }

  const yearHeadMarkup = model.years.map((year) => `<th>${escapeHtml(year)}</th>`).join("");
  const rowMarkup = model.rows
    .map(
      (row) => `
        <tr class="${row.total ? "memory-capa-model-total" : ""}">
          <th>${escapeHtml(row.label || "-")}</th>
          ${(row.values ?? [])
            .map((_, index) => renderMemoryCapaModelValue(row.values, index, model.showYoy !== false, row.yoy))
            .join("")}
        </tr>`,
    )
    .join("");
  const sourceMarkup = renderMemoryCapaSourceLinks(model.sources);

  return `
    <div class="memory-capa-model">
      <div class="memory-capa-model-head">
        <div>
          <strong>${escapeHtml(model.title || "Annual model")}</strong>
          <span>${escapeHtml(model.unit || "")}</span>
        </div>
        <span class="memory-capa-model-badge">${escapeHtml(model.badge || "Scenario")}</span>
      </div>
      <div class="memory-capa-model-table-wrap">
        <table class="memory-capa-model-table">
          <thead>
            <tr><th>회사</th>${yearHeadMarkup}</tr>
          </thead>
          <tbody>${rowMarkup}</tbody>
        </table>
      </div>
      <div class="memory-capa-model-note">
        <span>${escapeHtml(model.note || "")}</span>
        <div class="study-source-list memory-capa-source-list">${sourceMarkup}</div>
      </div>
    </div>`;
}

function renderMemoryCapaCriteria(section) {
  const criteria = section?.criteria;
  if (!criteria?.length) {
    return "";
  }

  return `
    <div class="memory-capa-criteria" aria-label="표시 기준">
      ${criteria
        .map(
          (item) => `
            <div class="memory-capa-criterion">
              <span>${escapeHtml(item.label || "기준")}</span>
              <strong>${escapeHtml(item.value || "-")}</strong>
              <small>${escapeHtml(item.note || "")}</small>
            </div>`,
        )
        .join("")}
    </div>`;
}

function renderMemoryCapaHbmAllocation(section) {
  const model = section?.hbmAllocation;
  if (!model?.rows?.length || !model?.years?.length) {
    return "";
  }

  const yearHeadMarkup = model.years.map((year) => `<th>${escapeHtml(year)}</th>`).join("");
  const rowMarkup = model.rows
    .map(
      (row) => `
        <tr>
          <th>${escapeHtml(row.label || "-")}</th>
          ${(row.values ?? [])
            .map(
              (value) => `
                <td>
                  <strong class="memory-capa-hbm-share">${escapeHtml(value?.share === "N/D" ? "N/D" : value?.share || "-")}</strong>
                  <small class="memory-capa-hbm-wpm">${escapeHtml(value?.wpm === "N/D" ? "환산 N/D" : `환산 ${value?.wpm || "-"}`)}</small>
                </td>`,
            )
            .join("")}
        </tr>`,
    )
    .join("");
  const sourceMarkup = renderMemoryCapaSourceLinks(model.sources);

  return `
    <div class="memory-capa-model memory-capa-hbm-model">
      <div class="memory-capa-model-head">
        <div>
          <strong>${escapeHtml(model.title || "HBM wafer allocation")}</strong>
          <span>${escapeHtml(model.unit || "")}</span>
        </div>
        <span class="memory-capa-model-badge memory-capa-hbm-badge">${escapeHtml(model.badge || "Estimate")}</span>
      </div>
      <div class="memory-capa-model-table-wrap">
        <table class="memory-capa-model-table memory-capa-hbm-table">
          <thead>
            <tr><th>회사</th>${yearHeadMarkup}</tr>
          </thead>
          <tbody>${rowMarkup}</tbody>
        </table>
      </div>
      <div class="memory-capa-model-note">
        <span>${escapeHtml(model.note || "")}</span>
        <div class="study-source-list memory-capa-source-list">${sourceMarkup}</div>
      </div>
    </div>`;
}

function renderMemoryCapaCompanyRows(sectionKey, section, quarters) {
  return (section?.companyRows ?? [])
    .map((row, rowIndex) => {
      const cellMarkup = (quarters ?? [])
        .map((quarter) => {
          const cell = row.cells?.[quarter.key];
          if (!cell) {
            return `<td class="memory-capa-quarter-cell memory-capa-empty"></td>`;
          }
          const tooltip = [quarter.year, quarter.label, row.company, cell.value, cell.delta, cell.detail].filter(Boolean).join(" · ");
          return `
            <td class="memory-capa-quarter-cell memory-capa-clickable memory-capa-${escapeHtml(cell.status || "planned")}" title="${escapeHtml(tooltip)}">
              <button
                type="button"
                class="memory-capa-cell-button"
                data-memory-capa-section="${escapeHtml(sectionKey)}"
                data-memory-capa-row="${rowIndex}"
                data-memory-capa-quarter="${escapeHtml(quarter.key)}"
                aria-label="${escapeHtml(`${row.company} ${quarter.year} ${quarter.label} ${cell.value || ""} 근거 보기`)}"
              >
                <strong>${escapeHtml(cell.value || "")}</strong>
                <small>${escapeHtml(cell.delta || "")}</small>
                <span class="memory-capa-cell-indicator" aria-hidden="true">ⓘ</span>
              </button>
            </td>`;
        })
        .join("");
      const sourceMarkup = renderMemoryCapaSourceLinks(row.sources);
      return `
        <tr>
          <td class="memory-capa-company-cell">
            <span class="study-company-badge">${escapeHtml(row.company || "-")}</span>
          </td>
          <td class="memory-capa-scope-cell">
            <div class="memory-capa-scope-head">
              <strong>${escapeHtml(row.scope || "-")}</strong>
              ${row.confidence ? `<span class="memory-capa-confidence memory-capa-confidence-${escapeHtml(row.confidenceTone || "reported")}">${escapeHtml(row.confidence)}</span>` : ""}
            </div>
            <small>${escapeHtml(row.summary || "")}</small>
            <div class="study-source-list memory-capa-source-list">${sourceMarkup || "-"}</div>
          </td>
          ${cellMarkup}
        </tr>`;
    })
    .join("");
}

function renderMemoryCapaRows(section, quarters) {
  return (section?.rows ?? [])
    .map((row) => {
      const cellMarkup = (quarters ?? [])
        .map((quarter) => {
          const cell = row.cells?.[quarter.key];
          if (!cell) {
            return `<td class="memory-capa-quarter-cell memory-capa-empty"></td>`;
          }
          return `
            <td class="memory-capa-quarter-cell memory-capa-${escapeHtml(cell.status || "planned")}">
              <strong>${escapeHtml(cell.label || "")}</strong>
              <small>${escapeHtml(cell.note || "")}</small>
            </td>`;
        })
        .join("");
      const sourceMarkup = renderMemoryCapaSourceLinks(row.sources);
      return `
        <tr>
          <td>
            <span class="study-company-badge">${escapeHtml(row.company || "-")}</span>
          </td>
          <td>
            <strong>${escapeHtml(row.fab || "-")}</strong>
            <small>${escapeHtml(row.location || "-")}</small>
          </td>
          <td>
            <strong>${escapeHtml(row.product || "-")}</strong>
            <small>${escapeHtml(row.target || "-")}</small>
          </td>
          <td>
            <span class="memory-capa-confidence">${escapeHtml(row.confidence || "pending")}</span>
            <small>${escapeHtml(row.note || "")}</small>
            <div class="study-source-list memory-capa-source-list">${sourceMarkup || "-"}</div>
          </td>
          ${cellMarkup}
        </tr>`;
    })
    .join("");
}

function renderMemoryCapaSection(sectionKey, section, quarters) {
  const usesCompanyRows = Boolean(section?.companyRows?.length);
  const quarterHeader = (quarters ?? []).map((quarter) => `<th>${escapeHtml(quarter.label)}</th>`).join("");
  const rowMarkup = usesCompanyRows ? renderMemoryCapaCompanyRows(sectionKey, section, quarters) : renderMemoryCapaRows(section, quarters);
  const isPlaceholder = !rowMarkup.trim();
  const criteriaMarkup = renderMemoryCapaCriteria(section);
  const annualModelMarkup = renderMemoryCapaAnnualModel(section);
  const hbmAllocationMarkup = renderMemoryCapaHbmAllocation(section);
  const metricNoteMarkup = section?.metricNote
    ? `<div class="memory-capa-metric-note">${escapeHtml(section.metricNote)}</div>`
    : "";
  const baseHeadMarkup = usesCompanyRows
    ? `
              <th rowspan="2">회사</th>
              <th rowspan="2">Scope / 근거</th>`
    : `
              <th rowspan="2">회사</th>
              <th rowspan="2">Fab / 위치</th>
              <th rowspan="2">제품 / 규모</th>
              <th rowspan="2">근거 / 메모</th>`;
  return `
    <section class="memory-capa-section${isPlaceholder ? " memory-capa-section-placeholder" : ""}">
      <div class="us-section-head">
        <div>
          <h3>${escapeHtml(section?.title || sectionKey)}</h3>
          <p>${escapeHtml(section?.subtitle || "")}</p>
        </div>
      </div>
      ${criteriaMarkup}
      ${annualModelMarkup}
      ${hbmAllocationMarkup}
      ${metricNoteMarkup}
      <div class="memory-capa-roadmap-head">
        <strong>${escapeHtml(section?.roadmapTitle || "분기별 생산 이벤트")}</strong>
        <span>${escapeHtml(section?.roadmapNote || "셀을 클릭하면 상세 근거를 확인할 수 있습니다.")}</span>
      </div>
      <div class="memory-capa-table-wrap">
        <table class="memory-capa-table${usesCompanyRows ? " memory-capa-table-compact" : ""}">
          <thead>
            <tr>
              ${baseHeadMarkup}
              ${buildMemoryCapaYearHeaders(quarters)}
            </tr>
            <tr>${quarterHeader}</tr>
          </thead>
          <tbody>${rowMarkup}</tbody>
        </table>
      </div>
    </section>`;
}

function openMemoryCapaCellDetail(sectionKey, rowIndex, quarterKey) {
  const section = studyMemoryCapaData.sections?.[sectionKey];
  const row = section?.companyRows?.[rowIndex];
  const cell = row?.cells?.[quarterKey];
  const quarter = studyMemoryCapaData.quarters?.find((item) => item.key === quarterKey);
  const dialog = usOverviewRoot.querySelector("[data-memory-capa-dialog]");
  const body = dialog?.querySelector("[data-memory-capa-dialog-body]");
  if (!dialog || !body || !row || !cell || !quarter) {
    return;
  }

  const sources = Array.isArray(cell.sourceIndexes)
    ? cell.sourceIndexes.map((index) => row.sources?.[index]).filter(Boolean)
    : (row.sources ?? []);
  const sourceMarkup = renderMemoryCapaSourceLinks(sources);
  const sourceCaption = Array.isArray(cell.sourceIndexes) ? "이 수치의 직접 근거" : "행 단위 검증 자료";
  body.innerHTML = `
    <div class="memory-capa-dialog-period">${escapeHtml(`${quarter.year} ${quarter.label}`)}</div>
    <h3>${escapeHtml(row.company || "-")}</h3>
    <div class="memory-capa-dialog-value">
      <strong>${escapeHtml(cell.value || "-")}</strong>
      <span>${escapeHtml(cell.delta || "")}</span>
    </div>
    <dl class="memory-capa-dialog-facts">
      <div>
        <dt>대상</dt>
        <dd>${escapeHtml(row.scope || "-")}</dd>
      </div>
      <div>
        <dt>수치 해석</dt>
        <dd>${escapeHtml(cell.detail || "세부 설명이 없습니다.")}</dd>
      </div>
      <div>
        <dt>산정 기준</dt>
        <dd>${escapeHtml(cell.basis || `${row.confidence || "공개자료"} 기반 일정·CAPA 추정`)}</dd>
      </div>
      <div>
        <dt>신뢰도</dt>
        <dd>${escapeHtml(row.confidence || "-")}</dd>
      </div>
    </dl>
    <div class="memory-capa-dialog-sources">
      <span>${escapeHtml(sourceCaption)}</span>
      <div class="study-source-list">${sourceMarkup || "직접 연결된 공개 링크 없음"}</div>
    </div>`;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function bindMemoryCapaCellDetails() {
  const dialog = usOverviewRoot.querySelector("[data-memory-capa-dialog]");
  usOverviewRoot.querySelectorAll("[data-memory-capa-section]").forEach((button) => {
    button.addEventListener("click", () => {
      openMemoryCapaCellDetail(
        button.dataset.memoryCapaSection,
        Number(button.dataset.memoryCapaRow),
        button.dataset.memoryCapaQuarter,
      );
    });
  });
  dialog?.querySelector("[data-memory-capa-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function bindMemoryCapaSectionTabs() {
  usOverviewRoot.querySelectorAll("[data-memory-capa-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSection = button.dataset.memoryCapaView;
      if (!studyMemoryCapaData.sections?.[nextSection] || nextSection === state.studyMemoryCapaSection) {
        return;
      }
      state.studyMemoryCapaSection = nextSection;
      renderStudyMemoryCapaOverview();
    });
  });
}

function renderStudyMemoryCapaOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const quarters = studyMemoryCapaData.quarters ?? [];
  const sections = studyMemoryCapaData.sections ?? {};
  if (!quarters.length || !sections.dram) {
    renderPlaceholderOverview("Memory Capa", "Memory capacity roadmap data is not available yet.");
    return;
  }

  const sectionOptions = [
    { key: "dram", label: "DRAM" },
    { key: "nand", label: "NAND" },
    { key: "hdd", label: "HDD" },
  ];
  const activeSectionKey = sections[state.studyMemoryCapaSection] ? state.studyMemoryCapaSection : "dram";
  const activeSection = sections[activeSectionKey];

  const legendMarkup = (studyMemoryCapaData.legend ?? [])
    .map((item) => `<span class="memory-capa-legend-item memory-capa-legend-${escapeHtml(item.tone)}">${escapeHtml(item.label)}</span>`)
    .join("");
  const kpiMarkup = (activeSection?.kpis ?? [])
    .map(
      (item, index) => `
        <article class="study-kpi-card${index === 1 ? " study-kpi-card-green" : ""}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          <small>${escapeHtml(item.note)}</small>
        </article>`,
    )
    .join("");
  const kpiGridMarkup = kpiMarkup ? `<div class="study-kpi-grid memory-capa-kpi-grid">${kpiMarkup}</div>` : "";
  const sectionTabMarkup = sectionOptions
    .map(
      (option) => `
        <button
          type="button"
          class="memory-capa-subtab${option.key === activeSectionKey ? " active" : ""}"
          data-memory-capa-view="${escapeHtml(option.key)}"
          role="tab"
          aria-selected="${option.key === activeSectionKey ? "true" : "false"}"
        >${escapeHtml(option.label)}</button>`,
    )
    .join("");
  const sectionMarkup = renderMemoryCapaSection(activeSectionKey, activeSection, quarters);

  usOverviewRoot.innerHTML = `
    <section class="market-overview study-overview memory-capa-overview">
      <section class="us-panel study-panel memory-capa-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Memory Capa</h2>
            <p>DRAM·NAND wafer CAPA와 HDD exabyte 공급능력의 핵심 이벤트를 분기별로 비교합니다. 모델 추정과 회사 공식 일정을 구분해 표시합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${escapeHtml(studyMemoryCapaData.updatedAt || "-")}</div>
          </div>
        </div>
        <div class="memory-capa-subtabs" role="tablist" aria-label="Memory capacity category">
          ${sectionTabMarkup}
        </div>
        ${kpiGridMarkup}
        <div class="market-trend-meta memory-capa-note">
          <span>${escapeHtml(studyMemoryCapaData.unit || "")}</span>
          <span>${escapeHtml(studyMemoryCapaData.scope || "")}</span>
        </div>
        <div class="memory-capa-legend">${legendMarkup}</div>
        ${sectionMarkup}
      </section>
    </section>
    <dialog class="memory-capa-dialog" data-memory-capa-dialog>
      <div class="memory-capa-dialog-head">
        <strong>CAPA 근거 상세</strong>
        <button type="button" class="memory-capa-dialog-close" data-memory-capa-dialog-close aria-label="닫기">×</button>
      </div>
      <div class="memory-capa-dialog-body" data-memory-capa-dialog-body></div>
    </dialog>
  `;
  bindMemoryCapaSectionTabs();
  bindMemoryCapaCellDetails();
}

function calculateEmaSeries(values, period) {
  if (!Array.isArray(values) || !values.length || !Number.isFinite(period) || period <= 1) {
    return values?.slice?.() ?? [];
  }
  const multiplier = 2 / (period + 1);
  const result = [];
  let ema = null;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) {
      result.push(null);
      return;
    }
    if (ema === null) {
      const seedWindow = values.slice(Math.max(0, index - period + 1), index + 1).filter((item) => Number.isFinite(item));
      if (seedWindow.length < Math.min(period, index + 1)) {
        result.push(null);
        return;
      }
      ema = seedWindow.reduce((sum, item) => sum + item, 0) / seedWindow.length;
      result.push(Number(ema.toFixed(2)));
      return;
    }
    ema = value * multiplier + ema * (1 - multiplier);
    result.push(Number(ema.toFixed(2)));
  });
  return result;
}

function calculateAtrPercentSeries(values, highs, lows, period = 21) {
  if (!Array.isArray(values) || !Array.isArray(highs) || !Array.isArray(lows) || !values.length) {
    return [];
  }
  const trueRangePercents = values.map((close, index) => {
    const high = Number(highs[index]);
    const low = Number(lows[index]);
    const previousClose = index > 0 ? Number(values[index - 1]) : Number(close);
    if (!Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(previousClose) || previousClose <= 0) {
      return null;
    }
    const trueRange = Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose));
    return (trueRange / previousClose) * 100;
  });
  return values.map((close, index) => {
    if (index < period - 1 || !Number.isFinite(Number(close))) {
      return null;
    }
    const window = trueRangePercents.slice(index - period + 1, index + 1).filter((value) => Number.isFinite(value));
    if (window.length < period) {
      return null;
    }
    return Number((window.reduce((sum, value) => sum + Number(value), 0) / period).toFixed(2));
  });
}

function calculateDrawdownPercentSeries(values) {
  let peak = null;
  return (values ?? []).map((value) => {
    const close = Number(value);
    if (!Number.isFinite(close) || close <= 0) {
      return null;
    }
    peak = peak === null ? close : Math.max(peak, close);
    if (!Number.isFinite(peak) || peak <= 0) {
      return null;
    }
    return Number(((close / peak - 1) * 100).toFixed(2));
  });
}

function calculateRollingDrawdownPercentSeries(values, window = 60) {
  return (values ?? []).map((value, index) => {
    const close = Number(value);
    if (!Number.isFinite(close) || close <= 0) {
      return null;
    }
    const windowValues = (values ?? [])
      .slice(Math.max(0, index - window + 1), index + 1)
      .map(Number)
      .filter((item) => Number.isFinite(item) && item > 0);
    if (!windowValues.length) {
      return null;
    }
    const rollingPeak = Math.max(...windowValues);
    if (!Number.isFinite(rollingPeak) || rollingPeak <= 0) {
      return null;
    }
    return Number(((close / rollingPeak - 1) * 100).toFixed(2));
  });
}

function calculateAtrDrawdownMultipleSeries(drawdowns, atrPercents) {
  return (drawdowns ?? []).map((drawdown, index) => {
    const atrPercent = Number(atrPercents?.[index]);
    if (!Number.isFinite(Number(drawdown)) || !Number.isFinite(atrPercent) || atrPercent <= 0) {
      return null;
    }
    return Number((Number(drawdown) / atrPercent).toFixed(2));
  });
}

function getMarketTrendBounds() {
  const trendStart = marketPriceData?.startDate ?? "1980-01-01";
  const selectedItem = marketPriceData?.items?.[state.marketTrendIndex];
  const items = selectedItem
    ? [selectedItem]
    : MARKET_PRICE_TREND_INDEX_OPTIONS.map((option) => marketPriceData?.items?.[option.key]).filter(Boolean);
  const dates = [...new Set(items.flatMap((item) => item.dates ?? []).filter((date) => date >= trendStart))].sort();
  return {
    min: dates[0] ?? trendStart,
    max: dates[dates.length - 1] ?? "",
  };
}

function buildMarketTrendChartPayload(rangeKey, indexKey, customStart = "", customEnd = "") {
  const trendStart = marketPriceData?.startDate ?? "1980-01-01";
  const item = marketPriceData?.items?.[indexKey];
  if (!item?.dates?.length || !item?.values?.length) {
    return { labels: [], datasets: [], item: null };
  }

  const firstUsableIndex = Math.max(
    0,
    (item.dates ?? []).findIndex((label) => label >= trendStart),
  );
  const fullLabels = (item.dates ?? []).slice(firstUsableIndex);
  const fullValues = (item.values ?? []).slice(firstUsableIndex);
  const fullOpens = (item.opens ?? item.closes ?? item.values ?? []).slice(firstUsableIndex);
  const fullHighs = (item.highs ?? item.values ?? []).slice(firstUsableIndex);
  const fullLows = (item.lows ?? item.values ?? []).slice(firstUsableIndex);
  if (!fullLabels.length || !fullValues.length) {
    return { labels: [], datasets: [], item };
  }

  const latestDate = fullLabels[fullLabels.length - 1];
  const derivedStartDate = shiftDateByRange(latestDate, rangeKey, trendStart, fullLabels);
  const startDate = customStart || derivedStartDate;
  const endDate = customEnd || latestDate;
  const startIndex = Math.max(0, fullLabels.findIndex((label) => label >= startDate));
  const endIndex = fullLabels.findIndex((label) => label > endDate);
  const sliceEnd = endIndex === -1 ? fullLabels.length : Math.max(startIndex + 1, endIndex);
  const labels = fullLabels.slice(startIndex, sliceEnd);
  const priceValues = fullValues.slice(startIndex, sliceEnd);
  const priceOpens = fullOpens.slice(startIndex, sliceEnd);
  const priceHighs = fullHighs.slice(startIndex, sliceEnd);
  const priceLows = fullLows.slice(startIndex, sliceEnd);
  const candlestickData = labels.map((label, index) => ({
    x: label,
    o: Number(priceOpens[index]),
    h: Number(priceHighs[index]),
    l: Number(priceLows[index]),
    c: Number(priceValues[index]),
  }));
  const useCandlestick = state.marketTrendChartType !== "line"
    && candlestickData.some((candle) => [candle.o, candle.h, candle.l, candle.c].every(Number.isFinite));
  const atrPctFull = calculateAtrPercentSeries(fullValues, fullHighs, fullLows, 21);
  const drawdownPctFull = calculateDrawdownPercentSeries(fullValues);
  const rollingDrawdown60PctFull = calculateRollingDrawdownPercentSeries(fullValues, 60);
  const rollingDrawdownAtrFull = calculateAtrDrawdownMultipleSeries(rollingDrawdown60PctFull, atrPctFull);
  const emaReferenceSeries = Object.fromEntries(
    MARKET_PRICE_EMA_OPTIONS.map((period) => [period, calculateEmaSeries(fullValues, period).slice(startIndex, sliceEnd)]),
  );
  const emaDatasets = (state.marketTrendEmas ?? [])
    .filter((period) => MARKET_PRICE_EMA_OPTIONS.includes(period))
    .map((period) => {
      const emaFull = calculateEmaSeries(fullValues, period);
      return {
        label: `EMA ${period}`,
        data: emaFull.slice(startIndex, sliceEnd),
        borderColor:
          period === 10
            ? "#dc2626"
            : period === 20
              ? "#d4a017"
              : period === 50
                ? "#2563eb"
                : period === 100
                  ? "#16a34a"
                  : "#7c3aed",
        backgroundColor:
          period === 10
            ? "#dc2626"
            : period === 20
              ? "#d4a017"
              : period === 50
                ? "#2563eb"
                : period === 100
                  ? "#16a34a"
                  : "#7c3aed",
        borderWidth: period >= 100 ? 2.6 : 2.1,
        tension: 0.12,
        pointRadius: 0,
        pointHoverRadius: 3,
        spanGaps: false,
      };
    });

  return {
    labels,
    datasets: [
      useCandlestick
        ? {
            type: "line",
            label: `${item.label} · Candle`,
            data: priceValues,
            borderColor: "#111827",
            backgroundColor: "#111827",
            showLine: false,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHitRadius: 8,
            pointStyle: "rect",
            isCandlestick: true,
            ohlc: candlestickData,
          }
        : {
            label: `${item.label} · Line`,
            data: priceValues,
            borderColor: "#111827",
            backgroundColor: "#111827",
            borderWidth: 3,
            tension: 0.08,
            pointRadius: 0,
            pointHoverRadius: 4,
            spanGaps: false,
          },
      ...emaDatasets,
    ],
    item,
    candlestickData,
    useCandlestick,
    emaReferenceSeries,
    riskSeries: {
      atrPct: atrPctFull.slice(startIndex, sliceEnd),
      drawdownPct: drawdownPctFull.slice(startIndex, sliceEnd),
      rollingDrawdown60Pct: rollingDrawdown60PctFull.slice(startIndex, sliceEnd),
      rollingDrawdownAtr: rollingDrawdownAtrFull.slice(startIndex, sliceEnd),
    },
  };
}

function calculateMarketTrendGap(indexValue, emaValue) {
  if (!Number.isFinite(indexValue) || !Number.isFinite(emaValue) || emaValue === 0) {
    return null;
  }
  return (indexValue / emaValue - 1) * 100;
}

function formatMarketTrendGap(value) {
  if (value === null || !Number.isFinite(Number(value))) {
    return "-";
  }
  return formatSignedPercent(Number(value));
}

function buildMarketTrendGapSummary() {
  const payload = buildMarketTrendChartPayload(
    state.marketTrendRange,
    state.marketTrendIndex,
    state.marketTrendCustomStart,
    state.marketTrendCustomEnd,
  );
  const indexValues = payload.datasets?.[0]?.data ?? [];
  let latestIndex = -1;
  for (let index = indexValues.length - 1; index >= 0; index -= 1) {
    if (Number.isFinite(indexValues[index])) {
      latestIndex = index;
      break;
    }
  }
  if (latestIndex === -1) {
    return [];
  }
  const latestIndexValue = Number(indexValues[latestIndex]);
  return MARKET_PRICE_EMA_OPTIONS.map((period) => {
    const emaValue = Number(payload.emaReferenceSeries?.[period]?.[latestIndex]);
    const gap = calculateMarketTrendGap(latestIndexValue, emaValue);
    return {
      period,
      gap,
      emaValue,
      indexValue: latestIndexValue,
      date: payload.labels?.[latestIndex] ?? "",
    };
  });
}

function buildMarketTrendRiskSummary() {
  const payload = buildMarketTrendChartPayload(
    state.marketTrendRange,
    state.marketTrendIndex,
    state.marketTrendCustomStart,
    state.marketTrendCustomEnd,
  );
  const series = payload.riskSeries ?? {};
  let latestIndex = -1;
  for (let index = (payload.labels ?? []).length - 1; index >= 0; index -= 1) {
    if (
      Number.isFinite(Number(series.atrPct?.[index])) ||
      Number.isFinite(Number(series.drawdownPct?.[index])) ||
      Number.isFinite(Number(series.rollingDrawdown60Pct?.[index])) ||
      Number.isFinite(Number(series.rollingDrawdownAtr?.[index]))
    ) {
      latestIndex = index;
      break;
    }
  }
  if (latestIndex === -1) {
    return [];
  }
  const items = [
    { label: "21D ATR", value: series.atrPct?.[latestIndex], formatter: (value) => `${Number(value).toFixed(2)}%`, tone: "neutral" },
    { label: "From High", value: series.drawdownPct?.[latestIndex], formatter: formatSignedPercent, tone: "negative" },
    { label: "60D MDD", value: series.rollingDrawdown60Pct?.[latestIndex], formatter: formatSignedPercent, tone: "negative" },
    { label: "60D MDD / ATR", value: series.rollingDrawdownAtr?.[latestIndex], formatter: (value) => `${Number(value).toFixed(2)}x`, tone: "negative" },
  ];
  return items.map((item) => ({
    ...item,
    date: payload.labels?.[latestIndex] ?? "",
    text: Number.isFinite(Number(item.value)) ? item.formatter(Number(item.value)) : "-",
  }));
}

function getMarketTrendVisibleIndexRange(chart = marketTrendDetailChart) {
  const labelCount = chart?.data?.labels?.length ?? 0;
  if (!labelCount) {
    return { min: 0, max: -1 };
  }
  const xScale = chart?.scales?.x;
  const dataBounds = chart?.$marketTrendDataBounds;
  const firstIndex = Number.isFinite(dataBounds?.firstIndex) ? dataBounds.firstIndex : 0;
  const latestIndex = Number.isFinite(dataBounds?.latestIndex) ? dataBounds.latestIndex : labelCount - 1;
  return {
    min: Number.isFinite(xScale?.min) ? Math.max(firstIndex, Math.ceil(xScale.min)) : firstIndex,
    max: Number.isFinite(xScale?.max) ? Math.min(latestIndex, Math.floor(xScale.max)) : latestIndex,
  };
}

function fitMarketTrendChartYToVisible(chart = marketTrendDetailChart) {
  if (!chart?.data?.datasets?.length || !chart.scales?.x || !chart.options?.scales?.y) {
    return;
  }
  const visibleRange = getMarketTrendVisibleIndexRange(chart);
  if (visibleRange.max < visibleRange.min) {
    return;
  }

  const values = [];
  chart.data.datasets.forEach((dataset, datasetIndex) => {
    if (!chart.isDatasetVisible(datasetIndex)) {
      return;
    }
    for (let index = visibleRange.min; index <= visibleRange.max; index += 1) {
      if (dataset.isCandlestick) {
        const candle = dataset.ohlc?.[index];
        [candle?.o, candle?.h, candle?.l, candle?.c].forEach((value) => {
          const numeric = Number(value);
          if (Number.isFinite(numeric)) {
            values.push(numeric);
          }
        });
        continue;
      }
      const rawValue = dataset.data?.[index];
      const chartValue = rawValue && typeof rawValue === "object" ? rawValue.y : rawValue;
      const numeric = Number(chartValue);
      if (Number.isFinite(numeric)) {
        values.push(numeric);
      }
    }
  });

  if (!values.length) {
    return;
  }
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    const padding = Math.max(1, Math.abs(max) * 0.05);
    min -= padding;
    max += padding;
  } else {
    const padding = (max - min) * 0.07;
    min -= padding;
    max += padding;
  }
  chart.options.scales.y.min = Math.max(0, min);
  chart.options.scales.y.max = max;
  chart.update("none");
}

function attachMarketTrendYAxisDrag(chart) {
  const canvas = chart?.canvas;
  if (!canvas) {
    return;
  }
  canvas.__marketTrendYAxisDragCleanup?.();

  let dragState = null;
  const getPosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (chart.width / Math.max(1, rect.width)),
      y: (event.clientY - rect.top) * (chart.height / Math.max(1, rect.height)),
    };
  };
  const getAxisAtPosition = (position) => {
    const scale = chart.scales?.y;
    return scale
      && scale.options?.display !== false
      && position.x >= scale.left
      && position.x <= scale.right
      && position.y >= scale.top
      && position.y <= scale.bottom
      ? scale
      : null;
  };
  const updateCursor = (event) => {
    if (dragState) {
      canvas.style.cursor = "ns-resize";
      return;
    }
    canvas.style.cursor = getAxisAtPosition(getPosition(event)) ? "ns-resize" : "";
  };
  const endDrag = (event) => {
    if (!dragState) {
      return;
    }
    if (event && canvas.hasPointerCapture?.(event.pointerId)) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released by the browser.
      }
    }
    dragState = null;
    canvas.style.cursor = "";
  };
  const handlePointerDown = (event) => {
    const position = getPosition(event);
    const scale = getAxisAtPosition(position);
    if (!scale || !Number.isFinite(scale.min) || !Number.isFinite(scale.max) || scale.max <= scale.min) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const span = scale.max - scale.min;
    const anchor = scale.getValueForPixel(position.y);
    dragState = {
      startY: position.y,
      initialSpan: span,
      anchor,
      anchorRatio: Math.max(0, Math.min(1, (anchor - scale.min) / span)),
    };
    try {
      canvas.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic or interrupted pointers can be scaled without capture.
    }
    canvas.style.cursor = "ns-resize";
  };
  const handlePointerMove = (event) => {
    if (!dragState) {
      updateCursor(event);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const position = getPosition(event);
    const minimumSpan = Math.max(0.01, dragState.initialSpan * 0.08);
    const maximumSpan = dragState.initialSpan * 12;
    const scaleFactor = Math.exp((position.y - dragState.startY) / 180);
    const nextSpan = Math.max(minimumSpan, Math.min(maximumSpan, dragState.initialSpan * scaleFactor));
    let nextMin = dragState.anchor - (dragState.anchorRatio * nextSpan);
    let nextMax = nextMin + nextSpan;
    if (nextMin < 0) {
      nextMax -= nextMin;
      nextMin = 0;
    }
    chart.options.scales.y.min = nextMin;
    chart.options.scales.y.max = nextMax;
    chart.update("none");
  };
  const handleDoubleClick = (event) => {
    if (!getAxisAtPosition(getPosition(event))) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    fitMarketTrendChartYToVisible(chart);
  };
  const handlePointerLeave = () => {
    if (!dragState) {
      canvas.style.cursor = "";
    }
  };

  canvas.addEventListener("pointerdown", handlePointerDown, true);
  canvas.addEventListener("pointermove", handlePointerMove, true);
  canvas.addEventListener("pointerup", endDrag, true);
  canvas.addEventListener("pointercancel", endDrag, true);
  canvas.addEventListener("pointerleave", handlePointerLeave, true);
  canvas.addEventListener("dblclick", handleDoubleClick, true);
  canvas.__marketTrendYAxisDragCleanup = () => {
    canvas.removeEventListener("pointerdown", handlePointerDown, true);
    canvas.removeEventListener("pointermove", handlePointerMove, true);
    canvas.removeEventListener("pointerup", endDrag, true);
    canvas.removeEventListener("pointercancel", endDrag, true);
    canvas.removeEventListener("pointerleave", handlePointerLeave, true);
    canvas.removeEventListener("dblclick", handleDoubleClick, true);
    canvas.style.cursor = "";
  };
}

function zoomMarketTrendChartToLatest(direction) {
  const chart = marketTrendDetailChart;
  const xScale = chart?.scales?.x;
  const labelCount = chart?.data?.labels?.length ?? 0;
  if (!chart || !xScale || labelCount < 2) {
    return;
  }
  const firstIndex = chart.$marketTrendDataBounds?.firstIndex ?? 0;
  const latestIndex = chart.$marketTrendDataBounds?.latestIndex ?? labelCount - 1;
  const currentMin = Number.isFinite(xScale.min) ? Math.max(firstIndex, Math.ceil(xScale.min)) : firstIndex;
  const currentMax = Number.isFinite(xScale.max) ? Math.min(latestIndex, Math.floor(xScale.max)) : latestIndex;
  const currentSpan = Math.max(20, currentMax - currentMin + 1);
  const nextSpan = Math.max(
    20,
    Math.min(latestIndex - firstIndex + 1, Math.round(currentSpan * (direction === "in" ? 0.5 : 1.75))),
  );
  const nextRange = {
    min: Math.max(firstIndex, latestIndex - nextSpan + 1),
    max: latestIndex,
  };
  if (typeof chart.zoomScale === "function") {
    chart.zoomScale("x", nextRange, "none");
  } else {
    chart.options.scales.x.min = nextRange.min;
    chart.options.scales.x.max = nextRange.max;
    chart.update("none");
  }
  fitMarketTrendChartYToVisible(chart);
}

function createMarketTrendChart(canvas, rangeKey, indexKey, customStart = "", customEnd = "") {
  if (typeof Chart === "undefined" || !canvas) {
    return;
  }

  const payload = buildMarketTrendChartPayload(rangeKey, indexKey, customStart, customEnd);
  const allValues = [
    ...payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value))),
    ...(payload.useCandlestick ? payload.candlestickData.flatMap((candle) => [candle.h, candle.l]) : []),
  ].filter((value) => Number.isFinite(value));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMin = Math.floor(minValue * 0.97);
  const yMax = Math.ceil(maxValue * 1.03);
  const bearBackgroundPlugin = {
    id: "marketTrendBearBackground",
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const xScale = scales.x;
      if (!ctx || !chartArea || !xScale) {
        return;
      }
      const ema20 = payload.emaReferenceSeries?.[20] ?? [];
      const ema50 = payload.emaReferenceSeries?.[50] ?? [];
      const ema100 = payload.emaReferenceSeries?.[100] ?? [];
      const ema200 = payload.emaReferenceSeries?.[200] ?? [];
      if (!ema20.length || !ema50.length || !ema100.length || !ema200.length) {
        return;
      }
      let segmentStart = null;

      const drawSegment = (startIndex, endIndex, fillStyle) => {
        if (startIndex === null || endIndex < startIndex) {
          return;
        }
        const startX = startIndex <= 0 ? chartArea.left : (xScale.getPixelForValue(startIndex - 1) + xScale.getPixelForValue(startIndex)) / 2;
        const endX =
          endIndex >= payload.labels.length - 1
            ? chartArea.right
            : (xScale.getPixelForValue(endIndex) + xScale.getPixelForValue(endIndex + 1)) / 2;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.fillRect(startX, chartArea.top, endX - startX, chartArea.bottom - chartArea.top);
        ctx.restore();
      };

      let weakBearStart = null;
      let fullBullStart = null;
      for (let index = 0; index < payload.labels.length; index += 1) {
        const isFullBearish =
          Number.isFinite(ema20[index]) &&
          Number.isFinite(ema50[index]) &&
          Number.isFinite(ema100[index]) &&
          Number(ema20[index]) < Number(ema50[index]) &&
          Number(ema50[index]) < Number(ema100[index]);
        const isWeakBearish =
          Number.isFinite(ema20[index]) &&
          Number.isFinite(ema50[index]) &&
          Number(ema20[index]) < Number(ema50[index]);
        const isFullBullish =
          Number.isFinite(ema20[index]) &&
          Number.isFinite(ema50[index]) &&
          Number.isFinite(ema100[index]) &&
          Number.isFinite(ema200[index]) &&
          Number(ema20[index]) > Number(ema50[index]) &&
          Number(ema50[index]) > Number(ema100[index]) &&
          Number(ema100[index]) > Number(ema200[index]);

        if (isFullBullish && fullBullStart === null) {
          fullBullStart = index;
        } else if (!isFullBullish && fullBullStart !== null) {
          drawSegment(fullBullStart, index - 1, "rgba(107, 114, 128, 0.10)");
          fullBullStart = null;
        }

        if (isFullBearish && segmentStart === null) {
          segmentStart = index;
        } else if (!isFullBearish && segmentStart !== null) {
          drawSegment(segmentStart, index - 1, "rgba(239, 68, 68, 0.11)");
          segmentStart = null;
        }

        const weakOnly = isWeakBearish && !isFullBearish;
        if (weakOnly && weakBearStart === null) {
          weakBearStart = index;
        } else if (!weakOnly && weakBearStart !== null) {
          drawSegment(weakBearStart, index - 1, "rgba(96, 165, 250, 0.11)");
          weakBearStart = null;
        }
      }

      if (segmentStart !== null) {
        drawSegment(segmentStart, payload.labels.length - 1, "rgba(239, 68, 68, 0.16)");
      }

      if (weakBearStart !== null) {
        drawSegment(weakBearStart, payload.labels.length - 1, "rgba(96, 165, 250, 0.11)");
      }

      if (fullBullStart !== null) {
        drawSegment(fullBullStart, payload.labels.length - 1, "rgba(107, 114, 128, 0.10)");
      }
    },
  };

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    plugins: [MARKET_RS_CANDLESTICK_PLUGIN, bearBackgroundPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => {
              if (context.dataset.isCandlestick) {
                const candle = context.dataset.ohlc?.[context.dataIndex];
                if (candle && [candle.o, candle.h, candle.l, candle.c].every(Number.isFinite)) {
                  return [
                    `Open ${formatUsStockPrice(candle.o, 2)} · High ${formatUsStockPrice(candle.h, 2)}`,
                    `Low ${formatUsStockPrice(candle.l, 2)} · Close ${formatUsStockPrice(candle.c, 2)}`,
                  ];
                }
              }
              const value = Number(context.parsed.y);
              const baseText = `${context.dataset.label}: ${formatUsStockPrice(value, 2)}`;
              const emaMatch = String(context.dataset.label ?? "").match(/^EMA\s+(\d+)/);
              if (!emaMatch) {
                return baseText;
              }
              const indexValue = Number(payload.datasets?.[0]?.data?.[context.dataIndex]);
              const gap = calculateMarketTrendGap(indexValue, value);
              return `${baseText} / ${formatMarketTrendGap(gap)}`;
            },
          },
        },
        zoom: {
          limits: {
            x: { min: "original", max: "original", minRange: 20 },
          },
          pan: {
            enabled: true,
            mode: "x",
            threshold: 5,
            onPanComplete: ({ chart: activeChart }) => fitMarketTrendChartYToVisible(activeChart),
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.08,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            onZoomComplete: ({ chart: activeChart }) => fitMarketTrendChartYToVisible(activeChart),
          },
        },
      },
      scales: {
        x: {
          offset: payload.useCandlestick,
          grid: { display: false },
          afterBuildTicks: (axis) => {
            const minimumIndex = Number.isFinite(axis.min) ? Math.ceil(axis.min) : 0;
            const maximumIndex = Number.isFinite(axis.max) ? Math.floor(axis.max) : payload.labels.length - 1;
            let indexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0)
              .filter((index) => index >= minimumIndex && index <= maximumIndex);
            if (indexes.length < 2 && maximumIndex > minimumIndex) {
              indexes = [...new Set([minimumIndex, Math.round((minimumIndex + maximumIndex) / 2), maximumIndex])];
            }
            axis.ticks = indexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatUsStockPrice(Number(value), Number(value) >= 1000 ? 0 : 2),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  chart.$marketTrendDataBounds = {
    firstIndex: 0,
    latestIndex: Math.max(0, payload.labels.length - 1),
  };
  marketTrendDetailChart = chart;
  attachMarketTrendYAxisDrag(chart);
  fitMarketTrendChartYToVisible(chart);
  charts.push(chart);
}

function createMarketTrendRiskChart(canvas, rangeKey, indexKey, customStart = "", customEnd = "") {
  if (typeof Chart === "undefined" || !canvas) {
    return;
  }

  const payload = buildMarketTrendChartPayload(rangeKey, indexKey, customStart, customEnd);
  const riskSeries = payload.riskSeries ?? {};
  const riskType = canvas.dataset.marketTrendRisk || "drawdown";
  const riskConfig = {
    atr: {
      label: "21D ATR (%)",
      data: riskSeries.atrPct ?? [],
      color: "#2563eb",
      fillColor: "rgba(37, 99, 235, 0.16)",
      tickSuffix: "%",
      tooltipFormatter: (value) => `${value.toFixed(2)}%`,
      suggestedMin: 0,
    },
    drawdown: {
      label: "MDD from high (%)",
      data: riskSeries.drawdownPct ?? [],
      color: "#dc2626",
      fillColor: "rgba(220, 38, 38, 0.18)",
      tickSuffix: "%",
      tooltipFormatter: formatSignedPercent,
      suggestedMax: 0,
    },
    rollingDrawdown60: {
      label: "60D Rolling MDD (%)",
      data: riskSeries.rollingDrawdown60Pct ?? [],
      color: "#b45309",
      fillColor: "rgba(180, 83, 9, 0.16)",
      tickSuffix: "%",
      tooltipFormatter: formatSignedPercent,
      suggestedMax: 0,
    },
    multiple: {
      label: "60D Rolling MDD / ATR (x)",
      data: riskSeries.rollingDrawdownAtr ?? [],
      color: "#111827",
      fillColor: "rgba(17, 24, 39, 0.14)",
      tickSuffix: "x",
      tooltipFormatter: (value) => `${value.toFixed(2)}x`,
      suggestedMax: 0,
    },
  }[riskType] ?? null;
  if (!riskConfig) {
    return;
  }

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: [
        {
          label: riskConfig.label,
          data: riskConfig.data,
          borderColor: riskConfig.color,
          backgroundColor: riskConfig.fillColor,
          borderWidth: 2.2,
          tension: 0.12,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: { target: "origin" },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => {
              const value = Number(context.parsed.y);
              if (!Number.isFinite(value)) {
                return `${context.dataset.label}: -`;
              }
              return `${context.dataset.label}: ${riskConfig.tooltipFormatter(value)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0).map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          position: "left",
          suggestedMin: riskConfig.suggestedMin,
          suggestedMax: riskConfig.suggestedMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${Number(value).toFixed(0)}${riskConfig.tickSuffix}`,
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function formatMacroValue(value, formatterKey) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  switch (formatterKey) {
    case "percent2":
      return `${Number(value).toFixed(2)}%`;
    case "trillion1":
      return `${Number(value).toFixed(1)}T`;
    case "dollar2":
      return `$${Number(value).toFixed(2)}`;
    case "dollar1":
      return `$${Number(value).toFixed(1)}`;
    case "number1":
      return Number(value).toFixed(1);
    default:
      return String(value);
  }
}

function formatVixLevel(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return Number(value).toFixed(2);
}

function formatVixPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}%`;
}

function getMarketVixUpdatedAt() {
  return [marketVixData.updatedAt, marketPriceData.updatedAt].filter(Boolean).sort().slice(-1)[0] || "-";
}

function getMarketVixBounds(type = "all") {
  const familyDates = Object.values(marketVixData?.family ?? {}).flatMap((item) => item.dates ?? []);
  const fixedIncomeDates = Object.values(marketVixData?.fixedIncome ?? {}).flatMap((item) => item.dates ?? []);
  const metricDates = marketVixData?.curve?.historyDates ?? [];
  const allDates =
    type === "family"
      ? [...new Set(familyDates)].sort()
      : type === "fixedIncome"
        ? [...new Set(fixedIncomeDates)].sort()
      : type === "metrics"
        ? [...new Set(metricDates)].sort()
        : [...new Set([...familyDates, ...fixedIncomeDates, ...metricDates])].sort();
  return {
    min: allDates[0] ?? "",
    max: allDates[allDates.length - 1] ?? "",
  };
}

function getMarketVixSelectedWindow(rangeKey, labels, fallbackStartDate, customStart = "", customEnd = "") {
  if (!labels?.length) {
    return { labels: [], startDate: "", endDate: "" };
  }
  const latestDate = labels[labels.length - 1];
  const derivedStartDate = shiftDateByRange(latestDate, rangeKey, fallbackStartDate, labels);
  const startDate = customStart || derivedStartDate;
  const endDate = customEnd || latestDate;
  return {
    labels: labels.filter((label) => label >= startDate && label <= endDate),
    startDate,
    endDate,
  };
}

function buildMarketVixFamilyPayload(rangeKey) {
  const items = Object.entries(marketVixData?.family ?? {});
  const allDates = [...new Set(items.flatMap(([, item]) => item.dates ?? []))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const selectedWindow = getMarketVixSelectedWindow(
    rangeKey,
    allDates,
    marketVixData?.startDate ?? "2018-01-01",
    state.marketVixFamilyCustomStart,
    state.marketVixFamilyCustomEnd,
  );
  const selectedLabels = selectedWindow.labels;

  const datasets = items.map(([key, item]) => {
    const dateIndex = new Map();
    (item.dates ?? []).forEach((date, index) => {
      dateIndex.set(date, index);
    });

    return {
      key,
      label: item.label,
      data: selectedLabels.map((label) => {
        const pointIndex = dateIndex.get(label);
        return pointIndex === undefined ? null : item.values?.[pointIndex] ?? null;
      }),
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: key === "vix" ? 2.8 : 2.2,
      tension: 0.16,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
    };
  });

  return { labels: selectedLabels, datasets };
}

function buildMarketVixNasdaqSeries(labels) {
  const nasdaqItem = marketPriceData?.items?.nasdaq100;
  if (!nasdaqItem?.dates?.length || !labels?.length) {
    return [];
  }

  const dateIndex = new Map();
  (nasdaqItem.dates ?? []).forEach((date, index) => {
    dateIndex.set(date, index);
  });

  let lastKnownIndex = -1;
  return labels.map((label) => {
    const exactIndex = dateIndex.get(label);
    if (exactIndex !== undefined) {
      lastKnownIndex = exactIndex;
      return nasdaqItem.values?.[exactIndex] ?? null;
    }

    while (
      lastKnownIndex + 1 < (nasdaqItem.dates?.length ?? 0) &&
      nasdaqItem.dates[lastKnownIndex + 1] <= label
    ) {
      lastKnownIndex += 1;
    }

    return lastKnownIndex >= 0 ? nasdaqItem.values?.[lastKnownIndex] ?? null : null;
  });
}

function buildMarketVixMetricsPayload(rangeKey) {
  const curve = marketVixData?.curve ?? {};
  const labels = (curve.historyDates ?? []).filter(Boolean);
  if (!labels.length) {
    return { labels: [], datasets: [] };
  }

  const selectedWindow = getMarketVixSelectedWindow(
    rangeKey,
    labels,
    labels[0],
    state.marketVixMetricsCustomStart,
    state.marketVixMetricsCustomEnd,
  );
  const slicedLabels = selectedWindow.labels;
  const startIndex = labels.findIndex((label) => label === slicedLabels[0]);
  const safeStartIndex = startIndex < 0 ? 0 : startIndex;

  const metrics = curve.metrics ?? {};
  const metricSeries = [
    { key: "spot", label: "VIX Spot", color: "#111827", formatter: "number1", values: metrics.spot ?? [], yAxisID: "y" },
    { key: "m1", label: "M1", color: "#dc2626", formatter: "number1", values: metrics.m1 ?? [], yAxisID: "y" },
    { key: "m2", label: "M2", color: "#2563eb", formatter: "number1", values: metrics.m2 ?? [], yAxisID: "y" },
    {
      key: "m1SpotPremiumPct",
      label: "M1 vs Spot",
      color: "#7c3aed",
      formatter: "percent2",
      values: metrics.m1SpotPremiumPct ?? [],
      yAxisID: "yPremium",
    },
    {
      key: "m2M1PremiumPct",
      label: "M2 vs M1",
      color: "#0f766e",
      formatter: "percent2",
      values: metrics.m2M1PremiumPct ?? [],
      yAxisID: "yPremium",
    },
  ];

  const datasets = metricSeries.map((series) => {
    const data = series.values.slice(safeStartIndex, safeStartIndex + slicedLabels.length);
    return {
      key: series.key,
      label: series.label,
      data,
      rawFormatter: series.formatter,
      borderColor: series.color,
      backgroundColor: series.color,
      borderWidth: series.yAxisID === "y" ? 2.4 : 2.1,
      tension: 0.16,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: series.yAxisID,
    };
  });

  return { labels: slicedLabels, datasets };
}

function buildMarketVixFixedIncomePayload(seriesKey, rangeKey) {
  const item = marketVixData?.fixedIncome?.[seriesKey];
  const labels = (item?.dates ?? []).filter(Boolean);
  if (!labels.length) {
    return { item, labels: [], datasets: [] };
  }

  const selectedWindow = getMarketVixSelectedWindow(
    rangeKey,
    labels,
    labels[0],
    state.marketVixFixedIncomeCustomStart,
    state.marketVixFixedIncomeCustomEnd,
  );
  const selectedLabels = selectedWindow.labels;
  const dateIndex = new Map();
  labels.forEach((date, index) => {
    dateIndex.set(date, index);
  });

  return {
    item,
    labels: selectedLabels,
    datasets: [
      {
        key: seriesKey,
        label: item.label,
        data: selectedLabels.map((label) => {
          const pointIndex = dateIndex.get(label);
          return pointIndex === undefined ? null : item.values?.[pointIndex] ?? null;
        }),
        borderColor: item.color ?? "#111827",
        backgroundColor: item.color ?? "#111827",
        borderWidth: 2.6,
        tension: 0.16,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        spanGaps: true,
      },
    ],
  };
}

function formatFixedIncomeVixValue(value, unit) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (unit === "%") {
    return `${numeric.toFixed(2)}%`;
  }
  return numeric.toFixed(2);
}

function createMarketVixFamilyChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildMarketVixFamilyPayload(rangeKey);
  const nasdaqData = buildMarketVixNasdaqSeries(payload.labels);
  const vixValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const nasdaqValues = nasdaqData.filter((value) => Number.isFinite(value));

  const minValue = vixValues.length ? Math.min(...vixValues) : 10;
  const maxValue = vixValues.length ? Math.max(...vixValues) : 40;
  const spread = Math.max(maxValue - minValue, 2);
  const yMin = Math.max(0, minValue - spread * 0.12);
  const yMax = maxValue + spread * 0.12;

  const nasdaqMin = nasdaqValues.length ? Math.min(...nasdaqValues) : 15000;
  const nasdaqMax = nasdaqValues.length ? Math.max(...nasdaqValues) : 25000;
  const nasdaqSpread = Math.max(nasdaqMax - nasdaqMin, 250);
  const yNasdaqMin = Math.max(0, nasdaqMin - nasdaqSpread * 0.08);
  const yNasdaqMax = nasdaqMax + nasdaqSpread * 0.08;

  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);
  const chartDatasets = [
    ...payload.datasets.map((dataset) => ({
      ...dataset,
      yAxisID: "y",
    })),
    {
      key: "nasdaq100",
      label: "NASDAQ 100",
      data: nasdaqData,
      borderColor: "#f59e0b",
      backgroundColor: "#f59e0b",
      borderWidth: 3.6,
      borderDash: [10, 5],
      tension: 0.16,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: "yNasdaq",
    },
  ];

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: payload.labels, datasets: chartDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) =>
              context.dataset.yAxisID === "yNasdaq"
                ? `${context.dataset.label}: ${Number(context.parsed.y).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : `${context.dataset.label}: ${formatVixLevel(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (selectedTickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatVixLevel(value),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "Index level",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yNasdaq: {
          position: "right",
          min: yNasdaqMin,
          max: yNasdaqMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 }),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "NASDAQ 100",
            color: "#8d8d86",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createMarketVixFixedIncomeChart(canvas, seriesKey, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildMarketVixFixedIncomePayload(seriesKey, rangeKey);
  const values = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : payload.item?.unit === "%" ? 5 : 100;
  const minSpread = payload.item?.unit === "%" ? 0.5 : 5;
  const spread = Math.max(maxValue - minValue, minSpread);
  const yMin = Math.max(0, minValue - spread * 0.12);
  const yMax = maxValue + spread * 0.12;

  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: payload.labels, datasets: payload.datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) =>
              `${context.dataset.label}: ${formatFixedIncomeVixValue(context.parsed.y, payload.item?.unit)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (selectedTickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatFixedIncomeVixValue(value, payload.item?.unit),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: payload.item?.unit === "%" ? "Spread (%)" : "Index level",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createMarketVixMetricsChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildMarketVixMetricsPayload(rangeKey);
  const levelValues = payload.datasets
    .filter((dataset) => dataset.yAxisID === "y")
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const premiumValues = payload.datasets
    .filter((dataset) => dataset.yAxisID === "yPremium")
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));

  const levelMin = levelValues.length ? Math.min(...levelValues) : 10;
  const levelMax = levelValues.length ? Math.max(...levelValues) : 40;
  const levelSpread = Math.max(levelMax - levelMin, 2);
  const premiumMin = premiumValues.length ? Math.min(...premiumValues) : -10;
  const premiumMax = premiumValues.length ? Math.max(...premiumValues) : 15;
  const premiumSpread = Math.max(premiumMax - premiumMin, 4);

  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: payload.labels, datasets: payload.datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => {
              const suffix = context.dataset.yAxisID === "yPremium" ? "%" : "";
              return `${context.dataset.label}: ${formatVixLevel(context.parsed.y)}${suffix}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (selectedTickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: Math.max(0, levelMin - levelSpread * 0.12),
          max: levelMax + levelSpread * 0.12,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatVixLevel(value),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "VIX level",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yPremium: {
          position: "right",
          min: premiumMin - premiumSpread * 0.12,
          max: premiumMax + premiumSpread * 0.12,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${Number(value).toFixed(1)}%`,
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "Premium / discount",
            color: "#8d8d86",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createMarketVixCurveChart(canvas) {
  if (typeof Chart === "undefined") {
    return;
  }

  const curve = marketVixData?.curve ?? {};
  const labels = curve.expiries ?? [];
  const latestCurve = curve.latestCurve ?? [];
  const previousCurve = curve.previousCurve ?? [];
  const allValues = [...latestCurve, ...previousCurve].filter((value) => Number.isFinite(value));
  const minValue = allValues.length ? Math.min(...allValues) : 10;
  const maxValue = allValues.length ? Math.max(...allValues) : 30;
  const spread = Math.max(maxValue - minValue, 2);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Latest (${curve.latestDate || "-"})`,
          data: latestCurve,
          borderColor: "#111827",
          backgroundColor: "#111827",
          borderWidth: 2.8,
          tension: 0.18,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: `Previous (${curve.previousDate || "-"})`,
          data: previousCurve,
          borderColor: "#9ca3af",
          backgroundColor: "#9ca3af",
          borderWidth: 2.0,
          borderDash: [6, 4],
          tension: 0.18,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatVixLevel(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", maxRotation: 0, autoSkip: false },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: Math.max(0, minValue - spread * 0.12),
          max: maxValue + spread * 0.12,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatVixLevel(value),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "Settlement",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getTotalDashboardSeriesItems() {
  const items = [];
  const rateSeries = marketMacroData?.panels?.rates?.series ?? {};

  Object.entries(marketPriceData?.items ?? {}).forEach(([key, item]) => {
    if (key === "dxy") {
      return;
    }
    items.push({
      key: `market:${key}`,
      group: "Market",
      label: item.label,
      color: item.color,
      dates: item.dates ?? [],
      values: item.values ?? [],
      formatter: "number1",
      rawLabel: item.symbol ?? item.label,
      isRate: false,
    });
  });

  Object.entries(marketMacroData?.panels ?? {}).forEach(([panelKey, panel]) => {
    if (panelKey.startsWith("liquidity_")) {
      return;
    }
    Object.entries(panel.series ?? {}).forEach(([seriesKey, item]) => {
      if (panelKey === "fx_dashboard" && seriesKey === "dxy") {
        return;
      }
      const isPercentSeries = panelKey === "rates" || panelKey === "policy" || panelKey === "gdp";
      items.push({
        key: `macro:${panelKey}:${seriesKey}`,
        group: panel.title,
        label: item.name,
        color: item.color,
        dates: item.dates ?? [],
        values: item.values ?? [],
        formatter: panel.formatter ?? "number1",
        rawLabel: item.name,
        isRate: isPercentSeries,
        fillForward: item.fillForward === true || panel.fillMissing === "forward",
      });
    });
  });

  const us10yByDate = new Map(
    (rateSeries.us10y?.dates ?? []).map((date, index) => [date, Number(rateSeries.us10y?.values?.[index])]),
  );
  const us30yByDate = new Map(
    (rateSeries.us30y?.dates ?? []).map((date, index) => [date, Number(rateSeries.us30y?.values?.[index])]),
  );
  const us10y30yDates = [...us10yByDate.keys()]
    .filter((date) => Number.isFinite(us10yByDate.get(date)) && Number.isFinite(us30yByDate.get(date)))
    .sort();
  if (us10y30yDates.length) {
    items.push({
      key: "macro:rates:us10y_minus_us30y",
      group: "Rates",
      label: "US 10Y - 30Y",
      color: "#475569",
      dates: us10y30yDates,
      values: us10y30yDates.map((date) => Number((us10yByDate.get(date) - us30yByDate.get(date)).toFixed(3))),
      formatter: "percent2",
      rawLabel: "US 10Y - 30Y",
      isRate: true,
      chartType: "bar",
    });
  }

  [
    buildMacroIndicatorDashboardItem({
      key: "indicator:headline_cpi_yoy",
      label: "CPI YoY",
      seriesKey: "headline_cpi",
      kind: "yoy",
      color: "#7c3aed",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:core_cpi_yoy",
      label: "Core CPI YoY",
      seriesKey: "core_cpi",
      kind: "yoy",
      color: "#db2777",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:headline_pce_yoy",
      label: "PCE YoY",
      seriesKey: "headline_pce",
      kind: "yoy",
      color: "#0f766e",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:core_pce_yoy",
      label: "Core PCE YoY",
      seriesKey: "core_pce",
      kind: "yoy",
      color: "#14b8a6",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:final_demand_ppi_yoy",
      label: "PPI YoY",
      seriesKey: "final_demand_ppi",
      kind: "yoy",
      color: "#f97316",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:core_ppi_yoy",
      label: "Core PPI YoY",
      seriesKey: "core_ppi",
      kind: "yoy",
      color: "#dc2626",
    }),
  ].filter(Boolean).forEach((item) => {
    items.push({
      key: item.key,
      group: "Macro Indicators",
      label: item.label,
      color: item.color,
      dates: item.dates,
      values: item.values,
      formatter: item.formatter,
      rawLabel: item.label,
      isRate: true,
      fillForward: item.fillForward === true,
    });
  });

  return items.map((item, index) => ({
    ...item,
    color: TOTAL_DASHBOARD_COLOR_BY_KEY[item.key] ?? item.color ?? yearColors[index % yearColors.length],
  }));
}

function getTotalDashboardSelectedItems() {
  const selected = new Set(state.totalDashboardSelection ?? []);
  return getTotalDashboardSeriesItems().filter((item) => selected.has(item.key));
}

function getTotalDashboardBounds() {
  const items = getTotalDashboardSelectedItems();
  const allDates = [...new Set(items.flatMap((item) => item.dates))].sort();
  return {
    min: allDates[0] ?? "",
    max: allDates[allDates.length - 1] ?? "",
    labels: allDates,
  };
}

function buildTotalDashboardPayload(rangeKey) {
  const items = getTotalDashboardSelectedItems();
  const allDates = [...new Set(items.flatMap((item) => item.dates))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = allDates[allDates.length - 1];
  const derivedStartDate = shiftDateByRange(latestDate, rangeKey, marketMacroData?.startDate ?? marketPriceData?.startDate ?? "2017-01-01", allDates);
  const customStart = state.totalDashboardCustomStart || derivedStartDate;
  const customEnd = state.totalDashboardCustomEnd || latestDate;
  const selectedLabels = allDates.filter((label) => label >= customStart && label <= customEnd);

  const datasets = items.filter((item) => item.chartType !== "bar").map((item) => {
    const dateIndex = new Map();
    item.dates.forEach((date, index) => {
      dateIndex.set(date, index);
    });

    const baseDate = selectedLabels.find((label) => dateIndex.has(label));
    const baseIndex = baseDate ? dateIndex.get(baseDate) : null;
    const baseValue = baseIndex !== null && baseIndex !== undefined ? item.values[baseIndex] : null;
    let carriedRawValue = null;

    const data = selectedLabels.map((label) => {
      const pointIndex = dateIndex.get(label);
      const pointValue = pointIndex === undefined ? null : item.values[pointIndex];
      if (Number.isFinite(pointValue) && item.fillForward) {
        carriedRawValue = pointValue;
      }
      if (!Number.isFinite(pointValue)) {
        if (item.fillForward && Number.isFinite(carriedRawValue)) {
          if (item.isRate) {
            return carriedRawValue;
          }
          if (Number.isFinite(baseValue)) {
            return Number(((carriedRawValue / baseValue) * 100).toFixed(2));
          }
        }
        return null;
      }
      if (item.isRate) {
        return pointValue;
      }
      if (!Number.isFinite(baseValue)) {
        return null;
      }
      return Number(((pointValue / baseValue) * 100).toFixed(2));
    });
    carriedRawValue = null;
    const rawDisplayValues = selectedLabels.map((label) => {
      const pointIndex = dateIndex.get(label);
      const pointValue = pointIndex === undefined ? null : item.values[pointIndex];
      if (Number.isFinite(pointValue)) {
        if (item.fillForward) {
          carriedRawValue = pointValue;
        }
        return pointValue;
      }
      return item.fillForward && Number.isFinite(carriedRawValue) ? carriedRawValue : null;
    });

    return {
      key: item.key,
      label: item.label,
      data,
      rawDates: item.dates,
      rawValues: item.values,
      rawDisplayValues,
      rawFormatter: item.formatter,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: item.group === "Market" ? 2.6 : 2.2,
      borderDash: item.isRate ? [7, 5] : [],
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: item.isRate ? "yYield" : "y",
      isRate: item.isRate,
    };
  });

  return { labels: selectedLabels, datasets };
}

function buildTotalDashboardBarPayload(rangeKey) {
  const totalPayload = buildTotalDashboardPayload(rangeKey);
  const barItems = getTotalDashboardSelectedItems().filter((item) => item.chartType === "bar");
  const datasets = barItems.map((item) => {
    const valuesByDate = new Map(
      item.dates.map((date, index) => [date, Number(item.values[index])]),
    );
    const data = totalPayload.labels.map((date) => {
      const value = valuesByDate.get(date);
      return Number.isFinite(value) ? value : null;
    });
    return {
      label: item.label,
      data,
      color: item.color,
      formatter: item.formatter,
    };
  });
  return { labels: totalPayload.labels, datasets };
}

function createTotalDashboardChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildTotalDashboardPayload(rangeKey);
  const leftValues = payload.datasets
    .filter((dataset) => !dataset.isRate)
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const rightValues = payload.datasets
    .filter((dataset) => dataset.isRate)
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const hasRightAxis = rightValues.length > 0;
  const minValue = leftValues.length ? Math.min(...leftValues) : 80;
  const maxValue = leftValues.length ? Math.max(...leftValues) : 180;
  const yMin = Math.floor((minValue - 5) / 10) * 10;
  const yMax = Math.ceil((maxValue + 5) / 10) * 10;

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => {
              const dataset = context.dataset;
              const chartIndex = context.dataIndex;
              const rawValue = dataset.rawDisplayValues?.[chartIndex] ?? null;
              const rawText = Number.isFinite(rawValue) ? formatMacroValue(rawValue, dataset.rawFormatter) : "-";
              if (dataset.isRate) {
                return `${dataset.label}: ${rawText}`;
              }
              const normalized = context.parsed.y;
              return Number.isFinite(normalized)
                ? `${dataset.label}: ${normalized.toFixed(1)} | raw ${rawText}`
                : `${dataset.label}: - | raw ${rawText}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = buildRegularDateTickIndexes(payload.labels, rangeKey).map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}`,
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "Start = 100",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yYield: {
          display: hasRightAxis,
          position: "right",
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${Number(value).toFixed(2)}%`,
            maxTicksLimit: 6,
          },
          title: {
            display: hasRightAxis,
            text: "Rate / Inflation (%)",
            color: "#8d8d86",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createTotalDashboardSpreadChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildTotalDashboardBarPayload(rangeKey);
  const values = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  if (!payload.labels.length || !values.length) {
    return;
  }

  const maxAbsoluteValue = Math.max(...values.map((value) => Math.abs(value)), 0.05);
  const axisLimit = Math.ceil(maxAbsoluteValue * 1.18 * 100) / 100;
  const tickIndexes = buildRegularDateTickIndexes(payload.labels, rangeKey);
  const positiveFill = "rgba(22, 163, 74, 0.78)";
  const negativeFill = "rgba(220, 38, 38, 0.78)";

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: payload.labels,
      datasets: payload.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.data.map((value) =>
          Number(value) >= 0 ? positiveFill : negativeFill,
        ),
        borderColor: dataset.data.map((value) => (Number(value) >= 0 ? "#15803d" : "#b91c1c")),
        borderWidth: 0.4,
        borderSkipped: false,
        categoryPercentage: 1,
        barPercentage: 0.9,
        maxBarThickness: 10,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}%p`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatRangeAxisDate(payload.labels[value], rangeKey),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: -axisLimit,
          max: axisLimit,
          ticks: {
            color: "#8d8d86",
            maxTicksLimit: 5,
            callback: (value) => `${Number(value).toFixed(2)}%p`,
          },
          title: {
            display: true,
            text: "10Y - 30Y (%p)",
            color: "#8d8d86",
          },
          grid: {
            color: (context) =>
              context.tick.value === 0 ? "rgba(72, 72, 66, 0.58)" : "rgba(70, 70, 66, 0.10)",
            lineWidth: (context) => (context.tick.value === 0 ? 1.3 : 1),
          },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getMarketMacroPanel(panelKey) {
  return marketMacroData?.panels?.[panelKey] ?? null;
}

function getFxCurrencyOption(currencyKey) {
  return FX_CURRENCY_OPTIONS.find((option) => option.key === currencyKey) ?? null;
}

function getFxUsdValue(currencyKey, rawValue) {
  if (currencyKey === "USD") {
    return 1;
  }
  const option = getFxCurrencyOption(currencyKey);
  const numeric = Number(rawValue);
  if (!option || !Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  return option.quoteConvention === "unitsPerUsd" ? 1 / numeric : numeric;
}

function buildFxCrossRateChartPayload(rangeKey, customRange = null) {
  const panel = getMarketMacroPanel("fx_dashboard");
  const baseCurrency = state.fxBaseCurrency || "KRW";
  const quoteCurrency = state.fxQuoteCurrency || "USD";
  const baseOption = getFxCurrencyOption(baseCurrency);
  const quoteOption = getFxCurrencyOption(quoteCurrency);
  if (!panel || !baseOption || !quoteOption || baseCurrency === quoteCurrency) {
    return { labels: [], datasets: [], mode: "normalized" };
  }

  const baseSeries = baseOption.seriesKey ? panel.series?.[baseOption.seriesKey] : null;
  const quoteSeries = quoteOption.seriesKey ? panel.series?.[quoteOption.seriesKey] : null;
  const baseMap = new Map((baseSeries?.dates ?? []).map((date, index) => [date, baseSeries.values?.[index]]));
  const quoteMap = new Map((quoteSeries?.dates ?? []).map((date, index) => [date, quoteSeries.values?.[index]]));
  const sourceDates = baseSeries?.dates ?? quoteSeries?.dates ?? [];
  const allDates = [...new Set(sourceDates)].filter((date) => {
    const baseRaw = baseCurrency === "USD" ? 1 : baseMap.get(date);
    const quoteRaw = quoteCurrency === "USD" ? 1 : quoteMap.get(date);
    return Number.isFinite(getFxUsdValue(baseCurrency, baseRaw)) && Number.isFinite(getFxUsdValue(quoteCurrency, quoteRaw));
  }).sort();
  if (!allDates.length) {
    return { labels: [], datasets: [], mode: "normalized" };
  }

  const latestDate = allDates[allDates.length - 1];
  const customStart = customRange?.start || "";
  const customEnd = customRange?.end || "";
  const startDate = customStart || shiftDateByRange(latestDate, rangeKey, marketMacroData?.startDate ?? "1971-01-01", allDates);
  const labels = allDates.filter((date) => date >= startDate && (!customEnd || date <= customEnd));
  const rawCrossRates = labels.map((date) => {
    const baseRaw = baseCurrency === "USD" ? 1 : baseMap.get(date);
    const quoteRaw = quoteCurrency === "USD" ? 1 : quoteMap.get(date);
    const baseUsdValue = getFxUsdValue(baseCurrency, baseRaw);
    const quoteUsdValue = getFxUsdValue(quoteCurrency, quoteRaw);
    if (!Number.isFinite(baseUsdValue) || !Number.isFinite(quoteUsdValue) || quoteUsdValue === 0) {
      return null;
    }
    return baseUsdValue / quoteUsdValue;
  });
  const baseValue = rawCrossRates.find((value) => Number.isFinite(value) && value > 0);
  const data = rawCrossRates.map((value) => (
    Number.isFinite(value) && Number.isFinite(baseValue) && baseValue > 0
      ? Number(((value / baseValue) * 100).toFixed(2))
      : null
  ));

  return {
    labels,
    datasets: [{
      key: `${baseCurrency}_${quoteCurrency}`,
      label: `${baseCurrency} / ${quoteCurrency}`,
      data,
      borderColor: "#111827",
      backgroundColor: "#111827",
      borderWidth: 2.8,
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
    }],
    mode: "normalized",
  };
}

function getMarketMacroRange(panelKey) {
  return state.marketMacroRanges?.[panelKey] ?? marketMacroData.defaultRange ?? "max";
}

function getMarketMacroSelection(panelKey) {
  const selected = state.marketMacroSelections?.[panelKey];
  if (Array.isArray(selected) && selected.length) {
    return selected;
  }
  return Object.keys(getMarketMacroPanel(panelKey)?.series ?? {});
}

function getMarketMacroCustomRange(panelKey) {
  return state.marketMacroCustomRanges?.[panelKey] ?? { start: "", end: "" };
}

function buildMarketMacroPanelCard({ key, canvas = key, className = "" }, rangeSource) {
  const panel = getMarketMacroPanel(key);
  if (!panel) {
    return "";
  }
  const selectedSeries = new Set(getMarketMacroSelection(key));
  const customRange = getMarketMacroCustomRange(key);
  const seriesChips = Object.entries(panel.series ?? {})
    .map(
      ([seriesKey, item]) => `
        <button
          type="button"
          class="m7-range-chip macro-dashboard-chip${selectedSeries.has(seriesKey) ? " active" : ""}"
          data-market-macro-series="${seriesKey}"
          data-market-macro-panel="${key}"
        >
          <i class="macro-series-dot" style="background:${item.color}"></i>
          ${item.name}
        </button>`,
    )
    .join("");
  const customDateMarkup = `
        <div class="total-date-row market-macro-date-row">
          <label class="total-date-field">
            Start
            <input type="date" value="${customRange.start || ""}" data-market-macro-custom-start="${key}">
          </label>
          <label class="total-date-field">
            End
            <input type="date" value="${customRange.end || ""}" data-market-macro-custom-end="${key}">
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-market-macro-custom-apply="${key}">Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-market-macro-custom-reset="${key}">Reset</button>
          </div>
        </div>
      `;
  return `
    <article class="cloud-panel macro-panel ${className}">
      <div class="us-panel-head">
        <div>
          <h3>${panel.title}</h3>
          <p>${panel.subtitle}</p>
        </div>
        <div class="m7-range-row">
          ${rangeSource
            .map(
              (range) => `
                <button
                  type="button"
                  class="m7-range-chip${getMarketMacroRange(key) === range.key ? " active" : ""}"
                  data-market-macro-range="${range.key}"
                  data-market-macro-panel="${key}"
                >
                  ${range.label}
                </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="macro-panel-meta">
        <span>${panel.source ?? ""}</span>
        <span>${panel.yAxisLabel ?? (panel.mode === "normalized" ? "Start = 100" : "Raw level")}</span>
      </div>
      <div class="market-macro-series-row">
        ${seriesChips}
      </div>
      ${customDateMarkup}
      <div class="macro-chart-wrap">
        <canvas data-market-macro="${canvas}"></canvas>
      </div>
    </article>
  `;
}

function buildDailyDateLabels(startDate, endDate) {
  const labels = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime())) {
    return labels;
  }
  while (cursor <= end) {
    labels.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return labels;
}

function buildMarketMacroChartPayload(panel, rangeKey, selectedKeys = null, customRange = null) {
  const selectedSet = selectedKeys?.length ? new Set(selectedKeys) : null;
  const seriesEntries = Object.entries(panel?.series ?? {}).filter(([key]) => !selectedSet || selectedSet.has(key));
  const rawAllDates = [
    ...new Set(
      seriesEntries.flatMap(([, item]) =>
        (item.dates ?? []).filter((date, index) => Number.isFinite(Number(item.values?.[index]))),
      ),
    ),
  ].sort();
  if (!rawAllDates.length) {
    return { labels: [], datasets: [], mode: panel?.mode ?? "raw" };
  }

  const allDates = panel?.fillMissing === "forward"
    ? buildDailyDateLabels(rawAllDates[0], rawAllDates[rawAllDates.length - 1])
    : rawAllDates;
  const latestDate = allDates[allDates.length - 1];
  const customStart = customRange?.start || "";
  const customEnd = customRange?.end || "";
  const startDate = customStart || shiftDateByRange(latestDate, rangeKey, marketMacroData?.startDate ?? "2017-01-01", allDates);
  const selectedLabels = allDates.filter((label) => label >= startDate && (!customEnd || label <= customEnd));

  const datasets = seriesEntries.map(([key, item]) => {
    if (panel?.fillMissing === "forward") {
      const sourceDates = item.dates ?? [];
      const sourceValues = item.values ?? [];
      let sourceIndex = 0;
      let carriedValue = null;
      const rawData = selectedLabels.map((label) => {
        while (sourceIndex < sourceDates.length && sourceDates[sourceIndex] <= label) {
          const nextValue = sourceValues[sourceIndex];
          if (Number.isFinite(nextValue)) {
            carriedValue = nextValue;
          }
          sourceIndex += 1;
        }
        return Number.isFinite(carriedValue) ? Number(carriedValue) : null;
      });
      const baseValue = rawData.find((value) => Number.isFinite(value));
      const data = rawData.map((pointValue) => {
        if (!Number.isFinite(pointValue)) {
          return null;
        }
        if (panel.mode === "normalized") {
          if (!Number.isFinite(baseValue)) {
            return null;
          }
          return Number(((pointValue / baseValue) * 100).toFixed(2));
        }
        return Number(pointValue);
      });

      return {
        key,
        label: item.name,
        data,
        borderColor: item.color,
        backgroundColor: item.color,
        borderWidth: 2.4,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        spanGaps: false,
        borderDash: item.dash ?? [],
      };
    }

    const dateIndex = new Map();
    (item.dates ?? []).forEach((date, index) => {
      dateIndex.set(date, index);
    });
    const baseDate = selectedLabels.find((label) => dateIndex.has(label));
    const baseIndex = baseDate ? dateIndex.get(baseDate) : null;
    const baseValue = baseIndex !== null && baseIndex !== undefined ? item.values?.[baseIndex] : null;

    const data = selectedLabels.map((label) => {
      const pointIndex = dateIndex.get(label);
      if (pointIndex === undefined) {
        return null;
      }
      const pointValue = item.values?.[pointIndex];
      if (!Number.isFinite(pointValue)) {
        return null;
      }
      if (panel.mode === "normalized") {
        if (!Number.isFinite(baseValue)) {
          return null;
        }
        return Number(((pointValue / baseValue) * 100).toFixed(2));
      }
      return Number(pointValue);
    });

    return {
      key,
      label: item.name,
      data,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: 2.4,
      tension: panel.mode === "normalized" ? 0.18 : 0.12,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: panel.mode === "normalized" || panel.connectGaps === true,
      borderDash: item.dash ?? [],
    };
  });

  return { labels: selectedLabels, datasets, mode: panel.mode ?? "raw" };
}

function createMarketMacroChart(canvas, panelKey, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const panel = getMarketMacroPanel(panelKey);
  if (!panel) {
    return;
  }

  const payload = panelKey === "fx_dashboard"
    ? buildFxCrossRateChartPayload(rangeKey, getMarketMacroCustomRange(panelKey))
    : buildMarketMacroChartPayload(
      panel,
      rangeKey,
      getMarketMacroSelection(panelKey),
      getMarketMacroCustomRange(panelKey),
    );
  const allValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;

  let yMin;
  let yMax;
  if (panel.mode === "normalized") {
    yMin = Math.floor((minValue - 5) / 10) * 10;
    yMax = Math.ceil((maxValue + 5) / 10) * 10;
  } else {
    const spread = Math.max(maxValue - minValue, Math.abs(maxValue) * 0.15, 1);
    const padding = spread * 0.12;
    yMin = minValue >= 0 ? Math.max(0, minValue - padding) : minValue - padding;
    yMax = maxValue + padding;
  }

  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatMacroValue(context.parsed.y, panel.formatter)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => {
              if (!selectedTickSet.has(value)) {
                return "";
              }
              return formatRangeAxisDate(payload.labels[value], rangeKey);
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatMacroValue(value, panel.formatter),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: panelKey === "fx_dashboard" ? "Selected period start = 100" : panel.yAxisLabel ?? "",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getMarketValuationSelection() {
  const selected = state.marketValuationSelection;
  if (Array.isArray(selected) && selected.length) {
    return selected.filter((key) => marketValuationData?.series?.[key]);
  }
  return Object.keys(marketValuationData?.series ?? {});
}

function getMarketValuationBounds() {
  const dates = Object.values(marketValuationData?.series ?? {})
    .flatMap((item) => item?.dates ?? [])
    .filter(Boolean)
    .sort();
  return {
    min: dates[0] ?? marketValuationData?.startDate ?? "1981-01-01",
    max: dates[dates.length - 1] ?? marketValuationData?.updatedAt ?? "",
  };
}

function formatValuationValue(value, formatter = "number1") {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  if (formatter === "index") {
    return numeric.toFixed(1);
  }
  return numeric.toFixed(1);
}

function buildMarketValuationChartPayload(rangeKey) {
  const selectedSet = new Set(getMarketValuationSelection());
  const entries = Object.entries(marketValuationData?.series ?? {}).filter(([key]) => selectedSet.has(key));
  const allDates = [...new Set(entries.flatMap(([, item]) => item?.dates ?? []))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = allDates[allDates.length - 1];
  const customStart = state.marketValuationCustomStart || "";
  const customEnd = state.marketValuationCustomEnd || "";
  const startDate = customStart || shiftDateByRange(latestDate, rangeKey, marketValuationData?.startDate ?? "1981-01-01", allDates);
  const endDate = customEnd || latestDate;
  const selectedLabels = allDates.filter((label) => label >= startDate && label <= endDate);

  const datasets = entries.map(([key, item]) => {
    const dateIndex = new Map();
    (item.dates ?? []).forEach((date, index) => {
      dateIndex.set(date, index);
    });
    const baseDate = selectedLabels.find((label) => dateIndex.has(label) && Number.isFinite(Number(item.values?.[dateIndex.get(label)])));
    const baseValue = baseDate ? Number(item.values?.[dateIndex.get(baseDate)]) : null;
    const normalize = item.normalize === true;
    const data = selectedLabels.map((label) => {
      const pointIndex = dateIndex.get(label);
      if (pointIndex === undefined) {
        return null;
      }
      const pointValue = Number(item.values?.[pointIndex]);
      if (!Number.isFinite(pointValue)) {
        return null;
      }
      if (normalize) {
        if (!Number.isFinite(baseValue) || baseValue === 0) {
          return null;
        }
        return Number(((pointValue / baseValue) * 100).toFixed(2));
      }
      return Number(pointValue.toFixed(4));
    });

    return {
      key,
      label: item.label,
      data,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: item.axis === "right" ? 2.6 : 2.8,
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: item.axis === "right" ? "y1" : "y",
      formatter: item.formatter ?? "number1",
      normalize,
    };
  });

  return { labels: selectedLabels, datasets };
}

function createMarketValuationChart(canvas, rangeKey) {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildMarketValuationChartPayload(rangeKey);
  const leftValues = payload.datasets
    .filter((dataset) => dataset.yAxisID !== "y1")
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const rightValues = payload.datasets
    .filter((dataset) => dataset.yAxisID === "y1")
    .flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const leftMin = leftValues.length ? Math.min(...leftValues) : 0;
  const leftMax = leftValues.length ? Math.max(...leftValues) : 50;
  const leftPadding = Math.max((leftMax - leftMin) * 0.12, 1);
  const rightMin = rightValues.length ? Math.min(...rightValues) : 80;
  const rightMax = rightValues.length ? Math.max(...rightValues) : 140;
  const rightPadding = Math.max((rightMax - rightMin) * 0.12, 5);
  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => {
              const suffix = context.dataset.normalize ? " (Start=100)" : "";
              return `${context.dataset.label}: ${formatValuationValue(context.parsed.y, context.dataset.formatter)}${suffix}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => {
              if (!selectedTickSet.has(value)) {
                return "";
              }
              return formatRangeAxisDate(payload.labels[value], rangeKey);
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: Math.max(0, leftMin - leftPadding),
          max: leftMax + leftPadding,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatValuationValue(value, "number1"),
            maxTicksLimit: 6,
          },
          title: {
            display: true,
            text: "CAPE ratio",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        y1: {
          position: "right",
          min: Math.max(0, rightMin - rightPadding),
          max: rightMax + rightPadding,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatValuationValue(value, "index"),
            maxTicksLimit: 6,
          },
          title: {
            display: rightValues.length > 0,
            text: "Index Start = 100",
            color: "#8d8d86",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function parseCompanyMonth(monthText) {
  const [yy, mm] = monthText.split("/").map((value) => Number(value));
  return { year: 2000 + yy, month: mm };
}

function latestCompanyMonth() {
  return companies.reduce(
    (latest, company) => {
      const parsed = parseCompanyMonth(company.month);
      if (
        parsed.year > latest.year ||
        (parsed.year === latest.year && parsed.month > latest.month)
      ) {
        return parsed;
      }
      return latest;
    },
    { year: SERIES_START_YEAR, month: SERIES_START_MONTH },
  );
}

function buildMonthlyAxis() {
  const labels = [];
  const latest = latestCompanyMonth();
  let year = SERIES_START_YEAR;
  let month = SERIES_START_MONTH;

  while (year < latest.year || (year === latest.year && month <= latest.month)) {
    labels.push(`${String(year).slice(2)}/${String(month).padStart(2, "0")}`);
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
  }

  return labels;
}

function buildSeriesForAxis(values, companyMonthText) {
  const labels = buildMonthlyAxis();
  const aligned = new Array(labels.length).fill(null);
  const { year, month } = parseCompanyMonth(companyMonthText);
  const endIndex = (year - SERIES_START_YEAR) * 12 + (month - SERIES_START_MONTH);
  const startIndex = Math.max(0, endIndex - values.length + 1);

  values.forEach((value, index) => {
    const targetIndex = startIndex + index;
    if (targetIndex >= 0 && targetIndex < aligned.length) {
      aligned[targetIndex] = value;
    }
  });

  return { labels, aligned };
}

function formatRevenue(company) {
  const meta = currencyMeta[state.currency];
  const value = company.currency?.[state.currency];
  if (value === undefined || value === null) {
    return "-";
  }
  return `${meta.label}${value.toFixed(meta.decimals)}${meta.suffix}`;
}

function revenueCurrencyRatio(company) {
  if (state.currency === "NTD") {
    return 1;
  }
  const ntdValue = Number(company.currency?.NTD);
  const selectedValue = Number(company.currency?.[state.currency]);
  if (!Number.isFinite(ntdValue) || !Number.isFinite(selectedValue) || ntdValue === 0) {
    return 1;
  }
  return selectedValue / ntdValue;
}

function convertRevenueSeries(company, values) {
  const ratio = revenueCurrencyRatio(company);
  return (values ?? []).map((value) => (value === null || value === undefined ? null : Number((Number(value) * ratio).toFixed(6))));
}

function formatMarketCap(company) {
  const meta = currencyMeta[state.currency];
  const value = company.marketCap?.[state.currency];
  if (value === undefined || value === null) {
    return "-";
  }
  return `${meta.label}${value.toFixed(meta.decimals)}${meta.suffix}`;
}

function formatDelta(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function revenueTickLabel(value) {
  const meta = currencyMeta[state.currency];
  return `${meta.label}${Number(value).toFixed(0)}${meta.suffix}`;
}

function companiesByCountry(country) {
  return companies.filter((company) => company.country === country);
}

function activeDashboardKey() {
  if (state.tab === "Taiwan") {
    return "Taiwan";
  }
  return state.tab;
}

function availableSectors() {
  if (state.tab !== "Taiwan") {
    return ["All"];
  }
  return ["All", ...new Set(companiesByCountry("Taiwan").map((company) => company.sector))];
}

function ensureValidSelection() {
  if (state.tab === "Taiwan") {
    const country = primaryTabMeta.Taiwan;
    if (!country.currencies.includes(state.currency)) {
      state.currency = country.defaultCurrency;
    }
  } else {
    state.currency = "USD";
  }
  const sectors = availableSectors();
  if (!sectors.includes(state.sector)) {
    state.sector = "All";
  }
  if (!state.rsSelectedTicker && Array.isArray(marketRsData.rows) && marketRsData.rows.length) {
    state.rsSelectedTicker = marketRsData.rows[0].ticker;
  }
  if (!state.macroIndicatorKey && Array.isArray(macroIndicatorsData.indicators) && macroIndicatorsData.indicators.length) {
    state.macroIndicatorKey = macroIndicatorsData.indicators[0].key;
  }
  const selectedIndicator = macroIndicatorsData.indicators.find((indicator) => indicator.key === state.macroIndicatorKey);
  if (!selectedIndicator && Array.isArray(macroIndicatorsData.indicators) && macroIndicatorsData.indicators.length) {
    state.macroIndicatorKey = macroIndicatorsData.indicators[0].key;
  }
  const safeIndicator = macroIndicatorsData.indicators.find((indicator) => indicator.key === state.macroIndicatorKey);
  if (safeIndicator && !safeIndicator.series.some((series) => series.key === state.macroSeriesKey)) {
    state.macroSeriesKey = safeIndicator.series[0]?.key ?? "";
  }
  if (!["common", "full"].includes(state.macroHistoryMode)) {
    state.macroHistoryMode = "common";
  }
}

function getMacroIndicatorByKey(key) {
  return (macroIndicatorsData.indicators ?? []).find((indicator) => indicator.key === key) ?? null;
}

function getSelectedMacroIndicator() {
  return getMacroIndicatorByKey(state.macroIndicatorKey) ?? (macroIndicatorsData.indicators ?? [])[0] ?? null;
}

function getSelectedMacroSeries(indicator = getSelectedMacroIndicator()) {
  if (!indicator) {
    return null;
  }
  return indicator.series.find((series) => series.key === state.macroSeriesKey) ?? indicator.series[0] ?? null;
}

const macroKoreanLabels = {
  employment: "고용보고서",
  payems: "비농업 고용",
  unrate: "실업률",
  ahe: "평균 시간당 임금",
  cpi: "소비자물가",
  headline_cpi: "헤드라인 CPI",
  core_cpi: "근원 CPI",
  food_cpi: "식품",
  energy_cpi: "에너지",
  shelter_cpi: "주거비",
  rent_cpi: "임대료",
  oer_cpi: "자가주거비",
  transport_services_cpi: "운송서비스",
  medical_services_cpi: "의료서비스",
  new_vehicles_cpi: "신차",
  used_cars_cpi: "중고차",
  apparel_cpi: "의류",
  pce: "PCE 물가",
  headline_pce: "헤드라인 PCE",
  core_pce: "근원 PCE",
  ppi: "생산자물가",
  final_demand_ppi: "최종수요 PPI",
  core_ppi: "근원 PPI",
  retail_sales: "소매판매",
  retail_sales_total: "소매판매",
  ism_services: "ISM 서비스업",
  services_pmi: "서비스업 PMI",
  services_business_activity: "서비스업 활동",
  services_prices: "서비스업 가격",
  services_employment: "서비스업 고용",
  services_new_orders: "서비스업 신규주문",
  ism_manufacturing: "ISM 제조업",
  manufacturing_pmi: "제조업 PMI",
  manufacturing_new_orders: "제조업 신규주문",
  manufacturing_production: "제조업 생산",
  manufacturing_employment: "제조업 고용",
  manufacturing_prices: "제조업 지불가격",
  jolts: "구인·이직",
  job_openings: "구인건수",
  quits_rate: "자발적 퇴사율",
  hires: "채용건수",
  durable_goods: "내구재 주문",
  durable_orders: "내구재 주문",
  core_capital_goods: "핵심 자본재 주문",
  housing: "주택",
  housing_starts: "주택착공",
  building_permits: "건축허가",
};

const macroKoreanNotes = {
  payems: "월간 고용 증가폭입니다. 노동시장 체력과 소비 여력을 같이 봅니다.",
  unrate: "경제활동인구 중 일자리를 찾는 실업자 비율입니다.",
  ahe: "임금 상승 압력입니다. 서비스 물가와 연준 정책에 중요합니다.",
  headline_cpi: "가계가 체감하는 전체 소비자물가 상승률입니다.",
  core_cpi: "에너지와 식품을 제외한 기조 물가 압력입니다.",
  food_cpi: "식료품 가격 압력을 따로 봅니다.",
  energy_cpi: "유가와 전기·가스 등 에너지 가격 변동을 따로 봅니다.",
  shelter_cpi: "CPI에서 비중이 큰 주거비 물가입니다.",
  rent_cpi: "실제 임차인이 내는 임대료 항목입니다.",
  oer_cpi: "자가 거주자가 집을 임대했다면 낼 것으로 추정되는 주거비입니다.",
  transport_services_cpi: "항공료, 보험, 수리 등 운송서비스 물가입니다.",
  medical_services_cpi: "의료서비스 가격 압력입니다.",
  new_vehicles_cpi: "신차 가격 흐름입니다.",
  used_cars_cpi: "중고차와 트럭 가격 흐름입니다.",
  apparel_cpi: "의류 가격 흐름입니다.",
  headline_pce: "연준이 선호하는 개인소비지출 물가입니다.",
  core_pce: "연준이 가장 중요하게 보는 기조 인플레이션입니다.",
  final_demand_ppi: "기업 판매가격 압력입니다. CPI보다 앞서 움직일 때가 많습니다.",
  core_ppi: "변동성이 큰 항목을 제외한 생산자물가 압력입니다.",
  retail_sales_total: "미국 소비 강도를 보여주는 월간 소매판매입니다.",
  services_pmi: "서비스업 경기 확장·수축을 보여주는 지수입니다.",
  services_business_activity: "서비스 기업의 실제 사업활동·생산 강도를 보여줍니다.",
  services_prices: "서비스업 기업들이 느끼는 가격 압력입니다.",
  services_employment: "서비스업 고용 분위기입니다.",
  services_new_orders: "서비스업 신규 수요의 선행 신호입니다.",
  manufacturing_pmi: "제조업 경기 확장·수축을 보여주는 지수입니다.",
  manufacturing_new_orders: "제조업 신규 수요의 선행 신호입니다.",
  manufacturing_production: "제조업 현장의 생산 활동 강도를 보여줍니다.",
  manufacturing_employment: "제조업 기업들의 고용 확장·축소 흐름입니다.",
  manufacturing_prices: "제조업 원가·가격 압력입니다.",
  job_openings: "기업의 구인 수요입니다. 노동시장 과열 여부를 봅니다.",
  quits_rate: "근로자가 자발적으로 이직·퇴사하는 비율입니다.",
  hires: "기업의 실제 채용 규모입니다.",
  durable_orders: "내구재 신규 주문으로 기업투자와 수요를 봅니다.",
  core_capital_goods: "방산·항공 제외 설비투자 선행지표입니다.",
  housing_starts: "실제 착공된 주택 수로 금리 민감 수요를 봅니다.",
  building_permits: "향후 착공 가능성을 보여주는 선행 주택지표입니다.",
};

function getMacroKoreanLabel(entry) {
  return macroKoreanLabels[entry?.key] ?? "";
}

function getMacroKoreanNote(entry) {
  return macroKoreanNotes[entry?.key] ?? "";
}

function getMacroSeriesChartKind(series) {
  if (!series) {
    return "level";
  }
  if (series.key === "payems") {
    return "mom_change";
  }
  if (["unrate", "quits_rate"].includes(series.key)) {
    return "level";
  }
  if (
    series.key.includes("pmi") ||
    series.key.includes("services_") ||
    series.key.includes("manufacturing_")
  ) {
    return "level";
  }
  return "yoy";
}

function getMacroChartKindLabel(kind) {
  if (kind === "yoy") {
    return "YoY %";
  }
  if (kind === "mom_change") {
    return "MoM change";
  }
  return "Level";
}

function formatMacroIndicatorValue(unit, value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (unit === "thousands") {
    if (Math.abs(numeric) >= 1000) {
      return `${(numeric / 1000).toFixed(2)}M`;
    }
    return `${numeric.toFixed(0)}k`;
  }
  if (unit === "usd_millions") {
    return formatCompactDollarMillions(numeric);
  }
  if (unit === "currency") {
    return `$${numeric.toFixed(2)}`;
  }
  if (unit === "percent") {
    return `${numeric.toFixed(2)}%`;
  }
  if (Math.abs(numeric) >= 1000) {
    return numeric.toLocaleString("en-US", { maximumFractionDigits: 1 });
  }
  return numeric.toFixed(2);
}

function formatMacroChangePercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}%`;
}

function formatMacroDeltaValue(unit, value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric >= 0 ? "+" : "";
  if (unit === "percent") {
    return `${sign}${numeric.toFixed(2)}%p`;
  }
  if (unit === "currency") {
    return `${sign}$${numeric.toFixed(2)}`;
  }
  if (unit === "usd_millions") {
    return `${sign}${formatCompactDollarMillions(Math.abs(numeric)).replace("$", "$")}`;
  }
  return `${sign}${formatMacroIndicatorValue(unit, Math.abs(numeric))}`;
}

function formatMacroReleaseSurpriseText(release) {
  if (!release?.surprise) {
    return "vs cons -";
  }
  return `vs cons ${release.surprise}`;
}

function formatMacroChartValue(kind, unit, value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  if (kind === "yoy") {
    return formatMacroChangePercent(value);
  }
  if (kind === "mom_change") {
    return formatMacroDeltaValue(unit, value);
  }
  return formatMacroIndicatorValue(unit, value);
}

function formatMacroReleaseNumber(unit, value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (unit === "percent") {
    return `${numeric.toFixed(2)}%`;
  }
  if (unit === "thousands") {
    return `${(numeric / 1000).toFixed(0)}K`;
  }
  if (unit === "millions") {
    return `${(numeric / 1000000).toFixed(2)}M`;
  }
  return formatMacroIndicatorValue(unit, numeric);
}

function getMacroReleaseConsensusValue(row) {
  const actual = Number(row?.actualValue);
  const surprise = Number(row?.surpriseValue);
  if (!Number.isFinite(actual) || !Number.isFinite(surprise)) {
    return null;
  }
  return actual - surprise;
}

function getMacroReleaseBasis(series, release = series?.latestRelease) {
  const reference = String(release?.reference ?? "").toLowerCase();
  if (reference.includes("yoy") || reference.includes("year")) {
    return "YoY";
  }
  if (reference.includes("mom") || reference.includes("month")) {
    return "MoM";
  }
  if (
    [
      "ahe",
      "headline_cpi",
      "core_cpi",
      "headline_pce",
      "core_pce",
      "final_demand_ppi",
      "core_ppi",
      "retail_sales",
      "durable_goods_orders",
      "core_capex_orders",
    ].includes(series?.key)
  ) {
    return "MoM";
  }
  if (series?.key === "payems") {
    return "Monthly change";
  }
  return "Level";
}

function getMacroDerivedValues(series, kind) {
  const values = series?.values ?? [];
  const valuesByDate = kind === "yoy"
    ? new Map((series?.dates ?? []).map((dateText, index) => [dateText, Number(values[index])]))
    : null;
  return values.map((value, index) => {
    const current = Number(value);
    if (!Number.isFinite(current)) {
      return null;
    }
    if (kind === "yoy") {
      const officialYoy = Number(series?.yoyValues?.[index]);
      if (Number.isFinite(officialYoy)) {
        return Number(officialYoy.toFixed(2));
      }
      const dateText = series?.dates?.[index] ?? "";
      const baseDate = dateText ? `${Number(dateText.slice(0, 4)) - 1}-${dateText.slice(5, 7)}` : "";
      const base = Number(valuesByDate?.get(baseDate));
      if (!Number.isFinite(base) || base === 0) {
        return null;
      }
      return Number((((current / base) - 1) * 100).toFixed(2));
    }
    if (kind === "mom_change") {
      const previous = Number(values[index - 1]);
      if (!Number.isFinite(previous)) {
        return null;
      }
      return Number((current - previous).toFixed(2));
    }
    return current;
  });
}

function buildMacroChartPayload(indicator, series, mode) {
  if (!indicator || !series) {
    return { labels: [], values: [], kind: "level", viewLabel: "Level" };
  }
  const startMonth = mode === "common" ? macroIndicatorsData.commonStartMonth ?? indicator.commonStartMonth : indicator.availableStartMonth ?? indicator.startMonth;
  const kind = getMacroSeriesChartKind(series);
  const derivedValues = getMacroDerivedValues(series, kind);
  const labels = [];
  const values = [];
  (series.dates ?? []).forEach((dateText, index) => {
    if (startMonth && dateText < startMonth) {
      return;
    }
    labels.push(dateText);
    values.push(derivedValues[index] ?? null);
  });
  return { labels, values, kind, viewLabel: getMacroChartKindLabel(kind) };
}

function createMacroIndicatorChart(canvas, indicator, series, mode) {
  if (typeof Chart === "undefined" || !canvas || !indicator || !series) {
    return;
  }
  const payload = buildMacroChartPayload(indicator, series, mode);
  const tickIndexes = new Set(buildMonthlyTickIndexes(payload.labels, 9));

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: [
        {
          label: `${series.label} ${payload.viewLabel}`,
          data: payload.values,
          borderColor: series.color ?? "#111827",
          backgroundColor: series.color ?? "#111827",
          borderWidth: 2.5,
          tension: 0.18,
          pointRadius: 0,
          pointHoverRadius: 4,
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => formatMonthLabel(items[0]?.label ?? ""),
            label: (context) => `${series.label}: ${formatMacroChartValue(payload.kind, series.unit, context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => (tickIndexes.has(index) ? formatMonthLabel(payload.labels[index]) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatMacroChartValue(payload.kind, series.unit, Number(value)),
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createMacroReleaseChart(canvas, series) {
  if (typeof Chart === "undefined" || !canvas || !series) {
    return;
  }
  const rows = (series.releaseHistory ?? [])
    .filter((row) => Number.isFinite(Number(row.actualValue)) && Number.isFinite(Number(getMacroReleaseConsensusValue(row))))
    .slice(-12);
  if (!rows.length) {
    return;
  }
  const labels = rows.map((row) => row.reference ?? row.releaseDate ?? "-");
  const unit = rows.at(-1)?.unit ?? series.unit;
  const basis = getMacroReleaseBasis(series, rows.at(-1));
  const actualValues = rows.map((row) => Number(row.actualValue));
  const consensusValues = rows.map((row) => getMacroReleaseConsensusValue(row));
  const surpriseValues = rows.map((row) => Number(row.surpriseValue));

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "bar",
          label: `Actual (${basis})`,
          data: actualValues,
          backgroundColor: "rgba(36, 36, 33, 0.82)",
          borderRadius: 4,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: `Consensus (${basis})`,
          data: consensusValues,
          backgroundColor: "rgba(37, 99, 235, 0.42)",
          borderRadius: 4,
          yAxisID: "y",
        },
        {
          type: "line",
          label: "Surprise",
          data: surpriseValues,
          borderColor: "#d93025",
          backgroundColor: "#d93025",
          borderWidth: 2.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.18,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatMacroReleaseNumber(unit, context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            maxRotation: 35,
            minRotation: 0,
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          position: "left",
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatMacroReleaseNumber(unit, value),
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        y1: {
          position: "right",
          ticks: {
            color: "#d93025",
            callback: (value) => formatMacroReleaseNumber(unit, value),
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getMacroDashboardSeriesByKey(seriesKey) {
  for (const indicator of macroIndicatorsData.indicators ?? []) {
    const found = (indicator.series ?? []).find((series) => series.key === seriesKey);
    if (found) {
      return found;
    }
  }
  return null;
}

function buildMacroIndicatorDashboardItem({ key, label, seriesKey, kind, color, axis = "percent", formatter = null }) {
  const series = getMacroDashboardSeriesByKey(seriesKey);
  if (!series?.dates?.length) {
    return null;
  }
  const values = getMacroDerivedValues(series, kind);
  const dates = [];
  const cleanValues = [];
  (series.dates ?? []).forEach((dateText, index) => {
    const value = values[index];
    if (!Number.isFinite(Number(value))) {
      return;
    }
    dates.push(dateText.length === 7 ? `${dateText}-01` : dateText);
    cleanValues.push(Number(value));
  });
  return {
    key,
    label,
    dates,
    values: cleanValues,
    color,
    axis,
    formatter: formatter ?? (kind === "mom_change" ? "number1" : "percent2"),
    normalize: false,
    dash: [4, 4],
    fillForward: true,
  };
}

function mergeSeriesPreferRecent(primarySeries, fallbackSeries) {
  const merged = new Map();
  (fallbackSeries?.dates ?? []).forEach((date, index) => {
    const value = Number(fallbackSeries?.values?.[index]);
    if (date && Number.isFinite(value)) {
      merged.set(toDateKey(date), value);
    }
  });
  (primarySeries?.dates ?? []).forEach((date, index) => {
    const value = Number(primarySeries?.values?.[index]);
    if (date && Number.isFinite(value)) {
      merged.set(toDateKey(date), value);
    }
  });
  const dates = [...merged.keys()].sort((a, b) => a.localeCompare(b));
  return {
    dates,
    values: dates.map((date) => merged.get(date)),
  };
}

function scaleSeriesValues(series, multiplier) {
  return {
    dates: series?.dates ?? [],
    values: (series?.values ?? []).map((value) => {
      const numberValue = Number(value);
      return Number.isFinite(numberValue) ? Number((numberValue * multiplier).toFixed(4)) : null;
    }),
  };
}

function getMacroDashboardItems() {
  const policySeries = marketMacroData?.panels?.policy?.series ?? {};
  const gdpSeries = marketMacroData?.panels?.gdp?.series ?? {};
  const rateSeries = marketMacroData?.panels?.rates?.series ?? {};
  const marketItems = marketPriceData?.items ?? {};
  const metalSeries = marketMacroData?.panels?.metals?.series ?? {};
  const energySeries = marketMacroData?.panels?.energy?.series ?? {};
  const longCommoditySeries = marketMacroData?.longCommodities?.series ?? {};

  const maybeItems = [
    marketItems.sp500 && {
      key: "market:sp500",
      label: "S&P 500",
      dates: marketItems.sp500.dates ?? [],
      values: marketItems.sp500.values ?? [],
      color: "#111827",
      axis: "index",
      formatter: "number1",
      normalize: true,
    },
    policySeries.fed_funds && {
      key: "policy:fed_funds",
      label: "Fed Funds",
      dates: policySeries.fed_funds.dates ?? [],
      values: policySeries.fed_funds.values ?? [],
      color: "#e11d48",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
    },
    gdpSeries.real_gdp_annualized && {
      key: "gdp:real_gdp_annualized",
      label: "Real GDP QoQ SAAR",
      dates: gdpSeries.real_gdp_annualized.dates ?? [],
      values: gdpSeries.real_gdp_annualized.values ?? [],
      color: "#8b5cf6",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
      fillForward: true,
    },
    rateSeries.us2y && {
      key: "rates:us2y",
      label: "US 2Y",
      dates: rateSeries.us2y.dates ?? [],
      values: rateSeries.us2y.values ?? [],
      color: "#0f766e",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
    },
    rateSeries.us5y && {
      key: "rates:us5y",
      label: "US 5Y",
      dates: rateSeries.us5y.dates ?? [],
      values: rateSeries.us5y.values ?? [],
      color: "#22c55e",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
    },
    rateSeries.us10y && {
      key: "rates:us10y",
      label: "US 10Y",
      dates: rateSeries.us10y.dates ?? [],
      values: rateSeries.us10y.values ?? [],
      color: "#14b8a6",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
    },
    rateSeries.us30y && {
      key: "rates:us30y",
      label: "US 30Y",
      dates: rateSeries.us30y.dates ?? [],
      values: rateSeries.us30y.values ?? [],
      color: "#06b6d4",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
    },
    policySeries.real_5y && {
      key: "policy:real_5y",
      label: "Real 5Y",
      dates: policySeries.real_5y.dates ?? [],
      values: policySeries.real_5y.values ?? [],
      color: "#dc2626",
      axis: "percent",
      formatter: "percent2",
      normalize: false,
      dash: [6, 4],
    },
    (energySeries.wti || longCommoditySeries.wti) && {
      key: "commodity:wti",
      label: "WTI",
      dates: mergeSeriesPreferRecent(energySeries.wti, longCommoditySeries.wti).dates,
      values: mergeSeriesPreferRecent(energySeries.wti, longCommoditySeries.wti).values,
      color: "#16a34a",
      axis: "index",
      formatter: "dollar1",
      normalize: true,
    },
    (metalSeries.gold || longCommoditySeries.gold) && {
      key: "commodity:gold",
      label: "Gold",
      dates: mergeSeriesPreferRecent(metalSeries.gold, longCommoditySeries.gold).dates,
      values: mergeSeriesPreferRecent(metalSeries.gold, longCommoditySeries.gold).values,
      color: "#d4a017",
      axis: "index",
      formatter: "dollar1",
      normalize: true,
    },
    (metalSeries.silver || longCommoditySeries.silver) && {
      key: "commodity:silver",
      label: "Silver",
      dates: mergeSeriesPreferRecent(metalSeries.silver, longCommoditySeries.silver).dates,
      values: mergeSeriesPreferRecent(metalSeries.silver, longCommoditySeries.silver).values,
      color: "#64748b",
      axis: "index",
      formatter: "dollar1",
      normalize: true,
    },
    (metalSeries.copper || longCommoditySeries.copper) && {
      key: "commodity:copper",
      label: "Copper",
      dates: mergeSeriesPreferRecent(scaleSeriesValues(metalSeries.copper, 2204.6226), longCommoditySeries.copper).dates,
      values: mergeSeriesPreferRecent(scaleSeriesValues(metalSeries.copper, 2204.6226), longCommoditySeries.copper).values,
      color: "#b45309",
      axis: "index",
      formatter: "dollar1",
      normalize: true,
    },
    buildMacroIndicatorDashboardItem({
      key: "indicator:headline_cpi_yoy",
      label: "CPI YoY",
      seriesKey: "headline_cpi",
      kind: "yoy",
      color: "#7c3aed",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:core_cpi_yoy",
      label: "Core CPI YoY",
      seriesKey: "core_cpi",
      kind: "yoy",
      color: "#db2777",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:headline_pce_yoy",
      label: "PCE YoY",
      seriesKey: "headline_pce",
      kind: "yoy",
      color: "#0f766e",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:core_pce_yoy",
      label: "Core PCE YoY",
      seriesKey: "core_pce",
      kind: "yoy",
      color: "#14b8a6",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:final_demand_ppi_yoy",
      label: "PPI YoY",
      seriesKey: "final_demand_ppi",
      kind: "yoy",
      color: "#f97316",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:unrate",
      label: "Unemployment",
      seriesKey: "unrate",
      kind: "level",
      color: "#2563eb",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:ism_manufacturing_pmi",
      label: "ISM Manufacturing PMI",
      seriesKey: "manufacturing_pmi",
      kind: "level",
      color: "#111827",
      axis: "diffusion",
      formatter: "number1",
    }),
    buildMacroIndicatorDashboardItem({
      key: "indicator:ism_services_pmi",
      label: "ISM Services PMI",
      seriesKey: "services_pmi",
      kind: "level",
      color: "#0f766e",
      axis: "diffusion",
      formatter: "number1",
    }),
  ];

  return maybeItems.filter(Boolean);
}

function getMacroDashboardBounds() {
  const selectedKeys = new Set(state.macroDashboardSelection ?? []);
  const items = getMacroDashboardItems().filter((item) => selectedKeys.has(item.key));
  const allDates = [...new Set(items.flatMap((item) => item.dates))].sort((a, b) => toDateKey(a).localeCompare(toDateKey(b)));
  return {
    min: toDateInputValue(allDates[0] ?? ""),
    max: toDateInputValue(allDates[allDates.length - 1] ?? ""),
  };
}

function buildMacroDashboardChartPayload(rangeKey) {
  const selectedKeys = new Set(state.macroDashboardSelection ?? []);
  const items = getMacroDashboardItems().filter((item) => selectedKeys.has(item.key));
  const allDates = [...new Set(items.flatMap((item) => item.dates))].sort((a, b) => toDateKey(a).localeCompare(toDateKey(b)));
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }
  const latestDate = toDateKey(allDates[allDates.length - 1]);
  const startDate = shiftDateByRange(
    latestDate,
    rangeKey,
    marketMacroData?.startDate ?? marketPriceData?.startDate ?? "1965-01-01",
    allDates,
  );
  const customStart = state.macroDashboardCustomStart || startDate;
  const customEnd = state.macroDashboardCustomEnd || latestDate;
  const labels = allDates.filter((date) => toDateKey(date) >= toDateKey(customStart) && toDateKey(date) <= toDateKey(customEnd));
  const datasets = items.map((item) => {
    const dateIndex = new Map();
    item.dates.forEach((date, index) => dateIndex.set(date, index));
    const baseDate = labels.find((date) => dateIndex.has(date) && Number.isFinite(Number(item.values[dateIndex.get(date)])));
    const baseValue = baseDate ? Number(item.values[dateIndex.get(baseDate)]) : null;
    let lastForwardValue = null;
    const data = labels.map((date) => {
      const index = dateIndex.get(date);
      if (index === undefined) {
        if (item.fillForward && Number.isFinite(lastForwardValue)) {
          return lastForwardValue;
        }
        return null;
      }
      const rawValue = Number(item.values[index]);
      const value = Number.isFinite(rawValue) ? rawValue : null;
      if (item.fillForward && Number.isFinite(value)) {
        lastForwardValue = value;
      }
      if (!Number.isFinite(value)) {
        if (item.fillForward && Number.isFinite(lastForwardValue)) {
          return lastForwardValue;
        }
        return null;
      }
      if (!item.normalize) {
        return value;
      }
      if (!Number.isFinite(baseValue) || baseValue === 0) {
        return null;
      }
      return Number(((value / baseValue) * 100).toFixed(2));
    });
    return {
      label: item.label,
      data,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: item.axis === "index" ? 2.6 : 2.2,
      borderDash: item.dash ?? [],
      tension: 0.18,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: item.axis === "percent" ? "yPercent" : item.axis === "diffusion" ? "yDiffusion" : "y",
      formatter: item.formatter,
      normalize: item.normalize,
    };
  });
  return { labels, datasets };
}

function createMacroDashboardChart(canvas, rangeKey) {
  if (typeof Chart === "undefined" || !canvas) {
    return;
  }
  const payload = buildMacroDashboardChartPayload(rangeKey);
  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => {
              const dataset = context.dataset;
              const suffix = dataset.normalize ? " (Start=100)" : "";
              return `${dataset.label}: ${formatMacroValue(context.parsed.y, dataset.normalize ? "number1" : dataset.formatter)}${suffix}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (selectedTickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          position: "left",
          ticks: {
            color: "#8d8d86",
            callback: (value) => Number(value).toFixed(0),
          },
          title: {
            display: true,
            text: "Price / Commodity Start = 100",
            color: "#8d8d86",
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yPercent: {
          position: "right",
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${Number(value).toFixed(1)}%`,
          },
          title: {
            display: true,
            text: "Rates / Inflation / Labor",
            color: "#8d8d86",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
        yDiffusion: {
          display: (context) => context.chart.data.datasets.some((dataset) => dataset.yAxisID === "yDiffusion"),
          position: "right",
          suggestedMin: 30,
          suggestedMax: 70,
          ticks: {
            color: "#0f766e",
            callback: (value) => Number(value).toFixed(0),
          },
          title: {
            display: true,
            text: "ISM Diffusion Index",
            color: "#0f766e",
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function destroyCharts() {
  marketRsDetailChart?.canvas?.__marketRsYAxisDragCleanup?.();
  marketTrendDetailChart?.canvas?.__marketTrendYAxisDragCleanup?.();
  charts.splice(0).forEach((chart) => chart.destroy());
  marketRsDetailChart = null;
  marketRsVolumeChart = null;
  marketTrendDetailChart = null;
}

function parseQuarterLabel(label) {
  const match = /^(\d{2})Q([1-4])$/.exec(label ?? "");
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), quarter: Number(match[2]) };
}

function formatQuarterLabel(year, quarter, prefix = "") {
  return `${prefix}${String(year).padStart(2, "0")}Q${quarter}`;
}

function shiftQuarterLabel(label, quarterOffset, prefix = "") {
  const parsed = parseQuarterLabel(label);
  if (!parsed) {
    return label;
  }

  const absoluteQuarter = parsed.year * 4 + (parsed.quarter - 1) + quarterOffset;
  const year = Math.floor(absoluteQuarter / 4);
  const quarter = (absoluteQuarter % 4) + 1;
  return formatQuarterLabel(year, quarter, prefix);
}

function getCompanyQuarterOffset(company) {
  if (Number.isFinite(company?.quarterOffset)) {
    return company.quarterOffset;
  }
  const companyName = company?.name;
  if (companyName === "Apple") {
    return 1;
  }
  if (companyName === "Microsoft") {
    return 2;
  }
  if (companyName === "NVIDIA") {
    return 3;
  }
  return 0;
}

function getCompanyDisplayQuarterLabels(company, limit = null) {
  const sourceLabels = Array.isArray(company?.labels) ? company.labels : [];
  const selectedLabels = limit ? sourceLabels.slice(-limit) : sourceLabels;
  const quarterOffset = getCompanyQuarterOffset(company);
  const prefix = "FY";
  return selectedLabels.map((label) => shiftQuarterLabel(label, quarterOffset, prefix));
}

function createUsQuarterlyChart(canvas, company) {
  if (typeof Chart === "undefined") {
    return;
  }

  const revenueYoy = company.revenue.map((value, index) => {
    if (Array.isArray(company.revenueYoy) && Number.isFinite(company.revenueYoy[index])) {
      return company.revenueYoy[index];
    }
    if (index < 4) {
      return null;
    }
    return Number((((value - company.revenue[index - 4]) / company.revenue[index - 4]) * 100).toFixed(1));
  });

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: company.displayLabels ?? company.labels,
      datasets: [
        {
          type: "bar",
          label: "Revenue",
          data: company.revenue,
          backgroundColor: "rgba(74, 74, 70, 0.82)",
          borderRadius: 4,
          borderWidth: 0,
          yAxisID: "yRevenue",
        },
        {
          type: "line",
          label: "Revenue YoY%",
          data: revenueYoy,
          borderColor: "#d93025",
          backgroundColor: "#d93025",
          borderWidth: 2.2,
          tension: 0.25,
          pointRadius: 0,
          yAxisID: "yGrowth",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86" },
          border: { color: "#d8d8d2" },
        },
        yRevenue: {
          position: "left",
          ticks: {
            color: "#8d8d86",
            callback: (value) => `$${value}B`,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yGrowth: {
          position: "right",
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}%`,
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudLineChart(canvas, panel, formatter, minOverride = null) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const datasets = panel.series.map((series) => ({
    label: series.name,
    data: series.values,
    borderColor: cloudDashboardData.colors[series.key],
    backgroundColor: cloudDashboardData.colors[series.key],
    borderWidth: 2.8,
    tension: 0.24,
    pointRadius: 3,
    pointHoverRadius: 4,
    pointHitRadius: 10,
    spanGaps: false,
  }));

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMin = minOverride ?? Math.floor((minValue - 5) / 5) * 5;
  const yMax = Math.ceil((maxValue + 5) / 5) * 5;

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: cloudDashboardData.labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => {
              const labels = cloudDashboardData.labels ?? [];
              const isLatest = index === labels.length - 1;
              const isInterval = index % 2 === 0 && index < labels.length - 2;
              if (index === 0 || isLatest || isInterval) {
                return labels[index] ?? "";
              }
              return "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatter(value),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudRevenueBarChart(canvas, panel) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const datasets = panel.series.map((series) => ({
    label: series.name,
    data: series.values,
    backgroundColor: cloudDashboardData.colors[series.key],
    borderColor: cloudDashboardData.colors[series.key],
    borderWidth: 0,
    borderRadius: 4,
    barPercentage: 0.78,
    categoryPercentage: 0.72,
  }));

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMax = Math.ceil((maxValue * 1.1) / 5000) * 5000;

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: cloudDashboardData.labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCompactDollarMillions(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => {
              const labels = cloudDashboardData.labels ?? [];
              const isLatest = index === labels.length - 1;
              const isInterval = index % 2 === 0 && index < labels.length - 2;
              if (index === 0 || isLatest || isInterval) {
                return labels[index] ?? "";
              }
              return "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatCompactDollarMillions(Number(value)),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudBarChart(canvas, panel, formatter, options = {}) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const labels = options.labels ?? cloudDashboardData.labels ?? [];
  const datasets = panel.series.map((series) => ({
    label: series.name,
    data: series.values,
    backgroundColor: series.color ?? cloudDashboardData.colors[series.key],
    borderColor: series.color ?? cloudDashboardData.colors[series.key],
    borderWidth: 0,
    borderRadius: 4,
    barPercentage: options.barPercentage ?? 0.78,
    categoryPercentage: options.categoryPercentage ?? 0.72,
  }));

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const step = options.step ?? 10;
  const yMax = Math.ceil((maxValue * 1.1) / step) * step;
  const tickEvery = options.tickEvery ?? 2;

  const chart = new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => {
              const isLatest = index === labels.length - 1;
              const isInterval = index % tickEvery === 0 && index < labels.length - 2;
              if (index === 0 || isLatest || isInterval) {
                return labels[index] ?? "";
              }
              return "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          min: options.min,
          max: options.max ?? yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatter(Number(value)),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudNetNewArrChart(canvas, series) {
  if (typeof Chart === "undefined" || !series) {
    return;
  }

  const labels = cloudDashboardData.labels ?? [];
  const netNewValues = series.values ?? [];
  const arrValues = series.arrValues ?? [];
  const color = cloudDashboardData.colors[series.key] ?? "#2563eb";
  const finiteNetNew = netNewValues.filter((value) => Number.isFinite(value));
  const finiteArr = arrValues.filter((value) => Number.isFinite(value));
  const minNetNew = finiteNetNew.length ? Math.min(...finiteNetNew) : 0;
  const maxNetNew = finiteNetNew.length ? Math.max(...finiteNetNew) : 10000;
  const maxArr = finiteArr.length ? Math.max(...finiteArr) : 100000;
  const netNewMin = minNetNew < 0 ? Math.floor(minNetNew / 1000) * 1000 : 0;
  const netNewMax = Math.ceil((maxNetNew * 1.12) / 5000) * 5000;
  const arrMax = Math.ceil((maxArr * 1.08) / 25000) * 25000;

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Net New ARR (L)",
          data: netNewValues,
          yAxisID: "yNetNew",
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          borderRadius: 4,
          barPercentage: 0.72,
          categoryPercentage: 0.88,
          order: 2,
        },
        {
          type: "line",
          label: "ARR (R)",
          data: arrValues,
          yAxisID: "yArr",
          borderColor: color,
          backgroundColor: "transparent",
          borderWidth: 2.4,
          borderDash: [7, 5],
          tension: 0.22,
          pointRadius: 2.4,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          fill: false,
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: false,
            boxWidth: 24,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCompactDollarMillions(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => {
              const isLatest = index === labels.length - 1;
              const isInterval = index % 4 === 0 && index < labels.length - 2;
              return index === 0 || isLatest || isInterval ? labels[index] ?? "" : "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        yNetNew: {
          type: "linear",
          position: "left",
          min: netNewMin,
          max: netNewMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatCompactDollarMillions(Number(value)),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yArr: {
          type: "linear",
          position: "right",
          min: 0,
          max: arrMax,
          ticks: {
            color,
            callback: (value) => formatCompactDollarMillions(Number(value)),
            maxTicksLimit: 6,
          },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudGpuPricingChart(canvas, provider, panel) {
  if (typeof Chart === "undefined" || !provider || !panel) {
    return;
  }

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: provider.labels ?? [],
      datasets: (provider.series ?? []).map((series) => ({
        label: series.name,
        data: series.values,
        borderColor: panel.colors?.[series.key] ?? "#111827",
        backgroundColor: panel.colors?.[series.key] ?? "#111827",
        borderWidth: 2.6,
        showLine: provider.chartMode !== "snapshot",
        stepped: provider.chartMode === "step",
        tension: 0,
        pointRadius: provider.chartMode === "snapshot" ? 5 : 3,
        pointHoverRadius: 5,
        pointHitRadius: 10,
        spanGaps: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toFixed(3)} / GPU-hr`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 7, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: provider.suggestedMax,
          ticks: { color: "#8d8d86", callback: (value) => `$${Number(value).toFixed(0)}`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createCloudPointLineChart(canvas, panel, formatter, options = {}) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const labels = options.labels ?? cloudDashboardData.labels ?? [];
  const datasets = panel.series.map((series) => ({
    label: series.name,
    data: series.values,
    borderColor: series.color ?? cloudDashboardData.colors[series.key],
    backgroundColor: series.color ?? cloudDashboardData.colors[series.key],
    borderWidth: 2.6,
    borderDash: series.borderDash ?? [],
    tension: series.stepped ? 0 : 0.24,
    stepped: series.stepped ?? false,
    showLine: series.showLine ?? true,
    pointRadius: series.pointRadius ?? 3,
    pointHoverRadius: series.pointHoverRadius ?? 5,
    pointHitRadius: 10,
    spanGaps: series.spanGaps ?? options.spanGaps === true,
  }));

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const step = options.step ?? 5;
  const yMin = options.min ?? Math.floor((minValue - step) / step) * step;
  const yMax = options.max ?? Math.ceil((maxValue + step) / step) * step;

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => {
              const isLatest = index === labels.length - 1;
              const isInterval = index % 2 === 0 && index < labels.length - 2;
              if (index === 0 || isLatest || isInterval) {
                return labels[index] ?? "";
              }
              return "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatter(Number(value)),
            maxTicksLimit: 6,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function buildCloudRpoStatsMarkup(panel) {
  const labels = cloudDashboardData.labels ?? [];
  return (panel?.series ?? [])
    .map((series) => {
      const values = series.values ?? [];
      const latestIndex = values.findLastIndex((value) => Number.isFinite(value));
      const latestValue = latestIndex >= 0 ? values[latestIndex] : null;
      const yearAgoValue = series.values?.[latestIndex - 4];
      const yoy =
        Number.isFinite(latestValue) && Number.isFinite(yearAgoValue) && yearAgoValue !== 0
          ? ((latestValue - yearAgoValue) / yearAgoValue) * 100
          : null;
      return `
        <div class="cloud-rpo-stat">
          <span>${series.name}</span>
          <strong>${Number.isFinite(latestValue) ? `$${Number(latestValue).toFixed(1)}B` : "-"}</strong>
          <small>${Number.isFinite(yoy) ? `${labels[latestIndex] ?? "-"} · ${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}% YoY` : "YoY N/A"}</small>
        </div>`;
    })
    .join("");
}

function buildCloudRpoRevenueRatioPanel() {
  const revenueSeries = cloudDashboardData.revenue?.series ?? [];
  const rpoSeries = cloudDashboardData.rpo?.series ?? [];
  const series = rpoSeries.map((rpoItem) => {
    const revenueItem = revenueSeries.find((item) => item.key === rpoItem.key);
    const values = (rpoItem.values ?? []).map((rpoValue, index) => {
      const revenueMillions = revenueItem?.values?.[index];
      if (!Number.isFinite(rpoValue) || !Number.isFinite(revenueMillions) || revenueMillions === 0) {
        return null;
      }
      return Number((rpoValue / (revenueMillions / 1000)).toFixed(1));
    });
    return {
      key: rpoItem.key,
      name: `${rpoItem.name} / Revenue`,
      values,
    };
  });

  return {
    title: "RPO / Cloud Revenue Ratio",
    subtitle: "RPO backlog divided by quarterly cloud revenue. Higher means contracted backlog is larger versus the current quarterly revenue base.",
    series,
  };
}

function buildCloudNetNewArrStatsMarkup(panel) {
  const labels = cloudDashboardData.labels ?? [];
  return (panel?.series ?? [])
    .map((series) => {
      const values = series.values ?? [];
      const latestIndex = values.findLastIndex((value) => Number.isFinite(value));
      const latestValue = latestIndex >= 0 ? values[latestIndex] : null;
      const latestArr = series.arrValues?.[latestIndex];
      const yearAgoValue = values[latestIndex - 4];
      const yoy =
        Number.isFinite(latestValue) && Number.isFinite(yearAgoValue) && yearAgoValue !== 0
          ? ((latestValue - yearAgoValue) / Math.abs(yearAgoValue)) * 100
          : null;
      return `
        <div class="cloud-rpo-stat">
          <span>${series.name} Net New ARR</span>
          <strong>${Number.isFinite(latestValue) ? formatCompactDollarMillions(latestValue) : "-"}</strong>
          <small>${labels[latestIndex] ?? "-"} · ARR ${Number.isFinite(latestArr) ? formatCompactDollarMillions(latestArr) : "-"}</small>
          <small>${Number.isFinite(yoy) ? `Net New ARR ${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}% YoY` : "Net New ARR YoY N/A"}</small>
        </div>`;
    })
    .join("");
}

function createCapexLineChart(canvas, labels, panel, formatter, minOverride = null) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const datasets = panel.series.map((series) => ({
    label: series.name,
    data: series.values,
    borderColor: capexDashboardData.colors[series.key],
    backgroundColor: capexDashboardData.colors[series.key],
    borderWidth: 2.6,
    tension: 0.22,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointHitRadius: 10,
    spanGaps: false,
  }));

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMin = minOverride ?? Math.floor((minValue - 5) / 5) * 5;
  const yMax = Math.ceil((maxValue + 5) / 5) * 5;

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: { label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => formatter(value), maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function isCapexEstimateLabel(label) {
  const text = Array.isArray(label) ? label.join(" ") : String(label ?? "");
  return text.startsWith("2026E");
}

function darkenCapexColor(color, factor = 0.25) {
  const hex = String(color ?? "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return color;
  }
  const channels = [0, 2, 4].map((offset) => Math.max(0, Math.round(parseInt(hex.slice(offset, offset + 2), 16) * (1 - factor))));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function createCapexBarChart(canvas, labels, panel, formatter) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const datasets = panel.series.map((series) => {
    const baseColor = capexDashboardData.colors[series.key];
    const estimateColor = darkenCapexColor(baseColor);
    return {
      label: series.name,
      data: series.values,
      backgroundColor: labels.map((label) => (isCapexEstimateLabel(label) ? estimateColor : baseColor)),
      borderColor: labels.map((label) => (isCapexEstimateLabel(label) ? darkenCapexColor(baseColor, 0.4) : baseColor)),
      borderWidth: labels.map((label) => (isCapexEstimateLabel(label) ? 1.5 : 0)),
      borderRadius: 4,
      barPercentage: 0.78,
      categoryPercentage: 0.72,
    };
  });

  const allValues = panel.series.flatMap((series) => series.values.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMin = minValue < 0 ? Math.floor((minValue * 1.1) / 10) * 10 : 0;
  const yMax = Math.ceil((maxValue * 1.1) / 10) * 10;

  const chart = new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: { label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => formatter(value), maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function sumTrailingWindow(values, endIndex, windowSize) {
  let total = 0;
  for (let offset = 0; offset < windowSize; offset += 1) {
    const value = values[endIndex - offset];
    if (!Number.isFinite(value)) {
      return null;
    }
    total += value;
  }
  return total;
}

function buildAnnualBig5CapexPanel() {
  const labels = capexDashboardData.annualLabels ?? [];
  const series = capexDashboardData.annualCapex?.series ?? [];
  const totals = labels.map((_, index) =>
    Number(
      series.reduce((sum, companySeries) => {
        const value = companySeries.values[index];
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0).toFixed(1),
    ),
  );
  const yoy = totals.map((value, index) => {
    const priorIndex = isCapexEstimateLabel(labels[index]) ? labels.indexOf("2025") : index - 1;
    if (priorIndex < 0 || !Number.isFinite(value) || !Number.isFinite(totals[priorIndex]) || totals[priorIndex] === 0) {
      return null;
    }
    return Number((((value - totals[priorIndex]) / totals[priorIndex]) * 100).toFixed(1));
  });

  return {
    labels,
    totals,
    yoy,
  };
}

function buildTtmCapexToOcfPanel() {
  const labels = capexDashboardData.quarterLabels ?? [];
  const capexSeries = capexDashboardData.quarterlyCapex?.series ?? [];
  const ocfSeries = capexDashboardData.quarterlyOcf?.series ?? [];

  const series = capexSeries
    .map((capexCompanySeries) => {
      const ocfCompanySeries = ocfSeries.find((item) => item.key === capexCompanySeries.key);
      if (!ocfCompanySeries) {
        return null;
      }

      const values = labels.map((_, index) => {
        if (index < 3) {
          return null;
        }
        const capexTtm = sumTrailingWindow(capexCompanySeries.values, index, 4);
        const ocfTtm = sumTrailingWindow(ocfCompanySeries.values, index, 4);
        if (!Number.isFinite(capexTtm) || !Number.isFinite(ocfTtm) || ocfTtm === 0) {
          return null;
        }
        return Number(((capexTtm / ocfTtm) * 100).toFixed(1));
      });

      return {
        key: capexCompanySeries.key,
        name: `${capexCompanySeries.name} TTM`,
        values,
      };
    })
    .filter(Boolean);

  return { labels, series };
}

function createCapexAggregateComboChart(canvas, panel) {
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const maxBarValue = Math.max(...panel.totals.filter((value) => Number.isFinite(value)), 0);
  const yoyValues = panel.yoy.filter((value) => Number.isFinite(value));
  const minYoyValue = yoyValues.length ? Math.min(...yoyValues) : 0;
  const maxYoyValue = yoyValues.length ? Math.max(...yoyValues) : 100;

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: panel.labels,
      datasets: [
        {
          type: "bar",
          label: "BIG5 Capex",
          data: panel.totals,
          backgroundColor: panel.labels.map((label) => (isCapexEstimateLabel(label) ? "rgba(32, 32, 29, 0.96)" : "rgba(74, 74, 70, 0.78)")),
          borderColor: panel.labels.map((label) => (isCapexEstimateLabel(label) ? "rgba(16, 16, 14, 1)" : "rgba(74, 74, 70, 1)")),
          borderWidth: panel.labels.map((label) => (isCapexEstimateLabel(label) ? 1.5 : 0)),
          borderRadius: 4,
          yAxisID: "yCapex",
        },
        {
          type: "line",
          label: "YoY Growth",
          data: panel.yoy,
          borderColor: "#d93025",
          backgroundColor: "#d93025",
          borderWidth: 2.4,
          tension: 0.22,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10,
          yAxisID: "yYoy",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              if (context.dataset.yAxisID === "yCapex") {
                return `${context.dataset.label}: $${Number(context.parsed.y).toFixed(1)}B`;
              }
              return `${context.dataset.label}: ${Number(context.parsed.y).toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 10, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        yCapex: {
          position: "left",
          beginAtZero: true,
          max: Math.ceil((maxBarValue * 1.1) / 25) * 25,
          ticks: { color: "#8d8d86", callback: (value) => `$${Number(value).toFixed(0)}B`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yYoy: {
          position: "right",
          min: Math.floor((minYoyValue - 10) / 10) * 10,
          max: Math.ceil((maxYoyValue + 10) / 10) * 10,
          ticks: { color: "#8d8d86", callback: (value) => `${Number(value).toFixed(0)}%`, maxTicksLimit: 6 },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createLlmRevenueChart(canvas) {
  const panel = llmDashboardData.revenue;
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const datasets = (panel.series ?? []).map((series) => ({
    label: series.name,
    data: series.values,
    sourceLabels: series.sourceLabels,
    borderColor: llmDashboardData.colors?.[series.key] ?? "#111827",
    backgroundColor: series.mode === "tracking" ? "#ffffff" : llmDashboardData.colors?.[series.key] ?? "#111827",
    borderWidth: series.mode === "tracking" ? 2.5 : 3,
    borderDash: series.mode === "tracking" ? [7, 5] : [],
    tension: 0.18,
    pointRadius: series.mode === "tracking" ? 3.5 : 4,
    pointHoverRadius: 6,
    pointHitRadius: 12,
    spanGaps: true,
  }));

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: panel.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toFixed(context.parsed.y < 1 ? 3 : 1)}B`,
            afterLabel: (context) => {
              const source = context.dataset.sourceLabels?.[context.dataIndex];
              return source ? `출처: ${source}` : "";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 8, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 80,
          ticks: { color: "#8d8d86", callback: (value) => `$${value}B`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createLlmScaleSpeedChart(canvas) {
  const panel = llmDashboardData.scaleSpeed;
  const companies = panel?.companies ?? [];
  if (typeof Chart === "undefined" || !companies.length) {
    return;
  }

  const milestoneStyles = {
    10: { color: "#16a34a", pointStyle: "circle" },
    50: { color: "#2563eb", pointStyle: "rectRot" },
    100: { color: "#7c3aed", pointStyle: "triangle" },
    latest: { color: "#d97706", pointStyle: "circle" },
  };

  const datasets = companies.map((company, companyIndex) => {
    const points = [
      ...(company.milestones ?? []).map((milestone) => ({
        x: milestone.years,
        y: companyIndex,
        kind: "milestone",
        ...milestone,
      })),
      ...(company.latest ? [{ x: company.latest.years, y: companyIndex, kind: "latest", ...company.latest }] : []),
    ].sort((left, right) => left.x - right.x);

    return {
      label: company.name,
      company,
      data: points,
      showLine: true,
      borderColor: company.color,
      borderWidth: 2,
      tension: 0,
      pointRadius: points.map((point) => (point.amount === 100 ? 7.5 : 6.5)),
      pointHoverRadius: points.map((point) => (point.amount === 100 ? 9.5 : 8.5)),
      pointHitRadius: 14,
      pointStyle: points.map((point) => milestoneStyles[point.kind === "latest" ? "latest" : point.amount]?.pointStyle ?? "circle"),
      pointBackgroundColor: points.map((point) =>
        point.status === "tracking" ? "#ffffff" : milestoneStyles[point.kind === "latest" ? "latest" : point.amount]?.color ?? company.color,
      ),
      pointBorderColor: points.map((point) => milestoneStyles[point.kind === "latest" ? "latest" : point.amount]?.color ?? company.color),
      pointBorderWidth: points.map((point) => (point.status === "tracking" ? 3 : 2)),
    };
  });

  const maxYears = Math.max(...datasets.flatMap((dataset) => dataset.data.map((point) => point.x)), 20);
  const chart = new Chart(canvas, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: true },
      layout: { padding: { right: 12 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.dataset?.label ?? "",
            label: (context) => {
              const point = context.raw;
              return point.kind === "latest"
                ? `현재 추적치: $${Number(point.amount).toFixed(1)}B · ${Number(point.years).toFixed(2)}년차`
                : `$${Number(point.amount).toFixed(0)}B 도달: ${Number(point.years).toFixed(2)}년`;
            },
            afterLabel: (context) => {
              const point = context.raw;
              const status = point.status === "tracking" ? "추정치" : "공식 발표·공시";
              return [`기준일: ${point.date}`, `구분: ${status}`, `근거: ${point.sourceLabel}`, `산식: ${context.dataset.company?.basis ?? ""}`];
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          suggestedMax: Math.ceil(maxYears + 1),
          title: { display: true, text: "상용화·사업 시작 후 경과연수", color: "#66665f", font: { weight: "700" } },
          ticks: { color: "#8d8d86", callback: (value) => `${value}년`, maxTicksLimit: 8 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: -0.5,
          max: companies.length - 0.5,
          reverse: true,
          ticks: {
            stepSize: 1,
            color: "#4c4c47",
            font: { weight: "700" },
            callback: (value) => companies[Math.round(Number(value))]?.name ?? "",
          },
          grid: { color: "rgba(70, 70, 66, 0.08)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createLlmOpenAiUsersChart(canvas) {
  const panel = llmDashboardData.openAiUsers;
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const color = llmDashboardData.colors?.openai ?? "#111827";
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: panel.labels,
      datasets: [
        {
          label: "ChatGPT WAU",
          data: panel.values,
          sourceLabels: panel.sourceLabels,
          borderColor: color,
          backgroundColor: "rgba(17, 24, 39, 0.10)",
          fill: true,
          borderWidth: 3,
          tension: 0.22,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHitRadius: 12,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `주간 활성 사용자: ${Number(context.parsed.y).toFixed(0)}M`,
            afterLabel: (context) => `출처: ${context.dataset.sourceLabels?.[context.dataIndex] ?? "OpenAI"}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 6, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 1000,
          ticks: { color: "#8d8d86", callback: (value) => `${value}M`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createLlmOpenAiAgentUsersChart(canvas) {
  const panel = llmDashboardData.openAiAgentUsers;
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const color = "#2563eb";
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: panel.labels,
      datasets: [
        {
          label: "OpenAI Agent WAU",
          data: panel.values,
          sourceLabels: panel.sourceLabels,
          borderColor: color,
          backgroundColor: "rgba(37, 99, 235, 0.10)",
          fill: true,
          borderWidth: 3,
          tension: 0.16,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHitRadius: 14,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `주간 활성 사용자: ${Number(context.parsed.y).toFixed(0)}M`,
            afterLabel: (context) => `기준: ${context.dataset.sourceLabels?.[context.dataIndex] ?? "OpenAI"}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 6, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 11,
          ticks: { color: "#8d8d86", callback: (value) => `${value}M`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createLlmAnthropicAdoptionChart(canvas) {
  const panel = llmDashboardData.anthropicAdoption;
  if (typeof Chart === "undefined" || !panel) {
    return;
  }

  const color = llmDashboardData.colors?.anthropic ?? "#d97745";
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: panel.labels,
      datasets: [
        {
          label: panel.totalCustomersLabel,
          data: panel.totalCustomersK,
          yAxisID: "yCustomers",
          borderColor: color,
          backgroundColor: color,
          borderWidth: 3,
          tension: 0.18,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHitRadius: 12,
          spanGaps: true,
        },
        {
          label: panel.millionDollarLabel,
          data: panel.millionDollarAccounts,
          yAxisID: "yLarge",
          borderColor: "#2563eb",
          backgroundColor: "#2563eb",
          borderWidth: 2.5,
          borderDash: [7, 5],
          tension: 0.18,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHitRadius: 12,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => {
              if (context.dataset.yAxisID === "yCustomers") {
                const prefix = context.dataIndex === 0 ? "<" : "";
                return `${context.dataset.label}: ${prefix}${Number(context.parsed.y).toFixed(0)}K`;
              }
              return `${context.dataset.label}: ${Number(context.parsed.y).toLocaleString()} accounts`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", autoSkip: true, maxTicksLimit: 5, maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        yCustomers: {
          position: "left",
          beginAtZero: true,
          suggestedMax: 330,
          ticks: { color: "#8d8d86", callback: (value) => `${value}K`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
        yLarge: {
          position: "right",
          beginAtZero: true,
          suggestedMax: 1100,
          ticks: { color: "#8d8d86", callback: (value) => Number(value).toLocaleString(), maxTicksLimit: 6 },
          grid: { drawOnChartArea: false },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function renderLlmOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");
  const scaleSpeed = llmDashboardData.scaleSpeed;
  const formatScaleMilestone = (company, amount) => {
    const milestone = (company.milestones ?? []).find((item) => item.amount === amount);
    if (!milestone) return '<span class="llm-scale-empty">미도달</span>';
    const estimateLabel = milestone.status === "tracking" ? " · 추정" : "";
    return `<strong>${Number(milestone.years).toFixed(2)}년${estimateLabel}</strong><small>${milestone.date}</small>`;
  };

  usOverviewRoot.innerHTML = `
    <section class="llm-overview">
      <div class="us-section-head llm-section-head">
        <div>
          <h2>프론티어 모델 대시보드</h2>
          <p>OpenAI와 Anthropic의 매출 런레이트 및 사용자·기업 도입 추이</p>
        </div>
        <span class="llm-updated">Updated ${llmDashboardData.updatedAt}</span>
      </div>
      <div class="llm-snapshot-strip">
        ${(llmDashboardData.snapshots ?? [])
          .map(
            (item) => `
              <div class="llm-snapshot is-${item.tone}">
                <span>${item.provider}</span>
                <strong>${item.value}</strong>
                <p>${item.metric}</p>
                <small>${item.asOf}</small>
              </div>`,
          )
          .join("")}
      </div>
      <div class="llm-panel-grid">
        <article class="llm-panel llm-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${llmDashboardData.revenue?.title ?? "Revenue Run-Rate"}</h3>
              <p>${llmDashboardData.revenue?.subtitle ?? ""}</p>
            </div>
          </div>
          <div class="llm-chart-wrap llm-chart-wrap-tall">
            <canvas data-llm-chart="revenue"></canvas>
          </div>
          <p class="llm-chart-note">연환산 런레이트는 최근 월 매출을 12배한 속도 지표입니다. 감사된 연간 매출이나 계약 잔고 기준 SaaS ARR과는 다릅니다.</p>
        </article>
        <article class="llm-panel llm-panel-wide">
          <div class="us-panel-head llm-scale-head">
            <div>
              <h3>${scaleSpeed?.title ?? "ARR Scale-Up Speed"}</h3>
              <p>${scaleSpeed?.subtitle ?? ""}</p>
            </div>
            <div class="llm-scale-legend" aria-label="차트 범례">
              <span><i class="is-10"></i>$10B</span>
              <span><i class="is-50"></i>$50B</span>
              <span><i class="is-100"></i>$100B</span>
              <span><i class="is-tracking"></i>최신 추정치</span>
            </div>
          </div>
          <div class="llm-chart-wrap llm-scale-chart-wrap">
            <canvas data-llm-chart="scale-speed"></canvas>
          </div>
          <div class="llm-scale-table-wrap">
            <table class="llm-scale-table">
              <thead>
                <tr>
                  <th>기업·사업</th>
                  <th>속도 측정 시작</th>
                  <th>$10B</th>
                  <th>$50B</th>
                  <th>$100B</th>
                  <th>현재 추적 위치</th>
                  <th>지표 기준</th>
                </tr>
              </thead>
              <tbody>
                ${(scaleSpeed?.companies ?? [])
                  .map(
                    (company) => `
                      <tr>
                        <th>${company.name}</th>
                        <td><a href="${company.startUrl}" target="_blank" rel="noopener noreferrer">${company.startLabel}</a><small>${company.startDate}</small></td>
                        <td>${formatScaleMilestone(company, 10)}</td>
                        <td>${formatScaleMilestone(company, 50)}</td>
                        <td>${formatScaleMilestone(company, 100)}</td>
                        <td>${company.latest ? `<strong>$${Number(company.latest.amount).toFixed(1)}B · ${Number(company.latest.years).toFixed(2)}년차</strong><small>${company.latest.date} · 추정</small>` : '<span class="llm-scale-empty">—</span>'}</td>
                        <td>${company.basis}</td>
                      </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <p class="llm-chart-note">${scaleSpeed?.note ?? ""}</p>
        </article>
        <article class="llm-panel">
          <div class="us-panel-head">
            <div>
              <h3>${llmDashboardData.openAiUsers?.title ?? "OpenAI Adoption"}</h3>
              <p>${llmDashboardData.openAiUsers?.subtitle ?? ""}</p>
            </div>
          </div>
          <div class="llm-chart-wrap">
            <canvas data-llm-chart="openai-users"></canvas>
          </div>
        </article>
        <article class="llm-panel">
          <div class="us-panel-head">
            <div>
              <h3>${llmDashboardData.openAiAgentUsers?.title ?? "OpenAI Agent Adoption"}</h3>
              <p>${llmDashboardData.openAiAgentUsers?.subtitle ?? ""}</p>
            </div>
          </div>
          <div class="llm-chart-wrap">
            <canvas data-llm-chart="openai-agent-users"></canvas>
          </div>
          <p class="llm-chart-note">6월 5M은 Codex 단독, 7월은 Codex + ChatGPT Work 합산이므로 두 시계열의 기준이 완전히 같지는 않습니다.</p>
        </article>
        <article class="llm-panel llm-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${llmDashboardData.anthropicAdoption?.title ?? "Anthropic Adoption"}</h3>
              <p>${llmDashboardData.anthropicAdoption?.subtitle ?? ""}</p>
            </div>
          </div>
          <div class="llm-chart-wrap">
            <canvas data-llm-chart="anthropic-adoption"></canvas>
          </div>
        </article>
        <article class="llm-panel llm-panel-wide llm-method-panel">
          <div>
            <h3>지표 해석</h3>
            <ul>
              ${(llmDashboardData.methodology ?? []).map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h3>출처</h3>
            <div class="llm-source-list">
              ${(llmDashboardData.sources ?? [])
                .map((source) => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`)
                .join("")}
            </div>
          </div>
        </article>
      </div>
    </section>
  `;

  const revenueCanvas = usOverviewRoot.querySelector('[data-llm-chart="revenue"]');
  const scaleSpeedCanvas = usOverviewRoot.querySelector('[data-llm-chart="scale-speed"]');
  const openAiUsersCanvas = usOverviewRoot.querySelector('[data-llm-chart="openai-users"]');
  const openAiAgentUsersCanvas = usOverviewRoot.querySelector('[data-llm-chart="openai-agent-users"]');
  const anthropicAdoptionCanvas = usOverviewRoot.querySelector('[data-llm-chart="anthropic-adoption"]');
  if (revenueCanvas) createLlmRevenueChart(revenueCanvas);
  if (scaleSpeedCanvas) createLlmScaleSpeedChart(scaleSpeedCanvas);
  if (openAiUsersCanvas) createLlmOpenAiUsersChart(openAiUsersCanvas);
  if (openAiAgentUsersCanvas) createLlmOpenAiAgentUsersChart(openAiAgentUsersCanvas);
  if (anthropicAdoptionCanvas) createLlmAnthropicAdoptionChart(anthropicAdoptionCanvas);
}

function renderCloudOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");
  const rpoRatioPanel = buildCloudRpoRevenueRatioPanel();

  usOverviewRoot.innerHTML = `
    <section class="cloud-overview">
      <div class="us-section-head cloud-section-head">
        <h2>Cloud Dashboard</h2>
        <p>AWS, Microsoft cloud, and Google Cloud trends from the raw Excel sheets</p>
      </div>
      <div class="cloud-panel-grid">
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.yoyGrowth.title}</h3>
              <p>${cloudDashboardData.yoyGrowth.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-cloud-chart="growth"></canvas>
          </div>
        </article>
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.margin.title}</h3>
              <p>${cloudDashboardData.margin.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-cloud-chart="margin"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.revenue.title}</h3>
              <p>${cloudDashboardData.revenue.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-cloud-chart="revenue"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide cloud-rpo-panel">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.rpo.title}</h3>
              <p>${cloudDashboardData.rpo.subtitle}</p>
            </div>
          </div>
          <div class="cloud-rpo-stats">
            ${buildCloudRpoStatsMarkup(cloudDashboardData.rpo)}
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-cloud-chart="rpo"></canvas>
          </div>
          <p class="cloud-rpo-note">RPO는 이미 계약됐지만 아직 매출로 인식되지 않은 잔고입니다. 다만 기준은 완전히 동일하지 않습니다. AWS는 주로 AWS 장기계약, Microsoft는 Azure-only가 아닌 Commercial RPO, Google은 최신 공시상 대부분 Google Cloud 관련 RPO로 봐야 합니다.</p>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${rpoRatioPanel.title}</h3>
              <p>${rpoRatioPanel.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-cloud-chart="rpo-ratio"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.netNewArr.title}</h3>
              <p>${cloudDashboardData.netNewArr.subtitle}</p>
            </div>
          </div>
          <div class="cloud-rpo-stats cloud-net-new-arr-stats">
            ${buildCloudNetNewArrStatsMarkup(cloudDashboardData.netNewArr)}
          </div>
          <div class="cloud-net-new-arr-grid">
            ${(cloudDashboardData.netNewArr.series ?? [])
              .map(
                (series) => `
                  <section class="cloud-net-new-arr-item">
                    <h4>${series.name}</h4>
                    <p>${series.basis}</p>
                    <div class="cloud-chart-wrap cloud-net-new-arr-chart">
                      <canvas data-cloud-net-new-arr="${series.key}"></canvas>
                    </div>
                  </section>`,
              )
              .join("")}
          </div>
          <p class="cloud-rpo-note">막대(좌축)는 전분기 대비 매출 순증가분을 연율화한 Net New ARR 프록시이며, 점선(우축)은 해당 분기 매출을 4배한 ARR 프록시입니다. AWS와 Google Cloud는 회사 공시 매출, Azure는 독립 매출 비공개로 Altimeter / Clouded Judgement 추정계열을 사용합니다.</p>
        </article>
        <article class="cloud-panel cloud-panel-wide cloud-gpu-pricing-panel">
          <div class="us-panel-head">
            <div>
              <h3>${cloudDashboardData.gpuPricing.title}</h3>
              <p>${cloudDashboardData.gpuPricing.subtitle}</p>
            </div>
            <span class="cloud-gpu-updated">Updated ${cloudDashboardData.gpuPricing.updatedAt}</span>
          </div>
          <div class="cloud-gpu-pricing-grid">
            ${(cloudDashboardData.gpuPricing.providers ?? [])
              .map(
                (provider) => `
                  <section class="cloud-gpu-price-item">
                    <div class="cloud-gpu-price-head">
                      <div class="cloud-gpu-price-title-row">
                        <h4>${provider.name}</h4>
                        <span>${provider.observationType ?? "공개가격"}</span>
                      </div>
                      <p>${provider.basis}</p>
                    </div>
                    <div class="cloud-chart-wrap cloud-gpu-price-chart">
                      <canvas data-cloud-gpu-price="${provider.key}"></canvas>
                    </div>
                    <p class="cloud-gpu-price-note">${provider.note}</p>
                    <div class="cloud-gpu-price-detail">
                      <strong>자료 출처</strong>
                      <div class="cloud-gpu-price-source-list">
                        ${(provider.sourceLinks ?? [])
                          .map(
                            (source) =>
                              `<a class="cloud-gpu-price-source" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`,
                          )
                          .join("")}
                      </div>
                    </div>
                    <div class="cloud-gpu-price-detail cloud-gpu-price-limit">
                      <strong>한계</strong>
                      <p>${provider.limitations ?? "공개 가격표의 범위 안에서만 비교할 수 있습니다."}</p>
                    </div>
                  </section>`,
              )
              .join("")}
          </div>
          <p class="cloud-rpo-note"><strong>읽는 법:</strong> VM 또는 UltraServer 전체 공개가격을 공식 GPU 수로 나눈 단순 환산치입니다. 세 업체의 리전, 네트워크, CPU·메모리 구성과 구매 방식이 다르므로 업체 간 절대가격 순위가 아니라 각 가격의 방향과 세대별 격차를 확인하는 용도로 봐야 합니다.</p>
        </article>
      </div>
    </section>
  `;

  const growthCanvas = usOverviewRoot.querySelector('[data-cloud-chart="growth"]');
  const marginCanvas = usOverviewRoot.querySelector('[data-cloud-chart="margin"]');
  const revenueCanvas = usOverviewRoot.querySelector('[data-cloud-chart="revenue"]');
  const rpoCanvas = usOverviewRoot.querySelector('[data-cloud-chart="rpo"]');
  const rpoRatioCanvas = usOverviewRoot.querySelector('[data-cloud-chart="rpo-ratio"]');
  const netNewArrCanvases = usOverviewRoot.querySelectorAll("[data-cloud-net-new-arr]");
  const gpuPricingCanvases = usOverviewRoot.querySelectorAll("[data-cloud-gpu-price]");

  if (growthCanvas) {
    createCloudLineChart(growthCanvas, cloudDashboardData.yoyGrowth, (value) => `${Number(value).toFixed(1)}%`, 0);
  }
  if (marginCanvas) {
    createCloudLineChart(marginCanvas, cloudDashboardData.margin, (value) => `${Number(value).toFixed(1)}%`, -20);
  }
  if (revenueCanvas) {
    createCloudRevenueBarChart(revenueCanvas, cloudDashboardData.revenue);
  }
  if (rpoCanvas) {
    createCloudBarChart(rpoCanvas, cloudDashboardData.rpo, (value) => `$${Number(value).toFixed(0)}B`, { step: 100 });
  }
  if (rpoRatioCanvas) {
    createCloudPointLineChart(rpoRatioCanvas, rpoRatioPanel, (value) => `${Number(value).toFixed(1)}x`, { step: 5, min: 0 });
  }
  netNewArrCanvases.forEach((canvas) => {
    const key = canvas.dataset.cloudNetNewArr;
    const series = cloudDashboardData.netNewArr?.series?.find((item) => item.key === key);
    if (!series) {
      return;
    }
    createCloudNetNewArrChart(canvas, series);
  });
  gpuPricingCanvases.forEach((canvas) => {
    const provider = cloudDashboardData.gpuPricing?.providers?.find((item) => item.key === canvas.dataset.cloudGpuPrice);
    if (provider) {
      createCloudGpuPricingChart(canvas, provider, cloudDashboardData.gpuPricing);
    }
  });
}

function renderPlaceholderOverview(title, description) {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");
  usOverviewRoot.innerHTML = `
    <section class="placeholder-overview">
      <article class="placeholder-panel">
        <h2>${title}</h2>
        <p>${description}</p>
      </article>
    </section>
  `;
}

function formatInfraPrice(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  return `$${numeric.toFixed(1)}/MWh`;
}

function formatInfraDate(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

function formatInfraStatusLabel(status) {
  if (status === "stressed") return "스트레스";
  if (status === "elevated") return "주의";
  return "정상";
}

function getInfraPanel(panelKey) {
  return infraGridData?.panels?.[panelKey] ?? null;
}

function getInfraRange(panelKey) {
  return state.infraRanges?.[panelKey] ?? infraGridData.defaultRange ?? "3y";
}

function getInfraSelection(panelKey) {
  const selected = state.infraSelections?.[panelKey];
  if (Array.isArray(selected) && selected.length) {
    return selected;
  }
  return Object.keys(getInfraPanel(panelKey)?.series ?? {});
}

function buildInfraChartPayload(panel, rangeKey, selectedKeys) {
  const selectedSet = new Set(selectedKeys?.length ? selectedKeys : Object.keys(panel?.series ?? {}));
  const entries = Object.entries(panel?.series ?? {}).filter(([key]) => selectedSet.has(key));
  const allDates = [...new Set(entries.flatMap(([, item]) => item?.dates ?? []))].sort();
  if (!allDates.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = allDates[allDates.length - 1];
  const startDate = shiftDateByRange(latestDate, rangeKey, infraGridData?.startDate ?? "2001-01-01", allDates);
  const selectedLabels = allDates.filter((label) => label >= startDate);

  const datasets = entries.map(([key, item]) => {
    const dateIndex = new Map();
    (item.dates ?? []).forEach((date, index) => dateIndex.set(date, index));
    return {
      key,
      label: item.name,
      data: selectedLabels.map((label) => {
        const index = dateIndex.get(label);
        if (index === undefined) {
          return null;
        }
        const value = Number(item.values?.[index]);
        return Number.isFinite(value) ? value : null;
      }),
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: 2.2,
      tension: 0.14,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 10,
      spanGaps: panel.connectGaps === true,
    };
  });

  return { labels: selectedLabels, datasets };
}

function createInfraChart(canvas, panelKey) {
  if (typeof Chart === "undefined") {
    return;
  }
  const panel = getInfraPanel(panelKey);
  if (!panel) {
    return;
  }
  const rangeKey = getInfraRange(panelKey);
  const payload = buildInfraChartPayload(panel, rangeKey, getInfraSelection(panelKey));
  const allValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const spread = Math.max(maxValue - minValue, Math.abs(maxValue) * 0.18, 1);
  const yMin = minValue >= 0 ? Math.max(0, minValue - spread * 0.1) : minValue - spread * 0.1;
  const yMax = maxValue + spread * 0.12;
  const tickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const tickSet = new Set(tickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: payload.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatMacroValue(context.parsed.y, panel.formatter)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatMacroValue(value, panel.formatter),
            maxTicksLimit: 6,
          },
          title: { display: true, text: panel.yAxisLabel ?? "", color: "#8d8d86" },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function buildInfraPanelCard(panelConfig, rangeSource) {
  const panel = getInfraPanel(panelConfig.key);
  if (!panel) {
    return "";
  }
  const selected = new Set(getInfraSelection(panelConfig.key));
  const seriesChips = Object.entries(panel.series ?? {})
    .map(
      ([seriesKey, item]) => `
        <button
          type="button"
          class="m7-range-chip macro-dashboard-chip${selected.has(seriesKey) ? " active" : ""}"
          data-infra-series="${seriesKey}"
          data-infra-panel="${panelConfig.key}"
        >
          <i class="macro-series-dot" style="background:${item.color}"></i>
          ${item.name}
        </button>`,
    )
    .join("");

  return `
    <article class="cloud-panel macro-panel ${panelConfig.className ?? ""}">
      <div class="us-panel-head">
        <div>
          <h3>${panel.title}</h3>
          <p>${panel.subtitle}</p>
        </div>
        <div class="m7-range-row">
          ${rangeSource
            .map(
              (range) => `
                <button
                  type="button"
                  class="m7-range-chip${getInfraRange(panelConfig.key) === range.key ? " active" : ""}"
                  data-infra-range="${range.key}"
                  data-infra-panel="${panelConfig.key}"
                >
                  ${range.label}
                </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="macro-panel-meta">
        <span>${panel.source ?? ""}</span>
        <span>${panel.yAxisLabel ?? ""}</span>
      </div>
      <div class="market-macro-series-row">${seriesChips}</div>
      <div class="macro-chart-wrap"><canvas data-infra-panel="${panelConfig.key}"></canvas></div>
    </article>`;
}

function bindInfraControls(panelKeys) {
  usOverviewRoot.querySelectorAll("[data-infra-range]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.infraPanel;
      state.infraRanges = { ...state.infraRanges, [panelKey]: button.dataset.infraRange || infraGridData.defaultRange || "3y" };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-infra-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.infraPanel;
      const seriesKey = button.dataset.infraSeries;
      if (!panelKey || !seriesKey) {
        return;
      }
      const selected = new Set(getInfraSelection(panelKey));
      if (selected.has(seriesKey) && selected.size > 1) {
        selected.delete(seriesKey);
      } else {
        selected.add(seriesKey);
      }
      state.infraSelections = { ...state.infraSelections, [panelKey]: [...selected] };
      render();
    });
  });

  panelKeys.forEach((panelKey) => {
    const canvas = usOverviewRoot.querySelector(`canvas[data-infra-panel="${panelKey}"]`);
    if (canvas) {
      createInfraChart(canvas, panelKey);
    }
  });
}

const INFRA_HUB_MAP_META = {
  pjm_west: { x: 70, y: 44, label: "PJM West", note: "Mid-Atlantic / NoVA proxy" },
  indiana: { x: 57, y: 42, label: "Indiana", note: "Midwest / MISO" },
  mass_hub: { x: 82, y: 31, label: "Mass Hub", note: "New England" },
  np15: { x: 16, y: 43, label: "NP15", note: "Northern CA" },
  sp15: { x: 20, y: 59, label: "SP15", note: "Southern CA" },
  palo_verde: { x: 28, y: 59, label: "Palo Verde", note: "Arizona / Southwest" },
  mid_c: { x: 20, y: 25, label: "Mid-C", note: "Pacific Northwest" },
  ercot_north: { x: 50, y: 67, label: "ERCOT North", note: "Texas historical" },
};

function buildInfraMapMarkup(snapshots) {
  const markers = snapshots
    .map((item) => {
      const meta = INFRA_HUB_MAP_META[item.key];
      if (!meta) {
        return "";
      }
      return `
        <button
          type="button"
          class="infra-map-marker ${item.status}"
          style="left:${meta.x}%; top:${meta.y}%"
          title="${meta.label} / ${meta.note} / ${formatInfraPrice(item.price)}"
        >
          <span class="infra-map-dot"></span>
          <span class="infra-map-label">${meta.label}</span>
        </button>`;
    })
    .join("");

  return `
    <article class="infra-explain-panel infra-map-panel">
      <div>
        <h3>전력 허브 지도</h3>
        <p>표시된 지점은 실제 데이터센터 주소가 아니라 공개 전력가격 허브입니다. 어느 지역 전력망에서 가격 압력이 나타나는지 위치감을 잡기 위한 지도입니다.</p>
      </div>
      <div class="infra-map-canvas" aria-label="US power hub map">
        <div class="infra-map-region west">서부</div>
        <div class="infra-map-region midwest">중부</div>
        <div class="infra-map-region east">동부</div>
        ${markers}
      </div>
      <div class="infra-map-legend">
        <span><i class="normal"></i>정상</span>
        <span><i class="elevated"></i>주의</span>
        <span><i class="stressed"></i>스트레스</span>
      </div>
    </article>`;
}

function buildInfraGuideMarkup() {
  return `
    <article class="infra-explain-panel">
      <div>
        <h3>어떻게 볼까</h3>
        <p>AI와 데이터센터 수요가 특정 전력망 지역에서 반복적인 전력가격 스트레스로 나타나는지 보는 대시보드입니다.</p>
      </div>
      <div class="infra-guide-grid">
        <div>
          <strong>최근값</strong>
          <span>EIA가 공개한 최신 ICE 피크 전력가격입니다. 단위는 $/MWh입니다.</span>
        </div>
        <div>
          <strong>1년 평균</strong>
          <span>최근 가격이 높은지 낮은지 비교하기 위한 1년 평균 기준선입니다.</span>
        </div>
        <div>
          <strong>90일 급등</strong>
          <span>최근 90개 관측치 중 전력가격이 $100/MWh 이상이었던 날의 개수입니다.</span>
        </div>
        <div>
          <strong>상태</strong>
          <span>스트레스는 급등일 10일 이상, 주의는 4일 이상을 의미합니다.</span>
        </div>
      </div>
    </article>`;
}

function buildInfraInvestmentGuideMarkup() {
  return `
    <article class="infra-investment-guide">
      <div class="infra-investment-head">
        <h3>투자 관점에서 보는 법</h3>
        <p>이 대시보드는 단독 매매 신호가 아닙니다. AI 인프라 사이클이 GPU 부족에서 지역 전력망 부족으로 번지고 있는지 판단하기 위한 보조 지표입니다.</p>
      </div>
      <div class="infra-investment-grid">
        <div>
          <strong>전력가격 급등이 반복될 때</strong>
          <span>$100/MWh 이상인 날이 반복되면 지역 전력 공급 부족, 송전 병목, 수요 압박을 의심할 수 있습니다. 전력 장비, 발전, 전기 인프라 투자 테마에 우호적인 배경이 될 수 있습니다.</span>
        </div>
        <div>
          <strong>여러 지역이 같이 오르는지</strong>
          <span>PJM West, Mass Hub, Indiana가 동시에 오르면 단일 지역 이벤트보다 넓은 전력 압력으로 볼 수 있습니다. 한 지역만 튀면 우선 지역 이슈로 해석하는 편이 낫습니다.</span>
        </div>
        <div>
          <strong>PJM West가 중요한 이유</strong>
          <span>PJM West는 미드애틀랜틱과 북버지니아 전력 압력을 보는 공개 대용 지표입니다. 북버지니아는 데이터센터 전력 수요 논쟁의 핵심 지역입니다.</span>
        </div>
        <div>
          <strong>30일 최고값과 최근값 비교</strong>
          <span>30일 최고값은 높지만 최근값이 낮으면 일회성 이벤트였을 수 있습니다. 반대로 90일 급등 횟수가 많으면 반복적인 스트레스라 구조적 설비투자 테마와 더 관련이 큽니다.</span>
        </div>
        <div>
          <strong>GPU/클라우드 지표와 같이 보기</strong>
          <span>전력가격 스트레스와 GPU 임대료 상승이 같이 나타나면 컴퓨팅 공급이 여전히 타이트하다는 신호일 수 있습니다. 전력 스트레스가 있는데 하이퍼스케일러 주가가 약하면 투자자들이 CAPEX와 마진 부담을 더 크게 보는 국면일 수 있습니다.</span>
        </div>
        <div>
          <strong>주의할 점</strong>
          <span>날씨, 발전소/송전망 고장, 연료비, 송전 혼잡만으로도 전력가격은 움직입니다. 중요한 것은 하루짜리 급등이 아니라 반복성과 지역 패턴입니다.</span>
        </div>
      </div>
    </article>`;
}

function renderInfraOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  const rangeSource = (infraGridData.ranges ?? []).length ? infraGridData.ranges : marketPriceData.ranges ?? [];
  const snapshots = infraGridData.snapshots ?? [];
  const panelKeys = (infraGridData.dashboards ?? []).map((item) => item.key).filter((key) => infraGridData.panels?.[key]);
  const stressedCount = snapshots.filter((item) => item.status === "stressed").length;
  const elevatedCount = snapshots.filter((item) => item.status === "elevated").length;
  const highest = snapshots.reduce((winner, item) => (Number(item.price) > Number(winner?.price ?? -Infinity) ? item : winner), null);
  const cardsMarkup = snapshots
    .map(
      (item) => `
        <article class="infra-grid-card ${item.status}">
          <div class="infra-grid-card-head">
            <div>
              <h3>${item.label}</h3>
              <p>${item.region}</p>
            </div>
            <span class="infra-status-pill">${formatInfraStatusLabel(item.status)}</span>
          </div>
          <div class="infra-grid-metrics">
            <div>
              <span>최근값</span>
              <strong>${formatInfraPrice(item.price)}</strong>
            </div>
            <div>
              <span>1년 평균</span>
              <strong>${formatInfraPrice(item.avg1y)}</strong>
            </div>
            <div>
              <span>90일 급등</span>
              <strong>${Number(item.spikeDays90 ?? 0).toFixed(0)}일</strong>
            </div>
          </div>
          <p class="infra-card-foot">${formatInfraDate(item.date)} / ${Number.isFinite(Number(item.premiumTo1yPct)) ? `1년 평균 대비 ${Number(item.premiumTo1yPct).toFixed(1)}%` : "1년 평균 비교 불가"}</p>
        </article>`,
    )
    .join("");
  const panelMarkup = (infraGridData.dashboards ?? [])
    .map((config, index) => buildInfraPanelCard({ key: config.key, className: index < 2 ? "macro-panel-wide" : "" }, rangeSource))
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview infra-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>데이터센터 전력 스트레스</h2>
            <p>데이터센터 전력 수요가 지역 전력망에 부담을 주는지 보기 위한 일별 전력 허브 가격과 급등 지표입니다.</p>
          </div>
          <div class="us-price-controls">
            <a class="market-breadth-link" href="${infraGridData.source?.url ?? "https://www.eia.gov/electricity/wholesale/"}" target="_blank" rel="noreferrer">EIA 원천 열기</a>
            <div class="us-price-updated">업데이트 ${infraGridData.updatedAt || "-"}</div>
          </div>
        </div>
        <div class="market-trend-meta">
          <span>출처: ${infraGridData.source?.name ?? "EIA Wholesale Electricity"}</span>
          <span>EIA는 ICE 일별 전력 허브 가격을 보통 격주 단위로 다시 공개합니다</span>
          <span>PJM West는 북버지니아 전력가격 압력을 보는 공개 대용 지표로 사용합니다</span>
        </div>
        <div class="infra-explain-grid">
          ${buildInfraGuideMarkup()}
          ${buildInfraMapMarkup(snapshots)}
        </div>
        <div class="infra-grid-summary">
          <div>
            <strong>${snapshots.length}</strong>
            <span>추적 허브</span>
          </div>
          <div>
            <strong>${stressedCount}</strong>
            <span>스트레스</span>
          </div>
          <div>
            <strong>${elevatedCount}</strong>
            <span>주의</span>
          </div>
          <div>
            <strong>${highest ? formatInfraPrice(highest.price) : "-"}</strong>
            <span>${highest?.label ?? "최고가 허브"}</span>
          </div>
        </div>
        <div class="infra-card-grid">${cardsMarkup}</div>
        <div class="macro-panel-grid infra-chart-grid">${panelMarkup}</div>
        ${buildInfraInvestmentGuideMarkup()}
      </section>
    </section>
  `;

  bindInfraControls(panelKeys);
}

function renderMarketBreadthOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");
  usOverviewRoot.innerHTML = `
    <section class="market-breadth-overview">
      <article class="us-panel">
        <div class="us-section-head">
          <div>
            <h2>Market Breadth</h2>
            <p>Stockbee Primary Indicator 원본 시트를 그대로 표시합니다.</p>
          </div>
          <div class="market-breadth-actions">
            <a class="market-breadth-link" href="${MARKET_BREADTH_SOURCE_URL}" target="_blank" rel="noreferrer">Open Source Page</a>
            <a class="market-breadth-link" href="${MARKET_BREADTH_SHEET_URL}" target="_blank" rel="noreferrer">Open Sheet</a>
          </div>
        </div>
      </article>
      <article class="us-panel market-breadth-frame-panel">
        <iframe
          class="market-breadth-frame"
          src="${MARKET_BREADTH_SHEET_URL}"
          title="Stockbee Market Breadth"
          loading="lazy"
        ></iframe>
      </article>
    </section>
  `;
}
function formatBriefingTimestamp(value) {
  if (!value) {
    return "-";
  }
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function formatBriefingPrice(item) {
  if (!item || !Number.isFinite(Number(item.price))) {
    return "-";
  }
  if (item.currency === "KRW") {
    return `₩${Number(item.price).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}`;
  }
  return formatUsStockPrice(item.price);
}

function formatMoverBriefingKorean(item) {
  if (!item) {
    return "";
  }
  const directionWord = Number(item.dayChangePct) >= 0 ? "상승" : "하락";
  const moveText = formatSignedPercent(item.dayChangePct);
  const sourceText = item.source ? `${item.source} 보도 기준` : "관련 뉴스 기준";
  if (item.headline) {
    return `${item.label}는 오늘 ${moveText} ${directionWord}했습니다. ${sourceText} 주요 재료는 "${item.headline}" 입니다.`;
  }
  return `${item.label}는 오늘 ${moveText} ${directionWord}했습니다. 아직 연결된 핵심 헤드라인을 찾지 못했습니다.`;
}

function formatSignedPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}%`;
}

function formatOneDecimal(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return Number(value).toFixed(1);
}

function formatSignedScore(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}`;
}

function formatBriefingIndexValue(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function getBriefingMapRangeMeta(rangeKey) {
  const fallback = { key: "1d", label: "1D" };
  const ranges = window.marketBriefingData?.mapRanges ?? [];
  return ranges.find((range) => range.key === rangeKey) ?? fallback;
}

function getBriefingOverviewReturn(item, rangeKey) {
  if (!item) {
    return null;
  }
  return item.overviewReturns?.[rangeKey] ?? item.dayChangePct ?? null;
}

function getBriefingIndexReturn(item, rangeKey) {
  if (!item) {
    return null;
  }
  const dates = item.dates ?? [];
  const values = item.values ?? [];
  if (!dates.length || !values.length) {
    return null;
  }

  const latestValue = Number(values.at(-1));
  if (!Number.isFinite(latestValue) || latestValue === 0) {
    return null;
  }

  if (rangeKey === "1d") {
    const previousValue = Number(values.at(-2));
    if (!Number.isFinite(previousValue) || previousValue === 0) {
      return null;
    }
    return ((latestValue - previousValue) / previousValue) * 100;
  }

  if (rangeKey === "ytd") {
    const latestDate = dates.at(-1);
    const latestYear = latestDate ? String(latestDate).slice(0, 4) : "";
    const yearStart = latestYear ? `${latestYear}-01-01` : "";
    let baseIndex = -1;
    dates.forEach((date, index) => {
      if (String(date) < yearStart && Number.isFinite(Number(values[index]))) {
        baseIndex = index;
      }
    });
    if (baseIndex < 0) {
      baseIndex = dates.findIndex((date, index) => String(date).slice(0, 4) === latestYear && Number.isFinite(Number(values[index])));
    }
    if (baseIndex < 0) {
      return null;
    }
    const baseValue = Number(values[baseIndex]);
    if (!Number.isFinite(baseValue) || baseValue === 0) {
      return null;
    }
    return ((latestValue - baseValue) / baseValue) * 100;
  }

  const periodMap = {
    "1w": 5,
    "2w": 10,
    "1m": 21,
    "3m": 63,
    "6m": 126,
    "1y": 252,
  };
  const periods = periodMap[rangeKey];
  if (!periods || values.length <= periods) {
    return null;
  }
  const baseValue = Number(values.at(-(periods + 1)));
  if (!Number.isFinite(baseValue) || baseValue === 0) {
    return null;
  }
  return ((latestValue - baseValue) / baseValue) * 100;
}

function getBriefingIndexAtrPercent(item) {
  if (!item?.values?.length) {
    return null;
  }
  const atrSeries = calculateAtrPercentSeries(
    item.values ?? [],
    item.highs ?? item.values ?? [],
    item.lows ?? item.values ?? [],
    21,
  );
  const latestAtr = atrSeries.at(-1);
  return Number.isFinite(Number(latestAtr)) ? Number(latestAtr) : null;
}

function getBriefingIndexCard(key) {
  return (window.marketBriefingData?.indexCards ?? []).find((item) => item.key === key) ?? null;
}

function getBriefingIndexCardReturn(card, fallbackItem, rangeKey) {
  const directValue = card?.returns?.[rangeKey];
  if (Number.isFinite(Number(directValue))) {
    return Number(directValue);
  }
  return getBriefingIndexReturn(fallbackItem, rangeKey);
}

function getBriefingIndexCardAtrPercent(card, fallbackItem) {
  const directValue = card?.atr21Pct;
  if (Number.isFinite(Number(directValue))) {
    return Number(directValue);
  }
  return getBriefingIndexAtrPercent(fallbackItem);
}

function formatBriefingAtrPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(2)}%`;
}

function getBriefingOverviewColor(item, rangeKey) {
  if (!item) {
    return "#f3f4f6";
  }
  const change = getBriefingOverviewReturn(item, rangeKey);
  if (!Number.isFinite(change)) {
    return "#eef0eb";
  }
  const magnitude = Math.min(Math.abs(change), 25);
  const strength = magnitude / 25;
  if (change > 0) {
    const lightness = 97 - strength * 18;
    const saturation = 48 + strength * 18;
    return `hsl(145, ${saturation}%, ${lightness}%)`;
  }
  if (change < 0) {
    const lightness = 97 - strength * 18;
    const saturation = 56 + strength * 16;
    return `hsl(6, ${saturation}%, ${lightness}%)`;
  }
  return "#eef0eb";
}

function getRotationScoreColor(score) {
  if (!Number.isFinite(Number(score))) {
    return "#eef0eb";
  }
  const numeric = Number(score);
  const magnitude = Math.min(Math.abs(numeric), 18);
  const strength = magnitude / 18;
  if (numeric > 0) {
    return `hsl(150, ${48 + strength * 22}%, ${95 - strength * 24}%)`;
  }
  if (numeric < 0) {
    return `hsl(8, ${56 + strength * 18}%, ${95 - strength * 22}%)`;
  }
  return "#eef0eb";
}

function getRotationClassLabel(classification) {
  const labels = {
    Leading: "Leading",
    Improving: "Improving",
    Weakening: "Weakening",
    Lagging: "Lagging",
  };
  return labels[classification] ?? "Neutral";
}

function getRotationClassRank(classification) {
  const ranks = {
    Lagging: 0,
    Weakening: 1,
    Improving: 2,
    Leading: 3,
  };
  return ranks[classification] ?? -1;
}

function getRotationClassKorean(classification) {
  const labels = {
    Leading: "주도",
    Improving: "개선",
    Weakening: "둔화",
    Lagging: "소외",
  };
  return labels[classification] ?? "중립";
}

function getRotationClassRule(classification) {
  const rules = {
    Leading: "1W > 0, 2W > 0, 1M > 0",
    Improving: "1W > 0, and not all Leading conditions",
    Weakening: "1W <= 0, 1M 또는 2W > 0",
    Lagging: "그 외",
  };
  return rules[classification] ?? "";
}

function getRotationHistoryShadeColor(classification) {
  const colors = {
    Leading: "rgba(19, 112, 71, 0.20)",
    Improving: "rgba(22, 163, 74, 0.10)",
    Weakening: "rgba(248, 113, 113, 0.12)",
    Lagging: "rgba(180, 35, 24, 0.18)",
  };
  return colors[classification] ?? "rgba(107, 114, 128, 0.08)";
}

function getRotationHistoryBorderColor(classification) {
  const colors = {
    Leading: "#137047",
    Improving: "#16a34a",
    Weakening: "#ef4444",
    Lagging: "#b42318",
  };
  return colors[classification] ?? "#6b7280";
}

function getSignedValueClass(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }
  if (numeric > 0) {
    return "is-positive";
  }
  if (numeric < 0) {
    return "is-negative";
  }
  return "";
}

function renderRotationCandidateList(items, emptyText) {
  if (!items?.length) {
    return `<p class="market-rs-empty">${emptyText}</p>`;
  }
  return items
    .map(
      (item) => `
        <article class="briefing-rotation-name">
          <div>
            <strong>${item.label}</strong>
            <span>${item.sectorLabel}</span>
          </div>
          <div class="briefing-rotation-name-stats">
            <b class="${getSignedValueClass(item.score)}">Score ${formatSignedScore(item.score)}</b>
            <span class="${getSignedValueClass(item.excessReturns?.["1w"])}">1W vs QQQ ${formatSignedPercent(item.excessReturns?.["1w"])}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function createBriefingRotationHistoryChart(canvas, sector, history) {
  if (typeof Chart === "undefined" || !canvas || !history?.length) {
    return;
  }
  const labels = history.map((item) => item.date);
  const values = history.map((item) => (Number.isFinite(Number(item.score)) ? Number(item.score) : null));
  const finiteValues = values.filter((value) => Number.isFinite(value));
  const minValue = finiteValues.length ? Math.min(...finiteValues, 0) : -5;
  const maxValue = finiteValues.length ? Math.max(...finiteValues, 0) : 5;
  const spread = Math.max(maxValue - minValue, 4);
  const tickIndexes = getMacroTickIndexes(labels, "1y", canvas.clientWidth ?? 0);
  const tickSet = new Set(tickIndexes);
  const bandsPlugin = {
    id: `briefingRotationBands-${sector?.key ?? "selected"}`,
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const xScale = scales.x;
      if (!chartArea || !xScale) {
        return;
      }
      ctx.save();
      history.forEach((item, index) => {
        const center = xScale.getPixelForValue(index);
        const previousCenter = index > 0 ? xScale.getPixelForValue(index - 1) : chartArea.left;
        const nextCenter = index < history.length - 1 ? xScale.getPixelForValue(index + 1) : chartArea.right;
        const left = index > 0 ? (previousCenter + center) / 2 : chartArea.left;
        const right = index < history.length - 1 ? (center + nextCenter) / 2 : chartArea.right;
        ctx.fillStyle = getRotationHistoryShadeColor(item.classification);
        ctx.fillRect(left, chartArea.top, Math.max(right - left, 1), chartArea.bottom - chartArea.top);
      });
      ctx.restore();
    },
  };

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${sector?.label ?? "Sector"} score`,
          data: values,
          borderColor: getRotationHistoryBorderColor(sector?.classification),
          backgroundColor: getRotationHistoryBorderColor(sector?.classification),
          borderWidth: 2.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10,
          tension: 0.22,
          spanGaps: true,
          segment: {
            borderColor: (context) => getRotationHistoryBorderColor(
              history[context.p1DataIndex]?.classification
                ?? history[context.p0DataIndex]?.classification
                ?? sector?.classification,
            ),
          },
        },
        {
          label: "Zero line",
          data: labels.map(() => 0),
          borderColor: "rgba(31, 41, 55, 0.34)",
          borderDash: [5, 5],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    plugins: [bandsPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              const point = items?.[0];
              const date = history[point?.dataIndex]?.date ?? point?.label;
              return formatFullIsoDate(date);
            },
            label: (context) => {
              if (context.datasetIndex === 1) {
                return "Zero line";
              }
              const item = history[context.dataIndex] ?? {};
              return [
                `Score ${formatSignedScore(context.parsed.y)}`,
                `${getRotationClassLabel(item.classification)} / ${getRotationClassKorean(item.classification)}`,
                `1W ${formatSignedPercent(item.excessReturns?.["1w"])}`,
                `1M ${formatSignedPercent(item.excessReturns?.["1m"])}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(labels[value], "1y") : ""),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: minValue - spread * 0.14,
          max: maxValue + spread * 0.14,
          ticks: {
            color: "#8d8d86",
            callback: (value) => formatSignedScore(value),
            maxTicksLimit: 6,
          },
          title: { display: true, text: "Rotation Score", color: "#8d8d86" },
          grid: { color: "rgba(70, 70, 66, 0.12)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function calculatePearsonCorrelation(leftValues, rightValues) {
  const pairs = leftValues
    .map((left, index) => [Number(left), Number(rightValues[index])])
    .filter(([left, right]) => Number.isFinite(left) && Number.isFinite(right));
  if (pairs.length < 10) {
    return null;
  }
  const leftMean = pairs.reduce((sum, [left]) => sum + left, 0) / pairs.length;
  const rightMean = pairs.reduce((sum, [, right]) => sum + right, 0) / pairs.length;
  let numerator = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  pairs.forEach(([left, right]) => {
    const leftDelta = left - leftMean;
    const rightDelta = right - rightMean;
    numerator += leftDelta * rightDelta;
    leftVariance += leftDelta ** 2;
    rightVariance += rightDelta ** 2;
  });
  const denominator = Math.sqrt(leftVariance * rightVariance);
  if (!denominator) {
    return null;
  }
  return numerator / denominator;
}

function getBriefingDistributionBenchmarkMeta(benchmarkKey = state.briefingRotationDistributionBenchmark) {
  return (
    BRIEFING_ROTATION_DISTRIBUTION_BENCHMARKS.find((item) => item.key === benchmarkKey) ??
    BRIEFING_ROTATION_DISTRIBUTION_BENCHMARKS[0]
  );
}

function getBriefingDistributionXAxisMeta(axisKey = state.briefingRotationDistributionXAxis) {
  return (
    BRIEFING_ROTATION_DISTRIBUTION_X_AXES.find((item) => item.key === axisKey) ??
    BRIEFING_ROTATION_DISTRIBUTION_X_AXES[0]
  );
}

function getBriefingDistributionCorrWindowMeta(windowKey = state.briefingRotationDistributionCorrWindow) {
  return (
    BRIEFING_ROTATION_DISTRIBUTION_CORR_WINDOWS.find((item) => item.key === windowKey) ??
    BRIEFING_ROTATION_DISTRIBUTION_CORR_WINDOWS.at(-1)
  );
}

function getBriefingIndexDailyReturnsByDate(itemKey) {
  const item = window.marketPriceData?.items?.[itemKey];
  const dates = item?.dates ?? [];
  const values = item?.values ?? [];
  const returns = new Map();
  for (let index = 1; index < dates.length; index += 1) {
    const current = Number(values[index]);
    const previous = Number(values[index - 1]);
    if (!dates[index] || !Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
      continue;
    }
    returns.set(dates[index], ((current / previous) - 1) * 100);
  }
  return returns;
}

function getBriefingIndexPeriodReturn(itemKey, periodKey) {
  const period = BRIEFING_ROTATION_DISTRIBUTION_PERIODS[periodKey];
  if (!period) {
    return null;
  }
  const item = window.marketPriceData?.items?.[itemKey];
  const values = item?.values ?? [];
  const finiteValues = values.map(Number).filter(Number.isFinite);
  if (finiteValues.length <= period) {
    return null;
  }
  const current = finiteValues.at(-1);
  const base = finiteValues.at(-(period + 1));
  if (!Number.isFinite(current) || !Number.isFinite(base) || base === 0) {
    return null;
  }
  return ((current / base) - 1) * 100;
}

function getBriefingSectorMixedReturnFromPanels(sectorKey, periodKey) {
  const sector = (window.marketBriefingData?.sectorPanels ?? []).find((panel) => panel.key === sectorKey);
  const items = sector?.items ?? [];
  const values = [];
  let weightedSum = 0;
  let weightSum = 0;
  items.forEach((item) => {
    const value = Number(item?.overviewReturns?.[periodKey] ?? item?.returns?.[periodKey]);
    if (!Number.isFinite(value)) {
      return;
    }
    const weight = Number(item?.marketCapUsd ?? item?.marketCap);
    if (Number.isFinite(weight) && weight > 0) {
      weightedSum += value * weight;
      weightSum += weight;
    }
    values.push(value);
  });
  if (!values.length) {
    return null;
  }
  const equalWeighted = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (weightSum > 0) {
    return (weightedSum / weightSum) * 0.5 + equalWeighted * 0.5;
  }
  return equalWeighted;
}

function getBriefingSectorDistributionReturn(sector, periodKey) {
  const directValue = Number(sector?.returns?.[periodKey]);
  if (Number.isFinite(directValue)) {
    return directValue;
  }
  return getBriefingSectorMixedReturnFromPanels(sector?.key, periodKey);
}

function getBriefingRotationDistributionXValue(sector, benchmarkMeta, xAxisMeta) {
  if (xAxisMeta.kind === "score") {
    const score = Number(sector?.score);
    return Number.isFinite(score) ? score : null;
  }
  const sectorReturn = getBriefingSectorDistributionReturn(sector, xAxisMeta.key);
  const benchmarkReturn = getBriefingIndexPeriodReturn(benchmarkMeta.itemKey, xAxisMeta.key);
  if (!Number.isFinite(sectorReturn) || !Number.isFinite(benchmarkReturn)) {
    return null;
  }
  return sectorReturn - benchmarkReturn;
}

function buildBriefingRotationDistribution(
  sectors,
  historyBySector,
  benchmarkKey = state.briefingRotationDistributionBenchmark,
  xAxisKey = state.briefingRotationDistributionXAxis,
  corrWindowKey = state.briefingRotationDistributionCorrWindow,
) {
  const benchmarkMeta = getBriefingDistributionBenchmarkMeta(benchmarkKey);
  const xAxisMeta = getBriefingDistributionXAxisMeta(xAxisKey);
  const corrWindowMeta = getBriefingDistributionCorrWindowMeta(corrWindowKey);
  const qqqReturnsByDate = getBriefingIndexDailyReturnsByDate("nasdaq100");
  const benchmarkReturnsByDate = getBriefingIndexDailyReturnsByDate(benchmarkMeta.itemKey);
  const seenSectorKeys = new Set();
  const rawPoints = (sectors ?? [])
    .map((sector) => {
      if (!sector?.key || seenSectorKeys.has(sector.key)) {
        return null;
      }
      seenSectorKeys.add(sector.key);
      const history = (historyBySector?.[sector.key] ?? []).slice(-corrWindowMeta.sessions);
      const sectorReturns = [];
      const benchmarkReturns = [];
      history.forEach((item) => {
        const benchmarkReturn = benchmarkReturnsByDate.get(item.date);
        let sectorReturn = Number(item.returns?.["1d"]);
        if (!Number.isFinite(sectorReturn)) {
          const qqqReturn = qqqReturnsByDate.get(item.date);
          const excessReturn = Number(item.excessReturns?.["1d"]);
          sectorReturn = Number.isFinite(qqqReturn) && Number.isFinite(excessReturn) ? qqqReturn + excessReturn : NaN;
        }
        if (!Number.isFinite(sectorReturn) || !Number.isFinite(benchmarkReturn)) {
          return;
        }
        benchmarkReturns.push(benchmarkReturn);
        sectorReturns.push(sectorReturn);
      });
      const correlation = calculatePearsonCorrelation(sectorReturns, benchmarkReturns);
      if (!Number.isFinite(correlation)) {
        return null;
      }
      const sectorPeriodReturn =
        xAxisMeta.kind === "return" ? getBriefingSectorDistributionReturn(sector, xAxisMeta.key) : null;
      const xValue = getBriefingRotationDistributionXValue(sector, benchmarkMeta, xAxisMeta);
      if (!Number.isFinite(xValue)) {
        return null;
      }
      const score = Number(sector.score);
      const rawCorrelationPct = correlation * 100;
      return {
        x: xValue,
        y: Math.max(rawCorrelationPct, -25),
        key: sector.key,
        label: sector.label,
        classification: sector.classification,
        score: Number.isFinite(score) ? score : null,
        xValue,
        xAxisKey: xAxisMeta.key,
        xAxisKind: xAxisMeta.kind,
        xAxisLabel: xAxisMeta.label,
        sampleSize: sectorReturns.length,
        correlation,
        rawCorrelationPct,
        corrWindowKey: corrWindowMeta.key,
        corrWindowLabel: corrWindowMeta.label,
        corrWindowSessions: corrWindowMeta.sessions,
        benchmarkLabel: benchmarkMeta.label,
        benchmarkReturn:
          xAxisMeta.kind === "return"
            ? getBriefingIndexPeriodReturn(benchmarkMeta.itemKey, xAxisMeta.key)
            : null,
        sectorPeriodReturn,
        excessReturns: sector.excessReturns ?? {},
        returns: sector.returns ?? {},
      };
    })
    .filter(Boolean);
  const occupiedBuckets = new Map();
  const points = rawPoints.map((point) => {
    const bucketKey = `${Math.round(point.x * 10)}|${Math.round(point.y * 2)}`;
    const bucketCount = occupiedBuckets.get(bucketKey) ?? 0;
    occupiedBuckets.set(bucketKey, bucketCount + 1);
    if (!bucketCount) {
      return point;
    }
    const offsetDirection = bucketCount % 2 === 0 ? 1 : -1;
    const offsetMagnitude = Math.ceil(bucketCount / 2);
    return {
      ...point,
      x: point.x + offsetDirection * offsetMagnitude * 0.16,
      y: Math.min(100, Math.max(-25, point.y + offsetDirection * offsetMagnitude * 2.2)),
      isJittered: true,
    };
  });

  const scores = points.map((point) => point.x).filter(Number.isFinite);
  const minScore = scores.length ? Math.min(...scores, -2) : -6;
  const maxScore = scores.length ? Math.max(...scores, 2) : 6;
  const scoreSpread = Math.max(maxScore - minScore, 4);
  return {
    points,
    xMin: minScore - scoreSpread * 0.16,
    xMax: maxScore + scoreSpread * 0.16,
    benchmark: benchmarkMeta,
    xAxis: xAxisMeta,
    corrWindow: corrWindowMeta,
  };
}

function createBriefingRotationDistributionChart(canvas, distribution) {
  if (typeof Chart === "undefined" || !canvas || !distribution?.points?.length) {
    return;
  }
  const getDistributionLabel = (raw) => {
    const label = String(raw?.label ?? "");
    const cleaned = label.replace(/\s*\([^)]*\)\s*/g, "").trim();
    if (cleaned.length <= 8) {
      return cleaned;
    }
    return `${cleaned.slice(0, 8)}…`;
  };
  const getDistributionPointRadius = (raw) => {
    const value = Math.abs(Number(raw?.x));
    if (!Number.isFinite(value)) {
      return 6;
    }
    return Math.max(5, Math.min(10, 5 + value / 2.8));
  };
  const labelPlugin = {
    id: "briefingRotationDistributionLabels",
    afterDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      const dataset = chart.data.datasets?.[0];
      const meta = chart.getDatasetMeta(0);
      if (!chartArea || !dataset || !meta?.data?.length) {
        return;
      }
      const occupiedRects = [];
      const pointObstacles = meta.data
        .map((element, index) => {
          const raw = dataset.data[index];
          if (!element || !raw) {
            return null;
          }
          const radius = getDistributionPointRadius(raw) + 7;
          return {
            left: element.x - radius,
            right: element.x + radius,
            top: element.y - radius,
            bottom: element.y + radius,
          };
        })
        .filter(Boolean);
      const candidates = [
        { x: 0, y: 24, align: "center" },
        { x: 0, y: -24, align: "center" },
        { x: 32, y: 0, align: "left" },
        { x: -32, y: 0, align: "right" },
        { x: 30, y: 22, align: "left" },
        { x: -30, y: 22, align: "right" },
        { x: 30, y: -22, align: "left" },
        { x: -30, y: -22, align: "right" },
        { x: 0, y: 42, align: "center" },
        { x: 0, y: -42, align: "center" },
        { x: 46, y: 16, align: "left" },
        { x: -46, y: 16, align: "right" },
        { x: 46, y: -16, align: "left" },
        { x: -46, y: -16, align: "right" },
        { x: 62, y: 0, align: "left" },
        { x: -62, y: 0, align: "right" },
        { x: 62, y: 32, align: "left" },
        { x: -62, y: 32, align: "right" },
        { x: 62, y: -32, align: "left" },
        { x: -62, y: -32, align: "right" },
        { x: 0, y: 60, align: "center" },
        { x: 0, y: -60, align: "center" },
      ];
      const orderedElements = meta.data
        .map((element, index) => ({ element, raw: dataset.data[index], index }))
        .filter((item) => item.element && item.raw)
        .sort((a, b) => Number(b.raw.x ?? 0) - Number(a.raw.x ?? 0));
      const rectIntersects = (rect, other) =>
        rect.left < other.right &&
        rect.right > other.left &&
        rect.top < other.bottom &&
        rect.bottom > other.top;
      const countIntersections = (rect, rects) =>
        rects.reduce((count, other) => count + (rectIntersects(rect, other) ? 1 : 0), 0);
      const clampRect = (rect) => ({
        ...rect,
        outside:
          rect.left < chartArea.left + 4 ||
          rect.right > chartArea.right - 4 ||
          rect.top < chartArea.top + 4 ||
          rect.bottom > chartArea.bottom - 4,
      });
      ctx.save();
      ctx.font = "700 10px Inter, sans-serif";
      ctx.textBaseline = "middle";
      orderedElements.forEach(({ element, raw }) => {
        const label = getDistributionLabel(raw);
        if (!label) {
          return;
        }
        const pointX = element.x;
        const pointY = element.y;
        const textWidth = Math.min(74, ctx.measureText(label).width);
        const pillWidth = textWidth + 12;
        const pillHeight = 17;
        let best = null;
        candidates.forEach((candidate, candidateIndex) => {
          const centerX =
            candidate.align === "left"
              ? pointX + candidate.x + pillWidth / 2
              : candidate.align === "right"
                ? pointX + candidate.x - pillWidth / 2
                : pointX + candidate.x;
          const centerY = pointY + candidate.y;
          const unclampedLeft = centerX - pillWidth / 2;
          const unclampedTop = centerY - pillHeight / 2;
          const adjustedLeft = Math.max(chartArea.left + 4, Math.min(unclampedLeft, chartArea.right - pillWidth - 4));
          const adjustedTop = Math.max(chartArea.top + 4, Math.min(unclampedTop, chartArea.bottom - pillHeight - 4));
          const rect = clampRect({
            left: adjustedLeft,
            right: adjustedLeft + pillWidth,
            top: adjustedTop,
            bottom: adjustedTop + pillHeight,
            centerX,
            centerY,
            candidate,
            wasShifted: Math.abs(adjustedLeft - unclampedLeft) > 0.5 || Math.abs(adjustedTop - unclampedTop) > 0.5,
          });
          const labelOverlapPenalty = countIntersections(rect, occupiedRects) * 6000;
          const bubbleOverlapPenalty = countIntersections(rect, pointObstacles) * 4500;
          const outsidePenalty = rect.outside || rect.wasShifted ? 500 : 0;
          const score =
            labelOverlapPenalty +
            bubbleOverlapPenalty +
            outsidePenalty +
            candidateIndex * 4 +
            Math.abs(candidate.y) +
            Math.abs(candidate.x) * 0.35;
          if (!best || score < best.score) {
            best = { ...rect, score };
          }
        });
        if (!best) {
          return;
        }
        const rect = {
          left: best.left,
          right: best.right,
          top: best.top,
          bottom: best.bottom,
          centerX: best.left + pillWidth / 2,
          centerY: best.top + pillHeight / 2,
        };
        occupiedRects.push(rect);
        const needsLeader = Math.hypot(rect.centerX - pointX, rect.centerY - pointY) > 19;
        if (needsLeader) {
          ctx.strokeStyle = "rgba(75, 85, 99, 0.42)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(pointX, pointY);
          ctx.lineTo(rect.centerX, rect.centerY);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.strokeStyle = getRotationHistoryBorderColor(raw.classification);
        ctx.lineWidth = 0.8;
        if (typeof ctx.roundRect === "function") {
          ctx.beginPath();
          ctx.roundRect(rect.left, rect.top, pillWidth, pillHeight, 8);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(rect.left, rect.top, pillWidth, pillHeight);
          ctx.strokeRect(rect.left, rect.top, pillWidth, pillHeight);
        }
        ctx.fillStyle = "#1f2937";
        ctx.textAlign = "center";
        ctx.fillText(label, rect.centerX, rect.centerY + 0.5, pillWidth - 8);
      });
      ctx.restore();
    },
  };
  const alignmentPlugin = {
    id: "briefingRotationDistributionGuides",
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea || !scales.x || !scales.y) {
        return;
      }
      ctx.save();
      const zeroX = scales.x.getPixelForValue(0);
      const negativeZoneRight = Math.max(chartArea.left, Math.min(zeroX, chartArea.right));
      const positiveZoneLeft = Math.max(chartArea.left, Math.min(zeroX, chartArea.right));
      if (negativeZoneRight > chartArea.left) {
        ctx.fillStyle = "rgba(248, 113, 113, 0.075)";
        ctx.fillRect(chartArea.left, chartArea.top, negativeZoneRight - chartArea.left, chartArea.bottom - chartArea.top);
      }
      if (positiveZoneLeft < chartArea.right) {
        ctx.fillStyle = "rgba(22, 163, 74, 0.075)";
        ctx.fillRect(positiveZoneLeft, chartArea.top, chartArea.right - positiveZoneLeft, chartArea.bottom - chartArea.top);
      }
      if (zeroX >= chartArea.left && zeroX <= chartArea.right) {
        ctx.strokeStyle = "rgba(31, 41, 55, 0.40)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(zeroX, chartArea.top);
        ctx.lineTo(zeroX, chartArea.bottom);
        ctx.stroke();
      }
      const zeroY = scales.y.getPixelForValue(0);
      if (zeroY >= chartArea.top && zeroY <= chartArea.bottom) {
        ctx.strokeStyle = "rgba(31, 41, 55, 0.22)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, zeroY);
        ctx.lineTo(chartArea.right, zeroY);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(31, 41, 55, 0.34)";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      ctx.moveTo(chartArea.left, chartArea.bottom);
      ctx.lineTo(chartArea.right, chartArea.top);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(31, 41, 55, 0.62)";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.textAlign = "right";
      const guideLabel =
        distribution.xAxis?.kind === "score"
          ? `Score-${distribution.benchmark?.label ?? "QQQ"} alignment`
          : `${distribution.xAxis?.label ?? ""} rel return-${distribution.benchmark?.label ?? "QQQ"} alignment`;
      ctx.fillText(guideLabel, chartArea.right - 4, chartArea.top + 14);
      ctx.restore();
    },
  };

  const chart = new Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Rotation sectors",
          data: distribution.points,
          borderColor: (context) => getRotationHistoryBorderColor(context.raw?.classification),
          backgroundColor: (context) => getRotationHistoryShadeColor(context.raw?.classification),
          borderWidth: 1.7,
          pointRadius: (context) => getDistributionPointRadius(context.raw),
          pointHoverRadius: (context) => getDistributionPointRadius(context.raw) + 2,
          pointHitRadius: (context) => getDistributionPointRadius(context.raw) + 2,
        },
      ],
    },
    plugins: [alignmentPlugin, labelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      interaction: { mode: "nearest", intersect: true },
      hover: { mode: "nearest", intersect: true },
      onClick: (_event, elements) => {
        const point = elements?.[0];
        const raw = point ? chart.data.datasets[point.datasetIndex]?.data?.[point.index] : null;
        if (!raw?.key) {
          return;
        }
        state.briefingRotationSectorKey = raw.key;
        render();
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.raw?.label ?? "",
            label: (context) => {
              const item = context.raw ?? {};
              const xAxisMeta = distribution.xAxis ?? getBriefingDistributionXAxisMeta();
              const lines = [
                `${xAxisMeta.kind === "score" ? "Score" : `${xAxisMeta.label} vs ${item.benchmarkLabel ?? distribution.benchmark?.label ?? "QQQ"}`} ${xAxisMeta.kind === "score" ? formatSignedScore(item.x) : formatSignedPercent(item.x)}`,
                `${item.benchmarkLabel ?? distribution.benchmark?.label ?? "QQQ"} ${item.corrWindowLabel ?? distribution.corrWindow?.label ?? "3M"} corr ${formatOneDecimal(Number(item.rawCorrelationPct))}% (${item.sampleSize} sessions)`,
                `${getRotationClassLabel(item.classification)} / ${getRotationClassKorean(item.classification)}`,
              ];
              if (xAxisMeta.kind === "return") {
                lines.push(`Rotation Score ${formatSignedScore(item.score)}`);
                lines.push(`Sector ${item.xAxisLabel ?? ""} ${formatSignedPercent(item.sectorPeriodReturn)}`);
                lines.push(`Benchmark ${item.xAxisLabel ?? ""} ${formatSignedPercent(item.benchmarkReturn)}`);
              } else {
                ["1w", "1m"].forEach((periodKey) => {
                  const sectorReturn = Number(item.returns?.[periodKey]);
                  const benchmarkReturn = getBriefingIndexPeriodReturn(distribution.benchmark?.itemKey, periodKey);
                  const relativeReturn =
                    Number.isFinite(sectorReturn) && Number.isFinite(benchmarkReturn)
                      ? sectorReturn - benchmarkReturn
                      : null;
                  lines.push(`${periodKey.toUpperCase()} vs ${item.benchmarkLabel ?? distribution.benchmark?.label ?? "QQQ"} ${formatSignedPercent(relativeReturn)}`);
                });
              }
              return lines;
            },
          },
        },
      },
      scales: {
        x: {
          min: distribution.xMin,
          max: distribution.xMax,
          title: {
            display: true,
            text:
              distribution.xAxis?.kind === "score"
                ? "Rotation Score"
                : `${distribution.xAxis?.title ?? "Relative return"} vs ${distribution.benchmark?.label ?? "QQQ"}`,
            color: "#6b6b64",
          },
          ticks: {
            color: "#8d8d86",
            callback: (value) =>
              distribution.xAxis?.kind === "score" ? formatSignedScore(value) : formatSignedPercent(value),
            maxTicksLimit: 7,
          },
          grid: { color: "rgba(70, 70, 66, 0.12)" },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: -25,
          max: 100,
          title: {
            display: true,
            text: `${distribution.corrWindow?.label ?? "3M"} correlation with ${distribution.benchmark?.label ?? "QQQ"}`,
            color: "#6b6b64",
          },
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${Math.round(value)}%`,
            maxTicksLimit: 7,
          },
          grid: { color: "rgba(70, 70, 66, 0.12)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function getBriefingOverviewSizeClass(items, item) {
  if (!item) {
    return "cap-sm";
  }
  const maxCap = Math.max(...(items ?? []).map((entry) => Number(entry.marketCapUsd) || 0), 0);
  const itemCap = Number(item.marketCapUsd) || 0;
  if (maxCap <= 0 || itemCap <= 0) {
    return "cap-sm";
  }
  const ratio = itemCap / maxCap;
  if (ratio >= 0.5) {
    return "cap-xl";
  }
  if (ratio >= 0.18) {
    return "cap-lg";
  }
  if (ratio >= 0.06) {
    return "cap-md";
  }
  return "cap-sm";
}

function getBriefingSectorSizeClass(sectors, sector) {
  const totals = (sectors ?? []).map(
    (entry) => (entry.items ?? []).reduce((sum, item) => sum + (Number(item.marketCapUsd) || 0), 0),
  );
  const maxTotal = Math.max(...totals, 0);
  const sectorTotal = (sector?.items ?? []).reduce((sum, item) => sum + (Number(item.marketCapUsd) || 0), 0);
  if (maxTotal <= 0 || sectorTotal <= 0) {
    return "sector-sm";
  }
  const ratio = sectorTotal / maxTotal;
  if (ratio >= 0.7) {
    return "sector-xl";
  }
  if (ratio >= 0.35) {
    return "sector-lg";
  }
  if (ratio >= 0.14) {
    return "sector-md";
  }
  return "sector-sm";
}

function getBriefingOverviewTileSpan(sizeClass) {
  switch (sizeClass) {
    case "cap-xl":
      return { cols: 6, rows: 4, area: 24 };
    case "cap-lg":
      return { cols: 4, rows: 3, area: 12 };
    case "cap-md":
      return { cols: 3, rows: 2, area: 6 };
    default:
      return { cols: 2, rows: 2, area: 4 };
  }
}

function getBriefingSectorLayout(sectors, sector) {
  return { sizeClass: "sector-uniform", cols: 3 };
}

function getMarketRsRowByTicker(ticker) {
  const normalized = String(ticker ?? "").trim().toUpperCase();
  if (!normalized) {
    return null;
  }
  return (marketRsData.rows ?? []).find((row) => String(row.ticker ?? "").toUpperCase() === normalized) ?? null;
}

function getBriefingRsTicker(item) {
  const rawCandidates = [
    item?.ticker,
    String(item?.label ?? "").split(/\s+/)[0],
  ];
  const candidates = rawCandidates
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean)
    .flatMap((ticker) => [ticker, ticker.replace(".", "-")]);

  for (const ticker of candidates) {
    const row = getMarketRsRowByTicker(ticker);
    if (row) {
      return row.ticker;
    }
  }
  return "";
}

function getBriefingRsLinkAttrs(item) {
  const ticker = getBriefingRsTicker(item);
  if (!ticker) {
    return "";
  }
  return `data-briefing-rs-ticker="${ticker}" role="button" tabindex="0" aria-label="Open ${ticker} in RS"`;
}

function openMarketRsTicker(ticker) {
  const row = getMarketRsRowByTicker(ticker);
  if (!row) {
    return;
  }

  state.tab = "Screening";
  state.screeningView = "RS";
  state.rsUniverse = "all";
  state.rsFilter = "all";
  state.rsBriefingSector = "briefingAll";
  state.rsMarketCapRange = "all";
  state.rsCustomMarketCapMin = "";
  state.rsCustomMarketCapMax = "";
  state.rsSelectedTicker = row.ticker;
  state.query = row.ticker;
  if (searchInput) {
    searchInput.value = row.ticker;
  }

  render();
  requestAnimationFrame(() => {
    usOverviewRoot.querySelector(".market-rs-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderMarketBriefingOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const briefing = window.marketBriefingData ?? null;
  if (!briefing) {
    renderPlaceholderOverview("Daily Market Briefing", "브리핑 데이터가 아직 준비되지 않았습니다.");
    return;
  }

  const selectedBriefingRangeMeta = getBriefingMapRangeMeta(state.briefingMapRange);
  const briefingRangeChips = (briefing.mapRanges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="market-rs-chip briefing-range-chip${state.briefingMapRange === range.key ? " active" : ""}"
          data-briefing-range="${range.key}"
        >${range.label}</button>
      `,
    )
    .join("");

  const sectorPanels = (briefing.sectorPanels ?? [])
    .map((sector) => {
      const tiles = (sector.items ?? [])
        .map((item) => {
          const changeClass = Number(item.dayChangePct) > 0 ? "is-up" : Number(item.dayChangePct) < 0 ? "is-down" : "";
          const rsLinkAttrs = getBriefingRsLinkAttrs(item);
          return `
            <article
              class="briefing-tile ${item.tileClass ?? "sm"} ${changeClass}${rsLinkAttrs ? " is-rs-linked" : ""}"
              style="background:${item.mapColor ?? "#f3f4f6"}"
              title="${item.name} / ${formatSignedPercent(item.dayChangePct)}"
              ${rsLinkAttrs}
            >
              <span class="briefing-tile-ticker">${item.label}</span>
              <strong class="briefing-tile-name">${item.name}</strong>
              <span class="briefing-tile-cap">${formatMarketCapCompact(item.marketCapUsd)}</span>
              <span class="briefing-tile-change">${formatSignedPercent(item.dayChangePct)}</span>
            </article>
          `;
        })
        .join("");

      return `
        <article class="us-panel briefing-sector-panel">
          <div class="us-section-head">
            <div>
              <h3>${sector.label}</h3>
              <p>${(sector.items ?? []).length} names</p>
            </div>
          </div>
          <div class="briefing-heatmap-grid">${tiles}</div>
        </article>
      `;
    })
    .join("");

  const combinedSectorMarkup = (briefing.sectorPanels ?? [])
    .map((sector) => {
      const sectorLayout = getBriefingSectorLayout(briefing.sectorPanels ?? [], sector);
      const sectorTiles = (sector.items ?? [])
        .slice()
        .sort((left, right) => (right.marketCapUsd ?? 0) - (left.marketCapUsd ?? 0))
        .map((item) => {
          const overviewChange = getBriefingOverviewReturn(item, state.briefingMapRange);
          const oneDayChange = getBriefingOverviewReturn(item, "1d");
          const oneWeekChange = getBriefingOverviewReturn(item, "1w");
          const oneMonthChange = getBriefingOverviewReturn(item, "1m");
          const changeClass = Number(overviewChange) > 0 ? "is-up" : Number(overviewChange) < 0 ? "is-down" : "";
          const sizeClass = getBriefingOverviewSizeClass(sector.items ?? [], item);
          const rsLinkAttrs = getBriefingRsLinkAttrs(item);
          return `
            <article
              class="briefing-tile briefing-tile-overview ${sizeClass} ${changeClass}${rsLinkAttrs ? " is-rs-linked" : ""}"
              style="background:${getBriefingOverviewColor(item, state.briefingMapRange)}"
              ${rsLinkAttrs}
            >
              <span class="briefing-tile-ticker">${item.label}</span>
              <span class="briefing-tile-change">${formatSignedPercent(overviewChange)}</span>
              <div class="briefing-tile-tooltip">
                <strong>${item.name}</strong>
                <span>${sector.label}</span>
                <div class="briefing-tooltip-grid">
                  <span>1D</span><b>${formatSignedPercent(oneDayChange)}</b>
                  <span>1W</span><b>${formatSignedPercent(oneWeekChange)}</b>
                  <span>1M</span><b>${formatSignedPercent(oneMonthChange)}</b>
                  <span>Price</span><b>${formatBriefingPrice(item)}</b>
                  <span>Market Cap</span><b>${formatMarketCapCompact(item.marketCapUsd)}</b>
                </div>
                <small>Color: ${selectedBriefingRangeMeta.label} ${formatSignedPercent(overviewChange)}</small>
              </div>
            </article>
          `;
        })
        .join("");

      return `
        <section
          class="briefing-total-sector-block ${sectorLayout.sizeClass}"
        >
          <div class="briefing-total-sector-head">
            <strong>${sector.label}</strong>
            <span>${(sector.items ?? []).length} names</span>
          </div>
          <div class="briefing-heatmap-grid briefing-heatmap-grid-total-sector">${sectorTiles}</div>
        </section>
      `;
    })
    .join("");

  const briefingIndexConfigs = [
    { key: "dowjones", label: "Dow Jones (DIA)" },
    { key: "sp500", label: "S&P 500 (SPY)" },
    { key: "nasdaq", label: "NASDAQ Composite" },
    { key: "nasdaq100", label: "NASDAQ 100 (QQQ)" },
    { key: "sox", label: "필라델피아 반도체 (SOX)" },
    { key: "russell2000", label: "Russell 2000 (IWM)" },
  ];

  const indexMarkup = briefingIndexConfigs
    .map(({ key, label }) => {
      const card = getBriefingIndexCard(key);
      const item = window.marketPriceData?.items?.[key];
      const latestValue = card?.price ?? item?.values?.at(-1);
      const latestDate = card?.updatedAt ?? item?.dates?.at(-1);
      const rangeReturn = getBriefingIndexCardReturn(card, item, state.briefingMapRange);
      const atr21Pct = getBriefingIndexCardAtrPercent(card, item);
      const fixedReturnMarkup = [
        { key: "1d", label: "1D" },
        { key: "1w", label: "1W" },
        { key: "1m", label: "1M" },
      ]
        .map((range) => {
          const value = getBriefingIndexCardReturn(card, item, range.key);
          return `
            <span class="briefing-index-return-pill">
              <small>${range.label}</small>
              <b class="${getSignedValueClass(value)}">${formatSignedPercent(value)}</b>
            </span>
          `;
        })
        .join("") + `
          <span class="briefing-index-return-pill briefing-index-return-pill-atr">
            <small>ATR21D</small>
            <b>${formatBriefingAtrPercent(atr21Pct)}</b>
          </span>
        `;
      const changeClass =
        Number(rangeReturn) > 0 ? "is-up" : Number(rangeReturn) < 0 ? "is-down" : "";

      return `
        <article class="briefing-index-card ${changeClass}">
          <div class="briefing-index-head">
            <span class="briefing-index-label">${label}</span>
            <span class="briefing-index-date">${formatShortIsoDate(latestDate)}</span>
          </div>
          <strong class="briefing-index-value">${formatBriefingIndexValue(latestValue)}</strong>
          <div class="briefing-index-change-row">
            <span class="briefing-index-change">${formatSignedPercent(rangeReturn)}</span>
            <span class="briefing-index-caption">${selectedBriefingRangeMeta.label} return</span>
          </div>
          <div class="briefing-index-return-grid">${fixedReturnMarkup}</div>
        </article>
      `;
    })
    .join("");
  const fedWatch = briefing.fedWatch ?? null;
  const fedWatchColumns = fedWatch?.columns ?? [];
  const fedWatchRows = fedWatch?.rows ?? [];
  const fedWatchSourceUpdated = fedWatch?.sourceUpdatedAt ? formatFullIsoDate(fedWatch.sourceUpdatedAt) : null;
  const fedWatchRefreshed = fedWatch?.refreshedAt ? formatFullIsoDate(fedWatch.refreshedAt) : null;
  const fedWatchMarkup = fedWatchRows.length
    ? `
      <div class="briefing-fedwatch-scroll">
        <table class="briefing-fedwatch-table">
          <thead>
            <tr>
              <th>Meeting</th>
              ${fedWatchColumns.map((column) => `<th>${column}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${fedWatchRows
              .map((row) => {
                const maxRange = row.maxRange;
                return `
                  <tr>
                    <th>${formatShortIsoDate(row.meetingDate)}</th>
                    ${(row.probabilities ?? [])
                      .map((value, index) => {
                        const range = fedWatchColumns[index];
                        return `<td class="${range === maxRange ? "is-max" : ""}">${formatOneDecimal(value)}%</td>`;
                      })
                      .join("")}
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `
    : '<p class="market-rs-empty">FedWatch data is not available.</p>';

  const rotationSignal = briefing.rotationSignal ?? {};
  const allRotationSectors = rotationSignal.sectors ?? [];
  const rotationSectors = allRotationSectors;
  const rotationHistory = rotationSignal.history ?? {};
  const selectedRotationSectorKey = allRotationSectors.some((sector) => sector.key === state.briefingRotationSectorKey)
    ? state.briefingRotationSectorKey
    : rotationSectors[0]?.key ?? allRotationSectors[0]?.key ?? "";
  state.briefingRotationSectorKey = selectedRotationSectorKey;
  const selectedRotationSector = allRotationSectors.find((sector) => sector.key === selectedRotationSectorKey) ?? rotationSectors[0] ?? null;
  const selectedRotationHistory = rotationHistory[selectedRotationSectorKey] ?? [];
  const rotationHistoryLatest = selectedRotationHistory.at(-1) ?? {};
  const selectedDistributionBenchmark = getBriefingDistributionBenchmarkMeta(state.briefingRotationDistributionBenchmark);
  state.briefingRotationDistributionBenchmark = selectedDistributionBenchmark.key;
  const selectedDistributionXAxis = getBriefingDistributionXAxisMeta(state.briefingRotationDistributionXAxis);
  state.briefingRotationDistributionXAxis = selectedDistributionXAxis.key;
  const selectedDistributionCorrWindow = getBriefingDistributionCorrWindowMeta(state.briefingRotationDistributionCorrWindow);
  state.briefingRotationDistributionCorrWindow = selectedDistributionCorrWindow.key;
  const rotationDistribution = buildBriefingRotationDistribution(
    allRotationSectors,
    rotationHistory,
    selectedDistributionBenchmark.key,
    selectedDistributionXAxis.key,
    selectedDistributionCorrWindow.key,
  );
  const highBenchmarkCouplingCount = rotationDistribution.points.filter((point) => point.correlation >= 0.65).length;
  const independentLeaderCount = rotationDistribution.points.filter((point) => point.x > 0 && point.correlation < 0.35).length;
  const averageBenchmarkCorrelation = rotationDistribution.points.length
    ? rotationDistribution.points.reduce((sum, point) => sum + point.correlation, 0) / rotationDistribution.points.length
    : null;
  const distributionBenchmarkControls = BRIEFING_ROTATION_DISTRIBUTION_BENCHMARKS.map(
    (benchmark) => `
      <button
        type="button"
        class="briefing-rotation-distribution-benchmark${selectedDistributionBenchmark.key === benchmark.key ? " active" : ""}"
        data-briefing-rotation-distribution-benchmark="${benchmark.key}"
      >
        ${benchmark.label}
      </button>
    `,
  ).join("");
  const distributionXAxisControls = BRIEFING_ROTATION_DISTRIBUTION_X_AXES.map(
    (axis) => `
      <button
        type="button"
        class="briefing-rotation-distribution-benchmark${selectedDistributionXAxis.key === axis.key ? " active" : ""}"
        data-briefing-rotation-distribution-x-axis="${axis.key}"
      >
        ${axis.label}
      </button>
    `,
  ).join("");
  const distributionCorrWindowControls = BRIEFING_ROTATION_DISTRIBUTION_CORR_WINDOWS.map(
    (windowMeta) => `
      <button
        type="button"
        class="briefing-rotation-distribution-benchmark${selectedDistributionCorrWindow.key === windowMeta.key ? " active" : ""}"
        data-briefing-rotation-distribution-corr-window="${windowMeta.key}"
      >
        ${windowMeta.label}
      </button>
    `,
  ).join("");
  const distributionXAxisDescription =
    selectedDistributionXAxis.kind === "score"
      ? `X축은 기존 가중 Rotation Score입니다. Score = QQQ 대비 초과수익률 가중합이며 섹터 수익률은 시총가중 50% + 동일가중 50% 혼합입니다.`
      : `X축은 ${selectedDistributionXAxis.label} 섹터 혼합수익률에서 ${selectedDistributionBenchmark.label} ${selectedDistributionXAxis.label} 수익률을 뺀 초과수익률입니다.`;
  const distributionXAxisLabel =
    selectedDistributionXAxis.kind === "score"
      ? "Rotation Score"
      : `${selectedDistributionXAxis.label} vs ${selectedDistributionBenchmark.label}`;
  const distributionMetricDescription =
    selectedDistributionXAxis.kind === "score"
      ? "Score 선택 시 가로축은 자체 로테이션 점수입니다. 1W~6M 선택 시 가로축은 선택 지수 대비 해당 기간 초과수익률입니다."
      : `${selectedDistributionXAxis.label} 선택 중입니다. 가로축 0%보다 오른쪽이면 해당 기간에 ${selectedDistributionBenchmark.label}보다 강했다는 뜻입니다.`;
  const rotationDistributionMarkup = rotationDistribution.points.length
    ? `
      <article class="briefing-rotation-distribution-panel">
        <div class="briefing-rotation-distribution-head">
          <div>
            <strong>Rotation Score Distribution</strong>
            <span>${distributionXAxisDescription} Y축은 ${selectedDistributionCorrWindow.label}=${selectedDistributionCorrWindow.sessions}거래일 ${selectedDistributionBenchmark.label} 일간수익률 상관계수입니다. 점을 누르면 해당 섹터 히스토리로 이동합니다.</span>
          </div>
          <div class="briefing-rotation-distribution-side">
            <div class="briefing-rotation-distribution-control-block">
              <div class="briefing-rotation-distribution-control-label">
                <span>비교 지수</span>
                <em>Y축 상관계수와 기간별 초과수익률 기준</em>
              </div>
              <div class="briefing-rotation-distribution-controls">
                ${distributionBenchmarkControls}
              </div>
            </div>
            <div class="briefing-rotation-distribution-control-block">
              <div class="briefing-rotation-distribution-control-label">
                <span>상관기간</span>
                <em>섹터와 선택 지수의 일간수익률 동행성 측정 기간</em>
              </div>
              <div class="briefing-rotation-distribution-controls is-corr">
                ${distributionCorrWindowControls}
              </div>
            </div>
            <div class="briefing-rotation-distribution-control-block is-axis">
              <div class="briefing-rotation-distribution-control-label">
                <span>가로축</span>
                <em>Score 또는 기간별 상대성과 선택</em>
              </div>
              <div class="briefing-rotation-distribution-controls is-axis">
                ${distributionXAxisControls}
              </div>
            </div>
            <div class="briefing-rotation-distribution-stats">
              <span><b>${formatOneDecimal(Number(averageBenchmarkCorrelation) * 100)}%</b> avg corr</span>
              <span><b>${highBenchmarkCouplingCount}</b> ${selectedDistributionBenchmark.couplingLabel}</span>
              <span><b>${independentLeaderCount}</b> independent positives</span>
            </div>
          </div>
        </div>
        <div class="briefing-rotation-distribution-explainer">
          <span><b>비교 지수</b>${selectedDistributionBenchmark.description}</span>
          <span><b>상관기간</b>${selectedDistributionCorrWindow.description}</span>
          <span><b>가로축</b>${distributionMetricDescription}</span>
        </div>
        <div class="briefing-rotation-distribution-guide">
          <span><b>-100%</b> ${selectedDistributionBenchmark.label}와 반대로 움직인다는 뜻입니다. 방어/헤지 성격이 강하지만 지속성 확인이 필요합니다.</span>
          <span><b>0%</b> 같이 움직인 정도가 낮다는 뜻입니다. Rotation Score가 양수면 분산효과가 있는 주도 후보로 볼 수 있습니다.</span>
          <span><b>100%</b> ${selectedDistributionBenchmark.label}와 거의 같이 움직인다는 뜻입니다. 지수 베타가 높아 분산효과는 낮습니다.</span>
        </div>
        <div class="briefing-rotation-distribution-legend">
          <span><i class="is-leading"></i>주도</span>
          <span><i class="is-improving"></i>개선</span>
          <span><i class="is-weakening"></i>둔화</span>
          <span><i class="is-lagging"></i>소외</span>
          <em>배경색은 ${distributionXAxisLabel} 0 기준입니다. 붉은 영역은 음수, 초록 영역은 양수입니다. 대각선은 회귀선이 아니라 X축 방향과 ${selectedDistributionBenchmark.label} 연동성의 정렬 정도를 보는 시각 보조선입니다.</em>
        </div>
        <div class="briefing-rotation-distribution-chart-wrap">
          <canvas data-briefing-rotation-distribution></canvas>
        </div>
      </article>
    `
    : "";
  const rotationHistoryLegend = ["Leading", "Improving", "Weakening", "Lagging"]
    .map(
      (classification) => `
        <span class="briefing-rotation-history-legend-item">
          <i style="background:${getRotationHistoryShadeColor(classification)};border-color:${getRotationHistoryBorderColor(classification)}"></i>
          ${getRotationClassLabel(classification)}
        </span>
      `,
    )
    .join("");
  const rotationSectorMarkup = rotationSectors
    .map(
      (sector) => `
        <button
          type="button"
          class="briefing-rotation-sector is-${String(sector.classification ?? "neutral").toLowerCase()}${sector.key === selectedRotationSectorKey ? " active" : ""}"
          data-rotation-sector="${sector.key}"
        >
          <div class="briefing-rotation-sector-head">
            <strong>${sector.label}</strong>
            <span>${getRotationClassKorean(sector.classification)}</span>
          </div>
          <b class="${getSignedValueClass(sector.score)}">Score ${formatSignedScore(sector.score)}</b>
          <div class="briefing-rotation-sector-metrics">
            <span class="${getSignedValueClass(sector.excessReturns?.["1w"])}">1W ${formatSignedPercent(sector.excessReturns?.["1w"])}</span>
            <span class="${getSignedValueClass(sector.excessReturns?.["2w"])}">2W ${formatSignedPercent(sector.excessReturns?.["2w"])}</span>
            <span class="${getSignedValueClass(sector.excessReturns?.["1m"])}">1M ${formatSignedPercent(sector.excessReturns?.["1m"])}</span>
          </div>
        </button>
      `,
    )
    .join("");
  const rotationDailyLeaders = rotationSignal.dailyLeaders ?? [];
  const rotationDailyLeaderMarkup = rotationDailyLeaders
    .map((sector, index) => {
      const topNames = (sector.top ?? [])
        .map((item) => `${item.ticker} ${formatSignedPercent(item.returns?.["1d"] ?? item.overviewReturns?.["1d"] ?? item.excessReturns?.["1d"])}`)
        .join(" · ");
      return `
        <button
          type="button"
          class="briefing-daily-leader-card is-${String(sector.classification ?? "neutral").toLowerCase()}${sector.key === selectedRotationSectorKey ? " active" : ""}"
          data-rotation-sector="${sector.key}"
          data-rotation-scroll-history="true"
        >
          <span>#${index + 1}</span>
          <div>
            <strong>${sector.label}</strong>
            <small class="briefing-daily-stock-label">섹터 상위 종목 수익률</small>
            <small>${topNames || getRotationClassKorean(sector.classification)}</small>
          </div>
          <b class="${getSignedValueClass(sector.excessReturn1d)}">${formatSignedPercent(sector.excessReturn1d)} <em>(vs QQQ)</em></b>
        </button>
      `;
    })
    .join("");
  const rotationDailyLaggards = rotationSignal.dailyLaggards ?? [];
  const rotationDailyLaggardMarkup = rotationDailyLaggards
    .map((sector, index) => {
      const bottomNames = (sector.bottom ?? sector.top ?? [])
        .map((item) => `${item.ticker} ${formatSignedPercent(item.returns?.["1d"] ?? item.overviewReturns?.["1d"] ?? item.excessReturns?.["1d"])}`)
        .join(" · ");
      return `
        <button
          type="button"
          class="briefing-daily-leader-card is-${String(sector.classification ?? "neutral").toLowerCase()} is-laggard${sector.key === selectedRotationSectorKey ? " active" : ""}"
          data-rotation-sector="${sector.key}"
          data-rotation-scroll-history="true"
        >
          <span>#${index + 1}</span>
          <div>
            <strong>${sector.label}</strong>
            <small class="briefing-daily-stock-label">섹터 하위 종목 수익률</small>
            <small>${bottomNames || getRotationClassKorean(sector.classification)}</small>
          </div>
          <b class="${getSignedValueClass(sector.excessReturn1d)}">${formatSignedPercent(sector.excessReturn1d)} <em>(vs QQQ)</em></b>
        </button>
      `;
    })
    .join("");
  const rotationClassImprovers = allRotationSectors
    .map((sector) => {
      const history = rotationHistory[sector.key] ?? [];
      const previous = history.length >= 2 ? history[history.length - 2] : null;
      const latest = history.at(-1) ?? null;
      const fromRank = getRotationClassRank(previous?.classification);
      const toRank = getRotationClassRank(latest?.classification ?? sector.classification);
      return {
        ...sector,
        previousClassification: previous?.classification,
        latestClassification: latest?.classification ?? sector.classification,
        latestScore: latest?.score ?? sector.score,
        improvementSteps: toRank - fromRank,
        latestDate: latest?.date,
      };
    })
    .filter((sector) => sector.improvementSteps > 0)
    .sort((a, b) => {
      const stepDiff = Number(b.improvementSteps) - Number(a.improvementSteps);
      if (stepDiff !== 0) {
        return stepDiff;
      }
      const scoreA = Number.isFinite(Number(a.latestScore)) ? Number(a.latestScore) : -999;
      const scoreB = Number.isFinite(Number(b.latestScore)) ? Number(b.latestScore) : -999;
      return scoreB - scoreA;
    });
  const rotationClassImproverMarkup = rotationClassImprovers
    .map(
      (sector, index) => `
        <article class="briefing-rotation-improver-card is-${String(sector.latestClassification ?? "neutral").toLowerCase()}">
          <span>#${index + 1}</span>
          <div>
            <strong>${sector.label}</strong>
            <small>${getRotationClassKorean(sector.previousClassification)} -> ${getRotationClassKorean(sector.latestClassification)} · ${formatShortIsoDate(sector.latestDate)}</small>
          </div>
          <b class="${getSignedValueClass(sector.latestScore)}">${formatSignedScore(sector.latestScore)}</b>
        </article>
      `,
    )
    .join("");
  const rotationHistoryMarkup = selectedRotationSector && selectedRotationHistory.length
    ? `
      <article class="briefing-rotation-history-panel">
        <div class="briefing-rotation-history-head">
          <div>
            <strong>${selectedRotationSector.label}</strong>
            <span>${formatShortIsoDate(selectedRotationHistory[0]?.date)} - ${formatShortIsoDate(rotationHistoryLatest.date)}</span>
          </div>
          <div class="briefing-rotation-history-stats">
            <b class="${getSignedValueClass(rotationHistoryLatest.score)}">Score ${formatSignedScore(rotationHistoryLatest.score)}</b>
            <span>${getRotationClassLabel(rotationHistoryLatest.classification)} / ${getRotationClassKorean(rotationHistoryLatest.classification)}</span>
          </div>
        </div>
        <div class="briefing-rotation-history-legend">${rotationHistoryLegend}</div>
        <div class="briefing-rotation-history-chart-wrap">
          <canvas data-briefing-rotation-history></canvas>
        </div>
      </article>
    `
    : `
      <article class="briefing-rotation-history-panel">
        <p class="market-rs-empty">선택한 섹터의 Rotation Score 히스토리가 아직 없습니다.</p>
      </article>
    `;
  const rotationQuadrantMarkup = ["Leading", "Improving", "Weakening", "Lagging"]
    .map((classification) => {
      const sectors = allRotationSectors.filter((sector) => sector.classification === classification);
      return `
        <article class="briefing-rotation-quadrant is-${classification.toLowerCase()}">
          <div class="briefing-rotation-quadrant-head">
            <strong>${getRotationClassLabel(classification)}</strong>
            <span>${getRotationClassKorean(classification)} ${sectors.length}</span>
          </div>
          <span class="briefing-rotation-rule">${getRotationClassRule(classification)}</span>
          <p>${sectors.map((sector) => sector.label).join(" · ") || "해당 섹터 없음"}</p>
        </article>
      `;
    })
    .join("");
  const rotationCandidates = rotationSignal.candidates ?? {};
  const rotationCandidateMarkup = `
    <article class="briefing-rotation-candidate-card">
      <div class="briefing-rotation-candidate-head">
        <strong>Buy Watch</strong>
        <span>섹터와 종목 모두 QQQ 대비 강세</span>
      </div>
      <div class="briefing-rotation-name-list">
        ${renderRotationCandidateList(rotationCandidates.buyWatch, "아직 뚜렷한 편입 후보가 없습니다.")}
      </div>
    </article>
    <article class="briefing-rotation-candidate-card">
      <div class="briefing-rotation-candidate-head">
        <strong>Early Rotation</strong>
        <span>단기 개선, 중기 회복 초입</span>
      </div>
      <div class="briefing-rotation-name-list">
        ${renderRotationCandidateList(rotationCandidates.earlyRotation, "초기 로테이션 후보가 없습니다.")}
      </div>
    </article>
    <article class="briefing-rotation-candidate-card">
      <div class="briefing-rotation-candidate-head">
        <strong>Trim Watch</strong>
        <span>QQQ 대비 약세 전환 경계</span>
      </div>
      <div class="briefing-rotation-name-list">
        ${renderRotationCandidateList(rotationCandidates.trimWatch, "축소 경계 후보가 없습니다.")}
      </div>
    </article>
  `;

  const newsMarkup = (briefing.majorNews ?? [])
    .map(
      (item) => `
        <a class="briefing-news-card" href="${item.link}" target="_blank" rel="noreferrer">
          <span class="briefing-news-bucket">${item.bucket}</span>
          <strong>${item.title}</strong>
          <div class="briefing-news-meta">
            <span>${item.source || "Source"}</span>
            <span>${formatBriefingTimestamp(item.publishedAt)}</span>
          </div>
        </a>
      `,
    )
    .join("");

  const moversMarkup = (briefing.movers ?? [])
    .map(
      (item) => {
        const summaryMarkup = (item.summaryLines ?? [])
          .map((line) => `<span>${line}</span>`)
          .join("");
        return `
        <article class="briefing-mover-card ${item.direction === "up" ? "is-up" : "is-down"}">
          <div class="briefing-mover-head">
            <div>
              <h3>${item.label}</h3>
              <p>${item.sectorLabel}</p>
            </div>
            <div class="briefing-mover-stats">
              <strong>${formatSignedPercent(item.dayChangePct)}</strong>
              <span>${formatBriefingPrice(item)}</span>
            </div>
          </div>
          <p class="briefing-mover-cap">Market Cap ${formatMarketCapCompact(item.marketCapUsd)}</p>
          <p class="briefing-mover-brief">${formatMoverBriefingKorean(item)}</p>
          <div class="briefing-mover-summary">
            ${summaryMarkup || `<span>${item.headline || "관련 뉴스 핵심 내용을 아직 찾지 못했습니다."}</span>`}
          </div>
          <div class="briefing-news-meta">
            <span>${item.source || "Source"}</span>
            <span>${formatBriefingTimestamp(item.publishedAt)}</span>
          </div>
          ${item.link ? `<a class="briefing-mover-link" href="${item.link}" target="_blank" rel="noreferrer">Open source news</a>` : ""}
        </article>
      `;
      },
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-briefing-overview">
      <article class="us-panel">
        <div class="us-section-head">
          <div>
            <h2>Daily Market Briefing</h2>
            <p>주요 지수 흐름, 섹터별 종목 맵, 핵심 뉴스, 급등락 종목 브리핑을 한 화면에서 빠르게 확인합니다.</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">As of ${briefing.updatedAt ?? "-"}</span>
          </div>
        </div>
        <div class="briefing-legend">
          <span>${briefing.mapLegend?.positive ?? ""}</span>
          <span>${briefing.mapLegend?.negative ?? ""}</span>
          <span>${briefing.mapLegend?.size ?? ""}</span>
        </div>
      </article>

      <section class="briefing-market-row">
      <article class="us-panel briefing-index-panel">
        <div class="us-section-head">
          <div>
            <h2>미국 주요 지수</h2>
            <p>다우 (DIA), S&amp;P 500 (SPY), 나스닥 100 (QQQ), 러셀 2000 (IWM)의 최신 레벨과 등락을 바로 확인합니다.</p>
          </div>
        </div>
        <div class="briefing-index-grid">${indexMarkup}</div>
      </article>

      <article class="us-panel briefing-fedwatch-panel">
        <div class="us-section-head">
          <div>
            <h2>CME FedWatch</h2>
            <p>Conditional meeting probabilities by target rate range.</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">As of ${fedWatch?.asOf ?? "-"}</span>
          </div>
        </div>
        ${fedWatchMarkup}
        <div class="briefing-fedwatch-source">
          <span>Source: ${fedWatch?.source ?? "CME FedWatch"}${fedWatchSourceUpdated ? ` · source updated ${fedWatchSourceUpdated}` : ""}${fedWatchRefreshed ? ` · refreshed ${fedWatchRefreshed}` : ""}</span>
          ${fedWatch?.sourceUrl ? `<a href="${fedWatch.sourceUrl}" target="_blank" rel="noreferrer">Open CME</a>` : ""}
        </div>
        ${fedWatch?.sourceNote ? `<p class="briefing-fedwatch-note">${fedWatch.sourceNote}</p>` : ""}
      </article>
      </section>

      <article class="us-panel briefing-rotation-panel">
        <div class="us-section-head">
          <div>
            <h2>Rotation Signal</h2>
            <p>US 브리핑 종목군을 NASDAQ 100 (QQQ) 대비 초과수익률로 비교해 포트 편입 후보와 약화 후보를 추적합니다.</p>
            <p class="briefing-rotation-formula">Score = QQQ 대비 초과수익률 가중합: 1D 20% · 1W 40% · 2W 20% · 1M 20%. 섹터 수익률은 시총가중 50% + 동일가중 50% 혼합.</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">Benchmark ${rotationSignal.benchmark?.label ?? "QQQ"}</span>
          </div>
        </div>
        <div class="briefing-daily-leader-panel">
          <div class="briefing-daily-leader-head">
            <strong>Yesterday Sector Leaders</strong>
            <span>섹터 숫자: 1D vs QQQ 초과수익률 · 아래 종목: 실제 1D 수익률</span>
          </div>
          <div class="briefing-daily-leader-grid">${rotationDailyLeaderMarkup || '<p class="market-rs-empty">전일 초과수익률 데이터를 아직 계산하지 못했습니다.</p>'}</div>
          <div class="briefing-daily-leader-head is-laggard">
            <strong>Yesterday Sector Laggards</strong>
            <span>섹터 숫자: 1D vs QQQ 초과수익률 · 아래 종목: 실제 1D 수익률</span>
          </div>
          <div class="briefing-daily-leader-grid">${rotationDailyLaggardMarkup || '<p class="market-rs-empty">전일 약세 섹터 데이터를 아직 계산하지 못했습니다.</p>'}</div>
          <div class="briefing-daily-leader-head is-improver">
            <strong>Daily Rotation Improvers</strong>
            <span>Classification improved versus the previous trading day, sorted by improvement and score</span>
          </div>
          <div class="briefing-rotation-improver-grid">${rotationClassImproverMarkup || '<p class="market-rs-empty">No sectors improved classification versus the previous trading day.</p>'}</div>        </div>
        <div class="briefing-rotation-grid">${rotationSectorMarkup}</div>
        ${rotationDistributionMarkup}
        ${rotationHistoryMarkup}
        <div class="briefing-rotation-bottom">
          <div class="briefing-rotation-quadrants">${rotationQuadrantMarkup}</div>
          <div class="briefing-rotation-candidates">${rotationCandidateMarkup}</div>
        </div>
      </article>

      <article class="us-panel briefing-total-map-panel">
        <div class="us-section-head">
          <div>
            <h2>전체 맵</h2>
            <p>Finviz처럼 섹터 경계를 먼저 나누고, 각 섹터 안 종목의 수익률 흐름을 한눈에 비교합니다.</p>
          </div>
          <div class="briefing-range-chip-row">${briefingRangeChips}</div>
        </div>
        <p class="briefing-mini-map-caption">Mini map basis: ${selectedBriefingRangeMeta.label} 수익률</p>
        <div class="briefing-total-sector-grid">${combinedSectorMarkup}</div>
      </article>
      <section class="briefing-news-layout">
        <article class="us-panel">
          <div class="us-section-head">
            <div>
              <h2>주요 뉴스</h2>
              <p>오늘 시장 흐름에 영향을 줄 만한 3~5개 핵심 헤드라인입니다.</p>
            </div>
          </div>
          <div class="briefing-news-grid">${newsMarkup || '<p class="market-rs-empty">뉴스를 아직 불러오지 못했습니다.</p>'}</div>
        </article>

        <article class="us-panel">
          <div class="us-section-head">
            <div>
              <h2>종목 브리핑</h2>
              <p>맵 안에서 크게 오른 종목과 많이 빠진 종목을 함께 묶어, 연결된 재료를 한글 문장으로 정리했습니다.</p>
            </div>
          </div>
          <div class="briefing-mover-grid">${moversMarkup || '<p class="market-rs-empty">급등락 종목 브리핑을 아직 불러오지 못했습니다.</p>'}</div>
        </article>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-briefing-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.briefingMapRange = button.dataset.briefingRange;
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-briefing-rs-ticker]").forEach((element) => {
    element.addEventListener("click", () => {
      openMarketRsTicker(element.dataset.briefingRsTicker);
    });
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      openMarketRsTicker(element.dataset.briefingRsTicker);
    });
  });
  usOverviewRoot.querySelectorAll("[data-rotation-sector]").forEach((button) => {
    button.addEventListener("click", () => {
      state.briefingRotationSectorKey = button.dataset.rotationSector || "";
      const shouldScrollHistory = button.dataset.rotationScrollHistory === "true";
      render();
      if (shouldScrollHistory) {
        requestAnimationFrame(() => {
          document.querySelector(".briefing-rotation-history-panel")?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      }
    });
  });
  usOverviewRoot.querySelectorAll("[data-briefing-rotation-distribution-benchmark]").forEach((button) => {
    button.addEventListener("click", () => {
      state.briefingRotationDistributionBenchmark = button.dataset.briefingRotationDistributionBenchmark || "qqq";
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-briefing-rotation-distribution-x-axis]").forEach((button) => {
    button.addEventListener("click", () => {
      state.briefingRotationDistributionXAxis = button.dataset.briefingRotationDistributionXAxis || "score";
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-briefing-rotation-distribution-corr-window]").forEach((button) => {
    button.addEventListener("click", () => {
      state.briefingRotationDistributionCorrWindow = button.dataset.briefingRotationDistributionCorrWindow || "3m";
      render();
    });
  });
  const rotationHistoryCanvas = usOverviewRoot.querySelector("canvas[data-briefing-rotation-history]");
  if (rotationHistoryCanvas && selectedRotationSector && selectedRotationHistory.length) {
    createBriefingRotationHistoryChart(rotationHistoryCanvas, selectedRotationSector, selectedRotationHistory);
  }
  const rotationDistributionCanvas = usOverviewRoot.querySelector("canvas[data-briefing-rotation-distribution]");
  if (rotationDistributionCanvas && rotationDistribution.points.length) {
    createBriefingRotationDistributionChart(rotationDistributionCanvas, rotationDistribution);
  }
}

function formatRsNumber(value, digits = 0) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  return Number(value).toFixed(digits);
}

function formatRsPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}%`;
}

function formatRsGapPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(2)}%`;
}

function formatAtrPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(2)}%`;
}

function formatAtrMultiple(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}x`;
}

function formatSignedSigma(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}σ`;
}

function formatDollarPrice(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  return getAsiaScreeningRegion() ? formatUsStockPrice(value) : `$${Number(value).toFixed(2)}`;
}

function getExtensionZoneLabel(zone) {
  if (zone === "extreme") {
    return "Extreme";
  }
  if (zone === "stretched") {
    return "Stretched";
  }
  if (zone === "watch") {
    return "Watch";
  }
  if (zone === "normal") {
    return "Normal";
  }
  return "N/A";
}

function renderExtensionTick(label, value, maxRange) {
  if (!Number.isFinite(Number(value)) || !Number.isFinite(Number(maxRange)) || Number(maxRange) <= 0) {
    return "";
  }
  const position = Math.max(0, Math.min(100, ((Number(value) + Number(maxRange)) / (Number(maxRange) * 2)) * 100));
  return `<span class="market-rs-extension-tick" style="left:${position}%"><i></i><b>${label}</b></span>`;
}

function renderMarketRsExtensionGauge(metric) {
  if (!metric || !Number.isFinite(Number(metric.atrMultiple))) {
    return "";
  }
  const atrPct = Number(metric.atrPct);
  const atrLabel = Number.isFinite(atrPct)
    ? { label: "ATR%", value: formatAtrPercent(atrPct) }
    : { label: "ATR", value: formatDollarPrice(metric.atr) };
  const thresholds = metric.sigmaThresholds ?? {};
  const sigma1 = Number(thresholds["1"]);
  const sigma2 = Number(thresholds["2"]);
  const sigma3 = Number(thresholds["3"]);
  const atrMultiple = Number(metric.atrMultiple);
  const maxRange = Math.max(
    Number.isFinite(sigma3) ? sigma3 * 1.15 : 4,
    Math.abs(atrMultiple) * 1.15,
    1,
  );
  const markerPosition = Math.max(0, Math.min(100, ((atrMultiple + maxRange) / (maxRange * 2)) * 100));
  const ticks = [
    renderExtensionTick("-3σ", -sigma3, maxRange),
    renderExtensionTick("-2σ", -sigma2, maxRange),
    renderExtensionTick("-1σ", -sigma1, maxRange),
    renderExtensionTick("0", 0, maxRange),
    renderExtensionTick("+1σ", sigma1, maxRange),
    renderExtensionTick("+2σ", sigma2, maxRange),
    renderExtensionTick("+3σ", sigma3, maxRange),
  ].join("");

  return `
    <article class="market-rs-extension-card is-${metric.zone ?? "na"}">
      <div class="market-rs-extension-head">
        <div>
          <strong>${metric.label ?? "-"}</strong>
          <span>${metric.direction === "below" ? "Below anchor" : "Above anchor"}</span>
        </div>
        <b>${getExtensionZoneLabel(metric.zone)}</b>
      </div>
      <div class="market-rs-extension-scale">
        <div class="market-rs-extension-track">
          ${ticks}
          <span class="market-rs-extension-marker" style="left:${markerPosition}%"></span>
        </div>
      </div>
      <div class="market-rs-extension-stats">
        <span>ATR Multiple <strong>${formatAtrMultiple(metric.atrMultiple)}</strong></span>
        <span>Gap <strong>${formatSignedPercent(metric.deviationPct)}</strong></span>
        <span>Sigma <strong>${formatSignedSigma(metric.signedSigma)}</strong></span>
        <span>Anchor <strong>${formatDollarPrice(metric.anchor)}</strong></span>
        <span>${atrLabel.label} <strong>${atrLabel.value}</strong></span>
      </div>
    </article>
  `;
}

function formatMarketCapCompact(value) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (numeric >= 1_000_000_000_000) {
    return `$${(numeric / 1_000_000_000_000).toFixed(2)}T`;
  }
  return `$${(numeric / 1_000_000_000).toFixed(1)}B`;
}

function formatLargeNumber(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (Math.abs(numeric) >= 1_000_000_000) {
    return `${(numeric / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(numeric) >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(numeric);
}

function formatRsFinancialUsd(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric < 0 ? "-" : "";
  const absolute = Math.abs(numeric);
  if (absolute >= 1_000_000_000) {
    return `${sign}$${(absolute / 1_000_000_000).toFixed(1)}B`;
  }
  if (absolute >= 1_000_000) {
    return `${sign}$${(absolute / 1_000_000).toFixed(0)}M`;
  }
  return `${sign}$${absolute.toFixed(0)}`;
}

function formatRsFinancialPercent(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}%`;
}

function formatRsFinancialMargin(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(1)}%`;
}

function formatRsFinancialPp(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}pp`;
}

function formatRsFinancialEps(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric < 0 ? "-" : "";
  return `${sign}$${Math.abs(numeric).toFixed(2)}`;
}

function formatRsFinancialPeriodRange(start, end) {
  const startText = formatShortIsoDate(start);
  const endText = formatShortIsoDate(end);
  if (startText && endText) {
    return `${startText} - ${endText}`;
  }
  return startText || endText || "-";
}

function renderMarketRsFinancials(row) {
  if (!row) {
    return "";
  }

  const ticker = row.ticker;
  const item = marketRsFinancialsData.financials?.[ticker];
  const updatedAt = marketRsFinancialsData.updatedAt ? formatKstDateTime(marketRsFinancialsData.updatedAt) : "";
  const scopeText = marketRsFinancialsData.scope?.basis ?? "SEC GAAP/XBRL proxy.";

  if (!item?.quarters?.length) {
    return `
      <div class="market-rs-financial-panel">
        <div class="market-rs-financial-head">
          <strong>Quarterly Financials</strong>
          <span>${updatedAt ? `Updated ${updatedAt}` : "SEC EDGAR"}</span>
        </div>
        <p class="market-rs-empty">Official IR/SEC quarterly financials are unavailable or not applicable for this ticker.</p>
      </div>
    `;
  }

  const metricSource = (quarter, key) => escapeHtml(quarter.metricSources?.[key] ?? "Derived from official SEC filing data");
  const adjustedQuarterCount = item.quarters.filter((quarter) =>
    Object.values(quarter.metricSources ?? {}).some((source) => /non-gaap|adjusted/i.test(String(source))),
  ).length;
  const basisLabel = adjustedQuarterCount
    ? `IR Adjusted ${adjustedQuarterCount}/${item.quarters.length}Q`
    : "Reported GAAP";
  const latestRelease = item.quarters.find((quarter) => quarter.irReleaseUrl)?.irReleaseUrl;
  const basisMarkup = latestRelease
    ? `<a href="${escapeHtml(latestRelease)}" target="_blank" rel="noreferrer">${basisLabel}</a>`
    : `<span>${basisLabel}</span>`;

  const rows = item.quarters
    .map((quarter) => `
      <tr>
        <td>${quarter.period ?? "-"}</td>
        <td>${formatRsFinancialPeriodRange(quarter.periodStart, quarter.periodEnd)}</td>
        <td title="${metricSource(quarter, "revenue")}">${formatRsFinancialUsd(quarter.revenue)}</td>
        <td title="Derived from same-quarter revenue"><span class="${getSignedValueClass(quarter.revenueYoyPct)}">${formatRsFinancialPercent(quarter.revenueYoyPct)}</span></td>
        <td title="${metricSource(quarter, "grossMarginPct")}">${formatRsFinancialMargin(quarter.grossMarginPct)}</td>
        <td title="${metricSource(quarter, "operatingMarginPct")}">${formatRsFinancialMargin(quarter.operatingMarginPct)}</td>
        <td><span class="${getSignedValueClass(quarter.operatingMarginYoyPp)}">${formatRsFinancialPp(quarter.operatingMarginYoyPp)}</span></td>
        <td title="${metricSource(quarter, "epsDiluted")}">${formatRsFinancialEps(quarter.epsDiluted)}</td>
        <td title="${metricSource(quarter, "ocf")}">${formatRsFinancialUsd(quarter.ocf)}</td>
        <td title="${metricSource(quarter, "fcf")}">${formatRsFinancialUsd(quarter.fcf)}</td>
      </tr>
    `)
    .join("");

  return `
    <div class="market-rs-financial-panel">
      <div class="market-rs-financial-head">
        <div>
          <strong>Quarterly Financials</strong>
          <p>Latest 8 quarters. Revenue YoY / OPM YoY pp included.</p>
        </div>
        <div class="market-rs-financial-basis">${basisMarkup}<span>${updatedAt ? `Updated ${updatedAt}` : "SEC EDGAR"}</span></div>
      </div>
      <div class="market-canslim-financial-chart-wrap">
        <canvas data-canslim-chart="financials" aria-label="Quarterly revenue, margin, and revenue growth chart"></canvas>
      </div>
      <div class="market-rs-financial-table-wrap">
        <table class="market-rs-financial-table">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>FY Dates</th>
              <th>Revenue</th>
              <th>Rev YoY</th>
              <th>GPM</th>
              <th>OPM</th>
              <th>OPM YoY</th>
              <th>EPS</th>
              <th>OCF</th>
              <th>FCF</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="market-rs-financial-note">${scopeText} Hover a value to see its metric-level source.</p>
    </div>
  `;
}

function createMarketCanslimFinancialChart(canvas, financialItem) {
  if (typeof Chart === "undefined" || !canvas || !financialItem?.quarters?.length) {
    return;
  }

  const quarters = [...financialItem.quarters].slice(0, 8).reverse();
  const finiteOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    return Number.isFinite(Number(value)) ? Number(value) : null;
  };
  const revenueValues = quarters.map((quarter) => {
    const revenue = finiteOrNull(quarter.revenue);
    return revenue === null ? null : Number((revenue / 1_000_000_000).toFixed(2));
  });
  const grossMarginValues = quarters.map((quarter) => finiteOrNull(quarter.grossMarginPct));
  const operatingMarginValues = quarters.map((quarter) => finiteOrNull(quarter.operatingMarginPct));
  const revenueGrowthValues = quarters.map((quarter) => finiteOrNull(quarter.revenueYoyPct));
  const percentValues = [...grossMarginValues, ...operatingMarginValues, ...revenueGrowthValues].filter((value) => value !== null);
  const minimumPercent = percentValues.length ? Math.min(...percentValues) : 0;
  const maximumPercent = percentValues.length ? Math.max(...percentValues) : 100;
  const percentAxisMin = minimumPercent < 0 ? Math.floor((minimumPercent - 5) / 10) * 10 : 0;
  const percentAxisMax = Math.max(10, Math.ceil((maximumPercent + 5) / 10) * 10);
  const maximumRevenue = Math.max(...revenueValues.filter((value) => value !== null), 0);
  const revenueMagnitude = maximumRevenue > 0 ? 10 ** Math.floor(Math.log10(maximumRevenue)) : 10;
  const revenueStep = revenueMagnitude / 2;
  const revenueAxisMax = maximumRevenue > 0
    ? Math.ceil((maximumRevenue * 1.12) / revenueStep) * revenueStep
    : 10;
  const revenueAxisMin = percentAxisMin < 0
    ? revenueAxisMax * (percentAxisMin / percentAxisMax)
    : 0;

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: quarters.map((quarter) => quarter.period ?? "-"),
      datasets: [
        {
          type: "bar",
          label: "Revenue",
          data: revenueValues,
          backgroundColor: "rgba(17, 24, 39, 0.78)",
          borderColor: "#111827",
          borderWidth: 1,
          borderRadius: 3,
          categoryPercentage: 0.78,
          barPercentage: 0.86,
          yAxisID: "yRevenue",
          order: 2,
        },
        {
          type: "bar",
          label: "GPM",
          data: grossMarginValues,
          backgroundColor: "rgba(22, 163, 74, 0.46)",
          borderColor: "#15803d",
          borderWidth: 1,
          borderRadius: 3,
          categoryPercentage: 0.78,
          barPercentage: 0.86,
          yAxisID: "yPercent",
          order: 2,
        },
        {
          type: "bar",
          label: "OPM",
          data: operatingMarginValues,
          backgroundColor: "rgba(217, 119, 6, 0.52)",
          borderColor: "#b45309",
          borderWidth: 1,
          borderRadius: 3,
          categoryPercentage: 0.78,
          barPercentage: 0.86,
          yAxisID: "yPercent",
          order: 2,
        },
        {
          type: "line",
          label: "Revenue YoY",
          data: revenueGrowthValues,
          borderColor: "#dc2626",
          backgroundColor: "#dc2626",
          borderWidth: 2.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHitRadius: 12,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#dc2626",
          pointBorderWidth: 2,
          tension: 0.22,
          spanGaps: true,
          yAxisID: "yPercent",
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            afterTitle: (items) => {
              const quarter = quarters[items?.[0]?.dataIndex];
              return quarter ? formatRsFinancialPeriodRange(quarter.periodStart, quarter.periodEnd) : "";
            },
            label: (context) => {
              if (context.parsed.y === null) {
                return `${context.dataset.label}: -`;
              }
              if (context.dataset.yAxisID === "yRevenue") {
                return `${context.dataset.label}: $${Number(context.parsed.y).toFixed(1)}B`;
              }
              return `${context.dataset.label}: ${Number(context.parsed.y).toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false },
          ticks: { color: "#777770", maxRotation: 0, autoSkip: false, font: { size: 10 } },
          border: { color: "#d8d8d2" },
        },
        yRevenue: {
          position: "left",
          min: revenueAxisMin,
          max: revenueAxisMax,
          title: { display: true, text: "Revenue ($B)", color: "#111827", font: { weight: "700" } },
          ticks: {
            color: "#111827",
            callback: (value) => (Number(value) < 0 ? "" : `$${Number(value).toFixed(0)}B`),
            maxTicksLimit: 6,
          },
          grid: {
            color: (context) => (Number(context.tick.value) === 0 ? "rgba(17, 24, 39, 0.28)" : "rgba(70, 70, 66, 0.10)"),
            lineWidth: (context) => (Number(context.tick.value) === 0 ? 1.4 : 1),
          },
          border: { color: "#111827" },
        },
        yPercent: {
          position: "right",
          min: percentAxisMin,
          max: percentAxisMax,
          title: { display: true, text: "Margins / Growth (%)", color: "#b45309", font: { weight: "700" } },
          ticks: {
            color: "#8a5a0a",
            callback: (value) => `${Number(value).toFixed(0)}%`,
            maxTicksLimit: 7,
          },
          grid: { drawOnChartArea: false },
          border: { color: "#b45309" },
        },
      },
    },
  });

  charts.push(chart);
}

function normalizeCanslimTicker(ticker) {
  const normalized = String(ticker ?? "").toUpperCase();
  if (normalized === "GOOG") {
    return "GOOGL";
  }
  return normalized;
}

function getMarketCanslimProfile(ticker) {
  const normalized = normalizeCanslimTicker(ticker);
  const direct = marketCanslimData.profiles?.[normalized];
  if (direct) {
    return direct;
  }
  return Object.values(marketCanslimData.profiles ?? {}).find((profile) =>
    (profile.aliases ?? []).map((alias) => String(alias).toUpperCase()).includes(normalized),
  );
}

function getMarketCanslimEarningsProfile(ticker) {
  const normalized = normalizeCanslimTicker(ticker);
  return marketCanslimEarningsData.profiles?.[normalized] ?? marketCanslimEarningsData.profiles?.[ticker] ?? null;
}

function formatCanslimEarningsPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}%`;
}

function formatCanslimEarningsValue(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}`;
}

function getCanslimEarningsTone(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }
  if (numeric > 0) {
    return " is-positive";
  }
  if (numeric < 0) {
    return " is-negative";
  }
  return "";
}

function renderMarketCanslimEarningsSurprise(row) {
  const earningsProfile = getMarketCanslimEarningsProfile(row?.ticker);
  const quarters = earningsProfile?.quarters ?? [];
  const sourceText = "Yahoo Finance / yfinance EPS consensus proxy";
  const coverageText = marketCanslimEarningsData.scope?.tickerCount
    ? `${marketCanslimEarningsData.scope.coveredCount ?? 0}/${marketCanslimEarningsData.scope.tickerCount} EPS coverage names covered`
    : "EPS surprise coverage";
  if (!quarters.length) {
    return `
      <div class="market-rs-financial-panel market-canslim-surprise-panel">
        <div class="market-rs-financial-head">
          <div>
            <strong>Earnings Surprise</strong>
            <p>${sourceText}. ${coverageText}</p>
          </div>
        </div>
        <p class="market-rs-empty">EPS estimate vs actual 데이터가 아직 없습니다.</p>
      </div>
    `;
  }

  const rows = quarters
    .map((quarter) => {
      const eps = quarter.eps ?? {};
      return `
        <tr>
          <td>${quarter.period ?? "-"}</td>
          <td>${formatFullIsoDate(quarter.releaseDate)}</td>
          <td>${formatRsFinancialEps(eps.estimate)}</td>
          <td>${formatRsFinancialEps(eps.actual)}</td>
          <td><span class="${getCanslimEarningsTone(eps.surpriseValue)}">${formatCanslimEarningsValue(eps.surpriseValue)}</span></td>
          <td><span class="${getCanslimEarningsTone(eps.surprisePct)}">${formatCanslimEarningsPercent(eps.surprisePct)}</span></td>
        </tr>
      `;
    })
    .join("");

  return `
    <div class="market-rs-financial-panel market-canslim-surprise-panel">
      <div class="market-rs-financial-head">
        <div>
          <strong>Earnings Surprise</strong>
          <p>최근 4개 발표 분기 EPS 실제치 vs 컨센서스만 표시합니다. ${sourceText}. ${coverageText}</p>
        </div>
        <span>Updated ${formatShortIsoDate(marketCanslimEarningsData.updatedAt)}</span>
      </div>
      <div class="market-rs-financial-table-wrap">
        <table class="market-rs-financial-table market-canslim-surprise-table">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Release</th>
              <th>EPS Est</th>
              <th>EPS Actual</th>
              <th>EPS Beat</th>
              <th>EPS %</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="market-rs-financial-note">${marketCanslimEarningsData.scope?.basis ?? ""} Source: ${sourceText}; GAAP/Non-GAAP is not explicitly classified by this feed.</p>
    </div>
  `;
}

function getCanslimStatusLabel(status) {
  if (status === "pass") {
    return "Pass";
  }
  if (status === "watch") {
    return "Watch";
  }
  if (status === "fail") {
    return "Fail";
  }
  return "Pending";
}

function getCanslimStatusClass(status) {
  if (status === "pass") {
    return " pass";
  }
  if (status === "watch") {
    return " watch";
  }
  if (status === "fail") {
    return " fail";
  }
  return " pending";
}

function buildCanslimC(row, financialItem) {
  const latest = financialItem?.quarters?.[0];
  if (!latest) {
    return {
      key: "C",
      title: "Current Earnings",
      status: "pending",
      summary: "최근 분기 재무 데이터 없음",
      detail: "O'Neil식 C는 최근 분기 EPS YoY가 핵심입니다. 해당 데이터가 들어오면 EPS YoY와 매출 YoY를 같이 판정합니다.",
    };
  }
  const revenueYoy = Number(latest.revenueYoyPct);
  const opmYoy = Number(latest.operatingMarginYoyPp);
  const eps = Number(latest.epsDiluted);
  let status = "pending";
  if (Number.isFinite(eps) && eps > 0 && Number.isFinite(revenueYoy)) {
    if (revenueYoy >= 25 && (!Number.isFinite(opmYoy) || opmYoy >= 0)) {
      status = "pass";
    } else if (revenueYoy >= 10 || (Number.isFinite(opmYoy) && opmYoy > 0)) {
      status = "watch";
    } else {
      status = "fail";
    }
  }
  return {
    key: "C",
    title: "Current Earnings",
    status,
    summary: `${latest.period ?? "Latest"} Rev YoY ${formatRsFinancialPercent(latest.revenueYoyPct)} / EPS ${formatRsFinancialEps(latest.epsDiluted)}`,
    detail:
      "EPS YoY는 아직 별도 산출 전이라 Revenue YoY, EPS 흑자 여부, OPM YoY를 보조로 보는 proxy입니다. 엄밀한 C 판정은 EPS YoY 추가 후 확정해야 합니다.",
  };
}

function buildAutoMarketCanslimProfile(row, financialItem) {
  const quarters = financialItem?.quarters ?? [];
  const revenueYoyValues = quarters
    .map((quarter) => Number(quarter.revenueYoyPct))
    .filter((value) => Number.isFinite(value));
  const averageRevenueYoy = revenueYoyValues.length
    ? revenueYoyValues.reduce((sum, value) => sum + value, 0) / revenueYoyValues.length
    : null;
  const positiveEpsCount = quarters.filter((quarter) => Number(quarter.epsDiluted) > 0).length;
  return {
    ticker: row?.ticker,
    generated: true,
    catalyst: "No manual catalyst tag yet. Add a company-specific product, management, industry, or regulatory catalyst before scoring N strictly.",
    annualNote: quarters.length
      ? `Proxy only: last ${quarters.length} quarters loaded, ${positiveEpsCount} quarters with positive EPS, average revenue YoY ${
          averageRevenueYoy === null ? "-" : `${averageRevenueYoy.toFixed(1)}%`
        }. Strict O'Neil A still needs 3-5Y annual EPS growth.`
      : "Quarterly financials are not loaded yet. Strict O'Neil A needs 3-5Y annual EPS growth.",
    institutionNote:
      "Institutional sponsorship is pending. Add 13F holder count, fund ownership quality, and QoQ ownership trend before scoring I strictly.",
    ratings: {
      n: "pending",
      i: "pending",
    },
  };
}

function buildCanslimA(profile, financialItem) {
  const quarters = financialItem?.quarters ?? [];
  const epsValues = quarters
    .map((quarter) => Number(quarter.epsDiluted))
    .filter((value) => Number.isFinite(value));
  const revenueYoyValues = quarters
    .map((quarter) => Number(quarter.revenueYoyPct))
    .filter((value) => Number.isFinite(value));
  const averageRevenueYoy = revenueYoyValues.length
    ? revenueYoyValues.reduce((sum, value) => sum + value, 0) / revenueYoyValues.length
    : null;
  const ttmEps = epsValues.length ? epsValues.reduce((sum, value) => sum + value, 0) : null;
  let status = "pending";
  if (epsValues.length >= 4 && ttmEps !== null && averageRevenueYoy !== null) {
    if (ttmEps > 0 && averageRevenueYoy >= 25) {
      status = "pass";
    } else if (ttmEps > 0 && averageRevenueYoy >= 10) {
      status = "watch";
    } else {
      status = "fail";
    }
  }
  if (!profile?.generated) {
    status = "pending";
  }
  return {
    key: "A",
    title: "Annual Earnings",
    status,
    summary: ttmEps === null ? "5Y annual EPS pending" : `TTM EPS proxy ${formatRsFinancialEps(ttmEps)} / Avg Rev YoY ${formatRsFinancialPercent(averageRevenueYoy)}`,
    detail: profile?.annualNote ?? "최근 3~5년 연간 EPS 성장률 데이터가 아직 연결되지 않았습니다.",
  };
}

function buildCanslimN(row, profile) {
  const status = profile?.ratings?.n ?? "pending";
  const confirmations = [
    row?.priceNewHigh1y ? "1Y price high" : "",
    row?.rsNewHigh1yAll ? "1Y RS high" : "",
  ].filter(Boolean);
  return {
    key: "N",
    title: "New Catalyst",
    status,
    summary: profile?.catalyst ?? "수동 catalyst 태그 없음",
    detail: confirmations.length
      ? `Price confirmation: ${confirmations.join(" / ")}. 신고가는 catalyst의 확인 신호로만 사용합니다.`
      : "Price confirmation 없음. 신고가는 catalyst의 핵심 점수가 아니라 확인 신호로만 사용합니다.",
  };
}

function buildCanslimS(row) {
  const shares = Number(row?.sharesOutstanding);
  let status = "pending";
  if (Number.isFinite(shares)) {
    if (shares <= 1_000_000_000) {
      status = "pass";
    } else if (shares <= 5_000_000_000) {
      status = "watch";
    } else {
      status = "fail";
    }
  }
  return {
    key: "S",
    title: "Supply / Demand",
    status,
    summary: `Shares ${Number.isFinite(shares) ? formatLargeNumber(shares) : "-"} / MCap ${formatMarketCapCompact(row?.marketCap)}`,
    detail:
      "O'Neil식 S는 제한된 공급과 강한 수요를 봅니다. M7은 유동성은 좋지만 shares outstanding이 커서 strict supply 관점에서는 불리하게 표시될 수 있습니다.",
  };
}

function buildCanslimL(row) {
  const universe = state.screeningView === "Canslim" ? state.canslimUniverse : state.rsUniverse;
  const score = Number(getMarketRsUniverseScore(row ?? {}, universe) ?? row?.rsRatingAll);
  let status = "pending";
  if (Number.isFinite(score)) {
    if (score >= 80) {
      status = "pass";
    } else if (score >= 70) {
      status = "watch";
    } else {
      status = "fail";
    }
  }
  return {
    key: "L",
    title: "Leader / Laggard",
    status,
    summary: `RS ${formatRsNumber(score)} / 1M ${formatRsNumber(row?.rsPeriods?.["1m"])} / 3M ${formatRsNumber(row?.rsPeriods?.["3m"])}`,
    detail: "RS 탭과 중복을 줄이기 위해 L은 80 이상 리더 조건 충족 여부만 간단히 확인합니다.",
  };
}

function buildCanslimI(profile) {
  return {
    key: "I",
    title: "Institutional Sponsorship",
    status: profile?.ratings?.i ?? "pending",
    summary: "13F ownership trend pending",
    detail: profile?.institutionNote ?? "13F 기반 보유 기관 수와 QoQ 보유 변화가 아직 연결되지 않았습니다.",
  };
}

function buildCanslimM() {
  if (marketCanslimDirectionCache) {
    return marketCanslimDirectionCache;
  }
  const spy = marketPriceData.items?.sp500 ?? marketPriceData.items?.spy;
  const values = spy?.values ?? [];
  const latest = Number(values.at?.(-1));
  const ema50 = calculateEmaSeries(values, 50).at(-1);
  const ema200 = calculateEmaSeries(values, 200).at(-1);
  let status = "pending";
  if (Number.isFinite(latest) && Number.isFinite(ema50) && Number.isFinite(ema200)) {
    if (latest > ema50 && latest > ema200 && ema50 > ema200) {
      status = "pass";
    } else if (latest > ema200) {
      status = "watch";
    } else {
      status = "fail";
    }
  }
  marketCanslimDirectionCache = {
    key: "M",
    title: "Market Direction",
    status,
    summary: Number.isFinite(latest) ? `S&P 500 vs 50/200 EMA: ${getCanslimStatusLabel(status)}` : "Market trend pending",
    detail: "1차 구현은 S&P 500의 50/200 EMA 위치만 사용합니다. 추후 Breadth/VIX/Distribution day를 결합하는 편이 좋습니다.",
  };
  return marketCanslimDirectionCache;
}

function getCanslimScoreFromChecks(checks) {
  const score = checks.reduce((sum, item) => {
    if (item.status === "pass") {
      return sum + 1;
    }
    if (item.status === "watch") {
      return sum + 0.5;
    }
    return sum;
  }, 0);
  return {
    score,
    maxScore: checks.length,
    passCount: checks.filter((item) => item.status === "pass").length,
    watchCount: checks.filter((item) => item.status === "watch").length,
    pendingCount: checks.filter((item) => item.status === "pending").length,
  };
}

function buildMarketCanslimAnalysis(row) {
  if (!row) {
    return null;
  }
  const cacheKey = `${state.canslimUniverse || "all"}:${row.ticker}`;
  const cached = marketCanslimAnalysisCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const ticker = normalizeCanslimTicker(row.ticker);
  const financialItem = marketRsFinancialsData.financials?.[ticker] ?? marketRsFinancialsData.financials?.[row.ticker];
  const profile = getMarketCanslimProfile(row.ticker) ?? buildAutoMarketCanslimProfile(row, financialItem);
  const checks = [
    buildCanslimC(row, financialItem),
    buildCanslimA(profile, financialItem),
    buildCanslimN(row, profile),
    buildCanslimS(row),
    buildCanslimL(row),
    buildCanslimI(profile),
    buildCanslimM(),
  ];
  const analysis = {
    profile,
    financialItem,
    checks,
    score: getCanslimScoreFromChecks(checks),
  };
  marketCanslimAnalysisCache.set(cacheKey, analysis);
  return analysis;
}

function formatCanslimScore(score) {
  if (!score || !Number.isFinite(Number(score.score))) {
    return "-";
  }
  return `${Number(score.score).toFixed(1)}/${score.maxScore}`;
}

function renderMarketRsCanslim(row) {
  const analysis = buildMarketCanslimAnalysis(row);
  if (!analysis) {
    return "";
  }
  const { profile, checks, score } = analysis;
  const earningsSurpriseMarkup = renderMarketCanslimEarningsSurprise(row);
  const rows = checks.map((item) => `
    <div class="market-canslim-item${getCanslimStatusClass(item.status)}">
      <div class="market-canslim-letter">${item.key}</div>
      <div>
        <div class="market-canslim-title">
          <strong>${item.title}</strong>
          <span>${getCanslimStatusLabel(item.status)}</span>
        </div>
        <p>${item.summary}</p>
        <small>${item.detail}</small>
      </div>
    </div>
  `).join("");

  return `
    <div class="market-rs-financial-panel market-canslim-panel">
      <div class="market-rs-financial-head">
        <div>
          <strong>CANSLIM Check</strong>
          <p>${profile.generated ? "S&P500 auto proxy. C/S/L/M are calculated; A/N/I require stricter annual, catalyst, and 13F data." : "Momentum is kept mostly in RS; this panel emphasizes earnings, catalyst, supply, institutions, and market direction."}</p>
        </div>
        <span>${formatCanslimScore(score)} proxy</span>
      </div>
      <div class="market-canslim-grid">${rows}</div>
      <p class="market-rs-financial-note">${profile.generated ? "Auto proxy uses RS data and the existing S&P500/NASDAQ100 financial dataset. Do not treat Pending N/I/A as a fail." : marketCanslimData.scope?.basis ?? ""}</p>
    </div>
    ${earningsSurpriseMarkup}
  `;
}

function getMarketCanslimRows(briefingSectorData = getMarketRsBriefingSectorData()) {
  const query = normalizeMarketTickerSearch(state.query);
  const universe = state.canslimUniverse || "all";
  return (marketRsData.rows ?? [])
    .filter((row) => {
      if (universe === "sp500") {
        return Boolean(row.memberships?.sp500);
      }
      if (universe === "nasdaq100") {
        return Boolean(row.memberships?.nasdaq100);
      }
      if (universe === "dowjones") {
        return Boolean(row.memberships?.dowjones);
      }
      if (universe === "russell2000") {
        return Boolean(row.memberships?.russell2000);
      }
      return true;
    })
    .filter((row) => matchesBriefingSectorKey(row, state.canslimBriefingSector, briefingSectorData))
    .map((row) => {
      const profile = getMarketCanslimProfile(row.ticker);
      const analysis = buildMarketCanslimAnalysis(row);
      return {
        ticker: row.ticker,
        profile,
        analysis,
        canslimScore: analysis?.score?.score ?? 0,
        canslimMaxScore: analysis?.score?.maxScore ?? 0,
        row,
        name: row.name ?? row.ticker,
        marketCap: row.marketCap,
        rsRating: getMarketRsUniverseScore(row, universe),
      };
    })
    .filter((entry) => {
      if (!query) {
        return true;
      }
      return [
        ...marketTickerSearchTerms(entry.ticker, entry.name),
        entry.profile?.catalyst,
      ]
        .map((value) => String(value ?? "").toLowerCase())
        .some((value) => value.includes(query));
    })
    .sort((left, right) => {
      if (state.canslimSort === "marketCapDesc") {
        return (Number(right.marketCap) || 0) - (Number(left.marketCap) || 0);
      }
      if (state.canslimSort === "marketCapAsc") {
        return (Number(left.marketCap) || 0) - (Number(right.marketCap) || 0);
      }
      if (state.canslimSort === "rsDesc") {
        return (Number(right.rsRating) || 0) - (Number(left.rsRating) || 0);
      }
      if (state.canslimSort === "rsAsc") {
        return (Number(left.rsRating) || 0) - (Number(right.rsRating) || 0);
      }
      if (state.canslimSort === "canslimAsc") {
        const scoreDiff = (Number(left.canslimScore) || 0) - (Number(right.canslimScore) || 0);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }
      } else {
        const scoreDiff = (Number(right.canslimScore) || 0) - (Number(left.canslimScore) || 0);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }
      }
      const leftScore = Number(left.rsRating);
      const rightScore = Number(right.rsRating);
      if (Number.isFinite(leftScore) && Number.isFinite(rightScore) && leftScore !== rightScore) {
        return rightScore - leftScore;
      }
      return String(left.ticker).localeCompare(String(right.ticker));
    });
}

function getSelectedMarketCanslimRow(rows) {
  return rows.find((entry) => entry.ticker === state.canslimSelectedTicker) ?? rows[0] ?? null;
}

function getCanslimSortField(sortKey = state.canslimSort) {
  if (String(sortKey).startsWith("marketCap")) {
    return "marketCap";
  }
  if (String(sortKey).startsWith("rs")) {
    return "rs";
  }
  return "canslim";
}

function getCanslimSortDirection(sortKey = state.canslimSort) {
  return String(sortKey).endsWith("Asc") ? "asc" : "desc";
}

function buildCanslimSortKey(field, direction) {
  const suffix = direction === "asc" ? "Asc" : "Desc";
  return `${field}${suffix}`;
}

function renderMarketCanslimOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  if (!marketRsData.universes?.[state.canslimUniverse]) {
    state.canslimUniverse = "all";
  }
  const briefingSectorData = getMarketRsBriefingSectorData();
  if (
    state.canslimBriefingSector !== "all" &&
    state.canslimBriefingSector !== "briefingAll" &&
    !briefingSectorData.groups.some((sector) => sector.key === state.canslimBriefingSector)
  ) {
    state.canslimBriefingSector = "all";
  }
  const rows = getMarketCanslimRows(briefingSectorData);
  const selected = getSelectedMarketCanslimRow(rows);
  if (selected) {
    state.canslimSelectedTicker = selected.ticker;
  }
  const selectedRow = selected?.row ?? (selected ? { ticker: selected.ticker, name: selected.name } : null);
  const canslimMarkup = renderMarketRsCanslim(selectedRow);
  const financialMarkup = renderMarketRsFinancials(selectedRow);
  const profileCoveredCount = rows.filter((entry) => entry.profile).length;
  const financialCoveredCount = rows.filter((entry) => {
    const ticker = normalizeCanslimTicker(entry.ticker);
    return Boolean(marketRsFinancialsData.financials?.[ticker] ?? marketRsFinancialsData.financials?.[entry.ticker]);
  }).length;
  const universeChips = Object.entries(marketRsData.universes ?? {})
    .map(
      ([key, meta]) => `
        <button
          type="button"
          class="market-rs-chip${state.canslimUniverse === key ? " active" : ""}"
          data-canslim-universe="${key}"
        >${meta.label}</button>
      `,
    )
    .join("");
  const briefingSectorChips = [
    { key: "all", label: "All CANSLIM", count: marketRsData.rows?.length ?? 0 },
    { key: "briefingAll", label: "Daily Briefing 전체", count: briefingSectorData.allTickers.length },
    ...briefingSectorData.groups.map((sector) => ({
      key: sector.key,
      label: sector.label,
      count: sector.tickers.length,
    })),
  ]
    .map(
      (sector) => `
        <button
          type="button"
          class="market-rs-chip market-rs-sector-chip${state.canslimBriefingSector === sector.key ? " active" : ""}"
          data-canslim-briefing-sector="${sector.key}"
        >${sector.label}<small>${sector.count}</small></button>
      `,
    )
    .join("");
  const activeSortField = getCanslimSortField();
  const activeSortDirection = getCanslimSortDirection();
  const sortChips = [
    { field: "canslim", label: "CANSLIM" },
    { field: "rs", label: "RS" },
    { field: "marketCap", label: "Market Cap" },
  ]
    .map(
      (item) => {
        const active = activeSortField === item.field;
        const arrow = active ? (activeSortDirection === "asc" ? "↑" : "↓") : "↕";
        return `
        <button
          type="button"
          class="market-rs-chip${active ? " active" : ""}"
          data-canslim-sort-field="${item.field}"
        >${item.label} ${arrow}</button>
      `;
      },
    )
    .join("");
  const canslimCardLimit = ENABLE_CANSLIM_LIMITED_CARDS
    ? Math.max(CANSLIM_CARD_BATCH_SIZE, Number(state.canslimVisibleCardCount) || CANSLIM_CARD_BATCH_SIZE)
    : rows.length;
  const canslimCardRows = ENABLE_CANSLIM_LIMITED_CARDS ? rows.slice(0, canslimCardLimit) : rows;
  const hasMoreCanslimCards = ENABLE_CANSLIM_LIMITED_CARDS && canslimCardRows.length < rows.length;
  const cards = canslimCardRows
    .map((entry) => `
      <button
        type="button"
        class="market-rs-card${state.canslimSelectedTicker === entry.ticker ? " active" : ""}"
        data-canslim-ticker="${entry.ticker}"
      >
        <div class="market-rs-card-top">
          <span class="market-rs-card-ticker">${entry.ticker}</span>
          <span class="market-rs-card-score">${formatRsNumber(entry.rsRating)}</span>
        </div>
        <p class="market-rs-card-name">${entry.name}</p>
        <p class="market-rs-card-cap">${formatMarketCapCompact(entry.marketCap)}</p>
        <div class="market-rs-card-meta">
          <span>CANSLIM</span>
          <strong>${formatCanslimScore(entry.analysis?.score)}</strong>
        </div>
        <div class="market-rs-card-meta">
          <span>Source</span>
          <strong>${entry.profile ? "Profile" : "Auto"}</strong>
        </div>
      </button>
    `)
    .join("");
  const cardsMoreMarkup = hasMoreCanslimCards
    ? `
      <div class="market-rs-card-more">
        <span>${canslimCardRows.length} / ${rows.length} names</span>
        <button type="button" class="total-date-button" data-canslim-show-more>더 보기 +${Math.min(CANSLIM_CARD_BATCH_SIZE, rows.length - canslimCardRows.length)}</button>
      </div>
    `
    : ENABLE_CANSLIM_LIMITED_CARDS && rows.length
      ? `<p class="market-rs-empty market-rs-card-count">${rows.length} names all loaded.</p>`
      : "";

  usOverviewRoot.innerHTML = `
    <section class="market-rs-overview">
      <article class="us-panel">
        <div class="us-section-head market-rs-head">
          <div>
            <h2>CANSLIM</h2>
            <p>${marketCanslimData.scope?.basis ?? "CANSLIM checklist and investor-facing quarterly financial data."}</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">As of ${marketRsData.updatedAt ?? "-"}</span>
            <span class="market-rs-pill">${getMarketRsUniverseLabel(state.canslimUniverse)}</span>
            <span class="market-rs-pill">${getMarketRsBriefingSectorLabel(state.canslimBriefingSector, briefingSectorData).replace("RS", "CANSLIM")}</span>
            <span class="market-rs-pill">${rows.length} RS names</span>
            <span class="market-rs-pill">${financialCoveredCount} financials</span>
            <span class="market-rs-pill">${profileCoveredCount} manual profiles</span>
            <span class="market-rs-pill">Financials separated from RS</span>
          </div>
        </div>
        <div class="market-rs-controls">
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Universe</span>
            <div class="market-rs-chip-row">${universeChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Daily Briefing Sector</span>
            <div class="market-rs-chip-row market-rs-briefing-sector-row">${briefingSectorChips}</div>
          </div>
        </div>
      </article>

      <section class="market-rs-layout">
        <article class="us-panel market-rs-leaders">
          <div class="us-section-head">
            <div>
              <h2>CANSLIM Coverage</h2>
              <p>RS 유니버스를 그대로 사용합니다. 수동 프로필이 없는 종목도 재무/RS 기반 자동 proxy 체크를 표시합니다.</p>
            </div>
            <div class="market-rs-chip-row">${sortChips}</div>
          </div>
          <div class="market-rs-card-grid">${cards || '<p class="market-rs-empty">검색 결과가 없습니다.</p>'}</div>
          ${cardsMoreMarkup}
        </article>

        <article class="us-panel market-rs-detail">
          <div class="us-section-head">
            <div>
              <h2>${selected?.ticker ?? "-"}</h2>
              <p>${selected?.name ?? "Select a ticker from the CANSLIM coverage list."}</p>
            </div>
            <span class="market-rs-detail-score">${formatRsNumber(selected?.rsRating)}</span>
          </div>
          <div class="market-rs-metrics">
            <div class="market-rs-metric">
              <span>RS Rating</span>
              <strong>${formatRsNumber(selected?.rsRating)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Market Cap</span>
              <strong>${formatMarketCapCompact(selected?.marketCap)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>CANSLIM Score</span>
              <strong>${formatCanslimScore(selected?.analysis?.score)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS Link</span>
              <strong>${selected?.row ? "Available" : "Pending"}</strong>
            </div>
          </div>
          ${canslimMarkup || '<p class="market-rs-empty">CANSLIM profile is not available for this ticker yet. RS universe membership and quarterly financials still remain available here.</p>'}
          ${financialMarkup}
        </article>
      </section>
    </section>
  `;

  createMarketCanslimFinancialChart(
    usOverviewRoot.querySelector('[data-canslim-chart="financials"]'),
    selected?.analysis?.financialItem,
  );

  usOverviewRoot.querySelectorAll("[data-canslim-ticker]").forEach((button) => {
    button.addEventListener("click", () => {
      state.canslimSelectedTicker = button.dataset.canslimTicker;
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-canslim-universe]").forEach((button) => {
    button.addEventListener("click", () => {
      state.canslimUniverse = button.dataset.canslimUniverse || "all";
      state.canslimSelectedTicker = "";
      resetCanslimCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-canslim-briefing-sector]").forEach((button) => {
    button.addEventListener("click", () => {
      state.canslimBriefingSector = button.dataset.canslimBriefingSector || "all";
      state.canslimSelectedTicker = "";
      resetCanslimCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-canslim-sort-field]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.canslimSortField || "canslim";
      const currentField = getCanslimSortField();
      const currentDirection = getCanslimSortDirection();
      const nextDirection = currentField === field && currentDirection === "desc" ? "asc" : "desc";
      state.canslimSort = buildCanslimSortKey(field, nextDirection);
      state.canslimSelectedTicker = "";
      resetCanslimCardLimit();
      render();
    });
  });
  const canslimShowMoreButton = usOverviewRoot.querySelector("[data-canslim-show-more]");
  if (canslimShowMoreButton) {
    canslimShowMoreButton.addEventListener("click", () => {
      state.canslimVisibleCardCount = Math.min(
        rows.length,
        Math.max(CANSLIM_CARD_BATCH_SIZE, Number(state.canslimVisibleCardCount) || CANSLIM_CARD_BATCH_SIZE) + CANSLIM_CARD_BATCH_SIZE,
      );
      render();
    });
  }
}

function formatUsStockPrice(value, maximumFractionDigits = 2) {
  if (value == null || !Number.isFinite(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: getAsiaScreeningRegion() === "hk" ? "HKD" : getAsiaScreeningRegion() === "cn" ? "CNY" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(Number(value));
}

function getMarketRsUniverseLabel(key) {
  return marketRsData?.universes?.[key]?.label ?? "All";
}

function getMarketRsUniverseScore(row, universeKey) {
  if (universeKey === "sp500") {
    return row.rsRatingSp500;
  }
  if (universeKey === "nasdaq100") {
    return row.rsRatingNasdaq100;
  }
  if (universeKey === "dowjones") {
    return row.rsRatingDowjones;
  }
  if (universeKey === "russell2000") {
    return row.rsRatingRussell2000;
  }
  return row.rsRatingAll;
}

function getMarketRsNewHighSuffix(universeKey) {
  if (universeKey === "sp500") {
    return "Sp500";
  }
  if (universeKey === "nasdaq100") {
    return "Nasdaq100";
  }
  if (universeKey === "dowjones") {
    return "Dowjones";
  }
  if (universeKey === "russell2000") {
    return "Russell2000";
  }
  return "All";
}

function getMarketRsFilterNewHighWindow(filterKey = state.rsFilter) {
  if (filterKey === "newHigh3m") {
    return "3m";
  }
  if (filterKey === "newHigh1y" || filterKey === "newHigh") {
    return "1y";
  }
  if (filterKey === "priceNewHigh3m") {
    return "3m";
  }
  if (filterKey === "priceNewHigh1y") {
    return "1y";
  }
  return null;
}

function getMarketRsFilterNewHighKind(filterKey = state.rsFilter) {
  if (filterKey === "newHigh3m" || filterKey === "newHigh1y" || filterKey === "newHigh") {
    return "rs";
  }
  if (filterKey === "priceNewHigh3m" || filterKey === "priceNewHigh1y") {
    return "price";
  }
  return null;
}

function getMarketRsUniverseNewHigh(row, universeKey, windowKey = "1y") {
  const suffix = getMarketRsNewHighSuffix(universeKey);
  if (windowKey === "3m") {
    return Boolean(row[`rsNewHigh3m${suffix}`]);
  }
  const value = row[`rsNewHigh1y${suffix}`] ?? row[`rsNewHigh${suffix}`];
  return Boolean(value ?? (suffix === "All" ? row.rsNewHigh : false));
}

function getMarketRsPriceNewHigh(row, windowKey = "1y") {
  if (windowKey === "3m") {
    return Boolean(row.priceNewHigh3m);
  }
  return Boolean(row.priceNewHigh1y ?? row.priceNewHigh);
}

function getMarketRsNewHighLabel(windowKey = getMarketRsFilterNewHighWindow() ?? "1y", kind = getMarketRsFilterNewHighKind() ?? "rs") {
  const prefix = kind === "price" ? "Price NH" : "RS NH";
  return windowKey === "3m" ? `${prefix} 3M` : `${prefix} 1Y`;
}

function matchesMarketRsNewHighFilter(row, universeKey, filterKey = state.rsFilter) {
  const kind = getMarketRsFilterNewHighKind(filterKey);
  const windowKey = getMarketRsFilterNewHighWindow(filterKey);
  if (!kind || !windowKey) {
    return true;
  }
  if (kind === "price") {
    return getMarketRsPriceNewHigh(row, windowKey);
  }
  return getMarketRsUniverseNewHigh(row, universeKey, windowKey);
}

function getMarketRsBriefingSectorData() {
  const region = getAsiaScreeningRegion();
  if (region && asiaScreeningData[region]) {
    const data = asiaScreeningData[region];
    const groups = [
      ...data.meta.sources.map((source) => ({ key: source.label, label: source.label, tickers: data.rs.rows.filter((row) => row.groups?.includes(source.label === "Hang Seng Composite" ? "HSCI" : source.label)).map((row) => row.ticker) })),
      { key: "etf", label: "ETF", tickers: data.rs.rows.filter((row) => row.assetType === "ETF").map((row) => row.ticker) },
      ...[".HK", ".SS", ".SZ"].map((suffix) => ({ key: suffix, label: { ".HK": "Hong Kong", ".SS": "Shanghai", ".SZ": "Shenzhen" }[suffix], tickers: data.rs.rows.filter((row) => row.ticker.endsWith(suffix)).map((row) => row.ticker) })),
    ].filter((group) => group.tickers.length);
    const tickerToSectors = new Map(data.rs.rows.map((row) => [row.ticker, [{ key: row.assetType, label: row.provisional ? `${row.assetType} · 이력 ${row.historySessions}일` : row.assetType }]]));
    return { groups, tickerToSectors, allTickers: data.meta.watchlist };
  }
  const groups = (window.marketBriefingData?.sectorPanels ?? [])
    .map((sector) => {
      const tickers = [
        ...new Set(
          (sector.items ?? [])
            .map((item) => getBriefingRsTicker(item))
            .filter(Boolean),
        ),
      ];
      return {
        key: sector.key,
        label: sector.label ?? sector.key,
        tickers,
      };
    })
    .filter((sector) => sector.key && sector.tickers.length);
  const tickerToSectors = new Map();
  groups.forEach((sector) => {
    sector.tickers.forEach((ticker) => {
      const current = tickerToSectors.get(ticker) ?? [];
      current.push({ key: sector.key, label: sector.label });
      tickerToSectors.set(ticker, current);
    });
  });
  const allTickers = [...new Set(groups.flatMap((sector) => sector.tickers))];
  return { groups, tickerToSectors, allTickers };
}

function getMarketRsBriefingSectorLabel(sectorKey, sectorData = getMarketRsBriefingSectorData()) {
  if (sectorKey === "all") {
    return "All RS";
  }
  if (sectorKey === "briefingAll") {
    return "Daily Briefing 전체";
  }
  return sectorData.groups.find((sector) => sector.key === sectorKey)?.label ?? "Daily Briefing";
}

function getMarketRsBriefingSectorLabels(row, sectorData) {
  const labels = sectorData?.tickerToSectors?.get(row?.ticker) ?? [];
  return labels.map((item) => item.label);
}

function formatMarketRsBriefingSectorLabels(row, sectorData, limit = 2) {
  const labels = getMarketRsBriefingSectorLabels(row, sectorData);
  if (!labels.length) {
    return "-";
  }
  const visible = labels.slice(0, limit).join(", ");
  return labels.length > limit ? `${visible} +${labels.length - limit}` : visible;
}

function matchesBriefingSectorKey(row, sectorKey, sectorData) {
  if (sectorKey === "all") {
    return true;
  }
  if (sectorKey === "briefingAll") {
    return sectorData.allTickers.includes(row.ticker);
  }
  const sector = sectorData.groups.find((item) => item.key === sectorKey);
  if (!sector) {
    return true;
  }
  return sector.tickers.includes(row.ticker);
}

function matchesMarketRsBriefingSector(row, sectorData) {
  return matchesBriefingSectorKey(row, state.rsBriefingSector, sectorData);
}

function hasFiniteSeriesValue(values) {
  return Array.isArray(values) && values.some((value) => Number.isFinite(value));
}

function getLastFiniteSeriesIndex(values) {
  if (!Array.isArray(values)) {
    return -1;
  }
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (Number.isFinite(values[index])) {
      return index;
    }
  }
  return -1;
}

function getMarketRsHistoryRatingSeries(history, universeKey) {
  if (!history) {
    return { values: [], universeKey: "all", fallback: false };
  }
  const fallbackValues = history.rsRatingAll ?? history.rsRating ?? [];
  const seriesByUniverse = {
    sp500: history.rsRatingSp500,
    nasdaq100: history.rsRatingNasdaq100,
    dowjones: history.rsRatingDowjones,
    russell2000: history.rsRatingRussell2000,
    all: fallbackValues,
  };
  const selectedValues = seriesByUniverse[universeKey] ?? fallbackValues;
  if (hasFiniteSeriesValue(selectedValues)) {
    return { values: selectedValues, universeKey, fallback: false };
  }
  return {
    values: fallbackValues,
    universeKey: "all",
    fallback: universeKey !== "all" && hasFiniteSeriesValue(fallbackValues),
  };
}

function getMarketRsHistoryRatings(history, universeKey) {
  return getMarketRsHistoryRatingSeries(history, universeKey).values;
}

const MARKET_RS_SCORE_RANGES = [
  { key: "all", label: "All", min: 1, max: 100 },
  { key: "90", label: "90-99", min: 90, max: 100 },
  { key: "80", label: "80-89", min: 80, max: 90 },
  { key: "70", label: "70-79", min: 70, max: 80 },
  { key: "50", label: "50-69", min: 50, max: 70 },
  { key: "under50", label: "<50", min: 1, max: 50 },
];

const TREND_SCORE_RANGES = [
  { key: "all", label: "All", min: 0, max: 10.01 },
  { key: "10", label: "10", min: 10, max: 10.01 },
  { key: "8", label: "8-9", min: 8, max: 10 },
  { key: "6", label: "6-7", min: 6, max: 8 },
  { key: "4", label: "4-5", min: 4, max: 6 },
  { key: "under4", label: "<4", min: 0, max: 4 },
];

const CLIMAX_SCORE_RANGES = [
  { key: "all", label: "All", min: 0, max: Number.POSITIVE_INFINITY },
  { key: "8plus", label: "8+", min: 8, max: Number.POSITIVE_INFINITY },
  { key: "5", label: "5-7", min: 5, max: 8 },
  { key: "4", label: "4", min: 4, max: 5 },
  { key: "1", label: "1-3", min: 1, max: 4 },
  { key: "0", label: "0", min: 0, max: 1 },
];

function getMarketRsCapRangeMeta(key) {
  return MARKET_RS_CAP_RANGES.find((range) => range.key === key) ?? MARKET_RS_CAP_RANGES[0];
}

function getScoreRangeMeta(ranges, key) {
  return ranges.find((range) => range.key === key) ?? ranges[0];
}

function parseMarketCapInput(value) {
  const text = String(value ?? "").trim().replace(/[$,\s]/g, "").toLowerCase();
  if (!text) {
    return null;
  }
  const match = text.match(/^(\d+(?:\.\d+)?)([mbt])?$/);
  if (!match) {
    return null;
  }
  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return null;
  }
  const multiplier = match[2] === "t" ? 1_000_000_000_000 : match[2] === "b" ? 1_000_000_000 : match[2] === "m" ? 1_000_000 : 1;
  return numeric * multiplier;
}

function matchesMarketCapRange(row, rangeKey, customMinValue = "", customMaxValue = "") {
  const marketCap = Number(row.marketCap);
  if (!Number.isFinite(marketCap)) {
    return false;
  }
  const customMin = parseMarketCapInput(customMinValue);
  const customMax = parseMarketCapInput(customMaxValue);
  if (customMin !== null && marketCap < customMin) {
    return false;
  }
  if (customMax !== null && marketCap > customMax) {
    return false;
  }
  if (customMin !== null || customMax !== null) {
    return true;
  }
  const range = getMarketRsCapRangeMeta(rangeKey);
  return marketCap >= range.min && marketCap < range.max;
}

function parseScoreInput(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return null;
  }
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : null;
}

function matchesScoreRange(score, ranges, rangeKey, customMinValue = "", customMaxValue = "") {
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) {
    return false;
  }
  const customMin = parseScoreInput(customMinValue);
  const customMax = parseScoreInput(customMaxValue);
  if (customMin !== null && numeric < customMin) {
    return false;
  }
  if (customMax !== null && numeric > customMax) {
    return false;
  }
  if (customMin !== null || customMax !== null) {
    return true;
  }
  const range = getScoreRangeMeta(ranges, rangeKey);
  return numeric >= range.min && numeric < range.max;
}

function matchesMarketRsCapRange(row) {
  return matchesMarketCapRange(row, state.rsMarketCapRange, state.rsCustomMarketCapMin, state.rsCustomMarketCapMax);
}

function matchesMarketRsScoreRange(row) {
  return matchesScoreRange(
    getMarketRsUniverseScore(row, state.rsUniverse),
    MARKET_RS_SCORE_RANGES,
    state.rsScoreRange,
    state.rsCustomScoreMin,
    state.rsCustomScoreMax,
  );
}

function matchesTrendScoreCapRange(row) {
  return matchesMarketCapRange(
    row,
    state.trendScoreMarketCapRange,
    state.trendScoreCustomMarketCapMin,
    state.trendScoreCustomMarketCapMax,
  );
}

function matchesTrendScoreScoreRange(row) {
  return matchesScoreRange(
    row.score,
    TREND_SCORE_RANGES,
    state.trendScoreScoreRange,
    state.trendScoreCustomScoreMin,
    state.trendScoreCustomScoreMax,
  );
}

function matchesTrendScoreClimaxRange(row) {
  return matchesScoreRange(
    row.climaxScore,
    CLIMAX_SCORE_RANGES,
    state.trendScoreClimaxRange,
    state.trendScoreCustomClimaxMin,
    state.trendScoreCustomClimaxMax,
  );
}

function getMarketRsBaseRows(briefingSectorData = getMarketRsBriefingSectorData()) {
  return (marketRsData.rows ?? [])
    .filter((row) => {
      if (!matchesMarketRsCapRange(row)) {
        return false;
      }
      if (!matchesMarketRsScoreRange(row)) {
        return false;
      }
      if (state.rsUniverse === "sp500" && !row.memberships?.sp500) {
        return false;
      }
      if (state.rsUniverse === "nasdaq100" && !row.memberships?.nasdaq100) {
        return false;
      }
      if (state.rsUniverse === "dowjones" && !row.memberships?.dowjones) {
        return false;
      }
      if (state.rsUniverse === "russell2000" && !row.memberships?.russell2000) {
        return false;
      }
      if (!matchesMarketRsBriefingSector(row, briefingSectorData)) {
        return false;
      }
      return true;
    });
}

function getVisibleMarketRsRows(briefingSectorData = getMarketRsBriefingSectorData()) {
  const query = normalizeMarketTickerSearch(state.query);
  return getMarketRsBaseRows(briefingSectorData)
    .filter((row) => {
      if (!query) {
        return matchesMarketRsNewHighFilter(row, state.rsUniverse);
      }
      const matchesQuery = marketTickerSearchTerms(row.ticker, row.name).some((term) => term.includes(query));
      if (!matchesQuery) {
        return false;
      }
      return matchesMarketRsNewHighFilter(row, state.rsUniverse);
    })
    .sort((left, right) => {
      if (query) {
        const leftTicker = normalizeMarketTickerSearch(left.ticker);
        const rightTicker = normalizeMarketTickerSearch(right.ticker);
        const scoreMatch = (ticker) => {
          if (ticker === query) {
            return 3;
          }
          if (ticker.startsWith(query)) {
            return 2;
          }
          if (ticker.includes(query)) {
            return 1;
          }
          return 0;
        };
        const leftMatchScore = scoreMatch(leftTicker);
        const rightMatchScore = scoreMatch(rightTicker);
        if (rightMatchScore !== leftMatchScore) {
          return rightMatchScore - leftMatchScore;
        }
      }
      const leftScore = getMarketRsUniverseScore(left, state.rsUniverse) ?? -Infinity;
      const rightScore = getMarketRsUniverseScore(right, state.rsUniverse) ?? -Infinity;
      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }
      return String(left.ticker).localeCompare(String(right.ticker));
    });
}

function getSelectedMarketRsRow(rows) {
  return rows.find((row) => row.ticker === state.rsSelectedTicker) ?? rows[0] ?? null;
}

function getMarketRsTableSortValue(row, sortKey) {
  switch (sortKey) {
    case "ticker":
      return row.ticker ?? "";
    case "name":
      return row.name ?? "";
    case "marketCap":
      return row.marketCap ?? Number.NEGATIVE_INFINITY;
    case "rs":
      return getMarketRsUniverseScore(row, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
    case "rs1w":
      return row.rsPeriods?.["1w"] ?? Number.NEGATIVE_INFINITY;
    case "rs2w":
      return row.rsPeriods?.["2w"] ?? Number.NEGATIVE_INFINITY;
    case "rs1m":
      return row.rsPeriods?.["1m"] ?? Number.NEGATIVE_INFINITY;
    case "rs3m":
      return row.rsPeriods?.["3m"] ?? Number.NEGATIVE_INFINITY;
    case "rs6m":
      return row.rsPeriods?.["6m"] ?? Number.NEGATIVE_INFINITY;
    case "atr21Pct":
      return row.atr21Pct ?? Number.NEGATIVE_INFINITY;
    case "gap52w":
      return row.distanceTo52wHighPct ?? Number.POSITIVE_INFINITY;
    case "rsNewHigh":
      return getMarketRsUniverseNewHigh(row, state.rsUniverse, getMarketRsFilterNewHighWindow() ?? "1y") ? 1 : 0;
    case "priceNewHigh":
      return getMarketRsPriceNewHigh(row, getMarketRsFilterNewHighKind() === "price" ? getMarketRsFilterNewHighWindow() : "1y") ? 1 : 0;
    default:
      return getMarketRsUniverseScore(row, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
  }
}

function sortMarketRsTableRows(rows) {
  const direction = state.rsTableSortDirection === "asc" ? 1 : -1;
  const sortKey = state.rsTableSortKey ?? "rs";
  return [...rows].sort((left, right) => {
    const leftValue = getMarketRsTableSortValue(left, sortKey);
    const rightValue = getMarketRsTableSortValue(right, sortKey);

    if (typeof leftValue === "string" || typeof rightValue === "string") {
      const comparison = String(leftValue).localeCompare(String(rightValue));
      if (comparison !== 0) {
        return comparison * direction;
      }
    } else if (rightValue !== leftValue) {
      return (leftValue < rightValue ? -1 : 1) * direction;
    }

    const leftScore = getMarketRsUniverseScore(left, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
    const rightScore = getMarketRsUniverseScore(right, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return (left.ticker ?? "").localeCompare(right.ticker ?? "");
  });
}

function sortMarketRsLeaderRows(rows) {
  const sortKey = state.rsLeaderSort ?? "rs";
  return [...rows].sort((left, right) => {
    if (sortKey === "marketCapDesc" || sortKey === "marketCapAsc") {
      const leftCap = Number(left.marketCap);
      const rightCap = Number(right.marketCap);
      if (Number.isFinite(leftCap) && Number.isFinite(rightCap) && leftCap !== rightCap) {
        return sortKey === "marketCapAsc" ? leftCap - rightCap : rightCap - leftCap;
      }
    }

    const leftScore = getMarketRsUniverseScore(left, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
    const rightScore = getMarketRsUniverseScore(right, state.rsUniverse) ?? Number.NEGATIVE_INFINITY;
    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }
    return String(left.ticker ?? "").localeCompare(String(right.ticker ?? ""));
  });
}

function renderMarketRsSortHeader(label, sortKey) {
  const active = state.rsTableSortKey === sortKey;
  const arrow = !active ? "" : state.rsTableSortDirection === "asc" ? " ↑" : " ↓";
  return `<button type="button" class="market-rs-sort${active ? " active" : ""}" data-rs-sort="${sortKey}">${label}${arrow}</button>`;
}

function calculateEmaSeries(values, period) {
  const multiplier = 2 / (period + 1);
  let ema = null;
  return values.map((value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    ema = ema === null ? numeric : numeric * multiplier + ema * (1 - multiplier);
    return Number(ema.toFixed(4));
  });
}

const MARKET_RS_CHART_SERIES = [
  { key: "rs", label: "RS Rating(L)", color: "#d93025" },
  { key: "ema10", label: "10EMA", period: 10, color: "#2563eb" },
  { key: "ema20", label: "20EMA", period: 20, color: "#d97706" },
  { key: "ema50", label: "50EMA", period: 50, color: "#16a34a" },
  { key: "ema100", label: "100EMA", period: 100, color: "#0f766e" },
  { key: "ema200", label: "200EMA", period: 200, color: "#7c3aed" },
];

const MARKET_RS_PRICE_CHART_TYPES = [
  { key: "candle", label: "Candle" },
  { key: "line", label: "Line" },
];

const MARKET_RS_CANDLESTICK_PLUGIN = {
  id: "marketRsCandlestick",
  beforeDatasetsDraw(chart) {
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.isCandlestick || !chart.isDatasetVisible(datasetIndex)) {
        return;
      }
      const meta = chart.getDatasetMeta(datasetIndex);
      const yScale = meta.yScale;
      if (!yScale || !meta.data?.length) {
        return;
      }
      const visiblePoints = meta.data.filter((point) => Number.isFinite(point?.x));
      const spacing = visiblePoints.length > 1
        ? Math.abs(visiblePoints[1].x - visiblePoints[0].x)
        : chart.chartArea.width;
      const pixelRatio = Number(chart.currentDevicePixelRatio) || 1;
      const snapToPixel = (value) => Math.round(value * pixelRatio) / pixelRatio;
      const bodyWidth = snapToPixel(Math.max(2, Math.min(14, spacing * 0.88)));
      const wickWidth = spacing >= 4 ? 1.5 : 1.15;

      chart.ctx.save();
      chart.ctx.beginPath();
      chart.ctx.rect(
        chart.chartArea.left,
        chart.chartArea.top,
        chart.chartArea.width,
        chart.chartArea.height,
      );
      chart.ctx.clip();
      meta.data.forEach((point, index) => {
        const candle = dataset.ohlc?.[index];
        const open = candle?.o;
        const high = candle?.h;
        const low = candle?.l;
        const close = candle?.c;
        if (![point?.x, open, high, low, close].every(Number.isFinite)) {
          return;
        }

        const isUp = close > open;
        const isDown = close < open;
        const color = isUp ? "#089981" : isDown ? "#f23645" : "#6b7280";
        const yOpen = yScale.getPixelForValue(open);
        const yHigh = yScale.getPixelForValue(high);
        const yLow = yScale.getPixelForValue(low);
        const yClose = yScale.getPixelForValue(close);
        const centerX = snapToPixel(point.x);
        const bodyTop = snapToPixel(Math.min(yOpen, yClose));
        const bodyHeight = snapToPixel(Math.max(2.2, Math.abs(yClose - yOpen)));

        chart.ctx.strokeStyle = color;
        chart.ctx.fillStyle = color;
        chart.ctx.lineWidth = wickWidth;
        chart.ctx.beginPath();
        chart.ctx.moveTo(centerX, snapToPixel(yHigh));
        chart.ctx.lineTo(centerX, snapToPixel(yLow));
        chart.ctx.stroke();
        chart.ctx.fillRect(snapToPixel(centerX - bodyWidth / 2), bodyTop, bodyWidth, bodyHeight);
      });
      chart.ctx.restore();
    });
  },
};

function isMarketRsChartSeriesVisible(key) {
  return state.rsChartSeries?.[key] !== false;
}

function isMarketRsVolumeVisible() {
  return state.rsVolumeVisible !== false;
}

function refreshMarketRsChartOnly() {
  const detailCanvas = usOverviewRoot.querySelector('[data-rs-chart="detail"]');
  const volumeCanvas = usOverviewRoot.querySelector('[data-rs-chart="volume"]');
  const mddCanvas = usOverviewRoot.querySelector('[data-rs-chart="mdd"]');
  const atrCanvas = usOverviewRoot.querySelector('[data-rs-chart="atr"]');
  const selected = marketRsRowByTicker.get(state.rsSelectedTicker) ?? marketRsData.rows?.[0] ?? null;
  if (!detailCanvas || !selected) {
    return;
  }
  destroyCharts();
  createMarketRsChart(detailCanvas, selected);
  createMarketRsVolumeChart(volumeCanvas, selected);
  createMarketRsMddChart(mddCanvas, selected);
  createMarketRsAtrChart(atrCanvas, selected);
}

function syncMarketRsChartSeriesButtons() {
  usOverviewRoot.querySelectorAll("[data-rs-chart-series]").forEach((button) => {
    const seriesKey = button.dataset.rsChartSeries;
    button.classList.toggle("active", isMarketRsChartSeriesVisible(seriesKey));
    button.setAttribute("aria-pressed", isMarketRsChartSeriesVisible(seriesKey) ? "true" : "false");
  });
}

function syncMarketRsPriceChartTypeButtons() {
  usOverviewRoot.querySelectorAll("[data-rs-price-chart-type]").forEach((button) => {
    const isActive = button.dataset.rsPriceChartType === state.rsPriceChartType;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncMarketRsChartRangeButtons() {
  usOverviewRoot.querySelectorAll("[data-rs-range]").forEach((button) => {
    const isActive = button.dataset.rsRange === state.rsHistoryRange;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateMarketRsEmaReadout(labels, emaSeries, priceSeries, index) {
  const readout = usOverviewRoot.querySelector("[data-rs-ema-readout]");
  if (!readout) {
    return;
  }
  const selectedSeries = MARKET_RS_CHART_SERIES.filter(
    (series) => series.period && isMarketRsChartSeriesVisible(series.key),
  );
  if (!selectedSeries.length) {
    readout.hidden = true;
    return;
  }

  const firstPriceIndex = priceSeries.findIndex((value) => value != null && Number.isFinite(Number(value)));
  const lastPriceIndex = priceSeries.findLastIndex((value) => value != null && Number.isFinite(Number(value)));
  const safeIndex = Math.max(Math.max(0, firstPriceIndex), Math.min(Math.max(0, lastPriceIndex), Number.isFinite(index) ? index : lastPriceIndex));
  const stockPrice = priceSeries?.[safeIndex] == null ? NaN : Number(priceSeries[safeIndex]);
  const items = selectedSeries.map((series) => {
    const rawValue = emaSeries[series.key]?.[safeIndex];
    const value = rawValue == null ? NaN : Number(rawValue);
    const gap = Number.isFinite(stockPrice) && stockPrice > 0 && Number.isFinite(value) && value > 0
      ? ((stockPrice / value) - 1) * 100
      : null;
    const gapClass = Number(gap) > 0 ? "positive" : Number(gap) < 0 ? "negative" : "neutral";
    return `
      <span class="market-rs-ema-readout-item" style="--ema-color:${series.color}">
        <i></i><b>${series.label}</b>
        <span>${Number.isFinite(value) ? formatUsStockPrice(value) : "-"}</span>
        <em class="market-rs-ema-gap ${gapClass}">Gap ${Number.isFinite(gap) ? formatSignedPercent(gap) : "-"}</em>
      </span>
    `;
  }).join("");
  readout.hidden = false;
  readout.innerHTML = `<time>${labels[safeIndex] ?? "-"}</time>${items}`;
}

function getMarketRsVisibleIndexRange(chart) {
  const labelCount = chart?.data?.labels?.length ?? 0;
  if (!labelCount) {
    return { min: 0, max: -1 };
  }
  const xScale = chart?.scales?.x;
  const dataBounds = chart?.$marketRsDataBounds;
  const firstIndex = Number.isFinite(dataBounds?.firstIndex) ? dataBounds.firstIndex : 0;
  const latestIndex = Number.isFinite(dataBounds?.latestIndex) ? dataBounds.latestIndex : labelCount - 1;
  const min = Number.isFinite(xScale?.min)
    ? Math.max(firstIndex, Math.ceil(xScale.min))
    : firstIndex;
  const max = Number.isFinite(xScale?.max)
    ? Math.min(latestIndex, Math.floor(xScale.max))
    : latestIndex;
  return { min, max };
}

function fitMarketRsChartYToVisible(chart = marketRsDetailChart) {
  if (!chart?.data?.datasets?.length || !chart.scales?.x) {
    return;
  }
  const visibleRange = getMarketRsVisibleIndexRange(chart);
  if (visibleRange.max < visibleRange.min) {
    return;
  }

  const ratingValues = [];
  const priceValues = [];
  chart.data.datasets.forEach((dataset, datasetIndex) => {
    if (!chart.isDatasetVisible(datasetIndex) || dataset.isEarningsSurprise) {
      return;
    }
    const target = dataset.yAxisID === "y" ? ratingValues : dataset.yAxisID === "y1" ? priceValues : null;
    if (!target) {
      return;
    }
    for (let index = visibleRange.min; index <= visibleRange.max; index += 1) {
      if (dataset.isCandlestick) {
        const candle = dataset.ohlc?.[index];
        [candle?.o, candle?.h, candle?.l, candle?.c].forEach((value) => {
          const numeric = Number(value);
          if (Number.isFinite(numeric)) {
            target.push(numeric);
          }
        });
      } else {
        const rawValue = dataset.data?.[index];
        const chartValue = rawValue && typeof rawValue === "object" ? rawValue.y : rawValue;
        if (chartValue === null || chartValue === undefined || chartValue === "") {
          continue;
        }
        const numeric = Number(chartValue);
        if (Number.isFinite(numeric)) {
          target.push(numeric);
        }
      }
    }
  });

  if (ratingValues.length && chart.options.scales?.y) {
    let min = Math.floor((Math.min(...ratingValues) - 3) / 5) * 5;
    let max = Math.ceil((Math.max(...ratingValues) + 3) / 5) * 5;
    if (max - min < 12) {
      const midpoint = (max + min) / 2;
      min = Math.floor((midpoint - 6) / 5) * 5;
      max = Math.ceil((midpoint + 6) / 5) * 5;
    }
    min = Math.max(1, min);
    max = Math.min(99, max);
    chart.options.scales.y.min = min;
    chart.options.scales.y.max = max;
    chart.options.scales.y.ticks.stepSize = max - min <= 20 ? 5 : 10;
  }

  if (priceValues.length && chart.options.scales?.y1) {
    let min = Math.min(...priceValues);
    let max = Math.max(...priceValues);
    if (min === max) {
      const pad = Math.max(1, Math.abs(max) * 0.05);
      min -= pad;
      max += pad;
    } else {
      const pad = (max - min) * 0.07;
      min -= pad;
      max += pad;
    }
    chart.options.scales.y1.min = Math.max(0, min);
    chart.options.scales.y1.max = max;
  }
  chart.update("none");
}

function attachMarketRsYAxisDrag(chart) {
  const canvas = chart?.canvas;
  if (!canvas) {
    return;
  }
  canvas.__marketRsYAxisDragCleanup?.();

  let dragState = null;
  const getPosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (chart.width / Math.max(1, rect.width)),
      y: (event.clientY - rect.top) * (chart.height / Math.max(1, rect.height)),
    };
  };
  const getAxisAtPosition = (position) => [chart.scales?.y, chart.scales?.y1].find(
    (scale) => scale
      && scale.options?.display !== false
      && position.x >= scale.left
      && position.x <= scale.right
      && position.y >= scale.top
      && position.y <= scale.bottom,
  ) ?? null;
  const updateCursor = (event) => {
    if (dragState) {
      canvas.style.cursor = "ns-resize";
      return;
    }
    canvas.style.cursor = getAxisAtPosition(getPosition(event)) ? "ns-resize" : "";
  };
  const endDrag = (event) => {
    if (!dragState) {
      return;
    }
    if (event && canvas.hasPointerCapture?.(event.pointerId)) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released by the browser.
      }
    }
    dragState = null;
    canvas.style.cursor = "";
  };
  const handlePointerDown = (event) => {
    const position = getPosition(event);
    const scale = getAxisAtPosition(position);
    if (!scale || !Number.isFinite(scale.min) || !Number.isFinite(scale.max) || scale.max <= scale.min) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const span = scale.max - scale.min;
    const anchor = scale.getValueForPixel(position.y);
    dragState = {
      axisId: scale.id,
      startY: position.y,
      initialSpan: span,
      anchor,
      anchorRatio: Math.max(0, Math.min(1, (anchor - scale.min) / span)),
    };
    try {
      canvas.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic or interrupted pointers can be scaled without capture.
    }
    canvas.style.cursor = "ns-resize";
  };
  const handlePointerMove = (event) => {
    if (!dragState) {
      updateCursor(event);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const position = getPosition(event);
    const isRatingAxis = dragState.axisId === "y";
    const minimumSpan = isRatingAxis ? 5 : Math.max(0.01, dragState.initialSpan * 0.08);
    const maximumSpan = isRatingAxis ? 98 : dragState.initialSpan * 12;
    const scaleFactor = Math.exp((position.y - dragState.startY) / 180);
    const nextSpan = Math.max(minimumSpan, Math.min(maximumSpan, dragState.initialSpan * scaleFactor));
    let nextMin = dragState.anchor - (dragState.anchorRatio * nextSpan);
    let nextMax = nextMin + nextSpan;

    if (isRatingAxis) {
      if (nextMin < 1) {
        nextMax += 1 - nextMin;
        nextMin = 1;
      }
      if (nextMax > 99) {
        nextMin -= nextMax - 99;
        nextMax = 99;
      }
      nextMin = Math.max(1, nextMin);
      chart.options.scales.y.ticks.stepSize = nextMax - nextMin <= 15 ? 2 : nextMax - nextMin <= 35 ? 5 : 10;
    } else if (nextMin < 0) {
      nextMax -= nextMin;
      nextMin = 0;
    }
    chart.options.scales[dragState.axisId].min = nextMin;
    chart.options.scales[dragState.axisId].max = nextMax;
    chart.update("none");
  };
  const handleDoubleClick = (event) => {
    if (!getAxisAtPosition(getPosition(event))) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    fitMarketRsChartYToVisible(chart);
  };
  const handlePointerLeave = () => {
    if (!dragState) {
      canvas.style.cursor = "";
    }
  };

  canvas.addEventListener("pointerdown", handlePointerDown, true);
  canvas.addEventListener("pointermove", handlePointerMove, true);
  canvas.addEventListener("pointerup", endDrag, true);
  canvas.addEventListener("pointercancel", endDrag, true);
  canvas.addEventListener("pointerleave", handlePointerLeave, true);
  canvas.addEventListener("dblclick", handleDoubleClick, true);
  canvas.__marketRsYAxisDragCleanup = () => {
    canvas.removeEventListener("pointerdown", handlePointerDown, true);
    canvas.removeEventListener("pointermove", handlePointerMove, true);
    canvas.removeEventListener("pointerup", endDrag, true);
    canvas.removeEventListener("pointercancel", endDrag, true);
    canvas.removeEventListener("pointerleave", handlePointerLeave, true);
    canvas.removeEventListener("dblclick", handleDoubleClick, true);
    canvas.style.cursor = "";
  };
}

function zoomMarketRsChartToLatest(direction) {
  const chart = marketRsDetailChart;
  const xScale = chart?.scales?.x;
  const labelCount = chart?.data?.labels?.length ?? 0;
  if (!chart || !xScale || labelCount < 2) {
    return;
  }

  const firstIndex = chart.$marketRsDataBounds?.firstIndex ?? 0;
  const latestIndex = chart.$marketRsDataBounds?.latestIndex ?? labelCount - 1;
  const edgePaddingCount = chart.$marketRsDataBounds?.edgePaddingCount ?? 0;
  const currentMin = Number.isFinite(xScale.min) ? Math.max(firstIndex, Math.ceil(xScale.min)) : firstIndex;
  const currentMax = Number.isFinite(xScale.max) ? Math.min(latestIndex, Math.floor(xScale.max)) : latestIndex;
  const currentSpan = Math.max(20, currentMax - currentMin + 1);
  const scaleFactor = direction === "in" ? 0.5 : 1.75;
  const dataPointCount = Math.max(1, latestIndex - firstIndex + 1);
  const nextSpan = Math.max(20, Math.min(dataPointCount, Math.round(currentSpan * scaleFactor)));
  const nextRange = {
    min: Math.max(firstIndex, latestIndex - nextSpan + 1),
    max: Math.min(labelCount - 1, latestIndex + edgePaddingCount),
  };

  if (typeof chart.zoomScale === "function") {
    chart.zoomScale("x", nextRange, "none");
  } else {
    chart.options.scales.x.min = nextRange.min;
    chart.options.scales.x.max = nextRange.max;
    chart.update("none");
  }
  fitMarketRsChartYToVisible(chart);
  syncMarketRsVolumeChartX(chart);
}

const MARKET_RS_INTERACTION_MODE = "marketRsEarningsAware";

function isMarketRsPointerInsideDataBounds(chart, event) {
  const bounds = chart?.$marketRsDataBounds;
  const xScale = chart?.scales?.x;
  const pointerX = Number(event?.x);
  if (!bounds || !xScale || !Number.isFinite(pointerX)) {
    return true;
  }

  const firstPixel = xScale.getPixelForValue(bounds.firstIndex);
  const latestPixel = xScale.getPixelForValue(bounds.latestIndex);
  if (!Number.isFinite(firstPixel) || !Number.isFinite(latestPixel)) {
    return true;
  }

  const dataSpan = Math.max(1, bounds.latestIndex - bounds.firstIndex);
  const halfStep = Math.abs(latestPixel - firstPixel) / dataSpan / 2;
  return pointerX >= firstPixel - halfStep && pointerX <= latestPixel + halfStep;
}

function ensureMarketRsInteractionMode() {
  const modes = Chart?.Interaction?.modes;
  if (!modes) {
    return "index";
  }
  if (!modes[MARKET_RS_INTERACTION_MODE]) {
    modes[MARKET_RS_INTERACTION_MODE] = (chart, event, options, useFinalPosition) => {
      if (!isMarketRsPointerInsideDataBounds(chart, event)) {
        return [];
      }
      const directItems = modes.nearest(
        chart,
        event,
        { ...options, axis: "xy", intersect: true },
        useFinalPosition,
      );
      const earningsItems = directItems.filter(
        (item) => chart.data.datasets[item.datasetIndex]?.isEarningsSurprise,
      );
      if (earningsItems.length) {
        return earningsItems;
      }

      const xScale = chart.scales?.x;
      const bounds = chart.$marketRsDataBounds;
      const pointerX = Number(event?.x);
      if (!xScale || !bounds || !Number.isFinite(pointerX)) {
        return [];
      }
      const hoveredIndex = Math.round(Number(xScale.getValueForPixel(pointerX)));
      if (
        !Number.isFinite(hoveredIndex)
        || hoveredIndex < bounds.firstIndex
        || hoveredIndex > bounds.latestIndex
      ) {
        return [];
      }

      return chart.data.datasets.flatMap((dataset, datasetIndex) => {
        if (dataset.isEarningsSurprise || dataset.hidden) {
          return [];
        }
        const meta = chart.getDatasetMeta(datasetIndex);
        const element = meta?.data?.[hoveredIndex];
        const parsed = meta?.controller?.getParsed?.(hoveredIndex);
        if (!element || meta.hidden || parsed?.y === null || parsed?.y === undefined) {
          return [];
        }
        return [{ element, datasetIndex, index: hoveredIndex }];
      });
    };
  }
  return MARKET_RS_INTERACTION_MODE;
}

function buildMarketRsEarningsMarkers(row, selectedLabels, selectedPrice) {
  const earningsProfile = getMarketCanslimEarningsProfile(row?.ticker);
  const quarters = earningsProfile?.quarters ?? [];
  if (!quarters.length || !selectedLabels.length) {
    return { data: [], byIndex: new Map() };
  }
  const byIndex = new Map();
  const rotations = [];
  const colors = [];
  const data = quarters
    .map((quarter) => {
      const releaseDate = quarter.releaseDate;
      if (!releaseDate) {
        return null;
      }
      let index = selectedLabels.findIndex((label) => label >= releaseDate);
      if (index < 0) {
        index = selectedLabels.length - 1;
      }
      if (index < 0) {
        return null;
      }
      byIndex.set(index, quarter);
      const surprisePct = Number(quarter.eps?.surprisePct);
      rotations.push(Number.isFinite(surprisePct) && surprisePct < 0 ? 180 : 0);
      colors.push(Number.isFinite(surprisePct) && surprisePct < 0 ? "#dc2626" : "#16a34a");
      return {
        x: selectedLabels[index],
        y: 0.08,
        chartDate: selectedLabels[index],
        stockPrice: Number.isFinite(Number(selectedPrice?.[index])) ? Number(selectedPrice[index]) : null,
        releaseDate,
        earningsEvent: quarter,
      };
    })
    .filter(Boolean);
  return { data, byIndex, rotations, colors };
}

function calculateDrawdownSeries(values = []) {
  let runningHigh = null;
  return values.map((value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return null;
    }
    runningHigh = runningHigh === null ? numeric : Math.max(runningHigh, numeric);
    if (!runningHigh) {
      return null;
    }
    return Number(((numeric / runningHigh - 1) * 100).toFixed(2));
  });
}

function calculateAtrPctSeries(highValues = [], lowValues = [], closeValues = [], window = 21) {
  const trueRangePercents = closeValues.map((closeValue, index) => {
    const high = Number(highValues[index]);
    const low = Number(lowValues[index]);
    if (!Number.isFinite(high) || !Number.isFinite(low)) {
      return null;
    }
    const previousClose = index > 0 ? Number(closeValues[index - 1]) : Number(closeValue);
    if (!Number.isFinite(previousClose) || previousClose <= 0) {
      return null;
    }
    const ranges = [high - low];
    ranges.push(Math.abs(high - previousClose), Math.abs(low - previousClose));
    const trueRange = Math.max(...ranges.filter((value) => Number.isFinite(value)));
    if (!Number.isFinite(trueRange)) {
      return null;
    }
    return (trueRange / previousClose) * 100;
  });

  return closeValues.map((closeValue, index) => {
    const close = Number(closeValue);
    if (!Number.isFinite(close) || close <= 0) {
      return null;
    }
    const windowValues = trueRangePercents
      .slice(Math.max(0, index - window + 1), index + 1)
      .filter((value) => Number.isFinite(value));
    if (windowValues.length < window) {
      return null;
    }
    return Number((windowValues.reduce((sum, value) => sum + value, 0) / window).toFixed(2));
  });
}

function createMarketRsChart(canvas, row) {
  if (typeof Chart === "undefined" || !row) {
    return;
  }
  const history = marketRsData.histories?.[row.ticker];
  const labels = marketRsData.historyDates ?? [];
  if (!history || !labels.length) {
    return;
  }

  const minStart = labels[0];
  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, state.rsHistoryRange, minStart, labels);
  const startIndex = Math.max(0, labels.findIndex((label) => label >= startDate));
  const selectedLabels = labels.slice(startIndex);
  const ratingSeries = getMarketRsHistoryRatingSeries(history, state.rsUniverse);
  const selectedRatings = ratingSeries.values.slice(startIndex);
  const fullPrice = history.price ?? [];
  const selectedPrice = fullPrice.slice(startIndex);
  const selectedOpen = (history.open ?? []).slice(startIndex);
  const selectedHigh = (history.high ?? []).slice(startIndex);
  const selectedLow = (history.low ?? []).slice(startIndex);
  const finiteCandleValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const candlestickData = selectedLabels.map((label, index) => ({
    x: label,
    o: finiteCandleValue(selectedOpen[index]),
    h: finiteCandleValue(selectedHigh[index]),
    l: finiteCandleValue(selectedLow[index]),
    c: finiteCandleValue(selectedPrice[index]),
    changePct: (() => {
      const currentClose = finiteCandleValue(fullPrice[startIndex + index]);
      const previousClose = finiteCandleValue(fullPrice[startIndex + index - 1]);
      return Number.isFinite(currentClose) && Number.isFinite(previousClose) && previousClose !== 0
        ? ((currentClose / previousClose) - 1) * 100
        : null;
    })(),
  }));
  const useCandlestick = state.rsPriceChartType !== "line"
    && candlestickData.some((candle) => [candle.o, candle.h, candle.l, candle.c].every(Number.isFinite));
  const emaSeries = Object.fromEntries(
    MARKET_RS_CHART_SERIES.filter((series) => series.period).map((series) => [
      series.key,
      calculateEmaSeries(fullPrice, series.period).slice(startIndex),
    ]),
  );
  const edgePaddingCount = Math.max(1, Math.min(10, Math.round(selectedLabels.length * 0.012)));
  const padSeries = (values) => [
    ...Array(edgePaddingCount).fill(null),
    ...values,
    ...Array(edgePaddingCount).fill(null),
  ];
  const chartLabels = [
    ...Array.from({ length: edgePaddingCount }, (_, index) => `__rs_left_${index}`),
    ...selectedLabels,
    ...Array.from({ length: edgePaddingCount }, (_, index) => `__rs_right_${index}`),
  ];
  const paddedEmaSeries = Object.fromEntries(
    Object.entries(emaSeries).map(([key, values]) => [key, padSeries(values)]),
  );
  const paddedPrice = padSeries(selectedPrice);
  const firstDataIndex = edgePaddingCount;
  const latestDataIndex = firstDataIndex + selectedLabels.length - 1;
  const ratingValues = selectedRatings.filter((value) => Number.isFinite(value));
  const priceValues = [
    ...selectedPrice,
    ...(useCandlestick ? selectedHigh : []),
    ...(useCandlestick ? selectedLow : []),
    ...MARKET_RS_CHART_SERIES.filter((series) => series.period && isMarketRsChartSeriesVisible(series.key)).flatMap((series) => emaSeries[series.key] ?? []),
  ].filter((value) => Number.isFinite(value));
  let ratingMin = ratingValues.length ? Math.floor((Math.min(...ratingValues) - 3) / 5) * 5 : 1;
  let ratingMax = ratingValues.length ? Math.ceil((Math.max(...ratingValues) + 3) / 5) * 5 : 99;
  if (ratingMax - ratingMin < 12) {
    const mid = (ratingMax + ratingMin) / 2;
    ratingMin = Math.floor((mid - 6) / 5) * 5;
    ratingMax = Math.ceil((mid + 6) / 5) * 5;
  }
  ratingMin = Math.max(1, ratingMin);
  ratingMax = Math.min(99, ratingMax);
  let priceMin = priceValues.length ? Math.min(...priceValues) : (row.price ?? 0);
  let priceMax = priceValues.length ? Math.max(...priceValues) : (row.price ?? 0);
  if (Number.isFinite(priceMin) && Number.isFinite(priceMax)) {
    if (priceMin === priceMax) {
      const pad = Math.max(1, priceMax * 0.05);
      priceMin -= pad;
      priceMax += pad;
    } else {
      const pad = (priceMax - priceMin) * 0.08;
      priceMin = Math.max(0, priceMin - pad);
      priceMax += pad;
    }
  }
  const earningsMarkers = buildMarketRsEarningsMarkers(row, selectedLabels, selectedPrice);
  const interactionMode = ensureMarketRsInteractionMode();
  const ratingLatestIndex = getLastFiniteSeriesIndex(selectedRatings);
  const priceLatestIndex = getLastFiniteSeriesIndex(selectedPrice);
  const ratingLabelUniverse = getMarketRsUniverseLabel(ratingSeries.universeKey);

  const priceDataset = useCandlestick
    ? {
        type: "line",
        label: "Stock Price(R) · Candle",
        data: paddedPrice,
        borderColor: "#111827",
        backgroundColor: "#111827",
        showLine: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 8,
        pointStyle: "rect",
        yAxisID: "y1",
        isCandlestick: true,
        ohlc: padSeries(candlestickData),
      }
    : {
        type: "line",
        label: "Stock Price(R) · Line",
        data: paddedPrice,
        borderColor: "#111827",
        backgroundColor: "#111827",
        borderWidth: 2,
        tension: 0.18,
        spanGaps: true,
        pointRadius: (context) => (context.dataIndex === priceLatestIndex + firstDataIndex ? 3 : 0),
        pointHoverRadius: 4,
        yAxisID: "y1",
      };
  const dailyReturnDataset = useCandlestick
    ? {
        type: "line",
        label: "1D Return",
        data: paddedPrice,
        borderColor: "transparent",
        backgroundColor: "transparent",
        borderWidth: 0,
        showLine: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        yAxisID: "y1",
        isDailyReturn: true,
        dailyReturns: padSeries(candlestickData.map((candle) => candle.changePct)),
      }
    : null;

  const chartDatasets = [
    {
      label: `RS Rating(L) (${ratingLabelUniverse})`,
      data: padSeries(selectedRatings),
      borderColor: "#d93025",
      backgroundColor: "#d93025",
      borderWidth: 2.6,
      tension: 0.18,
      spanGaps: true,
      pointRadius: (context) => (context.dataIndex === ratingLatestIndex + firstDataIndex ? 3 : 0),
      pointHoverRadius: 4,
      yAxisID: "y",
      hidden: !isMarketRsChartSeriesVisible("rs"),
    },
    priceDataset,
    ...(dailyReturnDataset ? [dailyReturnDataset] : []),
    ...MARKET_RS_CHART_SERIES.filter((series) => series.period).map((series) => ({
      label: series.label,
      data: paddedEmaSeries[series.key] ?? [],
      borderColor: series.color,
      backgroundColor: series.color,
      borderWidth: series.period >= 50 ? 1.8 : 1.6,
      borderDash: [5, 5],
      tension: 0.18,
      spanGaps: true,
      pointRadius: (context) => (context.dataIndex === getLastFiniteSeriesIndex(emaSeries[series.key]) + firstDataIndex ? 2 : 0),
      pointHoverRadius: 3,
      yAxisID: "y1",
      hidden: !isMarketRsChartSeriesVisible(series.key),
      isMovingAverage: true,
    })),
    {
      type: "scatter",
      label: "EPS Surprise",
      data: earningsMarkers.data,
      borderColor: earningsMarkers.colors,
      backgroundColor: earningsMarkers.colors,
      pointStyle: "triangle",
      pointRotation: earningsMarkers.rotations,
      pointRadius: earningsMarkers.data.length ? 7 : 0,
      pointHoverRadius: 9,
      pointHitRadius: 12,
      yAxisID: "yEarnings",
      showLine: false,
      order: -1,
      isEarningsSurprise: true,
    },
  ];

  const chart = new Chart(canvas, {
    type: "line",
    plugins: [MARKET_RS_CANDLESTICK_PLUGIN],
    data: {
      labels: chartLabels,
      datasets: chartDatasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: {
        padding: { left: 16, right: 16 },
      },
      interaction: { mode: interactionMode, axis: "x", intersect: false },
      onHover: (_, activeElements) => {
        const activeElement = activeElements?.[0];
        const activeDataset = chart.data.datasets[activeElement?.datasetIndex];
        const earningsDate = activeDataset?.isEarningsSurprise
          ? activeDataset.data?.[activeElement?.index]?.chartDate
          : "";
        const hoveredIndex = earningsDate ? chartLabels.indexOf(earningsDate) : activeElement?.index;
        updateMarketRsEmaReadout(chartLabels, paddedEmaSeries, paddedPrice, hoveredIndex);
      },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            filter: (legendItem, chartData) => !chartData.datasets[legendItem.datasetIndex]?.isDailyReturn,
          },
        },
        tooltip: {
          position: "nearest",
          mode: interactionMode,
          intersect: false,
          filter: (context) => !context.dataset.isMovingAverage,
          itemSort: (left, right) => Number(Boolean(right.dataset.isDailyReturn)) - Number(Boolean(left.dataset.isDailyReturn)),
          callbacks: {
            title: (items) => {
              const earningsItem = items?.find((item) => item.dataset.isEarningsSurprise);
              const releaseDate = earningsItem?.raw?.releaseDate;
              return releaseDate ? `Earnings Release ${releaseDate}` : items?.[0]?.label ?? "";
            },
            labelTextColor: (context) => {
              if (!context.dataset.isDailyReturn) {
                return "#f8fafc";
              }
              const changePct = Number(context.dataset.dailyReturns?.[context.dataIndex]);
              return changePct > 0 ? "#34d399" : changePct < 0 ? "#fb7185" : "#cbd5e1";
            },
            label: (context) => {
              if (context.dataset.isDailyReturn) {
                const changePct = Number(context.dataset.dailyReturns?.[context.dataIndex]);
                if (!Number.isFinite(changePct)) {
                  return null;
                }
                const marker = changePct > 0 ? "▲" : changePct < 0 ? "▼" : "•";
                return `${marker} 1D ${formatSignedPercent(changePct)}`;
              }
              if (context.dataset.isEarningsSurprise) {
                const event = context.raw?.earningsEvent;
                const eps = event?.eps ?? {};
                const surprisePct = Number(eps.surprisePct);
                const label = Number.isFinite(surprisePct) && surprisePct < 0 ? "EPS Shock" : "EPS Beat";
                return [
                  `${label} ${formatCanslimEarningsPercent(eps.surprisePct)}`,
                  `Actual ${formatRsFinancialEps(eps.actual)} / Est ${formatRsFinancialEps(eps.estimate)}`,
                  `Diff ${formatCanslimEarningsValue(eps.surpriseValue)}`,
                  Number.isFinite(Number(context.raw?.stockPrice))
                    ? `Stock Price ${context.raw.chartDate}: ${formatUsStockPrice(Number(context.raw.stockPrice))}`
                    : "Stock Price: N/A",
                ];
              }
              if (context.dataset.isCandlestick) {
                const candle = context.dataset.ohlc?.[context.dataIndex];
                if (candle && [candle.o, candle.h, candle.l, candle.c].every(Number.isFinite)) {
                  return [
                    `Open ${formatUsStockPrice(candle.o)} · High ${formatUsStockPrice(candle.h)}`,
                    `Low ${formatUsStockPrice(candle.l)} · Close ${formatUsStockPrice(candle.c)}`,
                  ];
                }
              }
              if (context.dataset.yAxisID === "y") {
                return `${context.dataset.label}: ${Number(context.parsed.y).toFixed(0)}`;
              }
              return `${context.dataset.label}: ${formatUsStockPrice(Number(context.parsed.y))}`;
            },
          },
        },
        zoom: {
          limits: {
            x: { min: "original", max: "original", minRange: 20 },
          },
          pan: {
            enabled: true,
            mode: "x",
            threshold: 5,
            onPanComplete: ({ chart: activeChart }) => {
              fitMarketRsChartYToVisible(activeChart);
              syncMarketRsVolumeChartX(activeChart);
            },
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.08,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            onZoomComplete: ({ chart: activeChart }) => {
              fitMarketRsChartYToVisible(activeChart);
              syncMarketRsVolumeChartX(activeChart);
            },
          },
        },
      },
      scales: {
        x: {
          offset: true,
          grid: { display: false },
          afterBuildTicks: (axis) => {
            const minimumIndex = Number.isFinite(axis.min) ? Math.ceil(axis.min) : 0;
            const maximumIndex = Number.isFinite(axis.max) ? Math.floor(axis.max) : chartLabels.length - 1;
            const indexes = buildRegularDateTickIndexes(selectedLabels, state.rsHistoryRange)
              .map((index) => index + firstDataIndex)
              .filter((index) => index >= minimumIndex && index <= maximumIndex);
            axis.ticks = indexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8a8a83",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index, ticks) => {
              const labelIndex = ticks?.[index]?.value;
              return formatRangeAxisDate(selectedLabels[labelIndex - firstDataIndex], state.rsHistoryRange);
            },
          },
        },
        y: {
          display: isMarketRsChartSeriesVisible("rs"),
          position: "left",
          min: ratingMin,
          max: ratingMax,
          grid: { color: "rgba(28,28,26,0.08)" },
          ticks: {
            color: "#a12620",
            stepSize: ratingMax - ratingMin <= 20 ? 5 : 10,
            callback: (value) => value,
          },
        },
        y1: {
          position: "right",
          min: priceMin,
          max: priceMax,
          grid: { drawOnChartArea: false },
          ticks: {
            color: "#111827",
            callback: (value) => formatUsStockPrice(Number(value), value >= 100 ? 0 : 2),
          },
        },
        yEarnings: {
          display: false,
          min: 0,
          max: 1,
          grid: { display: false },
          ticks: { display: false },
          border: { display: false },
        },
      },
    },
  });

  chart.$marketRsDataBounds = {
    firstIndex: firstDataIndex,
    latestIndex: latestDataIndex,
    edgePaddingCount,
  };
  marketRsDetailChart = chart;
  attachMarketRsYAxisDrag(chart);
  updateMarketRsEmaReadout(chartLabels, paddedEmaSeries, paddedPrice, latestDataIndex);
  charts.push(chart);
}

function formatMarketRsVolume(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  if (Math.abs(numeric) >= 1_000_000_000) {
    return `${(numeric / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(numeric) >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(numeric) >= 1_000) {
    return `${(numeric / 1_000).toFixed(0)}K`;
  }
  return numeric.toFixed(0);
}

function syncMarketRsVolumeChartX(priceChart = marketRsDetailChart) {
  const sourceX = priceChart?.scales?.x;
  const targetX = marketRsVolumeChart?.options?.scales?.x;
  if (!sourceX || !targetX) {
    return;
  }
  const nextMin = Number.isFinite(sourceX.min) ? sourceX.min : undefined;
  const nextMax = Number.isFinite(sourceX.max) ? sourceX.max : undefined;
  if (targetX.min === nextMin && targetX.max === nextMax) {
    return;
  }
  if (nextMin === undefined) {
    delete targetX.min;
  } else {
    targetX.min = nextMin;
  }
  if (nextMax === undefined) {
    delete targetX.max;
  } else {
    targetX.max = nextMax;
  }
  marketRsVolumeChart.update("none");
}

function createMarketRsVolumeChart(canvas, row) {
  if (typeof Chart === "undefined" || !canvas || !row || !isMarketRsVolumeVisible()) {
    return;
  }
  const history = marketRsData.histories?.[row.ticker];
  const labels = marketRsData.historyDates ?? [];
  if (!history || !labels.length) {
    return;
  }

  const minStart = labels[0];
  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, state.rsHistoryRange, minStart, labels);
  const startIndex = Math.max(0, labels.findIndex((label) => label >= startDate));
  const selectedLabels = labels.slice(startIndex);
  const fullPrice = history.price ?? [];
  const selectedVolume = (history.volume ?? []).slice(startIndex).map((value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
  });
  if (!selectedVolume.some((value) => Number.isFinite(value))) {
    return;
  }

  const edgePaddingCount = Math.max(1, Math.min(10, Math.round(selectedLabels.length * 0.012)));
  const padSeries = (values, paddingValue = null) => [
    ...Array(edgePaddingCount).fill(paddingValue),
    ...values,
    ...Array(edgePaddingCount).fill(paddingValue),
  ];
  const chartLabels = [
    ...Array.from({ length: edgePaddingCount }, (_, index) => `__rs_left_${index}`),
    ...selectedLabels,
    ...Array.from({ length: edgePaddingCount }, (_, index) => `__rs_right_${index}`),
  ];
  const barColors = selectedLabels.map((_, index) => {
    const close = Number(fullPrice[startIndex + index]);
    const previousClose = Number(fullPrice[startIndex + index - 1]);
    if (!Number.isFinite(close) || !Number.isFinite(previousClose)) {
      return "rgba(100, 116, 139, 0.58)";
    }
    return close >= previousClose ? "rgba(8, 153, 129, 0.72)" : "rgba(242, 54, 69, 0.72)";
  });

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Volume",
          data: padSeries(selectedVolume),
          backgroundColor: padSeries(barColors, "transparent"),
          borderWidth: 0,
          borderRadius: 1,
          maxBarThickness: 16,
          categoryPercentage: 0.9,
          barPercentage: 0.92,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { left: 16, right: 16 } },
      interaction: { mode: "index", axis: "x", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `Volume ${formatMarketRsVolume(context.parsed.y)} shares`,
          },
        },
      },
      scales: {
        x: {
          offset: true,
          display: false,
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          position: "right",
          grid: { color: "rgba(28, 28, 26, 0.07)" },
          ticks: {
            color: "#69706a",
            maxTicksLimit: 3,
            callback: (value) => formatMarketRsVolume(value),
          },
        },
      },
    },
  });
  marketRsVolumeChart = chart;
  charts.push(chart);
  syncMarketRsVolumeChartX();
}

function createMarketRsMddChart(canvas, row) {
  if (typeof Chart === "undefined" || !canvas || !row) {
    return;
  }
  const history = marketRsData.histories?.[row.ticker];
  const labels = marketRsData.historyDates ?? [];
  if (!history || !labels.length) {
    return;
  }

  const minStart = labels[0];
  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, state.rsHistoryRange, minStart, labels);
  const startIndex = Math.max(0, labels.findIndex((label) => label >= startDate));
  const selectedLabels = labels.slice(startIndex);
  const selectedPrice = (history.price ?? []).slice(startIndex);
  const drawdownSeries = calculateDrawdownSeries(selectedPrice);
  const drawdownValues = drawdownSeries.filter((value) => Number.isFinite(value));
  const latestDrawdownIndex = getLastFiniteSeriesIndex(drawdownSeries);
  let minDrawdown = drawdownValues.length ? Math.floor((Math.min(...drawdownValues) - 2) / 5) * 5 : -10;
  minDrawdown = Math.min(-5, minDrawdown);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: selectedLabels,
      datasets: [
        {
          label: "Stock MDD",
          data: drawdownSeries,
          borderColor: "#b42318",
          backgroundColor: "rgba(220, 38, 38, 0.13)",
          borderWidth: 2.2,
          fill: "origin",
          tension: 0.16,
          spanGaps: true,
          pointRadius: (context) => (context.dataIndex === latestDrawdownIndex ? 3 : 0),
          pointHoverRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `Stock MDD: ${formatSignedPercent(Number(context.parsed.y))}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            const indexes = buildRegularDateTickIndexes(selectedLabels, state.rsHistoryRange);
            axis.ticks = indexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8a8a83",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index, ticks) => {
              const labelIndex = ticks?.[index]?.value;
              return formatRangeAxisDate(selectedLabels[labelIndex], state.rsHistoryRange);
            },
          },
        },
        y: {
          min: minDrawdown,
          max: 0,
          grid: { color: "rgba(28,28,26,0.08)" },
          ticks: {
            color: "#9f1d1d",
            callback: (value) => `${Number(value).toFixed(0)}%`,
          },
        },
      },
    },
  });

  charts.push(chart);
}

function createMarketRsAtrChart(canvas, row) {
  if (typeof Chart === "undefined" || !canvas || !row) {
    return;
  }
  const history = marketRsData.histories?.[row.ticker];
  const labels = marketRsData.historyDates ?? [];
  if (!history || !labels.length) {
    return;
  }

  const minStart = labels[0];
  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, state.rsHistoryRange, minStart, labels);
  const startIndex = Math.max(0, labels.findIndex((label) => label >= startDate));
  const selectedLabels = labels.slice(startIndex);
  const storedAtrSeries = Array.isArray(history.atr21Pct) && history.atr21Pct.length === labels.length
    ? history.atr21Pct.map((value) => {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
      })
    : null;
  const atrSeries = storedAtrSeries ?? calculateAtrPctSeries(history.high ?? [], history.low ?? [], history.price ?? []);
  const selectedAtr = atrSeries.slice(startIndex);
  const atrValues = selectedAtr.filter((value) => Number.isFinite(value));
  const latestAtrIndex = getLastFiniteSeriesIndex(selectedAtr);
  const atrAverage = atrValues.length
    ? atrValues.reduce((sum, value) => sum + value, 0) / atrValues.length
    : null;
  const averageSeries = selectedAtr.map((value) => (Number.isFinite(value) && Number.isFinite(atrAverage) ? Number(atrAverage.toFixed(2)) : null));
  const atrMax = atrValues.length ? Math.max(...atrValues) : Number(row.atr21Pct);
  const yMax = Number.isFinite(atrMax) ? Math.ceil((atrMax + 1) / 2) * 2 : 10;

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: selectedLabels,
      datasets: [
        {
          label: "21D ATR%",
          data: selectedAtr,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          borderWidth: 2.2,
          fill: true,
          tension: 0.16,
          spanGaps: true,
          pointRadius: (context) => (context.dataIndex === latestAtrIndex ? 3 : 0),
          pointHoverRadius: 4,
        },
        {
          label: "Selected-period avg",
          data: averageSeries,
          borderColor: "#94a3b8",
          backgroundColor: "#94a3b8",
          borderWidth: 1.4,
          borderDash: [5, 5],
          tension: 0,
          spanGaps: true,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatAtrPercent(Number(context.parsed.y))}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            const indexes = buildRegularDateTickIndexes(selectedLabels, state.rsHistoryRange);
            axis.ticks = indexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8a8a83",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index, ticks) => {
              const labelIndex = ticks?.[index]?.value;
              return formatRangeAxisDate(selectedLabels[labelIndex], state.rsHistoryRange);
            },
          },
        },
        y: {
          min: 0,
          max: yMax,
          grid: { color: "rgba(28,28,26,0.08)" },
          ticks: {
            color: "#2563eb",
            callback: (value) => `${Number(value).toFixed(0)}%`,
          },
        },
      },
    },
  });

  charts.push(chart);
}

function renderMarketRsOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  const briefingSectorData = getMarketRsBriefingSectorData();
  if (
    state.rsBriefingSector !== "all" &&
    state.rsBriefingSector !== "briefingAll" &&
    !briefingSectorData.groups.some((sector) => sector.key === state.rsBriefingSector)
  ) {
    state.rsBriefingSector = "briefingAll";
  }
  const rows = getVisibleMarketRsRows(briefingSectorData);
  const monitoringUniverse = "all";
  const monitoringBaseRows = marketRsData.rows ?? [];
  const selected =
    state.rsMonitorSelectedTicker === state.rsSelectedTicker
      ? monitoringBaseRows.find((row) => row.ticker === state.rsMonitorSelectedTicker) ?? getSelectedMarketRsRow(rows)
      : getSelectedMarketRsRow(rows);
  if (selected) {
    state.rsSelectedTicker = selected.ticker;
  }

  const universeChips = Object.entries(marketRsData.universes ?? {})
    .map(
      ([key, meta]) => `
        <button
          type="button"
          class="market-rs-chip${state.rsUniverse === key ? " active" : ""}"
          data-rs-universe="${key}"
        >${meta.label}</button>
      `,
    )
    .join("");
  const historyRangeByKey = new Map((marketRsData.historyRanges ?? []).map((range) => [range.key, range]));
  const chartRangeChips = ["1m", "3m", "6m", "1y", "3y", "ytd"]
    .map((key) => historyRangeByKey.get(key) ?? { key, label: key.toUpperCase() })
    .map(
      (range) => `
        <button
          type="button"
          class="market-rs-chip${state.rsHistoryRange === range.key ? " active" : ""}"
          data-rs-range="${range.key}"
          aria-pressed="${state.rsHistoryRange === range.key ? "true" : "false"}"
        >${range.label}</button>
      `,
    )
    .join("");
  const filterChips = `
    <button type="button" class="market-rs-chip${state.rsFilter === "all" ? " active" : ""}" data-rs-filter="all">All Ratings</button>
    <button type="button" class="market-rs-chip${state.rsFilter === "newHigh3m" ? " active" : ""}" data-rs-filter="newHigh3m">RS New High (3M)</button>
    <button type="button" class="market-rs-chip${state.rsFilter === "newHigh1y" || state.rsFilter === "newHigh" ? " active" : ""}" data-rs-filter="newHigh1y">RS New High (1Y)</button>
    <button type="button" class="market-rs-chip${state.rsFilter === "priceNewHigh3m" ? " active" : ""}" data-rs-filter="priceNewHigh3m">Stock Price New High (3M)</button>
    <button type="button" class="market-rs-chip${state.rsFilter === "priceNewHigh1y" ? " active" : ""}" data-rs-filter="priceNewHigh1y">Stock Price New High (1Y)</button>
  `;
  const briefingSectorChips = [
    { key: "all", label: "All RS", count: marketRsData.rows?.length ?? 0 },
    { key: "briefingAll", label: "Daily Briefing 전체", count: briefingSectorData.allTickers.length },
    ...briefingSectorData.groups.map((sector) => ({
      key: sector.key,
      label: sector.label,
      count: sector.tickers.length,
    })),
  ]
    .map(
      (sector) => `
        <button
          type="button"
          class="market-rs-chip market-rs-sector-chip${state.rsBriefingSector === sector.key ? " active" : ""}"
          data-rs-briefing-sector="${sector.key}"
        >${sector.label}<small>${sector.count}</small></button>
      `,
    )
    .join("");
  const marketCapChips = MARKET_RS_CAP_RANGES.map(
    (range) => `
      <button
        type="button"
        class="market-rs-chip${state.rsMarketCapRange === range.key ? " active" : ""}"
        data-rs-market-cap="${range.key}"
      >${range.label}</button>
    `,
  ).join("");
  const scoreChips = MARKET_RS_SCORE_RANGES.map(
    (range) => `
      <button
        type="button"
        class="market-rs-chip${state.rsScoreRange === range.key ? " active" : ""}"
        data-rs-score-range="${range.key}"
      >${range.label}</button>
    `,
  ).join("");
  const leaderSortChips = [
    { key: "rs", label: "RS" },
    { key: "marketCapDesc", label: "Market Cap ↓" },
    { key: "marketCapAsc", label: "Market Cap ↑" },
  ]
    .map(
      (item) => `
        <button
          type="button"
          class="market-rs-chip${state.rsLeaderSort === item.key ? " active" : ""}"
          data-rs-leader-sort="${item.key}"
        >${item.label}</button>
      `,
    )
    .join("");
  const tableSortRows = sortMarketRsTableRows(rows);
  const sortedLeaderRows = sortMarketRsLeaderRows(rows);
  const leaderRows = sortedLeaderRows;
  const rsCardLimit = ENABLE_RS_LIMITED_CARDS
    ? Math.max(RS_CARD_BATCH_SIZE, Number(state.rsVisibleCardCount) || RS_CARD_BATCH_SIZE)
    : leaderRows.length;
  const rsCardRows = ENABLE_RS_LIMITED_CARDS ? leaderRows.slice(0, rsCardLimit) : leaderRows;
  const hasMoreRsCards = ENABLE_RS_LIMITED_CARDS && rsCardRows.length < leaderRows.length;
  const activeNewHighKind = getMarketRsFilterNewHighKind() ?? "rs";
  const activeNewHighWindow = getMarketRsFilterNewHighWindow() ?? "1y";
  const activeNewHighLabel = getMarketRsNewHighLabel(activeNewHighWindow, activeNewHighKind);
  const briefingTickerSet = new Set(briefingSectorData.allTickers);
  const newHighMonitorRows = monitoringBaseRows
    .filter((row) => !state.rsNewHighBriefingOnly || briefingTickerSet.has(row.ticker))
    .filter((row) => !state.rsNewHighLargeCapOnly || Number(row.marketCap) > 10_000_000_000);
  const newHighPanels = [
    {
      title: "RS New High 3M",
      tone: "rs",
      rows: newHighMonitorRows.filter((row) => getMarketRsUniverseNewHigh(row, monitoringUniverse, "3m")),
    },
    {
      title: "RS New High 1Y",
      tone: "rs",
      rows: newHighMonitorRows.filter((row) => getMarketRsUniverseNewHigh(row, monitoringUniverse, "1y")),
    },
    {
      title: "Price New High 3M",
      tone: "price",
      rows: newHighMonitorRows.filter((row) => getMarketRsPriceNewHigh(row, "3m")),
    },
    {
      title: "Price New High 1Y",
      tone: "price",
      rows: newHighMonitorRows.filter((row) => getMarketRsPriceNewHigh(row, "1y")),
    },
  ]
    .map((panel) => {
      const panelRows = [...panel.rows].sort((left, right) => {
        const scoreDifference =
          (getMarketRsUniverseScore(right, monitoringUniverse) ?? -Infinity) -
          (getMarketRsUniverseScore(left, monitoringUniverse) ?? -Infinity);
        if (scoreDifference !== 0) {
          return scoreDifference;
        }
        const capDifference = (Number(right.marketCap) || 0) - (Number(left.marketCap) || 0);
        return capDifference || String(left.ticker).localeCompare(String(right.ticker));
      });
      const panelItems = panelRows
        .map((row) => {
          const sectorLabel = getMarketRsBriefingSectorLabels(row, briefingSectorData)
            .slice(0, 2)
            .join(", ");
          return `
            <button type="button" class="market-rs-new-high-item" data-rs-ticker="${row.ticker}" data-rs-monitor-item>
              <strong>${row.ticker}</strong>
              <span class="market-rs-new-high-meta">
                <b>RS ${formatRsNumber(getMarketRsUniverseScore(row, monitoringUniverse))}</b>
                ${sectorLabel ? `<em title="${sectorLabel}">${sectorLabel}</em>` : ""}
              </span>
              <small>${formatMarketCapCompact(row.marketCap)}</small>
            </button>
          `;
        })
        .join("");
      return `
        <article class="market-rs-new-high-panel is-${panel.tone}">
          <div class="market-rs-new-high-title">
            <h3>${panel.title}</h3>
            <span>${panelRows.length}</span>
          </div>
          <div class="market-rs-new-high-list">
            ${panelItems || '<p class="market-rs-empty">해당 종목이 없습니다.</p>'}
          </div>
        </article>
      `;
    })
    .join("");
  const periodLeaderRows = monitoringBaseRows
    .filter((row) => !state.rsPeriodLeadersBriefingOnly || briefingTickerSet.has(row.ticker))
    .filter((row) => !state.rsPeriodLeadersLargeCapOnly || Number(row.marketCap) > 10_000_000_000);
  const periodLeaderPanels = [
    { key: "1w", label: "RS 1W" },
    { key: "2w", label: "RS 2W" },
    { key: "1m", label: "RS 1M" },
    { key: "3m", label: "RS 3M" },
    { key: "6m", label: "RS 6M" },
  ]
    .map((period) => {
      const panelRows = periodLeaderRows
        .filter((row) => Number.isFinite(Number(row.rsPeriods?.[period.key])))
        .sort((left, right) => {
          const periodDifference = Number(right.rsPeriods?.[period.key]) - Number(left.rsPeriods?.[period.key]);
          if (periodDifference !== 0) {
            return periodDifference;
          }
          const scoreDifference =
            (getMarketRsUniverseScore(right, monitoringUniverse) ?? -Infinity) -
            (getMarketRsUniverseScore(left, monitoringUniverse) ?? -Infinity);
          if (scoreDifference !== 0) {
            return scoreDifference;
          }
          const capDifference = (Number(right.marketCap) || 0) - (Number(left.marketCap) || 0);
          return capDifference || String(left.ticker).localeCompare(String(right.ticker));
        });
      const panelItems = panelRows
        .map(
          (row, index) => `
            <button type="button" class="market-rs-period-item" data-rs-ticker="${row.ticker}" data-rs-monitor-item>
              <span class="market-rs-period-rank">${index + 1}</span>
              <span class="market-rs-period-identity">
                <strong>${escapeHtml(row.ticker)}</strong>
                <small title="${escapeHtml(row.name)}">${escapeHtml(row.name)} · ${formatMarketCapCompact(row.marketCap)}</small>
              </span>
              <b>${formatRsNumber(row.rsPeriods?.[period.key])}</b>
            </button>
          `,
        )
        .join("");
      return `
        <article class="market-rs-period-panel">
          <div class="market-rs-period-title">
            <div>
              <small>PERIOD LEADERS</small>
              <h3>${period.label}</h3>
            </div>
            <span>${panelRows.length} NAMES</span>
          </div>
          <div class="market-rs-period-list">
            ${panelItems || '<p class="market-rs-empty">해당 종목이 없습니다.</p>'}
          </div>
        </article>
      `;
    })
    .join("");
  const leaderCards = rsCardRows
    .map((row) => {
      const score = getMarketRsUniverseScore(row, state.rsUniverse);
      const briefingSectorLabel = formatMarketRsBriefingSectorLabels(row, briefingSectorData);
      return `
        <button
          type="button"
          class="market-rs-card${state.rsSelectedTicker === row.ticker ? " active" : ""}"
          data-rs-ticker="${row.ticker}"
        >
          <div class="market-rs-card-top">
            <span class="market-rs-card-ticker">${row.ticker}</span>
            <span class="market-rs-card-score">${formatRsNumber(score)}</span>
          </div>
          <p class="market-rs-card-name">${row.name}</p>
          <p class="market-rs-card-cap">${formatMarketCapCompact(row.marketCap)}</p>
          <div class="market-rs-card-meta">
            <span>RS_1M</span>
            <strong>${formatRsNumber(row.rsPeriods?.["1m"])}</strong>
          </div>
          <div class="market-rs-card-meta">
            <span>RS_3M</span>
            <strong>${formatRsNumber(row.rsPeriods?.["3m"])}</strong>
          </div>
          <div class="market-rs-card-meta">
            <span>ATR%</span>
            <strong>${formatAtrPercent(row.atr21Pct)}</strong>
          </div>
          <div class="market-rs-card-meta">
            <span>Briefing</span>
            <strong>${briefingSectorLabel}</strong>
          </div>
          ${matchesMarketRsNewHighFilter(row, state.rsUniverse, state.rsFilter === "all" ? "newHigh1y" : state.rsFilter) ? `<div class="market-rs-flag">${activeNewHighLabel}</div>` : ""}
        </button>
      `;
    })
    .join("");
  const leaderCardMoreMarkup = hasMoreRsCards
    ? `
      <div class="market-rs-card-more">
        <span>${rsCardRows.length} / ${leaderRows.length} names</span>
        <button type="button" class="total-date-button" data-rs-show-more>더 보기 +${Math.min(RS_CARD_BATCH_SIZE, leaderRows.length - rsCardRows.length)}</button>
      </div>
    `
    : ENABLE_RS_LIMITED_CARDS && leaderRows.length
      ? `<p class="market-rs-empty market-rs-card-count">${leaderRows.length} names all loaded.</p>`
      : "";
  const tableRows = tableSortRows
    .map((row) => {
      const score = getMarketRsUniverseScore(row, state.rsUniverse);
      return `
        <tr data-rs-ticker="${row.ticker}">
          <td>${row.ticker}</td>
          <td>${row.name}</td>
          <td>${formatMarketRsBriefingSectorLabels(row, briefingSectorData, 3)}</td>
          <td>${formatMarketCapCompact(row.marketCap)}</td>
          <td>${formatRsNumber(score)}</td>
          <td>${formatRsNumber(row.rsPeriods?.["1w"])}</td>
          <td>${formatRsNumber(row.rsPeriods?.["2w"])}</td>
          <td>${formatRsNumber(row.rsPeriods?.["1m"])}</td>
          <td>${formatRsNumber(row.rsPeriods?.["3m"])}</td>
          <td>${formatRsNumber(row.rsPeriods?.["6m"])}</td>
          <td>${formatAtrPercent(row.atr21Pct)}</td>
          <td>${formatRsGapPercent(row.distanceTo52wHighPct)}</td>
          <td>${getMarketRsUniverseNewHigh(row, state.rsUniverse, "3m") ? "3M" : "-"} / ${getMarketRsUniverseNewHigh(row, state.rsUniverse, "1y") ? "1Y" : "-"}</td>
          <td>${getMarketRsPriceNewHigh(row, "3m") ? "3M" : "-"} / ${getMarketRsPriceNewHigh(row, "1y") ? "1Y" : "-"}</td>
        </tr>
      `;
    })
    .join("");
  const extension = selected?.extension ?? {};
  const extensionMarkup = ["ema21", "sma50"]
    .map((key) => renderMarketRsExtensionGauge(extension[key]))
    .join("");
  const rsChartSeriesChips = MARKET_RS_CHART_SERIES.map(
    (series) => `
      <button
        type="button"
        class="market-rs-chip market-rs-chart-series-chip${isMarketRsChartSeriesVisible(series.key) ? " active" : ""}"
        data-rs-chart-series="${series.key}"
        style="--series-color:${series.color}"
      >
        <i></i>${series.label}
      </button>
    `,
  ).join("");
  const rsPriceChartTypeButtons = MARKET_RS_PRICE_CHART_TYPES.map(
    (chartType) => `
      <button
        type="button"
        class="market-rs-price-style-button${state.rsPriceChartType === chartType.key ? " active" : ""}"
        data-rs-price-chart-type="${chartType.key}"
        aria-pressed="${state.rsPriceChartType === chartType.key ? "true" : "false"}"
      >${chartType.label}</button>
    `,
  ).join("");
  const rsChartZoomButtons = `
    <div class="market-rs-chart-zoom-controls" role="group" aria-label="RS chart zoom controls">
      <button type="button" data-rs-chart-zoom="in" aria-label="Zoom in" title="Zoom in">+</button>
      <button type="button" data-rs-chart-zoom="out" aria-label="Zoom out" title="Zoom out">-</button>
      <button type="button" class="market-rs-chart-zoom-reset" data-rs-chart-zoom="reset">Reset</button>
    </div>
  `;

  usOverviewRoot.innerHTML = `
    <section class="market-rs-overview">
      <section class="market-rs-new-high-board" aria-label="RS and price new highs">
        <div class="market-rs-new-high-board-head">
          <div>
            <h2>New High Monitor</h2>
            <p>${getMarketRsUniverseLabel(monitoringUniverse)} universe · RS Rating descending · 7 visible · scroll for all names</p>
          </div>
          <div class="market-rs-period-controls">
            <label class="market-rs-new-high-cap-toggle">
              <input type="checkbox" data-rs-new-high-briefing-only ${state.rsNewHighBriefingOnly ? "checked" : ""} />
              <span>Daily Briefing 종목만</span>
            </label>
            <label class="market-rs-new-high-cap-toggle">
              <input type="checkbox" data-rs-new-high-large-cap ${state.rsNewHighLargeCapOnly ? "checked" : ""} />
              <span>$10B 이하 제외</span>
            </label>
          </div>
        </div>
        <div class="market-rs-new-high-grid">${newHighPanels}</div>
      </section>

      <section class="market-rs-period-board" aria-label="Period RS leaders">
        <div class="market-rs-new-high-board-head">
          <div>
            <h2>기간별 RS Leaders</h2>
            <p>${getMarketRsUniverseLabel(monitoringUniverse)} universe · 각 기간 RS 내림차순 · 7 visible · scroll for all names · 동점은 종합 RS와 시가총액 순</p>
          </div>
          <div class="market-rs-period-controls">
            <label class="market-rs-new-high-cap-toggle">
              <input type="checkbox" data-rs-period-briefing-only ${state.rsPeriodLeadersBriefingOnly ? "checked" : ""} />
              <span>Daily Briefing 종목만</span>
            </label>
            <label class="market-rs-new-high-cap-toggle">
              <input type="checkbox" data-rs-period-large-cap ${state.rsPeriodLeadersLargeCapOnly ? "checked" : ""} />
              <span>$10B 이하 제외</span>
            </label>
            <span class="market-rs-period-eligible">${periodLeaderRows.length} eligible</span>
          </div>
        </div>
        <div class="market-rs-period-grid">${periodLeaderPanels}</div>
      </section>

      <article class="us-panel">
        <div class="us-section-head market-rs-head">
          <div>
            <h2>Relative Strength</h2>
            <p>${marketRsData.scoring?.description ?? ""}</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">As of ${marketRsData.updatedAt ?? "-"}</span>
            <span class="market-rs-pill">${rows.length} names</span>
            <span class="market-rs-pill">${rows.filter((row) => getMarketRsUniverseNewHigh(row, state.rsUniverse, "3m")).length} 3M RS highs</span>
            <span class="market-rs-pill">${rows.filter((row) => getMarketRsUniverseNewHigh(row, state.rsUniverse, "1y")).length} 1Y RS highs</span>
            <span class="market-rs-pill">${rows.filter((row) => getMarketRsPriceNewHigh(row, "3m")).length} 3M price highs</span>
            <span class="market-rs-pill">${rows.filter((row) => getMarketRsPriceNewHigh(row, "1y")).length} 1Y price highs</span>
            <span class="market-rs-pill">${getMarketRsBriefingSectorLabel(state.rsBriefingSector, briefingSectorData)}</span>
            <span class="market-rs-pill">Sorted 99 → 1</span>
          </div>
        </div>
        <div class="market-rs-controls">
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Universe</span>
            <div class="market-rs-chip-row">${universeChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Filter</span>
            <div class="market-rs-chip-row">${filterChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Daily Briefing Sector</span>
            <div class="market-rs-chip-row market-rs-briefing-sector-row">${briefingSectorChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Market Cap</span>
            <div class="market-rs-chip-row">${marketCapChips}</div>
            <div class="market-rs-cap-custom">
              <label>
                <span>Min</span>
                <input type="text" inputmode="decimal" placeholder="ex. 5B" value="${state.rsCustomMarketCapMin}" data-rs-market-cap-min />
              </label>
              <label>
                <span>Max</span>
                <input type="text" inputmode="decimal" placeholder="optional" value="${state.rsCustomMarketCapMax}" data-rs-market-cap-max />
              </label>
              <button type="button" class="total-date-button" data-rs-market-cap-apply>Apply</button>
              <button type="button" class="total-date-button total-date-button-secondary" data-rs-market-cap-clear>Clear</button>
            </div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">RS Score</span>
            <div class="market-rs-chip-row">${scoreChips}</div>
            <div class="market-rs-cap-custom">
              <label>
                <span>Min</span>
                <input type="number" inputmode="decimal" min="1" max="99" step="1" placeholder="ex. 80" value="${state.rsCustomScoreMin}" data-rs-score-min />
              </label>
              <label>
                <span>Max</span>
                <input type="number" inputmode="decimal" min="1" max="99" step="1" placeholder="optional" value="${state.rsCustomScoreMax}" data-rs-score-max />
              </label>
              <button type="button" class="total-date-button" data-rs-score-apply>Apply</button>
              <button type="button" class="total-date-button total-date-button-secondary" data-rs-score-clear>Clear</button>
            </div>
          </div>
        </div>
      </article>

      <section class="market-rs-layout market-rs-screening-layout">
        <article class="us-panel market-rs-leaders">
          <div class="us-section-head">
            <div>
              <h2>RS Leaders</h2>
              <p>${getMarketRsUniverseLabel(state.rsUniverse)} universe leaders by RS Rating. Showing ${leaderRows.length} names.</p>
            </div>
            <div class="market-rs-chip-row">${leaderSortChips}</div>
          </div>
          <div class="market-rs-card-grid">${leaderCards || '<p class="market-rs-empty">검색 결과가 없습니다.</p>'}</div>
          ${leaderCardMoreMarkup}
        </article>

        <article class="us-panel market-rs-detail">
          <div class="us-section-head">
            <div>
              <h2>${selected?.ticker ?? "-"}</h2>
              <p>${selected?.name ?? "Select a ticker from the table or search box."}</p>
            </div>
            <span class="market-rs-detail-score">${formatRsNumber(getMarketRsUniverseScore(selected ?? {}, state.rsUniverse))}</span>
          </div>
          <div class="market-rs-metrics">
            <div class="market-rs-metric">
              <span>RS Rating</span>
              <strong>${formatRsNumber(getMarketRsUniverseScore(selected ?? {}, state.rsUniverse))}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Market Cap</span>
              <strong>${formatMarketCapCompact(selected?.marketCap)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_1W</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["1w"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_2W</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["2w"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_1M</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["1m"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_3M</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["3m"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_6M</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["6m"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>RS_12M</span>
              <strong>${formatRsNumber(selected?.rsPeriods?.["12m"])}</strong>
            </div>
            <div class="market-rs-metric">
              <span>ATR 21D %</span>
              <strong>${formatAtrPercent(selected?.atr21Pct)}</strong>
            </div>
          </div>
          <div class="market-rs-extension-panel">
            <div class="market-rs-extension-title">
              <strong>ATR Extension</strong>
              <span>Distance from 21 EMA and 50 SMA measured as gap % divided by 21D ATR%.</span>
            </div>
            <div class="market-rs-extension-grid">
              ${extensionMarkup || '<p class="market-rs-empty">Extension data will appear after the next RS data refresh.</p>'}
            </div>
          </div>
          <div class="market-rs-chart-controls">
            <div class="market-rs-chart-control-row market-rs-chart-range-row">
              <span>Chart Range</span>
              <div class="market-rs-chip-row">${chartRangeChips}</div>
            </div>
            <div class="market-rs-chart-control-row">
              <span>Price</span>
              <div class="market-rs-price-style-toggle" role="group" aria-label="Price chart style">${rsPriceChartTypeButtons}</div>
            </div>
            <div class="market-rs-chart-control-row">
              <span>Volume</span>
              <label class="market-rs-volume-toggle">
                <input type="checkbox" data-rs-volume-toggle ${isMarketRsVolumeVisible() ? "checked" : ""} />
                <span>Show volume</span>
              </label>
            </div>
            <div class="market-rs-chart-control-row">
              <span>Chart Lines</span>
              <div class="market-rs-chip-row">${rsChartSeriesChips}</div>
            </div>
            ${rsChartZoomButtons}
          </div>
          <div class="chart-wrap market-rs-chart-wrap">
            <div class="market-rs-ema-readout" data-rs-ema-readout aria-label="Selected EMA values"></div>
            <canvas data-rs-chart="detail"></canvas>
          </div>
          ${isMarketRsVolumeVisible() ? `
            <div class="chart-wrap market-rs-volume-chart-wrap">
              <div class="market-rs-volume-head"><strong>Volume</strong><span>Daily shares</span></div>
              <canvas data-rs-chart="volume"></canvas>
            </div>
          ` : ""}
          <div class="market-rs-risk-chart-grid">
            <div>
              <div class="chart-wrap market-rs-mdd-chart-wrap">
                <canvas data-rs-chart="mdd"></canvas>
              </div>
            </div>
            <div>
              <div class="chart-wrap market-rs-mdd-chart-wrap">
                <canvas data-rs-chart="atr"></canvas>
              </div>
            </div>
          </div>
        </article>
      </section>

      <article class="us-panel market-rs-table-panel">
        <div class="us-section-head">
          <div>
            <h2>Full RS Table</h2>
            <p>Search from the top bar, filter by market-cap range, then click any row to inspect the stock-level daily RS trend.</p>
          </div>
        </div>
        <div class="market-rs-table-wrap">
          <table class="market-rs-table">
            <thead>
              <tr>
                <th>${renderMarketRsSortHeader("Ticker", "ticker")}</th>
                <th>${renderMarketRsSortHeader("Name", "name")}</th>
                <th>Briefing Sector</th>
                <th>${renderMarketRsSortHeader("Market Cap", "marketCap")}</th>
                <th>${renderMarketRsSortHeader("RS", "rs")}</th>
                <th>${renderMarketRsSortHeader("RS_1W", "rs1w")}</th>
                <th>${renderMarketRsSortHeader("RS_2W", "rs2w")}</th>
                <th>${renderMarketRsSortHeader("RS_1M", "rs1m")}</th>
                <th>${renderMarketRsSortHeader("RS_3M", "rs3m")}</th>
                <th>${renderMarketRsSortHeader("RS_6M", "rs6m")}</th>
                <th>${renderMarketRsSortHeader("ATR%", "atr21Pct")}</th>
                <th>${renderMarketRsSortHeader("52W Gap", "gap52w")}</th>
                <th>${renderMarketRsSortHeader("RS NH", "rsNewHigh")}</th>
                <th>${renderMarketRsSortHeader("Price NH", "priceNewHigh")}</th>
              </tr>
            </thead>
            <tbody>${tableRows || '<tr><td colspan="14">검색 결과가 없습니다.</td></tr>'}</tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-rs-universe]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsUniverse = button.dataset.rsUniverse;
      resetRsCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsHistoryRange = button.dataset.rsRange;
      syncMarketRsChartRangeButtons();
      refreshMarketRsChartOnly();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsFilter = button.dataset.rsFilter;
      resetRsCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-briefing-sector]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsBriefingSector = button.dataset.rsBriefingSector || "all";
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-market-cap]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsMarketCapRange = button.dataset.rsMarketCap || "all";
      state.rsCustomMarketCapMin = "";
      state.rsCustomMarketCapMax = "";
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  });
  const rsMarketCapMinInput = usOverviewRoot.querySelector("[data-rs-market-cap-min]");
  const rsMarketCapMaxInput = usOverviewRoot.querySelector("[data-rs-market-cap-max]");
  const rsMarketCapApplyButton = usOverviewRoot.querySelector("[data-rs-market-cap-apply]");
  const rsMarketCapClearButton = usOverviewRoot.querySelector("[data-rs-market-cap-clear]");
  if (rsMarketCapApplyButton && rsMarketCapMinInput && rsMarketCapMaxInput) {
    rsMarketCapApplyButton.addEventListener("click", () => {
      state.rsCustomMarketCapMin = rsMarketCapMinInput.value.trim();
      state.rsCustomMarketCapMax = rsMarketCapMaxInput.value.trim();
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  }
  if (rsMarketCapClearButton) {
    rsMarketCapClearButton.addEventListener("click", () => {
      state.rsCustomMarketCapMin = "";
      state.rsCustomMarketCapMax = "";
      state.rsMarketCapRange = "all";
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-rs-score-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsScoreRange = button.dataset.rsScoreRange || "all";
      state.rsCustomScoreMin = "";
      state.rsCustomScoreMax = "";
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  });
  const rsScoreMinInput = usOverviewRoot.querySelector("[data-rs-score-min]");
  const rsScoreMaxInput = usOverviewRoot.querySelector("[data-rs-score-max]");
  const rsScoreApplyButton = usOverviewRoot.querySelector("[data-rs-score-apply]");
  const rsScoreClearButton = usOverviewRoot.querySelector("[data-rs-score-clear]");
  if (rsScoreApplyButton && rsScoreMinInput && rsScoreMaxInput) {
    rsScoreApplyButton.addEventListener("click", () => {
      state.rsCustomScoreMin = rsScoreMinInput.value.trim();
      state.rsCustomScoreMax = rsScoreMaxInput.value.trim();
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  }
  if (rsScoreClearButton) {
    rsScoreClearButton.addEventListener("click", () => {
      state.rsCustomScoreMin = "";
      state.rsCustomScoreMax = "";
      state.rsScoreRange = "all";
      state.rsSelectedTicker = "";
      resetRsCardLimit();
      render();
    });
  }
  const rsNewHighBriefingToggle = usOverviewRoot.querySelector("[data-rs-new-high-briefing-only]");
  if (rsNewHighBriefingToggle) {
    rsNewHighBriefingToggle.addEventListener("change", () => {
      state.rsNewHighBriefingOnly = rsNewHighBriefingToggle.checked;
      render();
    });
  }
  const rsNewHighLargeCapToggle = usOverviewRoot.querySelector("[data-rs-new-high-large-cap]");
  if (rsNewHighLargeCapToggle) {
    rsNewHighLargeCapToggle.addEventListener("change", () => {
      state.rsNewHighLargeCapOnly = rsNewHighLargeCapToggle.checked;
      render();
    });
  }
  const rsPeriodBriefingToggle = usOverviewRoot.querySelector("[data-rs-period-briefing-only]");
  if (rsPeriodBriefingToggle) {
    rsPeriodBriefingToggle.addEventListener("change", () => {
      state.rsPeriodLeadersBriefingOnly = rsPeriodBriefingToggle.checked;
      render();
    });
  }
  const rsPeriodLargeCapToggle = usOverviewRoot.querySelector("[data-rs-period-large-cap]");
  if (rsPeriodLargeCapToggle) {
    rsPeriodLargeCapToggle.addEventListener("change", () => {
      state.rsPeriodLeadersLargeCapOnly = rsPeriodLargeCapToggle.checked;
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-rs-leader-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.rsLeaderSort = button.dataset.rsLeaderSort || "rs";
      resetRsCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-chart-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const seriesKey = button.dataset.rsChartSeries;
      if (!seriesKey) {
        return;
      }
      state.rsChartSeries = {
        ...state.rsChartSeries,
        [seriesKey]: !isMarketRsChartSeriesVisible(seriesKey),
      };
      syncMarketRsChartSeriesButtons();
      refreshMarketRsChartOnly();
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-price-chart-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const chartType = button.dataset.rsPriceChartType;
      if (!MARKET_RS_PRICE_CHART_TYPES.some((item) => item.key === chartType)) {
        return;
      }
      state.rsPriceChartType = chartType;
      syncMarketRsPriceChartTypeButtons();
      refreshMarketRsChartOnly();
    });
  });
  const rsVolumeToggle = usOverviewRoot.querySelector("[data-rs-volume-toggle]");
  if (rsVolumeToggle) {
    rsVolumeToggle.addEventListener("change", () => {
      state.rsVolumeVisible = rsVolumeToggle.checked;
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-rs-chart-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!marketRsDetailChart) {
        return;
      }
      const action = button.dataset.rsChartZoom;
      if (action === "reset" && typeof marketRsDetailChart.resetZoom === "function") {
        marketRsDetailChart.resetZoom();
        fitMarketRsChartYToVisible(marketRsDetailChart);
        syncMarketRsVolumeChartX(marketRsDetailChart);
      } else if (action === "in") {
        zoomMarketRsChartToLatest("in");
      } else if (action === "out") {
        zoomMarketRsChartToLatest("out");
      }
    });
  });
  usOverviewRoot.querySelectorAll("[data-rs-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSortKey = button.dataset.rsSort;
      if (state.rsTableSortKey === nextSortKey) {
        state.rsTableSortDirection = state.rsTableSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.rsTableSortKey = nextSortKey;
        state.rsTableSortDirection = nextSortKey === "ticker" || nextSortKey === "name" ? "asc" : "desc";
      }
      render();
    });
  });
  const rsShowMoreButton = usOverviewRoot.querySelector("[data-rs-show-more]");
  if (rsShowMoreButton) {
    rsShowMoreButton.addEventListener("click", () => {
      state.rsVisibleCardCount = Math.min(
        leaderRows.length,
        Math.max(RS_CARD_BATCH_SIZE, Number(state.rsVisibleCardCount) || RS_CARD_BATCH_SIZE) + RS_CARD_BATCH_SIZE,
      );
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-rs-ticker]").forEach((element) => {
    element.addEventListener("click", () => {
      if (element.hasAttribute("data-rs-monitor-item")) {
        state.rsMonitorSelectedTicker = element.dataset.rsTicker;
      }
      state.rsSelectedTicker = element.dataset.rsTicker;
      render();
    });
  });

  const detailCanvas = usOverviewRoot.querySelector('[data-rs-chart="detail"]');
  if (detailCanvas && selected) {
    createMarketRsChart(detailCanvas, selected);
    createMarketRsVolumeChart(usOverviewRoot.querySelector('[data-rs-chart="volume"]'), selected);
    createMarketRsMddChart(usOverviewRoot.querySelector('[data-rs-chart="mdd"]'), selected);
    createMarketRsAtrChart(usOverviewRoot.querySelector('[data-rs-chart="atr"]'), selected);
  }
}

function getTrendScoreUniverseLabel(key = state.trendScoreUniverse) {
  return marketTrendScoreData.universes?.[key]?.label ?? key;
}

function getTrendScoreRows() {
  return marketTrendScoreData.rows?.[state.trendScoreUniverse] ?? [];
}

function getTrendScoreBriefingSectorLabel(sectorKey, sectorData = getMarketRsBriefingSectorData()) {
  if (sectorKey === "all") {
    return "All Trend";
  }
  if (sectorKey === "briefingAll") {
    return "Daily Briefing 전체";
  }
  return sectorData.groups.find((sector) => sector.key === sectorKey)?.label ?? "Daily Briefing";
}

function matchesTrendScoreBriefingSector(row, sectorData) {
  if (state.trendScoreBriefingSector === "all") {
    return true;
  }
  if (state.trendScoreBriefingSector === "briefingAll") {
    return sectorData.allTickers.includes(row.ticker);
  }
  const sector = sectorData.groups.find((item) => item.key === state.trendScoreBriefingSector);
  if (!sector) {
    return true;
  }
  return sector.tickers.includes(row.ticker);
}

function getVisibleTrendScoreRows(briefingSectorData = getMarketRsBriefingSectorData()) {
  const query = normalizeMarketTickerSearch(state.query);
  const rows = getTrendScoreRows().filter((row) => {
    if (!matchesTrendScoreCapRange(row)) {
      return false;
    }
    if (!matchesTrendScoreScoreRange(row)) {
      return false;
    }
    if (!matchesTrendScoreClimaxRange(row)) {
      return false;
    }
    if (!matchesTrendScoreBriefingSector(row, briefingSectorData)) {
      return false;
    }
    if (!query) {
      return true;
    }
    return marketTickerSearchTerms(row.ticker, row.name).some((term) => term.includes(query));
  });
  return sortTrendScoreRows(rows);
}

function getSelectedTrendScoreRow(rows) {
  return rows.find((row) => row.ticker === state.trendScoreSelectedTicker) ?? rows[0] ?? null;
}

function getTrendScoreSortValue(row, sortKey) {
  switch (sortKey) {
    case "ticker":
      return row.ticker ?? "";
    case "name":
      return row.name ?? "";
    case "marketCap":
      return row.marketCap ?? Number.NEGATIVE_INFINITY;
    case "score":
      return row.score ?? Number.NEGATIVE_INFINITY;
    case "rank":
      return row.rank ?? Number.POSITIVE_INFINITY;
    case "rankChange":
      return row.rankChange ?? Number.NEGATIVE_INFINITY;
    case "rsRating":
      return row.rsRating ?? Number.NEGATIVE_INFINITY;
    case "climaxScore":
      return row.climaxScore ?? Number.NEGATIVE_INFINITY;
    case "absoluteScore":
      return row.absoluteScore ?? Number.NEGATIVE_INFINITY;
    case "relativeScore":
      return row.relativeScore ?? Number.NEGATIVE_INFINITY;
    case "momentumScore":
      return row.momentumScore ?? Number.NEGATIVE_INFINITY;
    case "atr21Pct":
      return row.atr21Pct ?? Number.NEGATIVE_INFINITY;
    case "deviation50Pct":
      return row.deviation50Pct ?? Number.NEGATIVE_INFINITY;
    default:
      return row.rank ?? Number.POSITIVE_INFINITY;
  }
}

function sortTrendScoreRows(rows) {
  const direction = state.trendScoreTableSortDirection === "asc" ? 1 : -1;
  const sortKey = state.trendScoreTableSortKey ?? "rank";
  return [...rows].sort((left, right) => {
    const leftValue = getTrendScoreSortValue(left, sortKey);
    const rightValue = getTrendScoreSortValue(right, sortKey);
    if (typeof leftValue === "string" || typeof rightValue === "string") {
      const comparison = String(leftValue).localeCompare(String(rightValue));
      if (comparison !== 0) {
        return comparison * direction;
      }
    } else if (leftValue !== rightValue) {
      return (leftValue < rightValue ? -1 : 1) * direction;
    }
    const leftRank = left.rank ?? Number.POSITIVE_INFINITY;
    const rightRank = right.rank ?? Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return String(left.ticker ?? "").localeCompare(String(right.ticker ?? ""));
  });
}

function renderTrendScoreSortHeader(label, sortKey) {
  const active = state.trendScoreTableSortKey === sortKey;
  const arrow = !active ? "" : state.trendScoreTableSortDirection === "asc" ? " ↑" : " ↓";
  return `<button type="button" class="market-rs-sort${active ? " active" : ""}" data-trend-score-sort="${sortKey}">${label}${arrow}</button>`;
}

function renderTrendLeaderSortButton(label, sortKey) {
  const active = state.trendScoreTableSortKey === sortKey;
  const arrow = active ? (state.trendScoreTableSortDirection === "asc" ? "↑" : "↓") : "↕";
  return `
    <button
      type="button"
      class="market-rs-chip trend-score-leader-sort${active ? " active" : ""}"
      data-trend-score-sort="${sortKey}"
      aria-pressed="${active ? "true" : "false"}"
    >
      <span>${label}</span>
      <b>${arrow}</b>
    </button>
  `;
}

function formatTrendRank(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  return `#${Number(value).toFixed(0)}`;
}

function formatTrendChange(value, unit = "") {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  if (Number(value) === 0) {
    return "0";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(0)}${unit}`;
}

function formatTrendSignedPercent(value) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(2)}%`;
}

function formatTrendList(items) {
  if (!Array.isArray(items) || !items.length) {
    return "-";
  }
  return items.join(", ");
}

function createTrendScoreChart(canvas, row) {
  if (typeof Chart === "undefined" || !row) {
    return;
  }
  const universeKey = state.trendScoreUniverse;
  const history = marketTrendScoreData.histories?.[universeKey]?.[row.ticker];
  const labels = marketTrendScoreData.historyDates ?? [];
  if (!history || !labels.length) {
    return;
  }
  const minStart = labels[0];
  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, state.trendScoreRange, minStart, labels);
  const startIndex = Math.max(0, labels.findIndex((label) => label >= startDate));
  const selectedLabels = labels.slice(startIndex);
  const selectedRanks = (history.rank ?? []).slice(startIndex);
  const selectedScores = (history.score ?? []).slice(startIndex);
  const selectedClimaxScores = (history.climaxScore ?? []).slice(startIndex);
  const rankValues = selectedRanks.filter((value) => Number.isFinite(value));
  const maxRank = rankValues.length ? Math.max(...rankValues) : Math.max(20, row.rank ?? 20);
  const rankAxisMax = Math.min(Math.max(20, Math.ceil(maxRank / 10) * 10), getTrendScoreRows().length || 100);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: selectedLabels,
      datasets: [
        {
          label: "Rank",
          data: selectedRanks,
          borderColor: "#15803d",
          backgroundColor: "#15803d",
          borderWidth: 2.6,
          tension: 0.16,
          pointRadius: 1.8,
          pointHoverRadius: 4,
          yAxisID: "y",
        },
        {
          label: "Trend Score",
          data: selectedScores,
          borderColor: "#111827",
          backgroundColor: "#111827",
          borderWidth: 2,
          tension: 0.16,
          pointRadius: 1.8,
          pointHoverRadius: 4,
          yAxisID: "y1",
        },
        {
          label: "Climax Score",
          data: selectedClimaxScores,
          borderColor: "#f97316",
          backgroundColor: "#f97316",
          borderWidth: 2,
          tension: 0.16,
          pointRadius: 1.8,
          pointHoverRadius: 4,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => {
              if (context.dataset.yAxisID === "y") {
                return `Rank: ${formatTrendRank(context.parsed.y)}`;
              }
              return `${context.dataset.label}: ${formatRsNumber(context.parsed.y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            const indexes = buildRegularDateTickIndexes(selectedLabels, state.trendScoreRange);
            axis.ticks = indexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8a8a83",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index, ticks) => {
              const labelIndex = ticks?.[index]?.value;
              return formatRangeAxisDate(selectedLabels[labelIndex], state.trendScoreRange);
            },
          },
        },
        y: {
          position: "left",
          reverse: true,
          min: 1,
          max: rankAxisMax,
          grid: { color: "rgba(28,28,26,0.08)" },
          ticks: {
            color: "#15803d",
            callback: (value) => `#${value}`,
          },
        },
        y1: {
          position: "right",
          min: 0,
          max: 10,
          grid: { drawOnChartArea: false },
          ticks: { color: "#111827", stepSize: 2 },
        },
      },
    },
  });
  charts.push(chart);
}

function getTrendScoreClimaxSnapshot(row) {
  const history = marketTrendScoreData.histories?.[state.trendScoreUniverse]?.[row?.ticker];
  const values = Array.isArray(history?.climaxScore) ? history.climaxScore : [];
  const toFiniteNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };
  let latestIndex = -1;
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (toFiniteNumber(values[index]) !== null) {
      latestIndex = index;
      break;
    }
  }
  if (latestIndex < 0) {
    return { current: toFiniteNumber(row?.climaxScore), previous: null };
  }
  let previous = null;
  for (let index = latestIndex - 1; index >= 0; index -= 1) {
    const value = toFiniteNumber(values[index]);
    if (value !== null) {
      previous = value;
      break;
    }
  }
  return { current: toFiniteNumber(values[latestIndex]), previous };
}

function getTrendScoreClimaxSignals(rows) {
  const snapshots = rows
    .map((row) => ({ row, ...getTrendScoreClimaxSnapshot(row) }))
    .filter((item) => Number.isFinite(item.current));
  const sortByRisk = (left, right) => (
    right.current - left.current
    || (right.row.score ?? Number.NEGATIVE_INFINITY) - (left.row.score ?? Number.NEGATIVE_INFINITY)
    || (left.row.rank ?? Number.POSITIVE_INFINITY) - (right.row.rank ?? Number.POSITIVE_INFINITY)
  );
  return {
    highRisk: snapshots.filter((item) => item.current >= 8).sort(sortByRisk),
    extension: snapshots.filter((item) => item.current >= 4 && item.current < 8).sort(sortByRisk),
    newToday: snapshots
      .filter((item) => item.current >= 4 && Number.isFinite(item.previous) && item.previous < 4)
      .sort(sortByRisk),
  };
}

function renderTrendScoreSignalList(items, briefingSectorData, emptyText) {
  if (!items.length) {
    return `<p class="trend-signal-empty">${emptyText}</p>`;
  }
  return items
    .map(({ row, current }) => {
      const sector = formatMarketRsBriefingSectorLabels(row, briefingSectorData, 1);
      const flags = Array.isArray(row.climaxFlags) && row.climaxFlags.length
        ? escapeHtml(row.climaxFlags.join(" · "))
        : "과열 플래그 없음";
      return `
        <button type="button" class="trend-signal-item" data-trend-score-ticker="${row.ticker}">
          <span class="trend-signal-rank">${formatTrendRank(row.rank)}</span>
          <span class="trend-signal-identity">
            <b>${row.ticker}</b>
            <small>${escapeHtml(row.name)} · ${escapeHtml(sector)} · Trend ${formatRsNumber(row.score)}/10</small>
            <em>${flags}</em>
          </span>
          <strong>${formatRsNumber(current)}</strong>
        </button>
      `;
    })
    .join("");
}

function renderMarketTrendScoreOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  const briefingSectorData = getMarketRsBriefingSectorData();
  if (
    state.trendScoreBriefingSector !== "all" &&
    state.trendScoreBriefingSector !== "briefingAll" &&
    !briefingSectorData.groups.some((sector) => sector.key === state.trendScoreBriefingSector)
  ) {
    state.trendScoreBriefingSector = "briefingAll";
  }
  const rows = getVisibleTrendScoreRows(briefingSectorData);
  const climaxSignals = getTrendScoreClimaxSignals(rows);
  const selected = getSelectedTrendScoreRow(rows);
  if (selected) {
    state.trendScoreSelectedTicker = selected.ticker;
  }

  const universeChips = Object.entries(marketTrendScoreData.universes ?? {})
    .map(
      ([key, meta]) => `
        <button
          type="button"
          class="market-rs-chip${state.trendScoreUniverse === key ? " active" : ""}"
          data-trend-score-universe="${key}"
        >${meta.label}</button>
      `,
    )
    .join("");
  const briefingSectorChips = [
    { key: "all", label: "All Trend", count: getTrendScoreRows().length },
    { key: "briefingAll", label: "Daily Briefing 전체", count: briefingSectorData.allTickers.length },
    ...briefingSectorData.groups.map((sector) => ({
      key: sector.key,
      label: sector.label,
      count: sector.tickers.length,
    })),
  ]
    .map(
      (sector) => `
        <button
          type="button"
          class="market-rs-chip market-rs-sector-chip${state.trendScoreBriefingSector === sector.key ? " active" : ""}"
          data-trend-score-briefing-sector="${sector.key}"
        >${sector.label}<small>${sector.count}</small></button>
      `,
    )
    .join("");
  const marketCapChips = MARKET_RS_CAP_RANGES.map(
    (range) => `
      <button
        type="button"
        class="market-rs-chip${state.trendScoreMarketCapRange === range.key ? " active" : ""}"
        data-trend-score-market-cap="${range.key}"
      >${range.label}</button>
    `,
  ).join("");
  const scoreChips = TREND_SCORE_RANGES.map(
    (range) => `
      <button
        type="button"
        class="market-rs-chip${state.trendScoreScoreRange === range.key ? " active" : ""}"
        data-trend-score-score-range="${range.key}"
      >${range.label}</button>
    `,
  ).join("");
  const climaxChips = CLIMAX_SCORE_RANGES.map(
    (range) => `
      <button
        type="button"
        class="market-rs-chip${state.trendScoreClimaxRange === range.key ? " active" : ""}"
        data-trend-score-climax-range="${range.key}"
      >${range.label}</button>
    `,
  ).join("");
  const leaderSortControls = [
    ["Score", "score"],
    ["Market Cap", "marketCap"],
    ["Climax", "climaxScore"],
  ]
    .map(([label, sortKey]) => renderTrendLeaderSortButton(label, sortKey))
    .join("");
  const trendScoreCardLimit = ENABLE_TREND_SCORE_LIMITED_CARDS
    ? Math.max(TREND_SCORE_CARD_BATCH_SIZE, Number(state.trendScoreVisibleCardCount) || TREND_SCORE_CARD_BATCH_SIZE)
    : rows.length;
  const trendScoreCardRows = ENABLE_TREND_SCORE_LIMITED_CARDS ? rows.slice(0, trendScoreCardLimit) : rows;
  const hasMoreTrendScoreCards = ENABLE_TREND_SCORE_LIMITED_CARDS && trendScoreCardRows.length < rows.length;
  const leaderCards = trendScoreCardRows
    .map(
      (row) => `
        <button
          type="button"
          class="market-rs-card${state.trendScoreSelectedTicker === row.ticker ? " active" : ""}"
          data-trend-score-ticker="${row.ticker}"
        >
          <div class="market-rs-card-top">
            <span class="market-rs-card-ticker">${row.ticker}</span>
            <span class="market-rs-card-score">${formatTrendRank(row.rank)}</span>
          </div>
          <p class="market-rs-card-name">${row.name}</p>
          <p class="market-rs-card-cap">${formatMarketCapCompact(row.marketCap)}</p>
          <div class="market-rs-card-meta">
            <span>Score</span>
            <strong>${formatRsNumber(row.score)}</strong>
          </div>
          <div class="market-rs-card-meta">
            <span>RS Trend</span>
            <strong>${formatRsNumber(row.relativeScore)}/4</strong>
          </div>
          <div class="market-rs-card-meta">
            <span>Climax</span>
            <strong>${formatRsNumber(row.climaxScore)}</strong>
          </div>
          <div class="market-rs-flag">${row.zone ?? "-"}</div>
        </button>
      `,
    )
    .join("");
  const leaderCardMoreMarkup = hasMoreTrendScoreCards
    ? `
      <div class="trend-score-card-more">
        <span>${trendScoreCardRows.length} / ${rows.length} names</span>
        <button type="button" class="total-date-button" data-trend-score-show-more>더 보기 +${Math.min(TREND_SCORE_CARD_BATCH_SIZE, rows.length - trendScoreCardRows.length)}</button>
      </div>
    `
    : ENABLE_TREND_SCORE_LIMITED_CARDS && rows.length
      ? `<p class="market-rs-empty trend-score-card-count">${rows.length} names all loaded.</p>`
      : "";
  const tableRows = rows
    .map(
      (row) => `
        <tr data-trend-score-ticker="${row.ticker}">
          <td>${formatTrendRank(row.rank)}</td>
          <td>${row.ticker}</td>
          <td>${row.name}</td>
          <td>${formatMarketCapCompact(row.marketCap)}</td>
          <td>${formatRsNumber(row.score)}</td>
          <td>${formatTrendChange(row.rankChange)}</td>
          <td>${formatRsNumber(row.absoluteScore)}/4</td>
          <td>${formatRsNumber(row.relativeScore)}/4</td>
          <td>${formatRsNumber(row.momentumScore)}/2</td>
          <td>${formatRsNumber(row.climaxScore)}</td>
          <td>${formatRsNumber(row.rsRating)}</td>
          <td>${formatAtrPercent(row.atr21Pct)}</td>
          <td>${formatTrendSignedPercent(row.deviation50Pct)}</td>
          <td>${formatTrendList(row.climaxFlags)}</td>
          <td>${row.state ?? "-"}</td>
        </tr>
      `,
    )
    .join("");
  const signalMonitorMarkup = `
    <section class="trend-signal-monitor" aria-label="Climax Signals">
      <div class="trend-signal-head">
        <div>
          <span>EG TREND SCORE · SIGNAL MONITOR</span>
          <h2>Climax Signals</h2>
          <p>Daily Briefing 종목 안에서 과열과 확장 위험, 오늘 새롭게 발생한 신호를 구분합니다.</p>
        </div>
        <div class="trend-signal-summary">
          <span class="is-risk">${climaxSignals.highRisk.length} High Risk</span>
          <span class="is-extension">${climaxSignals.extension.length} Extension</span>
          <span class="is-new">${climaxSignals.newToday.length} New Today</span>
          <small>As of ${marketTrendScoreData.updatedAt ?? "-"}</small>
        </div>
      </div>
      <div class="trend-signal-grid">
        <article class="trend-signal-panel is-risk">
          <div class="trend-signal-panel-head">
            <div><h3>Climax Risk</h3><p>점수 8+ · 급등/과열 신호가 복합 발생</p></div>
            <b>${climaxSignals.highRisk.length}</b>
          </div>
          <div class="trend-signal-list">${renderTrendScoreSignalList(climaxSignals.highRisk, briefingSectorData, "해당 종목이 없습니다.")}</div>
        </article>
        <article class="trend-signal-panel is-extension">
          <div class="trend-signal-panel-head">
            <div><h3>Extension Watch</h3><p>점수 4-7 · 추세는 유지되나 과열 경계</p></div>
            <b>${climaxSignals.extension.length}</b>
          </div>
          <div class="trend-signal-list">${renderTrendScoreSignalList(climaxSignals.extension, briefingSectorData, "현재 확장 경계 종목이 없습니다.")}</div>
        </article>
        <article class="trend-signal-panel is-new">
          <div class="trend-signal-panel-head">
            <div><h3>New Signal Today</h3><p>전일 4점 미만에서 오늘 처음 4점 이상</p></div>
            <b>${climaxSignals.newToday.length}</b>
          </div>
          <div class="trend-signal-list">${renderTrendScoreSignalList(climaxSignals.newToday, briefingSectorData, "오늘 새로 발생한 신호가 없습니다.")}</div>
        </article>
      </div>
    </section>
  `;

  usOverviewRoot.innerHTML = `
    <section class="market-rs-overview trend-score-overview">
      <article class="us-panel">
        <div class="us-section-head market-rs-head">
          <div>
            <h2>추세스코어</h2>
            <p>${marketTrendScoreData.scoring?.description ?? ""}</p>
          </div>
          <div class="market-rs-summary-pills">
            <span class="market-rs-pill">As of ${marketTrendScoreData.updatedAt ?? "-"}</span>
            <span class="market-rs-pill">${getTrendScoreUniverseLabel()}</span>
            <span class="market-rs-pill">${getTrendScoreBriefingSectorLabel(state.trendScoreBriefingSector, briefingSectorData)}</span>
            <span class="market-rs-pill">${rows.length} names</span>
          </div>
        </div>
        <div class="market-rs-controls">
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Universe</span>
            <div class="market-rs-chip-row">${universeChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Daily Briefing Sector</span>
            <div class="market-rs-chip-row market-rs-briefing-sector-row">${briefingSectorChips}</div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Market Cap</span>
            <div class="market-rs-chip-row">${marketCapChips}</div>
            <div class="market-rs-cap-custom">
              <label>
                <span>Min</span>
                <input type="text" inputmode="decimal" placeholder="ex. 5B" value="${state.trendScoreCustomMarketCapMin}" data-trend-score-market-cap-min />
              </label>
              <label>
                <span>Max</span>
                <input type="text" inputmode="decimal" placeholder="optional" value="${state.trendScoreCustomMarketCapMax}" data-trend-score-market-cap-max />
              </label>
              <button type="button" class="total-date-button" data-trend-score-market-cap-apply>Apply</button>
              <button type="button" class="total-date-button total-date-button-secondary" data-trend-score-market-cap-clear>Clear</button>
            </div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Trend Score</span>
            <div class="market-rs-chip-row">${scoreChips}</div>
            <div class="market-rs-cap-custom">
              <label>
                <span>Min</span>
                <input type="number" inputmode="decimal" min="0" max="10" step="0.1" placeholder="ex. 8" value="${state.trendScoreCustomScoreMin}" data-trend-score-score-min />
              </label>
              <label>
                <span>Max</span>
                <input type="number" inputmode="decimal" min="0" max="10" step="0.1" placeholder="optional" value="${state.trendScoreCustomScoreMax}" data-trend-score-score-max />
              </label>
              <button type="button" class="total-date-button" data-trend-score-score-apply>Apply</button>
              <button type="button" class="total-date-button total-date-button-secondary" data-trend-score-score-clear>Clear</button>
            </div>
          </div>
          <div class="market-rs-control-block">
            <span class="market-rs-control-label">Climax Score</span>
            <div class="market-rs-chip-row">${climaxChips}</div>
            <div class="market-rs-cap-custom">
              <label>
                <span>Min</span>
                <input type="number" inputmode="decimal" min="0" step="1" placeholder="ex. 4" value="${state.trendScoreCustomClimaxMin}" data-trend-score-climax-min />
              </label>
              <label>
                <span>Max</span>
                <input type="number" inputmode="decimal" min="0" step="1" placeholder="optional" value="${state.trendScoreCustomClimaxMax}" data-trend-score-climax-max />
              </label>
              <button type="button" class="total-date-button" data-trend-score-climax-apply>Apply</button>
              <button type="button" class="total-date-button total-date-button-secondary" data-trend-score-climax-clear>Clear</button>
            </div>
          </div>
        </div>
      </article>

      ${signalMonitorMarkup}

      <section class="market-rs-layout trend-score-layout">
        <article class="us-panel market-rs-leaders">
          <div class="us-section-head">
            <div>
              <h2>Trend Leaders</h2>
              <p>${getTrendScoreUniverseLabel()} / ${getTrendScoreBriefingSectorLabel(state.trendScoreBriefingSector, briefingSectorData)} ranked by 10-point trend score and tie-breakers.</p>
            </div>
            <div class="trend-score-leader-sortbar" aria-label="Trend leader sort">
              ${leaderSortControls}
            </div>
          </div>
          <div class="market-rs-card-grid trend-score-card-grid">${leaderCards || '<p class="market-rs-empty">검색 결과가 없습니다.</p>'}</div>
          ${leaderCardMoreMarkup}
        </article>

        <article class="us-panel market-rs-detail">
          <div class="us-section-head">
            <div>
              <h2>${selected?.ticker ?? "-"}</h2>
              <p>${selected?.name ?? "Select a ticker from the table or search box."}</p>
            </div>
            <span class="market-rs-detail-score">${formatRsNumber(selected?.score)}</span>
          </div>
          <div class="market-rs-metrics">
            <div class="market-rs-metric">
              <span>Rank</span>
              <strong>${formatTrendRank(selected?.rank)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Rank Δ</span>
              <strong>${formatTrendChange(selected?.rankChange)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Score</span>
              <strong>${formatRsNumber(selected?.score)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Abs / RS / Mo</span>
              <strong>${formatRsNumber(selected?.absoluteScore)}/${formatRsNumber(selected?.relativeScore)}/${formatRsNumber(selected?.momentumScore)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Climax</span>
              <strong>${formatRsNumber(selected?.climaxScore)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Price</span>
              <strong>${formatUsStockPrice(selected?.price)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>50DMA Gap</span>
              <strong>${formatTrendSignedPercent(selected?.deviation50Pct)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>ATR 21D %</span>
              <strong>${formatAtrPercent(selected?.atr21Pct)}</strong>
            </div>
            <div class="market-rs-metric">
              <span>Base Weight</span>
              <strong>${formatTrendSignedPercent(selected?.baseWeightPct)}</strong>
            </div>
            ${selected?.scoreBasis === "available-history-provisional" ? `
              <div class="market-rs-metric">
                <span>Score Basis</span>
                <strong>${selected.historySessions ?? "-"}D provisional</strong>
              </div>
            ` : ""}
          </div>
          <div class="market-rs-extension-panel">
            <div class="market-rs-extension-title">
              <strong>Scoring Logic</strong>
              <span>① Price/50DMA/200DMA 4점 + ② 벤치마크 대비 RS 라인 추세 4점 + ③ 단기 모멘텀 2점. Climax는 OHLCV 기반 급등, 21EMA/ATR Extension 과열, 거래량 확장, 갭상승, 일중반전, Stalling, Shellac을 별도로 점검합니다.</span>
            </div>
            <div class="market-rs-extension-grid">
              <article class="market-rs-extension-card">
                <div class="market-rs-extension-head"><strong>Absolute</strong><b>${formatRsNumber(selected?.absoluteScore)}/4</b></div>
                <div class="market-rs-extension-stats"><span>20DMA gap <strong>${formatTrendSignedPercent(selected?.deviation20Pct)}</strong></span><span>200DMA gap <strong>${formatTrendSignedPercent(selected?.deviation200Pct)}</strong></span></div>
              </article>
              <article class="market-rs-extension-card">
                <div class="market-rs-extension-head"><strong>Relative</strong><b>${formatRsNumber(selected?.relativeScore)}/4</b></div>
                <div class="market-rs-extension-stats"><span>RS Rating <strong>${formatRsNumber(selected?.rsRating)}</strong></span><span>State <strong>${selected?.state ?? "-"}</strong></span></div>
              </article>
              <article class="market-rs-extension-card">
                <div class="market-rs-extension-head"><strong>ATR Ext</strong><b>${formatAtrMultiple(selected?.atrExt50)}</b></div>
                <div class="market-rs-extension-stats"><span>10EMA <strong>${formatAtrMultiple(selected?.atrExt10)}</strong></span><span>20DMA <strong>${formatAtrMultiple(selected?.atrExt20)}</strong></span><span>200DMA <strong>${formatAtrMultiple(selected?.atrExt200)}</strong></span></div>
              </article>
              <article class="market-rs-extension-card${Number(selected?.climaxScore) >= 4 ? " is-stretched" : ""}">
                <div class="market-rs-extension-head"><strong>Climax</strong><b>${formatRsNumber(selected?.climaxScore)}</b></div>
                <div class="market-rs-extension-stats"><span>Flags <strong>${formatTrendList(selected?.climaxFlags)}</strong></span><span>Extended <strong>${formatTrendList(selected?.extendedFlags)}</strong></span></div>
              </article>
            </div>
          </div>
          <div class="chart-wrap market-rs-chart-wrap">
            <canvas data-trend-score-chart="detail"></canvas>
          </div>
          <p class="market-rs-chart-caption">Left axis: daily rank, inverted so #1 is at the top. Right axis: 0-10 trend and climax scores. Hover shows the exact date.</p>
        </article>
      </section>

      <article class="us-panel market-rs-table-panel">
        <div class="us-section-head">
          <div>
            <h2>Full Trend Score Table</h2>
            <p>Search from the top bar, switch NASDAQ100/S&P500, then click any row to inspect daily rank history.</p>
          </div>
        </div>
        <div class="market-rs-table-wrap">
          <table class="market-rs-table trend-score-table">
            <thead>
              <tr>
                <th>${renderTrendScoreSortHeader("Rank", "rank")}</th>
                <th>${renderTrendScoreSortHeader("Ticker", "ticker")}</th>
                <th>${renderTrendScoreSortHeader("Name", "name")}</th>
                <th>${renderTrendScoreSortHeader("Market Cap", "marketCap")}</th>
                <th>${renderTrendScoreSortHeader("Score", "score")}</th>
                <th>${renderTrendScoreSortHeader("Rank Δ", "rankChange")}</th>
                <th>${renderTrendScoreSortHeader("Abs", "absoluteScore")}</th>
                <th>${renderTrendScoreSortHeader("RS", "relativeScore")}</th>
                <th>${renderTrendScoreSortHeader("Mo", "momentumScore")}</th>
                <th>${renderTrendScoreSortHeader("Climax", "climaxScore")}</th>
                <th>${renderTrendScoreSortHeader("RS Rating", "rsRating")}</th>
                <th>${renderTrendScoreSortHeader("ATR%", "atr21Pct")}</th>
                <th>${renderTrendScoreSortHeader("50DMA Gap", "deviation50Pct")}</th>
                <th>Climax Flags</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>${tableRows || '<tr><td colspan="15">검색 결과가 없습니다.</td></tr>'}</tbody>
          </table>
        </div>
      </article>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-trend-score-universe]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendScoreUniverse = button.dataset.trendScoreUniverse || "all";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-trend-score-briefing-sector]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendScoreBriefingSector = button.dataset.trendScoreBriefingSector || "all";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-trend-score-market-cap]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendScoreMarketCapRange = button.dataset.trendScoreMarketCap || "all";
      state.trendScoreCustomMarketCapMin = "";
      state.trendScoreCustomMarketCapMax = "";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  });
  const trendScoreMarketCapMinInput = usOverviewRoot.querySelector("[data-trend-score-market-cap-min]");
  const trendScoreMarketCapMaxInput = usOverviewRoot.querySelector("[data-trend-score-market-cap-max]");
  const trendScoreMarketCapApplyButton = usOverviewRoot.querySelector("[data-trend-score-market-cap-apply]");
  const trendScoreMarketCapClearButton = usOverviewRoot.querySelector("[data-trend-score-market-cap-clear]");
  if (trendScoreMarketCapApplyButton && trendScoreMarketCapMinInput && trendScoreMarketCapMaxInput) {
    trendScoreMarketCapApplyButton.addEventListener("click", () => {
      state.trendScoreCustomMarketCapMin = trendScoreMarketCapMinInput.value.trim();
      state.trendScoreCustomMarketCapMax = trendScoreMarketCapMaxInput.value.trim();
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  if (trendScoreMarketCapClearButton) {
    trendScoreMarketCapClearButton.addEventListener("click", () => {
      state.trendScoreCustomMarketCapMin = "";
      state.trendScoreCustomMarketCapMax = "";
      state.trendScoreMarketCapRange = "all";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-trend-score-score-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendScoreScoreRange = button.dataset.trendScoreScoreRange || "all";
      state.trendScoreCustomScoreMin = "";
      state.trendScoreCustomScoreMax = "";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  });
  const trendScoreScoreMinInput = usOverviewRoot.querySelector("[data-trend-score-score-min]");
  const trendScoreScoreMaxInput = usOverviewRoot.querySelector("[data-trend-score-score-max]");
  const trendScoreScoreApplyButton = usOverviewRoot.querySelector("[data-trend-score-score-apply]");
  const trendScoreScoreClearButton = usOverviewRoot.querySelector("[data-trend-score-score-clear]");
  if (trendScoreScoreApplyButton && trendScoreScoreMinInput && trendScoreScoreMaxInput) {
    trendScoreScoreApplyButton.addEventListener("click", () => {
      state.trendScoreCustomScoreMin = trendScoreScoreMinInput.value.trim();
      state.trendScoreCustomScoreMax = trendScoreScoreMaxInput.value.trim();
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  if (trendScoreScoreClearButton) {
    trendScoreScoreClearButton.addEventListener("click", () => {
      state.trendScoreCustomScoreMin = "";
      state.trendScoreCustomScoreMax = "";
      state.trendScoreScoreRange = "all";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-trend-score-climax-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trendScoreClimaxRange = button.dataset.trendScoreClimaxRange || "all";
      state.trendScoreCustomClimaxMin = "";
      state.trendScoreCustomClimaxMax = "";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  });
  const trendScoreClimaxMinInput = usOverviewRoot.querySelector("[data-trend-score-climax-min]");
  const trendScoreClimaxMaxInput = usOverviewRoot.querySelector("[data-trend-score-climax-max]");
  const trendScoreClimaxApplyButton = usOverviewRoot.querySelector("[data-trend-score-climax-apply]");
  const trendScoreClimaxClearButton = usOverviewRoot.querySelector("[data-trend-score-climax-clear]");
  if (trendScoreClimaxApplyButton && trendScoreClimaxMinInput && trendScoreClimaxMaxInput) {
    trendScoreClimaxApplyButton.addEventListener("click", () => {
      state.trendScoreCustomClimaxMin = trendScoreClimaxMinInput.value.trim();
      state.trendScoreCustomClimaxMax = trendScoreClimaxMaxInput.value.trim();
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  if (trendScoreClimaxClearButton) {
    trendScoreClimaxClearButton.addEventListener("click", () => {
      state.trendScoreCustomClimaxMin = "";
      state.trendScoreCustomClimaxMax = "";
      state.trendScoreClimaxRange = "all";
      state.trendScoreSelectedTicker = "";
      resetTrendScoreCardLimit();
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-trend-score-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSortKey = button.dataset.trendScoreSort;
      if (state.trendScoreTableSortKey === nextSortKey) {
        state.trendScoreTableSortDirection = state.trendScoreTableSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.trendScoreTableSortKey = nextSortKey || "rank";
        state.trendScoreTableSortDirection = nextSortKey === "rank" || nextSortKey === "ticker" || nextSortKey === "name" ? "asc" : "desc";
      }
      resetTrendScoreCardLimit();
      render();
    });
  });
  const trendScoreShowMoreButton = usOverviewRoot.querySelector("[data-trend-score-show-more]");
  if (trendScoreShowMoreButton) {
    trendScoreShowMoreButton.addEventListener("click", () => {
      state.trendScoreVisibleCardCount = Math.min(
        rows.length,
        Math.max(TREND_SCORE_CARD_BATCH_SIZE, Number(state.trendScoreVisibleCardCount) || TREND_SCORE_CARD_BATCH_SIZE) + TREND_SCORE_CARD_BATCH_SIZE,
      );
      render();
    });
  }
  usOverviewRoot.querySelectorAll("[data-trend-score-ticker]").forEach((element) => {
    element.addEventListener("click", () => {
      state.trendScoreSelectedTicker = element.dataset.trendScoreTicker;
      render();
    });
  });

  const detailCanvas = usOverviewRoot.querySelector('[data-trend-score-chart="detail"]');
  if (detailCanvas && selected) {
    createTrendScoreChart(detailCanvas, selected);
  }
}

function getMemorySpotItems() {
  return (memorySpotData.groups ?? []).flatMap((group) => group.items ?? []);
}

function getMemorySpotItemByKey(key) {
  return getMemorySpotItems().find((item) => item.key === key) ?? null;
}

function formatMemorySpotValue(value) {
  return Number.isFinite(value) ? `$${Number(value).toFixed(3)}` : "N/A";
}

function formatMemorySpotChange(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
}

function formatMemoryDollar(value, unit = "USD") {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return `$${Number(value).toFixed(3)} ${unit}`;
}

function formatMemoryPremium(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(1)}%`;
}

function getMemorySpotCheckValues(row) {
  const runtime = row.spotKey ? memorySpotRuntime.items[row.spotKey] : null;
  const spotPrice = Number.isFinite(runtime?.latestValue) ? runtime.latestValue : row.spotPrice;
  const spotDate = runtime?.latestDate ?? row.spotDate ?? null;
  const contractPrice = row.contractPrice;
  const premiumPct = Number.isFinite(spotPrice) && Number.isFinite(contractPrice) && contractPrice !== 0
    ? ((spotPrice - contractPrice) / contractPrice) * 100
    : row.premiumPct;
  return { spotPrice, spotDate, premiumPct };
}

function formatMemoryRangeValue(range) {
  if (!range || !Number.isFinite(range.low) || !Number.isFinite(range.high)) {
    return "-";
  }
  return range.label ?? `${range.low}-${range.high}%`;
}

function getMemoryRangeMidpoint(range) {
  if (!range || !Number.isFinite(range.low) || !Number.isFinite(range.high)) {
    return null;
  }
  return Number(((range.low + range.high) / 2).toFixed(1));
}

function createMemoryContractGuideChart(canvas, rows) {
  if (typeof Chart === "undefined" || !Array.isArray(rows) || !rows.length) {
    return;
  }

  const labels = rows.map((row) => row.period);
  const series = [
    { key: "dram", label: "DRAM", color: "#2563eb" },
    { key: "nand", label: "NAND", color: "#ea580c" },
    { key: "hbm", label: "HBM / Blended", color: "#0f766e" },
  ];

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: series.map((item) => ({
        label: item.label,
        data: rows.map((row) => getMemoryRangeMidpoint(row[item.key])),
        tension: 0.25,
        spanGaps: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 10,
        borderWidth: 2.6,
        backgroundColor: item.color,
        borderColor: item.color,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toFixed(1)}% midpoint`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86", maxRotation: 0 },
          border: { color: "#d8d8d2" },
        },
        y: {
          ticks: { color: "#8d8d86", callback: (value) => `${value}%`, maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsvText(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = cells[index] ?? "";
      return record;
    }, {});
  });
}

function createDateLabels(startDate, endDate) {
  const labels = [];
  const cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cursor <= end) {
    labels.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return labels;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMemoryPeriodLabel(dateKey) {
  if (!dateKey) {
    return "-";
  }

  const [year] = dateKey.split("-");
  return year.slice(2);
}

function formatYearMonthPeriodLabel(dateKey) {
  if (!dateKey) {
    return "-";
  }
  const [year, month] = dateKey.split("-");
  return `${year.slice(2)}/${month}`;
}

const MEMORY_SPOT_RANGE_OPTIONS = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "ytd", label: "YTD" },
  { key: "1y", label: "1Y" },
  { key: "3y", label: "3Y" },
  { key: "max", label: "Max" },
];

function getMemorySpotRange(targetKey) {
  return state.memorySpotRanges?.[targetKey] ?? "3y";
}

function buildMemoryChartPayload(labels, datasets, rangeKey) {
  if (!Array.isArray(labels) || !labels.length) {
    return { labels: [], datasets: [] };
  }

  const latestDate = labels[labels.length - 1];
  const startDate = shiftDateByRange(latestDate, rangeKey, labels[0], labels);
  const startIndex = Math.max(
    0,
    labels.findIndex((label) => label >= startDate),
  );

  return {
    labels: labels.slice(startIndex),
    datasets: datasets.map((dataset) => ({
      ...dataset,
      data: (dataset.data ?? []).slice(startIndex),
    })),
  };
}

function hydrateMemorySpotRuntimeFromLocal() {
  if (!memorySpotHistoryData || !Array.isArray(memorySpotHistoryData.labels) || typeof memorySpotHistoryData.items !== "object") {
    return false;
  }

  memorySpotRuntime.labels = memorySpotHistoryData.labels;
  memorySpotRuntime.items = memorySpotHistoryData.items ?? {};
  memorySpotRuntime.updatedAt = memorySpotHistoryData.updatedAt ?? memorySpotHistoryData.generatedAt ?? "";
  memorySpotRuntime.loaded = true;
  memorySpotRuntime.loading = false;
  memorySpotRuntime.error = "";
  return true;
}

function hydrateGpuCloudRuntimeFromLocal() {
  if (!gpuCloudHistoryData || !Array.isArray(gpuCloudHistoryData.labels) || typeof gpuCloudHistoryData.items !== "object") {
    return false;
  }

  gpuCloudRuntime.labels = gpuCloudHistoryData.labels;
  gpuCloudRuntime.items = gpuCloudHistoryData.items ?? {};
  gpuCloudRuntime.updatedAt = gpuCloudHistoryData.updatedAt ?? gpuCloudHistoryData.generatedAt ?? "";
  gpuCloudRuntime.loaded = true;
  gpuCloudRuntime.loading = false;
  gpuCloudRuntime.error = "";
  return true;
}

async function loadMemorySpotHistory() {
  if (memorySpotRuntime.loading || memorySpotRuntime.loaded) {
    return;
  }

  memorySpotRuntime.loading = true;
  memorySpotRuntime.error = "";

  try {
    const dramSheetId = "1BsfqsQ3fXN1JGXJlR8mbs2r-lXWt0S3Dcl5OVw1kPXs";
    const nandSheetId = "1fPRlsHibMUg8ZwRXWkeQ3hAZHoGMK2O4J98KfliMT4s";
    const urls = [
      `https://docs.google.com/spreadsheets/d/${dramSheetId}/gviz/tq?tqx=out:csv&sheet=Historical`,
      `https://docs.google.com/spreadsheets/d/${nandSheetId}/gviz/tq?tqx=out:csv&sheet=Historical`,
    ];

    const [dramCsv, nandCsv] = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Memory spot fetch failed: ${response.status}`);
        }
        return response.text();
      }),
    );

    const allRows = [...parseCsvText(dramCsv), ...parseCsvText(nandCsv)];
      const targetMap = {
        ddr5_16gb: "DDR5 16Gb (2Gx8)",
        ddr4_16gb: "DDR4 16Gb (2Gx8)",
        ddr4_8gb: "DDR4 8Gb (1Gx8)",
        gddr6_8gb: "GDDR6 8Gb",
        wafer_512gb_tlc: "TLC 512Gb",
        wafer_256gb_tlc: "TLC 256Gb",
      };

    const labels = createDateLabels("2022-01-01", formatDateKey(new Date()));
    const labelIndex = Object.fromEntries(labels.map((label, index) => [label, index]));
    const itemStore = Object.fromEntries(
      Object.keys(targetMap).map((key) => [
        key,
        {
          history: new Array(labels.length).fill(null),
          latestValue: null,
          latestChangePct: null,
          latestDate: null,
        },
      ]),
    );

    allRows.forEach((row) => {
      const key = Object.keys(targetMap).find((candidate) => targetMap[candidate] === row.Canonical_Product);
      if (!key || !(row.Date in labelIndex)) {
        return;
      }

      const value = row.Price_Average ? Number(row.Price_Average) : null;
      const change = row.Change_Pct ? Number(row.Change_Pct) : null;
      const target = itemStore[key];
      target.history[labelIndex[row.Date]] = Number.isFinite(value) ? Number(value.toFixed(3)) : null;

      if (!target.latestDate || row.Date > target.latestDate) {
        target.latestDate = row.Date;
        target.latestValue = Number.isFinite(value) ? Number(value.toFixed(3)) : null;
        target.latestChangePct = Number.isFinite(change) ? Number(change.toFixed(2)) : null;
      }
    });

    memorySpotRuntime.labels = labels;
    memorySpotRuntime.items = itemStore;
    memorySpotRuntime.updatedAt = allRows.reduce((latest, row) => (row.Date > latest ? row.Date : latest), "");
    memorySpotRuntime.loaded = true;
  } catch (error) {
    memorySpotRuntime.error = error instanceof Error ? error.message : String(error);
  } finally {
    memorySpotRuntime.loading = false;
    render();
  }
}

function createMemoryLineChart(canvas, labels, datasets, formatter, rangeKey = "1y") {
  if (typeof Chart === "undefined") {
    return;
  }

  const payload = buildMemoryChartPayload(labels, datasets, rangeKey);
  const allValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 100;
  const yMin = minValue > 0 ? Math.floor(minValue * 0.9) : Math.floor(minValue * 1.1);
  const yMax = Math.ceil(maxValue * 1.1);
  const selectedTickIndexes = getMacroTickIndexes(payload.labels, rangeKey, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: payload,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => {
              const pointLabel = tooltipItems?.[0]?.label;
              return pointLabel ? pointLabel : "";
            },
            label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => {
              if (!selectedTickSet.has(value)) {
                return "";
              }
              const label = payload.labels[value];
              return label ? formatRangeAxisDate(label, rangeKey) : "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => formatter(value), maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createGpuLineChart(canvas, labels, datasets, formatter) {
  if (typeof Chart === "undefined") {
    return;
  }

  const allValues = datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 5;
  const yMin = Math.max(0, Math.floor(minValue * 0.85 * 10) / 10);
  const yMax = Math.ceil(maxValue * 1.15 * 10) / 10;

  const chart = new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#66665f", usePointStyle: true, boxWidth: 8, boxHeight: 8 },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = axis.ticks.filter((tick) => {
              const label = labels[tick.value];
              if (!label || !label.endsWith("-01")) {
                return false;
              }
              const [, month] = label.split("-");
              return Number(month) % 2 === 1;
            });
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => {
              const label = labels[value];
              if (!label) {
                return "";
              }
              return formatYearMonthPeriodLabel(label);
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => formatter(value), maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getGpuHistoryTickIndexes(labels, canvasWidth) {
  if (!labels.length) {
    return [];
  }
  const maxTickCount = Math.max(4, Math.floor((canvasWidth || 600) / 88));
  const step = Math.max(1, Math.ceil((labels.length - 1) / Math.max(1, maxTickCount - 1)));
  const indexes = [];
  for (let index = 0; index < labels.length; index += step) {
    indexes.push(index);
  }
  if (!indexes.includes(labels.length - 1)) {
    indexes.push(labels.length - 1);
  }
  return indexes;
}

function createEgGpuRentalIndexChart(canvas, payload) {
  if (typeof Chart === "undefined" || !canvas || !payload?.labels?.length) {
    return;
  }
  const labels = payload.labels;
  const allValues = [
    ...(payload.indexValues ?? []),
    ...(payload.bandLowValues ?? []),
    ...(payload.bandHighValues ?? []),
    Number(payload.baseValue) || 100,
  ]
    .filter((value) => value !== null && value !== "" && Number.isFinite(Number(value)))
    .map(Number);
  const minValue = allValues.length ? Math.min(...allValues) : 70;
  const maxValue = allValues.length ? Math.max(...allValues) : 110;
  const yMin = Math.floor((minValue - 4) / 5) * 5;
  const yMax = Math.ceil((maxValue + 4) / 5) * 5;
  const baseValue = Number(payload.baseValue) || 100;
  const tickIndexes = getGpuHistoryTickIndexes(labels, canvas.clientWidth);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "80th percentile",
          data: payload.bandHighValues ?? [],
          borderColor: "rgba(15, 159, 131, 0)",
          backgroundColor: "rgba(15, 159, 131, 0.12)",
          borderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: "+1",
          spanGaps: true,
          isGpuIndexBand: true,
        },
        {
          label: "20th percentile",
          data: payload.bandLowValues ?? [],
          borderColor: "rgba(15, 159, 131, 0)",
          backgroundColor: "rgba(15, 159, 131, 0)",
          borderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          spanGaps: true,
          isGpuIndexBand: true,
        },
        {
          label: "EG Neo-Cloud Proxy Index",
          data: payload.indexValues ?? [],
          borderColor: "#0f766e",
          backgroundColor: "#0f766e",
          borderWidth: 3,
          tension: 0.12,
          pointRadius: 2.5,
          pointHoverRadius: 6,
          pointHitRadius: 10,
          spanGaps: true,
        },
        {
          label: `Base ${baseValue.toFixed(0)}`,
          data: labels.map(() => baseValue),
          borderColor: "#d97706",
          backgroundColor: "#d97706",
          borderWidth: 1.2,
          borderDash: [3, 5],
          pointRadius: 0,
          pointHoverRadius: 0,
          spanGaps: true,
          isGpuIndexBaseline: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            filter: (item, data) => !data.datasets[item.datasetIndex]?.isGpuIndexBand,
          },
        },
        tooltip: {
          filter: (context) => !context.dataset.isGpuIndexBaseline && !context.dataset.isGpuIndexBand,
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatYearMonthPeriodLabel(labels[value]),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => Number(value).toFixed(0), maxTicksLimit: 7 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createEgGpuModelPriceChart(canvas, series) {
  if (typeof Chart === "undefined" || !canvas || !series?.dates?.length) {
    return;
  }

  const labels = series.dates;
  const values = (series.values ?? []).map((value) => (
    value !== null && value !== "" && Number.isFinite(Number(value)) ? Number(value) : null
  ));
  const finiteValues = values.filter(Number.isFinite);
  if (!finiteValues.length) {
    return;
  }

  const minValue = Math.min(...finiteValues);
  const maxValue = Math.max(...finiteValues);
  const span = Math.max(maxValue - minValue, 0.05);
  const padding = Math.max(span * 0.12, 0.015);
  const yMin = Math.floor((minValue - padding) * 100) / 100;
  const yMax = Math.ceil((maxValue + padding) * 100) / 100;
  const tickIndexes = getGpuHistoryTickIndexes(labels, canvas.clientWidth);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: series.label ?? `${series.market ?? "Neo-Cloud"} / ${series.gpu ?? "GPU"}`,
          data: values,
          borderColor: "#0f9f83",
          backgroundColor: "rgba(15, 159, 131, 0.10)",
          borderWidth: 2.4,
          tension: 0.16,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointHitRadius: 9,
          fill: false,
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items?.[0]?.label ?? "",
            label: (context) => `${series.label ?? "GPU rental"}: $${Number(context.parsed.y).toFixed(2)}/GPU-hour`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = tickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => formatYearMonthPeriodLabel(labels[value]),
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `$${Number(value).toFixed(2)}`,
            maxTicksLimit: 7,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function getGpuCloudItems() {
  return gpuCloudData.items ?? [];
}

function isGpuStepChange(data, index) {
  const current = data[index];
  if (!Number.isFinite(current)) {
    return false;
  }
  const prev = index > 0 ? data[index - 1] : null;
  const next = index < data.length - 1 ? data[index + 1] : null;
  if (!Number.isFinite(prev) || prev !== current) {
    return true;
  }
  if (!Number.isFinite(next) || next !== current) {
    return true;
  }
  return false;
}

function buildGpuStepDataset(label, data, color) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 2.4,
    tension: 0,
    stepped: true,
    pointRadius: (context) => (isGpuStepChange(context.dataset.data, context.dataIndex) ? 3 : 0),
    pointHoverRadius: 5,
    pointHitRadius: 10,
    spanGaps: true,
  };
}

function getGpuCloudItemByKey(key) {
  return getGpuCloudItems().find((item) => item.key === key) ?? null;
}

function formatGpuCloudValue(value) {
  return Number.isFinite(value) ? `$${Number(value).toFixed(2)}/hr` : "N/A";
}

function formatGpuCloudChange(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
}

function getGpuTermBenchmarks() {
  return gpuCloudData.termBenchmarks ?? [];
}

function getGpuSemiAnalysisSeries() {
  return gpuCloudData.semiAnalysisH100 ?? null;
}

function getGpuSemiAnalysisSpotSeries() {
  return gpuCloudData.semiAnalysisH100Spot ?? null;
}

function buildGpuMergedLabels(seriesList) {
  return [...new Set(seriesList.flatMap((series) => series?.labels ?? []))];
}

function buildGpuAlignedSeriesData(labels, sourceLabels, sourceValues) {
  const labelIndex = new Map();
  (sourceLabels ?? []).forEach((label, index) => {
    labelIndex.set(label, index);
  });
  return labels.map((label) => {
    const index = labelIndex.get(label);
    return index === undefined ? null : sourceValues?.[index] ?? null;
  });
}

function getOrnnGpuSeriesEntries() {
  return Object.entries(ornnGpuIndexData?.series ?? {});
}

function getActiveOrnnGpuSeries() {
  return ornnGpuIndexData?.series?.[state.ornnGpuKey] ?? getOrnnGpuSeriesEntries()[0]?.[1] ?? null;
}

function getOrnnGpuRangeConfig() {
  return (ornnGpuIndexData.ranges ?? []).find((range) => range.key === state.ornnGpuRange)
    ?? (ornnGpuIndexData.ranges ?? [])[0]
    ?? { key: "3m", label: "3M", days: 90 };
}

function buildOrnnGpuChartPayload(series) {
  const dates = series?.dates ?? [];
  const values = series?.values ?? [];
  const range = getOrnnGpuRangeConfig();
  const startDate = range.key === "ytd" && dates.length ? shiftDateByRange(dates[dates.length - 1], "ytd", dates[0], dates) : "";
  const rangeDays = Number(range.days) || 90;
  const startIndex = startDate
    ? Math.max(0, dates.findIndex((label) => label >= startDate))
    : Math.max(0, dates.length - rangeDays);
  return {
    labels: dates.slice(startIndex),
    datasets: [
      {
        label: series?.label ?? "GPU Index",
        data: values.slice(startIndex),
        borderColor: series?.color ?? "#111827",
        backgroundColor: "rgba(17, 24, 39, 0.05)",
        borderWidth: 2.8,
        tension: 0.22,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
        spanGaps: true,
      },
    ],
  };
}

function createOrnnGpuIndexChart(canvas, series) {
  if (typeof Chart === "undefined" || !series) {
    return;
  }

  const payload = buildOrnnGpuChartPayload(series);
  const allValues = payload.datasets.flatMap((dataset) => dataset.data.filter((value) => Number.isFinite(value)));
  const minValue = allValues.length ? Math.min(...allValues) : 0;
  const maxValue = allValues.length ? Math.max(...allValues) : 5;
  const yMin = Math.max(0, Math.floor(minValue * 0.9 * 10) / 10);
  const yMax = Math.ceil(maxValue * 1.1 * 10) / 10;
  const selectedTickIndexes = getMacroTickIndexes(payload.labels, state.ornnGpuRange, canvas?.clientWidth ?? 0);
  const selectedTickSet = new Set(selectedTickIndexes);

  const chart = new Chart(canvas, {
    type: "line",
    data: payload,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (tooltipItems) => tooltipItems?.[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: ${formatGpuCloudValue(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          afterBuildTicks: (axis) => {
            axis.ticks = selectedTickIndexes.map((index) => ({ value: index }));
          },
          ticks: {
            color: "#8d8d86",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => {
              if (!selectedTickSet.has(value)) {
                return "";
              }
              const label = payload.labels[value];
              return label ? formatRangeAxisDate(label, state.ornnGpuRange) : "";
            },
          },
          border: { color: "#d8d8d2" },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: { color: "#8d8d86", callback: (value) => formatGpuCloudValue(value), maxTicksLimit: 6 },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function renderGpuCloudOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  if (!gpuCloudRuntime.loaded) {
    hydrateGpuCloudRuntimeFromLocal();
  }

  const semiSeries = getGpuSemiAnalysisSeries();
  const egIndex = egGpuRentalIndexData;
  const egModelSeries = Object.values(egIndex.models ?? {})
    .filter((series) => series?.display && series?.key && series?.dates?.length && series?.values?.length);
  const egModelMarkup = egModelSeries
    .map(
      (series) => `
        <section class="gpu-rental-neo-series">
          <div class="gpu-rental-neo-head">
            <div>
              <span class="gpu-rental-neo-kicker">EG SMOOTHED NEO-CLOUD INDEX</span>
              <h4>${series.label ?? "GPU"}</h4>
            </div>
            <strong>$${Number(series.latestValue).toFixed(2)}<small>/GPU-hour</small></strong>
          </div>
          <div class="memory-card-meta gpu-term-meta">
            <span>${series.dates?.[0] ?? "-"} - ${series.latestDate ?? series.dates?.at(-1) ?? "-"}</span>
            <span>${series.latestProviderCount ?? 0} providers</span>
            <span>${Number(series.latestOfferCount ?? 0).toLocaleString()} offers</span>
          </div>
          <div class="memory-chart-wrap gpu-rental-neo-chart">
            <canvas data-eg-gpu-model="${series.key}"></canvas>
          </div>
        </section>`,
    )
    .join("");
  const ornnSeriesEntries = getOrnnGpuSeriesEntries();
  const activeOrnnSeries = getActiveOrnnGpuSeries();
  const ornnGpuTabsMarkup = ornnSeriesEntries
    .map(
      ([key, item]) => `
        <button
          type="button"
          class="total-series-chip${state.ornnGpuKey === key ? " active" : ""}"
          data-ornn-gpu="${key}"
        >
          <span class="total-series-dot" style="background:${item.color}"></span>
          ${item.label}
        </button>`,
    )
    .join("");
  const ornnRangeMarkup = (ornnGpuIndexData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.ornnGpuRange === range.key ? " active" : ""}"
          data-ornn-gpu-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="memory-overview">
      <div class="us-section-head cloud-section-head">
        <h2>${gpuCloudData.dashboard?.title ?? "GPU Rental Price Dashboard"}</h2>
        <p>${gpuCloudData.dashboard?.subtitle ?? "SemiAnalysis H100 1Y monthly contract benchmark"}</p>
      </div>
      <section class="memory-banner">
        <div>
          <strong>Contract benchmark</strong>
          <span>${gpuCloudData.source?.semiAnalysisName ?? "SemiAnalysis H100 1Y contract index"}</span>
        </div>
        <div>
          <strong>Update</strong>
          <span>${semiSeries?.updatedAt ?? "-"}</span>
        </div>
        <div>
          <strong>Series</strong>
          <span>H100 1Y midpoint</span>
        </div>
        <div>
          <strong>Source</strong>
          <span>${semiSeries?.sourceLabel ?? "SemiAnalysis / ClusterMAX research"}</span>
        </div>
        <div>
          <strong>Method</strong>
          <span>Public chart approximation</span>
        </div>
      </section>
      <section class="memory-panel-grid memory-panel-grid-wide gpu-rental-chart-grid">
        <article class="memory-panel">
          <div class="us-panel-head">
            <div>
              <h3>${semiSeries?.title ?? "SemiAnalysis H100 1Y Contract Index"}</h3>
              <p>${semiSeries?.subtitle ?? ""}</p>
            </div>
          </div>
          <div class="memory-card-meta gpu-term-meta">
            <span>${semiSeries?.sourceLabel ?? "SemiAnalysis / ClusterMAX research"}</span>
            <span>${semiSeries?.latestLabel ?? "-"} ${Number.isFinite(semiSeries?.latestValue) ? `| ${formatGpuCloudValue(semiSeries.latestValue)}` : ""}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Cycle low</span>
            <span class="memory-stat-value">${Number.isFinite(semiSeries?.floor) ? `${formatGpuCloudValue(semiSeries.floor)} | ${semiSeries.floorLabel}` : "N/A"}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Method</span>
            <span class="memory-stat-value">${semiSeries?.method ?? ""}</span>
          </div>
          <div class="memory-chart-wrap">
            <canvas data-gpu-basket="semi-h100-1y"></canvas>
          </div>
        </article>
        <article class="memory-panel">
          <div class="us-panel-head">
            <div>
              <h3>Ornn Compute Price Index</h3>
              <p>GPU rental spot index from dashboard.ornnai.com. Use the chip selector to switch hardware.</p>
            </div>
            <div class="m7-range-row">${ornnRangeMarkup}</div>
          </div>
          <div class="total-series-row total-series-row-left">
            ${ornnGpuTabsMarkup}
          </div>
          <div class="memory-card-meta gpu-term-meta">
            <span>${ornnGpuIndexData.source?.name ?? "Ornn Compute Price Index"}</span>
            <span>${activeOrnnSeries?.latestDate ?? "-"} ${Number.isFinite(activeOrnnSeries?.latestValue) ? `| ${formatGpuCloudValue(activeOrnnSeries.latestValue)}` : ""}</span>
            <span>${formatGpuCloudChange(activeOrnnSeries?.latestChangePct)}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Active GPU</span>
            <span class="memory-stat-value">${activeOrnnSeries?.apiName ?? activeOrnnSeries?.label ?? "-"}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Source</span>
            <span class="memory-stat-value">dashboard.ornnai.com public index API</span>
          </div>
          <div class="memory-chart-wrap">
            <canvas data-ornn-gpu-index="overview"></canvas>
          </div>
        </article>
        <article class="memory-panel gpu-rental-index-panel">
          <div class="us-panel-head">
            <div>
              <h3>EG Neo-Cloud GPU Rental Index</h3>
              <p>dstack gpuhunt 공개 On-demand 오퍼만으로 매일 독립 산출하는 완만한 시장가격 지수입니다.</p>
            </div>
          </div>
          <div class="gpu-rental-composite-grid">
            <section class="gpu-rental-composite-chart">
              <div class="gpu-rental-neo-head">
                <div>
                  <span class="gpu-rental-neo-kicker">INDEPENDENT SMOOTHED INDEX · BASE ${egIndex.baseDate ?? "-"} = 100</span>
                  <h4>H100 80GB · A100 80GB · L40S</h4>
                </div>
                <strong>${Number(egIndex.latestValue).toFixed(2)}<small>${Number.isFinite(egIndex.weeklyChangePct) ? `${egIndex.weeklyChangePct > 0 ? "+" : ""}${egIndex.weeklyChangePct.toFixed(2)}% WoW` : "WoW N/A"}</small></strong>
              </div>
              <div class="memory-card-meta gpu-term-meta">
                <span>${egIndex.updatedAt ?? "-"}</span>
                <span>${egIndex.latestSnapshot?.catalogVersion ?? "-"}</span>
                <span>${egIndex.latestSnapshot?.providerCount ?? 0} providers</span>
                <span>${Number(egIndex.latestSnapshot?.offerCount ?? 0).toLocaleString()} eligible offers</span>
              </div>
              <div class="memory-chart-wrap gpu-rental-composite-canvas">
                <canvas data-eg-gpu-index="composite"></canvas>
              </div>
            </section>
            <aside class="gpu-rental-method">
              <span class="gpu-rental-neo-kicker">INDEX METHODOLOGY</span>
              <h4>독립 지수 산식</h4>
              <ol>
                <li><strong>오퍼 정규화</strong><span>인스턴스 시간당 가격 ÷ GPU 개수</span></li>
                <li><strong>공급자 가격</strong><span>각 공급자의 모델별 On-demand 오퍼 중앙값</span></li>
                <li><strong>Neo-Cloud 가격</strong><span>AWS·Azure·GCP·OCI를 제외한 공급자 중앙값의 중앙값</span></li>
                <li><strong>가격 평활화</strong><span>105일 반감기 EWMA로 단발성 오퍼 교체 충격 완화</span></li>
                <li><strong>EG 종합지수</strong><span>H100·A100·L40S 평활 가격 상대지수의 중앙값</span></li>
              </ol>
              <p>공개 오퍼만으로 계산하며 Spot·예약가격은 제외합니다. 공급자 구성이 바뀌어도 지수가 과도하게 튀지 않도록 장기 EWMA를 적용합니다.</p>
            </aside>
          </div>
          ${egModelMarkup ? `<div class="gpu-rental-neo-grid">${egModelMarkup}</div>` : ""}
          <div class="gpu-rental-source-note">
            <a href="${egIndex.source?.repositoryUrl ?? "https://github.com/dstackai/gpuhunt"}" target="_blank" rel="noreferrer">dstack gpuhunt</a>
            <span>Source: dstack gpuhunt public catalog (${egIndex.source?.license ?? "MPL-2.0"}) · Calculation: EG Dashboard. 과거 공개 카탈로그를 동일 산식으로 백필하고 이후 매일 누적합니다.</span>
          </div>
        </article>
      </section>
    </section>
  `;

  const semiCanvas = usOverviewRoot.querySelector('[data-gpu-basket="semi-h100-1y"]');

  if (semiCanvas && semiSeries) {
    createGpuLineChart(
      semiCanvas,
      semiSeries.labels ?? [],
      [
        {
          label: "H100 1Y",
          data: semiSeries.values ?? [],
          borderColor: "#111827",
          backgroundColor: "#111827",
          borderWidth: 2.6,
          tension: 0.22,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          spanGaps: false,
        },
      ],
      (value) => `$${Number(value).toFixed(2)}`,
    );
  }

  const egCompositeCanvas = usOverviewRoot.querySelector('[data-eg-gpu-index="composite"]');
  if (egCompositeCanvas) {
    createEgGpuRentalIndexChart(egCompositeCanvas, egIndex);
  }

  usOverviewRoot.querySelectorAll("[data-eg-gpu-model]").forEach((canvas) => {
    const series = egModelSeries.find((item) => item.key === canvas.dataset.egGpuModel);
    if (series) {
      createEgGpuModelPriceChart(canvas, series);
    }
  });

  usOverviewRoot.querySelectorAll("[data-ornn-gpu]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ornnGpuKey = button.dataset.ornnGpu || state.ornnGpuKey;
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-ornn-gpu-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ornnGpuRange = button.dataset.ornnGpuRange || state.ornnGpuRange;
      render();
    });
  });

  const ornnCanvas = usOverviewRoot.querySelector('[data-ornn-gpu-index="overview"]');
  if (ornnCanvas && activeOrnnSeries) {
    createOrnnGpuIndexChart(ornnCanvas, activeOrnnSeries);
  }
}

function renderMemorySpotOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  if (!memorySpotRuntime.loaded) {
    hydrateMemorySpotRuntimeFromLocal();
  }

  if (!memorySpotRuntime.loaded && !memorySpotRuntime.loading && !memorySpotRuntime.error) {
    loadMemorySpotHistory();
  }

  const featuredItems = (memorySpotData.dashboards?.featuredKeys ?? [])
    .map((key) => {
      const item = getMemorySpotItemByKey(key);
      const runtime = memorySpotRuntime.items[key] ?? {};
      return item
        ? {
            ...item,
            latestValue: runtime.latestValue ?? item.latestValue,
            latestChangePct: runtime.latestChangePct ?? item.latestChangePct,
            latestDate: runtime.latestDate ?? null,
            history: runtime.history ?? item.history ?? [],
          }
        : null;
    })
    .filter(Boolean);
  const availableDates = Object.values(memorySpotRuntime.items)
    .flatMap((item) => (item?.latestDate ? [item.latestDate] : []))
    .sort();
  const periodStart = memorySpotRuntime.labels[0] || "2022-01-01";
  const periodEnd = memorySpotRuntime.labels[memorySpotRuntime.labels.length - 1] || memorySpotRuntime.updatedAt || periodStart;
  const firstObservedDate = availableDates[0] || null;
  const contractGuide = memorySpotData.trendforceContractGuide ?? {};
  const contractRows = contractGuide.quarterlyRows ?? [];
  const contractTableRows = contractRows
    .map(
      (row) => `
        <div class="memory-contract-row">
          <span>
            <strong>${row.period}</strong>
            <small>${row.basis}</small>
            <a href="${row.sourceUrl}" target="_blank" rel="noreferrer">${row.sourceTitle}</a>
            ${row.nandSourceUrl ? `<a href="${row.nandSourceUrl}" target="_blank" rel="noreferrer">${row.nandSourceTitle}</a>` : ""}
            ${row.hbmSourceUrl ? `<a href="${row.hbmSourceUrl}" target="_blank" rel="noreferrer">${row.hbmSourceTitle}</a>` : ""}
          </span>
          <span>${formatMemoryRangeValue(row.dram)}</span>
          <span>${formatMemoryRangeValue(row.nand)}</span>
          <span>${formatMemoryRangeValue(row.hbm)}</span>
        </div>`,
    )
    .join("");
  const monthlyWatchRows = (contractGuide.monthlyRows ?? [])
    .map(
      (row) => `
        <div class="memory-note-row">
          <span>
            <strong>${row.period} ${row.segment}</strong>
            <small>${row.basis}</small>
            <a href="${row.sourceUrl}" target="_blank" rel="noreferrer">${row.sourceTitle}</a>
          </span>
          <span>${row.range}</span>
        </div>`,
    )
    .join("");
  const spotContractChecks = memorySpotData.spotContractChecks ?? {};
  const spotContractRows = (spotContractChecks.rows ?? [])
    .map((row) => {
      const check = getMemorySpotCheckValues(row);
      return `
        <div class="memory-spot-contract-row">
          <span>
            <strong>${row.item}</strong>
            <small>${row.note}</small>
          </span>
          <span>
            <strong>${formatMemoryDollar(check.spotPrice, row.spotUnit)}</strong>
            <small>${check.spotDate ?? "-"}</small>
          </span>
          <span>
            <strong>${formatMemoryDollar(row.contractPrice, row.contractUnit)}</strong>
            <small>${row.contractDate ?? "not public"}</small>
          </span>
          <span>${formatMemoryPremium(check.premiumPct)}</span>
        </div>`;
    })
    .join("");

  const featuredMarkup = featuredItems
    .map(
      (item) => `
        <article class="memory-card">
          <div class="memory-card-head">
            <span class="memory-dot" style="background:${item.color}"></span>
            <div>
              <h3>${item.label}</h3>
              <p>${item.benchmarkName}</p>
            </div>
          </div>
          <div class="memory-card-value">${formatMemorySpotValue(item.latestValue)}</div>
          <div class="memory-card-meta">
            <span>${item.category}</span>
            <span>${item.cadence}</span>
            <span>${formatMemorySpotChange(item.latestChangePct)}</span>
            <span>${item.latestDate || "No data"}</span>
          </div>
        </article>`,
    )
    .join("");

  const basketMarkup = (memorySpotData.dashboards?.basketPanels ?? [])
    .map((panel) => {
      const panelItems = (panel.itemKeys ?? [])
        .map((key) => {
          const item = getMemorySpotItemByKey(key);
          const runtime = memorySpotRuntime.items[key] ?? {};
          return item
            ? {
                ...item,
                latestValue: runtime.latestValue ?? item.latestValue,
                latestChangePct: runtime.latestChangePct ?? item.latestChangePct,
                latestDate: runtime.latestDate ?? null,
                history: runtime.history ?? item.history ?? [],
              }
            : null;
        })
        .filter(Boolean);
      const lines = panelItems
        .map(
          (item) => `
            <div class="memory-list-row">
              <span><span class="memory-dot" style="background:${item.color}"></span>${item.label}</span>
              <span>${formatMemorySpotValue(item.latestValue)}</span>
              <span>${formatMemorySpotChange(item.latestChangePct)}</span>
            </div>`,
        )
        .join("");

      return `
        <article class="memory-panel">
          <div class="us-panel-head">
            <div>
              <h3>${panel.title}</h3>
              <p>${panel.description}</p>
            </div>
            <div class="m7-range-row">
              ${MEMORY_SPOT_RANGE_OPTIONS.map(
                (range) => `
                  <button
                    type="button"
                    class="m7-range-chip${getMemorySpotRange(`basket:${panel.key}`) === range.key ? " active" : ""}"
                    data-memory-range="${range.key}"
                    data-memory-target="basket:${panel.key}"
                  >
                    ${range.label}
                  </button>`,
              ).join("")}
            </div>
          </div>
          <div class="memory-list">
            <div class="memory-list-head">
              <span>Series</span>
              <span>Last</span>
              <span>Change</span>
            </div>
            ${lines}
          </div>
          <div class="memory-chart-wrap">
            <canvas data-memory-basket="${panel.key}"></canvas>
          </div>
        </article>
      `;
    })
    .join("");

  const detailMarkup = getMemorySpotItems()
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    .map((rawItem) => {
      const runtime = memorySpotRuntime.items[rawItem.key] ?? {};
      const item = {
        ...rawItem,
        latestValue: runtime.latestValue ?? rawItem.latestValue,
        latestChangePct: runtime.latestChangePct ?? rawItem.latestChangePct,
        latestDate: runtime.latestDate ?? null,
        history: runtime.history ?? rawItem.history ?? [],
      };
      return `
        <article class="memory-panel">
          <div class="us-panel-head">
            <div>
              <h3>${item.label}</h3>
              <p>${item.benchmarkName}</p>
            </div>
            <div class="m7-range-row">
              ${MEMORY_SPOT_RANGE_OPTIONS.map(
                (range) => `
                  <button
                    type="button"
                    class="m7-range-chip${getMemorySpotRange(`series:${item.key}`) === range.key ? " active" : ""}"
                    data-memory-range="${range.key}"
                    data-memory-target="series:${item.key}"
                  >
                    ${range.label}
                  </button>`,
              ).join("")}
            </div>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Latest</span>
            <span class="memory-stat-value">${formatMemorySpotValue(item.latestValue)}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Session Change</span>
            <span class="memory-stat-value">${formatMemorySpotChange(item.latestChangePct)}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Cadence</span>
            <span class="memory-stat-value">${item.cadence}</span>
          </div>
          <div class="memory-stat-row">
            <span class="memory-stat-label">Last Date</span>
            <span class="memory-stat-value">${item.latestDate || "No data"}</span>
          </div>
          <div class="memory-chart-wrap">
            <canvas data-memory-series="${item.key}"></canvas>
          </div>
        </article>`;
    })
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="memory-overview">
      <div class="us-section-head cloud-section-head">
        <h2>Memory Data Dashboard</h2>
        <p>Spot benchmarks plus TrendForce contract-price guides for DRAM, NAND, and HBM</p>
      </div>
      <section class="memory-banner">
        <div>
          <strong>Source</strong>
          <span>${memorySpotData.source?.name ?? "Public memory data dashboard"}</span>
        </div>
        <div>
          <strong>Updated</strong>
          <span>${memorySpotRuntime.updatedAt || memorySpotData.updatedAt || (memorySpotRuntime.loading ? "Loading..." : "Awaiting first scrape")}</span>
        </div>
        <div>
          <strong>Coverage</strong>
          <span>${featuredItems.length} spot benchmarks + contract guide</span>
        </div>
        <div>
          <strong>Period</strong>
          <span>${periodStart} -> ${periodEnd}</span>
        </div>
        <div>
          <strong>First Data</strong>
          <span>${firstObservedDate || (memorySpotRuntime.loading ? "Loading..." : "No data")}</span>
        </div>
      </section>
      ${memorySpotRuntime.error ? `<section class="memory-error">${memorySpotRuntime.error}</section>` : ""}
      <section class="memory-card-grid">
        ${featuredMarkup}
      </section>
      <section class="memory-panel memory-contract-panel">
        <div class="us-panel-head">
          <div>
            <h3>${contractGuide.title ?? "TrendForce Memory Contract Price Guide"}</h3>
            <p>${contractGuide.subtitle ?? "Quarterly contract-price momentum from public TrendForce articles"}</p>
          </div>
          <div class="memory-card-meta gpu-term-meta">
            <span>Updated ${contractGuide.updatedAt ?? "-"}</span>
            <span>${contractGuide.unit ?? "% QoQ"}</span>
          </div>
        </div>
        <div class="memory-contract-grid">
          <div class="memory-chart-wrap">
            <canvas data-memory-contract-guide="trendforce"></canvas>
          </div>
          <div class="memory-contract-table">
            <div class="memory-contract-head">
              <span>Period</span>
              <span>DRAM</span>
              <span>NAND</span>
              <span>HBM/Blend</span>
            </div>
            ${contractTableRows}
          </div>
        </div>
        <div class="memory-guide-note">${contractGuide.note ?? ""}</div>
        ${monthlyWatchRows ? `
          <div class="memory-monthly-watch">
            <div class="memory-list-head memory-note-head">
              <span>Monthly watch</span>
              <span>Move</span>
            </div>
            ${monthlyWatchRows}
          </div>
        ` : ""}
      </section>
      <section class="memory-panel memory-spot-contract-panel">
        <div class="us-panel-head">
          <div>
            <h3>${spotContractChecks.title ?? "Spot vs Contract Dollar Check"}</h3>
            <p>${spotContractChecks.subtitle ?? ""}</p>
          </div>
          ${(spotContractChecks.sources ?? [
            {
              title: spotContractChecks.sourceTitle ?? "TrendForce price page",
              url: spotContractChecks.sourceUrl ?? "https://www.trendforce.com/price/dram/dram_spot",
            },
            spotContractChecks.secondarySourceUrl ? {
              title: spotContractChecks.secondarySourceTitle ?? "Secondary source",
              url: spotContractChecks.secondarySourceUrl,
            } : null,
          ]).filter(Boolean).map((source) => `
            <a class="market-breadth-link" href="${source.url}" target="_blank" rel="noreferrer">
              ${source.title}
            </a>
          `).join("")}
        </div>
        <div class="memory-spot-contract-table">
          <div class="memory-spot-contract-head">
            <span>Item</span>
            <span>Spot</span>
            <span>Contract</span>
            <span>Spot premium</span>
          </div>
          ${spotContractRows}
        </div>
        <div class="memory-guide-note">${spotContractChecks.note ?? ""}</div>
      </section>
      <section class="memory-panel-grid memory-panel-grid-wide">
        ${basketMarkup}
      </section>
      <section class="memory-panel-grid">
        ${detailMarkup}
      </section>
    </section>
  `;

  if (!memorySpotRuntime.loaded) {
    return;
  }

  const contractCanvas = usOverviewRoot.querySelector('[data-memory-contract-guide="trendforce"]');
  if (contractCanvas) {
    createMemoryContractGuideChart(contractCanvas, contractRows);
  }

  usOverviewRoot.querySelectorAll("[data-memory-range]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetKey = button.dataset.memoryTarget;
      const rangeKey = button.dataset.memoryRange;
      if (!targetKey || !rangeKey) {
        return;
      }

      state.memorySpotRanges = {
        ...(state.memorySpotRanges ?? {}),
        [targetKey]: rangeKey,
      };
      renderMemorySpotOverview();
    });
  });

  (memorySpotData.dashboards?.basketPanels ?? []).forEach((panel) => {
    const canvas = usOverviewRoot.querySelector(`[data-memory-basket="${panel.key}"]`);
    if (!canvas) {
      return;
    }

    const datasets = (panel.itemKeys ?? [])
      .map((key) => {
        const item = getMemorySpotItemByKey(key);
        const runtime = memorySpotRuntime.items[key];
        if (!item || !runtime) {
          return null;
        }
        return {
          label: item.label,
          data: runtime.history,
          borderColor: item.color,
          backgroundColor: item.color,
          borderWidth: 2.2,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10,
          spanGaps: true,
        };
      })
      .filter(Boolean);

    createMemoryLineChart(
      canvas,
      memorySpotRuntime.labels,
      datasets,
      (value) => `$${Number(value).toFixed(2)}`,
      getMemorySpotRange(`basket:${panel.key}`),
    );
  });

  getMemorySpotItems().forEach((item) => {
    const canvas = usOverviewRoot.querySelector(`[data-memory-series="${item.key}"]`);
    const runtime = memorySpotRuntime.items[item.key];
    if (!canvas || !runtime) {
      return;
    }

    createMemoryLineChart(
      canvas,
      memorySpotRuntime.labels,
      [
        {
          label: item.label,
          data: runtime.history,
          borderColor: item.color,
          backgroundColor: item.color,
          borderWidth: 2.2,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 10,
          spanGaps: true,
        },
      ],
      (value) => `$${Number(value).toFixed(2)}`,
      getMemorySpotRange(`series:${item.key}`),
    );
  });
}

function renderCapexOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");
  const annualBig5Panel = buildAnnualBig5CapexPanel();
  const ttmCapexToOcfPanel = buildTtmCapexToOcfPanel();

  usOverviewRoot.innerHTML = `
    <section class="cloud-overview">
      <div class="us-section-head cloud-section-head">
        <h2>Big Tech Capex & Cash Flow Dashboard</h2>
        <p>Quarterly capex, OCF, and derived FCF trends on the same CY-adjusted basis</p>
      </div>
      <div class="cloud-panel-grid">
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>Annual BIG5 Capex Total (리스 포함, CY기준)</h3>
              <p>Annual big tech capex sum; both 2026E vintages show growth versus 2025 actual</p>
              <p>*2026E 합산은 ORCL 제외 (공식 연간 Capex 가이던스 미공개)</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-capex-chart="annual-big5-capex"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>TTM Capex / OCF</h3>
              <p>Trailing 4-quarter capex over trailing 4-quarter operating cash flow</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-capex-chart="ttm-capex-to-ocf"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.quarterlyCapex.title}</h3>
              <p>${capexDashboardData.quarterlyCapex.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-capex-chart="quarterly-capex"></canvas>
          </div>
        </article>
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.quarterlyYoy.title}</h3>
              <p>${capexDashboardData.quarterlyYoy.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-capex-chart="quarterly-yoy"></canvas>
          </div>
        </article>
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.annualCapex.title}</h3>
              <p>${capexDashboardData.annualCapex.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-capex-chart="annual-capex"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.quarterlyOcf.title}</h3>
              <p>${capexDashboardData.quarterlyOcf.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-capex-chart="quarterly-ocf"></canvas>
          </div>
        </article>
        <article class="cloud-panel cloud-panel-wide">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.quarterlyFcf.title}</h3>
              <p>${capexDashboardData.quarterlyFcf.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap cloud-chart-wrap-tall">
            <canvas data-capex-chart="quarterly-fcf"></canvas>
          </div>
          ${capexDashboardData.quarterlyFcf.sourceNote ? `<p class="capex-source-note">${capexDashboardData.quarterlyFcf.sourceNote}</p>` : ""}
        </article>
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.quarterlyCapexToOcf.title}</h3>
              <p>${capexDashboardData.quarterlyCapexToOcf.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-capex-chart="capex-to-ocf"></canvas>
          </div>
        </article>
        <article class="cloud-panel">
          <div class="us-panel-head">
            <div>
              <h3>${capexDashboardData.cashHistory.title}</h3>
              <p>${capexDashboardData.cashHistory.subtitle}</p>
            </div>
          </div>
          <div class="cloud-chart-wrap">
            <canvas data-capex-chart="cash-history"></canvas>
          </div>
        </article>
      </div>
    </section>
  `;

  const annualBig5CapexCanvas = usOverviewRoot.querySelector('[data-capex-chart="annual-big5-capex"]');
  const ttmCapexToOcfCanvas = usOverviewRoot.querySelector('[data-capex-chart="ttm-capex-to-ocf"]');
  const quarterlyCapexCanvas = usOverviewRoot.querySelector('[data-capex-chart="quarterly-capex"]');
  const quarterlyYoyCanvas = usOverviewRoot.querySelector('[data-capex-chart="quarterly-yoy"]');
  const annualCapexCanvas = usOverviewRoot.querySelector('[data-capex-chart="annual-capex"]');
  const quarterlyOcfCanvas = usOverviewRoot.querySelector('[data-capex-chart="quarterly-ocf"]');
  const quarterlyFcfCanvas = usOverviewRoot.querySelector('[data-capex-chart="quarterly-fcf"]');
  const capexToOcfCanvas = usOverviewRoot.querySelector('[data-capex-chart="capex-to-ocf"]');
  const cashHistoryCanvas = usOverviewRoot.querySelector('[data-capex-chart="cash-history"]');

  if (annualBig5CapexCanvas) {
    createCapexAggregateComboChart(annualBig5CapexCanvas, annualBig5Panel);
  }
  if (ttmCapexToOcfCanvas) {
    createCapexLineChart(ttmCapexToOcfCanvas, ttmCapexToOcfPanel.labels, ttmCapexToOcfPanel, (value) => `${Number(value).toFixed(0)}%`);
  }
  if (quarterlyCapexCanvas) {
    createCapexBarChart(quarterlyCapexCanvas, capexDashboardData.quarterLabels, capexDashboardData.quarterlyCapex, (value) => `$${Number(value).toFixed(1)}B`);
  }
  if (quarterlyYoyCanvas) {
    createCapexLineChart(quarterlyYoyCanvas, capexDashboardData.quarterLabels, capexDashboardData.quarterlyYoy, (value) => `${Number(value).toFixed(0)}%`, -60);
  }
  if (annualCapexCanvas) {
    createCapexBarChart(annualCapexCanvas, capexDashboardData.annualLabels, capexDashboardData.annualCapex, (value) => `$${Number(value).toFixed(1)}B`);
  }
  if (quarterlyOcfCanvas) {
    createCapexBarChart(quarterlyOcfCanvas, capexDashboardData.quarterLabels, capexDashboardData.quarterlyOcf, (value) => `$${Number(value).toFixed(1)}B`);
  }
  if (quarterlyFcfCanvas) {
    createCapexBarChart(quarterlyFcfCanvas, capexDashboardData.quarterLabels, capexDashboardData.quarterlyFcf, (value) => `$${Number(value).toFixed(1)}B`);
  }
  if (capexToOcfCanvas) {
    createCapexLineChart(capexToOcfCanvas, capexDashboardData.quarterLabels, capexDashboardData.quarterlyCapexToOcf, (value) => `${Number(value).toFixed(0)}%`, -100);
  }
  if (cashHistoryCanvas) {
    createCapexLineChart(cashHistoryCanvas, capexDashboardData.cashLabels, capexDashboardData.cashHistory, (value) => `$${Number(value).toFixed(0)}B`, 0);
  }
}

function formatStudyCdsBps(value, signed = false) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  const sign = signed && numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(1)}bp`;
}

function formatStudyCdsObservationDate(value) {
  const dateText = String(value || "");
  return /^\d{4}-\d{2}-\d{2}$/.test(dateText) ? dateText.slice(5).replace("-", "/") : "-";
}

function formatStudyCdsNotional(value, isCapped = false) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "규모 미공개";
  }
  if (isCapped || numeric >= 5_000_000) {
    return "$5M+";
  }
  if (numeric >= 1_000_000) {
    return `$${(numeric / 1_000_000).toFixed(numeric % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (numeric >= 1_000) {
    return `$${(numeric / 1_000).toFixed(numeric % 1_000 === 0 ? 0 : 1)}K`;
  }
  return `$${numeric.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function getStudyCdsPayload(item, rangeKey) {
  const dates = studyCdsData.dates ?? [];
  const range = (studyCdsData.ranges ?? []).find((option) => option.key === rangeKey);
  const sessionCount = rangeKey === "1y" ? dates.length : Number(range?.sessions) || dates.length;
  const startIndex = Math.max(0, dates.length - sessionCount);
  return {
    labels: dates.slice(startIndex),
    values: (item.values ?? []).slice(startIndex),
    observed: (item.observedBps ?? []).slice(startIndex),
    directTradeCounts: (item.directTradeCounts ?? []).slice(startIndex),
    directTrades: (item.directTrades ?? []).slice(startIndex),
  };
}

function createStudyCdsChart(canvas, item, rangeKey) {
  if (!canvas || typeof Chart === "undefined") {
    return;
  }
  const payload = getStudyCdsPayload(item, rangeKey);
  if (!payload.labels.length || !payload.values.some((value) => Number.isFinite(Number(value)))) {
    return;
  }
  const tickSet = new Set(getMacroTickIndexes(payload.labels, rangeKey, canvas.clientWidth ?? 0));
  const pointRadius = payload.observed.map((value) => (Number.isFinite(Number(value)) ? 2.8 : 0));
  const pointHoverRadius = payload.observed.map((value) => (Number.isFinite(Number(value)) ? 5 : 3));
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: [
        {
          label: `${item.ticker} 5Y CDS`,
          data: payload.values,
          borderColor: item.color,
          backgroundColor: `${item.color}18`,
          borderWidth: 2.25,
          pointRadius,
          pointHoverRadius,
          pointBackgroundColor: item.color,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1.2,
          tension: 0.08,
          spanGaps: false,
          segment: {
            borderDash: (context) => (
              Number.isFinite(Number(payload.observed[context.p1DataIndex])) ? undefined : [5, 4]
            ),
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => formatFullIsoDate(payload.labels[items[0]?.dataIndex] ?? ""),
            label: (context) => {
              const index = context.dataIndex;
              const isObserved = Number.isFinite(Number(payload.observed[index]));
              const tradeCount = Number(payload.directTradeCounts[index]) || 0;
              return isObserved
                ? `일별 중앙값 ${formatStudyCdsBps(context.parsed.y)} · 직접 거래 ${tradeCount}건`
                : `${formatStudyCdsBps(context.parsed.y)} · 직전 관측값 이월`;
            },
            afterLabel: (context) => {
              const trades = payload.directTrades[context.dataIndex] ?? [];
              if (!trades.length) {
                return "";
              }
              return trades.map((trade, index) => (
                `#${index + 1} ${formatStudyCdsBps(trade.spreadBps)} · ${formatStudyCdsNotional(trade.notionalUsd, trade.isCapped)}`
              ));
            },
            footer: (itemsForDate) => {
              const trades = payload.directTrades[itemsForDate[0]?.dataIndex] ?? [];
              return trades.some((trade) => trade.isCapped) ? "$5M+는 DTCC 공개 상한" : "";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#77766d",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(payload.labels[value], rangeKey) : ""),
          },
        },
        y: {
          grace: "12%",
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: {
            color: "#77766d",
            callback: (value) => `${Number(value).toFixed(0)}bp`,
          },
        },
      },
    },
  });
  charts.push(chart);
}

function getStudyCdsIndexPayload(indexKey, labels) {
  const item = marketPriceData.items?.[indexKey];
  if (!item?.dates?.length) {
    return null;
  }
  const valueByDate = new Map(item.dates.map((day, index) => [day, item.values?.[index]]));
  return {
    key: indexKey,
    label: item.label || indexKey.toUpperCase(),
    color: indexKey === "sox" ? "#111827" : "#2563eb",
    values: labels.map((day) => {
      const value = Number(valueByDate.get(day));
      return Number.isFinite(value) ? value : null;
    }),
  };
}

function createStudyCdsComparisonChart(canvas, items, rangeKey, selectedIndexKeys = ["sox"]) {
  if (!canvas || typeof Chart === "undefined" || !items.length) {
    return;
  }
  const payloads = items.map((item) => getStudyCdsPayload(item, rangeKey));
  const labels = payloads[0]?.labels ?? [];
  if (!labels.length) {
    return;
  }
  const tickSet = new Set(getMacroTickIndexes(labels, rangeKey, canvas.clientWidth ?? 0));
  const indexPayloads = selectedIndexKeys
    .map((key) => getStudyCdsIndexPayload(key, labels))
    .filter(Boolean);
  const indexDatasets = indexPayloads.map((payload) => ({
    label: payload.label,
    data: payload.values,
    borderColor: payload.color,
    backgroundColor: payload.color,
    borderWidth: 2.8,
    pointRadius: 0,
    pointHoverRadius: 4,
    tension: 0.08,
    spanGaps: true,
    yAxisID: "yIndex",
    cdsSeriesType: "index",
  }));
  const cdsDatasets = items.map((item, index) => {
    const payload = payloads[index];
    return {
      label: item.ticker,
      data: payload.values,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: 2.15,
      pointRadius: payload.observed.map((value) => (Number.isFinite(Number(value)) ? 2.1 : 0)),
      pointHoverRadius: payload.observed.map((value) => (Number.isFinite(Number(value)) ? 5 : 3)),
      pointBackgroundColor: item.color,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 1,
      tension: 0.08,
      spanGaps: false,
      yAxisID: "yCds",
      cdsSeriesType: "cds",
      cdsPayloadIndex: index,
      segment: {
        borderDash: (context) => (
          Number.isFinite(Number(payload.observed[context.p1DataIndex])) ? undefined : [5, 4]
        ),
      },
    };
  });
  const chart = new Chart(canvas, {
    type: "line",
    data: { labels, datasets: [...indexDatasets, ...cdsDatasets] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 16,
            color: "#56564f",
            font: { family: "Space Grotesk", size: 11, weight: "700" },
          },
        },
        tooltip: {
          itemSort: (a, b) => {
            const aType = a.dataset.cdsSeriesType;
            const bType = b.dataset.cdsSeriesType;
            if (aType !== bType) {
              return aType === "index" ? -1 : 1;
            }
            return Number(b.parsed.y) - Number(a.parsed.y);
          },
          callbacks: {
            title: (itemsForDate) => formatFullIsoDate(labels[itemsForDate[0]?.dataIndex] ?? ""),
            label: (context) => {
              if (context.dataset.cdsSeriesType === "index") {
                return `${context.dataset.label} ${Number(context.parsed.y).toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
              }
              const payload = payloads[context.dataset.cdsPayloadIndex];
              const isObserved = Number.isFinite(Number(payload.observed[context.dataIndex]));
              const suffix = isObserved ? "직접 관측" : "직전값 이월";
              return `${context.dataset.label} ${formatStudyCdsBps(context.parsed.y)} · ${suffix}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#77766d",
            autoSkip: false,
            maxRotation: 0,
            callback: (value) => (tickSet.has(value) ? formatRangeAxisDate(labels[value], rangeKey) : ""),
          },
        },
        yIndex: {
          type: "linear",
          position: "left",
          display: indexDatasets.length > 0,
          grace: "8%",
          title: {
            display: true,
            text: "Index",
            color: "#66665f",
            font: { family: "Space Grotesk", size: 11, weight: "700" },
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: {
            color: "#77766d",
            callback: (value) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 }),
          },
        },
        yCds: {
          type: "linear",
          position: "right",
          grace: "10%",
          title: {
            display: true,
            text: "CDS Premium (bp)",
            color: "#8b2f26",
            font: { family: "Space Grotesk", size: 11, weight: "700" },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: "#8b2f26",
            callback: (value) => `${Number(value).toFixed(0)}bp`,
          },
        },
      },
    },
  });
  charts.push(chart);
}

function getStudyCdsFreshness(latest) {
  const staleDays = Number(latest?.staleDays);
  if (!Number.isFinite(staleDays)) {
    return { label: "관측 없음", className: "is-stale" };
  }
  if (staleDays === 0) {
    return { label: "당일 거래", className: "is-fresh" };
  }
  if (staleDays <= 3) {
    return { label: `${staleDays}일 경과`, className: "is-recent" };
  }
  return { label: `${staleDays}일 경과`, className: "is-stale" };
}

function renderStudyCdsOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const items = Object.values(studyCdsData.items ?? {});
  if (!studyCdsData.dates?.length || !items.length) {
    renderPlaceholderOverview("CDS", "DTCC CDS transaction data is not available yet.");
    return;
  }
  const latestItems = items.filter((item) => Number.isFinite(Number(item.latest?.bps)));
  const sortedLatest = [...latestItems].sort((a, b) => Number(b.latest.bps) - Number(a.latest.bps));
  const medianValues = sortedLatest.map((item) => Number(item.latest.bps)).sort((a, b) => a - b);
  const medianIndex = Math.floor(medianValues.length / 2);
  const medianBps = medianValues.length % 2
    ? medianValues[medianIndex]
    : (medianValues[medianIndex - 1] + medianValues[medianIndex]) / 2;
  const tightestItem = sortedLatest[sortedLatest.length - 1];
  const freshCount = latestItems.filter((item) => Number(item.latest?.staleDays) <= 3).length;
  const activeRange = (studyCdsData.ranges ?? []).some((range) => range.key === state.studyCdsRange)
    ? state.studyCdsRange
    : studyCdsData.defaultRange ?? "1y";
  state.studyCdsRange = activeRange;
  const indexOptions = [
    { key: "sox", label: "SOX" },
    { key: "nasdaq100", label: "NASDAQ 100" },
  ];
  const validIndexKeys = new Set(indexOptions.map((option) => option.key));
  const activeIndexKeys = (state.studyCdsIndexSelection ?? []).filter((key) => validIndexKeys.has(key));
  state.studyCdsIndexSelection = activeIndexKeys;
  const companyOptions = items.map((item) => ({
    key: item.ticker,
    label: item.ticker,
    color: item.color || "#20201d",
  }));
  const validCompanyKeys = new Set(companyOptions.map((option) => option.key));
  const activeCompanyKeys = (state.studyCdsCompanySelection ?? []).filter((key) => validCompanyKeys.has(key));
  if (!activeCompanyKeys.length) {
    activeCompanyKeys.push(...companyOptions.map((option) => option.key));
  }
  state.studyCdsCompanySelection = activeCompanyKeys;
  const activeComparisonItems = items.filter((item) => activeCompanyKeys.includes(item.ticker));

  const rangeMarkup = (studyCdsData.ranges ?? []).map((range) => `
    <button type="button" class="m7-range-chip${activeRange === range.key ? " active" : ""}" data-study-cds-range="${escapeHtml(range.key)}">
      ${escapeHtml(range.label)}
    </button>
  `).join("");
  const indexSelectorMarkup = indexOptions.map((option) => `
    <button
      type="button"
      class="study-cds-index-chip${activeIndexKeys.includes(option.key) ? " active" : ""}"
      data-study-cds-index="${escapeHtml(option.key)}"
      aria-pressed="${activeIndexKeys.includes(option.key) ? "true" : "false"}"
    >${escapeHtml(option.label)}</button>
  `).join("");
  const companySelectorMarkup = companyOptions.map((option) => `
    <button
      type="button"
      class="study-cds-company-chip${activeCompanyKeys.includes(option.key) ? " active" : ""}"
      data-study-cds-company="${escapeHtml(option.key)}"
      aria-pressed="${activeCompanyKeys.includes(option.key) ? "true" : "false"}"
      style="--series-color: ${escapeHtml(option.color)}"
    ><i></i>${escapeHtml(option.label)}</button>
  `).join("");
  const cardsMarkup = items.map((item) => {
    const latest = item.latest ?? {};
    const freshness = getStudyCdsFreshness(latest);
    const changeClass = Number(latest.change1mBps) > 0 ? "is-wider" : Number(latest.change1mBps) < 0 ? "is-tighter" : "";
    return `
      <article class="study-cds-card" style="--cds-color: ${escapeHtml(item.color || "#20201d")}">
        <div class="study-cds-card-head">
          <div class="study-cds-title">
            <span class="study-cds-ticker">${escapeHtml(item.ticker)}</span>
            <div>
              <h3>${escapeHtml(item.name)}</h3>
              <p>USD Senior Single-name · 5Y</p>
            </div>
          </div>
          <span class="study-cds-freshness ${freshness.className}">${freshness.label}</span>
        </div>
        <div class="study-cds-metrics">
          <div>
            <span>Latest</span>
            <strong>${formatStudyCdsBps(latest.bps)}</strong>
          </div>
          <div>
            <span>1M 변화</span>
            <strong class="${changeClass}">${formatStudyCdsBps(latest.change1mBps, true)}</strong>
          </div>
          <div>
            <span>마지막 실거래</span>
            <strong>${formatStudyCdsObservationDate(latest.observedDate)}</strong>
          </div>
          <div>
            <span>1Y 직접 관측</span>
            <strong>${Number(latest.observedDays || 0).toLocaleString("en-US")}일</strong>
          </div>
        </div>
        <div class="study-cds-chart-wrap">
          <canvas data-study-cds-chart="${escapeHtml(item.ticker)}" aria-label="${escapeHtml(item.name)} 5-year CDS transaction spread"></canvas>
        </div>
        <div class="study-cds-card-foot">
          <span><i class="is-observed"></i>직접 관측</span>
          <span><i class="is-carried"></i>직전값 이월</span>
          <span>직접 ${Number(latest.directTrades1y || 0).toLocaleString("en-US")}건 / 전체 5Y ${Number(latest.allTrades1y || 0).toLocaleString("en-US")}건</span>
        </div>
      </article>
    `;
  }).join("");

  usOverviewRoot.innerHTML = `
    <section class="study-cds-page">
      <header class="study-cds-page-head">
        <div>
          <span class="study-cds-eyebrow">DTCC SEC PUBLIC DISSEMINATION</span>
          <h2>Big Tech 5Y CDS</h2>
          <p>실제 보고된 CDS 거래를 통해 빅테크 신용위험 보험료의 방향을 추적합니다. bps가 높을수록 시장이 요구한 신용보호 비용이 높습니다.</p>
        </div>
        <div class="study-cds-head-actions">
          <div class="m7-range-row">${rangeMarkup}</div>
          <span>DTCC file ${escapeHtml(studyCdsData.updatedAt || "-")}</span>
        </div>
      </header>

      <section class="study-cds-comparison-panel">
        <div class="study-cds-comparison-head">
          <div>
            <h3>Index & 6-Company CDS Comparison</h3>
            <p>선택 지수는 왼쪽 축, 여섯 기업의 5년물 CDS 프리미엄은 오른쪽 bps 축으로 비교합니다.</p>
          </div>
          <div class="study-cds-comparison-controls">
            <div class="study-cds-control-group">
              <span>LEFT INDEX</span>
              <div class="study-cds-index-toggle">${indexSelectorMarkup}</div>
            </div>
            <div class="study-cds-control-group is-companies">
              <span>RIGHT CDS · BP</span>
              <div class="study-cds-company-toggle">${companySelectorMarkup}</div>
            </div>
          </div>
        </div>
        <div class="study-cds-comparison-wrap">
          <canvas data-study-cds-comparison aria-label="Big Tech six-company 5-year CDS comparison"></canvas>
        </div>
      </section>

      <div class="study-cds-snapshot-grid">
        <div><span>가장 높은 위험 보험료</span><strong>${escapeHtml(sortedLatest[0]?.ticker ?? "-")} ${formatStudyCdsBps(sortedLatest[0]?.latest?.bps)}</strong></div>
        <div><span>가장 낮은 위험 보험료</span><strong>${escapeHtml(tightestItem?.ticker ?? "-")} ${formatStudyCdsBps(tightestItem?.latest?.bps)}</strong></div>
        <div><span>6개사 중앙값</span><strong>${formatStudyCdsBps(medianBps)}</strong></div>
        <div><span>3일 이내 직접 관측</span><strong>${freshCount} / ${latestItems.length}</strong></div>
      </div>

      <div class="study-cds-method-strip">
        <div><span>산출</span><strong>${escapeHtml(studyCdsData.methodology?.summary ?? "")}</strong></div>
        <div><span>필터</span><strong>${escapeHtml(studyCdsData.methodology?.filters ?? "")}</strong></div>
        <div><span>주의</span><strong>${escapeHtml(studyCdsData.methodology?.limits ?? "")}</strong></div>
      </div>

      <section class="study-cds-grid">${cardsMarkup}</section>

      <footer class="study-cds-source-row">
        <p>${escapeHtml(studyCdsData.methodology?.carry ?? "")} ${escapeHtml(studyCdsData.methodology?.notionalDisclosure ?? "")}</p>
        <a href="${escapeHtml(studyCdsData.source?.url ?? "https://pddata.dtcc.com/ppd/secdashboard")}" target="_blank" rel="noreferrer">DTCC 원자료</a>
      </footer>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-study-cds-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyCdsRange = button.dataset.studyCdsRange || studyCdsData.defaultRange || "1y";
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-study-cds-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.studyCdsIndex;
      if (!validIndexKeys.has(key)) {
        return;
      }
      const nextSelection = new Set(state.studyCdsIndexSelection ?? []);
      if (nextSelection.has(key)) {
        nextSelection.delete(key);
      } else {
        nextSelection.add(key);
      }
      state.studyCdsIndexSelection = indexOptions
        .map((option) => option.key)
        .filter((optionKey) => nextSelection.has(optionKey));
      render();
    });
  });
  usOverviewRoot.querySelectorAll("[data-study-cds-company]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.studyCdsCompany;
      if (!validCompanyKeys.has(key)) {
        return;
      }
      const nextSelection = new Set(state.studyCdsCompanySelection ?? []);
      if (nextSelection.has(key)) {
        if (nextSelection.size === 1) {
          return;
        }
        nextSelection.delete(key);
      } else {
        nextSelection.add(key);
      }
      state.studyCdsCompanySelection = companyOptions
        .map((option) => option.key)
        .filter((optionKey) => nextSelection.has(optionKey));
      render();
    });
  });
  createStudyCdsComparisonChart(
    usOverviewRoot.querySelector("[data-study-cds-comparison]"),
    activeComparisonItems,
    activeRange,
    activeIndexKeys,
  );
  items.forEach((item) => {
    const canvas = usOverviewRoot.querySelector(`[data-study-cds-chart="${item.ticker}"]`);
    createStudyCdsChart(canvas, item, activeRange);
  });
}

function formatStudyCalendarDate(value) {
  const date = new Date(`${value}T12:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return value || "-";
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${weekday}`;
}

function createStudyCalendarDates(start, end) {
  if (!start || !end) return [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(last.getTime())) return [];
  const dates = [];
  while (cursor <= last && dates.length < 42) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function formatStudyCalendarDayNumber(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value || "-";
  return {
    month: `${date.getUTCMonth() + 1}월`,
    day: String(date.getUTCDate()),
  };
}

function renderStudyCalendarOverview() {
  destroyCharts();
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const weeks = studyCalendarData.weeks ?? [];
  if (!weeks.length) {
    renderPlaceholderOverview("Calendar", "향후 4주 일정 데이터가 없습니다.");
    return;
  }

  const allEvents = weeks.flatMap((week) => week.events ?? []);
  const eventsByDate = new Map();
  allEvents.forEach((event) => {
    const calendarDate = event.kind === "earnings" ? event.usDate || event.date : event.date;
    if (!calendarDate) return;
    if (!eventsByDate.has(calendarDate)) eventsByDate.set(calendarDate, []);
    eventsByDate.get(calendarDate).push(event);
  });

  const windowStart = studyCalendarData.coverage?.windowStart || weeks[0]?.events?.[0]?.date || "";
  const windowEnd = studyCalendarData.coverage?.windowEnd || weeks.at(-1)?.events?.at(-1)?.date || "";
  const calendarDates = createStudyCalendarDates(windowStart, windowEnd);
  const referenceDate = studyCalendarData.calendarToday || studyCalendarData.updatedAt || new Date().toISOString().slice(0, 10);
  const weekdayMarkup = ["월", "화", "수", "목", "금", "토", "일"]
    .map((weekday, index) => `<div class="study-calendar-weekday${index >= 5 ? " is-weekend" : ""}">${weekday}</div>`)
    .join("");
  const dayMarkup = calendarDates
    .map((dateValue, index) => {
      const dayEvents = [...(eventsByDate.get(dateValue) ?? [])].sort((left, right) => {
        const sessionOrder = (event) => (event.session === "B" ? "0" : event.session === "A" ? "2" : "1");
        return `${sessionOrder(left)}${left.time || ""}${left.ticker || ""}`.localeCompare(
          `${sessionOrder(right)}${right.time || ""}${right.ticker || ""}`,
        );
      });
      const dayNumber = formatStudyCalendarDayNumber(dateValue);
      const isToday = dateValue === referenceDate;
      const isPast = dateValue < referenceDate;
      const isWeekend = index % 7 >= 5;
      const eventMarkup = dayEvents.length
        ? dayEvents
            .map((event) => {
              const isEarnings = event.kind === "earnings";
              const eventLabel = isEarnings
                ? `${event.ticker || "실적"}${event.session ? ` (${event.session})` : ""}`
                : "MACRO";
              const usSessionLabel = event.session === "A" ? "장후" : event.session === "B" ? "장전" : "";
              const kstDateValue = event.kstDate || event.date || "";
              const kstDateLabel = kstDateValue ? kstDateValue.slice(5).replace("-", "/") : "";
              const kstTimingLabel = event.callKst
                ? `KST ${event.callKst} (컨콜)`
                : event.session
                  ? `KST ${kstDateLabel} ${event.time || "시간 미정"}`
                  : "KST 시간 미정";
              const timingMarkup =
                isEarnings
                  ? `<small class="study-calendar-chip-timing${event.confirmed ? " is-confirmed" : ""}">
                      <span>${event.confirmed ? "공식 확정" : "예상"}</span> ${escapeHtml(kstTimingLabel)}
                    </small>`
                  : "";
              const eventTitle = [event.title, event.note].filter(Boolean).join(" · ");
              const displayTitle =
                isEarnings && event.ticker && !String(event.title || "").includes(`(${event.ticker})`)
                  ? `${event.title || "-"} (${event.ticker})`
                  : event.title || "-";
              return `
                <a class="study-calendar-chip study-calendar-chip-${isEarnings ? "earnings" : "macro"}"
                  href="${escapeHtml(event.sourceUrl || "#")}" target="_blank" rel="noopener noreferrer"
                  title="${escapeHtml(eventTitle)}">
                  <span><b>${escapeHtml(isEarnings ? `미국 ${usSessionLabel || "시간 미정"}` : event.time ? `KST ${event.time}` : "KST 미정")}</b><em>${escapeHtml(eventLabel)}</em></span>
                  ${timingMarkup}
                  <strong>${escapeHtml(displayTitle)}</strong>
                </a>`;
            })
            .join("")
        : `<span class="study-calendar-empty">일정 없음</span>`;
      return `
        <article class="study-calendar-day${isToday ? " is-today" : ""}${isPast ? " is-past" : ""}${isWeekend ? " is-weekend" : ""}">
          <header>
            <time datetime="${escapeHtml(dateValue)}"><span>${escapeHtml(dayNumber.month)}</span><strong>${escapeHtml(dayNumber.day)}</strong></time>
            <em>${dayEvents.length ? `${dayEvents.length}건` : ""}</em>
          </header>
          <div class="study-calendar-day-events">${eventMarkup}</div>
        </article>`;
    })
    .join("");

  const rangeMarkup = weeks
    .map(
      (week) => `
        <div class="study-calendar-range-item">
          <span>${escapeHtml(week.label || "")}</span>
          <strong>${escapeHtml(week.range || "")}</strong>
          <em>${escapeHtml(week.status || "")}</em>
        </div>`,
    )
    .join("");

  const fallbackMarkup = (studyCalendarData.fallbackSources ?? [])
    .map(
      (source) =>
        `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview study-calendar-page">
      <section class="us-panel study-calendar-panel">
        <div class="study-calendar-head">
          <div>
            <p>RESEARCH CALENDAR</p>
            <h2>향후 4주 일정</h2>
            <span>실적과 미국 Macro 모두 미국 현지 발표일에 배치하고 KST 시각을 함께 표시합니다.</span>
          </div>
          <time>Updated ${escapeHtml(studyCalendarData.updatedAt || "-")}</time>
        </div>
        <div class="study-calendar-legend">
          <span><b>(B)</b> 미국 장전</span>
          <span><b>(A)</b> 미국 장후</span>
          <span>실적 날짜는 <b>미국 현지 기준</b> · 카드 하단은 <b>KST</b></span>
          <span><b>MACRO</b> 미국 공식 일정 · 카드 상단은 <b>KST 발표 시각</b></span>
          <span><b>공식 확정</b> 기업 IR 확인</span>
          <span><b>${escapeHtml(studyCalendarData.coverage?.dailyBriefingUniverse ?? "-")}</b>개 Daily Briefing 종목 대조 · 실적 <b>${escapeHtml(studyCalendarData.coverage?.matchedEarnings ?? "-")}</b>건 · 미국 Macro <b>${escapeHtml(studyCalendarData.coverage?.matchedMacro ?? "-")}</b>건</span>
        </div>
        <div class="study-calendar-range-row">${rangeMarkup}</div>
        <div class="study-calendar-board-wrap">
          <div class="study-calendar-board">
            <div class="study-calendar-weekdays">${weekdayMarkup}</div>
            <div class="study-calendar-days">${dayMarkup}</div>
          </div>
        </div>
        <footer class="study-calendar-notes">
          <p><strong>기준</strong> ${escapeHtml(studyCalendarData.methodology?.macro || "")} · ${escapeHtml(studyCalendarData.methodology?.earnings || "")}</p>
          <p>${escapeHtml(studyCalendarData.methodology?.warning || "")}</p>
          <div>${fallbackMarkup}</div>
        </footer>
      </section>
    </section>`;
}

function renderStudyOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const panel = getStudyMemoryDashboard();
  if (!panel?.dates?.length) {
    renderPlaceholderOverview("Study", "Study dashboard data is not available yet.");
    return;
  }

  const latest = panel.latest ?? {};
  const rangeMarkup = (studyData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.studyRange === range.key ? " active" : ""}"
          data-study-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview study-overview">
      <section class="us-panel study-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>NVDA vs Memory</h2>
            <p>삼성전자* + SK하이닉스 + Micron + CXMT 시가총액과 NVIDIA를 USD 기준으로 비교합니다. CXMT는 상장일인 2026년 7월 27일부터 합산됩니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${rangeMarkup}</div>
            <div class="us-price-updated">Updated ${studyData.updatedAt || latest.date || "-"}</div>
          </div>
        </div>
        <div class="study-kpi-grid study-kpi-grid-4">
          <article class="study-kpi-card">
            <span>Memory incl. CXMT</span>
            <strong>${formatStudyTrillion(latest.memoryBasketT, 3)}</strong>
            <small>Core ${formatStudyTrillion(latest.coreMemoryBasketT, 3)} + CXMT ${formatStudyTrillion(latest.cxmtT, 3)}</small>
          </article>
          <article class="study-kpi-card study-kpi-card-green">
            <span>NVIDIA</span>
            <strong>${formatStudyTrillion(latest.nvdaT, 3)}</strong>
            <small>${formatSignedPercent(latest.nvdaChangePct)} since 2025-01-01</small>
          </article>
          <article class="study-kpi-card">
            <span>CXMT (688825)</span>
            <strong>${formatStudyTrillion(latest.cxmtT, 3)}</strong>
            <small>STAR Market · listed 2026-07-27</small>
          </article>
          <article class="study-kpi-card">
            <span>Basket / NVIDIA</span>
            <strong>${formatStudyRatio(latest.ratio)}</strong>
            <small>Gap ${formatStudyTrillion(latest.spreadT, 3)}</small>
          </article>
        </div>
        <div class="market-trend-meta">
          <span>국내 종목: 네이버 일별 종가와 상장주식수</span>
          <span>*Samsung은 삼성전자우 포함 시총</span>
          <span>
            미국 종목: 기존 대시보드 데이터 기반 ·
            <a href="${escapeHtml(studyData.source?.cxmtListing || "#")}" target="_blank" rel="noopener noreferrer">CXMT: STAR Market 688825</a>
          </span>
        </div>
        <div class="us-price-chart-wrap us-price-chart-wrap-large study-chart-wrap">
          <canvas data-study-chart="memory-vs-nvda"></canvas>
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-study-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyRange = button.dataset.studyRange || studyData.defaultRange || "max";
      render();
    });
  });

  const canvas = usOverviewRoot.querySelector('[data-study-chart="memory-vs-nvda"]');
  if (canvas) {
    createStudyMemoryVsNvdaChart(canvas, state.studyRange || studyData.defaultRange || "max");
  }
}

function formatSignedDollarMillions(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  const sign = numeric > 0 ? "+" : numeric < 0 ? "-" : "";
  return `${sign}${formatCompactDollarMillions(Math.abs(numeric))}`;
}

function buildStudyEtfFlowPayload(item, rangeKey) {
  const dates = item?.dates ?? [];
  if (!dates.length) {
    return { labels: [], prices: [], aums: [], dailyFlows: [], cumulativeFlows: [] };
  }
  const comparisonDate = studyEtfFlowData.comparisonDate || dates[dates.length - 1];
  const firstLaterIndex = dates.findIndex((dateText) => dateText > comparisonDate);
  const endIndex = firstLaterIndex === -1 ? dates.length : firstLaterIndex;
  const comparableDates = dates.slice(0, endIndex);
  if (!comparableDates.length) {
    return { labels: [], prices: [], aums: [], dailyFlows: [], cumulativeFlows: [] };
  }
  const latestDate = comparableDates[comparableDates.length - 1];
  // Flow totals are calendar-year sums, so unlike normalized return charts they exclude the prior-year close.
  const startDate = rangeKey === "ytd"
    ? `${String(latestDate).slice(0, 4)}-01-01`
    : shiftDateByRange(latestDate, rangeKey, comparableDates[0], comparableDates);
  const startIndex = Math.max(
    0,
    comparableDates.findIndex((dateText) => dateText >= startDate),
  );
  const labels = comparableDates.slice(startIndex);
  const prices = (item.prices ?? []).slice(startIndex, startIndex + labels.length);
  const aums = (item.aumM ?? []).slice(startIndex, startIndex + labels.length);
  const dailyFlows = (item.dailyFlowM ?? []).slice(startIndex, startIndex + labels.length);
  let cumulative = 0;
  const cumulativeFlows = dailyFlows.map((value) => {
    cumulative += Number(value) || 0;
    return Number(cumulative.toFixed(3));
  });
  return { labels, prices, aums, dailyFlows, cumulativeFlows };
}

const STUDY_ETF_LEFT_AXIS_WIDTH = 72;
const STUDY_ETF_RIGHT_AXIS_WIDTH = 58;

function fitStudyEtfAxisWidth(axis, width) {
  axis.width = width;
}

function createStudyEtfFlowChart(canvas, item, rangeKey) {
  const payload = buildStudyEtfFlowPayload(item, rangeKey);
  if (!payload.labels.length) {
    return;
  }
  const tickIndexes = new Set(getMacroTickIndexes(payload.labels, rangeKey, canvas.clientWidth));
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: payload.labels,
      datasets: [
        {
          label: "누적 Fund Flow (L)",
          data: payload.cumulativeFlows,
          yAxisID: "yFlow",
          borderColor: "#d97745",
          backgroundColor: "rgba(217, 119, 69, 0.08)",
          borderWidth: 2.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.08,
          spanGaps: true,
        },
        {
          label: "주가 (R)",
          data: payload.prices,
          yAxisID: "yPrice",
          borderColor: item.color || "#1f5f73",
          backgroundColor: "transparent",
          borderWidth: 2.3,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.08,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { usePointStyle: true, boxWidth: 8, color: "#4a4a45" },
        },
        tooltip: {
          callbacks: {
            title: (items) => formatFullIsoDate(items[0]?.label),
            label: (context) =>
              context.dataset.yAxisID === "yFlow"
                ? `${context.dataset.label}: ${formatSignedDollarMillions(context.parsed.y)}`
                : `${context.dataset.label}: $${Number(context.parsed.y).toFixed(2)}`,
            afterBody: (items) => {
              const index = items[0]?.dataIndex;
              const daily = Number(payload.dailyFlows[index]);
              return Number.isFinite(daily) ? `일별 Fund Flow: ${formatSignedDollarMillions(daily)}` : "";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#77776f",
            autoSkip: false,
            maxRotation: 0,
            callback: (_, index) => (tickIndexes.has(index) ? formatRangeAxisDate(payload.labels[index], rangeKey) : ""),
          },
          border: { color: "#d8d8d2" },
        },
        yFlow: {
          position: "left",
          afterFit: (axis) => fitStudyEtfAxisWidth(axis, STUDY_ETF_LEFT_AXIS_WIDTH),
          grid: { color: "rgba(148, 148, 140, 0.16)" },
          ticks: { color: "#b86438", callback: (value) => formatCompactDollarMillions(Number(value)) },
          title: { display: true, text: "누적 Fund Flow ($M)", color: "#b86438" },
          border: { color: "#d8d8d2" },
        },
        yPrice: {
          position: "right",
          afterFit: (axis) => fitStudyEtfAxisWidth(axis, STUDY_ETF_RIGHT_AXIS_WIDTH),
          grid: { drawOnChartArea: false },
          ticks: { color: item.color || "#1f5f73", callback: (value) => `$${Number(value).toFixed(0)}` },
          title: { display: true, text: "주가 ($)", color: item.color || "#1f5f73" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function createStudyEtfDailyFlowChart(canvas, item, rangeKey) {
  const payload = buildStudyEtfFlowPayload(item, rangeKey);
  if (!payload.labels.length) {
    return;
  }
  const inflowColor = "rgba(31, 157, 98, 0.82)";
  const outflowColor = "rgba(217, 74, 67, 0.82)";
  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: payload.labels,
      datasets: [
        {
          label: "일별 Fund Flow",
          data: payload.dailyFlows,
          backgroundColor: payload.dailyFlows.map((value) => (Number(value) >= 0 ? inflowColor : outflowColor)),
          borderColor: payload.dailyFlows.map((value) => (Number(value) >= 0 ? "#16734a" : "#b93831")),
          borderWidth: 0.5,
          borderSkipped: false,
          categoryPercentage: 1,
          barPercentage: 0.92,
          maxBarThickness: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => formatFullIsoDate(items[0]?.label),
            label: (context) => `일별 Fund Flow: ${formatSignedDollarMillions(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { display: false },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          afterFit: (axis) => fitStudyEtfAxisWidth(axis, STUDY_ETF_LEFT_AXIS_WIDTH),
          grid: {
            color: (context) => (context.tick.value === 0 ? "rgba(72, 72, 66, 0.55)" : "rgba(148, 148, 140, 0.12)"),
            lineWidth: (context) => (context.tick.value === 0 ? 1.3 : 1),
          },
          ticks: {
            color: "#77776f",
            maxTicksLimit: 5,
            callback: (value) => formatSignedDollarMillions(Number(value)),
          },
          border: { color: "#d8d8d2" },
        },
        ySpacer: {
          position: "right",
          display: true,
          min: 0,
          max: 1,
          afterFit: (axis) => fitStudyEtfAxisWidth(axis, STUDY_ETF_RIGHT_AXIS_WIDTH),
          grid: { display: false, drawOnChartArea: false },
          ticks: { display: false },
          title: { display: false },
          border: { display: false },
        },
      },
    },
  });
  charts.push(chart);
}

function renderStudyEtfTrackingOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const items = Object.values(studyEtfFlowData.items ?? {});
  if (!items.length) {
    renderPlaceholderOverview("ETF 추적", "ETF flow data is not available yet.");
    return;
  }

  const activeRange = (studyEtfFlowData.ranges ?? []).some((range) => range.key === state.studyEtfFlowRange)
    ? state.studyEtfFlowRange
    : studyEtfFlowData.defaultRange || "ytd";
  state.studyEtfFlowRange = activeRange;
  const rangeMarkup = (studyEtfFlowData.ranges ?? [])
    .map(
      (range) => `
        <button type="button" class="m7-range-chip${activeRange === range.key ? " active" : ""}" data-study-etf-range="${escapeHtml(range.key)}">
          ${escapeHtml(range.label)}
        </button>`,
    )
    .join("");

  const chartMarkup = items
    .map((item) => {
      const payload = buildStudyEtfFlowPayload(item, activeRange);
      const latestPrice = payload.prices[payload.prices.length - 1];
      const latestAum = payload.aums[payload.aums.length - 1];
      const cumulative = payload.cumulativeFlows[payload.cumulativeFlows.length - 1];
      const dailyFlow = payload.dailyFlows[payload.dailyFlows.length - 1];
      const latestDate = payload.labels[payload.labels.length - 1] || item.latest?.date || "-";
      return `
        <article class="study-etf-card">
          <div class="study-etf-card-head">
            <div>
              <div class="study-etf-title-row">
                <strong>${escapeHtml(item.ticker)}</strong>
                <span>${escapeHtml(item.theme || "")}</span>
              </div>
              <h3>${escapeHtml(item.name)}</h3>
            </div>
            <time>${escapeHtml(latestDate)}</time>
          </div>
          <div class="study-etf-metrics">
            <div><span>AUM</span><b>${formatCompactDollarMillions(Number(latestAum))}</b></div>
            <div><span>누적 Flow</span><b class="${Number(cumulative) >= 0 ? "is-positive" : "is-negative"}">${formatSignedDollarMillions(cumulative)}</b></div>
            <div><span>일별 Flow</span><b class="${Number(dailyFlow) >= 0 ? "is-positive" : "is-negative"}">${formatSignedDollarMillions(dailyFlow)}</b></div>
            <div><span>주가</span><b>$${Number(latestPrice).toFixed(2)}</b></div>
          </div>
          <div class="study-etf-chart-wrap"><canvas data-study-etf-chart="${escapeHtml(item.ticker)}"></canvas></div>
          <div class="study-etf-daily-flow-block">
            <div class="study-etf-daily-flow-head">
              <span>일별 Fund Flow</span>
              <em><i class="is-inflow"></i>유입 <i class="is-outflow"></i>유출 · $M</em>
            </div>
            <div class="study-etf-daily-flow-wrap"><canvas data-study-etf-daily-flow="${escapeHtml(item.ticker)}"></canvas></div>
          </div>
        </article>`;
    })
    .join("");

  const sourceMarkup = (studyEtfFlowData.sources ?? [])
    .map(
      (source) => `
        <a class="study-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(source.label)}
        </a>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview study-overview study-etf-overview">
      <section class="us-panel study-panel study-etf-panel">
        <div class="us-section-head us-price-head study-etf-page-head">
          <div>
            <h2>ETF 가격과 누적 Fund Flow</h2>
            <p>SOXX · DRAM · MAGS · EWY의 주가와 실제 설정·환매 기반 자금 유입을 같은 화면에서 비교합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${rangeMarkup}</div>
            <div class="us-price-updated">공통 기준일 ${escapeHtml(studyEtfFlowData.comparisonDate || studyEtfFlowData.updatedAt || "-")}</div>
          </div>
        </div>
        <div class="study-etf-method-grid">
          <div><span>AUM</span><strong>발행사 순자산 · 미제공 시 NAV × 설정좌수</strong></div>
          <div><span>일별 Fund Flow</span><strong>설정좌수 순증감 × 당일 NAV</strong></div>
          <div><span>누적값</span><strong>선택 기간의 일별 Flow 합산</strong></div>
          <div><span>0M 의미</span><strong>설정좌수 무변동 · 데이터 누락 아님</strong></div>
        </div>
        <div class="study-etf-grid">${chartMarkup}</div>
        <div class="study-etf-source-row">
          <p>SOXX·EWY는 iShares 공식 Historical 자료, DRAM·MAGS는 Roundhill 공식 일별 NAV와 날짜별 holdings의 Shares Outstanding를 사용합니다.</p>
          <div class="study-source-list">${sourceMarkup}</div>
        </div>
      </section>
    </section>`;

  usOverviewRoot.querySelectorAll("[data-study-etf-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyEtfFlowRange = button.dataset.studyEtfRange || studyEtfFlowData.defaultRange || "ytd";
      render();
    });
  });
  items.forEach((item) => {
    const canvas = usOverviewRoot.querySelector(`[data-study-etf-chart="${item.ticker}"]`);
    if (canvas) {
      createStudyEtfFlowChart(canvas, item, activeRange);
    }
    const dailyFlowCanvas = usOverviewRoot.querySelector(`[data-study-etf-daily-flow="${item.ticker}"]`);
    if (dailyFlowCanvas) {
      createStudyEtfDailyFlowChart(dailyFlowCanvas, item, activeRange);
    }
  });
}

function getStudyDealStatusMeta(statusKey) {
  return (
    (studyDataCenterDeals.statusLegend ?? []).find((item) => item.key === statusKey) ?? {
      key: statusKey || "planned",
      label: statusKey || "Unknown",
      tone: "gray",
    }
  );
}

function getStudyDealCompanyMeta(companyKey) {
  return (
    (studyDataCenterDeals.companies ?? []).find((item) => item.key === companyKey) ?? {
      key: companyKey || "Unknown",
      label: companyKey || "Unknown",
      color: "#20201d",
      softColor: "#f4f3ed",
      textColor: "#20201d",
    }
  );
}

function getStudyDealCompanyStyle(companyKey) {
  const company = getStudyDealCompanyMeta(companyKey);
  const safeColor = /^#[0-9a-f]{6}$/i.test(company.color || "") ? company.color : "#20201d";
  const safeSoftColor = /^#[0-9a-f]{6}$/i.test(company.softColor || "") ? company.softColor : "#f4f3ed";
  const safeTextColor = /^#[0-9a-f]{6}$/i.test(company.textColor || "") ? company.textColor : safeColor;
  return `--study-company-color:${safeColor};--study-company-soft:${safeSoftColor};--study-company-text:${safeTextColor}`;
}

function formatStudyCapacityGw(value) {
  if (!Number.isFinite(Number(value))) {
    return "-";
  }
  const numeric = Number(value);
  if (numeric === 0) {
    return "-";
  }
  return `${numeric >= 1 ? numeric.toFixed(2) : numeric.toFixed(3)}GW`;
}

function getStudyDataCenterBuildRows() {
  const schedule = studyDataCenterDeals.buildSchedule ?? {};
  const years = Array.isArray(schedule.years) ? schedule.years : [];
  const events = Array.isArray(schedule.events) ? schedule.events : [];
  const companyKeys = (studyDataCenterDeals.companies ?? []).filter((item) => item.key !== "All").map((item) => item.key);
  return years.map((year) => {
    const yearEvents = events.filter((event) => Number(event.year) === Number(year));
    const companyValues = Object.fromEntries(
      companyKeys.map((companyKey) => [
        companyKey,
        yearEvents
          .filter((event) => event.company === companyKey)
          .reduce((sum, event) => sum + (Number(event.gw) || 0), 0),
      ]),
    );
    return {
      year,
      events: yearEvents,
      companyValues,
      total: Object.values(companyValues).reduce((sum, value) => sum + value, 0),
      note: schedule.yearNotes?.[year] || "",
    };
  });
}

function getStudyDealInference(deal, statusMeta) {
  const statusBasis = {
    operational: "원문에서 운영 시작·가동 중임을 확인해 '운영/가동'으로 분류했습니다.",
    construction: "원문에서 착공·site work·construction underway 표현을 확인해 '착공/시공'으로 분류했습니다.",
    contracted: "서명된 lease·PPA·capacity 계약이 있으나 물리적 착공이 확인되지 않아 '계약/전력확보'로 분류했습니다.",
    development: "부지 개발·인허가·목표 시점은 공개됐지만 착공이 확정되지 않아 '개발/인허가'로 분류했습니다.",
    planned: "투자·부지 계획만 발표되고 착공 근거가 없어 '계획/부지선정'으로 분류했습니다.",
  };
  let capacityBasis = "수치와 일정은 연결된 원문에 공개된 표현을 그대로 사용했습니다.";
  if (String(deal.capacity || "").includes("미공개")) {
    capacityBasis = "원문에 정확한 IT load가 없어 임의 환산하지 않았습니다.";
  } else if (/추정|보도/.test(`${deal.capacity || ""} ${deal.amount || ""} ${deal.sourceNote || ""}`)) {
    capacityBasis = "보도·추정 수치는 회사 확정 가이던스와 구분해 표시했으며 연도별 확정 합계에는 제한적으로만 반영합니다.";
  }
  return `${deal.sourceNote || "공개자료"} 기준. ${statusBasis[deal.status] || `${statusMeta.label} 상태로 정규화했습니다.`} ${capacityBasis}`;
}

function renderStudyDataCenterSourceLinks(sources) {
  return (sources ?? [])
    .map(
      (source) => `
        <a class="study-source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(source.label)}
        </a>`,
    )
    .join("");
}

function getStudyDataCenterOutlookTypeMeta(typeKey) {
  return (
    (studyDataCenterDeals.capacityOutlook?.sourceTypes ?? []).find((item) => item.key === typeKey) ?? {
      key: typeKey || "model",
      label: typeKey || "모델 추정",
      tone: "gray",
    }
  );
}

function formatStudyOutlookGw(value) {
  return Number.isFinite(Number(value)) ? `${Number(value).toFixed(1)} GW` : "-";
}

function renderStudyDataCenterCapacityOutlook() {
  const outlook = studyDataCenterDeals.capacityOutlook ?? {};
  const years = Array.isArray(outlook.years) ? outlook.years : [];
  const series = Array.isArray(outlook.series) ? outlook.series : [];
  if (!years.length || !series.length) {
    return "";
  }
  const companyChipMarkup = series
    .map((item) => {
      const company = getStudyDealCompanyMeta(item.company);
      return `
        <button
          type="button"
          class="study-outlook-company-chip"
          style="${getStudyDealCompanyStyle(item.company)}"
          title="${escapeHtml(item.family || "Capacity series")}"
          data-study-outlook-company="${escapeHtml(item.company)}"
          aria-pressed="true"
        >
          <i></i>${escapeHtml(company.label)}
        </button>`;
    })
    .join("");
  const sourceTypeMarkup = (outlook.sourceTypes ?? [])
    .map(
      (item) => `
        <span class="study-outlook-type-key study-outlook-type-${escapeHtml(item.key)}">
          <i></i>${escapeHtml(item.label)}
        </span>`,
    )
    .join("");
  const tableHeaderMarkup = years.map((year) => `<th>${escapeHtml(year)}E</th>`).join("");
  const tableRowMarkup = series
    .map((item) => {
      const company = getStudyDealCompanyMeta(item.company);
      const valueMarkup = years
        .map((year) => {
          const point = (item.values ?? []).find((value) => Number(value.year) === Number(year));
          const typeMeta = getStudyDataCenterOutlookTypeMeta(point?.type);
          return `
            <td title="${escapeHtml(typeMeta.label)} · ${escapeHtml(point?.basis || "")}">
              <span class="study-outlook-value study-outlook-value-${escapeHtml(point?.type || "model")}">
                <i></i><strong>${point ? Number(point.gw).toFixed(1) : "-"}</strong>
              </span>
            </td>`;
        })
        .join("");
      return `
        <tr data-study-outlook-row="${escapeHtml(item.company)}">
          <th style="${getStudyDealCompanyStyle(item.company)}">
            <span class="study-build-company-label"><i></i>${escapeHtml(company.label)}</span>
            <small class="study-outlook-family">${escapeHtml(item.family || "")}</small>
            <button type="button" class="study-outlook-basis-button" data-study-outlook-detail="${escapeHtml(item.company)}">
              근거
            </button>
          </th>
          ${valueMarkup}
        </tr>`;
    })
    .join("");
  return `
    <section class="study-data-center-summary study-capacity-outlook">
      <div class="study-summary-head">
        <div>
          <h3>${escapeHtml(outlook.title || "연말 누적 컴퓨트 용량 로드맵")}</h3>
          <p>${escapeHtml(outlook.metric || "")}</p>
        </div>
        <span>${escapeHtml(outlook.badge || "2026~2030 · 회사별 비합산")}</span>
      </div>
      <div class="study-outlook-toolbar">
        <div class="study-outlook-company-row" aria-label="회사 표시 선택">${companyChipMarkup}</div>
        <div class="study-outlook-type-legend">${sourceTypeMarkup}</div>
      </div>
      <div class="study-outlook-grid">
        <div class="study-outlook-chart-panel">
          <canvas data-study-chart="data-center-capacity-outlook"></canvas>
        </div>
        <div class="study-outlook-table-wrap">
          <table class="study-outlook-table">
            <thead>
              <tr><th>Company / GW</th>${tableHeaderMarkup}</tr>
            </thead>
            <tbody>${tableRowMarkup}</tbody>
          </table>
        </div>
      </div>
      <div class="study-outlook-warning">
        <strong>읽는 법</strong>
        <span>${escapeHtml(outlook.warning || "")}</span>
      </div>
      <div class="market-trend-meta study-build-methodology">
        <span>${escapeHtml(outlook.methodology || "")}</span>
        <span>실선 구간은 공개 앵커를 연결하고, 점선 구간은 보간·모델 추정이 포함됐음을 뜻합니다.</span>
      </div>
    </section>`;
}

function renderStudyDataCenterMetricBridge() {
  const outlook = studyDataCenterDeals.capacityOutlook ?? {};
  const schedule = studyDataCenterDeals.buildSchedule ?? {};
  if (!outlook.comparisonNote) {
    return "";
  }
  return `
    <aside class="study-capacity-bridge" aria-label="두 용량 그래프의 집계 기준">
      <div>
        <span>위 그래프 · 누적</span>
        <strong>${escapeHtml(outlook.title || "연말 누적 용량")}</strong>
        <small>기존 fleet + 공개 pipeline</small>
      </div>
      <b aria-hidden="true">≠</b>
      <div>
        <span>아래 그래프 · 연간 증분</span>
        <strong>${escapeHtml(schedule.title || "연도별 신규 가동 예정분")}</strong>
        <small>가동 연도와 GW가 모두 공개된 프로젝트만</small>
      </div>
      <p>${escapeHtml(outlook.comparisonNote)}</p>
    </aside>`;
}

function createStudyDataCenterCapacityOutlookChart(canvas) {
  const outlook = studyDataCenterDeals.capacityOutlook ?? {};
  const years = Array.isArray(outlook.years) ? outlook.years : [];
  const series = Array.isArray(outlook.series) ? outlook.series : [];
  if (!canvas || typeof Chart === "undefined" || !years.length || !series.length) {
    return null;
  }
  const datasets = series.map((item) => {
    const company = getStudyDealCompanyMeta(item.company);
    const points = years.map((year) => (item.values ?? []).find((value) => Number(value.year) === Number(year)) ?? null);
    const types = points.map((point) => point?.type || "model");
    return {
      label: company.label,
      data: points.map((point) => (Number.isFinite(Number(point?.gw)) ? Number(point.gw) : null)),
      borderColor: company.color,
      backgroundColor: company.color,
      borderWidth: 2.25,
      tension: 0.24,
      spanGaps: true,
      companyKey: item.company,
      points,
      pointRadius: 4.5,
      pointHoverRadius: 6.5,
      pointBorderWidth: 2,
      pointBorderColor: company.color,
      pointBackgroundColor: (context) => (types[context.dataIndex] === "model" ? "#fffefb" : company.color),
      pointStyle: (context) => (types[context.dataIndex] === "consensus" ? "rectRot" : "circle"),
      segment: {
        borderDash: (context) =>
          [types[context.p0DataIndex], types[context.p1DataIndex]].includes("model") ? [6, 4] : undefined,
      },
    };
  });
  const chart = new Chart(canvas, {
    type: "line",
    data: { labels: years.map(String), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatStudyOutlookGw(context.parsed.y)}`,
            afterLabel: (context) => {
              const point = context.dataset.points?.[context.dataIndex];
              const typeMeta = getStudyDataCenterOutlookTypeMeta(point?.type);
              return [`${typeMeta.label}`, point?.basis || ""].filter(Boolean);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#5a5a54", font: { weight: 750 } },
          border: { color: "#d8d8d2" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 40,
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: { color: "#8d8d86", callback: (value) => `${Number(value).toFixed(0)}GW` },
          title: { display: true, text: outlook.axisTitle || "Year-end cumulative capacity (GW)", color: "#8d8d86" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
  return chart;
}

function bindStudyDataCenterCapacityOutlookChart(chart) {
  if (!chart) {
    return;
  }
  usOverviewRoot.querySelectorAll("[data-study-outlook-company]").forEach((button) => {
    button.addEventListener("click", () => {
      const companyKey = button.dataset.studyOutlookCompany;
      const datasetIndex = chart.data.datasets.findIndex((dataset) => dataset.companyKey === companyKey);
      if (datasetIndex < 0) {
        return;
      }
      const isVisible = chart.isDatasetVisible(datasetIndex);
      chart.setDatasetVisibility(datasetIndex, !isVisible);
      button.classList.toggle("is-muted", isVisible);
      button.setAttribute("aria-pressed", String(!isVisible));
      usOverviewRoot.querySelector(`[data-study-outlook-row="${companyKey}"]`)?.classList.toggle("is-muted", isVisible);
      chart.update("none");
    });
  });
}

function renderStudyDataCenterBuildSummary(companyOptions, buildRows) {
  const schedule = studyDataCenterDeals.buildSchedule ?? {};
  const companyColumns = companyOptions.filter((item) => item.key !== "All");
  const headerMarkup = companyColumns
    .map(
      (company) => `
        <th style="${getStudyDealCompanyStyle(company.key)}">
          <span class="study-build-company-label"><i></i>${escapeHtml(company.label)}</span>
        </th>`,
    )
    .join("");
  const rowMarkup = buildRows
    .map(
      (row) => `
        <tr>
          <th>${escapeHtml(row.year)}</th>
          ${companyColumns
            .map((company) => `<td>${formatStudyCapacityGw(row.companyValues[company.key])}</td>`)
            .join("")}
          <td><strong>${formatStudyCapacityGw(row.total)}</strong></td>
          <td>
            <button type="button" class="study-build-basis-button" data-study-data-center-year="${escapeHtml(row.year)}">
              ${row.events.length}건 근거
            </button>
          </td>
        </tr>`,
    )
    .join("");
  return `
    <section class="study-data-center-summary">
      <div class="study-summary-head">
        <div>
          <h3>${escapeHtml(schedule.title || "연도별 신규 가동 예정분")}</h3>
          <p>${escapeHtml(schedule.metric || "")}</p>
        </div>
        <span>${escapeHtml(schedule.badge || "연간 증분 · 공개 최소치")}</span>
      </div>
      <div class="study-data-center-summary-grid">
        <div class="study-build-chart-panel">
          <canvas data-study-chart="data-center-build"></canvas>
        </div>
        <div class="study-build-table-wrap">
          <table class="study-build-table">
            <thead>
              <tr>
                <th>Year</th>
                ${headerMarkup}
                <th>Total</th>
                <th>Basis</th>
              </tr>
            </thead>
            <tbody>${rowMarkup}</tbody>
          </table>
        </div>
      </div>
      <div class="market-trend-meta study-build-methodology">
        <span>${escapeHtml(schedule.methodology || "")}</span>
        <span>표의 '-'는 0GW가 아니라 해당 연도에 정량 반영할 공개 수치가 없다는 뜻입니다.</span>
      </div>
    </section>`;
}

function createStudyDataCenterBuildChart(canvas, companyOptions, buildRows) {
  if (!canvas || typeof Chart === "undefined") {
    return;
  }
  const companyColumns = companyOptions.filter((item) => item.key !== "All");
  const labels = buildRows.map((row) => String(row.year));
  const datasets = companyColumns
    .map((company) => ({
      label: company.label,
      data: buildRows.map((row) => Number((row.companyValues[company.key] || 0).toFixed(3))),
      backgroundColor: company.color,
      borderColor: company.color,
      borderWidth: 0,
      borderRadius: 3,
      companyKey: company.key,
      stack: "capacity",
    }))
    .filter((dataset) => dataset.data.some((value) => value > 0));
  const chart = new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: { color: "#5a5a54", boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "rectRounded" },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatStudyCapacityGw(context.parsed.y)}`,
            footer: (items) => {
              const row = buildRows[items?.[0]?.dataIndex];
              if (!row?.events?.length) {
                return "정량 반영 항목 없음";
              }
              return row.events.map((event) => `${event.label} ${formatStudyCapacityGw(event.gw)}`);
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: "#6f6f67", font: { weight: 700 } },
          border: { color: "#d8d8d2" },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: { color: "#8d8d86", callback: (value) => `${Number(value).toFixed(1)}GW` },
          title: {
            display: true,
            text: studyDataCenterDeals.buildSchedule?.axisTitle || "Annual new capacity (GW)",
            color: "#8d8d86",
          },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });
  charts.push(chart);
}

function openStudyDataCenterOutlookDetail(companyKey) {
  const outlook = studyDataCenterDeals.capacityOutlook ?? {};
  const series = (outlook.series ?? []).find((item) => item.company === companyKey);
  const dialog = usOverviewRoot.querySelector("[data-study-data-center-dialog]");
  const body = dialog?.querySelector("[data-study-data-center-dialog-body]");
  if (!series || !dialog || !body) {
    return;
  }
  const company = getStudyDealCompanyMeta(series.company);
  const pointMarkup = (series.values ?? [])
    .map((point) => {
      const typeMeta = getStudyDataCenterOutlookTypeMeta(point.type);
      return `
        <article class="study-outlook-point">
          <strong>${escapeHtml(point.year)}E</strong>
          <b>${formatStudyOutlookGw(point.gw)}</b>
          <span class="study-status-pill study-status-${escapeHtml(typeMeta.tone)}">${escapeHtml(typeMeta.label)}</span>
          <p>${escapeHtml(point.basis || "")}</p>
        </article>`;
    })
    .join("");
  const latestPoint = (series.values ?? []).at(-1);
  body.style.cssText = getStudyDealCompanyStyle(series.company);
  body.innerHTML = `
    <div class="study-deal-dialog-kicker">
      <span class="study-company-badge" style="${getStudyDealCompanyStyle(series.company)}">${escapeHtml(company.label)}</span>
      <span>${escapeHtml(series.family || outlook.badge || "Capacity roadmap")}</span>
    </div>
    <h3>${escapeHtml(company.label)} ${escapeHtml(outlook.title || "연말 누적 capacity 전망")}</h3>
    <div class="study-deal-dialog-status">
      <span class="study-status-pill study-status-amber">2030E</span>
      <strong>${formatStudyOutlookGw(latestPoint?.gw)}</strong>
      <small>${escapeHtml(series.definition || "")}</small>
    </div>
    <dl class="study-deal-dialog-facts">
      <div><dt>정의</dt><dd>${escapeHtml(series.definition || "-")}</dd></div>
      <div><dt>산출 방식</dt><dd>${escapeHtml(series.calculation || "-")}</dd></div>
      <div><dt>비교 주의</dt><dd>${escapeHtml(outlook.warning || "-")}</dd></div>
      <div><dt>아래 그래프와 차이</dt><dd>${escapeHtml(outlook.comparisonNote || "-")}</dd></div>
    </dl>
    <div class="study-outlook-point-list">${pointMarkup}</div>
    <div class="study-deal-dialog-sources">
      <span>공식 발표 및 검증 근거</span>
      <div class="study-source-list">${renderStudyDataCenterSourceLinks(series.sources) || "공개 링크 없음"}</div>
    </div>`;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function openStudyDataCenterDealDetail(dealId) {
  const deal = (studyDataCenterDeals.deals ?? []).find((item) => item.id === dealId);
  const dialog = usOverviewRoot.querySelector("[data-study-data-center-dialog]");
  const body = dialog?.querySelector("[data-study-data-center-dialog-body]");
  if (!deal || !dialog || !body) {
    return;
  }
  const company = getStudyDealCompanyMeta(deal.company);
  const statusMeta = getStudyDealStatusMeta(deal.status);
  const partnerMarkup = (deal.partners ?? []).map((partner) => `<span class="study-partner-pill">${escapeHtml(partner)}</span>`).join("");
  body.style.cssText = getStudyDealCompanyStyle(deal.company);
  body.innerHTML = `
    <div class="study-deal-dialog-kicker">
      <span class="study-company-badge" style="${getStudyDealCompanyStyle(deal.company)}">${escapeHtml(company.label)}</span>
      <span>${escapeHtml(deal.date || "-")}</span>
    </div>
    <h3>${escapeHtml(deal.title || "-")}</h3>
    <div class="study-deal-dialog-status">
      <span class="study-status-pill study-status-${escapeHtml(statusMeta.tone)}">${escapeHtml(statusMeta.label)}</span>
      <strong>${escapeHtml(deal.capacity || "-")}</strong>
      <small>${escapeHtml(deal.amount || "-")}</small>
    </div>
    <dl class="study-deal-dialog-facts">
      <div><dt>위치</dt><dd>${escapeHtml(deal.location || "-")}</dd></div>
      <div><dt>파트너</dt><dd><div class="study-partner-list">${partnerMarkup || "-"}</div></dd></div>
      <div><dt>착공·가동 판단</dt><dd>${escapeHtml(deal.construction || "-")}</dd></div>
      <div><dt>형태</dt><dd>${escapeHtml(deal.dcType || "-")}</dd></div>
      <div><dt>전력·장비</dt><dd>${escapeHtml(deal.equipment || "-")}</dd></div>
      <div><dt>추론·정규화 기준</dt><dd>${escapeHtml(getStudyDealInference(deal, statusMeta))}</dd></div>
    </dl>
    <div class="study-deal-dialog-sources">
      <span>원문 및 검증 자료</span>
      <div class="study-source-list">${renderStudyDataCenterSourceLinks(deal.sources) || "공개 링크 없음"}</div>
    </div>`;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function openStudyDataCenterYearDetail(year) {
  const buildRow = getStudyDataCenterBuildRows().find((row) => Number(row.year) === Number(year));
  const dialog = usOverviewRoot.querySelector("[data-study-data-center-dialog]");
  const body = dialog?.querySelector("[data-study-data-center-dialog-body]");
  const schedule = studyDataCenterDeals.buildSchedule ?? {};
  if (!buildRow || !dialog || !body) {
    return;
  }
  const eventMarkup = buildRow.events.length
    ? buildRow.events
        .map((event) => {
          const company = getStudyDealCompanyMeta(event.company);
          const dealSources = event.dealIds.flatMap((dealId) => {
            const deal = (studyDataCenterDeals.deals ?? []).find((item) => item.id === dealId);
            return deal?.sources ?? [];
          });
          return `
            <article class="study-build-event" style="${getStudyDealCompanyStyle(event.company)}">
              <div>
                <span class="study-company-badge" style="${getStudyDealCompanyStyle(event.company)}">${escapeHtml(company.label)}</span>
                <strong>${escapeHtml(event.label)}</strong>
                <b>${formatStudyCapacityGw(event.gw)}</b>
              </div>
              <p>${escapeHtml(event.note || "")}</p>
              <small>${escapeHtml(event.confidence || "")}</small>
              <div class="study-source-list">${renderStudyDataCenterSourceLinks(dealSources)}</div>
            </article>`;
        })
        .join("")
    : '<p class="study-build-empty">정량 반영할 공개 GW가 없습니다.</p>';
  body.removeAttribute("style");
  body.innerHTML = `
    <div class="study-deal-dialog-kicker"><span>${escapeHtml(year)} · ${escapeHtml(schedule.badge || "연간 증분")}</span></div>
    <h3>${escapeHtml(schedule.title || "연도별 신규 가동 예정분")} · ${formatStudyCapacityGw(buildRow.total)}</h3>
    <p class="study-build-year-note">${escapeHtml(buildRow.note || "")}</p>
    <div class="study-build-event-list">${eventMarkup}</div>
    <div class="study-deal-dialog-sources">
      <span>집계 방법</span>
      <p>${escapeHtml(schedule.methodology || "")}</p>
    </div>`;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function bindStudyDataCenterDetails() {
  const dialog = usOverviewRoot.querySelector("[data-study-data-center-dialog]");
  usOverviewRoot.querySelectorAll("[data-study-outlook-detail]").forEach((button) => {
    button.addEventListener("click", () => openStudyDataCenterOutlookDetail(button.dataset.studyOutlookDetail));
  });
  usOverviewRoot.querySelectorAll("[data-study-data-center-deal]").forEach((button) => {
    button.addEventListener("click", () => openStudyDataCenterDealDetail(button.dataset.studyDataCenterDeal));
  });
  usOverviewRoot.querySelectorAll("[data-study-data-center-year]").forEach((button) => {
    button.addEventListener("click", () => openStudyDataCenterYearDetail(button.dataset.studyDataCenterYear));
  });
  dialog?.querySelector("[data-study-data-center-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function renderStudyDataCenterOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const allDeals = [...(studyDataCenterDeals.deals ?? [])];
  if (!allDeals.length) {
    renderPlaceholderOverview("Data Center Deals", "Data center deal data is not available yet.");
    return;
  }

  const companyOptions = studyDataCenterDeals.companies?.length
    ? studyDataCenterDeals.companies
    : [{ key: "All", label: "All" }, ...Array.from(new Set(allDeals.map((deal) => deal.company))).map((key) => ({ key, label: key }))];
  const buildRows = getStudyDataCenterBuildRows();
  const scheduledCapacityTotal = buildRows.reduce((sum, row) => sum + row.total, 0);
  const scheduleYears = studyDataCenterDeals.buildSchedule?.years ?? [];
  const scheduleRange = scheduleYears.length ? `${scheduleYears[0]}~${scheduleYears.at(-1)}` : "-";
  const activeCompany = companyOptions.some((item) => item.key === state.studyDataCenterCompany) ? state.studyDataCenterCompany : "All";
  state.studyDataCenterCompany = activeCompany;
  const filteredDeals = activeCompany === "All" ? allDeals : allDeals.filter((deal) => deal.company === activeCompany);
  const activeSort = studyDataCenterSortOptions.some((item) => item.key === state.studyDataCenterSort) ? state.studyDataCenterSort : "dateDesc";
  state.studyDataCenterSort = activeSort;
  const visibleDeals = [...filteredDeals].sort((left, right) => {
    const leftDate = String(left.date ?? "");
    const rightDate = String(right.date ?? "");
    const dateSort = activeSort === "dateAsc" ? leftDate.localeCompare(rightDate) : rightDate.localeCompare(leftDate);
    return dateSort || String(left.company ?? "").localeCompare(String(right.company ?? "")) || String(left.title ?? "").localeCompare(String(right.title ?? ""));
  });
  const liveCount = allDeals.filter((deal) => deal.status === "operational").length;
  const constructionCount = allDeals.filter((deal) => deal.status === "construction").length;
  const companyFilterMarkup = companyOptions
    .map(
      (company) => `
        <button
          type="button"
          class="study-deal-chip study-company-chip${activeCompany === company.key ? " active" : ""}"
          style="${getStudyDealCompanyStyle(company.key)}"
          data-study-data-center-company="${escapeHtml(company.key)}"
        >
          ${escapeHtml(company.label)}
        </button>`,
    )
    .join("");
  const sortMarkup = studyDataCenterSortOptions
    .map(
      (sortOption) => `
        <button
          type="button"
          class="study-deal-chip study-deal-sort-chip${activeSort === sortOption.key ? " active" : ""}"
          data-study-data-center-sort="${escapeHtml(sortOption.key)}"
        >
          ${escapeHtml(sortOption.label)}
        </button>`,
    )
    .join("");
  const legendMarkup = (studyDataCenterDeals.statusLegend ?? [])
    .map((item) => `<span class="study-status-pill study-status-${escapeHtml(item.tone)}">${escapeHtml(item.label)}</span>`)
    .join("");
  let currentYear = "";
  const rowMarkup = visibleDeals
    .map((deal) => {
      const statusMeta = getStudyDealStatusMeta(deal.status);
      const partnerMarkup = (deal.partners ?? [])
        .map((partner) => `<span class="study-partner-pill">${escapeHtml(partner)}</span>`)
        .join("");
      const sourceMarkup = renderStudyDataCenterSourceLinks(deal.sources);
      const year = String(deal.date ?? "").slice(0, 4) || "Unknown";
      const yearMarkup =
        year !== currentYear
          ? `
        <tr class="study-year-row">
          <td colspan="8">${escapeHtml(year)}</td>
        </tr>`
          : "";
      currentYear = year;

      return `${yearMarkup}
        <tr class="study-deal-row" style="${getStudyDealCompanyStyle(deal.company)}">
          <td>
            <span class="study-company-badge" style="${getStudyDealCompanyStyle(deal.company)}">${escapeHtml(deal.company)}</span>
          </td>
          <td class="study-deal-title-cell">
            <button type="button" class="study-deal-title-button" data-study-data-center-deal="${escapeHtml(deal.id)}">
              <strong>${escapeHtml(deal.title)}</strong>
              <span aria-hidden="true">ⓘ</span>
            </button>
            <small>${escapeHtml(deal.date)} · ${escapeHtml(deal.sourceNote || "")}</small>
          </td>
          <td>
            <strong>${escapeHtml(deal.capacity || "-")}</strong>
            <small>${escapeHtml(deal.amount || "-")}</small>
          </td>
          <td>
            <div class="study-partner-list">${partnerMarkup || "-"}</div>
          </td>
          <td>${escapeHtml(deal.location || "-")}</td>
          <td>
            <span class="study-status-pill study-status-${escapeHtml(statusMeta.tone)}">${escapeHtml(statusMeta.label)}</span>
            <small class="study-deal-note">${escapeHtml(deal.construction || "-")}</small>
          </td>
          <td>
            <strong>${escapeHtml(deal.dcType || "-")}</strong>
            <small>${escapeHtml(deal.equipment || "-")}</small>
          </td>
          <td>
            <div class="study-source-list">${sourceMarkup || "-"}</div>
          </td>
        </tr>`;
    })
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview study-overview study-data-center-overview">
      <section class="us-panel study-panel study-data-center-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>AI Data Center Deals</h2>
            <p>2025년 이후 GOOGL, AMZN, META, MSFT, OpenAI, Anthropic의 AI 데이터센터·전력·컴퓨트 capacity 딜을 정리합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${escapeHtml(studyDataCenterDeals.updatedAt || "-")}</div>
          </div>
        </div>
        ${renderStudyDataCenterCapacityOutlook()}
        ${renderStudyDataCenterMetricBridge()}
        ${renderStudyDataCenterBuildSummary(companyOptions, buildRows)}
        <div class="study-kpi-grid study-data-center-kpi-grid">
          <article class="study-kpi-card">
            <span>Tracked deals</span>
            <strong>${allDeals.length}</strong>
            <small>${companyOptions.length - 1} companies</small>
          </article>
          <article class="study-kpi-card study-kpi-card-green">
            <span>Online / construction</span>
            <strong>${liveCount + constructionCount}</strong>
            <small>${liveCount} operational · ${constructionCount} under construction</small>
          </article>
          <article class="study-kpi-card">
            <span>Dated new capacity</span>
            <strong>${formatStudyCapacityGw(scheduledCapacityTotal)}</strong>
            <small>${escapeHtml(scheduleRange)} 공개 최소치 · ${studyDataCenterDeals.buildSchedule?.events?.length || 0} events</small>
          </article>
        </div>
        <div class="market-trend-meta study-data-center-note">
          <span>${escapeHtml(studyDataCenterDeals.scope || "")}</span>
        </div>
        <div class="study-deal-filter-row">
          <div class="study-deal-control-group">
            <span>Company</span>
            <div class="study-deal-chip-row">${companyFilterMarkup}</div>
          </div>
          <div class="study-deal-control-group">
            <span>Sort</span>
            <div class="study-deal-chip-row">${sortMarkup}</div>
          </div>
          <div class="study-status-legend">${legendMarkup}</div>
        </div>
        <div class="study-deal-table-wrap">
          <table class="study-deal-table">
            <thead>
              <tr>
                <th>회사</th>
                <th>딜 / 발표일</th>
                <th>GW / 금액</th>
                <th>파트너</th>
                <th>위치</th>
                <th>착공 현황</th>
                <th>전력·장비 / 형태</th>
                <th>출처</th>
              </tr>
            </thead>
            <tbody>${rowMarkup}</tbody>
          </table>
        </div>
      </section>
      <dialog class="study-data-center-dialog" data-study-data-center-dialog>
        <div class="study-data-center-dialog-head">
          <strong>Data Center 근거 상세</strong>
          <button type="button" class="study-data-center-dialog-close" data-study-data-center-dialog-close aria-label="닫기">×</button>
        </div>
        <div class="study-data-center-dialog-body" data-study-data-center-dialog-body></div>
      </dialog>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-study-data-center-company]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyDataCenterCompany = button.dataset.studyDataCenterCompany || "All";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-study-data-center-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.studyDataCenterSort = button.dataset.studyDataCenterSort || "dateDesc";
      render();
    });
  });

  bindStudyDataCenterDetails();
  const outlookChart = createStudyDataCenterCapacityOutlookChart(
    usOverviewRoot.querySelector('[data-study-chart="data-center-capacity-outlook"]'),
  );
  bindStudyDataCenterCapacityOutlookChart(outlookChart);
  createStudyDataCenterBuildChart(usOverviewRoot.querySelector('[data-study-chart="data-center-build"]'), companyOptions, buildRows);
}

function renderIndexTrendOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const marketUpdatedAt = marketPriceData.updatedAt || "-";
  const marketTrendBounds = getMarketTrendBounds();
  const marketTrendStartValue = state.marketTrendCustomStart || "";
  const marketTrendEndValue = state.marketTrendCustomEnd || "";
  const marketTrendRangeMarkup = (marketPriceData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketTrendRange === range.key ? " active" : ""}"
          data-market-trend-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  const marketTrendIndexMarkup = MARKET_PRICE_TREND_INDEX_OPTIONS.map(
    (item) => `
      <button
        type="button"
        class="total-series-chip${state.marketTrendIndex === item.key ? " active" : ""}"
        data-market-trend-index="${item.key}"
      >
        ${item.label}
      </button>`,
  ).join("");
  const marketTrendChartTypeMarkup = MARKET_TREND_PRICE_CHART_TYPES.map(
    (chartType) => `
      <button
        type="button"
        class="total-series-chip${state.marketTrendChartType === chartType.key ? " active" : ""}"
        data-market-trend-chart-type="${chartType.key}"
        aria-pressed="${state.marketTrendChartType === chartType.key}"
      >
        ${chartType.label}
      </button>`,
  ).join("");
  const marketTrendChartZoomButtons = `
    <div class="market-rs-chart-zoom-controls" role="group" aria-label="Index Trend chart zoom controls">
      <button type="button" data-market-trend-chart-zoom="in" aria-label="Zoom in" title="Zoom in">+</button>
      <button type="button" data-market-trend-chart-zoom="out" aria-label="Zoom out" title="Zoom out">-</button>
      <button type="button" class="market-rs-chart-zoom-reset" data-market-trend-chart-zoom="reset">Reset</button>
    </div>
  `;
  const marketTrendEmaMarkup = MARKET_PRICE_EMA_OPTIONS.map(
    (period) => `
      <button
        type="button"
        class="total-series-chip${(state.marketTrendEmas ?? []).includes(period) ? " active" : ""}"
        data-market-trend-ema="${period}"
      >
        EMA ${period}
      </button>`,
  ).join("");
  const marketTrendGapMarkup = buildMarketTrendGapSummary()
    .map((item) => {
      const gapClass = item.gap === null ? "neutral" : Number(item.gap) >= 0 ? "positive" : "negative";
      return `
        <span class="market-trend-gap-pill ${gapClass}" title="${item.date} index ${formatUsStockPrice(item.indexValue, 2)} / EMA ${item.period} ${formatUsStockPrice(item.emaValue, 2)}">
          <span>EMA ${item.period}</span>
          <strong>${formatMarketTrendGap(item.gap)}</strong>
        </span>`;
    })
    .join("");
  const marketTrendRiskMarkup = buildMarketTrendRiskSummary()
    .map(
      (item) => `
        <span class="market-trend-risk-pill ${item.tone}" title="${item.date}">
          <span>${item.label}</span>
          <strong>${item.text}</strong>
        </span>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Index Trend & EMA</h2>
            <p>S&P 500, Dow Jones, NASDAQ 100, SOX, Russell 2000, VKOSPI의 일별 지수와 EMA(20, 50, 100, 200)를 장기 시계열 기준으로 확인합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${marketTrendRangeMarkup}</div>
            <div class="us-price-updated">Updated ${marketUpdatedAt}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-market-trend-start
              min="${marketTrendBounds.min}"
              max="${marketTrendBounds.max}"
              value="${marketTrendStartValue}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-market-trend-end
              min="${marketTrendBounds.min}"
              max="${marketTrendBounds.max}"
              value="${marketTrendEndValue}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-market-trend-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-market-trend-reset>Reset</button>
          </div>
        </div>
        <div class="total-series-row total-series-row-left">
          ${marketTrendIndexMarkup}
        </div>
        <div class="total-series-row total-series-row-left">
          ${marketTrendChartTypeMarkup}
          ${marketTrendChartZoomButtons}
        </div>
        <div class="total-series-row total-series-row-left">
          ${marketTrendEmaMarkup}
        </div>
        <div class="market-trend-meta">
          <span>Coverage from ${marketTrendBounds.min || "2000-01-01"}</span>
          <span>Gap = Index / EMA - 1</span>
        </div>
        <div class="market-trend-gap-row">
          ${marketTrendGapMarkup}
        </div>
        <div class="market-trend-legend">
          <span class="market-trend-legend-item">
            <span class="market-trend-legend-swatch market-trend-legend-swatch-weak"></span>
            EMA 20 &lt; EMA 50
          </span>
          <span class="market-trend-legend-item">
            <span class="market-trend-legend-swatch market-trend-legend-swatch-full"></span>
            EMA 20 &lt; EMA 50 &lt; EMA 100
          </span>
          <span class="market-trend-legend-item">
            <span class="market-trend-legend-swatch market-trend-legend-swatch-bull"></span>
            EMA 20 &gt; EMA 50 &gt; EMA 100 &gt; EMA 200
          </span>
        </div>
        <div class="us-price-chart-wrap us-price-chart-wrap-large">
          <canvas data-market-trend="ema"></canvas>
        </div>
        <div class="market-trend-risk-block">
          <div class="market-trend-meta">
            <span>21일 ATR, 전체 고점 대비 MDD, 60D Rolling MDD, 최근 60거래일 하락폭의 ATR 배수를 각각 분리해서 봅니다.</span>
            <span>${marketTrendRiskMarkup}</span>
          </div>
          <div class="market-trend-risk-grid">
            <div class="market-trend-risk-card market-trend-risk-card-atr">
              <div class="market-trend-risk-card-head">
                <strong>21D ATR (%)</strong>
                <span>일중 변동성</span>
              </div>
              <div class="market-trend-risk-chart-wrap">
                <canvas data-market-trend="risk" data-market-trend-risk="atr"></canvas>
              </div>
            </div>
            <div class="market-trend-risk-card market-trend-risk-card-multiple">
              <div class="market-trend-risk-card-head">
                <strong>60D MDD / ATR</strong>
                <span>최근 60거래일 고점 하락폭의 ATR 배수</span>
              </div>
              <div class="market-trend-risk-chart-wrap">
                <canvas data-market-trend="risk" data-market-trend-risk="multiple"></canvas>
              </div>
            </div>
            <div class="market-trend-risk-card market-trend-risk-card-drawdown">
              <div class="market-trend-risk-card-head">
                <strong>MDD from High (%)</strong>
                <span>고점 대비 하락률</span>
              </div>
              <div class="market-trend-risk-chart-wrap">
                <canvas data-market-trend="risk" data-market-trend-risk="drawdown"></canvas>
              </div>
            </div>
            <div class="market-trend-risk-card market-trend-risk-card-rolling-drawdown">
              <div class="market-trend-risk-card-head">
                <strong>60D Rolling MDD (%)</strong>
                <span>최근 60거래일 고점 대비</span>
              </div>
              <div class="market-trend-risk-chart-wrap">
                <canvas data-market-trend="risk" data-market-trend-risk="rollingDrawdown60"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-market-trend-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketTrendRange = button.dataset.marketTrendRange || "3y";
      state.marketTrendCustomStart = "";
      state.marketTrendCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-trend-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketTrendIndex = button.dataset.marketTrendIndex || "sp500";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-trend-chart-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const chartType = button.dataset.marketTrendChartType;
      if (!MARKET_TREND_PRICE_CHART_TYPES.some((item) => item.key === chartType)) {
        return;
      }
      state.marketTrendChartType = chartType;
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-trend-chart-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!marketTrendDetailChart) {
        return;
      }
      const action = button.dataset.marketTrendChartZoom;
      if (action === "reset" && typeof marketTrendDetailChart.resetZoom === "function") {
        marketTrendDetailChart.resetZoom();
        fitMarketTrendChartYToVisible(marketTrendDetailChart);
      } else if (action === "in") {
        zoomMarketTrendChartToLatest("in");
      } else if (action === "out") {
        zoomMarketTrendChartToLatest("out");
      }
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-trend-ema]").forEach((button) => {
    button.addEventListener("click", () => {
      const period = Number(button.dataset.marketTrendEma);
      if (!Number.isFinite(period)) {
        return;
      }
      const current = new Set(state.marketTrendEmas ?? []);
      if (current.has(period)) {
        if (current.size === 1) {
          return;
        }
        current.delete(period);
      } else {
        current.add(period);
      }
      state.marketTrendEmas = [...current].sort((a, b) => a - b);
      render();
    });
  });

  const marketTrendStartInput = usOverviewRoot.querySelector("[data-market-trend-start]");
  const marketTrendEndInput = usOverviewRoot.querySelector("[data-market-trend-end]");
  const marketTrendApplyButton = usOverviewRoot.querySelector("[data-market-trend-apply]");
  const marketTrendResetButton = usOverviewRoot.querySelector("[data-market-trend-reset]");

  if (marketTrendApplyButton && marketTrendStartInput && marketTrendEndInput) {
    marketTrendApplyButton.addEventListener("click", () => {
      const startValue = marketTrendStartInput.value || "";
      const endValue = marketTrendEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.marketTrendCustomStart = startValue;
      state.marketTrendCustomEnd = endValue;
      render();
    });
  }

  if (marketTrendResetButton) {
    marketTrendResetButton.addEventListener("click", () => {
      state.marketTrendCustomStart = "";
      state.marketTrendCustomEnd = "";
      render();
    });
  }

  const trendCanvas = usOverviewRoot.querySelector('[data-market-trend="ema"]');
  if (trendCanvas) {
    createMarketTrendChart(
      trendCanvas,
      state.marketTrendRange,
      state.marketTrendIndex,
      state.marketTrendCustomStart,
      state.marketTrendCustomEnd,
    );
  }

  usOverviewRoot.querySelectorAll('[data-market-trend="risk"]').forEach((trendRiskCanvas) => {
    createMarketTrendRiskChart(
      trendRiskCanvas,
      state.marketTrendRange,
      state.marketTrendIndex,
      state.marketTrendCustomStart,
      state.marketTrendCustomEnd,
    );
  });
}

function renderMarketOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const rangeMarkup = ((marketMacroData.ranges ?? []).length ? marketMacroData.ranges : marketPriceData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketPriceRange === range.key ? " active" : ""}"
          data-market-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");

  const marketUpdatedAt = [marketPriceData.updatedAt, marketMacroData.updatedAt].filter(Boolean).sort().slice(-1)[0] || "-";
  const totalBounds = getTotalDashboardBounds();
  const totalStartValue = state.totalDashboardCustomStart || "";
  const totalEndValue = state.totalDashboardCustomEnd || "";
  const totalSeriesItems = getTotalDashboardSeriesItems();
  const selectedTotalBarItems = totalSeriesItems.filter(
    (item) => item.chartType === "bar" && (state.totalDashboardSelection ?? []).includes(item.key),
  );
  const totalSeriesMarkup = totalSeriesItems
    .map(
      (item) => `
        <button
          type="button"
          class="total-series-chip${(state.totalDashboardSelection ?? []).includes(item.key) ? " active" : ""}"
          data-total-series="${item.key}"
        >
          <span class="total-series-dot" style="background:${item.color}"></span>
          ${item.label}
        </button>`,
    )
    .join("");
  const totalRangeMarkup = (marketMacroData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.totalDashboardRange === range.key ? " active" : ""}"
          data-total-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Total Dashboard</h2>
            <p>Market series use Start = 100 normalized performance; YTD uses the final valid close of the prior calendar year. US and Japan yields stay on the right axis in raw percent terms.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${totalRangeMarkup}</div>
            <div class="us-price-updated">Updated ${marketUpdatedAt}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-total-start
              min="${totalBounds.min}"
              max="${totalBounds.max}"
              value="${totalStartValue}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-total-end
              min="${totalBounds.min}"
              max="${totalBounds.max}"
              value="${totalEndValue}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-total-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-total-reset>Reset</button>
          </div>
        </div>
        <div class="total-series-row">
          ${totalSeriesMarkup}
        </div>
        <div class="us-price-chart-wrap">
          <canvas data-market-total="overview"></canvas>
        </div>
        ${
          selectedTotalBarItems.length
            ? `
              <section class="total-spread-panel">
                <div class="total-spread-head">
                  <div>
                    <h3>US 10Y - 30Y Spread</h3>
                    <p>10년물 금리에서 30년물 금리를 뺀 값입니다. 0%p 아래의 빨간 막대는 30년물 금리가 더 높은 상태를 뜻합니다.</p>
                  </div>
                </div>
                <div class="total-spread-chart-wrap">
                  <canvas data-market-total-spread="overview"></canvas>
                </div>
              </section>`
            : ""
        }
      </section>
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Market Relative Performance</h2>
            <p>Daily close normalized to 100 at the selected start date. YTD uses the final valid close of the prior calendar year. Max begins ${marketPriceData.startDate ?? "2017-01-01"}.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${rangeMarkup}</div>
            <div class="us-price-updated">Updated ${marketUpdatedAt}</div>
          </div>
        </div>
        <div class="us-price-chart-wrap">
          <canvas data-market-relative="performance"></canvas>
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-market-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketPriceRange = button.dataset.marketRange || marketPriceData.defaultRange || "max";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-total-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.totalDashboardRange = button.dataset.totalRange || "3y";
      state.totalDashboardCustomStart = "";
      state.totalDashboardCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-total-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.totalSeries;
      if (!key) {
        return;
      }
      const current = new Set(state.totalDashboardSelection ?? []);
      if (current.has(key)) {
        if (current.size === 1) {
          return;
        }
        current.delete(key);
      } else {
        current.add(key);
      }
      state.totalDashboardSelection = [...current];
      render();
    });
  });

  const totalStartInput = usOverviewRoot.querySelector("[data-total-start]");
  const totalEndInput = usOverviewRoot.querySelector("[data-total-end]");
  const totalApplyButton = usOverviewRoot.querySelector("[data-total-apply]");
  const totalResetButton = usOverviewRoot.querySelector("[data-total-reset]");

  if (totalApplyButton && totalStartInput && totalEndInput) {
    totalApplyButton.addEventListener("click", () => {
      const startValue = totalStartInput.value || "";
      const endValue = totalEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.totalDashboardCustomStart = startValue;
      state.totalDashboardCustomEnd = endValue;
      render();
    });
  }

  if (totalResetButton) {
    totalResetButton.addEventListener("click", () => {
      state.totalDashboardCustomStart = "";
      state.totalDashboardCustomEnd = "";
      render();
    });
  }

  const totalCanvas = usOverviewRoot.querySelector('[data-market-total="overview"]');
  if (totalCanvas) {
    createTotalDashboardChart(totalCanvas, state.totalDashboardRange);
  }

  const totalSpreadCanvas = usOverviewRoot.querySelector('[data-market-total-spread="overview"]');
  if (totalSpreadCanvas) {
    createTotalDashboardSpreadChart(totalSpreadCanvas, state.totalDashboardRange);
  }

  const relativeCanvas = usOverviewRoot.querySelector('[data-market-relative="performance"]');
  if (relativeCanvas) {
    createMarketRelativeChart(relativeCanvas, state.marketPriceRange);
  }
}

function renderMarketMacroOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const indicator = getSelectedMacroIndicator();
  const series = getSelectedMacroSeries(indicator);
  const indicators = macroIndicatorsData.indicators ?? [];
  const categories = macroIndicatorsData.categories ?? [];

  const snapshotMarkup = indicators
    .map((entry) => {
      const latestLabel = entry.latestMonth ? formatMonthLabel(entry.latestMonth) : entry.statusNote ?? "manual/source pending";
      const entryKoLabel = getMacroKoreanLabel(entry);
      const seriesMarkup = (entry.series ?? [])
        .map((item) => {
          const latestRelease = item.latestRelease ?? null;
          const itemKoLabel = getMacroKoreanLabel(item);
          const itemKoNote = getMacroKoreanNote(item);
          const chartKind = getMacroSeriesChartKind(item);
          const primaryValue =
            chartKind === "yoy"
              ? formatMacroChangePercent(item.yoyPct)
              : chartKind === "mom_change"
                ? formatMacroDeltaValue(item.unit, item.deltaValue)
                : formatMacroIndicatorValue(item.unit, item.latestValue);
          const primaryLabel = getMacroChartKindLabel(chartKind);
          if (!item.latestDate || !Number.isFinite(Number(item.latestValue))) {
            return `
              <div class="macro-snapshot-stat">
                <span>${item.label}${itemKoLabel ? `<em class="macro-ko-label">${itemKoLabel}</em>` : ""}</span>
                <strong>Pending</strong>
                <small>${entry.statusNote ?? "manual/source pending"}</small>
              </div>
            `;
          }
          return `
            <div class="macro-snapshot-stat">
              <span>${item.label}${itemKoLabel ? `<em class="macro-ko-label">${itemKoLabel}</em>` : ""}</span>
              <strong>${primaryValue}</strong>
              <small>${primaryLabel} focus | raw ${formatMacroIndicatorValue(item.unit, item.latestValue)}</small>
              <small>MoM ${formatMacroChangePercent(item.momPct)} | YoY ${formatMacroChangePercent(item.yoyPct)}</small>
              <small>${latestRelease ? `Released ${latestRelease.releaseDate ?? "-"} | ${getMacroReleaseBasis(item, latestRelease)}` : "release date pending"}</small>
              <small>${latestRelease ? `Actual ${latestRelease.actual ?? "-"} / Cons ${latestRelease.consensus ?? "-"} / Surprise ${latestRelease.surprise ?? "-"}` : "consensus pending"}</small>
              ${itemKoNote ? `<small class="macro-ko-note">${itemKoNote}</small>` : ""}
            </div>
          `;
        })
        .join("");
      return `
        <article class="macro-snapshot-card">
          <div class="macro-snapshot-head">
            <div>
              <h3>${entry.title}${entryKoLabel ? `<em class="macro-ko-label macro-ko-label-title">${entryKoLabel}</em>` : ""}</h3>
              <p>${entry.category}</p>
            </div>
            <span class="macro-status-pill ${entry.status === "manual" ? "manual" : "auto"}">${entry.status === "manual" ? "Manual" : "Auto"}</span>
          </div>
          <p class="macro-snapshot-date">Latest ${latestLabel}</p>
          <div class="macro-snapshot-stats">${seriesMarkup}</div>
        </article>
      `;
    })
    .join("");

  const coverageRows = indicators
    .map(
      (entry) => `
        <tr>
          <td>${entry.title}</td>
          <td>${entry.availableStartMonth ?? entry.startMonth ?? "-"}</td>
          <td>${entry.sourceLabel ?? "-"}</td>
          <td>${entry.status === "manual" ? (entry.statusNote ?? "manual/source pending") : "ready"}</td>
        </tr>
      `,
    )
    .join("");

  const categoryMarkup = categories
    .map(
      (entry) => `
        <article class="macro-category-card">
          <h3>${entry.label}</h3>
          <div class="macro-category-list">
            ${(entry.items ?? []).map((item) => `<span class="market-rs-chip">${item}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");

  const indicatorOptions = indicators
    .map((entry) => {
      const koLabel = getMacroKoreanLabel(entry);
      return `<option value="${entry.key}"${entry.key === indicator?.key ? " selected" : ""}>${entry.title}${koLabel ? ` (${koLabel})` : ""}</option>`;
    })
    .join("");

  const seriesChips = (indicator?.series ?? [])
    .map(
      (item) => {
        const koLabel = getMacroKoreanLabel(item);
        return `
          <button
            type="button"
            class="market-rs-chip macro-series-chip${item.key === series?.key ? " active" : ""}"
            data-macro-series="${item.key}"
          >${item.label}${koLabel ? `<span>${koLabel}</span>` : ""}</button>
        `;
      },
    )
    .join("");

  const selectedChartKind = getMacroSeriesChartKind(series);
  const selectedKoLabel = getMacroKoreanLabel(series);
  const selectedKoNote = getMacroKoreanNote(series);
  const selectedReleaseBasis = getMacroReleaseBasis(series);

  const chartMetaMarkup =
    indicator && series
      ? `
        <div class="macro-chart-metrics">
          <div class="market-rs-metric">
            <span>Chart View</span>
            <strong>${getMacroChartKindLabel(selectedChartKind)}</strong>
          </div>
          <div class="market-rs-metric">
            <span>YoY</span>
            <strong>${formatMacroChangePercent(series.yoyPct)}</strong>
          </div>
          <div class="market-rs-metric">
            <span>MoM</span>
            <strong>${formatMacroChangePercent(series.momPct)}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Actual</span>
            <strong>${series.latestRelease?.actual ?? formatMacroIndicatorValue(series.unit, series.latestValue)}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Consensus</span>
            <strong>${series.latestRelease?.consensus ?? "-"}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Surprise</span>
            <strong>${series.latestRelease?.surprise ?? "-"}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Release Date</span>
            <strong>${series.latestRelease?.releaseDate ?? "-"}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Release Basis</span>
            <strong>${selectedReleaseBasis}</strong>
          </div>
          <div class="market-rs-metric">
            <span>Coverage</span>
            <strong>${state.macroHistoryMode === "common" ? "2016-01+" : indicator.availableStartMonth ?? indicator.startMonth ?? "-"}</strong>
          </div>
        </div>
      `
      : "";

  const releaseRows = (series?.releaseHistory ?? [])
    .slice()
    .reverse()
    .map(
      (row) => `
        <tr>
          <td>${row.releaseDate}</td>
          <td>${row.reference ?? "-"}</td>
          <td>${row.actual ?? "-"}</td>
          <td>${row.consensus ?? "-"}</td>
          <td>${row.previous ?? "-"}</td>
          <td>${getMacroReleaseBasis(series, row)}</td>
          <td>${row.surprise ?? "-"}</td>
        </tr>
      `,
    )
    .join("");

  const chartBodyMarkup =
    indicator?.status === "manual" || !series?.dates?.length
      ? `
        <div class="market-rs-empty macro-pending-state">
          <strong>${indicator?.title ?? "Selected indicator"}</strong>
          <span>${indicator?.statusNote ?? "manual/source pending"}</span>
          <a href="${indicator?.sourceUrl ?? "#"}" target="_blank" rel="noreferrer">Open source page</a>
        </div>
      `
      : `
        <div class="chart-wrap macro-chart-wrap">
          <canvas data-macro-indicator-chart></canvas>
        </div>
        <p class="market-rs-chart-caption">
          ${indicator?.title ?? "-"} / ${series?.label ?? "-"}${selectedKoLabel ? ` (${selectedKoLabel})` : ""} / ${getMacroChartKindLabel(selectedChartKind)} / ${state.macroHistoryMode === "common" ? "2016-01+ common view" : "full history"}
        </p>
        ${selectedKoNote ? `<p class="macro-ko-chart-note">${selectedKoNote}</p>` : ""}
        <div class="macro-release-table-wrap">
          <div class="us-section-head macro-release-head">
            <div>
              <h3>Actual vs Consensus</h3>
              <p>Release basis: ${selectedReleaseBasis}. CPI/PCE/PPI 같은 물가지표 발표 서프라이즈는 시장에서 MoM 컨센서스를 특히 크게 봅니다.</p>
            </div>
          </div>
          <div class="macro-release-chart-wrap">
            <canvas data-macro-release-chart></canvas>
          </div>
          <table class="macro-coverage-table macro-release-table">
            <thead>
              <tr>
                <th>Release</th>
                <th>Ref</th>
                <th>Actual</th>
                <th>Cons</th>
                <th>Prev</th>
                <th>Basis</th>
                <th>Surprise</th>
              </tr>
            </thead>
            <tbody>${releaseRows || '<tr><td colspan="7">Release history pending.</td></tr>'}</tbody>
          </table>
        </div>
      `;
  const macroDashboardItems = getMacroDashboardItems();
  const macroDashboardRangeSource = (marketMacroData.ranges ?? []).length ? marketMacroData.ranges : marketPriceData.ranges ?? [];
  const macroDashboardBounds = getMacroDashboardBounds();
  const macroDashboardStartValue = state.macroDashboardCustomStart || "";
  const macroDashboardEndValue = state.macroDashboardCustomEnd || "";
  const macroDashboardRangeMarkup = macroDashboardRangeSource
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.macroDashboardRange === range.key ? " active" : ""}"
          data-macro-dashboard-range="${range.key}"
        >${range.label}</button>
      `,
    )
    .join("");
  const macroDashboardSelectorMarkup = macroDashboardItems
    .map(
      (item) => `
        <button
          type="button"
          class="market-rs-chip macro-dashboard-chip${state.macroDashboardSelection.includes(item.key) ? " active" : ""}"
          data-macro-dashboard-series="${item.key}"
        >
          <span class="macro-series-dot" style="background:${item.color}"></span>
          ${item.label}
        </button>
      `,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel macro-panel macro-dashboard-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Macro Total Dashboard</h2>
            <p class="macro-clean-copy">미국 기준금리, 명목금리, 실질금리, S&P500, 인플레, 고용, 원자재, ISM을 한 그래프에서 비교합니다.</p>
            <p>Rates and macro indicators use the right axes; S&P500 and commodities are normalized to 100 on the left axis.</p>
          </div>
          <div class="m7-range-row">${macroDashboardRangeMarkup}</div>
        </div>
        <div class="macro-dashboard-note">
          <span>실질금리 = US 5Y - 5Y 기대 인플레이션(T5YIE)</span>
          <span>좌측축: 주식/원자재 Start=100</span>
          <span>우측축: 금리/인플레/고용률 %</span>
          <span>ISM축: 50 기준 확산지수</span>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-macro-dashboard-start
              min="${macroDashboardBounds.min}"
              max="${macroDashboardBounds.max}"
              value="${macroDashboardStartValue}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-macro-dashboard-end
              min="${macroDashboardBounds.min}"
              max="${macroDashboardBounds.max}"
              value="${macroDashboardEndValue}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-macro-dashboard-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-macro-dashboard-reset>Reset</button>
          </div>
        </div>
        <div class="total-series-row total-series-row-left macro-dashboard-series-row">${macroDashboardSelectorMarkup}</div>
        <div class="macro-dashboard-chart-wrap">
          <canvas data-macro-dashboard-chart></canvas>
        </div>
      </section>

      <section class="us-panel macro-panel">
        <div class="us-section-head">
          <div>
            <h2>Historical Chart</h2>
            <p class="macro-clean-copy">CPI, PCE, PPI처럼 추세가 중요한 지표는 YoY 중심으로 보고, 실업률과 PMI처럼 레벨이 중요한 지표는 레벨로 봅니다.</p>
            <p>개별 지표는 각 지표별 전체 기간 또는 공통 시작월 2016-01 이후 구간으로 볼 수 있습니다.</p>
          </div>
        </div>
        <div class="market-rs-controls macro-chart-controls">
          <label class="macro-control-field">
            <span class="market-rs-control-label">Indicator</span>
            <select id="macro-indicator-select" class="macro-select">${indicatorOptions}</select>
          </label>
          <div>
            <span class="market-rs-control-label">History</span>
            <div class="market-rs-chip-row">
              <button type="button" class="market-rs-chip${state.macroHistoryMode === "common" ? " active" : ""}" data-macro-mode="common">2016-01+</button>
              <button type="button" class="market-rs-chip${state.macroHistoryMode === "full" ? " active" : ""}" data-macro-mode="full">Full History</button>
            </div>
          </div>
          <div>
            <span class="market-rs-control-label">Series</span>
            <div class="market-rs-chip-row">${seriesChips}</div>
          </div>
        </div>
        ${chartMetaMarkup}
        ${chartBodyMarkup}
      </section>

      <section class="us-panel macro-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Latest Macro Snapshot</h2>
            <p class="macro-clean-copy">최신 발표월 기준 YoY/MoM, 실제치, 컨센서스, 서프라이즈를 빠르게 확인합니다.</p>
            <p>미국 투자자들이 매달 확인하는 핵심 매크로 지표 10개를 최신 발표월 기준으로 빠르게 확인합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${macroIndicatorsData.updatedAt ? formatKstDateTime(macroIndicatorsData.updatedAt) : "-"}</div>
          </div>
        </div>
        <div class="macro-snapshot-grid">${snapshotMarkup}</div>
      </section>

      <section class="macro-panel-grid macro-indicator-grid">
        <article class="us-panel">
          <div class="us-section-head">
            <div>
              <h2>Release Coverage</h2>
              <p class="macro-clean-copy">사용 가능 시작월, 데이터 소스, 자동/수동 업데이트 상태를 확인합니다.</p>
              <p>사용 가능 시작월, 데이터 소스, 자동/수동 업데이트 상태를 한 번에 확인합니다.</p>
            </div>
          </div>
          <div class="macro-coverage-table-wrap">
            <table class="macro-coverage-table">
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>Start</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${coverageRows}</tbody>
            </table>
          </div>
        </article>

        <article class="us-panel">
          <div class="us-section-head">
            <div>
              <h2>Category Grouping</h2>
              <p class="macro-clean-copy">인플레이션, 노동, 수요, 경기순환, 금리민감 지표로 묶었습니다.</p>
              <p>인플레이션, 노동, 수요, 경기순환, 금리민감도로 매크로 지표를 묶었습니다.</p>
            </div>
          </div>
          <div class="macro-category-grid">${categoryMarkup}</div>
        </article>
      </section>
    </section>
  `;

  usOverviewRoot.querySelector("#macro-indicator-select")?.addEventListener("change", (event) => {
    state.macroIndicatorKey = event.target.value;
    const nextIndicator = getSelectedMacroIndicator();
    state.macroSeriesKey = nextIndicator?.series?.[0]?.key ?? "";
    render();
  });

  usOverviewRoot.querySelectorAll("[data-macro-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.macroHistoryMode = button.dataset.macroMode;
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-macro-series]").forEach((button) => {
    button.addEventListener("click", () => {
      state.macroSeriesKey = button.dataset.macroSeries;
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-macro-dashboard-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.macroDashboardRange = button.dataset.macroDashboardRange || "3y";
      state.macroDashboardCustomStart = "";
      state.macroDashboardCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-macro-dashboard-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.macroDashboardSeries;
      if (!key) {
        return;
      }
      const selected = new Set(state.macroDashboardSelection);
      if (selected.has(key)) {
        selected.delete(key);
      } else {
        selected.add(key);
      }
      state.macroDashboardSelection = [...selected];
      render();
    });
  });

  const macroDashboardStartInput = usOverviewRoot.querySelector("[data-macro-dashboard-start]");
  const macroDashboardEndInput = usOverviewRoot.querySelector("[data-macro-dashboard-end]");
  const macroDashboardApplyButton = usOverviewRoot.querySelector("[data-macro-dashboard-apply]");
  const macroDashboardResetButton = usOverviewRoot.querySelector("[data-macro-dashboard-reset]");

  if (macroDashboardApplyButton && macroDashboardStartInput && macroDashboardEndInput) {
    macroDashboardApplyButton.addEventListener("click", () => {
      const startValue = macroDashboardStartInput.value || "";
      const endValue = macroDashboardEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.macroDashboardCustomStart = startValue;
      state.macroDashboardCustomEnd = endValue;
      render();
    });
  }

  if (macroDashboardResetButton) {
    macroDashboardResetButton.addEventListener("click", () => {
      state.macroDashboardCustomStart = "";
      state.macroDashboardCustomEnd = "";
      render();
    });
  }

  const macroDashboardCanvas = usOverviewRoot.querySelector("[data-macro-dashboard-chart]");
  if (macroDashboardCanvas) {
    createMacroDashboardChart(macroDashboardCanvas, state.macroDashboardRange);
  }

  if (indicator?.status !== "manual" && series?.dates?.length) {
    const canvas = usOverviewRoot.querySelector("[data-macro-indicator-chart]");
    if (canvas) {
      createMacroIndicatorChart(canvas, indicator, series, state.macroHistoryMode);
    }
    const releaseCanvas = usOverviewRoot.querySelector("[data-macro-release-chart]");
    if (releaseCanvas) {
      createMacroReleaseChart(releaseCanvas, series);
    }
  }
}

function renderMarketFxCommoditiesOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const rangeSource = (marketMacroData.ranges ?? []).length ? marketMacroData.ranges : marketPriceData.ranges ?? [];
  const marketUpdatedAt = marketMacroData.updatedAt || marketPriceData.updatedAt || "-";
  const macroPanels = [
    { key: "fx_dashboard", canvas: "fx_dashboard", className: "macro-panel-wide" },
    { key: "energy", canvas: "energy", className: "" },
    { key: "natural_gas", canvas: "natural_gas", className: "" },
    { key: "metals", canvas: "metals", className: "" },
    { key: "strategic", canvas: "strategic", className: "macro-panel-wide" },
    { key: "food", canvas: "food", className: "macro-panel-wide" },
  ]
    .map(({ key, canvas, className }) => {
      const panel = getMarketMacroPanel(key);
      if (!panel) {
        return "";
      }
      const selectedSeries = new Set(getMarketMacroSelection(key));
      const customRange = getMarketMacroCustomRange(key);
      const isFxPanel = key === "fx_dashboard";
      const seriesChips = Object.entries(panel.series ?? {})
        .map(
          ([seriesKey, item]) => `
            <button
              type="button"
              class="m7-range-chip macro-dashboard-chip${selectedSeries.has(seriesKey) ? " active" : ""}"
              data-market-macro-series="${seriesKey}"
              data-market-macro-panel="${key}"
            >
              <i class="macro-series-dot" style="background:${item.color}"></i>
              ${item.name}
            </button>`,
        )
        .join("");
      const fxCurrencyOptions = (selectedCurrency, disabledCurrency) => FX_CURRENCY_OPTIONS
        .map((option) => `
          <option value="${option.key}"${option.key === selectedCurrency ? " selected" : ""}${option.key === disabledCurrency ? " disabled" : ""}>
            ${option.label} · ${option.name}
          </option>
        `)
        .join("");
      const fxPairControls = `
        <div class="fx-pair-controls">
          <label class="fx-pair-field">
            <span>기준 통화</span>
            <select data-fx-base-currency>
              ${fxCurrencyOptions(state.fxBaseCurrency, state.fxQuoteCurrency)}
            </select>
          </label>
          <span class="fx-pair-divider" aria-hidden="true">/</span>
          <label class="fx-pair-field">
            <span>비교 통화</span>
            <select data-fx-quote-currency>
              ${fxCurrencyOptions(state.fxQuoteCurrency, state.fxBaseCurrency)}
            </select>
          </label>
          <div class="fx-pair-reading">
            <strong>${state.fxBaseCurrency} / ${state.fxQuoteCurrency}</strong>
            <span>100 위 = ${state.fxBaseCurrency} 강세 · 100 아래 = ${state.fxBaseCurrency} 약세</span>
          </div>
        </div>
      `;
      const customDateMarkup = `
            <div class="total-date-row market-macro-date-row">
              <label class="total-date-field">
                Start
                <input type="date" value="${customRange.start || ""}" data-market-macro-custom-start="${key}">
              </label>
              <label class="total-date-field">
                End
                <input type="date" value="${customRange.end || ""}" data-market-macro-custom-end="${key}">
              </label>
              <div class="total-date-actions">
                <button type="button" class="total-date-button" data-market-macro-custom-apply="${key}">Apply</button>
                <button type="button" class="total-date-button total-date-button-secondary" data-market-macro-custom-reset="${key}">Reset</button>
              </div>
            </div>
          `;
      return `
        <article class="cloud-panel macro-panel ${className}">
          <div class="us-panel-head">
            <div>
              <h3>${isFxPanel ? "FX Relative Strength" : panel.title}</h3>
              <p>${isFxPanel ? "선택한 기준 통화의 비교 통화 대비 강도를 선택 기간 첫 거래일 100으로 표시합니다." : panel.subtitle}</p>
            </div>
            <div class="m7-range-row">
              ${rangeSource
                .map(
                  (range) => `
                    <button
                      type="button"
                      class="m7-range-chip${getMarketMacroRange(key) === range.key ? " active" : ""}"
                      data-market-macro-range="${range.key}"
                      data-market-macro-panel="${key}"
                    >
                      ${range.label}
                    </button>`,
                )
                .join("")}
            </div>
          </div>
          <div class="macro-panel-meta">
            <span>${panel.source ?? ""}</span>
            <span>${isFxPanel ? "Selected period start = 100" : panel.mode === "normalized" ? "Normalized view" : "Raw level"}</span>
          </div>
          ${isFxPanel ? fxPairControls : `<div class="market-macro-series-row">${seriesChips}</div>`}
          ${customDateMarkup}
          <div class="macro-chart-wrap">
            <canvas data-market-macro="${canvas}"></canvas>
          </div>
        </article>
      `;
    })
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>FX & Commodities</h2>
            <p>Select any base and comparison currency for relative-strength tracking, alongside energy, metals, and strategic commodity prices.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${marketUpdatedAt}</div>
          </div>
        </div>
        <div class="macro-panel-grid">
          ${macroPanels}
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-market-macro-range]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroPanel;
      const rangeKey = button.dataset.marketMacroRange || marketMacroData.defaultRange || "max";
      if (!panelKey) {
        return;
      }
      state.marketMacroRanges = {
        ...state.marketMacroRanges,
        [panelKey]: rangeKey,
      };
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start: "", end: "" },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-custom-apply]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroCustomApply;
      if (!panelKey) {
        return;
      }
      const startInput = usOverviewRoot.querySelector(`[data-market-macro-custom-start="${panelKey}"]`);
      const endInput = usOverviewRoot.querySelector(`[data-market-macro-custom-end="${panelKey}"]`);
      const start = startInput?.value || "";
      const end = endInput?.value || "";
      if (start && end && start > end) {
        return;
      }
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start, end },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-custom-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroCustomReset;
      if (!panelKey) {
        return;
      }
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start: "", end: "" },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroPanel;
      const seriesKey = button.dataset.marketMacroSeries;
      if (!panelKey || !seriesKey) {
        return;
      }
      const selected = new Set(getMarketMacroSelection(panelKey));
      if (selected.has(seriesKey)) {
        if (selected.size <= 1) {
          return;
        }
        selected.delete(seriesKey);
      } else {
        selected.add(seriesKey);
      }
      state.marketMacroSelections = {
        ...state.marketMacroSelections,
        [panelKey]: [...selected],
      };
      render();
    });
  });

  const fxBaseSelect = usOverviewRoot.querySelector("[data-fx-base-currency]");
  const fxQuoteSelect = usOverviewRoot.querySelector("[data-fx-quote-currency]");
  if (fxBaseSelect) {
    fxBaseSelect.addEventListener("change", () => {
      const nextCurrency = fxBaseSelect.value;
      if (nextCurrency === state.fxQuoteCurrency) {
        state.fxQuoteCurrency = state.fxBaseCurrency;
      }
      state.fxBaseCurrency = nextCurrency;
      render();
    });
  }
  if (fxQuoteSelect) {
    fxQuoteSelect.addEventListener("change", () => {
      const nextCurrency = fxQuoteSelect.value;
      if (nextCurrency === state.fxBaseCurrency) {
        state.fxBaseCurrency = state.fxQuoteCurrency;
      }
      state.fxQuoteCurrency = nextCurrency;
      render();
    });
  }

  ["fx_dashboard", "energy", "natural_gas", "metals", "strategic", "food"].forEach((panelKey) => {
    const canvas = usOverviewRoot.querySelector(`[data-market-macro="${panelKey}"]`);
    if (canvas) {
      createMarketMacroChart(canvas, panelKey, getMarketMacroRange(panelKey));
    }
  });
}

function bindMarketMacroPanelControls(panelKeys) {
  usOverviewRoot.querySelectorAll("[data-market-macro-range]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroPanel;
      const rangeKey = button.dataset.marketMacroRange || marketMacroData.defaultRange || "max";
      if (!panelKey) {
        return;
      }
      state.marketMacroRanges = {
        ...state.marketMacroRanges,
        [panelKey]: rangeKey,
      };
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start: "", end: "" },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-custom-apply]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroCustomApply;
      if (!panelKey) {
        return;
      }
      const startInput = usOverviewRoot.querySelector(`[data-market-macro-custom-start="${panelKey}"]`);
      const endInput = usOverviewRoot.querySelector(`[data-market-macro-custom-end="${panelKey}"]`);
      const start = startInput?.value || "";
      const end = endInput?.value || "";
      if (start && end && start > end) {
        return;
      }
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start, end },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-custom-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroCustomReset;
      if (!panelKey) {
        return;
      }
      state.marketMacroCustomRanges = {
        ...state.marketMacroCustomRanges,
        [panelKey]: { start: "", end: "" },
      };
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-macro-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const panelKey = button.dataset.marketMacroPanel;
      const seriesKey = button.dataset.marketMacroSeries;
      if (!panelKey || !seriesKey) {
        return;
      }
      const selected = new Set(getMarketMacroSelection(panelKey));
      if (selected.has(seriesKey)) {
        if (selected.size <= 1) {
          return;
        }
        selected.delete(seriesKey);
      } else {
        selected.add(seriesKey);
      }
      state.marketMacroSelections = {
        ...state.marketMacroSelections,
        [panelKey]: [...selected],
      };
      render();
    });
  });

  panelKeys.forEach((panelKey) => {
    const canvas = usOverviewRoot.querySelector(`[data-market-macro="${panelKey}"]`);
    if (canvas) {
      createMarketMacroChart(canvas, panelKey, getMarketMacroRange(panelKey));
    }
  });
}

function renderMarketLiquidityOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const rangeSource = (marketMacroData.ranges ?? []).length ? marketMacroData.ranges : marketPriceData.ranges ?? [];
  const marketUpdatedAt = marketMacroData.updatedAt || marketPriceData.updatedAt || "-";
  const panelKeys = ["liquidity_global_m2", "liquidity_net", "liquidity_tga", "liquidity_sofr_iorb", "liquidity_policy_2y"];
  const liquidityPanels = [
    { key: "liquidity_global_m2", canvas: "liquidity_global_m2", className: "macro-panel-wide" },
    { key: "liquidity_net", canvas: "liquidity_net", className: "" },
    { key: "liquidity_tga", canvas: "liquidity_tga", className: "" },
    { key: "liquidity_sofr_iorb", canvas: "liquidity_sofr_iorb", className: "" },
    { key: "liquidity_policy_2y", canvas: "liquidity_policy_2y", className: "" },
  ]
    .map((panelConfig) => buildMarketMacroPanelCard(panelConfig, rangeSource))
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Liquidity Dashboard</h2>
            <p>Bloomberg-style Global M2 proxy first, followed by Fed net liquidity, Treasury cash balance, reserve-market spread, and Fed policy versus US 2Y.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${marketUpdatedAt}</div>
          </div>
        </div>
        <div class="macro-panel-grid">
          ${liquidityPanels}
        </div>
      </section>
    </section>
  `;

  bindMarketMacroPanelControls(panelKeys);
}

function renderMarketValuationOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const bounds = getMarketValuationBounds();
  const selected = new Set(getMarketValuationSelection());
  const rangeMarkup = (marketValuationData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketValuationRange === range.key ? " active" : ""}"
          data-market-valuation-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  const seriesMarkup = Object.entries(marketValuationData?.series ?? {})
    .map(
      ([key, item]) => `
        <button
          type="button"
          class="total-series-chip${selected.has(key) ? " active" : ""}"
          data-market-valuation-series="${key}"
        >
          <span class="total-series-dot" style="background:${item.color}"></span>
          ${item.label}
        </button>`,
    )
    .join("");
  const snapshotMarkup = Object.entries(marketValuationData?.series ?? {})
    .map(([key, item]) => {
      const lastIndex = (item.values ?? []).findLastIndex((value) => Number.isFinite(Number(value)));
      const latestValue = lastIndex >= 0 ? Number(item.values[lastIndex]) : null;
      const latestDate = lastIndex >= 0 ? item.dates?.[lastIndex] : "";
      return `
        <article class="vix-snapshot-card">
          <span class="vix-snapshot-label">${item.label}</span>
          <strong class="vix-snapshot-value">${formatValuationValue(latestValue, item.formatter)}</strong>
          <span class="vix-snapshot-date">${latestDate || "-"}</span>
        </article>`;
    })
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Valuation Dashboard</h2>
            <p>Shiller CAPE는 현재 S&amp;P 500 가격을 최근 10년 평균 실질 이익으로 나눈 장기 밸류에이션 지표입니다. 경기 사이클에 따른 이익 급등락을 완화해 시장이 장기 이익 대비 비싼지 싼지 확인할 때 씁니다.</p>
            <p>공식 Shiller CAPE는 월간 데이터입니다. Daily CAPE Proxy는 최신 월간 CAPE 기준에 S&amp;P 500 일간 종가 변화를 반영한 추정치이며, 공식 일간 Shiller 데이터는 아닙니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${rangeMarkup}</div>
            <div class="us-price-updated">Updated ${marketValuationData.updatedAt || "-"}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-market-valuation-start
              min="${bounds.min}"
              max="${bounds.max}"
              value="${state.marketValuationCustomStart || ""}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-market-valuation-end
              min="${bounds.min}"
              max="${bounds.max}"
              value="${state.marketValuationCustomEnd || ""}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-market-valuation-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-market-valuation-reset>Reset</button>
          </div>
        </div>
        <div class="total-series-row">
          ${seriesMarkup}
        </div>
        <div class="vix-snapshot-grid">
          ${snapshotMarkup}
        </div>
        <div class="market-trend-meta">
          <span>Source: ${marketValuationData.source?.name ?? "Shiller data"}</span>
          <span>${marketValuationData.source?.frequency ?? "Monthly"} data</span>
          <span>Daily CAPE Proxy = S&amp;P 500 일간 종가 기반 추정치</span>
        </div>
        <div class="us-price-chart-wrap">
          <canvas data-market-valuation="overview"></canvas>
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-market-valuation-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketValuationRange = button.dataset.marketValuationRange || marketValuationData.defaultRange || "max";
      state.marketValuationCustomStart = "";
      state.marketValuationCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelector("[data-market-valuation-apply]")?.addEventListener("click", () => {
    const start = usOverviewRoot.querySelector("[data-market-valuation-start]")?.value || "";
    const end = usOverviewRoot.querySelector("[data-market-valuation-end]")?.value || "";
    if (start && end && start > end) {
      return;
    }
    state.marketValuationCustomStart = start;
    state.marketValuationCustomEnd = end;
    render();
  });

  usOverviewRoot.querySelector("[data-market-valuation-reset]")?.addEventListener("click", () => {
    state.marketValuationCustomStart = "";
    state.marketValuationCustomEnd = "";
    render();
  });

  usOverviewRoot.querySelectorAll("[data-market-valuation-series]").forEach((button) => {
    button.addEventListener("click", () => {
      const seriesKey = button.dataset.marketValuationSeries;
      if (!seriesKey) {
        return;
      }
      const next = new Set(getMarketValuationSelection());
      if (next.has(seriesKey)) {
        if (next.size <= 1) {
          return;
        }
        next.delete(seriesKey);
      } else {
        next.add(seriesKey);
      }
      state.marketValuationSelection = [...next];
      render();
    });
  });

  const canvas = usOverviewRoot.querySelector("[data-market-valuation='overview']");
  if (canvas) {
    createMarketValuationChart(canvas, state.marketValuationRange);
  }
}

function renderMarketVixOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const vixUpdatedAt = getMarketVixUpdatedAt();
  const familyBounds = getMarketVixBounds("family");
  const metricsBounds = getMarketVixBounds("metrics");
  const fixedIncomeBounds = getMarketVixBounds("fixedIncome");
  const metricsRangeMarkup = (marketVixData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketVixMetricsRange === range.key ? " active" : ""}"
          data-market-vix-metrics-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  const familyRangeMarkup = (marketVixData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketVixFamilyRange === range.key ? " active" : ""}"
          data-market-vix-family-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  const fixedIncomeRangeMarkup = (marketVixData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.marketVixFixedIncomeRange === range.key ? " active" : ""}"
          data-market-vix-fixed-income-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");

  const snapshotMarkup = (marketVixData.snapshots ?? [])
    .map((item) => {
      if (item.key === "term-regime") {
        return `
          <article class="vix-snapshot-card vix-regime-card">
            <span class="vix-snapshot-label">${item.label}</span>
            <strong class="vix-snapshot-value">${item.value ?? "-"}</strong>
            <span class="vix-snapshot-note">M1 vs Spot ${formatVixPercent(item.change)} | M2 vs M1 ${formatVixPercent(item.changePct)}</span>
            <span class="vix-snapshot-date">${item.date || "-"}</span>
          </article>
        `;
      }
      const deltaClass = Number(item.changePct) >= 0 ? "positive" : "negative";
      return `
        <article class="vix-snapshot-card">
          <span class="vix-snapshot-label">${item.label}</span>
          <strong class="vix-snapshot-value">${formatVixLevel(item.value)}</strong>
          <span class="vix-snapshot-change ${deltaClass}">${formatVixPercent(item.changePct)}</span>
          <span class="vix-snapshot-date">${item.date || "-"}</span>
        </article>
      `;
    })
    .join("");

  const latestContractsMarkup = ((marketVixData.curve?.latestContracts ?? []) || [])
    .map(
      (contract) => `
        <article class="vix-contract-row">
          <div class="vix-contract-id">
            <strong>${contract.label || "-"}</strong>
            <span>${contract.symbol || "-"}</span>
          </div>
          <span class="vix-contract-expiry">${contract.expiration || "-"}</span>
          <strong class="vix-contract-price">${formatVixLevel(contract.price)}</strong>
        </article>
      `,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="market-overview">
      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>VIX Dashboard</h2>
            <p>2018-01-01 이후 안정적으로 수집 가능한 VIX family history와 최신 CBOE settlement curve만 반영했습니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Updated ${vixUpdatedAt}</div>
          </div>
        </div>
        <div class="vix-snapshot-grid">
          ${snapshotMarkup}
        </div>
      </section>

      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>VIX Futures Term Structure</h2>
            <p>Front monthly VX settlement curve with previous trading day overlay.</p>
          </div>
          <div class="us-price-controls">
            <div class="us-price-updated">Curve ${marketVixData.curve?.latestDate || "-"}</div>
          </div>
        </div>
        <div class="vix-curve-layout">
          <div class="us-price-chart-wrap">
            <canvas data-market-vix="curve"></canvas>
          </div>
          <aside class="vix-contract-panel">
            <div class="vix-contract-panel-head">
              <div>
                <strong>Latest Settlements</strong>
                <span>VX monthly futures</span>
              </div>
              <span>${marketVixData.curve?.latestDate || "-"}</span>
            </div>
            <div class="vix-contract-list">
              ${latestContractsMarkup || '<div class="vix-contract-empty">No curve data</div>'}
            </div>
          </aside>
        </div>
      </section>

      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Term Structure Metrics</h2>
            <p>누적된 curve history 안에서만 spot, M1, M2와 premium 흐름을 보여줍니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${metricsRangeMarkup}</div>
            <div class="us-price-updated">${marketVixData.source?.futures ?? ""}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-vix-metrics-start
              min="${metricsBounds.min}"
              max="${metricsBounds.max}"
              value="${state.marketVixMetricsCustomStart || ""}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-vix-metrics-end
              min="${metricsBounds.min}"
              max="${metricsBounds.max}"
              value="${state.marketVixMetricsCustomEnd || ""}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-vix-metrics-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-vix-metrics-reset>Reset</button>
          </div>
        </div>
        <div class="us-price-chart-wrap">
          <canvas data-market-vix="metrics"></canvas>
        </div>
      </section>

      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>Bond Volatility & Credit Spread</h2>
            <p>채권 변동성 MOVE Index와 High Yield Spread를 기존 VIX history와 같은 기간 선택 방식으로 표시합니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${fixedIncomeRangeMarkup}</div>
            <div class="us-price-updated">${marketVixData.source?.fixedIncome ?? ""}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-vix-fixed-income-start
              min="${fixedIncomeBounds.min}"
              max="${fixedIncomeBounds.max}"
              value="${state.marketVixFixedIncomeCustomStart || ""}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-vix-fixed-income-end
              min="${fixedIncomeBounds.min}"
              max="${fixedIncomeBounds.max}"
              value="${state.marketVixFixedIncomeCustomEnd || ""}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-vix-fixed-income-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-vix-fixed-income-reset>Reset</button>
          </div>
        </div>
        <div class="vix-fixed-income-grid">
          <div class="us-price-chart-wrap">
            <canvas data-market-vix="move"></canvas>
          </div>
          <div class="us-price-chart-wrap">
            <canvas data-market-vix="hy-spread"></canvas>
          </div>
        </div>
      </section>

      <section class="us-panel us-price-panel">
        <div class="us-section-head us-price-head">
          <div>
            <h2>VIX Family History</h2>
            <p>2018-01-01 이후 수집 가능한 VIX spot 및 term index history입니다.</p>
          </div>
          <div class="us-price-controls">
            <div class="m7-range-row">${familyRangeMarkup}</div>
            <div class="us-price-updated">${marketVixData.source?.family ?? ""}</div>
          </div>
        </div>
        <div class="total-date-row">
          <label class="total-date-field">
            <span>Start</span>
            <input
              type="date"
              data-vix-family-start
              min="${familyBounds.min}"
              max="${familyBounds.max}"
              value="${state.marketVixFamilyCustomStart || ""}"
            />
          </label>
          <label class="total-date-field">
            <span>End</span>
            <input
              type="date"
              data-vix-family-end
              min="${familyBounds.min}"
              max="${familyBounds.max}"
              value="${state.marketVixFamilyCustomEnd || ""}"
            />
          </label>
          <div class="total-date-actions">
            <button type="button" class="total-date-button" data-vix-family-apply>Apply</button>
            <button type="button" class="total-date-button total-date-button-secondary" data-vix-family-reset>Reset</button>
          </div>
        </div>
        <div class="us-price-chart-wrap">
          <canvas data-market-vix="family"></canvas>
        </div>
      </section>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-market-vix-metrics-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketVixMetricsRange = button.dataset.marketVixMetricsRange || marketVixData.defaultRange || "3y";
      state.marketVixMetricsCustomStart = "";
      state.marketVixMetricsCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-vix-family-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketVixFamilyRange = button.dataset.marketVixFamilyRange || marketVixData.defaultRange || "3y";
      state.marketVixFamilyCustomStart = "";
      state.marketVixFamilyCustomEnd = "";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-market-vix-fixed-income-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.marketVixFixedIncomeRange = button.dataset.marketVixFixedIncomeRange || marketVixData.defaultRange || "3y";
      state.marketVixFixedIncomeCustomStart = "";
      state.marketVixFixedIncomeCustomEnd = "";
      render();
    });
  });

  const vixMetricsStartInput = usOverviewRoot.querySelector("[data-vix-metrics-start]");
  const vixMetricsEndInput = usOverviewRoot.querySelector("[data-vix-metrics-end]");
  const vixMetricsApplyButton = usOverviewRoot.querySelector("[data-vix-metrics-apply]");
  const vixMetricsResetButton = usOverviewRoot.querySelector("[data-vix-metrics-reset]");
  const vixFixedIncomeStartInput = usOverviewRoot.querySelector("[data-vix-fixed-income-start]");
  const vixFixedIncomeEndInput = usOverviewRoot.querySelector("[data-vix-fixed-income-end]");
  const vixFixedIncomeApplyButton = usOverviewRoot.querySelector("[data-vix-fixed-income-apply]");
  const vixFixedIncomeResetButton = usOverviewRoot.querySelector("[data-vix-fixed-income-reset]");
  const vixFamilyStartInput = usOverviewRoot.querySelector("[data-vix-family-start]");
  const vixFamilyEndInput = usOverviewRoot.querySelector("[data-vix-family-end]");
  const vixFamilyApplyButton = usOverviewRoot.querySelector("[data-vix-family-apply]");
  const vixFamilyResetButton = usOverviewRoot.querySelector("[data-vix-family-reset]");

  if (vixMetricsApplyButton && vixMetricsStartInput && vixMetricsEndInput) {
    vixMetricsApplyButton.addEventListener("click", () => {
      const startValue = vixMetricsStartInput.value || "";
      const endValue = vixMetricsEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.marketVixMetricsCustomStart = startValue;
      state.marketVixMetricsCustomEnd = endValue;
      render();
    });
  }

  if (vixMetricsResetButton) {
    vixMetricsResetButton.addEventListener("click", () => {
      state.marketVixMetricsCustomStart = "";
      state.marketVixMetricsCustomEnd = "";
      render();
    });
  }

  if (vixFixedIncomeApplyButton && vixFixedIncomeStartInput && vixFixedIncomeEndInput) {
    vixFixedIncomeApplyButton.addEventListener("click", () => {
      const startValue = vixFixedIncomeStartInput.value || "";
      const endValue = vixFixedIncomeEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.marketVixFixedIncomeCustomStart = startValue;
      state.marketVixFixedIncomeCustomEnd = endValue;
      render();
    });
  }

  if (vixFixedIncomeResetButton) {
    vixFixedIncomeResetButton.addEventListener("click", () => {
      state.marketVixFixedIncomeCustomStart = "";
      state.marketVixFixedIncomeCustomEnd = "";
      render();
    });
  }

  if (vixFamilyApplyButton && vixFamilyStartInput && vixFamilyEndInput) {
    vixFamilyApplyButton.addEventListener("click", () => {
      const startValue = vixFamilyStartInput.value || "";
      const endValue = vixFamilyEndInput.value || "";
      if (startValue && endValue && startValue > endValue) {
        return;
      }
      state.marketVixFamilyCustomStart = startValue;
      state.marketVixFamilyCustomEnd = endValue;
      render();
    });
  }

  if (vixFamilyResetButton) {
    vixFamilyResetButton.addEventListener("click", () => {
      state.marketVixFamilyCustomStart = "";
      state.marketVixFamilyCustomEnd = "";
      render();
    });
  }

  const curveCanvas = usOverviewRoot.querySelector('[data-market-vix="curve"]');
  if (curveCanvas) {
    createMarketVixCurveChart(curveCanvas);
  }

  const metricsCanvas = usOverviewRoot.querySelector('[data-market-vix="metrics"]');
  if (metricsCanvas) {
    createMarketVixMetricsChart(metricsCanvas, state.marketVixMetricsRange);
  }

  const moveCanvas = usOverviewRoot.querySelector('[data-market-vix="move"]');
  if (moveCanvas) {
    createMarketVixFixedIncomeChart(moveCanvas, "move", state.marketVixFixedIncomeRange);
  }

  const hySpreadCanvas = usOverviewRoot.querySelector('[data-market-vix="hy-spread"]');
  if (hySpreadCanvas) {
    createMarketVixFixedIncomeChart(hySpreadCanvas, "hySpread", state.marketVixFixedIncomeRange);
  }

  const familyCanvas = usOverviewRoot.querySelector('[data-market-vix="family"]');
  if (familyCanvas) {
    createMarketVixFamilyChart(familyCanvas, state.marketVixFamilyRange);
  }
}

function getUsMarginAdjustment(company, quarter) {
  return (company.marginAdjustments ?? []).find((adjustment) => adjustment.quarter === quarter) ?? null;
}

function buildUsAdjustedMarginSeries(company) {
  return (company.opm ?? []).map((value, index) => {
    if (!Number.isFinite(value)) {
      return null;
    }
    const adjustment = getUsMarginAdjustment(company, company.labels?.[index]);
    if (!adjustment || !Number.isFinite(adjustment.reportedImpactPp)) {
      return value;
    }
    return Number((value - adjustment.reportedImpactPp).toFixed(1));
  });
}

function buildUsMarginAdjustmentNote(company) {
  const adjustments = company.marginAdjustments ?? [];
  if (!adjustments.length) {
    return "";
  }

  const marginLabel = company.marginLabel ?? "OPM";
  const rows = adjustments
    .map((adjustment) => {
      const index = company.labels?.indexOf(adjustment.quarter) ?? -1;
      const reported = index >= 0 ? company.opm?.[index] : null;
      const adjusted = Number.isFinite(reported) && Number.isFinite(adjustment.reportedImpactPp)
        ? Number((reported - adjustment.reportedImpactPp).toFixed(1))
        : null;
      const displayQuarter = index >= 0
        ? getCompanyDisplayQuarterLabels({ ...company, labels: [adjustment.quarter] })[0]
        : adjustment.quarter;
      const values = Number.isFinite(reported) && Number.isFinite(adjusted)
        ? `${reported.toFixed(1)}% -> ${adjusted.toFixed(1)}%`
        : "";

      return `
        <div class="us-margin-adjustment-row">
          <span><strong>${escapeHtml(displayQuarter)} ${escapeHtml(marginLabel)}</strong> ${escapeHtml(values)} · ${escapeHtml(adjustment.label)}</span>
          <a href="${escapeHtml(adjustment.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(adjustment.sourceLabel ?? "Source")}</a>
        </div>`;
    })
    .join("");

  return `
    <div class="us-margin-adjustment-note">
      <span class="us-margin-adjustment-kicker">Adjusted margin bridge</span>
      ${rows}
    </div>`;
}

function createUsMarginChart(canvas, company) {
  if (typeof Chart === "undefined") {
    return;
  }

  const marginLabel = company.marginLabel ?? "OPM";
  const adjustedMargin = buildUsAdjustedMarginSeries(company);
  const hasAdjustments = (company.marginAdjustments ?? []).length > 0;
  const datasets = [
    {
      label: hasAdjustments ? `Adjusted ${marginLabel}` : `Reported ${marginLabel}`,
      data: adjustedMargin,
      borderColor: "#2563eb",
      backgroundColor: "#2563eb",
      borderWidth: 2.2,
      tension: 0.25,
      pointRadius: hasAdjustments ? 1.6 : 0,
      pointHoverRadius: 4,
    },
  ];

  if (hasAdjustments) {
    datasets.push({
      label: `Reported ${marginLabel}`,
      data: company.opm,
      borderColor: "#8d8d86",
      backgroundColor: "#8d8d86",
      borderWidth: 1.6,
      borderDash: [5, 4],
      tension: 0.25,
      pointRadius: 0,
      pointHoverRadius: 4,
    });
  }

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: company.displayLabels ?? company.labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            afterBody: (items) => {
              const index = items?.[0]?.dataIndex;
              const adjustment = Number.isInteger(index)
                ? getUsMarginAdjustment(company, company.labels?.[index])
                : null;
              if (!adjustment) {
                return "";
              }
              const impact = adjustment.reportedImpactPp > 0
                ? `+${adjustment.reportedImpactPp.toFixed(1)}pp in reported margin`
                : `${adjustment.reportedImpactPp.toFixed(1)}pp in reported margin`;
              return [`${adjustment.label}: ${impact}`, adjustment.detail];
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#8d8d86" },
          border: { color: "#d8d8d2" },
        },
        y: {
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}%`,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function formatUsBillions(value) {
  return Number.isFinite(value) ? `$${value.toFixed(1)}B` : "-";
}

function formatUsPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : "-";
}

function buildUsSegmentHistoryMap(segment, company, quarterLabels) {
  const historyMap = new Map();

  if (Array.isArray(segment.history)) {
    segment.history.forEach((entry) => {
      historyMap.set(entry.quarter, {
        revenue: Number.isFinite(entry.revenue) ? entry.revenue : null,
        yoy: Number.isFinite(entry.yoy) ? entry.yoy : null,
        opm: Number.isFinite(entry.opm) ? entry.opm : null,
      });
      });

    const allQuarterLabels = Array.isArray(company?.labels) ? company.labels : quarterLabels;
    quarterLabels.forEach((label) => {
      if (!historyMap.has(label)) {
        historyMap.set(label, { revenue: null, yoy: null, opm: null });
      }
      const point = historyMap.get(label);
      if (!Number.isFinite(point?.yoy)) {
        const labelIndex = allQuarterLabels.indexOf(label);
        if (labelIndex >= 4) {
          const priorLabel = allQuarterLabels[labelIndex - 4];
          const priorPoint = historyMap.get(priorLabel);
          if (Number.isFinite(point?.revenue) && Number.isFinite(priorPoint?.revenue) && priorPoint.revenue !== 0) {
            point.yoy = Number((((point.revenue - priorPoint.revenue) / priorPoint.revenue) * 100).toFixed(1));
          }
        }
      }
    });
    return historyMap;
  }

  quarterLabels.forEach((label) => {
    historyMap.set(label, { revenue: null, yoy: null, opm: null });
  });

  const latestLabel = quarterLabels[quarterLabels.length - 1];
  const priorYearLabel = quarterLabels[quarterLabels.length - 5];
  const latestYoy = Number.isFinite(segment.latestRevenue) && Number.isFinite(segment.priorRevenue) && segment.priorRevenue !== 0
    ? Number((((segment.latestRevenue - segment.priorRevenue) / segment.priorRevenue) * 100).toFixed(1))
    : null;

  if (priorYearLabel && historyMap.has(priorYearLabel)) {
    historyMap.set(priorYearLabel, {
      revenue: Number.isFinite(segment.priorRevenue) ? segment.priorRevenue : null,
      yoy: null,
      opm: null,
    });
  }

  if (latestLabel && historyMap.has(latestLabel)) {
    historyMap.set(latestLabel, {
      revenue: Number.isFinite(segment.latestRevenue) ? segment.latestRevenue : null,
      yoy: latestYoy,
      opm: Number.isFinite(segment.opm) ? segment.opm : null,
    });
  }

  return historyMap;
}

function buildUsSegmentTable(company) {
  const marginLabel = company.segmentMarginLabel ?? company.marginLabel ?? "OPM";
  const recentQuarterLabels = (company.labels ?? []).slice(-8).reverse();
  const displayQuarterLabels = getCompanyDisplayQuarterLabels(company, 8).reverse();

  const superHead = displayQuarterLabels
    .map((label) => `<span class="us-quarter-group">${label}</span>`)
    .join("");

  const subHead = recentQuarterLabels
    .map(() => `<span>Rev</span><span>YoY</span><span>${marginLabel}</span>`)
    .join("");

  const rows = company.segments
    .map((segment) => {
      const historyMap = buildUsSegmentHistoryMap(segment, company, recentQuarterLabels);
      const metrics = recentQuarterLabels
        .map((label) => {
          const point = historyMap.get(label) ?? { revenue: null, yoy: null, opm: null };
          const yoyClass = Number.isFinite(point.yoy)
            ? point.yoy > 0
              ? "is-positive"
              : point.yoy < 0
                ? "is-negative"
                : ""
            : "";
          const opmClass = Number.isFinite(point.opm)
            ? point.opm > 0
              ? "is-positive"
              : point.opm < 0
                ? "is-negative"
                : ""
            : "";

          return `
            <span>${formatUsBillions(point.revenue)}</span>
            <span class="${yoyClass}">${formatUsPercent(point.yoy)}</span>
            <span class="us-opm-value">${formatUsPercent(point.opm)}</span>`;
        })
        .join("");

      return `
        <div class="us-segment-row us-segment-grid">
          <span class="us-segment-name">${segment.name}</span>
          ${metrics}
        </div>`;
    })
    .join("");

  return `
    <div class="us-segment-block">
      <div class="us-segment-title">Segment 8Q Snapshot</div>
      <div class="us-segment-scroll">
        <div class="us-segment-table">
          <div class="us-segment-superhead us-segment-grid">
            <span class="us-sticky-cell">Segment</span>
            ${superHead}
          </div>
          <div class="us-segment-head us-segment-grid">
            <span class="us-sticky-cell">Metric</span>
            ${subHead}
          </div>
          ${rows}
        </div>
      </div>
      <p class="us-segment-note">${marginLabel} is shown only when a company officially discloses the relevant segment margin or segment profit detail. If not disclosed, it remains N/A.</p>
    </div>
  `;
}

function renderUSOverview() {
  usOverviewRoot.classList.remove("hidden");
  companyGrid.innerHTML = "";
  companyGrid.classList.add("hidden");

  const m7Markup = usOverviewData.m7Quarterly
    .map(
      (company) => `
        <article class="us-mini-card">
          <div class="us-panel-head">
            <div>
              <h3>${company.name}</h3>
              <p>Last 12 fiscal quarters. Margin is adjusted only for separately quantified non-recurring operating items.</p>
            </div>
          </div>
          <div class="us-mini-chart-wrap">
            <canvas data-us-quarterly="${company.name}"></canvas>
          </div>
          <div class="us-mini-chart-wrap us-mini-chart-wrap-secondary">
            <canvas data-us-margin="${company.name}"></canvas>
          </div>
          ${buildUsMarginAdjustmentNote(company)}
          ${buildUsSegmentTable(company)}
        </article>`,
    )
    .join("");

  const rangeMarkup = (m7PriceData.ranges ?? [])
    .map(
      (range) => `
        <button
          type="button"
          class="m7-range-chip${state.m7PriceRange === range.key ? " active" : ""}"
          data-m7-range="${range.key}"
        >
          ${range.label}
        </button>`,
    )
    .join("");
  const isMarketCapMode = state.m7PriceMode === "marketCap";
  const modeMarkup = [
    { key: "relative", label: "Relative Performance" },
    { key: "marketCap", label: "Market Cap" },
  ]
    .map(
      (mode) => `
        <button
          type="button"
          class="m7-mode-chip${state.m7PriceMode === mode.key ? " active" : ""}"
          data-m7-mode="${mode.key}"
          aria-pressed="${state.m7PriceMode === mode.key ? "true" : "false"}"
        >
          ${mode.label}
        </button>`,
    )
    .join("");

  usOverviewRoot.innerHTML = `
    <section class="us-panel us-price-panel">
      <div class="us-section-head us-price-head">
        <div>
          <h2>${isMarketCapMode ? "M7 Market Capitalization" : "M7 Relative Performance"}</h2>
          <p>${
            isMarketCapMode
              ? `Daily market capitalization based on close and historical shares outstanding. Max begins ${m7PriceData.startDate ?? "2017-01-01"}.`
              : `Daily close normalized to 100 at the selected start date. YTD uses the final valid close of the prior calendar year. Max begins ${m7PriceData.startDate ?? "2017-01-01"}.`
          }</p>
        </div>
        <div class="us-price-controls">
          <div class="m7-mode-row" role="group" aria-label="M7 chart mode">${modeMarkup}</div>
          <div class="m7-range-row">${rangeMarkup}</div>
          <div class="us-price-updated">Updated ${m7PriceData.updatedAt || "-"}</div>
        </div>
      </div>
      <div class="us-price-chart-wrap">
        <canvas data-m7-chart="performance"></canvas>
      </div>
    </section>
    <section class="us-m7-section">
      <div class="us-section-head">
        <div>
          <h2>M7 Quarterly Earnings</h2>
          <p>${escapeHtml(usOverviewData.marginAdjustmentPolicy ?? "Reported margins are preserved; adjusted margins appear only where a separately quantified non-recurring operating item is disclosed.")}</p>
        </div>
      </div>
      <div class="us-mini-grid">${m7Markup}</div>
    </section>
  `;

  usOverviewRoot.querySelectorAll("[data-m7-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.m7PriceRange = button.dataset.m7Range || m7PriceData.defaultRange || "max";
      render();
    });
  });

  usOverviewRoot.querySelectorAll("[data-m7-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.m7PriceMode = button.dataset.m7Mode === "marketCap" ? "marketCap" : "relative";
      render();
    });
  });

  const m7Canvas = usOverviewRoot.querySelector('[data-m7-chart="performance"]');
  if (m7Canvas) {
    if (isMarketCapMode) {
      createM7MarketCapChart(m7Canvas, state.m7PriceRange);
    } else {
      createM7RelativeChart(m7Canvas, state.m7PriceRange);
    }
  }

  usOverviewData.m7Quarterly.forEach((company) => {
    const canvas = usOverviewRoot.querySelector(`[data-us-quarterly="${company.name}"]`);
    const latestTwelveLabels = (company.labels ?? []).slice(-12);
    const displayLabels = getCompanyDisplayQuarterLabels(company, 12);
    const chartCompany = {
      ...company,
      labels: latestTwelveLabels,
      displayLabels,
      revenue: (company.revenue ?? []).slice(-12),
      revenueYoy: (company.revenueYoy ?? []).slice(-12),
      opm: (company.opm ?? []).slice(-12),
      marginAdjustments: (company.marginAdjustments ?? []).filter((adjustment) => latestTwelveLabels.includes(adjustment.quarter)),
    };
    if (canvas) {
      createUsQuarterlyChart(canvas, chartCompany);
    }
    const marginCanvas = usOverviewRoot.querySelector(`[data-us-margin="${company.name}"]`);
    if (marginCanvas) {
      createUsMarginChart(marginCanvas, chartCompany);
    }
  });
}

function createRevenueChart(canvas, company) {
  if (typeof Chart === "undefined") {
    return;
  }

  const axisSeries = buildSeriesForAxis(convertRevenueSeries(company, company.bars), company.month);
  const yoySeries = buildSeriesForAxis(company.yoyLine, company.month);
  const momSeries = buildSeriesForAxis(company.momLine, company.month);

  const grayBars = axisSeries.aligned.map((value, index) => {
    if (value === null) {
      return "rgba(0,0,0,0)";
    }
    const lightness = 26 + index * 2;
    return `hsl(0, 0%, ${Math.min(lightness, 48)}%)`;
  });

  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: axisSeries.labels,
      datasets: [
        {
          type: "bar",
          label: "Revenue",
          data: axisSeries.aligned,
          backgroundColor: grayBars,
          borderWidth: 0,
          borderRadius: 3,
          yAxisID: "yRevenue",
          order: 3,
        },
        {
          type: "line",
          label: "YoY%",
          data: yoySeries.aligned,
          borderColor: "#d93025",
          backgroundColor: "#d93025",
          borderWidth: 2.4,
          tension: 0.32,
          pointRadius: 0,
          spanGaps: false,
          yAxisID: "yPercent",
          order: 1,
        },
        {
          type: "line",
          label: "MoM%",
          data: momSeries.aligned,
          borderColor: "#2563eb",
          backgroundColor: "#2563eb",
          borderWidth: 2.4,
          tension: 0.32,
          pointRadius: 0,
          spanGaps: false,
          yAxisID: "yPercent",
          order: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            callback: (value, index) => {
              const label = axisSeries.labels[index];
              if (!label) {
                return "";
              }
              const [, month] = label.split("/");
              return month === "01" ? label : "";
            },
          },
          border: { color: "#d8d8d2" },
          title: {
            display: true,
            text: "Monthly timeline from 2021/01",
            color: "#8d8d86",
          },
        },
        yRevenue: {
          position: "left",
          beginAtZero: true,
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: {
            color: "#8d8d86",
            callback: (value) => revenueTickLabel(value),
            maxTicksLimit: 4,
          },
          border: { color: "#d8d8d2" },
        },
        yPercent: {
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}%`,
            maxTicksLimit: 4,
          },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function createYearlyChart(canvas, company) {
  if (typeof Chart === "undefined") {
    return;
  }

  const yearlyValues = company.yearly.series.flatMap((series) =>
    series.values.filter((value) => value !== null && value !== undefined),
  );
  const minValue = yearlyValues.length ? Math.min(...yearlyValues) : -20;
  const maxValue = yearlyValues.length ? Math.max(...yearlyValues) : 100;
  const yMin = Math.min(-50, Math.floor(minValue / 50) * 50);
  const yMax = Math.max(100, Math.ceil(maxValue / 50) * 50);

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: company.yearly.labels,
      datasets: company.yearly.series.map((series, index) => ({
        label: series.year,
        data: series.values,
        borderColor: yearColors[index % yearColors.length],
        backgroundColor: yearColors[index % yearColors.length],
        borderWidth: index === company.yearly.series.length - 1 ? 2.4 : 2,
        tension: 0.28,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 10,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "center",
          labels: {
            color: "#66665f",
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#8d8d86",
            callback: (value, index) => {
              const label = company.yearly.labels[index];
              return label ? `${Number.parseInt(label, 10)}M` : "";
            },
          },
          border: { color: "#d8d8d2" },
          title: {
            display: true,
            text: "Monthly YoY checkpoints",
            color: "#8d8d86",
          },
        },
        y: {
          min: yMin,
          max: yMax,
          ticks: {
            color: "#8d8d86",
            callback: (value) => `${value}%`,
            maxTicksLimit: 5,
          },
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          border: { color: "#d8d8d2" },
        },
      },
    },
  });

  charts.push(chart);
}

function filteredCompanies() {
  const filtered = companies.filter((company) => {
    const matchesCountry = company.country === "Taiwan";
    const matchesSector = state.sector === "All" ? true : company.sector === state.sector;
    const matchesQuery = company.name.toLowerCase().includes(state.query.toLowerCase().trim());
    return matchesCountry && matchesSector && matchesQuery;
  });

  const sorted = [...filtered];
  if (state.sort === "marketCapDesc") {
    sorted.sort((a, b) => (b.marketCap?.[state.currency] ?? -Infinity) - (a.marketCap?.[state.currency] ?? -Infinity));
  } else if (state.sort === "marketCapAsc") {
    sorted.sort((a, b) => (a.marketCap?.[state.currency] ?? Infinity) - (b.marketCap?.[state.currency] ?? Infinity));
  } else if (state.sort === "nameAsc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

function renderCountries() {
  countrySwitch.innerHTML = "";
  Object.entries(primaryTabMeta).forEach(([tabKey, meta]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `country-button${state.tab === tabKey ? " active" : ""}${meta.className ? ` ${meta.className}` : ""}`;
    button.textContent = meta.label;
    button.addEventListener("click", () => {
      if (tabKey !== "Taiwan") setScreeningContext("us");
      state.tab = tabKey;
      if (tabKey === "Taiwan") {
        state.currency = meta.defaultCurrency;
      } else {
        state.currency = "USD";
      }
      if (tabKey === "Screening") {
        state.screeningView = meta.defaultView;
        state.rsHistoryRange = "1y";
        state.query = "";
        if (searchInput) {
          searchInput.value = "";
        }
      } else if (tabKey === "Market") {
        state.marketView = meta.defaultView;
        state.marketIndexView = "Trend";
      } else if (tabKey === "Tech") {
        state.techView = meta.defaultView;
      } else if (tabKey === "AIData") {
        state.aiDataView = meta.defaultView;
      } else if (tabKey === "Flows") {
        state.flowsView = meta.defaultView;
      } else if (tabKey === "Research") {
        state.researchView = meta.defaultView;
      }
      state.sector = "All";
      render();
    });
    countrySwitch.appendChild(button);
  });
}

function renderSubtabs() {
  subtabSwitch.innerHTML = "";
  let entries = [];
  let activeKey = "";
  let setActive = null;

  if (state.tab === "Taiwan") {
    entries = Object.entries({ Taiwan: { label: "Taiwan" }, HongKongRS: { label: "Hong Kong · RS" }, HongKongTrend: { label: "Hong Kong · 추세스코어" }, ChinaRS: { label: "China · RS" }, ChinaTrend: { label: "China · 추세스코어" } });
    activeKey = state.asiaView;
    setActive = (viewKey) => { state.asiaView = viewKey; };
  } else if (state.tab === "Screening") {
    entries = Object.entries(screeningSubtabMeta);
    activeKey = state.screeningView;
    setActive = (viewKey) => {
      state.screeningView = viewKey;
      if (viewKey === "RS") state.rsHistoryRange = "1y";
      state.query = "";
      if (searchInput) searchInput.value = "";
    };
  } else if (state.tab === "Market") {
    entries = Object.entries(marketSubtabMeta);
    activeKey = state.marketView;
    setActive = (viewKey) => {
      state.marketView = viewKey;
      if (viewKey === "Index") state.marketIndexView = "Trend";
    };
  } else if (state.tab === "Tech") {
    entries = Object.entries(techSubtabMeta);
    activeKey = state.techView;
    setActive = (viewKey) => {
      state.techView = viewKey;
    };
  } else if (state.tab === "AIData") {
    entries = Object.entries(aiDataSubtabMeta);
    activeKey = state.aiDataView;
    setActive = (viewKey) => {
      state.aiDataView = viewKey;
    };
  } else if (state.tab === "Flows") {
    entries = Object.entries(flowsSubtabMeta);
    activeKey = state.flowsView;
    setActive = (viewKey) => {
      state.flowsView = viewKey;
    };
  } else if (state.tab === "Research") {
    entries = Object.entries(researchSubtabMeta);
    activeKey = state.researchView;
    setActive = (viewKey) => {
      state.researchView = viewKey;
    };
  } else {
    subtabSwitch.classList.add("hidden");
    return;
  }

  subtabSwitch.classList.remove("hidden");
  subtabSwitch.classList.add("subtab-switch");
  entries.forEach(([viewKey, meta]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `subtab-chip is-${state.tab.toLowerCase()}${activeKey === viewKey ? " active" : ""}`;
    button.textContent = meta.label;
    button.addEventListener("click", () => {
      setActive?.(viewKey);
      render();
    });
    subtabSwitch.appendChild(button);
  });
}

function renderNestedSubtabs() {
  if (!nestedSubtabSwitch || !nestedSubtabRow) {
    return;
  }
  nestedSubtabSwitch.innerHTML = "";
  let entries = [];
  let activeKey = "";
  let setActive = null;

  if (state.tab === "Market" && state.marketView === "Index") {
    entries = Object.entries(marketIndexSubtabMeta);
    activeKey = state.marketIndexView;
    setActive = (viewKey) => {
      state.marketIndexView = viewKey;
    };
  }

  if (!entries.length) {
    nestedSubtabRow.classList.add("hidden");
    return;
  }

  nestedSubtabRow.classList.remove("hidden");
  entries.forEach(([viewKey, meta]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `nested-subtab-chip${activeKey === viewKey ? " active" : ""}`;
    button.textContent = meta.label;
    button.addEventListener("click", () => {
      setActive?.(viewKey);
      render();
    });
    nestedSubtabSwitch.appendChild(button);
  });
}

function renderCurrencies() {
  currencySwitch.innerHTML = "";
  if (state.tab !== "Taiwan" || getAsiaScreeningRegion()) {
    return;
  }
  primaryTabMeta.Taiwan.currencies.forEach((currency) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `currency-button${state.currency === currency ? " active" : ""}`;
    button.textContent = currency === "NTD" ? "NT$" : currency;
    button.addEventListener("click", () => {
      state.currency = currency;
      render();
    });
    currencySwitch.appendChild(button);
  });
}

function renderSectors() {
  sectorChips.innerHTML = "";
  if (state.tab !== "Taiwan" || getAsiaScreeningRegion()) {
    sectorChips.classList.add("hidden");
    return;
  }
  sectorChips.classList.remove("hidden");
  availableSectors().forEach((sector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${state.sector === sector ? " active" : ""}`;
    button.textContent = sector;
    button.addEventListener("click", () => {
      state.sector = sector;
      render();
    });
    sectorChips.appendChild(button);
  });
}

function renderSummary(list) {
  if (state.tab === "Screening") {
    if (state.screeningView === "VIX") {
      summaryText.textContent = "2018-01-01 이후 수집 가능한 VIX family history와 최신 CBOE settlement curve";
    } else if (state.screeningView === "Breadth") {
      summaryText.textContent = "Daily market breadth dashboard workspace";
    } else if (state.screeningView === "RS") {
      summaryText.textContent = "StockEasy-style RS leaderboard with short-term ranks, new-high monitors, and searchable daily trend";
    } else if (state.screeningView === "TrendScore") {
      summaryText.textContent = "NASDAQ100, S&P500, and Russell 2000 trend score rankings with daily rank history";
    } else {
      summaryText.textContent = "CANSLIM coverage, financial trends, and earnings-surprise history across the RS universe";
    }
    return;
  }

  if (state.tab === "Market") {
    if (state.marketView === "Index") {
      summaryText.textContent =
        state.marketIndexView === "Trend"
          ? "Major index trend dashboard with EMA, ATR, drawdown, and rolling MDD"
          : "Price dashboard for major indexes and the cross-asset total dashboard";
      return;
    }
    if (state.marketView === "FxCommodities") {
      summaryText.textContent = "FX & Commodities dashboard for dollar, energy, metals, uranium spot, iron ore, and LNG futures";
      return;
    }
    if (state.marketView === "Liquidity") {
      summaryText.textContent = "Daily liquidity dashboard for Fed net liquidity, TGA balance, SOFR-IORB spread, Fed policy versus US 2Y, and global M2 proxy";
      return;
    }
    if (state.marketView === "Macro") {
      summaryText.textContent = "US monthly macro dashboard with snapshot, coverage, categories, and history";
      return;
    }
    if (state.marketView === "Valuation") {
      summaryText.textContent = "Long-term valuation dashboard using Shiller CAPE and S&P 500 monthly data";
      return;
    }
    return;
  }

  if (state.tab === "Tech") {
    if (state.techView === "Cloud") {
      summaryText.textContent = "Cloud revenue, growth, margin, RPO, ARR, and hyperscaler GPU pricing";
    } else if (state.techView === "LLM") {
      summaryText.textContent = "OpenAI와 Anthropic 프론티어 모델의 매출 런레이트와 도입 추이";
    } else if (state.techView === "BigTech") {
      summaryText.textContent = "Big tech capex & cash flow dashboard";
    } else {
      summaryText.textContent = "데이터센터 전력망 스트레스를 보는 일별 전력 허브 가격 대시보드";
    }
    return;
  }

  if (state.tab === "AIData") {
    if (state.aiDataView === "TokenPrice") {
      summaryText.textContent = "Silicon Data의 시장 지출 가중 LLM token price index";
    } else if (state.aiDataView === "OpenRouter") {
      summaryText.textContent = "OpenRouter AI model rankings, token usage, market share, and leaderboard";
    } else {
      summaryText.textContent = state.aiDataView === "MemorySpot" ? "Memory data dashboard workspace" : "GPU rental price dashboard workspace";
    }
    return;
  }

  if (state.tab === "DailyBriefing") {
    summaryText.textContent = "US daily market briefing with curated heatmap, key headlines, and Korean mover notes";
    return;
  }

  if (state.tab === "Flows") {
    summaryText.textContent =
      state.flowsView === "EtfStatus"
        ? "Issuer-based ETF price and primary-market fund-flow tracking"
        : "DTCC-reported 5Y single-name CDS transaction spreads for major US technology companies";
    return;
  }

  if (state.tab === "Research") {
    if (state.researchView === "DataCenter") {
      summaryText.textContent = "AI data-center deals, power capacity, partners, locations, and construction status";
    } else if (state.researchView === "MemoryCapa") {
      summaryText.textContent = "DRAM, NAND, and HDD capacity roadmap with source-linked expansion milestones";
    } else if (state.researchView === "M7") {
      summaryText.textContent = "Magnificent Seven quarterly fundamentals and relative performance";
    } else if (state.researchView === "TrendSearch") {
      summaryText.textContent = "Google web and YouTube search-interest dashboard with moving averages";
    } else if (state.researchView === "Calendar") {
      summaryText.textContent = "향후 4주 일정 · 미국 현지 발표일 · KST 시각 병기";
    } else {
      summaryText.textContent = "Focused market-cap and cross-market research comparisons";
    }
    return;
  }

  summaryText.textContent = `${primaryTabMeta.Taiwan.label} ${list.length} companies`;

  const avgYoY =
    list.length > 0
      ? (list.reduce((sum, company) => sum + company.yoy, 0) / list.length).toFixed(1)
      : "0.0";
  const avgMoM =
    list.length > 0
      ? (list.reduce((sum, company) => sum + company.mom, 0) / list.length).toFixed(1)
      : "0.0";
  summaryText.textContent = `${primaryTabMeta.Taiwan.label} ${list.length} companies · Avg YoY ${avgYoY}% · Avg MoM ${avgMoM}% · ${currencyMeta[state.currency].label.trim()} · ${state.sector}`;
}

function renderCards(list) {
  destroyCharts();
  companyGrid.innerHTML = "";

  if (list.length === 0) {
    companyGrid.innerHTML = `<div class="empty-state">No companies match the current country, sector, or search filter.</div>`;
    return;
  }

  list.forEach((company) => {
    const fragment = cardTemplate.content.cloneNode(true);
    fragment.querySelector(".company-name").textContent = company.name;
    fragment.querySelector(".revenue-value").textContent = formatMarketCap(company);
    fragment.querySelector(".latest-revenue-value").textContent = formatRevenue(company);

    const momNode = fragment.querySelector(".mom-value");
    momNode.textContent = formatDelta(company.mom);
    if (company.mom < 0) {
      momNode.classList.add("negative");
    }

    const yoyNode = fragment.querySelector(".yoy-value");
    yoyNode.textContent = formatDelta(company.yoy);
    if (company.yoy < 0) {
      yoyNode.classList.add("negative");
    }

    fragment.querySelector(".reporting-month").textContent = company.month;
    const metricCaptions = fragment.querySelectorAll(".metric-caption span");
    if (metricCaptions.length >= 5) {
      metricCaptions[1].textContent = "Market Cap";
      metricCaptions[2].textContent = "Revenue";
      metricCaptions[3].textContent = "MoM";
      metricCaptions[4].textContent = "YoY";
    }
    fragment.querySelector(".sector-pill").textContent = company.sector;
    fragment.querySelector(".chart-panel .axis-caption").textContent = "Monthly revenue and growth trend";
    fragment.querySelector(".trend-panel .axis-caption").textContent = "Compare the same months across years";

    companyGrid.appendChild(fragment);
    const card = companyGrid.lastElementChild;

    try {
      createRevenueChart(card.querySelector(".revenue-chart"), company);
      createYearlyChart(card.querySelector(".yearly-chart"), company);
    } catch (error) {
      card.querySelector(".chart-panel").insertAdjacentHTML(
        "beforeend",
        `<p class="axis-caption">Chart render error</p>`,
      );
      card.querySelector(".trend-panel").insertAdjacentHTML(
        "beforeend",
        `<p class="axis-caption">Chart render error</p>`,
      );
      console.error("Chart render failed:", company.name, error);
    }
  });
}

function createTokenPriceIndexChart(canvas) {
  if (typeof Chart === "undefined" || !canvas) return;
  const history = tokenPriceIndexData.series?.overall ?? [];
  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: history.map((point) => point.date),
      datasets: [
        {
          label: "SDLLMTK",
          data: history.map((point) => Number(point.value)),
          borderColor: "#176b87",
          backgroundColor: "rgba(23, 107, 135, 0.12)",
          borderWidth: 2.6,
          pointRadius: history.length <= 31 ? 3.5 : 0,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.22,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          align: "start",
          labels: { usePointStyle: true, pointStyle: "circle", color: "#52524c", boxWidth: 8 },
        },
        tooltip: {
          callbacks: {
            title: (items) => items[0]?.label ?? "",
            label: (context) => `${context.dataset.label}: $${Number(context.parsed.y).toFixed(4)} / 1M tokens`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#777770", maxRotation: 0, autoSkip: true, maxTicksLimit: 7 },
          border: { color: "#d8d8d2" },
        },
        y: {
          grid: { color: "rgba(70, 70, 66, 0.10)" },
          ticks: { color: "#777770", callback: (value) => `$${Number(value).toFixed(2)}` },
          border: { display: false },
          title: { display: true, text: "USD / 1M tokens", color: "#777770" },
        },
      },
    },
  });
  charts.push(chart);
}

function renderTokenPriceOverview() {
  destroyCharts();
  usOverviewRoot.classList.remove("hidden");
  companyGrid.classList.add("hidden");
  companyGrid.innerHTML = "";

  const latest = tokenPriceIndexData.latest ?? {};
  const overall = latest.overall ?? {};
  const comparison = tokenPriceIndexData.comparison?.values ?? [];
  const comparisonMax = Math.max(...comparison.map((item) => Number(item.value) || 0), 1);
  const comparisonMarkup = comparison
    .map((item) => {
      const value = Number(item.value);
      const width = Math.max(6, (value / comparisonMax) * 100);
      return `
        <div class="token-price-tier-row token-price-tier-${escapeHtml(item.key)}">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.ticker)}</span>
          </div>
          <div class="token-price-tier-bar"><i style="width:${width.toFixed(1)}%"></i></div>
          <strong>$${Number.isFinite(value) ? value.toFixed(2) : "-"}</strong>
          <small>${escapeHtml(tokenPriceIndexData.comparison?.date || "-")} 기준</small>
        </div>`;
    })
    .join("");

  const formatPct = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "-";
    return `${numeric > 0 ? "+" : ""}${numeric.toFixed(2)}%`;
  };
  const dailyChange = Number(latest.dailyChangePct);
  const publicWindowChange = Number(latest.publicWindowChangePct);
  const premium = Number(latest.closedOpenPremium);
  usOverviewRoot.innerHTML = `
    <section class="token-price-page">
      <header class="token-price-hero">
        <div>
          <p>SILICON DATA · SDLLMTK</p>
          <h2>LLM Token Expenditure Index</h2>
          <span>실제 사용·지출 집중도를 반영한 AI 추론 토큰 시장가격</span>
        </div>
        <div class="token-price-source">
          <span>Updated ${escapeHtml(tokenPriceIndexData.updatedAt || "-")}</span>
          <a href="${escapeHtml(tokenPriceIndexData.source?.portalUrl || "https://portal.silicondata.com/token-index-chart")}" target="_blank" rel="noopener noreferrer">Silicon Data 공식값</a>
        </div>
      </header>

      <div class="token-price-kpis">
        <div><span>전체 시장 · SDLLMTK</span><strong>$${Number(overall.value).toFixed(2)}</strong><small>USD / 1M tokens · ${escapeHtml(overall.date || "-")}</small></div>
        <div><span>일간 변화</span><strong class="${dailyChange > 0 ? "is-cost-up" : dailyChange < 0 ? "is-cost-down" : ""}">${formatPct(dailyChange)}</strong><small>공식 직전 관측치 대비</small></div>
        <div><span>공개 구간 변화</span><strong class="${publicWindowChange > 0 ? "is-cost-up" : publicWindowChange < 0 ? "is-cost-down" : ""}">${formatPct(publicWindowChange)}</strong><small>공개 포털 누적 시작점 대비</small></div>
        <div><span>Closed / Open Premium</span><strong>${Number.isFinite(premium) ? `${premium.toFixed(2)}x` : "-"}</strong><small>2026-08 공개 차트 기준</small></div>
      </div>

      <article class="us-panel token-price-chart-panel">
        <div class="token-price-section-head">
          <div><h3>시장 전체 Token Expenditure</h3><p>Silicon Data 공개 포털의 SDLLMTK 공식 일간값을 매일 누적합니다.</p></div>
          <strong>${escapeHtml(tokenPriceIndexData.source?.cadence || "Daily")}</strong>
        </div>
        <div class="token-price-chart"><canvas id="token-price-index-chart"></canvas></div>
      </article>

      <div class="token-price-lower-grid">
        <article class="us-panel token-price-tier-panel">
          <div class="token-price-section-head"><div><h3>시장 구성별 최신 레벨</h3><p>동일 기준일의 전체·Closed·Open 지수를 비교합니다.</p></div><span>$/1M tokens</span></div>
          <div class="token-price-tier-list">${comparisonMarkup}</div>
          <p class="token-price-data-limit">Closed/Open 일간 히스토리는 공개되지 않아 최신 공개 차트 값만 표시합니다.</p>
        </article>
        <article class="us-panel token-price-method-panel">
          <div class="token-price-section-head"><div><h3>산식과 해석</h3><p>정가 평균이 아니라 시장 사용과 지출이 반영된 지수</p></div></div>
          <dl>
            <div><dt>가중 방식</dt><dd>${escapeHtml(tokenPriceIndexData.methodology?.aggregation || "")}</dd></div>
            <div><dt>정규화</dt><dd>${escapeHtml(tokenPriceIndexData.methodology?.normalization || "")}</dd></div>
            <div><dt>포함 범위</dt><dd>${escapeHtml(tokenPriceIndexData.methodology?.coverage || "")}</dd></div>
            <div><dt>투자 해석</dt><dd>${escapeHtml(tokenPriceIndexData.methodology?.interpretation || "")}</dd></div>
            <div><dt>공개 한계</dt><dd>${escapeHtml(tokenPriceIndexData.methodology?.publicDataLimit || "")}</dd></div>
          </dl>
          <a href="${escapeHtml(tokenPriceIndexData.source?.productUrl || "https://www.silicondata.com/products/silicon-index/llm-token-expenditure-index")}" target="_blank" rel="noopener noreferrer">Silicon Data Methodology 보기</a>
        </article>
      </div>
    </section>`;

  createTokenPriceIndexChart(usOverviewRoot.querySelector("#token-price-index-chart"));
}

const OPENROUTER_COLORS = [
  "#ff5ca8",
  "#1888ff",
  "#ff6b45",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#14b8a6",
  "#64748b",
  "#ef4444",
  "#84cc16",
  "#06b6d4",
  "#a855f7",
  "#c4c4c4",
];

const OPENROUTER_OPENNESS = {
  all: { label: "All models", color: "#475569" },
  open: { label: "Open weights", color: "#0f9f6e" },
  closed: { label: "Closed API", color: "#dc5b4d" },
  unknown: { label: "Verification needed", color: "#a16207" },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatOpenrouterCount(value, unit = "tokens") {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "-";
  }
  const suffix = unit === "tokens" ? " tokens" : "";
  if (Math.abs(numeric) >= 1e12) {
    return `${(numeric / 1e12).toFixed(2)}T${suffix}`;
  }
  if (Math.abs(numeric) >= 1e9) {
    return `${(numeric / 1e9).toFixed(2)}B${suffix}`;
  }
  if (Math.abs(numeric) >= 1e6) {
    return `${(numeric / 1e6).toFixed(1)}M${suffix}`;
  }
  if (Math.abs(numeric) >= 1e3) {
    return `${(numeric / 1e3).toFixed(1)}K${suffix}`;
  }
  return `${Math.round(numeric).toLocaleString("en-US")}${suffix}`;
}

function formatOpenrouterChange(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${Math.round(numeric).toLocaleString("en-US")}%`;
}

function getOpenrouterOpenness(value) {
  return OPENROUTER_OPENNESS[value] ?? OPENROUTER_OPENNESS.unknown;
}

function createOpenrouterStackedChart(canvas, chartData, { compact = false } = {}) {
  if (typeof Chart === "undefined" || !canvas || !chartData) {
    return;
  }
  const labels = chartData.dates ?? [];
  const isLog = state.openrouterScale === "log" && !compact;
  const datasets = (chartData.series ?? []).map((series, index) => ({
    label: series.label ?? series.key,
    data: (series.values ?? []).map((value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        return null;
      }
      return isLog && numeric <= 0 ? null : numeric;
    }),
    backgroundColor: series.color ?? (series.key === "Others" ? "rgba(160, 160, 160, 0.42)" : OPENROUTER_COLORS[index % OPENROUTER_COLORS.length]),
    borderColor: "#ffffff",
    borderWidth: compact ? 0 : 1,
    stack: "openrouter",
  }));
  const chart = new Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          align: "start",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            color: "#56564f",
            font: { size: compact ? 10 : 11 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatOpenrouterCount(context.parsed.y, chartData.unit)}`,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: "#77766d",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: compact ? 4 : 7,
          },
        },
        y: {
          stacked: true,
          type: isLog ? "logarithmic" : "linear",
          min: isLog ? 1 : undefined,
          grid: { color: "rgba(17, 24, 39, 0.08)" },
          ticks: {
            color: "#77766d",
            callback: (value) => formatOpenrouterCount(value, chartData.unit).replace(" tokens", ""),
          },
        },
      },
    },
  });
  charts.push(chart);
}

function renderOpenrouterLeaderboardRows(rows) {
  return rows.slice(0, 20).map((row) => {
    const changeText = formatOpenrouterChange(row.change);
    const changeClass = Number(row.change) >= 0 ? "is-positive" : "is-negative";
    const openness = getOpenrouterOpenness(row.openness);
    const displayRank = row.categoryRank ?? row.rank;
    const rankCaption = row.categoryRank ? `overall #${row.rank}` : "overall";
    return `
      <div class="openrouter-rank-row">
        <div class="openrouter-rank-index">${displayRank}.<small>${rankCaption}</small></div>
        <div class="openrouter-model-dot">${escapeHtml((row.author ?? "?").slice(0, 2).toUpperCase())}</div>
        <div class="openrouter-rank-name">
          <strong>${escapeHtml(row.name)}</strong>
          <span>by ${escapeHtml(row.author)}${row.variant ? ` / ${escapeHtml(row.variant)}` : ""} <b class="openrouter-openness-tag" style="--openness-color:${openness.color}">${escapeHtml(openness.label)}</b></span>
        </div>
        <div class="openrouter-rank-value">
          <strong>${formatOpenrouterCount(row.tokens)}</strong>
          ${changeText ? `<span class="${changeClass}">${changeText}</span>` : "<span>-</span>"}
        </div>
      </div>
    `;
  }).join("");
}

function renderOpenrouterOverview() {
  companyGrid.classList.add("hidden");
  usOverviewRoot.classList.remove("hidden");
  const topChart = openrouterRankingsData.charts?.models;
  const views = openrouterRankingsData.leaderboardViews ?? [];
  const activeView = views.some((view) => view.key === state.openrouterLeaderboardView)
    ? state.openrouterLeaderboardView
    : "week";
  state.openrouterLeaderboardView = activeView;
  const rows = openrouterRankingsData.leaderboards?.[activeView] ?? [];
  const availableOpenness = new Set(rows.map((row) => row.openness || "unknown"));
  if (state.openrouterOpennessFilter !== "all" && !availableOpenness.has(state.openrouterOpennessFilter)) {
    state.openrouterOpennessFilter = "all";
  }
  const filteredRows = (state.openrouterOpennessFilter === "all"
    ? rows
    : rows.filter((row) => (row.openness || "unknown") === state.openrouterOpennessFilter))
    .map((row, index) => ({
      ...row,
      categoryRank: state.openrouterOpennessFilter === "all" ? undefined : index + 1,
    }));
  const latestRows = rows.slice(0, 6);
  const dailyUsage = openrouterRankingsData.dailyUsage;
  const secondaryKeys = ["marketShare", "tools", "images", "imageOutput", "naturalLanguage"];
  const latestDate = topChart?.dates?.length
    ? topChart.dates[topChart.dates.length - 1]
    : openrouterRankingsData.updatedAt ?? "-";
  const scaleButtons = `
    <div class="openrouter-scale-toggle">
      <button type="button" class="${state.openrouterScale === "linear" ? "active" : ""}" data-openrouter-scale="linear">Linear</button>
      <button type="button" class="${state.openrouterScale === "log" ? "active" : ""}" data-openrouter-scale="log">Log</button>
    </div>
  `;
  const viewButtons = views.map((view) => `
    <button type="button" class="market-rs-chip${activeView === view.key ? " active" : ""}" data-openrouter-view="${view.key}">
      ${escapeHtml(view.label)}
    </button>
  `).join("");
  const opennessButtons = ["all", "open", "closed", "unknown"]
    .filter((key) => key === "all" || availableOpenness.has(key))
    .map((key) => `
      <button type="button" class="market-rs-chip${state.openrouterOpennessFilter === key ? " active" : ""}" data-openrouter-openness="${key}">
        ${escapeHtml(getOpenrouterOpenness(key).label)}
      </button>
    `).join("");
  const statCards = latestRows.map((row) => `
    <article class="openrouter-stat-card">
      <span>#${row.categoryRank ?? row.rank}${row.categoryRank ? ` / overall #${row.rank}` : ""}</span>
      <strong>${escapeHtml(row.name)}</strong>
      <small>by ${escapeHtml(row.author)}</small>
      <b>${formatOpenrouterCount(row.tokens)}</b>
    </article>
  `).join("");
  const secondaryCards = secondaryKeys.map((key) => {
    const chart = openrouterRankingsData.charts?.[key];
    if (!chart) {
      return "";
    }
    return `
      <article class="us-panel openrouter-secondary-card">
        <div class="openrouter-section-head">
          <div>
            <h3>${escapeHtml(chart.title)}</h3>
            <p>${escapeHtml(chart.subtitle)}</p>
          </div>
        </div>
        <div class="openrouter-mini-chart"><canvas data-openrouter-chart="${key}"></canvas></div>
      </article>
    `;
  }).join("");

  usOverviewRoot.innerHTML = `
    <section class="openrouter-page">
      <div class="openrouter-hero">
        <div>
          <h2>AI Model Rankings</h2>
          <p>Based on benchmarks and real usage data from millions of users accessing models through OpenRouter.</p>
        </div>
        <div class="openrouter-source">
          <span>Updated ${escapeHtml(openrouterRankingsData.updatedAt || "-")}</span>
          <a href="${escapeHtml(openrouterRankingsData.source?.url ?? "https://openrouter.ai/rankings")}" target="_blank" rel="noreferrer">OpenRouter</a>
        </div>
      </div>

      <article class="us-panel openrouter-chart-panel">
        <div class="openrouter-section-head">
          <div>
            <h3>Top Models</h3>
            <p>Weekly usage of models across OpenRouter</p>
          </div>
          ${scaleButtons}
        </div>
        <div class="openrouter-chart-wrap"><canvas id="openrouter-top-models-chart"></canvas></div>
        <p class="openrouter-caption">Latest weekly bucket: ${escapeHtml(latestDate)}</p>
      </article>

      <div class="openrouter-stat-grid">${statCards}</div>

      <article class="us-panel openrouter-leaderboard-panel">
        <div class="openrouter-section-head">
          <div>
            <h3>LLM Leaderboard by Model Type</h3>
            <p>가중치 공개 여부 기준 랭킹입니다. Overall은 OpenRouter 전체 순위이며, 애매한 모델은 별도로 남깁니다.</p>
          </div>
          <div class="openrouter-leaderboard-controls">
            <div class="market-rs-chip-row">${viewButtons}</div>
            <div class="market-rs-chip-row">${opennessButtons}</div>
          </div>
        </div>
        <div class="openrouter-leaderboard-grid">${renderOpenrouterLeaderboardRows(filteredRows) || "<p>No models match this classification.</p>"}</div>
      </article>

      <article class="us-panel openrouter-daily-usage-panel">
        <div class="openrouter-section-head">
          <div>
            <h3>${escapeHtml(dailyUsage?.title || "Daily Usage: Open vs Closed")}</h3>
            <p>${escapeHtml(dailyUsage?.subtitle || "OpenRouter daily token usage by model-weight availability")}</p>
          </div>
        </div>
        ${dailyUsage?.dates?.length
          ? `<div class="openrouter-daily-chart-wrap"><canvas id="openrouter-daily-usage-chart"></canvas></div>
             <p class="openrouter-caption">${escapeHtml(dailyUsage.coverage || "")}</p>`
          : `<div class="openrouter-data-unavailable"><strong>Daily usage data is ready to connect.</strong><span>${escapeHtml(dailyUsage?.coverage || "OpenRouter daily dataset is not available yet.")}</span></div>`}
      </article>

      <section class="openrouter-secondary-grid">
        ${secondaryCards}
      </section>
    </section>
  `;

  createOpenrouterStackedChart(document.querySelector("#openrouter-top-models-chart"), topChart);
  if (dailyUsage?.dates?.length) {
    const coloredDailyUsage = {
      ...dailyUsage,
      series: (dailyUsage.series ?? []).map((series) => ({
        ...series,
        color: getOpenrouterOpenness(series.key).color,
      })),
    };
    createOpenrouterStackedChart(document.querySelector("#openrouter-daily-usage-chart"), coloredDailyUsage);
  }
  secondaryKeys.forEach((key) => {
    createOpenrouterStackedChart(usOverviewRoot.querySelector(`[data-openrouter-chart="${key}"]`), openrouterRankingsData.charts?.[key], { compact: true });
  });
  usOverviewRoot.querySelectorAll("[data-openrouter-scale]").forEach((button) => {
    button.addEventListener("click", () => {
      state.openrouterScale = button.dataset.openrouterScale || "linear";
      renderOpenrouterOverview();
    });
  });
  usOverviewRoot.querySelectorAll("[data-openrouter-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.openrouterLeaderboardView = button.dataset.openrouterView || "week";
      renderOpenrouterOverview();
    });
  });
  usOverviewRoot.querySelectorAll("[data-openrouter-openness]").forEach((button) => {
    button.addEventListener("click", () => {
      state.openrouterOpennessFilter = button.dataset.openrouterOpenness || "all";
      renderOpenrouterOverview();
    });
  });
}

function render() {
  syncDashboardRoute();
  destroyCharts();
  const asiaRegion = getAsiaScreeningRegion();
  const asiaReady = !asiaRegion || ensureAsiaScreeningLoaded(asiaRegion);
  if (!asiaRegion) setScreeningContext("us");
  else if (asiaReady) setScreeningContext(asiaRegion);
  ensureValidSelection();
  const showRsToolbar = Boolean(asiaRegion) || (state.tab === "Screening" && ["RS", "TrendScore", "Canslim"].includes(state.screeningView));
  if (toolbarRow) {
    toolbarRow.classList.toggle("hidden", state.tab !== "Taiwan" && !showRsToolbar);
  }
  if (sortBox) {
    sortBox.classList.toggle("hidden", state.tab !== "Taiwan" || Boolean(asiaRegion));
  }
  if (searchInput) {
    if (showRsToolbar) {
      if (state.screeningView === "RS") {
        searchInput.placeholder = "Search ticker or company...";
      } else if (state.screeningView === "TrendScore") {
        searchInput.placeholder = "Search trend score ticker...";
      } else if (state.screeningView === "Canslim") {
        searchInput.placeholder = "Search CANSLIM ticker...";
      } else {
        searchInput.placeholder = "Search ticker or company...";
      }
    } else {
      searchInput.placeholder = "Search company...";
    }
  }
  headerCalendarLink?.classList.toggle("active", state.tab === "Research" && state.researchView === "Calendar");
  renderCountries();
  renderSubtabs();
  renderNestedSubtabs();
  renderCurrencies();
  renderSectors();

  if (asiaRegion) {
    renderAsiaScreening(asiaRegion);
    return;
  }

  if (state.tab === "DailyBriefing") {
    renderSummary([]);
    renderMarketBriefingOverview();
    return;
  }

  if (state.tab === "Screening") {
    renderSummary([]);
    if (state.screeningView === "VIX") renderMarketVixOverview();
    else if (state.screeningView === "Breadth") renderMarketBreadthOverview();
    else if (state.screeningView === "RS") renderMarketRsOverview();
    else if (state.screeningView === "TrendScore") renderMarketTrendScoreOverview();
    else renderMarketCanslimOverview();
    return;
  }

  if (state.tab === "Market") {
    renderSummary([]);
    if (state.marketView === "Index") {
      if (state.marketIndexView === "Total") renderMarketOverview();
      else renderIndexTrendOverview();
      return;
    }
    if (state.marketView === "FxCommodities") {
      renderMarketFxCommoditiesOverview();
      return;
    }
    if (state.marketView === "Liquidity") {
      renderMarketLiquidityOverview();
      return;
    }
    if (state.marketView === "Macro") {
      renderMarketMacroOverview();
      return;
    }
    if (state.marketView === "Valuation") {
      renderMarketValuationOverview();
      return;
    }
    return;
  }

  if (state.tab === "Tech") {
    renderSummary([]);
    if (state.techView === "Cloud") {
      renderCloudOverview();
      return;
    }
    if (state.techView === "LLM") {
      renderLlmOverview();
      return;
    }
    if (state.techView === "BigTech") {
      renderCapexOverview();
      return;
    }
    renderInfraOverview();
    return;
  }

  if (state.tab === "AIData") {
    renderSummary([]);
    if (state.aiDataView === "TokenPrice") renderTokenPriceOverview();
    else if (state.aiDataView === "OpenRouter") renderOpenrouterOverview();
    else if (state.aiDataView === "GPUCloud") renderGpuCloudOverview();
    else renderMemorySpotOverview();
    return;
  }

  if (state.tab === "Flows") {
    renderSummary([]);
    if (state.flowsView === "Cds") renderStudyCdsOverview();
    else renderStudyEtfTrackingOverview();
    return;
  }

  if (state.tab === "Research") {
    renderSummary([]);
    if (state.researchView === "DataCenter") {
      renderStudyDataCenterOverview();
      return;
    }
    if (state.researchView === "MemoryCapa") {
      renderStudyMemoryCapaOverview();
      return;
    }
    if (state.researchView === "M7") {
      renderUSOverview();
      return;
    }
    if (state.researchView === "TrendSearch") {
      renderTrendSearchOverview();
      return;
    }
    if (state.researchView === "Calendar") {
      renderStudyCalendarOverview();
      return;
    }
    renderStudyOverview();
    return;
  }

  usOverviewRoot.classList.add("hidden");
  usOverviewRoot.innerHTML = "";
  companyGrid.classList.remove("hidden");
  const list = filteredCompanies();
  renderSummary(list);
  renderCards(list);
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  if (searchRenderTimer) {
    window.clearTimeout(searchRenderTimer);
    searchRenderTimer = null;
  }
  if (state.tab === "Screening" || getAsiaScreeningRegion()) {
    searchRenderTimer = window.setTimeout(() => {
      searchRenderTimer = null;
      if (getAsiaScreeningRegion() ? state.asiaView.endsWith("RS") : state.screeningView === "RS") {
        resetRsCardLimit();
      } else if (getAsiaScreeningRegion() || state.screeningView === "TrendScore") {
        resetTrendScoreCardLimit();
      }
      if (state.screeningView === "Canslim") {
        resetCanslimCardLimit();
      }
      render();
    }, 120);
    return;
  }
  render();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

isApplyingDashboardRoute = true;
const initialDashboardRouteHash = applyDashboardRouteFromHash();
isApplyingDashboardRoute = false;
if (window.location.hash !== initialDashboardRouteHash) {
  syncDashboardRoute({ replace: true });
}
window.addEventListener("popstate", handleDashboardRouteChange);
window.addEventListener("hashchange", handleDashboardRouteChange);

render();
refreshBrandMeta();
