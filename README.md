# Convert Your Savings Bond Wizard File to CSV

You can see this code running here: [Convert Your Savings Bond Wizard File](https://sbw2csv.hefh7w8hsk0.us-south.codeengine.appdomain.cloud/#/)

The US Treasury Department used to have a
Savings Bond Wizard that let you track and identify the purchased
bonds. But the SBW file is no longer supported so this app will let you convert them to CSV files.

Thanks to Jim Evins and the [GBonds project](http://gbonds.sourceforge.net/) for the nucleolus of this code.

## How Its Made

![How Its Made Illustration](docs/Howitsmade.gif)

### Vue.js + @carbon/vue

This part was the simplest to execute. The app itself is pretty simple with just a landing page and simple privacy statement. I use a custom theme for Carbon that includes a few tweaks to match some colors from the US Treasury site. Everything else is standard.

You can launch the site locally with:

```sh
cd ui
yarn
yarn serve
```

### Deploying the UI

You can find the code for this in the [ui](ui) directory.

Deployment of the UI is straightforward with just a bit of a reverse proxy incantation to to hide the services and cloud object storage layers. The config in `ui/ce` creates a reverse proxy for `/services/` which points to the deployed services layer which is automatically calculated from the environment variable `CE_SUBDOMAIN`. It also creates a reverse proxy to the Cloud Object Storage under `/downloads/` the URL for which is defined by the environment variable `COS_DOWNLOAD`

Build the image with either docker or podman and push it to the registry. Make sure each image has both the `latest` tag and another tag. I have a automatic retention policy set on my registry but that policy will not prune untagged images. Setting the another tag on the image when you push it allows it to be pruned later.

- [Install the code engine command line](https://cloud.ibm.com/docs/codeengine?topic=codeengine-cli)

- Login and target the project

  ```sh
  ibmcloud login --apikey @~/projects/ibmcloud-apikey.json -g Default -r us-south
  ibmcloud ce project select --name sbw2csv
  ```

```sh
podman build -t sbw2csv-ui . #Red Hat or Fedora
podman tag localhost/sbw2csv-ui:latest us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest
podman push us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest
podman push us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest us.icr.io/sbw2csv/codeengine-sbw2csv-ui:$(date '+%FT%H%M%S')
# or
docker build -t sbw2csv-ui .
docker tag localhost/sbw2csv-ui:latest us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest
docker push us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest
docker push us.icr.io/sbw2csv/codeengine-sbw2csv-ui:latest us.icr.io/sbw2csv/codeengine-sbw2csv-ui:$(date '+%FT%H%M%S')
```

Roll out new version

```sh
ibmcloud ce app update --name sbw2csv
```

Show the latest logs

```sh
ibmcloud ce app logs -f -n sbw2csv
```

#### Set UI Environment variables

```sh
# use your public COS endpoint here i.e. https://s3.us-south.cloud-object-storage.appdomain.cloud/your-bucket/
ibmcloud ce app update --name sbw2csv \
  --env COS_DOWNLOAD=YOUR-COS-INSTANCE-PUBLIC-ENDPOINT
```

### Deploying the Services layer

You can find the code for this in the [services](services) directory. I bootstrapped this layer with `express --view=pug services` and then customized it for this app. The most important endpoint is [services/routes/convert.js](services/routes/convert.js) which receives uploaded files, converts them to CSV, and then stores them in the COS.

The only other interesting endpoint is in [services/routes/analytics.js](services/routes/analytics.js) which accepts analytic posts from the UI. It takes that data and stores it in a connected cloudant db. This is a experiment at this point and not really relevant to this solution. If you want real analytics you should look elsewhere.

Build the image with either `docker` or `podman` and push it to the registry. Make sure each image has both the `latest` tag and another tag. I have a automatic retention policy set on my registry but that policy will not prune untagged images. Setting the another tag on the image when you push it allows it to be pruned later.

```sh
podman build -t sbw2csv-services . #Red Hat or Fedora
podman tag localhost/sbw2csv-services:latest us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest
podman push us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest
podman push us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest us.icr.io/sbw2csv/codeengine-sbw2csv-services:$(date '+%FT%H%M%S')
# or
docker build -t sbw2csv-services .
docker tag localhost/sbw2csv-services:latest us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest
docker push us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest
docker push us.icr.io/sbw2csv/codeengine-sbw2csv-services:latest us.icr.io/sbw2csv/codeengine-sbw2csv-services:$(date '+%FT%H%M%S')
```

Roll out new version

```sh
ibmcloud ce app update --name services
```

Show the latest logs

```sh
ibmcloud ce app logs -f -n services
```

#### Services Environment

The services layer expects to be connected to a COS instance and to a Cloudant instance (for the analytics). Use your
cloud account to configure these services to the Code Engine app.

```sh
# navigate to your cloud object store instance to create and API key and get your instance id
ibmcloud ce secret create --name cos-secrets \
  -l COS_INSTANCE_ID=crn:your-instance-id:: \
  -l COS_APIKEY=your-api-key

ibmcloud ce app bind --name services --service-instance YOUR-CLOUDANT-INSTANCE

ibmcloud ce app update --name services \
  --env-from-secret cos-secrets \
  --env COS_ENDPOINT=s3.private.YOUR-END-POINT \
  --env COS_BUCKET=your-bucket \
  --env NODE_DB_PREFIX=prod_ \
  --env DEBUG="services:server services:cos services:convert"
```

The services layer uses the parameter `COS_ENDPOINT` to find the COS endpoint so make sure that it defined correctly for your environment. You can see in the manifest file that it defaults to the private endpoint for us-east so the private endpoint for your region should work for you. If the app fails to connect via the private COS end point try the direct endpoint.

The services layer also uses the parameter `COS_BUCKET` to find the bucket in the COS. Define this for your environment and be sure to create the bucket in your environment. The code does not attempt to create the bucket. It expects it to already exist.

When you create the bucket be sure to set the expiration rule to automatically remove objects.

![remove file](docs/cos-expire-rule.jpg)

#### C++ Command line utility

The `convert` endpoint uses this utility to do its work. The code from the gbonds application already had an import for SBW files so those dependencies are in the `services/cli/deps/gbonds-2.0.3/` directory. I added a little glue around that in `services/cli/main.cpp` to export the files to CSV format.

Then the only trick is to compile it so that it is compatible with the stack running the in Code Engine. The `servces/Dokerfile` handles that by using the latest CentOS image in the build phase.

Incidentally, you can build the command line utility locally like this:

**Build**

```sh
cd services/cli
cmake -S . -Bbuild
cmake --build build/
```

That works great for me on Ubuntu 20 and Fedora 35 but likely needs updates for OSX and Windows. LMK if you make changes and I'll merge them in.

### Local db

If you want to try out the simple analytics locally, you should create a local db for this. You can do that like this:

```sh
cd database
yarn
yarn serve
```

This will automatically create and run local couchdb image that the services layer can connect to.

### How to Make the How Its Made Illustration

- Edit the `doc/HowItsMade.odp`
- Record illustration with [recordmydesktop](http://recordmydesktop.sourceforge.net/about.php)
- Edit recording with [OpenShot](https://www.openshot.org/)

  ![simple](docs/openshot-1.jpg)
  ![No audio](docs/openshot-2.jpg)
  ![16:9](docs/openshot-3.jpg)

- Process to gif [How to make GIFs with FFMPEG](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/)
  ```sh
  ffmpeg -y -i Howitsmade.mpeg -filter_complex "[0:v] palettegen" palette.png
  ffmpeg -y -i Howitsmade.mpeg -i palette.png  -filter_complex "[0:v][1:v] paletteuse" Howitsmade.gif
  ```

#### Deployment notes

Make sure you are fully targeted including the resource group

```sh
ibmcloud ce project select -n YOUR_PROJECT
ibmcloud target
```

```
API endpoint: https://cloud.ibm.com
Region: us-south
User: example@example.com
Account: aaa
Resource group: ggg
```

## Development setup

pre-reqs

- [yarn](https://classic.yarnpkg.com/en/docs/install/)
- [nvm](https://github.com/nvm-sh/nvm)
- node 14 `nvm install 14`
- [docker](https://docs.docker.com/get-docker/)
  - podman on Fedora or RedHat works too
- [cmake](https://cmake.org/install/)
- [gcc](https://linuxize.com/post/how-to-install-gcc-on-ubuntu-20-04/)
- [boost](https://www.boost.org/doc/libs/1_77_0/more/getting_started/unix-variants.html)

  **Fedora**

  ```sh
  sudo dnf install cmake boost-static boost-devel glib-devel libstdc++-devel libstdc++-static
  ```

- start database - open a new terminal

  ```sh
  cd database
  yarn
  yarn serve # this takes a few minutes
  ```

- build the sbw2csv cli

  ```sh
  cd services/cli
  cmake -S . -Bbuild/
  cmake --build build/
  ```

- start services - open a new terminal

  ```sh
  cd services
  yarn
  yarn serve
  ```

  **NOTE**: If you want your local environment to connect to a remote COS, add your CE_SERVICES value found in the runtime environment variables to a `.env.local.json` file and restart your services.

- start UI - open a new terminal
  ```sh
  cd ui
  yarn
  yarn serve
  ```
