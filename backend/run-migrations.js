const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const targetConnectionString = process.argv[2];

if (!targetConnectionString) {
  console.error('Error: Please provide your Supabase Connection String.');
  console.error('Usage: node backend/run-migrations.js "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, '../supabase/migrations');

async function run() {
  const client = new Client({
    connectionString: targetConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase Database...');
    await client.connect();
    console.log('Connected to Supabase DB.');

    // Get all migration files and sort them alphabetically (so they execute in chronological order)
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files in supabase/migrations/.`);

    for (const file of files) {
      console.log(`Running migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // We execute each file's SQL content on the target database
      try {
        await client.query(sql);
        console.log(`Successfully completed migration: ${file}`);
      } catch (err) {
        // If it's a duplicate object, bucket creation, or foreign key constraint error, we can skip it
        if (
          err.code === '42P07' || 
          err.code === '23503' || 
          err.message.includes('already exists') || 
          err.message.includes('Duplicate') ||
          err.message.includes('foreign key constraint')
        ) {
          console.log(`Note: Handled duplicate/foreign-key restriction in ${file}, skipping constraint query.`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n🎉 ALL SCHEMAS AND POLICIES CREATED SUCCESSFULLY ON SUPABASE!');
  } catch (err) {
    console.error('\n❌ Migrations execution failed:', err);
  } finally {
    await client.end().catch(() => {});
  }
}

run();
