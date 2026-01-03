// backend/test-new-format.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing New Supabase Format (SB_ keys)\n');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  console.log('1. Testing connection...');
  
  // Test 1: Simple query
  const { data, error } = await supabase
    .from('questions')
    .select('count(*)')
    .single();
    
  if (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Hint: Make sure table exists and RLS is configured');
  } else {
    console.log('✅ Connected! Table has', data.count, 'rows');
  }
  
  // Test 2: Insert test row
  console.log('\n2. Testing insert...');
  const { data: insertData, error: insertError } = await supabase
    .from('questions')
    .insert([
      {
        question: 'Test question',
        answer: 'Test answer'
      }
    ])
    .select();
    
  if (insertError) {
    console.log('❌ Insert failed:', insertError.message);
  } else {
    console.log('✅ Insert successful! ID:', insertData[0].id);
  }
  
  // Test 3: Fetch all rows
  console.log('\n3. Testing fetch...');
  const { data: allData, error: fetchError } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (fetchError) {
    console.log('❌ Fetch failed:', fetchError.message);
  } else {
    console.log(`✅ Fetched ${allData.length} rows`);
    console.log('Latest:', allData[0]?.question?.substring(0, 50));
  }
}

test();