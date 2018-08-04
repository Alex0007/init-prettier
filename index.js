const fs = require('fs')
const process = require('process')
const path = require('path')
const util = require('util')

const exec = util.promisify(require('child_process').exec)
const writeFile = util.promisify(fs.writeFile)
const exists = util.promisify(fs.exists)

const deps = ['prettier@latest', 'husky@next', 'lint-staged@latest']

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

    if (!await exists(packageJsonPath)) {
        throw new Error('package.json do not exist in this folder')
    }

    const command = `npm i -D ${deps.join(' ')}`

    await exec(command)

    await writeFile(packageJsonPath,
        JSON.stringify({ ...require(packageJsonPath), ...toAdd }, null, 2)
    )
}

module.exports = {initPrettier}