// file format chart: http://fms.komkon.org/EMUL8/NES.html#LABM

var fs = require('fs'),
    through = require('through');


function bytesToSize(bytes) {
    var kilobyte = 1024;
    return (kilobyte * bytes);
}

module.exports = function (file, cb) {
    var rom = false;
    var exists = fs.existsSync(file);
    var prgLen;
    var chrLen;
    var byte6;
    var chr;
     

    var write = function (chunk) {
        // first 3 bytes should be NES
        var nesHeader = chunk.slice(0,3);

        // TODO: this should be calculated with chrLen
        var chrSize = 8192;

        // TODO: this should be calculated with prgLen
        var prgSize = 32768;

        if (nesHeader.toString() !== 'NES') console.log('WARN: might not be a NES file.');
        
        // inesprg: 1x 16KB PRG code
        prgLen = chunk.slice(4,5).toString('hex');

        // ineschr: 1x  8KB CHR data
        chrLen = chunk.slice(5,6).toString('hex');

        /*  bit 0 1 for vertical mirroring, 0 for horizontal mirroring.
            bit 1 1 for battery-backed RAM at $6000-$7FFF.
            bit 2 1 for a 512-byte trainer at $7000-$71FF.
            bit 3 1 for a four-screen VRAM layout.
            bit 4-7  Four lower bits of ROM Mapper Type.
         */
        byte6 = chunk.slice(6,7).toString('hex');

        chr = chunk.slice(prgSize, prgSize + chrSize);
    };

    var end = function () {
        if (chrLen && prgLen && chr) {
            cb(null, {
                chr: chr,
                chrLen: chrLen, 
                prgLen: prgLen,
                byte6: byte6
            });
        } else {
            cb('Error: failed to parse chr and prg.');
        }
    };

    if (exists) {
        rom = fs.createReadStream(file);

        rom.pipe(through(write, end));
    } else {
        cb('Error: File does not exist.');
    }
};
