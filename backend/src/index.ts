import { Hono } from 'hono';
import { cors } from 'hono/cors';
import 'dotenv/config';
import { query } from './db';
import { authMiddleware, getUser } from './middleware/auth';
import { generateToken, generateRefreshToken, verifyRefreshToken } from './jwt';
import bcrypt from 'bcryptjs';

const app = new Hono();
const PORT = parseInt(process.env.PORT || '3001', 10);

// CORS configuration
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL || '*'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-JSON-Type'],
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, full_name, role } = await c.req.json();

    if (!email || !password || !full_name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, hashedPassword, full_name, role || 'client']
    );

    const user = result.rows[0];
    const accessToken = generateToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    return c.json(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    // Find user
    const result = await query('SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const accessToken = generateToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    return c.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

app.post('/api/auth/refresh', async (c) => {
  try {
    const { refresh_token } = await c.req.json();

    if (!refresh_token) {
      return c.json({ error: 'Missing refresh token' }, 400);
    }

    const payload = verifyRefreshToken(refresh_token);
    const accessToken = generateToken({ id: payload.id, email: payload.email });

    return c.json({ access_token: accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
});

app.post('/api/auth/logout', async (c) => {
  // Logout is typically handled on client side (removing tokens)
  return c.json({ message: 'Logged out successfully' });
});

// ============================================
// USER ROUTES
// ============================================

app.get('/api/users/profile', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const result = await query('SELECT id, email, full_name, avatar_url, bio, role, created_at FROM users WHERE id = $1', [
      user.id,
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

app.patch('/api/users/profile', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const { full_name, bio, avatar_url } = await c.req.json();

    let updateQuery = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [];
    let paramCount = 1;

    if (full_name !== undefined) {
      updateQuery += `, full_name = $${paramCount}`;
      params.push(full_name);
      paramCount++;
    }
    if (bio !== undefined) {
      updateQuery += `, bio = $${paramCount}`;
      params.push(bio);
      paramCount++;
    }
    if (avatar_url !== undefined) {
      updateQuery += `, avatar_url = $${paramCount}`;
      params.push(avatar_url);
      paramCount++;
    }

    updateQuery += ` WHERE id = $${paramCount} RETURNING id, email, full_name, avatar_url, bio, role, created_at`;
    params.push(user.id);

    const result = await query(updateQuery, params);
    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ============================================
// PROFESSIONALS ROUTES
// ============================================

app.get('/api/professionals', async (c) => {
  try {
    const search = c.req.query('search');
    const minPrice = c.req.query('min_price');
    const maxPrice = c.req.query('max_price');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = parseInt(c.req.query('offset') || '0');

    let sql =
      'SELECT p.id, p.user_id, p.title, p.bio, p.categories, p.hourly_rate, p.location, p.is_verified, p.is_available, p.created_at, COALESCE(AVG(r.rating), 0) as rating, COUNT(r.id) as reviews_count FROM professionals p LEFT JOIN reviews r ON p.id = r.professional_id WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      sql += ` AND (p.title ILIKE $${paramCount} OR p.bio ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (minPrice) {
      sql += ` AND p.hourly_rate >= $${paramCount}`;
      params.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      sql += ` AND p.hourly_rate <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
      paramCount++;
    }

    sql += ` GROUP BY p.id ORDER BY rating DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return c.json(result.rows);
  } catch (error) {
    console.error('Search professionals error:', error);
    return c.json({ error: 'Failed to search professionals' }, 500);
  }
});

app.get('/api/professionals/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await query(
      'SELECT p.*, COALESCE(AVG(r.rating), 0) as rating, COUNT(r.id) as reviews_count FROM professionals p LEFT JOIN reviews r ON p.id = r.professional_id WHERE p.id = $1 GROUP BY p.id',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Professional not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Get professional error:', error);
    return c.json({ error: 'Failed to get professional' }, 500);
  }
});

app.post('/api/professionals', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const { title, bio, categories, hourly_rate, location } = await c.req.json();

    // Check if user already has a professional profile
    const existing = await query('SELECT id FROM professionals WHERE user_id = $1', [user.id]);
    if (existing.rows.length > 0) {
      return c.json({ error: 'User already has a professional profile' }, 400);
    }

    const result = await query(
      'INSERT INTO professionals (user_id, title, bio, categories, hourly_rate, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.id, title, bio, categories || [], hourly_rate, location]
    );

    return c.json(result.rows[0], 201);
  } catch (error) {
    console.error('Create professional error:', error);
    return c.json({ error: 'Failed to create professional profile' }, 500);
  }
});

app.patch('/api/professionals/:id', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const id = c.req.param('id');
    const { title, bio, categories, hourly_rate, location, is_available } = await c.req.json();

    // Check ownership
    const existing = await query('SELECT user_id FROM professionals WHERE id = $1', [id]);
    if (existing.rows.length === 0 || existing.rows[0].user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    let updateQuery = 'UPDATE professionals SET updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateQuery += `, title = $${paramCount}`;
      params.push(title);
      paramCount++;
    }
    if (bio !== undefined) {
      updateQuery += `, bio = $${paramCount}`;
      params.push(bio);
      paramCount++;
    }
    if (categories !== undefined) {
      updateQuery += `, categories = $${paramCount}`;
      params.push(categories);
      paramCount++;
    }
    if (hourly_rate !== undefined) {
      updateQuery += `, hourly_rate = $${paramCount}`;
      params.push(hourly_rate);
      paramCount++;
    }
    if (location !== undefined) {
      updateQuery += `, location = $${paramCount}`;
      params.push(location);
      paramCount++;
    }
    if (is_available !== undefined) {
      updateQuery += `, is_available = $${paramCount}`;
      params.push(is_available);
      paramCount++;
    }

    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);

    const result = await query(updateQuery, params);
    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Update professional error:', error);
    return c.json({ error: 'Failed to update professional' }, 500);
  }
});

// ============================================
// PORTFOLIO ROUTES
// ============================================

app.get('/api/professionals/:id/portfolio', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await query(
      'SELECT id, professional_id, photo_url, title, description, created_at FROM portfolio WHERE professional_id = $1 ORDER BY created_at DESC',
      [id]
    );

    return c.json(result.rows);
  } catch (error) {
    console.error('Get portfolio error:', error);
    return c.json({ error: 'Failed to get portfolio' }, 500);
  }
});

