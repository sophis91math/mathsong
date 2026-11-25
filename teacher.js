// 선생님 화면: 구글 로그인 후 제출된 가사 실시간 모아보기
import { UNITS } from "./data.js";
import { firebaseConfig, TEACHER_EMAIL } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = id => document.getElementById(id);
function toast(msg){ const t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,2200); }
function setState(msg,warn){ const s=$("state"); s.textContent=msg; s.className="notice"+(warn?" warn":""); s.hidden=!msg; }
async function copy(text,label){ try{ await navigator.clipboard.writeText(text); toast(label+" 복사했어요"); }catch(e){ toast("복사가 안 돼요. 직접 선택해서 복사해 주세요"); } }

if(!firebaseConfig.projectId || firebaseConfig.projectId.startsWith("여기에")){
  setState("firebase-config.js에 Firebase 설정 값을 먼저 넣어 주세요. (설정 안내서 3단계)",true);
  throw new Error("firebase not configured");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 필터 채우기
(function(){ const c=$("fCls"); const a=document.createElement("option"); a.value=""; a.textContent="전체"; c.appendChild(a);
  for(let i=1;i<=12;i++){ const o=document.createElement("option"); o.value=String(i); o.textContent=i+"반"; c.appendChild(o); }
  const u=$("fUnit"); const b=document.createElement("option"); b.value=""; b.textContent="전체"; u.appendChild(b);
  UNITS.forEach(x=>{ const o=document.createElement("option"); o.value=x.id; o.textContent=x.name; u.appendChild(o); }); })();

const unitName=id=>{ const u=UNITS.find(x=>x.id===id); return u?u.name:"(단원 미선택)"; };
const namesLine=o=>[[o.num1,o.name1],[o.num2,o.name2]].filter(x=>x[1]).map(([n,m])=>(n?n+"번 ":"")+m).join(", ");
const ms=o=>o.createdAt&&o.createdAt.toMillis?o.createdAt.toMillis():0;
const fmt=o=>ms(o)?new Date(ms(o)).toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}):"";
const asText=o=>"3학년 "+(o.cls?o.cls+"반":"?반")+" / "+namesLine(o)+"\n단원: "+unitName(o.unit)+"\n제목: "+(o.title||"")+"\n스타일: "+(o.stylePrompt||"")+(o.sunoUrl?"\n노래 링크: "+o.sunoUrl:"")+"\n\n"+(o.lyrics||"");

let all=[], visible=[], unsub=null;

