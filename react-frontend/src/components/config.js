const CLIENT_ID = "d83fc9e4ac2b4792ba4bb6c6215d8696"
const REDIRECT_URI = "http://127.0.0.1:5000/oauth"
const CLIENT_SECRET = "1nY1oSH3E1SUOJRu1k7zdciHmUfx5ck0"
const KAKAO_AUTH_URL  =`https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// export const KAKAO_AUTH_URL  =`https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
export {CLIENT_ID,REDIRECT_URI, CLIENT_SECRET, KAKAO_AUTH_URL}
 