// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// Main landing page
app.get('/', async function(req, res) {

    // Try-Catch for any errors
    try {
        // Get all blog posts
        const blogs = await prisma.post.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });

        // Render the homepage with all the blog posts
        await res.render('pages/home', { blogs: blogs });
      } catch (error) {
        res.render('pages/home');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// location test
app.post("/find-options", (req, res) => {
    const { category, location } = req.body;
    // Fetch decluttering options based on category & location
    res.json({ message: "Options retrieved successfully!" });
});

// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        // Get the title and content from submitted form
        const { title, content } = req.body;

        // Reload page if empty title or content
        if (!title || !content) {
            console.log("Unable to create new post, no title or content");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const blog = await prisma.post.create({
                data: { title, content },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

// Tells the app which port to run on
app.listen(8080);

//test
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