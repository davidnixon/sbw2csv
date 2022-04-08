var package = require('../package.json')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const parent_dir = require('path').resolve(__dirname, '..')

console.log(
  `stopping current db and restarting. This will remove any changes you have made and start again with the default data`
)
console.log(`restarting sbw2csv-dev/db:${package.version} ...`)

// Stop version already running
exec('bash scripts/stop_image.sh ' + package.version, { cwd: parent_dir })
  .then((data) => {
    if (data.stdout) console.log(data.stdout)
    if (data.stderr) console.error(data.stderr)
  })
  .finally(() => {
    console.log('database stopped')
  })
