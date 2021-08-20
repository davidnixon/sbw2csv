var package = require('../package.json')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

console.log(
  `stopping current db and restarting. This will remove any changes you have made and start again with the default data`
)
console.log(`restarting sbw2csv-dev/db:${package.version} ...`)

// Is the correct version already running
exec('docker ps --quiet --filter label=sbw2csv-dev/db=' + package.version)
  .then((data) => {
    if (data.stdout != '') {
      console.log(
        `correct version sbw2csv-dev/db:${
          package.version
        } is running.\nStopping this image '${data.stdout.trim()}'\n`
      )
      return exec('docker stop ' + data.stdout.trim())
    }
  })
  .finally(() => {
    console.log('datbase stopped')
  })
