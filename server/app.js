require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors()); // 모든 도메인에서의 요청을 허용하기 위해 CORS 설정

// 예제 API 엔드포인트
app.get("/getPoly", async (req, res) => {
  const { lat, lng } = req.query;

  const key = process.env.API_DIGITAL_TWIN_KEY;
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
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/currentWeather", async (req, res) => {
  const { lat, lng } = req.query;
  const lon = lng;
  const APIkey = process.env.API_OPENWEATHER_KEY;
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
  const apiKey = process.env.API_GOOGLEMAP_KEY;
  const address = "서울특별시 강남구";

  // console.log(req.query);
  //
  // if()
  let geocodingUrl;
  if (req.query.lat) {
    const { lat, lng } = req.query;
    geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lng}&sensor=false&key=${apiKey}&language=ko`;
  } else {
    const { location } = req.query;
    geocodingUrl =
      geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${apiKey}&language=ko`;
  }

  // let geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //   address
  // )}&key=${apiKey}`;

  try {
    const data = await axios.get(geocodingUrl);
    console.log("data ===", data);
    res.json(data.data);
  } catch (err) {
    res.status(500).json({ err: err });
  }

  app.get("/get_satelliteData", async (req, res) => {
    const { lat, lng } = req.query;
    const lon = lng;
    const url = "https://api.openweathermap.org/data/3.0/onecall";
    const key = process.env.API_OPENWEATHER_KEY;
    const params = {
      lat,
      lon,
      exclude: "current",
      appid: key,
      lang: "kr",
    };

    const data = await axios.get(url, { params });
    // if (!data.data) return null;

    res.send(data.data);
  });
});

// app.get('/get_')

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
