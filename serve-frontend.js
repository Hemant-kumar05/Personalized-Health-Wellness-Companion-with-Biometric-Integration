const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
});