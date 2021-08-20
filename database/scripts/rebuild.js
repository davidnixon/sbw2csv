var package = require('../package.json')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const parent_dir = require('path').resolve(__dirname, '..')

console.log(`building sbw2csv-dev/db:${package.version} ...`)
exec('bash scripts/build_image.sh ' + package.version, { cwd: parent_dir })
  .then((data) => {
    // When we reach this point the correct docker image has been built
    if (data.stdout) console.log(data.stdout)
    if (data.stderr) console.error(data.stderr)

    // launch the image
    console.log(`launching sbw2csv-dev/db:${package.version}`)
    return exec('bash scripts/run_image.sh ' + package.version, { cwd: parent_dir })
  })
  .then((data) => {
    // When we reach this point the correct docker image is running but has just launched
    if (data.stderr) console.error(data.stderr)
    //if (data.stdout) console.log(data.stdout);
    console.log('testing connection to database ...')
    return exec('bash scripts/test_connection.sh', { cwd: parent_dir })
  })
  .then((data) => {
    // Report the results of the connection test
    try {
      var welcome = JSON.parse(data.stdout)
      // make the test output even more concise
      delete welcome.features
      delete welcome.git_sha
      delete welcome.uuid
      console.log(welcome)
    } catch (error) {
      console.error(error)
      if (data.stderr) console.error(data.stderr)
      if (data.stdout) console.log(data.stdout)
    }
  })
  .catch((err) => {
    console.error(err)
  })
