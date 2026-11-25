// ① Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹 앱)에 나오는 firebaseConfig 값을 아래에 그대로 붙여넣으세요.
//    (이 값들은 공개되어도 괜찮은 값입니다. 실제 보호는 firestore.rules가 합니다.)
export const firebaseConfig = {
  apiKey: "여기에_apiKey",
  authDomain: "여기에_프로젝트ID.firebaseapp.com",
  projectId: "여기에_프로젝트ID",
  storageBucket: "여기에_프로젝트ID.appspot.com",
  messagingSenderId: "여기에_숫자",
  appId: "여기에_appId"
};

// ② 선생님 화면에 로그인할 구글 계정 이메일 (firestore.rules에도 똑같이 적어야 합니다)
export const TEACHER_EMAIL = "선생님구글계정@gmail.com";
