"use client";

import { useEffect, useRef, useState } from "react";
import {
  currentWeather,
  getCurrentWeather,
  getPoly,
  satelliteData,
} from "../data/data";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
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

export default function MyMap(): JSX.Element {
  const mapRef = useRef<null | HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [map, setMap] = useState<null | google.maps.Map>(null);
  const [localData, setLocalData] = useState<localDataTypes>({
    location: "",
    temp: 0,
  });

  useEffect(() => {
    // return;

    window.initMap = initMap;

    if (!window.google) {
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

  function geocode({ lat, lng, map, temp }: goecodeTypes) {
    const geocoder = new window.google.maps.Geocoder();
    if (!geocoder) return;
    if (!map) {
      // console.log("zz");
      return;
    }
    const location = {
      lat,
      lng,
    };

    (async () => {
      const zz = await axios.get("http://localhost:3002/location");
      console.log(zz);
      const data = await satelliteData({
        // lat: Number(lat),
        // lon: Number(lon),
        lat: lat,
        lon: lng,
      });
      console.log(data);
    })();

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
          // const queryParam = new URLSearchParams(searchParams);
          // queryParam.set("lat", String(lat));
          // queryParam.set("lng", String(lng));
          // queryParam.set("location", location.formatted_address);
          replace(`${pathname}?${queryParam.toString()}`);
          // console.log(`${pathname}?${queryParam.toString()}`);
          setLocalData((p: localDataTypes) => {
            return {
              ...p,
              temp,
              location: location.formatted_address,
            };
          });
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

        // getWeather(currentLocation.lat, currentLocation.lng);

        const map: google.maps.Map = new window.google.maps.Map(
          mapRef.current,
          {
            center: currentLocation,
            zoom: 13,
          }
        );
        // var contentString =
        //   '<div id="content" style="width:400px; background-color:red;">' +
        //   "My Text comes here" +
        //   "</div>";

        // let infoWindow = new window.google.maps.InfoWindow({
        //   // content: <div style={{ color: "red" }}>gdgdgd</div>,

        //   content: contentString,
        //   position: currentLocation,
        // });

        // infoWindow.open(map);
        let bermudaTriangle = await getPoly({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        });
        bermudaTriangle.setMap(map);
        // const geocoder = new window.google.maps.Geocoder();
        const temp = await getCurrentWeather({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        });

        geocode({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          map,
          temp,
        });

        map.addListener("click", async (mapsMouseEvent: any) => {
          // axios.get("https://localhost:3000/get_poly");
          const lat = mapsMouseEvent.latLng.lat();
          const lng = mapsMouseEvent.latLng.lng();
          geocode({ lat, lng, map, temp });

          // Close the current InfoWindow.
          // const temp = await getCurrentWeather({ lat, lng });

          bermudaTriangle.setMap(null);
          bermudaTriangle = await getPoly({
            lat,
            lng,
            map,
          });
          bermudaTriangle.setMap(map);
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

        // }
      });
    }
  }

  return (
    <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
  );
}
