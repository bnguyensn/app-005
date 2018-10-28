/** ********* DOWNLOAD TEMPLATE ROUTE ********* **/

const express = require('express');

const router = express.Router();
const path = require('path');

/**
 * Set up route
 * Note that 'index.html' is served by default for the '/' route as part of our express.static configuration in app.js.
 * However, it won't be served for any other routes, hence we need to tell express to send 'index.html' here.
 * */
router.get('/downloadtemplate', (req, res, next) => {
    res.download('../files/data_template_g7.xlsx',
        (e) => {
            e ? next(e) : console.log('Successfully sent template.');
        });
});

module.exports = router;
