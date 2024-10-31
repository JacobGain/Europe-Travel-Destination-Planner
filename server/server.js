const fs = require("fs");
const csvParser = require("csv-parser");


const destinationsJSON = [] // stores the csv data in JSON format
fs.createReadStream("data/europe-destinations.csv")
    .pipe(csvParser())
    .on("data", (data) => {
        destinationsJSON.push(data);
    })
    .on("end", () => {
        console.log(destinationsJSON);
    });