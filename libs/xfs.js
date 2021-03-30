
/** 
 * @xfs
 * - simple read/write file system app.
 * - more examples in `./examples.js` 
 * - default extension is set to `.json`, can use any other for example:[.txt,.md], but only data can be parsed with `.json` extension, other formats will return raw data.
 * @param cb(({dir, ext,path, silent, pretty})=>) use callback to provide return args
 * @param {object} `{dir, ext,path,silent,pretty}` or use object (selection between cb and obj is dynamic)
*/
const xfs = function() {
    const _path = require('path')
    const fs = require('fs')
    const rimraf = require("rimraf");
    // NOTE dynamically recognize arguments position    
    let { dir, ext, cb,path,silent,pretty } = Object.entries(arguments).reduce((n, [key, val]) => {

        let keys = (typeof val === 'object' && val) ? Object.keys(val) : []   
        let fn = typeof val === 'function' ? val : null

        if (keys.length) {
            if (keys.indexOf('dir') !== -1) n['dir'] = val['dir']
            if (keys.indexOf('ext') !== -1) n['ext'] = val['ext']
            if (keys.indexOf('path') !== -1) n['path'] = val['path']
            if (keys.indexOf('silent') !== -1) n['silent'] = val['silent']
            if (keys.indexOf('pretty') !== -1) n['pretty'] = val['pretty']
        }

        if (fn) n['cb'] = fn
        return n
    }, {})
 
   // find out if cb was assigned within which dir argument was provided, and assign that to our {dir}
    if (cb) {
        const _opts = cb() || {}
        if (_opts.dir) dir = _opts.dir // NOTE call back was provided where the xfs was called with its relative dir, so we can use that instead of config.dir
        if (_opts.path && dir) dir = _path.join(dir, _opts.path || path)
        if (_opts.ext) ext = _opts.ext
        if (_opts.pretty) pretty = _opts.pretty
        if (_opts.silent) silent =_opts.silent
    }

    // NOTE if path was provided in arguments: {path} and no cb was set, use that instead!
    if(!cb && path && dir) dir = _path.join(dir, path)

    if (!dir) throw ('{dir} is required')
    if (!ext) ext = `.json`
    if (ext.indexOf('.') !== 0) throw ('provided ext(extension) needs a prefix')
    ext = ext.toLowerCase()

    // require loads faster
    // can only support json, and js files
    let loadRequire = (filePath)=>{
        let arr =  filePath.split(/\./)
      
        try{
            let checkPath = arr[arr.length-1] === 'json' || arr[arr.length-1] ==='js'
            if(!checkPath) throw('wrong format provided')
            return require(filePath)
        }catch(err){
            return undefined
        }
    }



    const o = {}

        /** 
     * @readFile
     * - check all available permissions of a file
     * @param fileName ./fileName without extension, it is proposed as `.json`
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param _ext provide/optional custom extension name, example `.md`
     * @param silent:boolean disable any logging
     * @returns {perms,file}
    */  
    const checkFilePermissions = (fileName, otherDir, _ext, _silent) => {

        if (!fileName) return null
        // must provide extension with prefix
        if (_ext && (_ext || "").indexOf('.') === -1) {
            return null
        }

        let dr = otherDir ? otherDir : dir
        _ext = _ext || ext
        let fname = _path.join(dr, `./${fileName}${_ext}`)

        /** 
         * check all permissions aof a file
        */
        let checkPerms = (fname) => {
            let perms = [/*'rwx',*/ 'r', 'w', 'x']

            let forSwitch = (perm) => {
                let output

                switch (perm) {

                    // case "rwx":
                    //     try {

                    //         fs.accessSync(fname, fs.constants.F_OK) 
                    //         output = 'rwx'
                    //     }
                    //     catch (err) {
                    //          // console.log("%s doesn't exist", path);
                    //     }

                    //     break
                    case "r":

                        try {
                            fs.accessSync(fname, fs.constants.R_OK)
                            output = 'r'
                        }
                        catch (err) {
                            // console.log("%s doesn't exist", path);

                        }


                        break
                    case "x":

                        try {

                            fs.accessSync(fname, fs.constants.X_OK | fs.constants.F_OK)
                            output = 'x'
                        }
                        catch (err) {
                            //console.log("%s doesn't exist", path);
                        }

                        break

                    case "w":

                        try {
                            fs.accessSync(fname, fs.constants.W_OK)
                            output = 'w'
                        }
                        catch (err) {
                            // console.log("%s doesn't exist", path);
                        }
                        break

                    default:
                        console.error('no perm match ?', perm)
                }
                return output
            }

            let permissions = []
            for (let inx = 0; inx < perms.length; inx++) {
                permissions.push(forSwitch(perms[inx]))
            }

            let res = permissions.filter(n => !!n).toString().replace(/,/g, '')
            return res 
        }

        return {
            file: fname,
            perms: checkPerms(fname)
        }
    }

    
    o.removeDir = (dirName, otherFullPath, _silent) => {
        dirName = (dirName ||'').trim()
        let fPath = otherFullPath ? otherFullPath : dir

        if(!dirName || (dirName ||'').length<2 ) {
            console.log('[removeDir]','invalid dirName provided, and must be length>1')
            return false
        }

        let dName = _path.join(fPath, dirName)

        if (fs.existsSync(dName)) {
            try{             
                rimraf.sync(dName,{ nosort: true, silent:  (_silent || silent) ===true });
                if (!(_silent || silent)) console.log(`[removeDir]`, `dir:${dirName} removed`)
                return true
            }catch(err){
                if (!(_silent || silent)) {
                    console.log(`[removeDir]`, `dir:${dirName} not removed`)
                    console.log(err.toString())
                }
            }           
           
            return false
        }

        else if (!(_silent || silent)) console.log(`[removeDir]`, `dir:${dirName} doesnt exist`)
        return false
    }


    /** 
     * @removeFile
     * - remove existing file from `dir`
     * @param fileName ./fileName without extension, it is proposed as `.json`
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param _ext provide/optional custom extension name, example `.md`
     * @param silent:boolean disable any logging
     * @returns boolean
    */
    o.removeFile = (fileName, otherDir, _ext, _silent) => {
        if (!fileName) return false
        // must provide extension with prefix
        if (_ext && (_ext || "").indexOf('.') === -1) {
            return null
        }

        let dr = otherDir ? otherDir : dir
        _ext = _ext || ext
        let fname = _path.join(dr, `./${fileName}${_ext}`)

        
        try {

            if (!fs.existsSync(fname)) {
                if (!(_silent || silent)) console.log(`[readFile]`, 'file doesnt exist')
                return false
            }

            if (fs.lstatSync(fname).isDirectory()) {
                // file cannot be a directory
                if (!(_silent || silent)) console.log(`[readFile]`, 'cannot remove a directory')
                return false
            }
        } catch (err) {

        }

        try {
            fs.unlinkSync(fname)
            if(!(_silent || silent) ) console.log(`[removeFile]`, `file:${fname} removed`)
            return true
        } catch (err) {

            if (!(_silent || silent)) console.log(`[removeFile][error]`, err.toString())
            return false
        }

    }

    /** 
     * @readFile
     * - read existing file from `dir`, must be set at `xfs({dir})`
     * @param fileName ./fileName without extension, it is proposed as `.json`
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param _ext provide/optional custom extension name, example `.md`
     * @param silent:boolean disable any logging
     * @returns returns any parsed data
    */
    o.readFile = (fileName, otherDir,_ext, _silent) => {
        if (!fileName) return null
        // must provide extension with prefix
        if(_ext && (_ext||"").indexOf('.')===-1 ) {
            return null
        }

        let dr = otherDir ? otherDir :dir
        _ext = _ext || ext
        let fname = _path.join(dr, `./${fileName}${_ext}`)

        try {
            if (fs.lstatSync(fname).isDirectory()) {
                // file cannot be a directory
                if (!(_silent || silent)) console.log(`[readFile][error]`, 'cannot remove a directory')
                return null
            }

        } catch (err) {
            return null
        }
      
        try {
            let d
            if (_ext === '.json' || _ext === '.js') d= loadRequire(fname) // require is faster, lets use that instead!
            else d = fs.readFileSync(fname).toString()

            return d
        } catch (err) {
            if(!(_silent || silent) ) console.log(`[readFile][error]`,err.toString())
        }
        return null
    }

    /** 
     * @fileName
     * - only provide `fileName`, `dir ` must be set at `xfs({dir})`
     * @param fileName ./fileName without extension, it is proposed as `.json`
     * @param data:any, raw data not JSON/string
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param _ext (optional) file extension name, example : .json
     * @param silent:boolean disable any logging
     * @returns true/false
    */
    o.writeFile = (fileName, data, otherDir, _ext,_silent) => {
        if (data === undefined) return false
        if (!fileName) return null
        let dr = otherDir ? otherDir : dir
        _ext = _ext || ext
        let fname = _path.join(dr, `./${fileName}${_ext}`)

        /// make dir if doesnt exist
        let dirName = _path.join(dr, './')
        try {
            if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
        } catch (err) {
            if(!(_silent || silent) )  console.log(`[writeFile][error]`, err.toString())
            return false
        }

        // well only test if it exists!
        if (fs.existsSync(fileName)) {
            let { perms } = checkFilePermissions(fileName, null, null, _silent)
            if (perms.indexOf('w') === -1) {
                if (!(_silent || silent)) console.log(`[writeFile][error]`, 'no write permission to: ', fname)
                return false
            }
        }

        try {
            
            if (_ext === '.json') {
                let jData
                // prettyfie data option only available in json 
                if(pretty) jData = JSON.stringify(data,null,2)
                else jData = JSON.stringify(data)

                fs.writeFileSync(fname, jData)
            } else {
                let d
                if (typeof data === "string") d = data
                if (typeof data === "boolean") d = JSON.stringify(data)
                if (typeof data === "number") d = JSON.stringify(data)
                if (typeof data === "object") d = JSON.stringify(data)
                if (typeof data === "function") d = JSON.stringify(data)

                fs.writeFileSync(fname, d)
            }

            if(!(_silent || silent) ) console.log(`[writeFile]`, `file:${fileName} written`)
            return true
        } catch (err) {
            if(!(_silent || silent) ) console.log(`[writeFile][error]`, err.toString())
            return false
        }
    }


      /** 
     * @appendFile
     * - only provide `fileName`, `dir ` must be set at `xfs({dir})`
     * @param fileName ./fileName without extension, default is `.json` but wont work with appendFile in this case! 
     * @param data:any, raw data not JSON/string
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param _ext (optional) file extension name, example : .json
     * @param silent:boolean disable any logging
     * @returns true/false
    */
    o.appendFile = (fileName, data, otherDir, _ext,_silent) => {
        if (data === undefined) return false
        if (!fileName) return null
        let dr = otherDir ? otherDir : dir
        _ext = _ext || ext
        let fname = _path.join(dr, `./${fileName}${_ext}`)

        /// make dir if doesnt exist
        let dirName = _path.join(dr, './')
        try {
            if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
        } catch (err) {
            if(!(_silent || silent) )  console.log(`[appendFile][error]`, err.toString())
            return false
        }


        // well only test if it exists!
        if (fs.existsSync(fileName)) {
            let { perms } = checkFilePermissions(fileName, null, null, _silent)

            if (perms.indexOf('w') === -1) {
                if (!(_silent || silent)) console.log(`[appendFile][error]`, 'no write permission to: ', fname)
                return false
            }
        }


        try {

            if (_ext === '.json') {
                if(!(_silent || silent) ) console.log('cannot append to json file right!')
                //fs.appendFileSync(fname, JSON.stringify(data))
                return false
            } else fs.appendFileSync(fname, data)

            if(!(_silent || silent) )  console.log(`[appendFile]`, `file:${fileName} written`)
            return true
        } catch (err) {
            if(!(_silent || silent) ) console.log(`[appendFile][error]`, err.toString())
            return false
        }
    }


    /** 
     * @loadFileBatch
     * - load files from a batch in directory with given prefix
     * - if file exists and doest have data, will also count, and be included in output
     * - only loads json files
     * @param filePattern load files matching pattern
     * @param otherDir (optional) provide custom dir location, other then our config.dir
     * @param silent:boolean disable any logging 
     * @returns [...] array of files
    */
    o.loadFileBatch = (filePattern = '', otherDir='',_silent) => {

        if(!filePattern) return []
        try {   
            let dr = otherDir ? otherDir : dir
            
            // must provide dir not a full file path
            if(dr.indexOf('.json')!==-1 || dr.indexOf('.JSON')!==-1){
                return []
            }
            let list = fs.readdirSync(dr).map(file => {
                if(!filePattern && (file.indexOf('.json')!==-1 || file.indexOf('.JSON')!==-1) ){
                    return file
                }
                if (file.indexOf(filePattern) !==-1 && (file.indexOf('.json')!==-1 || file.indexOf('.JSON')!==-1) ) {
                    return file
                }
            }).filter(n => !!n)
                .map(file => {
                    try {              
                        return loadRequire(_path.join(dr, file))
                    } catch (err) {
                        if(!(_silent || silent) ) console.log('[loadFileBatch][error]', err.toString())
                    }
                }).filter(n => !!n)
            return list

        } catch (err) {
            if(!(_silent || silent) ) console.log('[loadFileBatch][error]', err.toString())
        }
        return []
    }



    /** 
     * @fullPath
     * - returns fill _path to any file
     * @param `{dirLoc,pathLoc}`, provide new dirLoc, and path and return full pathLoc. dirLocation/pathLoc revert to original xfs config when not set 
    */
    o.fullPath = ({ dirLoc, pathLoc }) => {
        
        let buildPath = _path.join(`${dirLoc || dir}`, pathLoc || path || './')
        return buildPath
    }

        /** 
     * @listFolders
     * - list all folders in the given directory
     * @param otherDir to provide alternative dir root
     * @param silent:boolean disable any logging
     * @returns {array} [] list of full file paths
    */
    o.listFolders = (otherDir, _silent = false) => {

        let dr = otherDir ? otherDir : dir
        _silent = _silent || silent
        try {
            let list = fs.readdirSync(dr).map(di => {
                if (!di) return
                let fullPath = _path.join(dr, di)
                if (fs.lstatSync(fullPath).isDirectory()) return fullPath         
            }).filter(n => !!n)
            return list
        } catch (err) {
            if (!_silent) console.error('[listFolders][error]', err)
        }
        return []
    }


    /** 
     * @dirList
     * - list all, and only files in provided dir of given type
     * @param otherDir if not using declared dir, provide alternative
     * @param _ext provide/optional custom extension name, example `.md` `.json` 
     * @param silent:boolean disable any logging
     * @returns {array} [] list of full file paths
    */
    o.dirList = (otherDir, _ext, _silent=false) => {

        let dr = otherDir ? otherDir : dir
        _ext = _ext || ext
        _silent = _silent || silent
        try {
            let list = fs.readdirSync(dr).map(file => {
                if(!file) return 
                let fullPath = _path.join(dr, file)
                if (fs.lstatSync(fullPath).isDirectory()) return null
                if (file.indexOf(_ext) !== -1) return fullPath
            }).filter(n => !!n)
            return list
        } catch (err) {
            if (!_silent) console.error('[dirList][error]', err)
        }
        return []
    }

    o.checkFilePermissions = checkFilePermissions

    return o
}

module.exports = xfs