const $=s=>document.querySelector(s);
const screens={start:$('#startScreen'),game:$('#gameScreen'),result:$('#resultScreen')};
const colors=['#ff6688','#ffc857','#55d6be','#6d8cff','#b978ff','#ff914d'];
const dinos=['🦖','🦕','🐊','🥚','🌋','🦴','🦎','🐲'];
let level=1,score=0,best=Number(localStorage.dinoBest||0),sound=true,selected=[],locked=false,audioCtx;

function show(name){Object.values(screens).forEach(x=>x.classList.remove('active'));screens[name].classList.add('active');$('#bestLabel').textContent=`Recorde: ${best}`}
function tone(freq,duration=.12,type='sine'){if(!sound)return;audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type=type;g.gain.setValueAtTime(.07,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}
function saveBest(){if(score>best){best=score;localStorage.dinoBest=best}}
function start(){level=1;score=0;build();show('game');tone(520)}

function build(){
  selected=[];locked=false;
  const dinoMode=level>=4;
  const tileCount=level<2?4:level<5?6:8;
  const source=dinoMode?dinos:colors;
  const pair=source[(level*2)%source.length];
  const items=[pair,pair];
  for(const item of source){if(items.length>=tileCount)break;if(item!==pair)items.push(item)}
  while(items.length<tileCount)items.push(source[items.length%source.length]);
  items.sort(()=>Math.random()-.5);
  $('#levelLabel').textContent=level;$('#scoreLabel').textContent=score;
  $('#modeLabel').textContent=dinoMode?'DINOS':'CORES';$('#promptIcon').textContent=dinoMode?'🦖':'🎨';
  $('#promptText').textContent=dinoMode?'Encontra os dinossauros iguais':'Encontra as cores iguais';
  $('#progressBar').style.width=`${Math.min(100,level*10)}%`;
  const board=$('#board');board.innerHTML='';
  items.forEach(item=>{const b=document.createElement('button');b.className='cube';b.dataset.key=item;b.setAttribute('aria-label',dinoMode?`Dinossauro ${item}`:`Cubo de cor ${item}`);if(dinoMode)b.textContent=item;else b.style.background=item;b.onclick=()=>pick(b);board.appendChild(b)});
}

function pick(btn){
  if(locked||selected.includes(btn))return;selected.push(btn);btn.classList.add('selected');tone(300,.06);
  if(selected.length<2)return;locked=true;const[a,b]=selected;
  if(a.dataset.key===b.dataset.key){
    a.classList.add('good');b.classList.add('good');score+=100+level*15;saveBest();tone(740,.18);
    setTimeout(()=>{$('#resultScore').textContent=score;$('#resultMessage').textContent=level%3===0?'Excelente memória, campeão!':'Muito bem! O próximo é ainda mais divertido.';$('#resultEmoji').textContent=level>=4?'🦖🎉':'🌟🎉';show('result')},500);
  }else{
    a.classList.add('bad');b.classList.add('bad');score=Math.max(0,score-10);tone(140,.2,'sawtooth');
    setTimeout(()=>{a.classList.remove('selected','bad');b.classList.remove('selected','bad');selected=[];locked=false;$('#scoreLabel').textContent=score},520);
  }
}

$('#startBtn').onclick=start;
$('#nextBtn').onclick=()=>{level++;build();show('game');tone(540)};
$('#homeBtn').onclick=()=>{saveBest();show('start')};
$('#soundBtn').onclick=()=>{sound=!sound;$('#soundBtn').textContent=sound?'🔊':'🔇';$('#soundBtn').setAttribute('aria-label',sound?'Desligar som':'Ligar som')};
show('start');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
