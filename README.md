# Custom Node.js cartridge for OpenShift

![nodejs-openshift](https://cloud.githubusercontent.com/assets/581999/13374525/d25b0a28-dd8f-11e5-86cd-a49b3e698aa5.png)

This is a custom Node.js cartridge that **takes care of auto-updating the Node.js and NPM versions** on each build.

## Why

Because the standard OpenShift cartridge never gets updated to the latest Node.js version.

## When to use

When you need a quick and unsofisticated solution to run your application on the latest Node.js version.

## How to

### The lazy way

Just click here:

[![Create Node.js app on OpenShift](https://launch-shifter.rhcloud.com/launch/Create app on.svg)](https://openshift.redhat.com/app/console/application_type/custom?&cartridges[]=https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml&name=appname)

…or deploy from the [OpenShift Hub Quickstart](https://hub.openshift.com/quickstarts/243-node-js-latest).

### Using [web console](https://openshift.redhat.com/app/console/applications)

Go to [Choose a type of application](https://openshift.redhat.com/app/console/application_types) in your OpenShift Online account, paste the URL below into "Code Anything" textbox at the bottom of the page, click "Next", then set your public URL and click "Create Application".

    https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml

### Using command line

Assuming you have `rhc` installed (see [here](https://developers.openshift.com/en/managing-client-tools.html)), run:

    rhc app create appname https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml

…where `appname` is the name of your application.

If you want to create the app with **your own source code** instead of the provided application template, run:

    rhc app create appname \
      https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml \
      --from-code=https://github.com/you/your-repo.git

…where `https://github.com/you/your-repo.git` is your application repository URL.

Make sure your app has the appropriate `start` entry in `package.json` (see note below).

You can also create an app based on multiple cartridges. For instance, assuming you'd want to include this [custom MongoDB cartridge](https://github.com/icflorescu/openshift-cartridge-mongodb) as well, run:

    rhc app create appname \
      https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml \
      https://raw.githubusercontent.com/icflorescu/openshift-cartridge-mongodb/master/metadata/manifest.yml

See output of `rhc app create --help` for information on additional options.

## Customizing the Node.js and npm versions

### Node.js

By default, the Node.js version is determined by querying [semver.io/node/stable](https://semver.io/node/stable).

A different URL can be specified either via `NODE_VERSION_URL` environment variable or by setting `.openshift/NODE_VERSION_URL` marker in your application repository. For instance, you'd get the **latest 0.10.x** (0.10.41 as of Jan 24, 2015) by putting this in `NODE_VERSION_URL` variable or `.openshift/NODE_VERSION_URL` marker:

    https://semver.io/node/resolve/0.10

If you're using a non-default Node.js version and you're planning to **scale the application across multiple gears**, you **must use the environment variable** (learn [here](https://github.com/icflorescu/openshift-cartridge-nodejs/issues/23) why).

### npm

By default, the npm version is determined by running `npm view npm version`.

A different npm version can be specified either via `NPM_VERSION_URL` environment variable or by setting `.openshift/NPM_VERSION_URL` marker in your application repository. For instance, you'd get the latest 2.x (2.14.16 as of Jan 24, 2016) by putting this in `NPM_VERSION_URL` variable or `.openshift/NPM_VERSION_URL` marker:

    https://semver.io/npm/resolve/2

## Features

- The cartridge [build script](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/bin/control#L11) is using [this function](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/lib/util#L3) to check for the latest Node.js and npm versions and installs them if necessary;
- This cartridge **can** be scaled;
- This cartridge **does not** (yet?) have a hot-deploy strategy.

## Notes

- Can't guarantee this cartridge is production-ready. Some people use it though (on **their own responsibility**).
- This is a lean cartridge. No unnecessary modules are installed. Which means that - unlike the standard Node.js cartridge - it won't install [supervisor](https://github.com/isaacs/node-supervisor) for you. You'll have to implement your own logic to auto-restart on errors. The [provided application template](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/usr/template/start.js) is using [cluster](http://nodejs.org/api/cluster.html) for that.
- The cartridge emulates the execution of `npm start` to start your application, so **make sure your application entrypoint is defined in your start script of your `package.json` file**. See [`package.json` in the provided template](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/usr/template/package.json) or read the [`npm` docs](https://docs.npmjs.com/cli/start) for more information.
- Due to OpenShift's outdated gcc (**4.4.7** as of Jan 4 2016), **native modules (such as [pg-native](https://github.com/brianc/node-pg-native)) won't compile on Node.js > 4.x. They'll only work on Node.js 0.10 and 0.12**. See [this issue](https://github.com/icflorescu/openshift-cartridge-nodejs/issues/12) for more info.
- Upon cartridge initialization, the Node.js binary package is downloaded and installed, which **may take a while**, depending on OpenShift server and network load. 2 - 3 minutes is quite often, but 5 - 10 minutes is not uncommon, especially for scalable multi-gear setups (if you specified "Scale with web traffic").
- The cartridge automatically installs the npm `dependencies` as needed on each build/deploy event; `devDependencies` are not installed (see an in-depth discussion [here](https://github.com/icflorescu/openshift-cartridge-nodejs/pull/20#issuecomment-190866662)).

## FAQ

**Q**: I'm getting the error *Cannot download, must be smaller than 20480 bytes* while trying to deploy the cartridge to OpenShift. What am I doing wrong?

**A**: You're probably trying to use the URL `https://github.com/icflorescu/openshift-cartridge-nodejs` instead of
`https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml`. A common mistake for people not paying sufficient attention while trying to use a custom cartridge for the first time.

---

**Q**: The latest Node.js version is 5.3.0, but the cartridge installs 5.1.1. Isn't it supposed to install the **latest**?

**A**: By default, the Node.js version is determined by querying [semver.io/node/stable](https://semver.io/node/stable) (see the top of this README). For reasons which escape me, semver.io is not updating **instantly** the latest version, but **you can** force the cartridge to install it by putting, for instance, `https://semver.io/node/resolve/5.3.x` in `.openshift/NODE_VERSION_URL`.

---

**Q**: How do I **disable the auto-update** feature? I want to lock my application to specific Node.js and npm versions.

**A**: Just set the necessary environment variables or markers to the versions you need. For instance, you can lock your application to Node.js 4.3.2 and npm 3.6.0 by setting:

    NODE_VERSION_URL=https://semver.io/node/resolve/4.3.2
    NPM_VERSION_URL=https://semver.io/npm/resolve/3.6.0

---

**Q**: Sometimes, `git push` fails with:

    remote: CLIENT_MESSAGE: Stopping Node.js application...
    remote: CLIENT_RESULT: Warning! Could not stop Node.js application!
    remote: An error occurred executing 'gear prereceive' (exit code: 1)
    remote: Error message: CLIENT_ERROR: Failed to execute: 'control stop' for /var/lib/openshift/[...]/nodejs
    remote:
    remote: For more details about the problem, try running the command again with the '--trace' option.
    To ssh://[...].git/
     ! [remote rejected] master -> master (pre-receive hook declined)
    error: failed to push some refs to 'ssh://[...].git/'

What's wrong?

**A**: Your application may take longer than 60 seconds to shutdown. Try to `git push` again until it works.

## Related

Since you're here, chances are you might also be interested in this [custom MongoDB cartridge](https://github.com/icflorescu/openshift-cartridge-mongodb).

## Credits

See contributors [here](https://github.com/icflorescu/openshift-cartridge-nodejs/graphs/contributors).

If you find this repo useful, don't hesitate to give it a star and [spread the word](http://twitter.com/share?text=Checkout%20this%20custom%20Node.js%20cartridge%20for%20OpenShift!&amp;url=http%3A%2F%2Fgithub.com/icflorescu/openshift-cartridge-nodejs&amp;hashtags=javascript,nodejs,openshift&amp;via=icflorescu).

## License

The [ISC License](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/LICENSE).
