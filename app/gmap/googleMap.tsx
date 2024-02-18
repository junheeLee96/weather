"use client";

// import { useEffect } from "react";

// export default function MyMap() {
//   useEffect(() => {
//     // return;
//     if (!window.vw) {
//       // return console.log(window);
//       const script = document.createElement("script");
//       script.src = `https://map.vworld.kr/js/vworldMapInit.js.do?version=2.0&apiKey=${process.env.API_DIGITAL_TWIN_KEY}`;
//       script.defer = true;
//       document.head.appendChild(script);
//       return;
//     }
//     console.log(window);
//     window.vw.MapControllerOption = {
//       container: "vmap",
//       mapMode: "2d-map",
//       basemapType: window.vw.ol3.BasemapType.GRAPHIC,
//       controlDensity: window.vw.ol3.DensityType.EMPTY,
//       interactionDensity: window.vw.ol3.DensityType.BASIC,
//       controlsAutoArrange: true,
//       homePosition: window.vw.ol3.CameraPosition,
//       initPosition: window.vw.ol3.CameraPosition,
//     };

//     new window.vw.MapController(window.vw.MapControllerOption);
//   }, []);
//   return (
//     <div>
//       gdgdgdgdd
//       <div id="vmap" style={{ width: "500px", height: "500px" }}></div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { currentWeather, getPolygon, satelliteData } from "../data/data";
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

  function kelvinToCelsius(k_temp: number): number {
    return parseFloat((k_temp - 273.15).toFixed(1));
  }

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
          console.log(searchParams);
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

  async function getPoly({ lat, lng }: any) {
    // console.log(window.origin);
    const data = await axios.get("http://localhost:3002/api", {
      params: {
        lat,
        lng,
      },
    });
    console.log(data);
    // const data = await getPolygon({ lat, lng });
    // console.log(data);
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
            zoom: 10,
          }
        );
        var contentString =
          '<div id="content" style="width:400px; background-color:red;">' +
          "My Text comes here" +
          "</div>";

        let infoWindow = new window.google.maps.InfoWindow({
          // content: <div style={{ color: "red" }}>gdgdgd</div>,

          content: contentString,
          position: currentLocation,
        });

        infoWindow.open(map);
        // const geocoder = new window.google.maps.Geocoder();
        const current_weather = await currentWeather({
          lat: currentLocation.lat,
          lon: currentLocation.lng,
        });
        let temp = 0;
        if (current_weather.status == 200) {
          const k_temp = parseFloat(current_weather.data.main.temp);
          temp = kelvinToCelsius(k_temp);
        }

        // geocode({
        //   lat: currentLocation.lat,
        //   lng: currentLocation.lng,
        //   map,
        //   temp,
        // });
        // console.log(geocoder);

        // const obj = await geoJson();
        // console.log(obj);
        // const triangleCoords = [
        //   { lat: 37.558654, lng: 126.794474 },
        //   { lat: 37.5125, lng: 127.102778 },
        //   { lat: 36.5184, lng: 126.8 },
        // ];

        // // Construct the polygon.
        // const bermudaTriangle = new window.google.maps.Polygon({
        //   paths: triangleCoords,
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: "#FF0000",
        //   fillOpacity: 0.35,
        // });

        // bermudaTriangle.setMap(map);

        map.addListener("click", async (mapsMouseEvent: any) => {
          // axios.get("https://localhost:3000/get_poly");
          const lat = mapsMouseEvent.latLng.lat();
          const lng = mapsMouseEvent.latLng.lng();
          // console.log(lat, lng);
          // geocode({ lat, lng });
          // return;

          // Close the current InfoWindow.
          const current_weather = await currentWeather({
            lat,
            lon: lng,
          });
          let temp = 0;
          if (current_weather.status == 200) {
            const k_temp = parseFloat(current_weather.data.main.temp);
            temp = kelvinToCelsius(k_temp);
          }

          getPoly({ lat, lng });

          // geocode({
          //   lat,
          //   lng,
          //   map,
          //   temp,
          // });

          infoWindow.close();
          // Create a new InfoWindow.
          infoWindow = new window.google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
          });
          infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
          );
          infoWindow.open(map);
        });

        // (async () => {
        //   const data = await satelliteData({
        //     lat: currentLocation.lat,
        //     lon: currentLocation.lng,
        //   });
        //   console.log(data);
        // })();

        // new window.google.maps.Circle({
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 0.8,
        //   strokeWeight: 2,
        //   fillColor: "#FF0000",
        //   fillOpacity: 0.35,
        //   map: map,
        //   center: currentLocation,
        //   radius: 2000, // 2km
        // });

        setMap(map);

        // }
      });
    }
  }

  return (
    <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
  );
}
