// 학생 화면: 단원·스타일 고르기, 가사 쓰기, Suno 안내, 패들렛 올리기
import { UNITS, STYLES } from "./data.js";
import { PADLET_URL } from "./config.js";

const TEMPLATE = "[Intro]\n\n[Verse]\n\n\n\n[Chorus]\n\n\n\n[Verse]\n\n\n\n[Chorus]\n\n\n\n[Bridge]\n\n\n[Chorus]\n\n\n[Outro]\n";
const DRAFT_KEY = "mathsong-draft-v1";
const $ = id => document.getElementById(id);
const st = { unit: null, style: null };

function toast(msg){ const t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,2200); }
async function copy(text,label){
  try{ await navigator.clipboard.writeText(text); toast(label+" 복사했어요"); }
  catch(e){ const ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select();
    let ok=false; try{ ok=document.execCommand("copy"); }catch(_){} ta.remove(); toast(ok?label+" 복사했어요":"복사가 안 돼요. 직접 선택해서 복사해 주세요"); }
}

// 반 선택
(function(){ const sel=$("cls"); const o=document.createElement("option"); o.value=""; o.textContent="선택"; sel.appendChild(o);
  for(let i=1;i<=12;i++){ const x=document.createElement("option"); x.value=String(i); x.textContent=i+"반"; sel.appendChild(x); } })();

function renderUnits(){
  const box=$("units"); box.innerHTML="";
  UNITS.forEach(u=>{ const b=document.createElement("button"); b.className="unit"; b.type="button"; b.setAttribute("aria-pressed",String(st.unit===u.id));
    const t=document.createElement("small"); t.textContent="단원 "+u.tag; const n=document.createElement("b"); n.textContent=u.name; b.append(t,n);
    b.onclick=()=>{ st.unit=u.id; renderUnits(); saveDraft(); updateChecks(); }; box.appendChild(b); });
  const c=$("concepts"); const u=UNITS.find(x=>x.id===st.unit);
  if(!u){ c.hidden=true; return; } c.hidden=false; c.innerHTML="";
  const h=document.createElement("h3"); h.textContent=u.name+" — 가사에 넣으면 좋은 핵심 개념";
  const ul=document.createElement("ul"); u.pts.forEach(p=>{ const li=document.createElement("li"); li.textContent=p; ul.appendChild(li); });
  const ch=document.createElement("div"); ch.className="chips"; const lab=document.createElement("span"); lab.className="hint"; lab.textContent="후렴에 넣기 좋은 말:"; ch.appendChild(lab);
  u.words.forEach(w=>{ const s=document.createElement("span"); s.className="chip"; s.textContent=w; ch.appendChild(s); });
  c.append(h,ul,ch);
}
function renderStyles(){
  const box=$("styles"); box.innerHTML="";
  STYLES.forEach(s=>{ const d=document.createElement("div"); d.className="style"; d.dataset.on=String(st.style===s.id);
    const t=document.createElement("div"); t.className="t"; const b=document.createElement("b"); b.textContent=s.name; const fit=document.createElement("small"); fit.className="hint"; fit.textContent="추천: "+s.fit; t.append(b,fit);
    const f=document.createElement("p"); f.className="feel"; f.textContent=s.feel;
    const p=document.createElement("div"); p.className="prompt"; p.textContent=s.prompt;
    const sm=document.createElement("p"); sm.className="sample"; sm.textContent=s.sample;
    const a=document.createElement("div"); a.className="acts";
    const use=document.createElement("button"); use.className="btn sm primary"; use.type="button"; use.textContent=st.style===s.id?"선택됨 ✓":"이 스타일로 하기";
    use.onclick=()=>{ st.style=s.id; $("stylePrompt").value=s.prompt; renderStyles(); saveDraft(); updateChecks(); };
    const cp=document.createElement("button"); cp.className="btn sm"; cp.type="button"; cp.textContent="영어 복사"; cp.onclick=()=>copy(s.prompt,"스타일");
    a.append(use,cp); d.append(t,f,p,sm,a); box.appendChild(d); });
}

function insertAtCursor(text){ const ta=$("lyrics"); const s=ta.selectionStart,e=ta.selectionEnd,v=ta.value;
  const pre=(s>0&&v[s-1]!=="\n")?"\n\n":""; const ins=pre+text+"\n"; ta.value=v.slice(0,s)+ins+v.slice(e);
  const pos=s+ins.length; ta.focus(); ta.setSelectionRange(pos,pos); onInput(); }
