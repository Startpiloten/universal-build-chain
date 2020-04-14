#!/usr/bin/env node

const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');
const clc = require("cli-color");
const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
const Bundler = require('parcel-bundler');
const path = require('path');

// welcome text
const welcomeText = () => {
    figlet('Universal Build Chain', function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data);
    });
};

// read config
const readConfigFile = () => {
    var ymalFile = false;
    try {
        ymalFile = fs.readFileSync(path.resolve(process.cwd(), 'ubc.yaml'))
    } catch (err) {
        console.log('Sorry - no ubc.yaml config founf in your project');
    }
    if (ymalFile) {
        var buildConfig = yaml.safeLoad(ymalFile);
        const bundler = new Bundler(buildConfig['imports'], options);
        bundler.bundle();
    }
};

const options = {
    outDir: './dist', // The out directory to put the build files in, defaults to dist
    watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    cache: true, // Enabled or disables caching, defaults to true
    cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
    contentHash: false, // Disable content hash from being included on the filename
    global: 'moduleName', // Expose modules as UMD under this name, disabled by default
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
    target: 'browser', // Browser/node/electron, defaults to browser
    bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
    logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
    hmr: true, // Enable or disable HMR while watching
    hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
    sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
    hmrHostname: '', // A hostname for hot module reload, default to ''
    detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
    autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
}

// Initializes a bundler using the entrypoint location and options provided


// collection of tasks
const runAll = () => {
    setTimeout(() => {
        readConfigFile();
    }, 200);
};

// execute all
welcomeText();
runAll();
