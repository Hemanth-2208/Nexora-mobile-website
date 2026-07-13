const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error("Missing Supabase config");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function main() {
  const { data, error } = await supabase
    .from("mobiles")
    .select("*")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Query Error Details:");
    console.error("Message:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);
    console.error("Code:", error.code);
    console.error("Full Error:", error);
  } else {
    console.log("Query Successful! Fetched mobiles count:", data.length);
  }
}

main();
