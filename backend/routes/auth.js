const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const supabase = require('../supabaseClient');
const router   = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required.' });

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be 6+ characters.' });

  const hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password_hash: hash })
    .select('id, name, email')
    .single();

  if (error) {
    if (error.code === '23505')
      return res.status(400).json({ error: 'Email already registered.' });
    return res.status(500).json({ error: error.message });
  }

  const token = jwt.sign(
    { userId: data.id, email: data.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, user: data });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required.' });

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user)
    return res.status(401).json({ error: 'Invalid email or password.' });

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match)
    return res.status(401).json({ error: 'Invalid email or password.' });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

module.exports = router;