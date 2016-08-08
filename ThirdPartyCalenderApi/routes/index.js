var express = require('express');
var router = express.Router();
var auth = require('./auth');
var calenders = require('./calenders')
var user = require('./users');

router.post('/login', auth.login);
router.post('/logout', auth.logout);

/* Meetings routes */
router.get('/api/calenders', calenders.getAll);
router.get('/api/calenders/:id', calenders.get);
router.post('/api/calenders/', calenders.create);
router.put('/api/calenders/:id', calenders.update);
router.delete('/api/calenders/:id', calenders.delete);


module.exports = router;