/** ********* INDEX ROUTE ********* **/

const express = require('express');

const router = express.Router();
const path = require('path');

/**
 * Set up route
 * Note that 'index.html' is served by default for the '/' route as part of our express.static configuration in app.js.
 * However, it won't be served for any other routes, hence we need to tell express to send 'index.html' here.
 * */
router.get('/', (req, res, next) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../../dist'),
        maxAge: 31536000,
    }, (e) => {
        (e) ? next(e) : console.log('Successfully sent index.html');
    });
});

/**
 * A test middleware
 * */
router.get('/test', (req, res, next) => {
    console.log('Test route achieved');
    res.redirect('https://google.com');
});

// OLD ROUTE
/*router.get('/', (req, res, next) => {
    // It seems that we do not need any of these for now...Because our homepage is called 'index.html'
    const options = {
        // The folder where production files are
        root: path.join(__dirname, '../dist')
    };

    // Name of index.html
    const fileName = 'index.html';

    /!*res.sendFile(fileName, options, (e) => {
        (e) ? next(e) : console.log(`Sent ${fileName}`);
    });*!/
});*/

module.exports = router;