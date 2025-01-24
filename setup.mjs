#!/usr/bin/env zx

import { $ } from "zx";
import fs from "fs";
import { execSync } from "child_process";

// Enable verbose mode for detailed output
$.verbose = true;

// Helper function to check if a package is installed globally
function isPackageInstalled(packageName) {
  try {
    execSync(`npm list -g ${packageName}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Helper function to check if `node_modules` exists in the project
function isNodeModulesPresent() {
  return fs.existsSync("node_modules");
}

// Parse command-line arguments for dynamic options
const args = process.argv.slice(2);
const cronTime =
  args.find((arg) => arg.startsWith("--cron="))?.split("=")[1] || "1h"; // Default cron time is 1h
const pm2Name =
  args.find((arg) => arg.startsWith("--name="))?.split("=")[1] ||
  "assetWatcher"; // Default PM2 name
const stopProcess = args.includes("--stop"); // Check if the --stop flag is passed

// If the --stop flag is provided, stop and delete the PM2 process
if (stopProcess) {
  console.log(`Stopping and deleting the PM2 process named "${pm2Name}"...`);
  try {
    await $`pm2 stop ${pm2Name}`;
    await $`pm2 delete ${pm2Name}`;
    console.log(`PM2 process "${pm2Name}" has been stopped and deleted.`);
  } catch (error) {
    console.error(
      `Failed to stop/delete the process "${pm2Name}". Make sure it exists.`
    );
  }
  process.exit(0); // Exit after handling the stop operation
}

// Install npm dependencies if not already installed
if (!isNodeModulesPresent()) {
  console.log("Installing project dependencies...");
  await $`npm install`;
} else {
  console.log("Dependencies are already installed.");
}

// Install PM2 globally if not already installed
if (!isPackageInstalled("pm2")) {
  console.log("Installing PM2 globally...");
  await $`npm install pm2 -g`;
} else {
  console.log("PM2 is already installed globally.");
}

// Start PM2 with the predefined command
console.log("Starting PM2...");
await $`pm2 start "node index.js -c ${cronTime} --watch" --watch -n ${pm2Name}`;

console.log(`PM2 started with cron time "${cronTime}" and name "${pm2Name}".`);

/* 
  Example Usage
	1. Run with default values:
    node setup.mjs 

  2. Run with custom cron time and PM2 process name:
    node setup.mjs --cron=30m --name=myWatcher

  3. Stop PM2 process by default or name:
    node setup.mjs --stop
    node setup.mjs --stop --name=myWatcher
*/
