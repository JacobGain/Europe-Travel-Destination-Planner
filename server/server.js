const fs = require("fs");
const csvParser = require("csv-parser");
const express = require("express");
const app = express();

app.use(express.json());

const destinationsJSON = []; // stores the csv data in JSON format
fs.createReadStream("data/europe-destinations.csv")
    .pipe(csvParser())
    .on("data", (data) => {
        const cleanData = Object.keys(data).reduce((acc, key) => {
            const cleaningKey = key.replace(/[^\x00-\x7F]/g, '').trim();
            acc[cleaningKey] = data[key];
            return acc;
        }, {});
        destinationsJSON.push(cleanData);
    })
    .on("end", () => {
        //console.log(destinationsJSON);
    });

// item 1, get all information of a given destination ID
app.get('/api/destinations/:id', (req, res) => {
    const destination = destinationsJSON[req.params.id - 1];
    const destinationInfo = {
        Destination: destination["Destination"],
        Region: destination["Region"],
        Country: destination["Country"],
        Category: destination["Category"],
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"],
        ApproxAnnualTourists: destination["Approximate Annual Tourists"],
        Currency: destination["Currency"],
        MajorityReligion: destination["Majority Religion"],
        FamousFoods: destination["Famous Foods"],
        Language: destination["Language"],
        BestTimeToVisit: destination["Best Time to Visit"],
        CostOfLiving: destination["Cost of Living"],
        Safety: destination["Safety"],
        CulturalSignificance: destination["Cultural Significance"],
        Description: destination["Description"]
    };

    res.json(destinationInfo);
});

// item 2, get geographical coordinates of a given destination ID
app.get('/api/destinations/geocoordinates/:id', (req, res) => {
    const destination = destinationsJSON[req.params.id - 1];
    const coordinates = {
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"]
    };

    res.json(coordinates);
});

// item 3, get all available country names
app.get('/api/countries', (req, res) => {
    const countryNames = [];
    for (let i = 0; i < destinationsJSON.length; i++) {
        const countryName = destinationsJSON[i]["Country"];
        if (!countryNames.some(c => c.name === countryName))
            countryNames.push({ name: countryName });
    };

    res.json(countryNames);
});

// item 4, match(field, pattern, n)
/* Find first n number of matching IDs for pattern matching a given field.
    If n is not given or the number of matches is less than n, return all matches */
app.get('/api/search/:field/:pattern/:n?', (req, res) => {
    const { field, pattern, n } = req.params; // get local variables for each parameter
    const resultLimit = n ? parseInt(n, 10) : undefined; // convert 'n' to integer if provided

    try { // try block to catch a 500 error
        // create a case-insensitive regular expression
        const regex = new RegExp(pattern, 'i');

        // filter data based on the pattern and field
        const matches = destinationsJSON
            // create an array of objects with index and destination
            .map((destination, index) => ({ index, destination }))
            // filter the matches based on the regular expression
            .filter(({ destination }) => destination[field] && regex.test(destination[field]))
            // use map to return only the indices
            .map(({ index }) => index);

        // limit matches if n is specified
        const result = resultLimit ? matches.slice(0, resultLimit) : matches;

        res.json(result);
    } catch (error) { res.status(500).send(`Error processing request: ${error.message}`); }
});

// PORT environment variable, part of enviro where process runs
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))