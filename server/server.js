const fs = require("fs");
const csvParser = require("csv-parser");
const express = require("express");
const app = express();

app.use(express.json())

const destinationsJSON = [] // stores the csv data in JSON format
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
    const destination = destinationsJSON[req.params.id - 1]
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
    const destination = destinationsJSON[req.params.id - 1]
    const coordinates = { 
        Latitude: destination["Latitude"],
        Longitude: destination["Longitude"] 
    };

    res.json(coordinates);
});

// item 3, get all available country names
app.get('/api/countries', (req, res) => {
    const countryNames = []
    for(let i = 0; i < destinationsJSON.length; i++) {
        const countryName = destinationsJSON[i]["Country"]
        if (!countryNames.some(c => c.name === countryName))
            countryNames.push({name: countryName});
    };

    res.json(countryNames);
})

// PORT environment variable, part of enviro where process runs
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))