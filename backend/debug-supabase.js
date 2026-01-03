// backend/debug-supabase.js
require('dotenv').config();

console.log('=== SUPABASE URL DEBUG ===');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

console.log('URL:', url);
console.log('URL starts with https://:', url?.startsWith('https://'));
console.log('URL ends with .supabase.co:', url?.endsWith('.supabase.co'));
console.log('URL length:', url?.length);
console.log('Key starts with eyJ:', key?.startsWith('eyJ'));
console.log('Key length:', key?.length);

// Check for common issues
if (url) {
  if (url.includes(' ')) console.log('❌ ERROR: URL contains spaces!');
  if (!url.startsWith('https://')) console.log('❌ ERROR: URL must start with https://');
  if (!url.endsWith('.supabase.co')) console.log('❌ ERROR: URL must end with .supabase.co');
  if (url.includes('http://')) console.log('❌ ERROR: Use https:// not http://');
}

console.log('==========================');