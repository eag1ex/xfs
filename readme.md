### xfs
- simple read/write fs convention
- data is written in `.json` format and sufix
- can provide other file formats, example :[.txt, .md] in `config.ext`, but it will not be parsed, except for `.json`

#### Methods
- `readFile(fileName)`: returns any parsed data
- `writeFile(fileName,data)`: returns true/false , will automaticly create base ./dir if doesnt exist

#### Example:
```js
    const xfs = require('./index')
    const config = {
        dir: path.join(__dirname,'./logs') // must provide full path to base dir, best put it to your root config.js file.
    }
    const { writeFile, readFile } = xfs({ dir: config.dir, ext:'.json'/* << default*/ })

    writeFile('exampleOne', { value: 100, message: 'hello world' }) // true if successful 
    readFile('exampleOne') // { value: 100, message: 'hello world' }

    // more examples at `./examples.js`
```