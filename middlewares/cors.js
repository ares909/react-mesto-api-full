const cors = require('cors')

const allowedCors = [
  'https://api.domainname.khomyakov.nomoredomains.icu',
  'http://api.domainname.khomyakov.nomoredomains.icu',
  'localhost:3000',
  'localhost:3005'
];

const corsOptions = {
  origin(origin, callback) {
    if (allowedCors.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

module.exports = cors(corsOptions);