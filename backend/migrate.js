const { Client } = require('pg');

// Source Database (Neon)
const sourceConnectionString = 'postgresql://neondb_owner:npg_bISOiaF6fKT3@ep-calm-butterfly-ao76ebj3-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Target Database (Supabase)
const targetConnectionString = process.argv[2];

if (!targetConnectionString) {
  console.error('Error: Please provide your Supabase Connection String.');
  console.error('Usage: node backend/migrate.js "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"');
  process.exit(1);
}

const tableDefinitions = [
  {
    sourceName: 'api_tool',
    targetName: 'tools',
    idColumn: 'id',
    isSerial: false,
    columns: [
      'id', 'slug', 'name', 'mark', 'gradient', 'category', 'tagline', 'description', 
      'overview', 'what_it_does', 'who_for', 'original_price', 'our_price', 'duration', 
      'benefits', 'features', 'advantages', 'use_cases', 'plans', 'faqs', 'sort_order', 
      'is_active', 'image_url', 'logo_url', 'created_at', 'updated_at'
    ]
  },
  {
    sourceName: 'api_testimonial',
    targetName: 'testimonials',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'name', 'role', 'quote', 'rating', 'avatar_url', 'is_active', 'sort_order', 'created_at', 'updated_at']
  },
  {
    sourceName: 'api_order',
    targetName: 'orders',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'tool_slug', 'tool_name', 'plan_name', 'price', 'customer_name', 'customer_email', 'whatsapp', 'note', 'status', 'created_at', 'updated_at']
  },
  {
    sourceName: 'api_contactmessage',
    targetName: 'contact_messages',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'name', 'email', 'message', 'is_read', 'created_at']
  },
  {
    sourceName: 'api_pageview',
    targetName: 'page_views',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'path', 'created_at']
  }
];

async function migrate() {
  const sourceClient = new Client({
    connectionString: sourceConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  const targetClient = new Client({
    connectionString: targetConnectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Source Database (Neon)...');
    await sourceClient.connect();
    console.log('Connected to Source DB.');

    console.log('Connecting to Target Database (Supabase)...');
    await targetClient.connect();
    console.log('Connected to Target DB.');

    // 1. Truncate Target Tables to clear default/placeholder tools safely
    console.log('Truncating target tables to clear placeholders...');
    await targetClient.query('TRUNCATE TABLE tools, testimonials, orders, contact_messages, page_views CASCADE;');
    console.log('Target tables truncated.');

    // 2. Copy Data
    for (const table of tableDefinitions) {
      console.log(`Migrating data from ${table.sourceName} to ${table.targetName}...`);
      const sourceRes = await sourceClient.query(`SELECT * FROM ${table.sourceName}`);
      const rows = sourceRes.rows;
      console.log(`Found ${rows.length} rows in source table ${table.sourceName}.`);

      let migratedCount = 0;
      for (const row of rows) {
        // Double check existence on target (should be empty but good for safety)
        const checkRes = await targetClient.query(
          `SELECT 1 FROM ${table.targetName} WHERE ${table.idColumn} = $1`,
          [row[table.idColumn]]
        );

        if (checkRes.rows.length > 0) {
          continue;
        }

        const activeCols = table.columns.filter(col => row[col] !== undefined && row[col] !== null);
        const values = activeCols.map(col => {
          const val = row[col];
          // If it is object/array, format as JSON string
          if (val !== null && typeof val === 'object') {
            return JSON.stringify(val);
          }
          return val;
        });

        const placeholders = activeCols.map((_, i) => `$${i + 1}`).join(', ');
        const insertQuery = `INSERT INTO ${table.targetName} (${activeCols.join(', ')}) VALUES (${placeholders})`;

        await targetClient.query(insertQuery, values);
        migratedCount++;
      }
      console.log(`Successfully migrated ${migratedCount} rows into target ${table.targetName}.`);
    }

    console.log('\n🎉 DATABASE MIGRATION AND SYNCHRONIZATION COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  } finally {
    await sourceClient.end().catch(() => {});
    await targetClient.end().catch(() => {});
  }
}

migrate();
