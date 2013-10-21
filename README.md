nesly-split
===========

split out the CHR and PRG of a NES Rom

## Install
`npm i nesly-split`

## Example

```
var neslySplit = require('nesly-split');

neslySplit('smb.nes', function (err, data) {
    if (!err) {
      console.log(data);
    }
});
```
