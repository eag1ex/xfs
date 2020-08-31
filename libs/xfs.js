
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
    let { dir, ext, cb } = Object.entries(arguments).reduce((n, [key, val]) => {
        let keys = (typeof val === 'object' && val) ? Object.keys(val) : []   
        let fn = typeof val === 'function' ? val : null

        if (keys.length) {
            if (keys.indexOf('dir') !== -1) {
                n['dir'] = val['dir']
            }
            if (keys.indexOf('ext') !== -1) {
                n['ext'] = val['ext']
            }
        }

        if (fn) n['cb'] = fn
        return n
    }, {})
 
   // find out if cb was assigned within which dir argument was provided, and assign that to our {dir}
    if (cb) {
        const _opts = cb() || {}
        if (_opts.dir) dir = _opts.dir // NOTE call back was provided where the xfs was called with its relative dir, so we can use that instead of config.dir
        if (_opts.path) dir = path.join(dir, _opts.path)
        if (_opts.ext) ext = _opts.ext
    }

    if (!dir) throw ('{dir} is required')
    if (!ext) ext = `.json`
    if (ext.indexOf('.') !== 0) throw ('provided ext(extention) needs a prefix')
    ext = ext.toLowerCase()
  

    const o = {}

    /** 
     * @readFile
     * - read existing file from `dir`, must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @returns returns any parsed data
    */
    o.readFile = (fileName) => {
        if (!fileName) return null
        let fname = path.join(dir, `./${fileName}${ext}`)
        try {
            let str = fs.readFileSync(fname).toString()
            let d
            if (ext === '.json') d = JSON.parse(str)
            else d = str
            return d
        } catch (err) {
            console.log(err)
        }
        return null
    }

    /** 
     * @fileName
     * - only provide `fileName`, `dir ` must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @param data:any, raw data not JSON/string
    */
    o.writeFile = (fileName, data) => {
        if (data === undefined) return false
        if (!fileName) return null
        let fname = path.join(dir, `./${fileName}${ext}`)

        /// make dir if doesnt exist
        let dirName = path.join(dir, './')
        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)

        let d
        try {
            fs.writeFileSync(fname, JSON.stringify(data))
            console.log(`[writeFile]`, `file:${fileName} written`)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    return o
}