app.post('/api/professionals/:id/portfolio', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const professionalId = c.req.param('id');
    const body = await c.req.json();
    const { photo_url, title, description } = body;

    // Verify ownership
    const prof = await query('SELECT user_id FROM professionals WHERE id = $1', [professionalId]);
    if (prof.rows.length === 0 || prof.rows[0].user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const result = await query(
      'INSERT INTO portfolio (professional_id, photo_url, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [professionalId, photo_url, title, description]
    );

    return c.json(result.rows[0], 201);
  } catch (error) {
    console.error('Create portfolio error:', error);
    return c.json({ error: 'Failed to create portfolio' }, 500);
  }
});

app.delete('/api/professionals/:id/portfolio/:photoId', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const photoId = c.req.param('photoId');

    // Verify ownership
    const portfolio = await query(
      'SELECT p.professional_id FROM portfolio p JOIN professionals prof ON p.professional_id = prof.id WHERE p.id = $1 AND prof.user_id = $2',
      [photoId, user.id]
    );

    if (portfolio.rows.length === 0) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    await query('DELETE FROM portfolio WHERE id = $1', [photoId]);
    return c.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    return c.json({ error: 'Failed to delete portfolio' }, 500);
  }
});

// ============================================
// REVIEWS ROUTES
// ============================================

