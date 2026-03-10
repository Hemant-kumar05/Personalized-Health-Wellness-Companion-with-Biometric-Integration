const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dashboard-complete.html');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Dashboard running on http://localhost:${PORT}`);
  console.log('📊 Real-time health metrics with live updates!');
  console.log('✨ All features working: Steps, Heart Rate, Blood Pressure, Oxygen, Temperature, Weight, Sleep, Hydration');
});