nesly-split
===========

split out the CHR and PRG of a NES Rom

## Install
`npm i nesly-split`

## Example

```
var neslySplit = require('nesly-split');
var fs = require('fs');

var s = fs.createWriteStream('mario.chr');

neslySplit('smb.nes', function (err, data) {
    if (!err) {
      s.write(data.chr);
    }
});
```

Now you can open up `mario.chr` in your favorite NES CHR editor
and you should see all the sprites in the game!
