import { Request, Response, Router } from "express";
import axios from "axios";

const kweatherRouter = Router();

const GATEWAY_BASE = "https://gateway.kweather.co.kr:8443";

// TSDB(OpenTSDB 스타일) 쿼리 호스트 화이트리스트 - 클라이언트가 임의 호스트를 지정하지 못하도록 제한
const TSDB_HOSTS: Record<string, string> = {
  kiotdpd: "http://kiotdpd.kweather.co.kr:24242/api/query",
  kiototsdb: "http://kiototsdb.kweather.co.kr:24242/api/query",
};

// 날씨/센서 예보 조회에 쓰이는 sensorId 화이트리스트
const WEATHER_SENSOR_IDS = [
  "kw-odam-c1",
  "kw-3d24h1",
  "kw-3d6h1",
  "kw-3d1h1",
  "kw-7d12h1",
  "kw-dust-f1",
];

const apiKeyHeader = () => ({ api_key: process.env.API_KEY as string });

// K-Weather 게이트웨이 GET 호출 공통 처리 (CORS 회피 + api_key 헤더 주입)
async function proxyGet(url: string, res: Response) {
  try {
    const response = await axios.get(url, {
      headers: apiKeyHeader(),
      timeout: 10000,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error("[kweather proxy 오류]", error?.response?.data || error.message);
    res.status(500).json({ error: "K-Weather API 호출 중 오류가 발생했습니다." });
  }
}

kweatherRouter.get("/init-serial", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/iot/custom/member/device/list?userId=busantp@btp.or.kr&userType=group`;
  await proxyGet(url, res);
});

kweatherRouter.get("/recent-data/:deviceType/:serial", async (req: Request, res: Response) => {
  const { deviceType, serial } = req.params;
  const url = `${GATEWAY_BASE}/platform-redis/v1/groups/${deviceType}/${serial}`;
  await proxyGet(url, res);
});

kweatherRouter.get("/all-recent-data", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/platform-redis/v1/groups/g-busantp@btp.or.kr`;
  await proxyGet(url, res);
});

kweatherRouter.get("/recently-point-data", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/iot/custom/pointData?userId=busantp@btp.or.kr&userType=group`;
  await proxyGet(url, res);
});

// getIsReciveData, getPrevPointData가 공유하는 엔드포인트
kweatherRouter.get("/point-data-group", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/iot/custom/pointData?groupId=busantp@btp.or.kr&loginAuth=GROUP_AUTH`;
  await proxyGet(url, res);
});

kweatherRouter.get("/recently-airkorea-point-data", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/platform-redis/v1/sensors/airkorea-aq`;
  await proxyGet(url, res);
});

kweatherRouter.get("/heat-data", async (req: Request, res: Response) => {
  const url = `${GATEWAY_BASE}/weather/w2/kw-kgkw1/26380`;
  await proxyGet(url, res);
});

kweatherRouter.get("/hcode", async (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  const url = `${GATEWAY_BASE}/weather/w4/v2/gis-loc2addr?lat=${lat}&lon=${lng}`;
  await proxyGet(url, res);
});

kweatherRouter.get("/weather/:sensorId/:code", async (req: Request, res: Response) => {
  const { sensorId, code } = req.params;
  if (!WEATHER_SENSOR_IDS.includes(sensorId)) {
    return res.status(400).json({ error: "허용되지 않은 sensorId 입니다." });
  }
  const url = `${GATEWAY_BASE}/weather/w3/v2/kw-sensors/${sensorId}/${code}`;
  await proxyGet(url, res);
});

kweatherRouter.post("/tsdb/:host", async (req: Request, res: Response) => {
  const { host } = req.params;
  const targetUrl = TSDB_HOSTS[host];
  if (!targetUrl) {
    return res.status(400).json({ error: "허용되지 않은 host 입니다." });
  }
  try {
    const response = await axios.post(targetUrl, req.body, { timeout: 10000 });
    res.json(response.data);
  } catch (error: any) {
    console.error("[kweather tsdb proxy 오류]", error?.response?.data || error.message);
    res.status(500).json({ error: "TSDB API 호출 중 오류가 발생했습니다." });
  }
});

// 온실가스 지도(히트맵)용 전체 측정소 최신값.
// 게이트웨이가 POST + JSON body 를 요구하며 api_key 는 쿼리스트링으로 받는다.
// userId/userType 은 서버에서 고정해 클라이언트가 임의 계정을 조회하지 못하게 한다.
kweatherRouter.post("/last-all", async (_req: Request, res: Response) => {
  const apiKey = encodeURIComponent(process.env.API_KEY ?? "");
  const url = `${GATEWAY_BASE}/iot/air365/v1/last-all?api_key=${apiKey}`;
  try {
    const response = await axios.post(
      url,
      { userId: "busantp@btp.or.kr", userType: "group" },
      { timeout: 10000 }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error("[kweather last-all proxy 오류]", error?.response?.data || error.message);
    // 프론트에서 인증 실패(401/403)를 구분해 안내하므로 상류 상태코드를 그대로 전달한다.
    res.status(error?.response?.status ?? 500).json({ error: "K-Weather API 호출 중 오류가 발생했습니다." });
  }
});

export { kweatherRouter };
