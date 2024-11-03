let currentPage = 0; // track the current page index

let map; // declare the map globally

// function to validate text-only input
function validateTextInput(input) {
    const textOnlyRegex = /^[A-Za-z\s]+$/; // allow only alphabet characters, case insensitive
    return textOnlyRegex.test(input);
} // end of validateTextInput function

// function to sanitize input using DOMPurify
function sanitizeInput(input) {
    return DOMPurify.sanitize(input); // library used to sanitize the input
} // end of sanitizeInput

// function to search for the destinations fitting the field/pattern input from user
async function searchDestinations() {
    const field = document.getElementById("search-field").value; // get the field value
    let pattern = document.getElementById("search-pattern").value; // get the pattern value

    // client-side input validation
    if (!validateTextInput(pattern)) { // if the input is invalid
        alert("Search pattern should only contain text (letters and spaces).");
        return; // stop the function if validation fails
    }

    // sanitize input
    pattern = sanitizeInput(pattern);

    // prepare for the pagination
    const resultsPerPage = parseInt(document.getElementById("results-count").value) || 5;
    const resultsContainer = document.getElementById("search-results");

    // clear any existing content in the results container
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);

    // initialize the map if it doesn't exist or reset it
    if (!map) {
        map = L.map('map').setView([51.505, -0.09], 2); // default center and zoom
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    } // end of if/else

    // fetch data from the server
    const response = await fetch(`/api/search/${field}/${encodeURIComponent(pattern)}`);
    if (!response.ok) {
        console.error(`Failed to fetch search results: ${response.statusText}`);
        alert(`Error fetching search results: ${response.statusText}`);
        return;
    } // end of if

    const data = await response.json(); // if response was successful, get the json response

    // split data into pages and display destinations
    const pages = [];
    for (let i = 0; i < data.length; i += resultsPerPage) {
        const pageData = data.slice(i, i + resultsPerPage);
        const pageDiv = document.createElement("div");
        pageDiv.classList.add("page");
        pageDiv.style.display = i === 0 ? "block" : "none"; // show only the first page initially

        for (const id of pageData) {
            const destinationResponse = await fetch(`/api/destinations/${id + 1}`);
            if (destinationResponse.ok) {
                const destination = await destinationResponse.json();
                displayDestination(destination, pageDiv);

                // add marker for each destination to the map
                const lat = parseFloat(destination["Latitude"]);
                const lon = parseFloat(destination["Longitude"]);
                if (!isNaN(lat) && !isNaN(lon)) {
                    const marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(`
                        <strong>${destination["Destination"]}</strong><br>
                        Region: ${destination["Region"]}<br>
                        Country: ${destination["Country"]}
                    `);
                } // end of inner if 
            } else {
                console.error(`Failed to fetch destination with ID ${id + 1}`);
            } // end of if/else
        } // end of for

        resultsContainer.appendChild(pageDiv);
        pages.push(pageDiv);
    } // end of outer for

    // update navigation buttons
    updateNavigation(pages);

} // end of searchDestinations function

// update navigation buttons based on current page and total pages
function updateNavigation(pages) {
    document.getElementById("next-page").onclick = () => changePage(pages, 1);
    document.getElementById("prev-page").onclick = () => changePage(pages, -1);
} // end of updateNavigation function

// change the current page by incrementing/decrementing the page index
function changePage(pages, direction) {
    pages[currentPage].style.display = "none"; // hide current page
    currentPage = Math.max(0, Math.min(currentPage + direction, pages.length - 1));
    pages[currentPage].style.display = "block"; // show new current page
} // end of changePanges method

