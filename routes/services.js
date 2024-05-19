let express = require('express');
let router = express.Router();

// Get Services page
router.get('/', (req, res, next) => {
    res.send('This is the services page ! ! ');
})

module.exports = router;