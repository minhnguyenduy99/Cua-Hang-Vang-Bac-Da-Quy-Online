const User = require('./User');

exports.migrateUser = function(){
    User.sync({force: true});
}