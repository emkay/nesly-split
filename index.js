var fs = require('fs'),
    Buffer = require('buffer').Buffer,
    through = require('through');

module.exports = function (file, cb) {
    var rom = false;
    var exists = fs.existsSync(file);
    var prg;
    var chr;
    
    var write = function (chunk) {
        // first 3 bytes should be NES
        var nesHeader = chunk.slice(0,3);
        if (nesHeader.toString() !== 'NES') console.log('WARN: might not be a NES file.');
        
        // inesprg: 1x 16KB PRG code
        prg = chunk.slice(4,5).toString('hex');

        // ineschr: 1x  8KB CHR data
        chr = chunk.slice(5,6).toString('hex');
    };

    var end = function () {
        if (chr && prg) {
            cb(null, {chr: chr, prg: prg});
        } else {
            cb('Error: failed to parse chr and prg.');
        }
    };

    if (exists) {
        rom = fs.createReadStream(file, {
            start: 0,
            end: 15
        });

        rom.pipe(through(write, end));
    } else {
        cb('Error: File does not exist.');
    }
};
