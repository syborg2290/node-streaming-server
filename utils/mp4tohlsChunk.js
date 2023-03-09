"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../videos");
const dest = path.join(__dirname, "../temp/chunks/videos");

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const startTime = new Date();
console.info("> Start reading files", startTime);

fs.readdir(dir, (readDirError, files) => {
  if (readDirError) {
    console.error(readDirError);

    return;
  }

  const countFiles = files.length;

  files.map(async (file, index) => {
    const fileName = path.join(dir, file);
    
    //fmpeg -i input.mp4 -vf scale=320:-1 output.mp4

    const { err, stdout, stderr } = await exec(
      `ffmpeg -i ${fileName} -vf scale=-1:720 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls  ${dest}/${index}.m3u8`
    );

    if (err) {
      console.log(err);
    }

    if (countFiles - 1 === index) {
      const endTime = new Date();
      console.info("< End Preparing files", endTime);
    }
  });
});
