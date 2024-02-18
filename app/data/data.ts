import axios, { AxiosResponse } from "axios";
import { unstable_cache } from "next/cache";
import { useRouter } from "next/navigation";

export async function satelliteVideo() {
  const router = useRouter();
  console.log(router);
  let img: any = null;
  function getFormattedDate() {
    const today = new Date();

    // 현재 날짜
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    // 하루 전 날짜
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yearYesterday = yesterday.getFullYear();
    const monthYesterday = (yesterday.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const dayYesterday = yesterday.getDate().toString().padStart(2, "0");

    // yyyymmdd 형식으로 변환
    const formattedDate = `${yearYesterday}${monthYesterday}${dayYesterday}`;

    return formattedDate;
  }

  const time = getFormattedDate();

  const KEY2 =
    "QSzEptJPem4a0vGXEhX/li2KNIcAuqN7OMaynW93+PX+nzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw==";
  const KEY =
    "QSzEptJPem4a0vGXEhX%2Fli2KNIcAuqN7OMaynW93%2BPX%2BnzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw%3D%3D";
  // console.log(getFormattedDate());
  //   const time = getFormattedDate();
  const { data } = await axios.get(
    "http://apis.data.go.kr/1360000/SatlitImgInfoService/getInsightSatlit",
    {
      params: {
        serviceKey: KEY2,
        // "QSzEptJPem4a0vGXEhX%2Fli2KNIcAuqN7OMaynW93%2BPX%2BnzlWlMIu0uoDEFCWxvZsFuEcLGBSbprIoTMAsUCoLw%3D%3D"
        pageNo: encodeURIComponent("1"),
        numOfRows: encodeURIComponent("10"),
        dataType: encodeURIComponent("JSON"),
        sat: encodeURIComponent("G2"),
        data: encodeURIComponent("ir105"),
        area: encodeURIComponent("ko"),
        time: encodeURIComponent(time),
      },
    }
  );
  return (data.response?.body.items.item[0]["satImgC-file"])
    .replace(/\[|\]/g, "")
    .split(",");
  // .then((res: AxiosResponse) => {
  //   console.log(res.data);
  //   const data = res.data;
  //   return data.response?.body.items.item;
  //   if (data.response && data.response.body && data.response.body.items) {
  //     console.log("items = ", data.response.body.items);
  //     return data.response?.body?.items?.item;
  //   } else {
  //     return null;
  //   }
  // });
}

export async function currentWeather({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}) {
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  const data = axios.get(url);
  return data;
}

export async function satelliteData({
  lat,
  lon,
}: {
  lat: number | null;
  lon: number | null;
}) {
  try {
    if (!lat || !lon) return null;
    const url = "https://api.openweathermap.org/data/3.0/onecall";
    const appid = "8ed74ceb5e6a266b531ba7e0ec461a8d";
    const params = {
      lat,
      lon,
      exclude: "current",
      appid,
      lang: "kr",
    };

    const data: AxiosResponse = await axios.get(url, { params });
    // if (!data.data) return null;

    return data.data;
  } catch (err) {
    console.error("Error =  ", err);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function weatherMap() {
  // const APIkey = "7cc2b27996d4cbd87aa382b76a44cc19";
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const op = "PAC0";
  const layer = "clouds_new";
  const z = 1;
  const x = 0;
  const y = 0;

  // const url = `http://maps.openweathermap.org/maps/2.0/weather/${op}/${z}/${x}/${y}?appid=${APIkey}`;
  const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${APIkey}`;
  const data: AxiosResponse = await axios.get(url);
  return data;
}

export const geoData = async () => {
  const APIkey = "8ed74ceb5e6a266b531ba7e0ec461a8d";
  const limit = 5;
  const cityname = "seoul";
  const krCode = "+82";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${krCode}&limit=${limit}&appid=${APIkey}`;
  const data: AxiosResponse = await axios.get(url);
  return data;
};

export const getPolygon = async ({ lat, lng }: any) => {
  const key = process.env.API_DIGITAL_TWIN_KEY;
  // const url = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=${key}&domain=https://localhost&format=json&size=999&page=1&geomFilter=point(14132749.177031 4494202.5212524)`;
  let url = "https://api.vworld.kr/req/data?";
  url += "service=data&";
  url += "request=GetFeature&";
  url += "data=LT_C_ADEMD_INFO&";
  url += `key=${key}&`;
  url += `domain=https://localhost&`;
  url += "format=jsonp&";
  url += "size=999&page=1&";
  url += "geometry=true&";
  url += `geomFilter=POINT(${lng} ${lat})`;
  // url += "attrFilter=emd_cd:like:41570107";
  try {
    const data = await axios.get(url);
    // const res = await fetch(url);
    // const data = await res.json();
    console.log(
      "data.data =",
      data.data.response.result.featureCollection.features[0].geometry
        .coordinates
      // data.data.response.result.featureCollection.features
    );
    return data;
  } catch (err) {
    console.log(err);
    // throw new Error(err);
  }
};
