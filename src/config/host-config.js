
// 백엔드 로컬서버의 포트번호
const LOCAL_PORT = 8999;

const clientHostName = window.location.hostname;

// 백엔드 호스트 조건부 처리
let backendHostName;

if (clientHostName === 'localhost') {
  backendHostName = `http://localhost:${LOCAL_PORT}`;
} 


// 기본 백엔드 주소 저장
const API_BASE_URL = `${backendHostName}/api/fish`;

// API별 메인엔드포인트
const EXPENSE = '/expense';
const CHECK= '/check';
const SCHEDULE = '/schedule'
const CHAT = 'chat'
const PHOTO = '/photo'

// 만약에 클라이언트가 localhost면 
// http://localhost:9000/api/events
export const EXPENSE_API_URL = `${API_BASE_URL}${EXPENSE}`;
export const CHECK_API_URL = `${API_BASE_URL}${CHECK}`;
export const SCHEDULE_API_URL = `${API_BASE_URL}${SCHEDULE}`;
export const CHAT_API_URL = `${API_BASE_URL}${CHAT}`;
export const PHOTO_API_URL = `${API_BASE_URL}${PHOTO}`;
