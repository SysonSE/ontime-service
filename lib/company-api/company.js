var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    name: String
});
var Company = mongoose.model('Company', companySchema);
module.exports = Company;