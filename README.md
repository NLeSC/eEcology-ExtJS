Shared ExtJS components for applications in the eEcology project.

Requirements
------------

* SenchaCmd, download from [Sencha](http://www.sencha.com/products/sencha-cmd/download/) and install.
* karma, for running tests, install with `sudo apt-get install phantomjs nodejs lcov` and `sudo npm install -g karma karma-coverage karma-junit-reporter`.
* jsduck, for documentation, install with `sudo gem install jsduck`.

Installation
------------

After cloning the `ext/` folder must be filled with a ExtJS SDK.

Build
-----

Build with `sencha package build` inside `packages/eecology-shared/` folder.

To make pkg available run `sencha package add ../../build/eecology-shared/eecology-shared.pkg` and make `<SenchaCmd Installation Prefix>/repo/pkgs` folder available online.

Package usage
-------------

To use with a SenchaCmd based project:

1. `sencha repo add -address <to be announced> -name NLeSC
2. Add 'eecology-shared' to `requires` array in `app.json`.
3. Use component in your application.
4. `sencha app refresh` do download package.

To use with a non-SenchaCmd project:

1. unzip `eecology-shared.pkg`
2. Add `build/eecology-shared.js` into html page.

Documentation
-------------

Documentation can be generated with `ant docs`.
To make inline examples work, copy ExtJS SDK to `docs/extjs-build`.
Put the whole repo online and open `docs/index.html` in a webbrowser.

Copyrights & Disclaimers
------------------------

eEcology ExtJS is copyrighted by the Netherlands eScience Center and releases under
the Apache License, Version 2.0.

See <http://www.esciencecenter.nl> for more information on the Netherlands
eScience Center.

See the "LICENSE" file for more information.
