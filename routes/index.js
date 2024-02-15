var express = require('express');
var router = express.Router();
var cors = require('cors');

var corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost',
  optionsSuccessStatus: 200
}

/* GET home page. */
router.get('/', cors(corsOptions), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res, next) {

});

module.exports = router;
