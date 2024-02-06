"use client";

import { useEffect, useRef, useState } from "react";
const key = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";
const MyMapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // GoogleMap.js 스크립트 로드 기다리기
    window.initMap = initMap;
    console.log("zz");

    // 스크립트가 이미 페이지에 존재하는지 확인
    if (!window.google) {
      const script = document.createElement("script");
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

  // 지도 초기화
  function initMap() {
    if (window.google && !map) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = new window.google.maps.Map(mapRef.current, {
          center: currentLocation,
          zoom: 13,
        });

        new window.google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
        });

        new window.google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: currentLocation,
          radius: 2000, // 2km
        });

        setMap(map);
      });
    }
  }

  return (
    <div id="map" ref={mapRef} style={{ height: "100vh", width: "100vw" }} />
  );
};

export default MyMapComponent;
