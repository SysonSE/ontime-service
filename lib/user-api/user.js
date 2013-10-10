var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    age: Number
});
var User = mongoose.model('User', userSchema);

module.exports = User;