app.get('/api/professionals/:id/reviews', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await query(
      'SELECT r.id, r.professional_id, r.client_id, r.rating, r.comment, r.created_at, u.full_name, u.avatar_url FROM reviews r JOIN users u ON r.client_id = u.id WHERE r.professional_id = $1 ORDER BY r.created_at DESC',
      [id]
    );

    return c.json(result.rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    return c.json({ error: 'Failed to get reviews' }, 500);
  }
});

app.get('/api/professionals/:id/rating-stats', async (c) => {
  try {
    const id = c.req.param('id');
    const result = await query(
      `
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews,
        json_object_agg(rating, count) as distribution
      FROM (
        SELECT rating, COUNT(*) as count FROM reviews WHERE professional_id = $1 GROUP BY rating
      ) sub
    `,
      [id]
    );

    const stats = result.rows[0];
    return c.json({
      average_rating: parseFloat(stats.average_rating),
      total_reviews: parseInt(stats.total_reviews),
      distribution: stats.distribution || {},
    });
  } catch (error) {
    console.error('Get rating stats error:', error);
    return c.json({ error: 'Failed to get rating stats' }, 500);
  }
});

app.post('/api/reviews', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const { professional_id, rating, comment } = await c.req.json();

    if (!professional_id || !rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Invalid review data' }, 400);
    }

    // Check if professional exists
    const prof = await query('SELECT id FROM professionals WHERE id = $1', [professional_id]);
    if (prof.rows.length === 0) {
      return c.json({ error: 'Professional not found' }, 404);
    }

    const result = await query(
      'INSERT INTO reviews (professional_id, client_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [professional_id, user.id, rating, comment]
    );

    return c.json(result.rows[0], 201);
  } catch (error) {
    console.error('Create review error:', error);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

// ============================================
// MESSAGES ROUTES
// ============================================

app.get('/api/messages/conversations', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const result = await query(
      `
      SELECT 
        CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as user_id,
        (ARRAY_AGG(m.* ORDER BY m.created_at DESC))[1] as last_message,
        COUNT(CASE WHEN (receiver_id = $1 AND read_at IS NULL) THEN 1 END) as unread_count
      FROM messages m
      WHERE sender_id = $1 OR receiver_id = $1
      GROUP BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
      ORDER BY (ARRAY_AGG(m.* ORDER BY m.created_at DESC))[1]->>'created_at' DESC
    `,
      [user.id]
    );

    return c.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    return c.json({ error: 'Failed to get conversations' }, 500);
  }
});

app.get('/api/messages/conversation/:userId', authMiddleware, async (c) => {
  try {
    const currentUser = getUser(c);
    const otherUserId = c.req.param('userId');

    const result = await query(
      `
      SELECT id, sender_id, receiver_id, content, created_at, read_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `,
      [currentUser.id, otherUserId]
    );

    return c.json(result.rows);
  } catch (error) {
    console.error('Get conversation error:', error);
    return c.json({ error: 'Failed to get conversation' }, 500);
  }
});

app.post('/api/messages', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const { receiver_id, content } = await c.req.json();

    if (!receiver_id || !content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [user.id, receiver_id, content]
    );

    return c.json(result.rows[0], 201);
  } catch (error) {
    console.error('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

app.patch('/api/messages/:id/read', authMiddleware, async (c) => {
  try {
    const user = getUser(c);
    const messageId = c.req.param('id');

    // Verify user is the receiver
    const msg = await query('SELECT receiver_id FROM messages WHERE id = $1', [messageId]);
    if (msg.rows.length === 0 || msg.rows[0].receiver_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const result = await query('UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [
      messageId,
    ]);

    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Mark as read error:', error);
    return c.json({ error: 'Failed to mark message as read' }, 500);
  }
});

// Error handling
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Start server
const server = Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`[Server] Starting ProConnect backend on port ${PORT}...`);
console.log(`[Server] URL: http://localhost:${PORT}`);
