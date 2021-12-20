const fs = require('fs');
const path = require('path');

/**
 * Performs exporting the given dtoIn and dtoOut into the specified location.
 * @param outputPath
 * @param requestNumber
 * @param dtoIn
 * @param dtoOut
 * @param responseCode
 */
const exportToOutput = (outputPath, requestNumber, dtoIn, dtoOut, responseCode) => {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  fs.writeFileSync(`${outputPath}${path.sep}req${requestNumber + 1}.${responseCode}.dtoIn.json`, JSON.stringify(dtoIn, null, 4));
  fs.writeFileSync(`${outputPath}${path.sep}req${requestNumber + 1}.${responseCode}.dtoOut.json`, JSON.stringify(dtoOut, null, 4));
};

module.exports = exportToOutput;
