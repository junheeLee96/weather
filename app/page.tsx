"use client";

import { useEffect, useRef, useState } from "react";
import { currentWeather, geoJson, satelliteData } from "./data/data";
const key = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";
const MyMapComponent = () => {
  const mapRef = useRef<null | HTMLDivElement>(null);
  const [map, setMap] = useState(null);
  const [local, setLocal] = useState(null);

  useEffect(() => {
    // GoogleMap.js 스크립트 로드 기다리기
    window.initMap = initMap;
    // console.log("zz");

    // 스크립트가 이미 페이지에 존재하는지 확인
    if (!window.google) {
      const script = document.createElement("script");
      const script2 = document.createElement("script");
      script2.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);
      // document.head.appendChild(script2);
    } else {
      initMap();
    }

    return () => {
      window.initMap = null;
    };
  }, []);

  async function getWeather(lat: number, lng: number) {
    const data = await satelliteData({ lat, lon: lng });
    console.log(data);
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
        const current_weather = await currentWeather({
          lat: currentLocation.lat,
          lon: currentLocation.lng,
        });

        console.log(current_weather);

        const map = new window.google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 10,
        });

        // map.addEventListener("click", click);

        new window.google.maps.Marker({
          // position: currentLocation,
          position: {
            lat: 37.5648761,
            lng: 126.97413929999999,
          },
          map: map,
          title: "Your Location",
        });

        let infoWindow = new window.google.maps.InfoWindow({
          content: "Click the map to get Lat/Lng!",
          position: currentLocation,
        });

        infoWindow.open(map);
        const geocoder = new window.google.maps.Geocoder();
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

        map.addListener("click", (mapsMouseEvent: any) => {
          geocoder.geocode(
            {
              location: mapsMouseEvent.latLng,
            },
            (results: any, status: any) => {
              if (status === "OK" && results && results.length) {
                console.log(results);
                var filtered_array = results.filter((r: any) =>
                  r.types.some((st: string) => st.includes("sublocality_"))
                );

                console.log(filtered_array);

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
          // Close the current InfoWindow.
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

        // function showCityBoundaries() {
        //   const city = "seoul";
        //   fetch("path/to/city_boundaries.geojson").then((res) =>
        //     console.log(res)
        //   );
        // }
      });
    }
  }

  return (
    <>
      <div id="map" ref={mapRef} style={{ height: "100vh", width: "100vw" }} />
    </>
  );
};

export default MyMapComponent;
