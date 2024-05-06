// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const routes = require('./routes');

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(cors());

// app.use('/', routes);

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

const app = require('./app');
//const config = require('./config/config');

const PORT = 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});