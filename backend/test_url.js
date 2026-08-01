require('dotenv').config();
const params = new URLSearchParams({
  client_id: process.env.META_APP_ID || '1045076588233533',
  redirect_uri: `https://synalytix-backend.onrender.com/api/auth/callback/instagram`,
  response_type: 'code',
  state: 'dummy_state'
});
params.append('config_id', process.env.META_CONFIG_ID || '1022548777151324');
console.log(`https://www.facebook.com/v19.0/dialog/oauth?${params}`);
