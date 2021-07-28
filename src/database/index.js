const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongodb://db:27017/blog-mongodb - caso container docker
// mongodb://localhost:27018/blog-api - caso desenvolvimento local
mongoose.connect('mongodb://db:27017/blog-mongodb', 
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = mongoose;