const { createClient } = require('@supabase/supabase-js');

// We use process.env to grab the secret variables from our .env file!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials. Please check your .env file!");
}

// We create the Supabase connection using the Service Role Key.
// IMPORTANT: The Service Role Key bypasses all database security (RLS).
// It should ONLY be used safely inside this backend, NEVER in the React frontend!
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
