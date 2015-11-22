var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ModelSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('model', ModelSchema);
