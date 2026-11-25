// ① Firebase 콘솔 > 프로젝트 설정 > 내 앱(웹 앱)에 나오는 firebaseConfig 값을 아래에 그대로 붙여넣으세요.
//    (이 값들은 공개되어도 괜찮은 값입니다. 실제 보호는 firestore.rules가 합니다.)
export const firebaseConfig = {
  apiKey: "AIzaSyCwTkQfL3oAl1B9ZmUAACEf7NRKspX03OU",
    authDomain: "mathsong-6c607.firebaseapp.com",
    projectId: "mathsong-6c607",
    storageBucket: "mathsong-6c607.firebasestorage.app",
    messagingSenderId: "845271000978",
    appId: "1:845271000978:web:3d9912b97962cbdb45034b",
    measurementId: "G-HT0HY8KD3J"
};

// ② 선생님 화면에 로그인할 구글 계정 이메일 (firestore.rules에도 똑같이 적어야 합니다)
export const TEACHER_EMAIL = " sophis91@gmail.com";
