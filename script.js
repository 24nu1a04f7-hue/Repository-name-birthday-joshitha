const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const photos = [
  "images/photo1.jpg","images/photo2.jpg","images/photo3.jpg",
  "images/photo4.jpg","images/photo5.jpg"
];

let slide = 0, slideTimer = null, slidesPlaying = true;
let musicOn = false;
let audioCtx, master, melodyTimer, noteIndex = 0;

window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").classList.add("fade-out");
    $("#app").classList.remove("hidden");
    setTimeout(() => $("#loader").remove(), 1100);
  }, 2300);

  makeDots();
  startCountdown();
  startAmbientParticles();
});

function startCountdown(){
  const target = new Date("2026-08-09T00:00:00");
  const update = () => {
    let diff = target - new Date();
    if(diff < 0){
      target.setFullYear(new Date().getFullYear()+1);
      diff = target - new Date();
    }
    const sec = Math.floor(diff/1000);
    $("#days").textContent = String(Math.floor(sec/86400)).padStart(2,"0");
    $("#hours").textContent = String(Math.floor(sec%86400/3600)).padStart(2,"0");
    $("#minutes").textContent = String(Math.floor(sec%3600/60)).padStart(2,"0");
    $("#seconds").textContent = String(sec%60).padStart(2,"0");
  };
  update(); setInterval(update,1000);
}

let surpriseStarted = false;

$("#surpriseBtn").addEventListener("click", function(){
  if(surpriseStarted) return;
  surpriseStarted = true;

  const cinematic = $("#cinematic");
  cinematic.classList.remove("hidden-scene");
  cinematic.style.display = "grid";
  cinematic.scrollIntoView({behavior:"smooth", block:"start"});

  // Start music, but never block the visual animation.
  try { startMusic(); } catch(e) {}

  // Go directly to the gift — no countdown.
  setTimeout(() => openGift(), 250);
});

function openGift(){
  const gift=$("#gift");
  gift.classList.add("shake");
  setTimeout(()=>gift.classList.add("open"),2000);
  setTimeout(()=>{
    burstFireworks(5);
    spawnCelebration(35);
  },2800);
  setTimeout(()=>{
    $("#giftStage").classList.add("hidden");
    $("#birthdayReveal").classList.remove("hidden");
    typeWriter($("#typeTitle"),"Happy Birthday, Joshitha 🎉",70,()=>{
      typeWriter($("#typeSub"),"May this year bring you many reasons to smile.",45);
    });
  },3700);
}

function typeWriter(el,text,speed,done){
  el.textContent=""; let i=0;
  const t=setInterval(()=>{
    el.textContent+=text[i++];
    if(i>=text.length){clearInterval(t);if(done)done();}
  },speed);
}

$("#galleryBtn").addEventListener("click",()=>{
  $("#gallery").scrollIntoView({behavior:"smooth"});
  startSlides();
});
$("#letterBtn").addEventListener("click",()=>$("#letterModal").classList.remove("hidden"));
$("#closeLetter").addEventListener("click",()=>$("#letterModal").classList.add("hidden"));
$("#letterModal").addEventListener("click",e=>{if(e.target.id==="letterModal") $("#letterModal").classList.add("hidden")});

function makeDots(){
  $("#slideDots").innerHTML=photos.map((_,i)=>`<i class="dot ${i===0?"active":""}"></i>`).join("");
}
function renderSlide(direction=1){
  const img=$("#slideImage");
  img.classList.remove("zoom");
  img.style.opacity=0;
  setTimeout(()=>{
    img.src=photos[slide];
    img.alt=`Joshitha memory ${slide+1}`;
    $("#slideNumber").textContent=`${String(slide+1).padStart(2,"0")} / ${String(photos.length).padStart(2,"0")}`;
    $$(".dot").forEach((d,i)=>d.classList.toggle("active",i===slide));
    img.style.opacity=1;
    requestAnimationFrame(()=>img.classList.add("zoom"));
  },300);
}
function next(){slide=(slide+1)%photos.length;renderSlide(1)}
function prev(){slide=(slide-1+photos.length)%photos.length;renderSlide(-1)}
function startSlides(){
  clearInterval(slideTimer);
  slideTimer=setInterval(next,5000);
  slidesPlaying=true;$("#playSlides").textContent="Ⅱ";
}
$("#nextBtn").addEventListener("click",()=>{next();startSlides()});
$("#prevBtn").addEventListener("click",()=>{prev();startSlides()});
$("#playSlides").addEventListener("click",()=>{
  if(slidesPlaying){clearInterval(slideTimer);slidesPlaying=false;$("#playSlides").textContent="▶"}
  else{startSlides()}
});

