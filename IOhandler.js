
/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: Feb 20, 2024
 * Author: Chu Jun (Karen) Yan (Set A)
 *
 */
const yauzl = require("yauzl-promise"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path"),
  {pipeline} = require('stream/promises'); // pipeline is being awaited in yauzl. it's saying to wait for the whole stream to finish. to await pipeline, you need to make sure pipeline returns a promise. Importing it like this will solve that. 
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

function unzip(pathIn, pathOut) {
  return new Promise(async(resolve, reject) => {
    const zip = await yauzl.open(pathIn) 
    try {
      for await (const entry of zip) {
        if (entry.filename.endsWith('/')) { // ends with a / means it's a folder. so it's saying to make a folder with the same name if there'a directory. Otherwise, just unzip the file. 
          await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
        } else {
          const readStream = await entry.openReadStream();
          const writeStream = fs.createWriteStream(
            `${pathOut}/${entry.filename}`
          );
          await pipeline(readStream, writeStream); // pipeline is being awaited.
        }
      }
    // } finally {
      await zip.close();
      resolve(); // Resolve the promise when done
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
function readDir(directoryPath) { //iterates through a folder and checks if the file type is png. if it is, append it to the array pngFiles
  const readPromise = new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const pngFiles = []
      files.forEach(file => { // Iterate through files
          if (path.extname(file) === ".png") {
            pngFiles.push(file);
          }
      });
      // console.log(`readDir: ${pngFiles}`);
      resolve(pngFiles);
  })
  });
  return readPromise
  // path.extname(file)
};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const filterWanted = process.argv[2];

function grayScale(pathIn, pathOut, filterWanted) {
  return new Promise((resolve, reject) => {
    readDir(pathIn) 
    .then(data => {
      pngFiles = data;
      // console.log(`grayScale: ${pngFiles}`);
    
      pngFiles.forEach((file) => {
        const filePath = path.join(pathIn, file);
        // console.log("inside forEach");
        fs.createReadStream(filePath)
        .pipe(
          new PNG({
            filterType: 4,
          })
        )
        .on("parsed", function () {
          for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
              var idx = (this.width * y + x) << 2;
              // this is the grayscale filter. Can change it to another filter. 
  
              // sepiaFilter(this.data, idx)
  
              if (filterWanted == 'sepia') {
                sepiaFilter(this.data, idx);
              } else if (filterWanted == 'grayscale') {
                grayScaleFilter(this.data, idx);
              }
            }
          }
          this.pack().pipe(fs.createWriteStream(path.join(pathOut, file)));
          // console.log("done gray")
        })
        .on("error", error => {
          reject(error);
        });
        resolve();
      })
    });
  });
}


function grayScaleFilter(data, idx) {
  const gray = (data[idx] + data[idx + 1] + data[idx + 2])/3;
  data[idx] = gray;
  data[idx + 1] = gray;
  data[idx + 2] = gray;
}
function sepiaFilter(data, idx) {
  const newRed =   0.393*data[idx] + 0.769*data[idx + 1] + 0.189*data[idx + 2]
  const newGreen = 0.349*data[idx] + 0.686*data[idx + 1] + 0.168*data[idx + 2]
  const newBlue =  0.272*data[idx] + 0.534*data[idx + 1] + 0.131*data[idx + 2]
  data[idx] = Math.min(255, newRed); 
  data[idx + 1] = Math.min(255, newGreen);
  data[idx + 2] = Math.min(255, newBlue); 
}
module.exports = {
  unzip,
  readDir,
  grayScale,
};

// unzip("myfile.zip", "unzipped");
// readDir("unzipped");
// grayScale("unzipped", "grayscaled", "sepia");
