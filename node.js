
Serene Law <serene0162@gmail.com>
10:02 PM (1 hour ago)
to me

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // install with: npm install node-fetch

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/search', async (req, res) => {
const { category, location } = req.body;

// Sample API from data.gov.sg (mocked — change for real endpoint)
let apiUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=dummy-id';

// You can adjust based on category
if (category === 'electronics') {
// Sample: add your logic here
apiUrl = 'https://api.example.com/e-waste-centres';
}

try {
const response = await fetch(apiUrl);
const data = await response.json();

// Mock sample format – adjust to real structure
const results = data.result.records.slice(0, 5).map(record => ({
name: record.name || "Centre",
address: record.address || "Address not available"
}));

res.json(results);
} catch (error) {
console.error(error);
res.status(500).json([{ name: 'Error fetching data', address: '' }]);
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));