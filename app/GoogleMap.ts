window.initMap = function () {};
const key = "AIzaSyBRLNCa54UheNNoqc4IbasOxUFwYVe7QhM";
function loadScript(src: any, position: any, id: any) {
  if (!window.google) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.id = id;
    position.appendChild(script);
  }
}

const src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
loadScript(src, document.body, "google-maps-api");
