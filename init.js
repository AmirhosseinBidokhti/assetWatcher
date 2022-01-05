import fs from "fs";
import { API } from "./API/index.js";
import { BUG_BOUNTY_PLATFORMS } from "./constants.js";
import { readData } from "./utils.js";

const PLATFORMS = Object.keys(BUG_BOUNTY_PLATFORMS);

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    PLATFORMS.map((platfrom) => {
      try {
        if (fs.existsSync(`./db/${platfrom}.json`)) {
          //file exists
          console.log(`JSON file for ${platfrom} already exists!`);
        } else {
          fs.appendFile(`./db/${platfrom}.json`, "", function (err) {
            if (err) throw err;
          });
          console.log(`JSON file for ${platfrom} was created successfully!`);
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
      const data = readData(`./db/${platform}.json`);
      if (data === "empty") {
        const resp = await API(platform.toLowerCase());

        fs.writeFile(`./db/${platform}.json`, resp, function (err) {
          if (err) {
            console.log(
              `An error occured while seeding JSON Object to ${platform} File.`
            );
          }
          console.log(`Seeding for ${platform} was done successfully!`);
        });
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

//initWatcher();

export { initWatcher };
