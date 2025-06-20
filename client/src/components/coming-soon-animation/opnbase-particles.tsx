"use client";
import { finalRevealLines } from "@/lib/opnbase-reveal-content";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function OpnbaseParticlesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const touching = useRef(false);
  interface Particle { x:number;y:number;bx:number;by:number;s:number;h:number;life:number; }
  const logoPath = "/bg-removed-logo.png";

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };

    const drawMask = (img: HTMLImageElement) => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const text = "Opnbase";
      let fs = canvas.height*0.2;
      const stacked = canvas.width < 768;
      if (stacked) {
        if (canvas.width < 640) {
          fs = canvas.height * 0.08;
        } else {
          fs = canvas.height * 0.12;
        }
        let logoH = canvas.height * 0.15;
        let logoW = (img.width/img.height)*logoH;
        const maxW = canvas.width*0.7;
        if (logoW > maxW) { const sc = maxW/logoW; logoW*=sc; logoH*=sc; }
        const gap = fs*0.8;
        ctx.font = `900 ${fs}px Inter, sans-serif`;
        const totalH = logoH+gap+fs;
        const startY = (canvas.height-totalH)/2;
        const cx = canvas.width/2;
        ctx.drawImage(img,cx-logoW/2,startY,logoW,logoH);
        ctx.fillStyle="#fff";
        ctx.textAlign="center";
        ctx.fillText(text,cx,startY+logoH+gap+fs*0.35);
      } else {
        ctx.font = `900 ${fs}px Inter, sans-serif`;
        const gapBase = fs*0.35;
        const logoH = fs;
        const logoW = (img.width/img.height)*logoH;
        let textW = ctx.measureText(text).width;
        while (textW+logoW+gapBase > canvas.width*0.9) { fs*=0.95; ctx.font=`900 ${fs}px Inter, sans-serif`; textW=ctx.measureText(text).width; }
        const gap = fs*0.35;
        const totalW = logoW+gap+textW;
        const startX = (canvas.width-totalW)/2;
        const cy = canvas.height/2;
        ctx.drawImage(img,startX,cy-logoH/2,logoW,logoH);
        ctx.fillStyle="#fff";
        ctx.textAlign="start";
        ctx.fillText(text,startX+logoW+gap,cy+fs*0.35);
      }
      return ctx.getImageData(0,0,canvas.width,canvas.height);
    };

    const spawn = (mask:ImageData):Particle|null=>{for(let i=0;i<50;i++){const x=(Math.random()*canvas.width)|0;const y=(Math.random()*canvas.height)|0;if(mask.data[(y*canvas.width+x)*4+3]>128)return{x,y,bx:x,by:y,s:Math.random()+0.5,h:200+(x/canvas.width)*40,life:100+Math.random()*100};}return null;};

    const logo = new Image();
    logo.src = logoPath;
    const particles:Particle[] = [];
    const count = () => Math.floor((canvas.width*canvas.height)/200);
    let mask:ImageData;
    const init = () => { resize(); mask = drawMask(logo); particles.length=0; while(particles.length<count()){const p=spawn(mask); if(p) particles.push(p);} ctx.clearRect(0,0,canvas.width,canvas.height); };
    if (logo.complete) init();
    logo.onload = init;
    addEventListener("resize",init);

    let raf=0;
    const loop = () => { ctx.clearRect(0,0,canvas.width,canvas.height); for(const p of particles){const dx=mouse.current.x-p.x; const dy=mouse.current.y-p.y; const d=Math.hypot(dx,dy); const inf=160; if((touching.current||!("ontouchstart"in window))&&d<inf){const f=(inf-d)/inf; const a=Math.atan2(dy,dx); p.x=p.bx-Math.cos(a)*f*60; p.y=p.by-Math.sin(a)*f*60;} else { p.x+=(p.bx-p.x)*0.08; p.y+=(p.by-p.y)*0.08; } ctx.fillStyle=`hsl(${p.h},100%,60%)`; ctx.fillRect(p.x,p.y,p.s,p.s); if(--p.life<0)p.life=120+Math.random()*120;} raf=requestAnimationFrame(loop); };
    loop();

    const setPos=(x:number,y:number)=>{mouse.current={x,y};};
    const mv=(e:MouseEvent)=>setPos(e.clientX,e.clientY);
    const tv=(e:TouchEvent)=>e.touches.length&&setPos(e.touches[0].clientX,e.touches[0].clientY);
    addEventListener("mousemove",mv);
    canvas.addEventListener("mouseleave",()=>setPos(0,0));
    canvas.addEventListener("touchstart",()=>touching.current=true);
    canvas.addEventListener("touchmove",tv,{passive:false});
    canvas.addEventListener("touchend",()=>{touching.current=false; setPos(0,0);});

    return()=>{cancelAnimationFrame(raf); removeEventListener("mousemove",mv); removeEventListener("resize",init);};
  },[]);

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" aria-label="Interactive particle logo + word" />
      <div className="absolute bottom-[100px] z-10 text-center">
        {finalRevealLines.map((l,i)=>(<motion.p key={i} className="text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed">{l}</motion.p>))}
      </div>
    </div>
  );
}