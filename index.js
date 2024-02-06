import path from "path";
import fs from 'fs';
import csv from 'csv-parser';
import util from "util";
const copyFilePromise = util.promisify(fs.copyFile);
let oldTitles = [];
let newTitles = [];
let oldFiles = fs.readdirSync('QR Codes')
let dirPath = path.resolve()
let errorCount = 0

function asyncCopyFile(oldTitles, oldFiles, newTitles) {
    return Promise.all(oldTitles.map(async (oldTitle, i) => {
        if (oldFiles.includes(oldTitle)) {
            const oldFileIndex = oldFiles.indexOf(oldTitle)
            console.log(oldFileIndex)
            console.log(oldFiles[oldFileIndex])
            console.log(newTitles[i])
            console.log(oldFileIndex)
            return copyFilePromise(dirPath + '/QR Codes/' + oldFiles[oldFileIndex], dirPath + '/QR-Codes-2/' + newTitles[i] + '.png', function (err) {
                if (err) {
                    errorCount++
                    console.log(errorCount)
                    console.log(err)
                }
            });
        }
    }))
}
fs.createReadStream('titles.csv')
    .pipe(csv({ headers: ['name'] }))
    .on('data', (data) => {
        oldTitles.push(data.name)

    })
    .on('end', function () {
        fs.createReadStream('new-titles.csv')
            .pipe(csv({ headers: ['name'] }))
            .on('data', (newdata) => {
                let formattedFileName = newdata.name.replace('.png', '')
                let dashedFileName = formattedFileName.replace(/[^\w\s]/gi, '')
                newTitles.push(dashedFileName.replace(/\s/g, '_'))

            })
            .on('end', function () {
                asyncCopyFile(oldTitles, oldFiles, newTitles)
            })

    });










