// file format chart: http://fms.komkon.org/EMUL8/NES.html#LABM

var fs = require('fs');
var through = require('through');

module.exports = function (file, cb) {
    var rom = false;
    var exists = fs.existsSync(file);

    var prgSize = 0;
    var chrSize = 0;

    var chrBlockSize = 8192;
    var prgBlockSize = 16384;

    var nesHeader;
    var prgLen;
    var prgStart;
    var chrLen;
    var chrStart;
    var byte6;
    var chr;
    var prg;
    var endBytes;

    var romBuffers = [];
     

    var write = function (chunk) {
        romBuffers.push(chunk);

        if (!nesHeader) {
            // first 3 bytes should be NES
            nesHeader = chunk.slice(0,3);

            if (nesHeader.toString() !== 'NES') console.log('WARN: might not be a NES file.');

            // inesprg: 1x 16KB PRG code
            prgLen = parseInt(chunk.slice(4,5).toString('hex'), 16);

            // ineschr: 1x  8KB CHR data
            chrLen = parseInt(chunk.slice(5,6).toString('hex'), 16);
            prgSize = prgBlockSize * prgLen;
            chrSize = chrBlockSize * chrLen;
            /*  bit 0 1 for vertical mirroring, 0 for horizontal mirroring.
                bit 1 1 for battery-backed RAM at $6000-$7FFF.
                bit 2 1 for a 512-byte trainer at $7000-$71FF.
                bit 3 1 for a four-screen VRAM layout.
                bit 4-7  Four lower bits of ROM Mapper Type.
            */
            byte6 = chunk.slice(6,7);
        }

        if (!prg) {
            prgStart = 7;
            if (chunk.length <= prgSize) {
                prg = chunk.slice(prgStart, prgSize - chunk.length);
                prgSize -= chunk.length;
            } else {
                prg = chunk.slice(prgStart, prgSize);
                chrStart = prgSize;
                chr = chunk.slice(chrStart, prgSize + chrSize);
                endBytes = chunk.slice(prgSize + chrSize, chunk.length);
                prgSize = 0;
            }
        } else if (prgSize > 0) {
            if (chunk.length >= prgSize) {
                prg = Buffer.concat([prg, chunk.slice(0, prgSize - chunk.length)]);
                prgSize -= chunk.length;
            } else {
                prg = Buffer.concat([prg, chunk.slice(0, prgSize)]);
                prgSize = 0;
            }
        }

        if (!chr && chrSize !== 0 && prgSize === 0) {
            chrStart = 0;
            chr = chunk.slice(chrStart, chrSize);
            endBytes = chunk.slice(chrSize, chunk.length);
        }
    };

    var end = function () {
        if (chrLen && prgLen && chr) {
            cb(null, {
                nesHeader: nesHeader,
                prg: prg,
                chr: chr,
                chrLen: chrLen, 
                chrStart: chrStart,
                chrSize: chrSize,
                prgSize: prgSize,
                prgStart: prgStart,
                prgLen: prgLen,
                byte6: byte6,
                endBytes: endBytes,
                rom: Buffer.concat(romBuffers)
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
