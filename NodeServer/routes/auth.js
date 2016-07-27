
var tokenprovider = require('./tokens');

var auth = {
    login: function (req, res) {
        return tokenprovider.create(req,res);
    },
    logout: function (req, res) {       
       return tokenprovider.delete(req,res);
    }

}


module.exports = auth;