var neslySplit = require('../index.js');

neslySplit(__dirname+'/sprites.nes', function (err, data) {
    console.log(data);
});