document.querySelectorAll("[data-tag]").forEach(b=>b.onclick=()=>insertAtCursor(b.dataset.tag));
$("tplBtn").onclick=()=>{ const ta=$("lyrics"); if(ta.value.trim()){ insertAtCursor(TEMPLATE.trim()); } else { ta.value=TEMPLATE; onInput(); ta.focus(); ta.setSelectionRange(9,9); } };

function updateChecks(){ const v=$("lyrics").value; const n=v.length; const c=$("count"); c.textContent=n.toLocaleString()+"자 / 3,000자"; c.classList.toggle("over",n>3000);
  const items=[["이름",!!$("name1").value.trim()],["반",!!$("cls").value],["단원",!!st.unit],["스타일",!!$("stylePrompt").value.trim()],["제목",!!$("title").value.trim()],
    ["[Verse]",/\[verse/i.test(v)],["[Chorus]",/\[chorus/i.test(v)],["가사 8줄 이상",v.split("\n").filter(l=>l.trim()&&!/^\[.*\]$/.test(l.trim())).length>=8]];
  const box=$("checks"); box.innerHTML=""; items.forEach(([l,ok])=>{ const s=document.createElement("span"); s.className="ck"+(ok?" ok":""); s.textContent=(ok?"✓ ":"")+l; box.appendChild(s); }); }
function onInput(){ updateChecks(); saveDraft(); }

const FIELDS=["cls","num1","name1","num2","name2","stylePrompt","title","lyrics","sunoUrl"];
function collect(){ const o={}; FIELDS.forEach(f=>o[f]=$(f).value.trim()); o.lyrics=$("lyrics").value.replace(/\s+$/,""); o.unit=st.unit||""; o.styleId=st.style||""; return o; }
function saveDraft(){ try{ localStorage.setItem(DRAFT_KEY,JSON.stringify(collect())); }catch(e){} }
function loadDraft(){ try{ const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null"); if(!d) return; FIELDS.forEach(f=>{ if(typeof d[f]==="string") $(f).value=d[f]; });
  if(UNITS.some(u=>u.id===d.unit)) st.unit=d.unit; if(STYLES.some(s=>s.id===d.styleId)) st.style=d.styleId; }catch(e){} }
FIELDS.forEach(f=>$(f).addEventListener(f==="cls"?"change":"input",onInput));

const unitName=id=>{ const u=UNITS.find(x=>x.id===id); return u?u.name:"(단원 미선택)"; };
const namesLine=o=>[[o.num1,o.name1],[o.num2,o.name2]].filter(x=>x[1]).map(([n,m])=>(n?n+"번 ":"")+m).join(", ");

$("cpLyrics").onclick=()=>{ const v=$("lyrics").value.trim(); if(!v){ toast("먼저 4단계에서 가사를 써 주세요"); return; } copy(v,"가사"); };
$("cpStyle").onclick=()=>{ const v=$("stylePrompt").value.trim(); if(!v){ toast("먼저 3단계에서 스타일을 골라 주세요"); return; } copy(v,"스타일"); };
$("cpTitle").onclick=()=>{ const v=$("title").value.trim(); if(!v){ toast("먼저 노래 제목을 써 주세요"); return; } copy(v,"제목"); };

// ---------- 패들렛 올리기 ----------
$("padletLink").href = PADLET_URL || "https://padlet.com";
function padletReady(){
  const o=collect(); const msg=[];
  if(!o.title) msg.push("4단계에서 노래 제목을 써 주세요.");
  if(!o.lyrics.trim()) msg.push("4단계에서 가사를 써 주세요.");
  if(!/^https:\/\//.test(o.sunoUrl)) msg.push("위 칸에 Suno 노래 링크(https://로 시작)를 넣어 주세요.");
  const s=$("padletState"); s.textContent=msg.join(" "); s.hidden=!msg.length;
  return msg.length?null:o;
}
const padTitle=o=>o.title+" ("+(o.cls?o.cls+"반 ":"")+[o.name1,o.name2].filter(Boolean).join("·")+")";
const padBody=o=>"🎵 노래 듣기: "+o.sunoUrl+"\n단원: "+unitName(o.unit)+"\n스타일: "+(o.stylePrompt||"")+"\n\n"+o.lyrics;
$("cpPadTitle").onclick=()=>{ const o=padletReady(); if(o) copy(padTitle(o),"패들렛 제목"); };
$("cpPadBody").onclick=()=>{ const o=padletReady(); if(o) copy(padBody(o),"가사와 링크"); };

loadDraft(); renderUnits(); renderStyles(); updateChecks();
