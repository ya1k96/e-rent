const app = require('./app');
const { PORT } = require('./config/development');

app.listen(PORT, () => console.log('Server on port: ' + PORT));