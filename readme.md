### xfs
- simple read/write fs convention
- data is written in `.json` format and sufix, other formats such as [.md, text] are also supported

#### Methods
- `readFile(fileName):data`: returns any parsed data (`only for .json extention`)
- `writeFile(fileName,data):boolean`: returns true/false , will automaticly create base ./dir if doesnt exist

#### config options
- `xfs( { dir: config.dir, ext} )`
    * `dir:string` can supply absolute path, relative to application root
    *  `ext:String` can provide file extentions: `.json, .txt, .md` in `config.ext`, but will only parse data in `.json` extention

#### Example:
```js
    const xfs = require('./index')
    const config = {
        dir: path.join(__dirname,'./logs') // must provide full path to base dir, best put it to your root config.js file.
    }
    const { writeFile, readFile } = xfs({ dir: config.dir, ext:'.json'/* << default*/})

    writeFile('exampleOne', { value: 100, message: 'hello world' }) // true if successful 
    readFile('exampleOne') // { value: 100, message: 'hello world' }

    // more examples at `./examples.js`
```