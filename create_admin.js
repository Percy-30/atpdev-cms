const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yeeupdgjfrkkaurytyrs.supabase.co';
const supabaseKey = 'sb_publishable_XtR6TNbQPLwkwCeUOYWKEQ_g-8IStIc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@atpdev.dev',
    password: 'AdminPassword123!'
  });
  
  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully:', data.user?.email || data.user);
  }
}

createAdmin();
