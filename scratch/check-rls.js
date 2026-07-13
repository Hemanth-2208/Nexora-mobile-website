const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function test() {
  console.log("Checking RLS policies...");
  const { data, error } = await supabase.rpc('get_policies'); // or direct query if we have sql access, but let's query pg_policies
  
  // Let's run a custom query using service role key to see pg_policies
  const { data: policies, error: polError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'mobiles');

  if (polError) {
    console.error("Pol error:", polError);
    // Since pg_policies is a system table, maybe we can run raw sql or just check if it fails.
    // Let's try running direct sql if possible, or querying pg_catalog
    const { data: rawPol, error: rawError } = await supabase
      .from('pg_catalog.pg_policies')
      .select('*');
    console.log("Raw policies query error:", rawError);
  } else {
    console.log("Policies:", policies);
  }
}

test();
