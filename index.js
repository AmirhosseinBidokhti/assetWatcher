import { initWatcher } from "./init.js";
import { watchForHackerone } from "./watchers/hackerone.js";
import { watchForIntigriti } from "./watchers/intigriti.js";
import { watchForYeswehack } from "./watchers/yeswehack.js";
import { watchForBugCrowd } from "./watchers/bugcrowd.js";
import { watchForFederacy } from "./watchers/federacy.js";

const arg = process.argv.slice(2);

const main = async () => {
  await watchForHackerone();
  await watchForBugCrowd();
  await watchForIntigriti();
  await watchForYeswehack();
  await watchForFederacy()
};

if (arg[0] === "init") initWatcher();
if (arg[0] === "watch") main();

