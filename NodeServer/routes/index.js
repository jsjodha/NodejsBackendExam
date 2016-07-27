var express = require('express');
var router = express.Router();

var auth = require('./auth');
var meetings  = require('./meetings');
var user = require('./users');


router.post('/login', auth.login);
router.post('/logout', auth.logout);


/*
Meetings routes
 */
router.get('/api/meetings', meetings.getAllmeetings);
router.get('/api/meeting/:id', meetings.getmeeting);
router.post('/api/meeting/', meetings.create);
router.put('/api/meeting/:id', meetings.update);
router.delete('/api/meeting/:id', meetings.delete);


/* Routes for Administrations */
router.get('/api/admin/users', user.getAllUsers);
router.get('/api/admin/user/:id', user.getuser);
router.post('/api/admin/user/', user.create);
router.put('/api/admin/user/:id', user.update);
router.delete('/api/admin/user/:id', user.delete);



module.exports = router;