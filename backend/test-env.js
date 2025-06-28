// Test script to verify environment variables
require('dotenv').config();

console.log('🔍 Environment Variables Test');
console.log('=============================');

const requiredVars = [
  { name: 'MONGO_URI', value: process.env.MONGO_URI },
  { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY },
  { name: 'JWT_SECRET', value: process.env.JWT_SECRET },
  { name: 'PORT', value: process.env.PORT || '8000 (default)' }
];

requiredVars.forEach(({ name, value }) => {
  const status = value ? '✅' : '❌';
  const displayValue = value ? `${value.substring(0, 20)}...` : 'NOT SET';
  console.log(`${status} ${name}: ${displayValue}`);
});

console.log('\n📋 Summary:');
const missing = requiredVars.filter(v => !v.value && v.name !== 'PORT');
if (missing.length === 0) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log(`❌ Missing ${missing.length} required environment variable(s):`);
  missing.forEach(v => console.log(`   - ${v.name}`));
}

console.log('\n💡 If you see ❌ above, make sure your .env file exists and contains the required variables.'); 