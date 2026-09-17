const express = require('express');
const path = require('path');
const router = express.Router();

const HTML = path.join(__dirname, '..', 'public', 'html');

router.get('/', (_req, res) => res.redirect('/monitoring'));

router.get('/monitoring', (_req, res) => {
    res.sendFile(path.join(HTML, 'monitoring', 'index.html'));
});

router.get('/analysis/:page(data|graph|statistics)', (req, res) => {
    res.sendFile(path.join(HTML, 'analysis', `${req.params.page}.html`));
});

router.get('/analysis', (_req, res) => res.redirect('/analysis/data'));

module.exports = router;
