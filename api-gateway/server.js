const path = require('path');
const gateway = require('express-gateway');
import '../services/chat/index.js';
import '../services/editor/index.js';
import '../services/matching/index.js';

gateway()
  .load(path.join(__dirname, 'config'))
  .run();
