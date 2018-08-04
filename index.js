const process = require('process')
const path = require('path')
const util = require('util')

const exec = util.promisify(require('child_process').exec)
const writeFile = util.promisify(require('fs').writeFile)

const deps = ['prettier', 'husky', 'lint-staged']

const toAdd = {
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.{js,ts,tsx,css,md}": ["prettier --write", "git add"]
    }
}

const initPrettier = async (params) => {
    const cwd = process.cwd();
    const packageJsonPath = path.resolve(cwd, 'package.json')

    let packageJson

    try {
        packageJson = require(packageJsonPath)        
    } catch {
        throw new Error('package.json do not exist in this folder')
    }

    await exec(`npm i -D ${deps.map(d => d + '@latest').join(' ')}`)

    await writeFile(packageJsonPath,
        JSON.stringify({ ...packageJson, ...toAdd }, null, 2)
    )
}

module.exports = {initPrettier}