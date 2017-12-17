/** ********* /CHAT ROUTE ********* **/

const express = require('express');
const router = express.Router();
const path = require('path');

// Set up route
router.get('/', (req, res, next) => {
    const msg = 'Opening chat page';
    console.log(msg);
    res.send(msg);
});

module.exports = router;