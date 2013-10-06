exports.index = function(req, res){
  res.send('this is an awesome service.');
}

exports.companies = function(db) {
    return function(req, res) {
        var collection = db.get('company');

        collection.find({}, {}, function(e, docs){
            var json = JSON.stringify(docs);
            res.send(json);
        });
    };
};

exports.companiesByOrgNr = function(db) {
    return function(req, res) {
        var companies = db.get('company');

        companies.find({'orgnummer' : req.params.orgnr}, '-email', function(e, docs) {
            var json = JSON.stringify(docs);
            res.send(json);
        });
    };
}
