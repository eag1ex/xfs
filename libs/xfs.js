
/** 
 * @xfs
 * - simple read/write file system app.
 * - more examples in `./examples.js` 
 * - default extention is set to `.json`, can use any other for example:[.txt,.md], but only data can be parsed with `.json` extention, other formats will return raw data.
*/
module.exports = ({ dir, ext }) => {
    if (!dir) throw ('{dir} is required')
    if (!ext) ext = `.json`
    if (ext.indexOf('.') !== 0) throw ('provided ext(extention) needs a prefix')
    ext = ext.toLowerCase()
  
    const path = require('path')
    const fs = require('fs')

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