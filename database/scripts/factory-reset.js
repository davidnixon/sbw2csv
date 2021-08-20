var package = require('../package.json')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const parent_dir = require('path').resolve(__dirname, '..')
const services_dir = require('path').resolve(__dirname, '../../services')
const env_file = require('path').resolve(__dirname, '../../services/.env.local')
const fs = require('fs')

var sed_opts
if (process.platform === 'darwin') sed_opts = '-i "" -e'
else if (process.platform === 'linux') sed_opts = '-i'
else {
  console.error(`platform ${process.platform} is not yet supported`)
  return
}
const sed_cmd =
  'sed ' + sed_opts + ' "/^NODE_DB_USER=/d;/^NODE_DB_PASSWORD=/d;/^NODE_DB_URL=/d" .env.local'

fs.access(env_file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(
      `services/.env.local ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`
    )
  } else {
    // console.log(`${env_file} exists, and it is writable`)
    console.log(`resetting services/.env.local ...`)
    exec(sed_cmd, { cwd: services_dir })
      .then((data) => {
        // When we reach this point the values from /env.local have been erased
        if (data.stdout) console.log(data.stdout)
        if (data.stderr) console.error(data.stderr)
      })
      .catch((err) => {
        console.error('bad', err)
      })
  }
})
