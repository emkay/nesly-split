var neslySplit = require('../index.js');
var fs = require('fs');

neslySplit(__dirname+'/smb.nes', function (err, data) {
    var s = fs.createWriteStream('mario.chr');
    s.write(data.chr);
    console.log(data);
});
