const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors()); // 모든 도메인에서의 요청을 허용하기 위해 CORS 설정

// 예제 API 엔드포인트
app.get("/getPoly", async (req, res) => {
  const { lat, lng } = req.query;

  const key = "F70BDFB2-EC41-3AB5-87A3-32E8B45AEA01";
  let url = "https://api.vworld.kr/req/data?";
  url += "service=data&";
  url += "request=GetFeature&";
  url += "data=LT_C_ADEMD_INFO&";
  url += `key=${key}&`;
  url += `domain=https://localhost&`;
  url += "format=json&";
  url += "size=999&page=1&";
  url += "geometry=true&";
  url += `geomFilter=POINT(${lng} ${lat})`;
  url += "attrFilter=emd_cd:like:41570107";
  try {
    const response = await axios.get(url);
    // 필요한 정보만 선택적으로 출력하거나, JSON.stringify에 replacer 함수 제공
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/currentWeather", async (req, res) => {
  const { lat, lng } = req.query;
  const lon = lng;
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  //   const data = axios.get(url);
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
});

app.get("/location", async (req, res) => {
  const apiKey = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";
  const address = "서울특별시 강남구";

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  axios
    .get(geocodingUrl)
    .then((response) => {
      const location = response.data.results[0].geometry.location;
      console.log(`위도: ${location.lat}, 경도: ${location.lng}`);
    })
    .catch((error) => {
      console.error("Geocoding API 에러:", error);
    });

  res.json({ message: "zzz" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
