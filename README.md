Here’s a detailed **README.md** for your project repository:

---

# Europe Travel Destination Planner

**Europe Travel Destination Planner** is a full-stack RESTful web application designed to make travel planning easy and enjoyable. Users can search for European destinations by name, region, or country, view detailed destination information, and save their favorites into custom lists. The app features a dynamic map visualization and provides an interactive and intuitive user experience.

---

## Features

- **Search Functionality**  
  - Search destinations by name, region, or country.  
  - View destination details, including region, country, latitude/longitude, cultural significance, and more.  
  - Paginated search results for improved navigation.

- **Map Integration**  
  - Visualize search results on an interactive map using Leaflet.js.  
  - View location markers with popups showing key destination details.

- **Favorite List Management**  
  - Create, retrieve, update, and delete favorite destination lists.  
  - Sort lists by name, region, or country.  
  - Manage destinations in each list dynamically.

- **Robust Backend**  
  - RESTful API built with Node.js and Express.  
  - Support for HTTP requests (GET, POST, PUT, DELETE).  
  - Destination data stored in a CSV file and processed into JSON format.  

- **Secure and Responsive**  
  - Input validation and sanitization for secure interactions.  
  - Fully responsive design for desktop and mobile users.  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** JSON (processed from CSV)  
- **Mapping Library:** Leaflet.js  
- **Deployment:** AWS  

---

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open the application in your browser:
   ```bash
   http://localhost:3000
   ```

---

## Usage

### Search Destinations  
1. Select search criteria: Name, Region, or Country.  
2. Enter the search term and click the **Search** button.  
3. View results in a list and on the map.  

### Manage Favorite Lists  
1. Create a new list by entering a name and clicking **Create List**.  
2. Add destinations to your list by their names.  
3. Retrieve, update, or delete lists as needed.

---

## API Endpoints

- `GET /api/destinations/:id`  
  Fetch detailed information for a specific destination.

- `GET /api/search/:field/:pattern/:n?`  
  Search for destinations matching a pattern in a specified field.

- `POST /api/lists/newlist/:listname`  
  Create a new list with the given name.

- `PUT /api/lists/updatelist/:listname/destinationIDs`  
  Update the list with the specified destination IDs.

- `GET /api/lists/getIDs/:listname`  
  Retrieve the destination IDs in a given list.

- `DELETE /api/lists/delete/:listname`  
  Delete a list by name.

---

## Folder Structure

```
📂 project-root
├── 📂 client
│   ├── index.html         # Main HTML file
│   ├── lab3.css           # CSS for styling
│   ├── lab3.js            # Client-side JavaScript
├── 📂 server
│   ├── server.js          # Backend logic
│   ├── data
│   │   ├── europe-destinations.csv   # Destination data
│   │   ├── lists.json                 # Storage for favorite lists
├── README.md              # Documentation (this file)
├── package.json           # Node.js dependencies
```

---

## Future Enhancements

- Add user authentication for personalized experiences.  
- Include additional filters, such as by travel cost or tourist safety.  
- Integrate external APIs for real-time weather and flight information.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
