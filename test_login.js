const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yeeupdgjfrkkaurytyrs.supabase.co';
const supabaseKey = 'sb_publishable_XtR6TNbQPLwkwCeUOYWKEQ_g-8IStIc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@atpdev.dev',
    password: 'AdminPassword123!'
  });
  
  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('Login successful:', data.user?.email);
  }
}

login();
