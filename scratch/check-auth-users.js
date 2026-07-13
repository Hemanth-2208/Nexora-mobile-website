require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", supabaseUrl);
console.log("Key Length:", serviceRoleKey ? serviceRoleKey.length : 0);
console.log("Key Start:", serviceRoleKey ? serviceRoleKey.substring(0, 15) : "none");