// function used to display the destinations from search result, and from list retrieval
function displayDestination(destination, resultsContainer) {

    // create a container for each destination
    const destinationDiv = document.createElement("div");
    destinationDiv.classList.add("destination-item");

    // create and append destination name
    const nameHeader = document.createElement("h3");
    nameHeader.appendChild(document.createTextNode(destination["Destination"]));
    destinationDiv.appendChild(nameHeader);

    // create and append region
    const regionParagraph = document.createElement("p");
    const regionBold = document.createElement("strong");
    regionBold.appendChild(document.createTextNode("Region: "));
    regionParagraph.appendChild(regionBold);
    regionParagraph.appendChild(document.createTextNode(destination["Region"]));
    destinationDiv.appendChild(regionParagraph);

    // create and append country
    const countryParagraph = document.createElement("p");
    const countryBold = document.createElement("strong");
    countryBold.appendChild(document.createTextNode("Country: "));
    countryParagraph.appendChild(countryBold);
    countryParagraph.appendChild(document.createTextNode(destination["Country"]));
    destinationDiv.appendChild(countryParagraph);

    // create and append category
    const categoryParagraph = document.createElement("p");
    const categoryBold = document.createElement("strong");
    categoryBold.appendChild(document.createTextNode("Category: "));
    categoryParagraph.appendChild(categoryBold);
    categoryParagraph.appendChild(document.createTextNode(destination["Category"]));
    destinationDiv.appendChild(categoryParagraph);

    // create and append latitude
    const latitudeParagraph = document.createElement("p");
    const latitudeBold = document.createElement("strong");
    latitudeBold.appendChild(document.createTextNode("Latitude: "));
    latitudeParagraph.appendChild(latitudeBold);
    latitudeParagraph.appendChild(document.createTextNode(destination["Latitude"]));
    destinationDiv.appendChild(latitudeParagraph);

    // create and append longitude
    const longitudeParagraph = document.createElement("p");
    const longitudeBold = document.createElement("strong");
    longitudeBold.appendChild(document.createTextNode("Longitude: "));
    longitudeParagraph.appendChild(longitudeBold);
    longitudeParagraph.appendChild(document.createTextNode(destination["Longitude"]));
    destinationDiv.appendChild(longitudeParagraph);

    // create and append approximate annual tourists
    const touristsParagraph = document.createElement("p");
    const touristsBold = document.createElement("strong");
    touristsBold.appendChild(document.createTextNode("Approximate Annual Tourists: "));
    touristsParagraph.appendChild(touristsBold);
    touristsParagraph.appendChild(document.createTextNode(destination["ApproxAnnualTourists"]));
    destinationDiv.appendChild(touristsParagraph);

    // create and append currency
    const currencyParagraph = document.createElement("p");
    const currencyBold = document.createElement("strong");
    currencyBold.appendChild(document.createTextNode("Currency: "));
    currencyParagraph.appendChild(currencyBold);
    currencyParagraph.appendChild(document.createTextNode(destination["Currency"]));
    destinationDiv.appendChild(currencyParagraph);

    // create and append majority religion
    const religionParagraph = document.createElement("p");
    const religionBold = document.createElement("strong");
    religionBold.appendChild(document.createTextNode("Majority Religion: "));
    religionParagraph.appendChild(religionBold);
    religionParagraph.appendChild(document.createTextNode(destination["MajorityReligion"]));
    destinationDiv.appendChild(religionParagraph);

    // create and append famous foods
    const foodsParagraph = document.createElement("p");
    const foodsBold = document.createElement("strong");
    foodsBold.appendChild(document.createTextNode("Famous Foods: "));
    foodsParagraph.appendChild(foodsBold);
    foodsParagraph.appendChild(document.createTextNode(destination["FamousFoods"]));
    destinationDiv.appendChild(foodsParagraph);

    // create and append language
    const languageParagraph = document.createElement("p");
    const languageBold = document.createElement("strong");
    languageBold.appendChild(document.createTextNode("Language: "));
    languageParagraph.appendChild(languageBold);
    languageParagraph.appendChild(document.createTextNode(destination["Language"]));
    destinationDiv.appendChild(languageParagraph);

    // create and append best time to visit
    const bestTimeParagraph = document.createElement("p");
    const bestTimeBold = document.createElement("strong");
    bestTimeBold.appendChild(document.createTextNode("Best Time to Visit: "));
    bestTimeParagraph.appendChild(bestTimeBold);
    bestTimeParagraph.appendChild(document.createTextNode(destination["BestTimeToVisit"]));
    destinationDiv.appendChild(bestTimeParagraph);

    // create and append cost of living
    const costParagraph = document.createElement("p");
    const costBold = document.createElement("strong");
    costBold.appendChild(document.createTextNode("Cost of Living: "));
    costParagraph.appendChild(costBold);
    costParagraph.appendChild(document.createTextNode(destination["CostOfLiving"]));
    destinationDiv.appendChild(costParagraph);

    // create and append safety
    const safetyParagraph = document.createElement("p");
    const safetyBold = document.createElement("strong");
    safetyBold.appendChild(document.createTextNode("Safety: "));
    safetyParagraph.appendChild(safetyBold);
    safetyParagraph.appendChild(document.createTextNode(destination["Safety"]));
    destinationDiv.appendChild(safetyParagraph);

    // create and append cultural significance
    const culturalParagraph = document.createElement("p");
    const culturalBold = document.createElement("strong");
    culturalBold.appendChild(document.createTextNode("Cultural Significance: "));
    culturalParagraph.appendChild(culturalBold);
    culturalParagraph.appendChild(document.createTextNode(destination["CulturalSignificance"]));
    destinationDiv.appendChild(culturalParagraph);

    // create and append description
    const descriptionParagraph = document.createElement("p");
    const descriptionBold = document.createElement("strong");
    descriptionBold.appendChild(document.createTextNode("Description: "));
    descriptionParagraph.appendChild(descriptionBold);
    descriptionParagraph.appendChild(document.createTextNode(destination["Description"]));
    destinationDiv.appendChild(descriptionParagraph);

    // append the destinationDiv to the resultsContainer
    resultsContainer.appendChild(destinationDiv);
} // end of displayDestination function

