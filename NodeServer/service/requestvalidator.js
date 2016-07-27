
var tokenprovider = require('../routes/tokens.js').isValidToken;

module.exports = function (req, res, next) {

     return tokenprovider(req,res,next);

};