function spawnCelebration(count=25){
  const particleBox=$("#particles");
  const items=["🎈","❤️","💖","✨","🎊","🌸","🌹"];
  for(let i=0;i<count;i++){
    const e=document.createElement("span");
    e.className="floating "+(Math.random()>.5?"heart":"balloon");
    e.textContent=items[Math.floor(Math.random()*items.length)];
    e.style.left=Math.random()*100+"vw";
    e.style.animationDuration=(5+Math.random()*7)+"s";
    e.style.animationDelay=(Math.random()*2)+"s";
    particleBox.appendChild(e);
    setTimeout(()=>e.remove(),14000);
  }
}
function startAmbientParticles(){
  for(let i=0;i<14;i++){
    const e=document.createElement("span");
    e.className="floating petal"; e.textContent="🌹";
    e.style.left=Math.random()*100+"vw";
    e.style.animationDuration=(10+Math.random()*10)+"s";
    e.style.animationDelay=(Math.random()*10)+"s";
    $("#petals").appendChild(e);
  }
  setInterval(()=>spawnCelebration(5),2500);
}

function burstFireworks(amount=3){
  const box=$("#fireworks");
  for(let j=0;j<amount;j++){
    setTimeout(()=>{
      const cx=15+Math.random()*70, cy=12+Math.random()*45;
      for(let i=0;i<36;i++){
        const a=Math.PI*2*i/36, r=70+Math.random()*100;
        const p=document.createElement("i");
        p.className="firework";p.style.left=cx+"vw";p.style.top=cy+"vh";
        p.style.setProperty("--x",Math.cos(a)*r+"px");
        p.style.setProperty("--y",Math.sin(a)*r+"px");
        box.appendChild(p);setTimeout(()=>p.remove(),1400);
      }
    },j*450);
  }
}
setInterval(()=>{if(!$("#cinematic").classList.contains("hidden-scene")) burstFireworks(1)},4200);

const canvas=$("#confetti"),ctx=canvas.getContext("2d"); let conf=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
addEventListener("resize",resize);resize();
function confettiBurst(n=100){
  conf=Array.from({length:n},()=>({x:Math.random()*canvas.width,y:-20-Math.random()*canvas.height*.2,
    s:3+Math.random()*7,v:2+Math.random()*4,a:Math.random()*Math.PI*2,r:Math.random()*Math.PI}));
}
function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  conf.forEach(p=>{p.y+=p.v;p.r+=.08;p.x+=Math.sin(p.r)*.7;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=`hsl(${Math.random()*360},85%,70%)`;
    ctx.fillRect(0,0,p.s,p.s*1.8);ctx.restore();
  });
  conf=conf.filter(p=>p.y<canvas.height+30);
  requestAnimationFrame(drawConfetti);
}
drawConfetti();

$("#blowBtn").addEventListener("click",()=>{
  $$(".candle").forEach(c=>c.classList.add("out"));
  confettiBurst(180); burstFireworks(8); spawnCelebration(55);
  $("#wishText").classList.remove("hidden");
  setTimeout(()=>$("#finale").scrollIntoView({behavior:"smooth"}),1800);
});

$("#replayBtn").addEventListener("click",()=>{
  location.reload();
});

/* Sparkling cursor trail */
document.addEventListener("pointermove",e=>{
  if(innerWidth<700) return;
  const s=document.createElement("span");
  s.textContent="✦";s.style.position="fixed";s.style.left=e.clientX+"px";s.style.top=e.clientY+"px";
  s.style.color=Math.random()>.5?"#ff8cba":"#c6b0ff";s.style.pointerEvents="none";s.style.zIndex=80;
  s.style.fontSize=(7+Math.random()*10)+"px";s.style.transition="transform .7s,opacity .7s";
  document.body.appendChild(s);
  requestAnimationFrame(()=>{s.style.transform=`translate(${(Math.random()-.5)*25}px,${-15-Math.random()*20}px) scale(0)`;s.style.opacity=0});
  setTimeout(()=>s.remove(),750);
});

/* Reliable birthday music file playback */
const birthdayAudio = $("#birthdayAudio");
birthdayAudio.volume = parseFloat($("#volume").value);

async function startMusic(){
  try{
    birthdayAudio.volume = parseFloat($("#volume").value);
    await birthdayAudio.play();
    musicOn = true;
    $("#musicStatus").textContent = "Playing";
    $("#musicToggle").textContent = "❚❚";
  }catch(e){
    musicOn = false;
    $("#musicStatus").textContent = "Click ♫ to play";
  }
}

function stopMusic(){
  birthdayAudio.pause();
  musicOn = false;
  $("#musicStatus").textContent = "Paused";
  $("#musicToggle").textContent = "♫";
}

$("#musicToggle").addEventListener("click",()=>musicOn?stopMusic():startMusic());
$("#volume").addEventListener("input",e=>{birthdayAudio.volume=e.target.value;});
