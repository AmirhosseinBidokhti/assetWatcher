import { initWatcher } from "./init.js";
import { watchForHackerone } from "./watchers/hackerone.js";
import { watchForIntigriti } from "./watchers/intigriti.js";
import { watchForYeswehack } from "./watchers/yeswehack.js";
import { watchForBugCrowd } from "./watchers/bugcrowd.js";
import { watchForFederacy } from "./watchers/federacy.js";

import cron from "node-cron";


const arg = process.argv.slice(2);

const main = async () => {
  await watchForIntigriti();
  await watchForYeswehack();
  await watchForFederacy()
  await watchForBugCrowd();
  await watchForHackerone();

};

if (arg[0] === "init") initWatcher();

if (arg[0] === "watch") main();


// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   main();
// });

//main();
