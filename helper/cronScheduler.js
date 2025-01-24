import cron from "cron";

// Thank you ChatGPT
export async function cronSchedule(cronValue, callback) {
  // Validate cron job value and set up cron job
  // Assuming cron job value is always in format <number><unit>, like 2h, 1d, 30m
  const cronUnit = cronValue.slice(-1);
  const cronNumber = parseInt(cronValue.slice(0, -1));
  let cronSchedule;
  switch (cronUnit) {
    case "h":
      cronSchedule = `0 */${cronNumber} * * *`; // Every <cronNumber> hours
      break;
    case "d":
      cronSchedule = `0 0 */${cronNumber} * *`; // Every <cronNumber> days
      break;
    case "m":
      cronSchedule = `*/${cronNumber} * * * *`; // Every <cronNumber> minutes
      break;
    default:
      console.error("Invalid cron job unit. Please use h, d, or m.");
      process.exit(1);
  }
  // Set up cron job
  const job = new cron.CronJob(cronSchedule, () => {
    console.log(`[+] ${new Date()}`);
    console.log(
      `Cron job triggered. Running your task named ${callback.name} ...`
    );
    // Call your function or task to run here
    callback();
  });

  job.start();
}
