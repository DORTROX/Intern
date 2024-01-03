/*

It takes more than 2 hours for the api key to work so i left the actual process, you can either create your own api key or wait for 2 hours / till it validates to work.

*/









const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());



app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    const weatherData = await Promise.all(
      cities.map(async (city) => {
        // Step 1: Get latitude and longitude of the city
        const response1 = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b1523aa33b9ff3c04caf5381f5dbbe28`); // Yes i know how env works
        const { lat, lon } = response1.data.coord;

        // Step 2: Get weather data using latitude and longitude
        const response2 = await axios.get(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=b1523aa33b9ff3c04caf5381f5dbbe28`); // Yes i know how env works
        
        return { [city]: response2.data.current };
      })
    );

    const result = { weather: Object.assign({}, ...weatherData) };
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