function render(){
  const fc=$("fCls").value, fu=$("fUnit").value, q=$("fQ").value.trim().toLowerCase(), sort=$("fSort").value;
  let list=all.slice();
  if($("fLatest").checked){ // 같은 반 + 같은 이름(1,2) 조합은 최신 1건만
    const seen=new Map(); list.sort((a,b)=>ms(b)-ms(a));
    list=list.filter(s=>{ const k=[s.cls,s.name1,s.name2].join("|"); if(seen.has(k)) return false; seen.set(k,1); return true; });
  }
  list=list.filter(s=>(!fc||s.cls===fc)&&(!fu||s.unit===fu)&&(!q||[s.name1,s.name2,s.title,s.lyrics].join(" ").toLowerCase().includes(q)));
  list.sort(sort==="num"?(a,b)=>(+a.cls||99)-(+b.cls||99)||(+a.num1||99)-(+b.num1||99):(a,b)=>ms(b)-ms(a));
  visible=list;

  const stats=$("stats"); stats.innerHTML="";
  const tot=document.createElement("span"); tot.className="stat"; tot.textContent="전체 제출 "; const tb=document.createElement("b"); tb.textContent=all.length; tot.appendChild(tb); tot.append("건"); stats.appendChild(tot);
  UNITS.forEach(u=>{ const n=all.filter(s=>s.unit===u.id).length; if(!n) return; const e=document.createElement("span"); e.className="stat"; e.textContent=u.name+" "; const b=document.createElement("b"); b.textContent=n; e.appendChild(b); stats.appendChild(e); });

  const box=$("subs"); box.innerHTML="";
  if(!list.length){ const e=document.createElement("div"); e.className="empty"; e.textContent=all.length?"조건에 맞는 제출이 없어요.":"아직 제출된 가사가 없어요. 학생이 ‘가사 제출하기’를 누르면 여기에 바로 나타나요."; box.appendChild(e); return; }
  list.forEach(s=>{
    const c=document.createElement("article"); c.className="sub-card";
    const m=document.createElement("div"); m.className="meta";
    const t=document.createElement("b"); t.textContent=s.title||"(제목 없음)";
    const w=document.createElement("span"); w.textContent=(s.cls?s.cls+"반 ":"")+namesLine(s);
    const u=document.createElement("span"); u.textContent="· "+unitName(s.unit);
    const tm=document.createElement("span"); tm.textContent="· "+fmt(s);
    m.append(t,w,u,tm);
    const sp=document.createElement("div"); sp.className="prompt"; sp.textContent=s.stylePrompt||"(스타일 없음)";
    const pre=document.createElement("pre"); pre.textContent=s.lyrics||"";
    const a=document.createElement("div"); a.className="acts";
    if(typeof s.sunoUrl==="string"&&/^https:\/\//.test(s.sunoUrl)){ const l=document.createElement("a"); l.className="btn sm primary"; l.href=s.sunoUrl; l.target="_blank"; l.rel="noopener"; l.textContent="노래 듣기 ↗"; a.appendChild(l); }
    else { const n=document.createElement("span"); n.className="hint"; n.textContent="노래 링크 아직 없음"; a.appendChild(n); }
    const cp=document.createElement("button"); cp.className="btn sm"; cp.textContent="가사 복사"; cp.onclick=()=>copy(asText(s),"가사"); a.appendChild(cp);
    const del=document.createElement("button"); del.className="btn sm danger"; del.textContent="삭제";
    del.onclick=async()=>{
      if(del.dataset.arm!=="1"){ del.dataset.arm="1"; del.textContent="정말 삭제할까요? 한 번 더 누르기"; setTimeout(()=>{ del.dataset.arm=""; del.textContent="삭제"; },4000); return; }
      del.disabled=true; try{ await deleteDoc(doc(db,"submissions",s._id)); toast("삭제했어요"); }catch(e){ del.disabled=false; toast("삭제하지 못했어요"); } };
    a.appendChild(del);
    c.append(m,sp,pre,a); box.appendChild(c);
  });
}
["fCls","fUnit","fSort","fLatest"].forEach(id=>$(id).addEventListener("change",render));
$("fQ").addEventListener("input",render);
$("cpVisible").onclick=()=>{ if(!visible.length){ toast("복사할 가사가 없어요"); return; } copy(visible.map(asText).join("\n\n────────────\n\n"),visible.length+"개 가사"); };

$("loginBtn").onclick=async()=>{ try{ await signInWithPopup(auth,new GoogleAuthProvider()); }catch(e){ setState("로그인하지 못했어요. 팝업 차단을 풀고 다시 눌러 주세요.",true); } };
$("logoutBtn").onclick=()=>signOut(auth);

onAuthStateChanged(auth,user=>{
  if(unsub){ unsub(); unsub=null; }
  $("loginBtn").hidden=!!user; $("logoutBtn").hidden=!user; $("who").textContent=user?user.email:"";
  if(!user){ $("board").hidden=true; setState("선생님 구글 계정으로 로그인하면 제출된 가사가 보여요.",false); return; }
  if(TEACHER_EMAIL && user.email!==TEACHER_EMAIL){ $("board").hidden=true; setState("이 계정("+user.email+")은 선생님 계정으로 등록되어 있지 않아요. 로그아웃 후 다른 계정으로 로그인해 주세요.",true); return; }
  setState("",false); $("board").hidden=false;
  unsub=onSnapshot(collection(db,"submissions"),snap=>{
    all=snap.docs.map(d=>({ _id:d.id, ...d.data() })); render();
  },err=>{ console.error(err); setState("목록을 불러오지 못했어요. firestore.rules의 선생님 이메일이 로그인한 계정과 같은지 확인해 주세요.",true); });
});
