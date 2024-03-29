### xfs
####  [ Developed by Eaglex ](http://eaglex.net)

##### LICENSE
* LICENCE: CC BY-NC-ND
* SOURCE: _(https://creativecommons.org/licenses/by-nc-nd/4.0/)_

### About
* simple read/write file system (fs) conventions
* data is written in `.json` format and suffix, other formats such as [.md, text] are also supported


#### Installation
- currently dont have this on npm, best way to use it as an npm module is to install it this way:

```
/$ npm i git+https://bitbucket.org:eag1ex/xfs.git
```

#### config options
- `xfs( { dir: config.dir, ext, path,silent,pretty} , cb()=>({dir,ext,path}) )`
    * `cb()=>({dir,path,ext}) ):Object` we can use callback, instead of providing `{dir,ext,(optional {path} )}`, this way we do not have to use `require('path')` to join then, or use of config.dir with full path, __thanks arrow/fn callback__ `{dir:_dirname}` > it gives us location relative to app. `xfs(cb,x)` or `xfs(x,cb)` args position dont matter, so no worry about placement. If you also declare {dir,ext}, callback takes priority, so those will be overriten.
        - `cb()=>({dir})`: include `__dirname`
        - `cb()=>({path})`: include the path name, examples: `./a`, `./a/b`, then both are joined by dir, when path isnt provided anywhere, `__dirname` location becomes your path.
        - `cb()=>({ext})`: file extension type.
    * `pretty:boolean`: Beautify json output, only works with ext:`.json` option
    * `dir:string` can supply absolute path, relative to application root. __use only without cb__
    *  `ext:String` can provide file extensions: `.json, .txt, .md` in `config.ext`, but will only parse data in `.json` extension, __use only without cb__
    * `silent:boolean` disable all logging, including errors


#### Methods
- `checkFilePermissions(fileName, otherDir, _ext, _silent)` : check file permissions, returns `{file, perms}`
- `removeFile(fileName, otherDir, _ext, _silen)` : remove file from dir
- `dirList(otherDir, _ext, _silent)` : returns array with list files in given dir, based on file type specified, only files are listed, dir>dir are ignored
- `readFile(fileName,otherDir,_ext, silent):data`: returns any parsed data (`only for .json extension`)
- `writeFile(fileName,data,otherDir, _ext,silent):boolean`: returns true/false , will automatically create base ./dir if doesnt exist
- `appendFile(fileName,data,otherDir, _ext,silent):boolean`: returns true/false , will automatically create base ./dir if doesnt exist, appends data if file already exists, can only accept text data, excluding json
- `fullPath({ dirLocation, fileName },silent):string`: returns fullPath 
- `loadFileBatch(filePrefix,otherDir):[..]` : loads any .json files from our config dir. Returns parsed data of all available json files.
    * `filePrefix` : match all files with given prefix in the dir
    * `otherDir` : provide optional dir other then our/current 
- `removeDir(dirName, otherFullPath, _silent)` : remove dir by name    
- `listFolders(otherDir, _silent)`: list all folders in the given directory, returns array with full paths

#### Examples:
```js
   
function ExampleOne() {

    const xfs = require('xfs')
    const { writeFile, readFile,removeFile } = xfs(
        () => ({ dir: __dirname, path: './logs/cache', ext: '.json' }),
        // { ext: '.json', dir:... } // NOTE  would be overriten by cb
    )
    console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
    console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }
    

    // removeFile('exampleOne') // true , would remove above file
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

#### Logs:
- improved performance, by changing fs.readFileSync to require() for only json and js files

#### Contact

Have questions, or would like to submit feedback, **contact me at:** (https://eaglex.net/app/contact?product=x-fs)


#### Thank you