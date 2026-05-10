const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'https://fancy-caramel-73f3f0.netlify.app' }));
app.use(express.json());

app.use('/auth',  require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
