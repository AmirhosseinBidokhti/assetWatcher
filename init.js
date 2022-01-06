import fs from "fs";
import { API } from "./api-fetcher/index.js";
import { BUG_BOUNTY_PLATFORMS } from "./helper/constants.js";
import { readData } from "./helper/utils.js";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PLATFORMS = Object.keys(BUG_BOUNTY_PLATFORMS);

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    PLATFORMS.map((platform) => {
      try {
        const filePath = `${__dirname}/db/${platform}.json`

        if (fs.existsSync(filePath)) {
          //file exists, no need to add new one
          console.log(`JSON file for ${platform} already exists!`);
        } else {
          fs.appendFile(filePath, "", function (err) {
            if (err) throw err;
          });
          console.log(`JSON file for ${platform} was created successfully!`);
        }
      } catch (err) {
        console.log(err);
      }
    });
    resolve();
  });
};

const seeder = () => {
  return new Promise((resolve, reject) => {
    PLATFORMS.map(async (platform) => {
      const filePath = `${__dirname}/db/${platform}.json`
      const data = readData(filePath);

      if (data === "empty") {
        const resp = await API(platform.toLowerCase());

        fs.writeFile(filePath, resp, function (err) {
          if (err) {
            console.log(
              `An error occured while seeding JSON Object to ${platform} File.`
            );
          }
        });
	console.log(`Seeding for ${platform} was done successfully!`);
      }
    });

    resolve();
  });
};

const initWatcher = async () => {
  try {
    await createDatabase();
    await seeder();
  } catch (error) {
    console.log(error);
  }
};

export { initWatcher };
