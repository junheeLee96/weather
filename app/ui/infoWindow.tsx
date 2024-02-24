export function InfoWindowJSX({ icon, main }: { icon: string; main: string }) {
  return `<div id="google-map-info-window">
  <div>
  ${main}
  </div>
  <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${main}"/>
  </div>`;
}
