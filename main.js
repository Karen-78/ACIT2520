
const path = require("path");
const { pipeline } = require('stream/promises');
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const filterWanted = process.argv[2];

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.grayScale(pathUnzipped, pathProcessed, filterWanted))
  .catch(error => {
    console.error('Error occurred:', error);
  });
