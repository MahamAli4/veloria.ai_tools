const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'veloria-jwt-secret-key-123456789';

// Ensure media uploads folders exist
const UPLOADS_DIR = path.join(__dirname, 'media');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 1. Database Connection
const dbUser = process.env.DB_USER || process.env.POSTGRES_USER || 'django_user';
const dbPass = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'secure_password';
const dbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'veloria_db';
const dbHost = process.env.DB_HOST || 'db';
const dbPort = process.env.DB_PORT || '5432';

const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
console.log('Connecting to database:', connectionString.split('@')[1] || connectionString);

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

// 2. Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/media', express.static(UPLOADS_DIR));

// 3. Helper Cryptographic Functions for Django Password Hashes
function verifyDjangoPassword(password, djangoHash) {
  if (!djangoHash) return false;
  const parts = djangoHash.split('$');
  if (parts.length !== 4) return false;
  const [algorithm, iterations, salt, hash] = parts;
  if (algorithm !== 'pbkdf2_sha256') return false;
  
  const iter = parseInt(iterations, 10);
  const keylen = 32;
  const derivedKey = crypto.pbkdf2Sync(password, salt, iter, keylen, 'sha256');
  return derivedKey.toString('base64') === hash;
}

function hashDjangoPassword(password) {
  const salt = crypto.randomBytes(12).toString('base64');
  const iterations = 600000;
  const keylen = 32;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha256').toString('base64');
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

// 4. JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ detail: "Given token not valid for any token type" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ detail: "Authentication credentials were not provided." });
  }
};

const isAdminUser = (req, res, next) => {
  authenticateJWT(req, res, () => {
    if (req.user && req.user.is_admin) {
      next();
    } else {
      res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
  });
};

// 5. File Upload Configuration (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'uploads';
    const cleanFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '');
    const dest = path.join(UPLOADS_DIR, cleanFolder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


// ==================== API ENDPOINTS ====================

// --- AUTHENTICATION ---

// User Profile (Me)
app.get('/api/auth/me/', authenticateJWT, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    is_admin: req.user.is_admin
  });
});

