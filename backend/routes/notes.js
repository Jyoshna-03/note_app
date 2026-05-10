const express  = require('express');
const protect  = require('../middleware/auth');
const supabase = require('../supabaseClient');
const router   = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', req.user.userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ notes: data });
});

router.post('/', async (req, res) => {
  const { title, body } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required.' });

  const { data, error } = await supabase
    .from('notes')
    .insert({ title, body, user_id: req.user.userId })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ note: data });
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Deleted.' });
});

module.exports = router;