// function used to create a list of favourite destinations
async function createList() {
    const listname = document.getElementById("list-name").value;
    const response = await fetch(`/api/lists/newlist/${listname}`, { method: "POST" });

    const resultsContainer = document.getElementById("lists-display");

    // clear any existing content in the results container
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);

    if (response.ok) {
        const message = await response.text();
        alert(message); // show success message from server
    } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`); // show error message if list already exists
    } // end of if/else
} // end of createList function

// function used to retrieve the destinations from a favourites lise
async function retrieveList() {
    const listname = document.getElementById("list-name").value;
    const resultsContainer = document.getElementById("lists-display");
    
    // clear any existing content in the results container
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);

    const response = await fetch(`/api/lists/getIDs/${listname}`);

    // Handle server response
    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`); // Show error message if list doesn't exist or if there's a server error
        return;
    } // end of if

    // Parse the array of destination IDs
    const destinationIDs = await response.json();

    // Fetch and display each destination by ID
    for (const id of destinationIDs) {
        const destinationResponse = await fetch(`/api/destinations/${id + 1}`);

        if (destinationResponse.ok) {
            const destination = await destinationResponse.json();
            displayDestination(destination, resultsContainer); // Display each destination
        } else {
            console.error(`Failed to fetch destination with ID ${id + 1}`);
        } // end of if/else
    } // end of for
} // end of retrieveList function

// function used to delete a favourites list
async function deleteList() {
    const listname = document.getElementById("list-name").value;
    const resultsContainer = document.getElementById("lists-display");

    // clear any existing content in the results container
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);
    

    // send DELETE request to the server
    const response = await fetch(`/api/lists/delete/${listname}`, { method: "DELETE" });

    // handle server response
    if (response.ok) {
        const successMessage = await response.text();
        alert(successMessage); // Show success message if list was deleted successfully
    } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`); // Show error message if list doesn't exist or if there's a server error
    } // end of if/else
} // end of deleteList function

// function used to add destinations to a favourites list from the text box
async function addDestinationsToList() {
    const input = document.getElementById("destination-names").value;
    const destinationNames = input.split(',').map(name => name.trim()); // split and trim the input

    // client-side input validation for each destination name
    for (const name of destinationNames) {
        if (!validateTextInput(name)) {
            alert("Destination names should only contain text (letters and spaces).");
            return; // stop the function if validation fails
        } // end of if
    } // end of for

    // sanitize each destination name
    const sanitizedNames = destinationNames.map(name => sanitizeInput(name));

    const listname = document.getElementById("list-name").value;
    const destinationIDs = [];
    const resultsContainer = document.getElementById("lists-display");

    // clear any existing content in the results container
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);

    for (const name of sanitizedNames) {
        try {
            // make a fetch call to the server to search for the destination by name
            const response = await fetch(`/api/search/Destination/${encodeURIComponent(name)}/1`);
            if (!response.ok) {
                throw new Error(`Error fetching destination for "${name}": ${response.statusText}`);
            } // end of first if

            const ids = await response.json();
            if (ids.length > 0) {
                destinationIDs.push(ids[0]); // add 1 to the index to get the ID
            } else {
                console.warn(`No destination found for "${name}"`);
            } // end of second if/else
        } catch (error) {
            console.error(`Error adding destination "${name}":`, error);
        } // end of try/catch
    } // end of for

    // update the list with the gathered destination IDs
    try {
        const updateResponse = await fetch(`/api/lists/updatelist/${listname}/destinationIDs`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ destinationIDs }),
        }); // end of fetch

        if (!updateResponse.ok)
            throw new Error(`Error updating list: ${updateResponse.statusText}`);
        
        const result = await updateResponse.text();
        console.log(result); // success message
    } catch (error) {
        console.error('Error updating the list:', error);
    } // end of try/catch
} // end of addDestinationsToList function

// function to sort the displayed list by country, region, or name
async function sortDisplayedList() {
    const sortField = document.getElementById("sort-field").value; // get field
    const listName = document.getElementById("list-name").value; // get list name
    const resultsContainer = document.getElementById("lists-display"); // results container

    // retrieve the list data
    const response = await fetch(`/api/lists/getIDs/${listName}`);

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
        return;
    } // error response, leave function

    // parse the array of destination IDs
    const destinationIDs = await response.json();
    const destinations = [];

    // fetch each destination details and push them to the array
    for (const id of destinationIDs) {
        const destinationResponse = await fetch(`/api/destinations/${id + 1}`);
        if (destinationResponse.ok) {
            const destination = await destinationResponse.json();
            destinations.push(destination);
        } else {
            console.error(`Failed to fetch destination with ID ${id + 1}`);
        } // end of if/else
    } // end of for

    // sort the destinations based on the selected field
    destinations.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
    }); // end of destinations.sort

    /* clear existing content in the results container right before displaying the sorted data,
        so that it does not display duplicates */
    while (resultsContainer.firstChild)
        resultsContainer.removeChild(resultsContainer.firstChild);
    

    // display each sorted destination using displayDestination()
    destinations.forEach(destination => {
        displayDestination(destination, resultsContainer);
    }); // end of forEach to display
} // end of sortDisplayedList function

// add event listeners for client-side validation on relevant input fields
document.getElementById("search-pattern").addEventListener("input", function () {
    if (!validateTextInput(this.value)) {
        this.style.borderColor = "red";
    } else {
        this.style.borderColor = ""; // reset to default if valid
    }
});