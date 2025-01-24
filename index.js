import { initWatcher } from "./init.js";
import { watchForHackerone } from "./watchers/hackerone.js";
import { watchForIntigriti } from "./watchers/intigriti.js";
import { watchForYeswehack } from "./watchers/yeswehack.js";
import { watchForBugCrowd } from "./watchers/bugcrowd.js";
import { watchForFederacy } from "./watchers/federacy.js";

import { program } from "commander";
import { cronSchedule } from "./helper/cronScheduler.js";

const watchAll = async () => {
  await watchForHackerone();
  await watchForBugCrowd();
  await watchForIntigriti();
  //await watchForYeswehack();
  //await watchForFederacy()
};

program
  .option("-i, --init", "Run seeder function")
  .option("-w, --watch", "watch for changes in bounty platforms")
  .option(
    "-c, --cronjob <value>",
    "Set desired cronjob value (e.g. -c 2h, -c 1d, or -c 30m)"
  )
  .parse(process.argv);

const { init, watch, cronjob } = program.opts();

async function main() {
  if (init) {
    console.info("[+] Running the init function...");
    initWatcher();
    return;
  }

  if (cronjob) {
    console.log(`[+] Starting the cronjob ${cronjob}`);
    cronSchedule(cronjob, watchAll);
  } else {
    console.info("Pleaser provide your cronjob in order to run the tool.");
    process.exit(1);
  }
}

main();
