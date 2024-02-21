"use client";

import { useEffect, useRef, useState } from "react";
import {
  SelectCity,
  currentWeather,
  getCurrentWeather,
  getPoly,
  satelliteData,
} from "../data/data";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { InfoWindowJSX } from "../ui/infoWindow";
const key = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";

interface localDataTypes {
  location: string;
  temp: number;
}

type locationType = {
  lat: number;
  lng: number;
  lon?: number;
};

interface goecodeTypes extends locationType {
  map: google.maps.Map;
  temp: number;
}

export default function MyMap({ children }: any): JSX.Element {
  const mapRef = useRef<null | HTMLDivElement>(null);
  const googleRef = useRef<any>(null);
  const infoWindow = useRef<any>(null);
  const polyRef = useRef<any>(null);

  const searchParams = useSearchParams();
  // console.log(searchParams.get("lat"));
  const pathname = usePathname();
  const { replace } = useRouter();

  const [map, setMap] = useState<null | google.maps.Map>(null);
  const [localData, setLocalData] = useState<localDataTypes>({
    location: "",
    temp: 0,
  });

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (!lat || !lng || !map) return;

    //맵 중앙맞추기
    const position = new window.google.maps.LatLng(lat, lng);
    map.panTo(position);
  }, [searchParams]);

  useEffect(() => {
    // return;

    window.initMap = initMap;

    if (!window.google) {
      //구글 스크립트 추가
      const script = document.createElement("script");
      const script2 = document.createElement("script");
      script2.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      window.initMap = null;
    };
  }, []);

  async function UpdateParam({ lat, lng }: { lat: string; lng: string }) {
    // if (!map) return;

    if (polyRef.current) {
      polyRef.current.setMap(null);
    }

    polyRef.current = await getPoly({ lat, lng });
    polyRef.current.setMap(googleRef.current);

    const weather = await axios.get("http://localhost:3002/currentWeather", {
      params: { lat, lng },
    });
    if (!weather.data) return;
    let cityName = await axios.get("http://localhost:3002/location", {
      params: { lat, lng },
    });
    cityName = SelectCity(cityName);

    //Info Window
    if (infoWindow.current) {
      infoWindow.current.close();
    }
    // Create a new InfoWindow.
    infoWindow.current = new window.google.maps.InfoWindow({
      position: {
        lat,
        lng,
      },
    });
    const locationLatLng = new window.google.maps.LatLng(lat, lng);
    const content = InfoWindowJSX({ city: cityName });
    infoWindow.current.setPosition(locationLatLng);
    infoWindow.current.setContent(InfoWindowJSX({ city: cityName }), null, 2);
    infoWindow.current.open(googleRef.current);

    // const queryParam = new URLSearchParams({
    //   lat,
    //   lng,
    //   //  location: location.formatted_address,
    // });
    // // const apiKey = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";
    // // const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lng}&sensor=false&key=${apiKey}`;
    // // const data = await axios.get(geocodingUrl);
    // const data = await axios.get("http://localhost:3002/location", {
    //   params: {
    //     lat,
    //     lng,
    //   },
    // });
    // replace(`${pathname}?${queryParam.toString()}`);
  }

  function geocode({ lat, lng, map, temp }: goecodeTypes) {
    const geocoder = new window.google.maps.Geocoder();
    if (!geocoder) return;
    if (!map) {
      return;
    }
    const location = {
      lat,
      lng,
    };

    (async () => {
      // const zz = await axios.get("http://localhost:3002/location");
      // const data = await satelliteData({
      //   lat: lat,
      //   lon: lng,
      // });
    })();

    return;

    geocoder.geocode(
      {
        location,
      },
      (results: any, status: any) => {
        if (status === "OK" && results && results.length) {
          var filtered_array = results.filter((r: any) =>
            r.types.some((st: string) => st.includes("sublocality_"))
          );

          // console.log(filtered_array);
          const location = filtered_array[filtered_array.length - 1];
          // console.log(searchParams);
          const queryParam = new URLSearchParams({
            lat: String(lat),
            lng: String(lng),
            location: location.formatted_address,
          });
          replace(`${pathname}?${queryParam.toString()}`);
          // setLocalData((p: localDataTypes) => {
          //   return {
          //     ...p,
          //     temp,
          //     location: location.formatted_address,
          //   };
          // });
          const center = {
            lat: filtered_array[filtered_array.length - 1].geometry.bounds
              .getCenter()
              .lat(),
            lng: filtered_array[filtered_array.length - 1].geometry.bounds
              .getCenter()
              .lng(),
          };

          map.panTo(center);
        }
      }
    );
  }

  // 지도 초기화
  async function initMap() {
    if (window.google && !map) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map: google.maps.Map = new window.google.maps.Map(
          mapRef.current,
          {
            center: currentLocation,
            zoom: 13,
          }
        );
        UpdateParam({
          lat: String(currentLocation.lat),
          lng: String(currentLocation.lng),
        });

        // 행정구역
        // let bermudaTriangle = await getPoly({
        //   lat: currentLocation.lat,
        //   lng: currentLocation.lng,
        // });
        // bermudaTriangle.setMap(map);

        //쿼리스트링, 구글맵 센터 정렬
        geocode({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          map,
          temp: 0,
        });

        map.addListener("click", async (mapsMouseEvent: any) => {
          // get positions
          const lat = mapsMouseEvent.latLng.lat();
          const lng = mapsMouseEvent.latLng.lng();
          UpdateParam({
            lat: String(lat),
            lng: String(lng),
          });

          // geocode({ lat, lng, map, temp: 0 });

          // Close the current InfoWindow.
          // const temp = await getCurrentWeather({ lat, lng });

          // bermudaTriangle.setMap(null);
          // bermudaTriangle = await getPoly({
          //   lat,
          //   lng,
          //   map,
          // });
          // bermudaTriangle.setMap(map);
          // getPoly({ lat, lng, map });
          //Info Window
          // infoWindow.close();
          // // Create a new InfoWindow.
          // infoWindow = new window.google.maps.InfoWindow({
          //   position: mapsMouseEvent.latLng,
          // });
          // infoWindow.setContent(
          //   JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
          // );
          // infoWindow.open(map);
        });

        setMap(map);
        googleRef.current = map;

        // }
      });
    }
  }

  return (
    <>
      <div style={{ width: "100%", height: "500px" }}>
        <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
      </div>
      {children}
    </>
  );
}
