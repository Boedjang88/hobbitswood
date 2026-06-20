const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const envPath = path.join(__dirname, '../.env');

// Read current schema
let schema = fs.readFileSync(schemaPath, 'utf8');
if (!schema.includes('provider = "sqlite"')) {
  console.log('Error: Schema is not using SQLite. Is it already PostgreSQL?');
  process.exit(1);
}

// Change to PostgreSQL
console.log('1. Modifying schema.prisma to use PostgreSQL...');
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync(schemaPath, schema);

// Temporarily point DATABASE_URL to Supabase
console.log('2. Temporarily overriding DATABASE_URL to use Supabase...');
let envContent = fs.readFileSync(envPath, 'utf8');
const backupEnv = envContent;

const supabaseUrlMatch = envContent.match(/SUPABASE_DATABASE_URL="(.*)"/);
const supabaseDirectMatch = envContent.match(/SUPABASE_DIRECT_URL="(.*)"/);

if (!supabaseUrlMatch) {
  console.error('Error: SUPABASE_DATABASE_URL not found in .env');
  // Revert schema
  schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema);
  process.exit(1);
}

envContent = envContent.replace(/DATABASE_URL="file:\.\/dev\.db"/, `DATABASE_URL="${supabaseUrlMatch[1]}"\nDIRECT_URL="${supabaseDirectMatch ? supabaseDirectMatch[1] : supabaseUrlMatch[1]}"`);
fs.writeFileSync(envPath, envContent);

try {
  console.log('3. Running Prisma db push to Supabase...');
  // Force Prisma to push to Supabase
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('\n✅ Successfully pushed schema to Supabase!');
} catch (error) {
  console.error('\n❌ Failed to push schema to Supabase.');
} finally {
  console.log('4. Reverting schema.prisma and .env back to local SQLite...');
  // Revert schema
  schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema);

  // Revert .env
  fs.writeFileSync(envPath, backupEnv);

  console.log('Done! You are back on local SQLite.');
}
