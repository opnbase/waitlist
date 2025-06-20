"use client";
import { finalRevealLines } from "@/lib/opnbase-reveal-content";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function OpnbaseParticlesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  interface Particle { x:number;y:number;bx:number;by:number;s:number;h:number;life:number; }
  const logoPath = "/bg-removed-logo.png";

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };

    const drawMask = (img:HTMLImageElement)=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const text="Opnbase";
      let fs=canvas.height*0.2;
      const stacked=canvas.width<768;
      if(stacked){
        fs=canvas.width<640?canvas.height*0.08:canvas.height*0.12;
        let h=canvas.height*0.15,w=(img.width/img.height)*h,maxW=canvas.width*0.7;
        if(w>maxW){const sc=maxW/w;w*=sc;h*=sc;}
        const gap=fs*0.8,cy=(canvas.height-(h+gap+fs))/2,cx=canvas.width/2;
        ctx.font=`900 ${fs}px Inter, sans-serif`;
        ctx.drawImage(img,cx-w/2,cy,w,h);
        ctx.fillStyle="#fff";ctx.textAlign="center";
        ctx.fillText(text,cx,cy+h+gap+fs*0.35);
      }else{
        ctx.font=`900 ${fs}px Inter, sans-serif`;
        const gapBase=fs*0.35,h=fs,w=(img.width/img.height)*h;
        let textW=ctx.measureText(text).width;
        while(textW+w+gapBase>canvas.width*0.9){fs*=0.95;ctx.font=`900 ${fs}px Inter, sans-serif`;textW=ctx.measureText(text).width;}
        const gap=fs*0.35,total=w+gap+textW,startX=(canvas.width-total)/2,cy=canvas.height/2;
        ctx.drawImage(img,startX,cy-h/2,w,h);
        ctx.fillStyle="#fff";ctx.textAlign="start";
        ctx.fillText(text,startX+w+gap,cy+fs*0.35);
      }
      return ctx.getImageData(0,0,canvas.width,canvas.height);
    };

    const spawn=(mask:ImageData):Particle|null=>{
      for(let i=0;i<80;i++){
        const x=(Math.random()*canvas.width)|0,y=(Math.random()*canvas.height)|0;
        if(mask.data[(y*canvas.width+x)*4+3]>128) return {x,y,bx:x,by:y,s:1+Math.random()*0.5,h:200+(x/canvas.width)*40,life:100+Math.random()*100};
      }
      return null;
    };

    const logo=new Image();logo.src=logoPath;
    const particles:Particle[]=[];
    const density=()=>canvas.width<768?120:180;
    const count=()=>Math.floor((canvas.width*canvas.height)/density());
    let mask:ImageData;
    const init=()=>{resize();mask=drawMask(logo);particles.length=0;while(particles.length<count()){const p=spawn(mask);if(p)particles.push(p);}ctx.clearRect(0,0,canvas.width,canvas.height);};;
    if(logo.complete)init();logo.onload=init;addEventListener("resize",init);

    let raf=0;
    const loop=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const p of particles){p.x+=(p.bx-p.x)*0.08;p.y+=(p.by-p.y)*0.08;ctx.fillStyle=`hsl(${p.h},100%,70%)`;ctx.fillRect(p.x,p.y,p.s,p.s);if(--p.life<0)p.life=120+Math.random()*120;}
      raf=requestAnimationFrame(loop);
    };
    loop();
    return()=>{cancelAnimationFrame(raf);removeEventListener("resize",init);};
  },[]);

  return(
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" aria-label="Interactive particle logo + word" />
      <div className="absolute bottom-[100px] z-10 text-center">
        {finalRevealLines.map((l,i)=>(<motion.p key={i} className="text-neutral-300 text-base sm:text-lg md:text-xl leading-relaxed">{l}</motion.p>))}
      </div>
    </div>
  );
}
