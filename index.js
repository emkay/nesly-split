// file format chart: http://fms.komkon.org/EMUL8/NES.html#LABM

var fs = require('fs'),
    through = require('through');

module.exports = function (file, cb) {
    var rom = false;
    var exists = fs.existsSync(file);
    var prg;
    var chr;
    var byte6;
    
    var write = function (chunk) {
        // first 3 bytes should be NES
        var nesHeader = chunk.slice(0,3);
        if (nesHeader.toString() !== 'NES') console.log('WARN: might not be a NES file.');
        
        // inesprg: 1x 16KB PRG code
        prg = chunk.slice(4,5).toString('hex');

        // ineschr: 1x  8KB CHR data
        chr = chunk.slice(5,6).toString('hex');

        /*  bit 0 1 for vertical mirroring, 0 for horizontal mirroring.
            bit 1 1 for battery-backed RAM at $6000-$7FFF.
            bit 2 1 for a 512-byte trainer at $7000-$71FF.
            bit 3 1 for a four-screen VRAM layout.
            bit 4-7  Four lower bits of ROM Mapper Type.
         */
        byte6 = chunk.slice(6,7).toString();
    };

    var end = function () {
        if (chr && prg) {
            cb(null, {
                chr: chr, 
                prg: prg,
                byte6: byte6
            });
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