// Login
app.post('/api/auth/token/', async (req, res) => {
  const { username, password } = req.data || req.body;
  if (!username || !password) {
    return res.status(400).json({ detail: "Username and password are required." });
  }

  try {
    const query = 'SELECT * FROM auth_user WHERE username = $1 OR email = $1';
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ detail: "No active account found with the given credentials" });
    }

    const user = result.rows[0];
    if (!verifyDjangoPassword(password, user.password)) {
      return res.status(401).json({ detail: "No active account found with the given credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username, is_admin: user.is_staff },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      access: accessToken,
      refresh: refreshToken
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup (Lockable)
app.post('/api/auth/signup/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 1. Block signup if any user already exists in DB
    const countCheck = await pool.query('SELECT count(*) FROM auth_user');
    const userCount = parseInt(countCheck.rows[0].count, 10);
    if (userCount > 0) {
      return res.status(400).json({ error: "Signup is disabled. An admin user has already been registered." });
    }

    // 2. Hash and save
    const hashedPassword = hashDjangoPassword(password);
    const insertQuery = `
      INSERT INTO auth_user (username, email, password, is_staff, is_superuser, is_active, date_joined, first_name, last_name)
      VALUES ($1, $1, $2, true, true, true, NOW(), '', '')
      RETURNING id, email, username, is_staff
    `;
    const result = await pool.query(insertQuery, [email, hashedPassword]);
    const newUser = result.rows[0];

    const accessToken = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username, is_admin: newUser.is_staff },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      { id: newUser.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      access: accessToken,
      refresh: refreshToken,
      message: "User created successfully"
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --- TOOLS ---

// List Tools
app.get('/api/tools/', async (req, res) => {
  let isAdmin = false;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.is_admin) isAdmin = true;
    } catch {}
  }

  try {
    const query = isAdmin 
      ? 'SELECT * FROM api_tool ORDER BY sort_order ASC, name ASC'
      : 'SELECT * FROM api_tool WHERE is_active = true ORDER BY sort_order ASC, name ASC';
    const result = await pool.query(query);
    
    // Ensure numeric prices are returned as strings (matching DRF format)
    const formatted = result.rows.map(item => ({
      ...item,
      original_price: String(item.original_price),
      our_price: String(item.our_price),
      benefits: item.benefits || [],
      features: item.features || [],
      advantages: item.advantages || [],
      use_cases: item.use_cases || [],
      plans: item.plans || [],
      faqs: item.faqs || [],
      categories: item.categories || []
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get tools error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Tool Details (By slug or UUID)
app.get('/api/tools/:slug/', async (req, res) => {
  const { slug } = req.params;
  try {
    let query = 'SELECT * FROM api_tool WHERE slug = $1';
    let values = [slug];
    
    // If slug is a valid UUID, search by ID instead
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slug)) {
      query = 'SELECT * FROM api_tool WHERE id = $1';
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ detail: "Not found." });
    }

    const item = result.rows[0];
    res.json({
      ...item,
      original_price: String(item.original_price),
      our_price: String(item.our_price),
      benefits: item.benefits || [],
      features: item.features || [],
      advantages: item.advantages || [],
      use_cases: item.use_cases || [],
      plans: item.plans || [],
      faqs: item.faqs || [],
      categories: item.categories || []
    });
  } catch (err) {
    console.error('Get tool error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Tool
app.post('/api/tools/', isAdminUser, async (req, res) => {
  const data = req.body;
  const newId = crypto.randomUUID();

  try {
    const fields = [
      'id', 'slug', 'name', 'mark', 'gradient', 'category', 'tagline', 'description', 
      'overview', 'what_it_does', 'who_for', 'original_price', 'our_price', 'duration', 
      'benefits', 'features', 'advantages', 'use_cases', 'plans', 'faqs', 'sort_order', 
      'is_active', 'image_url', 'logo_url', 'categories', 'currency', 'post_link', 'created_at', 'updated_at'
    ];

    const values = [
      newId, data.slug, data.name || '', data.mark || '', data.gradient || 'linear-gradient(135deg,#6d6eb0,#a5a6dc)',
      data.category || '', data.tagline || '', data.description || '', data.overview || '', data.what_it_does || '',
      data.who_for || '', data.original_price || 0.00, data.our_price || 0.00, data.duration || 'per month',
      JSON.stringify(data.benefits || []), JSON.stringify(data.features || []), JSON.stringify(data.advantages || []),
      JSON.stringify(data.use_cases || []), JSON.stringify(data.plans || []), JSON.stringify(data.faqs || []),
      data.sort_order || 0, data.is_active !== false, data.image_url || '', data.logo_url || '',
      JSON.stringify(data.categories || []), data.currency || 'USD', data.post_link || '', new Date(), new Date()
    ];

    const query = `
      INSERT INTO api_tool (${fields.join(', ')})
      VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create tool error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update Tool
app.patch('/api/tools/:slug/', isAdminUser, async (req, res) => {
  const { slug } = req.params;
  const data = req.body;

  try {
    let selectQuery = 'SELECT * FROM api_tool WHERE slug = $1';
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slug)) {
      selectQuery = 'SELECT * FROM api_tool WHERE id = $1';
    }

    const check = await pool.query(selectQuery, [slug]);
    if (check.rows.length === 0) {
      return res.status(404).json({ detail: "Not found." });
    }
    const tool = check.rows[0];

    const updates = [];
    const values = [];
    let paramIndex = 1;

    const skipFields = ['id', 'created_at'];
    for (const [key, val] of Object.entries(data)) {
      if (skipFields.includes(key)) continue;
      
      updates.push(`${key} = $${paramIndex}`);
      if (typeof val === 'object' && val !== null) {
        values.push(JSON.stringify(val));
      } else {
        values.push(val);
      }
      paramIndex++;
    }

    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    values.push(tool.id);
    const updateQuery = `
      UPDATE api_tool 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update tool error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete Tool
app.delete('/api/tools/:slug/', isAdminUser, async (req, res) => {
  const { slug } = req.params;
  try {
    let query = 'DELETE FROM api_tool WHERE slug = $1';
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slug)) {
      query = 'DELETE FROM api_tool WHERE id = $1';
    }

    const result = await pool.query(query, [slug]);
    res.status(204).end();
  } catch (err) {
    console.error('Delete tool error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --- TESTIMONIALS ---

// List Testimonials
app.get('/api/testimonials/', async (req, res) => {
  let isAdmin = false;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.is_admin) isAdmin = true;
    } catch {}
  }

  try {
    const query = isAdmin
      ? 'SELECT * FROM api_testimonial ORDER BY sort_order ASC, name ASC'
      : 'SELECT * FROM api_testimonial WHERE is_active = true ORDER BY sort_order ASC, name ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Get testimonials error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Testimonial
app.post('/api/testimonials/', isAdminUser, async (req, res) => {
  const data = req.body;
  const newId = crypto.randomUUID();
  try {
    const query = `
      INSERT INTO api_testimonial (id, name, role, quote, rating, avatar_url, is_active, sort_order, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    const values = [
      newId, data.name || '', data.role || '', data.quote || '', data.rating || 5,
      data.avatar_url || '', data.is_active !== false, data.sort_order || 0
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create testimonial error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update Testimonial
app.patch('/api/testimonials/:id/', isAdminUser, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, val] of Object.entries(data)) {
      if (['id', 'created_at'].includes(key)) continue;
      updates.push(`${key} = $${paramIndex}`);
      values.push(val);
      paramIndex++;
    }
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    values.push(id);
    const query = `
      UPDATE api_testimonial
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ detail: "Not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update testimonial error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete Testimonial
app.delete('/api/testimonials/:id/', isAdminUser, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM api_testimonial WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --- ORDERS ---

// List Orders
app.get('/api/orders/', isAdminUser, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM api_order ORDER BY created_at DESC');
    const formatted = result.rows.map(item => ({
      ...item,
      price: String(item.price)
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Order
app.post('/api/orders/', async (req, res) => {
  const data = req.body;
  const newId = crypto.randomUUID();
  try {
    const query = `
      INSERT INTO api_order (id, tool_slug, tool_name, plan_name, price, customer_name, customer_email, whatsapp, note, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW(), NOW())
      RETURNING *
    `;
    const values = [
      newId, data.tool_slug || '', data.tool_name || '', data.plan_name || '', data.price || 0.00,
      data.customer_name || '', data.customer_email || '', data.whatsapp || '', data.note || ''
    ];
    const result = await pool.query(query, values);
    const item = result.rows[0];
    res.status(201).json({
      ...item,
      price: String(item.price)
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update Order
app.patch('/api/orders/:id/', isAdminUser, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, val] of Object.entries(data)) {
      if (['id', 'created_at'].includes(key)) continue;
      updates.push(`${key} = $${paramIndex}`);
      values.push(val);
      paramIndex++;
    }
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    values.push(id);
    const query = `
      UPDATE api_order
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ detail: "Not found." });
    }
    const item = result.rows[0];
    res.json({
      ...item,
      price: String(item.price)
    });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(400).json({ error: err.message });
  }
});


// --- CONTACT MESSAGES ---

// List Contact Messages
app.get('/api/contact/', isAdminUser, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM api_contactmessage ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Contact Message
app.post('/api/contact/', async (req, res) => {
  const data = req.body;
  const newId = crypto.randomUUID();
  try {
    const query = `
      INSERT INTO api_contactmessage (id, name, email, message, is_read, created_at)
      VALUES ($1, $2, $3, $4, false, NOW())
      RETURNING *
    `;
    const values = [newId, data.name || '', data.email || '', data.message || ''];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create message error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update Contact Message (e.g. Mark as read)
app.patch('/api/contact/:id/', isAdminUser, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, val] of Object.entries(data)) {
      if (['id', 'created_at'].includes(key)) continue;
      updates.push(`${key} = $${paramIndex}`);
      values.push(val);
      paramIndex++;
    }

    values.push(id);
    const query = `
      UPDATE api_contactmessage
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ detail: "Not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update message error:', err);
    res.status(400).json({ error: err.message });
  }
});


// --- PAGE VIEWS ---

// List Views
app.get('/api/views/', isAdminUser, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM api_pageview ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get views error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Record Page View
app.post('/api/views/', async (req, res) => {
  const data = req.body;
  const newId = crypto.randomUUID();
  try {
    const query = `
      INSERT INTO api_pageview (id, path, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *
    `;
    const values = [newId, data.path || ''];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create view error:', err);
    res.status(400).json({ error: err.message });
  }
});


// --- GENERAL STATS ---

// Stats counts
app.get('/api/stats/', async (req, res) => {
  try {
    const toolsQuery = 'SELECT count(*) FROM api_tool WHERE is_active = true';
    const viewsQuery = 'SELECT count(*) FROM api_pageview';
    
    const [toolsRes, viewsRes] = await Promise.all([
      pool.query(toolsQuery),
      pool.query(viewsQuery)
    ]);

    res.json({
      tools: parseInt(toolsRes.rows[0].count, 10),
      customers: parseInt(viewsRes.rows[0].count, 10)
    });
  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --- FILE UPLOAD ---

// Asset Upload (Logo/Image)
app.post('/api/upload/', authenticateJWT, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate URL
  const folder = req.body.folder || 'uploads';
  const cleanFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '');
  const relativePath = `${cleanFolder}/${req.file.filename}`;
  const fileUrl = `${req.protocol}://${req.get('host')}/media/${relativePath}`;

  res.status(201).json({
    url: fileUrl,
    path: relativePath
  });
});


// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js API server running on port ${PORT}`);
});
