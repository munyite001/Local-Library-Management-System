var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cool', (req, res, next) => {
  res.send('You are so cool');
})

router.get('/profile/:id', (req, res, next) => {
  res.send('You requested to see a profile with the id of ' + req.params.id);
})

module.exports = router;
