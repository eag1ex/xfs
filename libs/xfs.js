
/** 
 * @xfs
 * - simple read/write file system app.
 * - more examples in `./examples.js` 
*/
module.exports = (config) => {
    if (!(config || {}).dir) throw ('config.dir is required')
    const path = require('path')
    const fs = require('fs')
    const o = {}

    /** 
     * @readFile
     * - read existing file from `config.dir`, must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @returns returns any parsed data
    */
    o.readFile = (fileName) => {
        if (!fileName) return null
        let fname = path.join(config.dir, `./${fileName}.json`)
        try {
            let str = fs.readFileSync(fname).toString()
            return JSON.parse(str)
        } catch (err) {
            console.log(err)
        }
        return null
    }

    /** 
     * @fileName
     * - only provide `fileName`, `config.dir ` must be set at `xfs({dir})`
     * @param fileName ./fileName without extention, it is proposed as `.json`
     * @param data:any, raw data not JSON/string
    */
    o.writeFile = (fileName, data) => {
        if (data === undefined) return false
        if (!fileName) return null
        let fname = path.join(config.dir, `./${fileName}.json`)

        /// make dir if doesnt exist
        let dirName = path.join(config.dir, './')
        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)

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