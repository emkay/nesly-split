var ns = require('..');
var fs = require('fs');

var test = require('tap').test;

test('basic tests', function (t) {
    ns(__dirname+'/sprites.nes', function (err, data) {
        t.ok(data, 'data is ok');
        t.ok(data.chr, 'chr is ok');
        t.ok(data.prg, 'prg is ok');
        t.equal(1, data.chrLen, '`chrLen` should equal 1');
        t.equal(8192, data.chrSize, '`chrSize` should equal 8192');
        t.equal(0, data.prgSize, '`prgSize` should be 0');
        t.equal(1, data.prgLen, '`prgLen` should be 1');
        t.ok(data.byte6, 'byte6 is ok');
        t.end();
    });
});
