# assetNotifier
A tool to notify you of the latest changes in bug bounty programs.

It uses https://github.com/arkadiyt/bounty-targets-data API.

## Features
- Get notified of newly launched programs on platforms.
- Get notified of new assets added to programs.
- Get notified of change in payment policies (0->$)

## Installation
assetNotifier requires [Node.js](https://nodejs.org/) v14+ to run.

I recommend installing Node.js using "nvm" which is a version manager for node.
https://github.com/nvm-sh/nvm

```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

```sh
nvm install node # "node" is an alias for the latest version
```


Install the dependencies.

```sh
cd assetNotifier
npm i
```

## Usage
I . Go to helper/constant.js and paste your discord hook.

II. In order to start using the tool you need to first create and intialize your JSON database for each platform.
    To do so, run the command below.
```sh
node index.js init
```
III. Now you can start watching 👁
```sh
node index.js watch
```

### Cron Job
Automate the flow by making a cron job using crontab.

Depend on how you install the node.js the location of its binary might vary.

Use https://crontab.cronhub.io/ to generate your desired cron expression. 
(e.g */30 * * * * -> run every 30 mintues)

For example copy this into file opened by "crontab -e" and change the directory path with your own.
```
*/30 * * * * /root/.nvm/versions/node/v17.3.0/bin/node /path/to/proram/assetNotifier/index.js watch >> /var/log/watcher
```


