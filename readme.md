### xfs
- simple read/write fs convention
- data is written in `.json` format and sufix, other formats such as [.md, text] are also supported


#### Instalation
- currently dont have this on npm, best way to use it as an npm module is to install it this way:

```
/$ npm i git+https://bitbucket.org:eag1ex/xfs.git
```


#### Methods
- `readFile(fileName):data`: returns any parsed data (`only for .json extention`)
- `writeFile(fileName,data):boolean`: returns true/false , will automaticly create base ./dir if doesnt exist

#### config options
- `xfs( { dir: config.dir, ext} , cb()=>({dir,ext,path}) )`
    * `cb()=>({dir,path,ext}) ):Object` we can use callback, instead of providing `{dir,ext}`, this way we do not have to use `require('path')` to join then, or use of config.dir with full path, __thanks arrow/fn callback__ `{dir:_dirname}` > it gives us location relative to app. `xfs(cb,x)` or `xfs(x,cb)` args position dont matter, so no worry about placement. If you also declare {dir,ext}, callback takes priority, so those will be overriten.
        - `cb()=>({dir})`: include `__dirname`
        - `cb()=>({path})`: include the path name, examples: `./a`, `./a/b`, then both are joined by dir, when path isnt provided anywhere, `__dirname` location becomes your path.
        - `cb()=>({ext})`: file extention type.

    * `dir:string` can supply absolute path, relative to application root. __use only without cb__
    *  `ext:String` can provide file extentions: `.json, .txt, .md` in `config.ext`, but will only parse data in `.json` extention, __use only without cb__


#### Examples:
```js
   
function ExampleOne() {

    const xfs = require('xfs')
    const { writeFile, readFile } = xfs(
        () => ({ dir: __dirname, path: './logs/cache', ext: '.md' }),
        // { ext: '.json', dir:... } // NOTE  would be overriten by cb
    )
    console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
    console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }

}


function ExampleTwo() {

    const xfs = require('xfs')
    const path = require('path')
    const { writeFile, readFile } = xfs({ ext: '.md', dir: path.join(__dirname, './logs/cache') })
    console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
    console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }

}

// more examples at `./examples.js`
```