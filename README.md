# Custom Node.js cartridge for OpenShift

This is a custom Node.js cartridge that **takes care of auto-updating the Node.js and NPM versions** on each build.

By default, the Node.js version is determined by querying [semver.io/node/stable](https://semver.io/node/stable).

A different URL can be specified in your application's repository, in the `.openshift/NODE_VERSION_URL` file. For instance, you'd get the **latest 0.10** (0.10.39 as of June 29, 2015) by putting this in `.openshift/NODE_VERSION_URL`:

    https://semver.io/node/resolve/0.10.x

## Why

Because the standard OpenShift cartridge never gets updated to the latest Node.js version.

## When to use

When you need a quick and unsofisticated solution to run your application on the latest Node.js version.

## How to

Go to [Choose a type of application](https://openshift.redhat.com/app/console/application_types) in your OpenShift Online account, paste the URL below into "Code Anything" textbox at the bottom of the page and click "Next".

    http://cartreflect-claytondev.rhcloud.com/github/icflorescu/openshift-cartridge-nodejs

## Features

- The cartridge [build script](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/bin/control#L11) is using [this function](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/lib/util#L3) to check for the latest Node.js and npm versions and installs them if necessary;
- This cartridge **can** be scaled;
- This cartridge **does not** (yet?) have a hot-deploy strategy.

## Notes

- Can't guarantee this cartridge is production-ready. Some people use it though (on **their own responsibility**).
- This is a lean cartridge. No unnecessary modules are installed. Which means that - unlike the standard Node.js cartridge - it won't install [supervisor](https://github.com/isaacs/node-supervisor) for you. You'll have to implement your own logic to auto-restart on errors. The [provided application template](https://github.com/icflorescu/openshift-cartridge-nodejs/blob/master/usr/template/start.js) is using [cluster](http://nodejs.org/api/cluster.html) for that.
- The cartridge will run `node --harmony start.js` on start, so **make sure your application entrypoint is `start.js`**.

## FAQ

**Q**: I'm getting the error *Cannot download, must be smaller than 20480 bytes* while trying to deploy the cartridge to OpenShift. What am I doing wrong?

**A**: You're probably trying to use the URL `https://github.com/icflorescu/openshift-cartridge-nodejs` instead of
`http://cartreflect-claytondev.rhcloud.com/github/icflorescu/openshift-cartridge-nodejs`. A common mistake for people not paying sufficient attention while trying to use a custom cartridge for the first time.

## Related

Since you're here, chances are you might also be interested in this [custom MongoDB cartridge](https://github.com/icflorescu/openshift-cartridge-mongodb).

## License

The [MIT License](http://github.com/icflorescu/openshift-cartridge-nodejs/LICENSE).
