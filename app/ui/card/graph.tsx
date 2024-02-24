"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

const K = 273.15;
const PADDING = 20;

export default function Graph({ searchParams }: any) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<null | CanvasRenderingContext2D>(null);
  const { lat, lng } = searchParams;

  async function draw({ lat, lng }: any) {
    if (!ctx) return;
    if (!ref.current) return;
    const weather = await axios.get("http://localhost:3002/get_satelliteData", {
      params: { lat, lng },
    });

    if (!weather || weather.status !== 200) return;
    const { hourly } = weather.data;
    let avg: number = 0;
    let sum_temps: number = 0;
    let min: number = 99;
    let max: number = 0;
    const data = [];
    for (let i = 0; i < hourly.length; i++) {
      const temp = Number((Number(hourly[i].temp) - K).toFixed(1));
      data.push(temp);

      if (temp > max) {
        max = temp;
      }

      if (temp < min) {
        min = temp;
      }
      sum_temps += temp;
    }

    avg = Number((sum_temps / hourly.length).toFixed(1));

    const pad = PADDING;
    const chartInnerWidth = ref.current.width - 2 * pad;
    const chartInnerHeight = ref.current.height - 2 * pad;
    const nY = max - min + 1;
    const nX = data.length;
    const blockWidth = chartInnerWidth / (nX + 1);
    const blockHeight = chartInnerHeight / (nY + 1);
    const xOnCvs = [pad + blockWidth];
    const yOnCvs = [pad + chartInnerHeight - blockHeight * (data[0] - min + 1)];
    for (let i = 1; i < data.length; ++i) {
      xOnCvs.push(pad + (i + 1) * blockWidth);
      yOnCvs.push(pad + chartInnerHeight - blockHeight * (data[i] - min + 1));
    }
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    // console.log(yOnCvs);
    let x = xOnCvs[0];
    let y = yOnCvs[0];
    console.log(xOnCvs);
    console.log(yOnCvs);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    for (let i = 1; i < nX; ++i) {
      const nextx = xOnCvs[i];
      const nexty = yOnCvs[i];
      //원 그리기
      ctx.moveTo(x, y);
      ctx.beginPath();
      ctx.arc(nextx, nexty, 5, 0, 2 * Math.PI);
      ctx.fill();

      // 온도 표시
      ctx.fillText(String(data[i]), nextx, nexty - 10);

      //막대
      ctx.beginPath();
      ctx.moveTo(nextx, nexty);
      ctx.strokeStyle = "red";
      ctx.lineTo(nextx, ref.current.height);
      ctx.stroke();

      x = nextx;
      y = nexty;
    }

    console.log(data);
    // for (let i = 0; i < nX; ++i) {
    //   const dx = xOnCvs[i] - mx;
    //   const dy = yOnCvs[i] - my;
    //   ctx.font = "30px Arial";
    //   if (dx * dx + dy * dy < 100) {
    //     ctx.fillStyle = "rgba(77, 82, 82,100)";
    //     ctx.fillRect(xOnCvs[i], yOnCvs[i] - 40, 40, 40);
    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "middle";
    //     ctx.fillStyle = "rgb(213, 219, 219)";
    //     ctx.fillText(data[i].toString(), xOnCvs[i], yOnCvs[i]);
    //   }
    // }

    //
    //
    //
  }

  useEffect(() => {
    if (!ctx) return;
    draw({ lat, lng });
  }, [lat, lng]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = 1000 + PADDING * 2;
    canvas.height = 80 + PADDING * 2;
    console.log(canvas.width, canvas.height);
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "blue",
        overflowX: "scroll",
        overflowY: "hidden",
      }}
    >
      <canvas id="chart" ref={ref} />
    </div>
  );
}
