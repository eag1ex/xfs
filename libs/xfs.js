
/** 
 * @xfs
 * - simple read/write file system app.
 * - more examples in `./examples.js` 
 * - default extention is set to `.json`, can use any other for example:[.txt,.md], but only data can be parsed with `.json` extention, other formats will return raw data.
*/
module.exports = function(/*{ dir, ext },cb*/) {
    const path = require('path')
    const fs = require('fs')
    // NOTE dynamicly recognize arguments position    
    let { dir, ext, cb,pth } = Object.entries(arguments).reduce((n, [key, val]) => {

        let keys = (typeof val === 'object' && val) ? Object.keys(val) : []   
        let fn = typeof val === 'function' ? val : null

        if (keys.length) {
            if (keys.indexOf('dir') !== -1) n['dir'] = val['dir']
            if (keys.indexOf('ext') !== -1) n['ext'] = val['ext']
            if (keys.indexOf('path') !== -1) n['path'] = val['path']
        }

        if (fn) n['cb'] = fn
        return n
    }, {})
 
   // find out if cb was assigned within which dir argument was provided, and assign that to our {dir}
    if (cb) {
        const _opts = cb() || {}
        if (_opts.dir) dir = _opts.dir // NOTE call back was provided where the xfs was called with its relative dir, so we can use that instead of config.dir
        if (_opts.path && dir) dir = path.join(dir, _opts.path || pth)
        if (_opts.ext) ext = _opts.ext
    }

    // NOTE if path was provided in arguments: {path} and no cb was set, use that instead!
    if(!cb && pth && dir) dir = path.join(dir, pth)

    if (!dir) throw ('{dir} is required')
    if (!ext) ext = `.json`
    if (ext.indexOf('.') !== 0) throw ('provided ext(extention) needs a prefix')
    ext = ext.toLowerCase()

    const o = {}

    /** 
     * @readFile
     * - read existing file from `dir`, must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @param otherDir (optional) provide custom dir location, othere then our config.dir
     * @returns returns any parsed data
    */
    o.readFile = (fileName, otherDir) => {
        if (!fileName) return null
        let dr = otherDir ? otherDir :dir
        let fname = path.join(dr, `./${fileName}${ext}`)
        try {
            let str = fs.readFileSync(fname).toString()
            let d
            if (ext === '.json') d = JSON.parse(str)
            else d = str
            return d
        } catch (err) {
            console.log(`[readFile][error]`,err.toString())
        }
        return null
    }

    /** 
     * @fileName
     * - only provide `fileName`, `dir ` must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @param data:any, raw data not JSON/string
     * @param otherDir (optional) provide custom dir location, othere then our config.dir
     * @returns true/false
    */
    o.writeFile = (fileName, data, otherDir) => {
        if (data === undefined) return false
        if (!fileName) return null
        let dr = otherDir ? otherDir :dir
        let fname = path.join(dr, `./${fileName}${ext}`)

        /// make dir if doesnt exist
        let dirName = path.join(dr, './')
        try{
            if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
        }catch(err){
            console.log(`[writeFile][error]`,err.toString())
            return false
        }
        
        try {
            fs.writeFileSync(fname, JSON.stringify(data))
            console.log(`[writeFile]`, `file:${fileName} written`)
            return true
        } catch (err) {
            console.log(`[writeFile][error]`,err.toString())
            return false
        }
    }

    /** 
     * @loadFileBatch
     * - load files from a batch in directory with given prefix
     * - if file exists and doest have data, will also count, and be included in output
     * - only loads json files
     * @param filePreFix load files matching prefix
     * @param otherDir (optional) provide custom dir location, othere then our config.dir
     * @returns [...] array of files
    */
    o.loadFileBatch = (filePreFix = '', otherDir='') => {

        try {
            let dr = otherDir ? otherDir : dir
            
            // must provide dir not a full file path
            if(dr.indexOf('.json')!==-1 || dr.indexOf('.JSON')!==-1){
                return []
            }
            let list = fs.readdirSync(dr).map(file => {
                if(!filePreFix && (file.indexOf('.json')!==-1 || file.indexOf('.JSON')!==-1) ){
                    return file
                }
                if (file.indexOf(filePreFix) === 0 && (file.indexOf('.json')!==-1 || file.indexOf('.JSON')!==-1) ) {
                    return file
                }
            }).filter(n => !!n)
                .map(file => {
                    try {
                        return JSON.parse(fs.readFileSync(path.join(dr, file)))
                    } catch (err) {
                        console.log('[loadFileBatch][error]', err.toString())
                    }
                }).filter(n => !!n)
            return list

        } catch (err) {
            console.log('[loadFileBatch][error]', err.toString())
        }
        return []
    }



    /** 
     * @fullPath
     * - returns fill path to any file
     * @param `{dirLoc,pathLoc}`, provide new dirLoc, and path and return full pathLoc. dirLocation/pathLoc revert to original xfs config when not set 
    */
    o.fullPath = ({ dirLoc, pathLoc }) => {
        
        let buildPath = path.join(`${dirLoc || dir}`, pathLoc || pth || './')
        return buildPath
    }

    return o
}