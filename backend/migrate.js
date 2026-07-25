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
    name: 'auth_user',
    idColumn: 'id',
    isSerial: true,
    columns: ['id', 'username', 'email', 'password', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'first_name', 'last_name'],
    ddl: `
      CREATE TABLE IF NOT EXISTS auth_user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(150) UNIQUE NOT NULL,
        email VARCHAR(254) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        is_superuser BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        first_name VARCHAR(150) DEFAULT '',
        last_name VARCHAR(150) DEFAULT ''
      );
    `
  },
  {
    name: 'api_tool',
    idColumn: 'id',
    isSerial: false,
    columns: [
      'id', 'slug', 'name', 'mark', 'gradient', 'category', 'tagline', 'description', 
      'overview', 'what_it_does', 'who_for', 'original_price', 'our_price', 'duration', 
      'benefits', 'features', 'advantages', 'use_cases', 'plans', 'faqs', 'sort_order', 
      'is_active', 'image_url', 'logo_url', 'categories', 'currency', 'post_link', 'created_at', 'updated_at'
    ],
    ddl: `
      CREATE TABLE IF NOT EXISTS api_tool (
        id UUID PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        mark VARCHAR(255) DEFAULT '',
        gradient VARCHAR(255) DEFAULT 'linear-gradient(135deg,#6d6eb0,#a5a6dc)',
        category VARCHAR(255) DEFAULT '',
        tagline VARCHAR(500) DEFAULT '',
        description TEXT DEFAULT '',
        overview TEXT DEFAULT '',
        what_it_does TEXT DEFAULT '',
        who_for TEXT DEFAULT '',
        original_price NUMERIC(10, 2) DEFAULT 0.00,
        our_price NUMERIC(10, 2) DEFAULT 0.00,
        duration VARCHAR(100) DEFAULT 'per month',
        benefits JSONB DEFAULT '[]'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        advantages JSONB DEFAULT '[]'::jsonb,
        use_cases JSONB DEFAULT '[]'::jsonb,
        plans JSONB DEFAULT '[]'::jsonb,
        faqs JSONB DEFAULT '[]'::jsonb,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(500) DEFAULT '',
        logo_url VARCHAR(500) DEFAULT '',
        categories JSONB DEFAULT '[]'::jsonb,
        currency VARCHAR(10) DEFAULT 'USD',
        post_link VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'api_testimonial',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'name', 'role', 'quote', 'rating', 'avatar_url', 'is_active', 'sort_order', 'created_at', 'updated_at'],
    ddl: `
      CREATE TABLE IF NOT EXISTS api_testimonial (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) DEFAULT '',
        quote TEXT DEFAULT '',
        rating INTEGER DEFAULT 5,
        avatar_url VARCHAR(500) DEFAULT '',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'api_order',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'tool_slug', 'tool_name', 'plan_name', 'price', 'customer_name', 'customer_email', 'whatsapp', 'note', 'status', 'created_at', 'updated_at'],
    ddl: `
      CREATE TABLE IF NOT EXISTS api_order (
        id UUID PRIMARY KEY,
        tool_slug VARCHAR(255) NOT NULL,
        tool_name VARCHAR(255) NOT NULL,
        plan_name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) DEFAULT 0.00,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(100) NOT NULL,
        note TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'api_contactmessage',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'name', 'email', 'message', 'is_read', 'created_at'],
    ddl: `
      CREATE TABLE IF NOT EXISTS api_contactmessage (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    name: 'api_pageview',
    idColumn: 'id',
    isSerial: false,
    columns: ['id', 'path', 'created_at'],
    ddl: `
      CREATE TABLE IF NOT EXISTS api_pageview (
        id UUID PRIMARY KEY,
        path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
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

    // 0. Drop incorrect tables on Target if they exist to clear bad schemas
    console.log('Cleaning up any existing incorrect tables on Target...');
    await targetClient.query('DROP TABLE IF EXISTS api_tool, api_testimonial, api_order, api_contactmessage, api_pageview CASCADE;');

    // 1. Create Tables
    for (const table of tableDefinitions) {
      console.log(`Creating table ${table.name} on Target if not exists...`);
      await targetClient.query(table.ddl);
    }
    console.log('All tables created successfully.');

    // 2. Copy Data
    for (const table of tableDefinitions) {
      console.log(`Migrating data for ${table.name}...`);
      const sourceRes = await sourceClient.query(`SELECT * FROM ${table.name}`);
      const rows = sourceRes.rows;
      console.log(`Found ${rows.length} rows in ${table.name} from source.`);

      let migratedCount = 0;
      for (const row of rows) {
        // Check if row already exists
        const checkRes = await targetClient.query(
          `SELECT 1 FROM ${table.name} WHERE ${table.idColumn} = $1`,
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
        const insertQuery = `INSERT INTO ${table.name} (${activeCols.join(', ')}) VALUES (${placeholders})`;

        await targetClient.query(insertQuery, values);
        migratedCount++;
      }
      console.log(`Migrated ${migratedCount} new rows to ${table.name}.`);

      // 3. Reset sequence for serial tables
      if (table.isSerial && rows.length > 0) {
        console.log(`Resetting primary key auto-increment sequence for ${table.name}...`);
        await targetClient.query(
          `SELECT setval(pg_get_serial_sequence($1, $2), coalesce(max(${table.idColumn}), 1)) FROM ${table.name}`,
          [table.name, table.idColumn]
        );
      }
    }

    console.log('\n🎉 DATABASE MIGRATION COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  } finally {
    await sourceClient.end().catch(() => {});
    await targetClient.end().catch(() => {});
  }
}

migrate();
