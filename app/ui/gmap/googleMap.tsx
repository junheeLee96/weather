"use client";

import { createContext, useEffect, useRef, useState } from "react";
import {
  SelectCity,
  currentWeather,
  getCity,
  getCurrentWeather,
  getPoly,
  satelliteData,
} from "../../data/data";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { InfoWindowJSX } from "../infoWindow";
import Board from "../Board";
import { locationTypes } from "@/app/types/type";
const key = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";

export const locationContext = createContext<null | locationTypes>(null);

export default function MyMap(): JSX.Element {
  const mapRef = useRef<null | HTMLDivElement>(null);
  const googleRef = useRef<null | google.maps.Map>(null);
  const infoWindow = useRef<any>(null);
  const polyRef = useRef<any>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [map, setMap] = useState<null | google.maps.Map>(null);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (!lat || !lng || !map) return;

    //맵 중앙맞추기
    const position = new window.google.maps.LatLng(lat, lng);
    map.panTo(position);
  }, [searchParams]);

  useEffect(() => {
    // render gmap

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
      if (!map) initMap();
    }

    return () => {
      window.initMap = null;
    };
  }, []);

  async function UpdateParam({ lat, lng }: locationTypes) {
    const queryParam = new URLSearchParams(searchParams);
    queryParam.set("lat", String(lat));
    queryParam.set("lng", String(lng));
    replace(`${pathname}?${queryParam.toString()}`);

    if (polyRef.current) {
      polyRef.current.setMap(null);
    }

    // 경계, 날씨
    const [poly, weather] = await Promise.all([
      getPoly({ lat, lng }),
      axios.get("http://localhost:3002/currentWeather", {
        params: { lat, lng },
      }),
    ]);

    polyRef.current = poly;
    polyRef.current.setMap(googleRef.current);

    if (!weather.data) return;
    const { icon, main } = weather.data.weather[0];

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
    infoWindow.current.setPosition(locationLatLng);
    infoWindow.current.setContent(InfoWindowJSX({ icon, main }), null, 2);
    infoWindow.current.open(googleRef.current);
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

        map.addListener("click", async (mapsMouseEvent: any) => {
          // get positions
          const lat = mapsMouseEvent.latLng.lat();
          const lng = mapsMouseEvent.latLng.lng();
          UpdateParam({
            lat: String(lat),
            lng: String(lng),
          });
        });

        setMap(map);
        googleRef.current = map;
      });
    }
  }

  return (
    <div>
      <div style={{ width: "100%", height: "400px" }}>
        <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
