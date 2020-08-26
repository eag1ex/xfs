const path = require('path')
module.exports  = {
    ext:'.json', // NOTE can provide other file formats, example :[.txt, .md] , but data will ntob e parsed
    dir:path.join(__dirname,'./logs')
}