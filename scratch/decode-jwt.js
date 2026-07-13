require('dotenv').config({ path: '.env.local' });

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return "invalid token";
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (e) {
    return e.message;
  }
}

console.log("Anon Key Payload:", decodeJWT(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
console.log("Service Key Payload:", decodeJWT(process.env.SUPABASE_SERVICE_ROLE_KEY));
