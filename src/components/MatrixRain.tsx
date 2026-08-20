import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = "アイウエオカキクケコ01JTCS{}#$%&*+=-アイウエオ";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * (height / fontSize)));

    const draw = () => {
      ctx.fillStyle = "rgba(3, 7, 5, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.975 ? "#a7f3d0" : "rgba(16, 185, 129, 0.55)";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns)
        .fill(0)
        .map(() => Math.floor(Math.random() * (height / fontSize)));
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
      aria-hidden="true"
    />
  );
}
