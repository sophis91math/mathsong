// 학생 화면: 단원·스타일 고르기, 가사 쓰기, Suno 안내, Firebase로 제출
import { UNITS, STYLES } from "./data.js";
import { firebaseConfig } from "./firebase-config.js";

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
const asText=o=>"3학년 "+(o.cls?o.cls+"반":"?반")+" / "+namesLine(o)+"\n단원: "+unitName(o.unit)+"\n제목: "+(o.title||"")+"\n스타일: "+(o.stylePrompt||"")+(o.sunoUrl?"\n노래 링크: "+o.sunoUrl:"")+"\n\n"+o.lyrics;

$("cpLyrics").onclick=()=>{ const v=$("lyrics").value.trim(); if(!v){ toast("먼저 4단계에서 가사를 써 주세요"); return; } copy(v,"가사"); };
$("cpStyle").onclick=()=>{ const v=$("stylePrompt").value.trim(); if(!v){ toast("먼저 3단계에서 스타일을 골라 주세요"); return; } copy(v,"스타일"); };
$("cpTitle").onclick=()=>{ const v=$("title").value.trim(); if(!v){ toast("먼저 노래 제목을 써 주세요"); return; } copy(v,"제목"); };
$("cpAll").onclick=()=>copy(asText(collect()),"제출 내용");

loadDraft(); renderUnits(); renderStyles(); updateChecks();

// ---------- Firebase 제출 ----------
function setSubmitState(msg,warn){ const s=$("submitState"); s.textContent=msg; s.className="notice"+(warn?" warn":""); s.hidden=!msg; }
const configured = firebaseConfig && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("여기에");
let fs=null;
async function getDb(){
  if(fs) return fs;
  const [{ initializeApp }, firestore] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
  ]);
  const app = initializeApp(firebaseConfig);
  fs = { db: firestore.getFirestore(app), ...firestore };
  return fs;
}
if(!configured){ setSubmitState("아직 제출 기능이 설정되지 않았어요. ‘제출 내용 전체 복사’를 눌러 선생님이 알려 준 곳에 붙여넣어 주세요.",true); }

$("submitBtn").onclick=async()=>{
  if(!configured){ toast("제출 기능이 아직 설정되지 않았어요"); return; }
  const o=collect();
  if(!o.name1||!o.cls){ toast("1단계에서 반과 이름을 적어 주세요"); return; }
  if(!o.unit){ toast("2단계에서 단원을 골라 주세요"); return; }
  if(!o.lyrics.trim()){ toast("4단계에서 가사를 써 주세요"); return; }
  if(o.lyrics.length>5000){ toast("가사가 너무 길어요. 3,000자 안으로 줄여 주세요"); return; }
  if(o.sunoUrl&&!/^https:\/\//.test(o.sunoUrl)){ toast("노래 링크는 https:// 로 시작해야 해요"); return; }
  const btn=$("submitBtn"); btn.disabled=true; btn.textContent="제출하는 중…";
  try{
    const f=await getDb();
    await f.addDoc(f.collection(f.db,"submissions"),{ ...o, createdAt: f.serverTimestamp() });
    setSubmitState("제출했어요! ("+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})+") 고칠 게 있으면 수정한 뒤 다시 제출하면 돼요.",false);
    toast("제출 완료!");
  }catch(e){
    console.error(e);
    setSubmitState("제출하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요. 계속 안 되면 ‘제출 내용 전체 복사’로 선생님께 보내 주세요.",true);
  }finally{ btn.disabled=false; btn.textContent="가사 제출하기"; }
};
