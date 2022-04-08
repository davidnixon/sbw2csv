var package = require('./package.json')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const execSync = require('child_process').execSync
const path = require('path')

var command
try {
  command = execSync('command -v podman').toString('ascii').trim()
} catch (error) {
  command = execSync('command -v docker').toString('ascii').trim()
}
var bCommand = path.basename(command)
console.log('command', command)

// Is the correct version already running
exec(`${command} ps --quiet --filter label=sbw2csv-dev/db=${package.version}`)
  .then((data) => {
    if (data.stdout === '') {
      // Its not running so let's check to see if the right version of the db is available locally
      return exec(`${command} images --quiet sbw2csv-dev/db:${package.version}`)
    } else {
      console.log(
        `correct version sbw2csv-dev/db:${
          package.version
        } is running.\nIf you want to restart this image, first use '${bCommand} stop ${data.stdout.trim()}'\n`
      )
      return { running: true, ...data }
    }
  })

  .then((data) => {
    if (data.stdout === '') {
      // Build the right version if it is not already available
      console.log(`building sbw2csv-dev/db:${package.version} ...`)
      return exec('bash scripts/build_image.sh ' + package.version, { cwd: __dirname })
    } else {
      return {
        stdout: data.running
          ? ''
          : `found correct version sbw2csv-dev/db:${package.version} docker image`,
        stderr: '',
        running: Boolean(data.running),
      }
    }
  })
  .then((data) => {
    // When we reach this point the correct docker image was already available or it has been built
    if (data.stderr) console.error(data.stderr)
    if (data.stdout) console.log(data.stdout)

    if (!data.running) {
      // launch the image
      console.log(`launching sbw2csv-dev/db:${package.version}`)
      return exec('bash scripts/run_image.sh ' + package.version, { cwd: __dirname })
    } else {
      return {
        stdout: '',
        stderr: '',
        running: Boolean(data.running),
      }
    }
  })
  .then((data) => {
    // When we reach this point the correct docker image is running but may have been just launched
    if (data.stderr) console.error(data.stderr)
    //if (data.stdout) console.log(data.stdout);
    console.log('testing connection to database ...')
    return exec('bash scripts/test_connection.sh', { cwd: __dirname })
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
