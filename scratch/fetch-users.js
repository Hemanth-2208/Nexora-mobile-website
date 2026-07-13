require('dotenv').config({ path: '.env.local' });

async function main() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`;
  const headers = {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  };

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

main();
