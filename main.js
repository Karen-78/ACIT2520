/*
* Project: Milestone 1
* File Name: main.js
* Description:
*    It uses process.argv
*    Pass it either "grayscale" or "sepia" depending which filter you want to use. 
*
* Created Date: Feb 20, 2024
* Author: Chu Jun (Karen) Yan (Set A)
*
*/
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const path = require("path");
const { pipeline } = require('stream/promises');
const filterWanted = process.argv[2];

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.grayScale(pathUnzipped, pathProcessed, filterWanted))
  .catch(error => {
    console.error('Error occurred:', error);
  });
