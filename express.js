const express = require('express');
const path = require('path');
const app = express();
const fallback = require('express-history-api-fallback');

app.use('/node_modules', express.static('node_modules'));

// app.get('/', (req, res) => {
//   res.sendFile(path.normalize(__dirname + '/dist/index.html'));
// });
app.use(express.static('dist'));
app.use(fallback('index.html', { root: 'dist' }));

app.listen(10009, function () {
  console.log('Example app listening on port 10009!');
});
