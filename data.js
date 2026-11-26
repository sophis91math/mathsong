// 단원 7개와 Suno 스타일 예시 10개. 내용을 고치고 싶으면 이 파일만 바꾸면 됩니다.
export const UNITS=[
 {id:"sqrt",name:"제곱근과 실수",tag:"Ⅰ",
  pts:["제곱해서 a가 되는 수가 a의 제곱근 (양수 a의 제곱근은 ±√a 두 개)","(√a)² = a, √(a²) = |a|","순환하지 않는 무한소수 = 무리수 (√2, π)","유리수와 무리수를 합쳐 실수, 실수는 수직선을 빈틈없이 채운다","√a × √b = √(ab), 분모의 유리화"],
  words:["플러스마이너스 루트","무리수","수직선","유리화"]},
 {id:"poly",name:"다항식의 곱셈과 인수분해",tag:"Ⅱ",
  pts:["(a+b)² = a² + 2ab + b²","(a−b)² = a² − 2ab + b²","(a+b)(a−b) = a² − b² (합차 공식)","(x+a)(x+b) = x² + (a+b)x + ab","인수분해는 곱셈 공식을 거꾸로! 공통인수 먼저 묶기"],
  words:["완전제곱식","합차","공통인수","거꾸로"]},
 {id:"quad",name:"이차방정식",tag:"Ⅲ",
  pts:["ax² + bx + c = 0 (a ≠ 0)","AB = 0이면 A = 0 또는 B = 0 (인수분해로 풀기)","완전제곱식으로 고쳐 제곱근 이용하기","근의 공식 x = (−b ± √(b² − 4ac)) / 2a","b² − 4ac의 부호로 근의 개수 판단 (양수 2개, 0이면 중근, 음수면 없음)"],
  words:["근의 공식","중근","플러스마이너스","이에이분의"]},
 {id:"func",name:"이차함수와 그래프",tag:"Ⅳ",
  pts:["y = ax² 그래프는 포물선, 꼭짓점 (0, 0)","a > 0 아래로 볼록, a < 0 위로 볼록, |a|가 클수록 폭이 좁다","y = a(x − p)² + q : 꼭짓점 (p, q), 축 x = p","평행이동: x축으로 p, y축으로 q만큼","y = ax² + bx + c 는 완전제곱식으로 바꿔 꼭짓점 찾기"],
  words:["포물선","꼭짓점","축","평행이동"]},
 {id:"trig",name:"삼각비",tag:"Ⅴ",
  pts:["직각삼각형에서 sin = 높이/빗변, cos = 밑변/빗변, tan = 높이/밑변","sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1","sin 45° = cos 45° = √2/2, sin 60° = cos 30° = √3/2","삼각비로 나무 높이, 강 건너 거리 구하기","삼각형의 넓이 = ½ab sin C"],
  words:["사인 코사인 탄젠트","빗변","높이","삼십 사십오 육십"]},
 {id:"circle",name:"원의 성질",tag:"Ⅵ",
  pts:["중심에서 현에 내린 수선은 현을 이등분한다","원 밖의 한 점에서 그은 두 접선의 길이는 같다","원주각은 중심각의 절반","같은 호에 대한 원주각은 모두 같다, 지름에 대한 원주각은 90°","원에 내접하는 사각형의 마주 보는 각의 합은 180°"],
  words:["원주각","중심각","접선","내접사각형"]},
 {id:"stat",name:"통계",tag:"Ⅶ",
  pts:["대푯값: 평균, 중앙값, 최빈값","극단적인 값이 있으면 평균보다 중앙값","편차 = 변량 − 평균, 편차의 합은 항상 0","분산 = 편차 제곱의 평균, 표준편차 = √분산","산점도: 양의 상관관계 ↗, 음의 상관관계 ↘, 상관관계 없음"],
  words:["평균","중앙값","표준편차","산점도"]}
];
export const STYLES=[
 {id:"kpop",name:"K팝 댄스",feel:"신나고 중독성 있는 후렴. 챌린지 춤이 떠오르는 느낌",prompt:"K-pop, upbeat dance pop, catchy hook, bright synths, punchy drums, mixed male and female vocals, 124 BPM",
  sample:"[Chorus]\n에이 플러스 비 제곱은 (Hey!)\n에이 제곱 투에이비 비 제곱 (Oh!)",fit:"인수분해, 이차방정식"},
 {id:"ballad",name:"감성 발라드",feel:"피아노로 시작해서 후렴에 감정이 터지는 노래",prompt:"Korean ballad, emotional, soft piano intro, gentle female vocal, strings build-up, slow tempo",
  sample:"[Verse]\n끝없이 이어지는 소수점 아래\n반복도 없이 너는 무리수였지",fit:"제곱근과 실수"},
 {id:"folk",name:"어쿠스틱 포크",feel:"기타 하나로 이야기하듯 부르는 따뜻한 노래",prompt:"acoustic folk, warm fingerpicked guitar, gentle male vocal, storytelling, harmonica, campfire feel",
  sample:"[Verse]\n운동장 끝 나무 그림자 길어질 때\n탄젠트 하나로 높이를 재어 봤지",fit:"삼각비"},
 {id:"hiphop",name:"힙합 / 랩",feel:"공식을 랩으로 빠르게! 라임 맞추기 좋아요",prompt:"Korean hip hop, boom bap beat, confident rap verses, rhythmic flow, catchy sung chorus, 90 BPM",
  sample:"[Verse]\n마이너스 비 플러스마이너스 루트\n비 제곱 빼기 사에이씨, 이걸로 끝",fit:"이차방정식"},
 {id:"rock",name:"밴드 록",feel:"기타와 드럼이 쿵쾅! 다 같이 외치는 후렴",prompt:"pop rock, energetic band, distorted electric guitar, driving drums, shout-along chorus, youthful",
  sample:"[Chorus]\n위로 볼록! 아래로 볼록!\n에이의 부호가 정해 줘!",fit:"이차함수와 그래프"},
 {id:"trot",name:"트로트",feel:"꺾기와 흥! 어른들도 따라 부를 수 있는 노래",prompt:"Korean trot, retro, upbeat brass and accordion, festive, playful male vocal with vibrato, singalong",
  sample:"[Chorus]\n원주각은 중심각의 반이라네~\n같은 호면 원주각은 다 같다네~",fit:"원의 성질"},
 {id:"citypop",name:"시티팝",feel:"80년대 밤거리 느낌, 세련되고 그루브 있는 노래",prompt:"80s city pop, funky bass, retro synths, smooth female vocal, groovy, nostalgic night drive",
  sample:"[Verse]\n네온사인 아래 흩어진 점들\n오른쪽 위로 이어지면 양의 상관",fit:"통계"},
 {id:"lofi",name:"로파이 칠",feel:"공부할 때 틀어 두는 잔잔한 비트",prompt:"lo-fi hip hop, chill, mellow beat, soft rain sounds, relaxed whispery vocal, study vibe",
  sample:"[Verse]\n편차를 다 더하면 언제나 영\n제곱해서 평균 내면 그게 분산",fit:"통계, 제곱근과 실수"},
 {id:"musical",name:"뮤지컬",feel:"두 사람이 주고받는 대사 같은 노래. 짝 활동에 딱",prompt:"musical theater, broadway style duet, piano and orchestra, dramatic, call and response, male and female vocals",
  sample:"[Verse]\n(A) 접선 두 개, 길이는 어때?\n(B) 같아! 원 밖의 한 점에서라면!",fit:"원의 성질, 삼각비"},
 {id:"carol",name:"겨울 캐롤",feel:"학기 끝, 연말 분위기! 방울 소리 가득한 노래",prompt:"Christmas pop, jingle bells, cheerful choir, festive, sleigh bells, warm and happy",
  sample:"[Chorus]\n꼭짓점은 피 큐, 축은 엑스 이퀄 피\n종이 울리면 포물선을 그려요",fit:"이차함수와 그래프"}
];

// 선생님이 만든 완성 예시 (학생 화면 맨 위에 보여요)
export const EXAMPLE = {
  title: "동그라미 공식",
  unit: "원의 성질",
  style: "K-pop, upbeat, bright synth, catchy chorus, female vocal",
  url: "https://suno.com/s/4zJcu5vV1VpD2fTq",
  lyrics: `[Verse 1]
현의 수직이등분선 그어 보면
언제나 원의 중심을 지나가
중심에서 같은 거리 두 개의 현
길이도 똑같아, 잊지 마

[Pre-Chorus]
원 밖의 한 점에서 그은 두 접선
그 길이는 언제나 같아
접점에서 만난 반지름과 접선
딱 90도로 서 있어

[Chorus]
원주각은 중심각의 반, 반, 반!
같은 호 위의 원주각은 다 같아
지름 위에 서 있으면 90도
동그라미 속 비밀을 노래해

[Verse 2]
원에 내접한 사각형을 봐
마주 보는 두 각 더하면 180
접선과 현이 만드는 그 각은
그 안쪽 원주각과 똑같아

[Chorus] (반복)

[Outro]
돌고 돌아 다시 만난 원
이제 시험도 두렵지 않아`
};
