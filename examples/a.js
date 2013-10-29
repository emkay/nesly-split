var neslySplit = require('../index.js');
var fs = require('fs');

neslySplit(__dirname+'/sprites.nes', function (err, data) {
    var chr = fs.createWriteStream('test.chr');
    var prg = fs.createWriteStream('test.prg');
    chr.write(data.chr);
    prg.write(data.prg);
    console.log(data);
});
