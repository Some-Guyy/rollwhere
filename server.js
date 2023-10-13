const path = require('path');
const express = require('express');

const app = express()
const PORT = process.env.PORT || 3000;

// Function to return a prettier date string format of "YYYY-MM-DD HH:MM:SS" from a date object. Mainly used for logging.
const convertDateToString = date => {
    date_string = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    return date_string;
}

// Startup of server.
startupDate = new Date();
startupDateString = convertDateToString(startupDate);

// Files to serve to client.
app.use(express.static(path.join(__dirname, 'src')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
})

app.listen(PORT, () => console.log(`${startupDateString} - [INFO] - Server startup! Running on port ${PORT}.`));
