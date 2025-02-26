const express = require('express')
const router = express.Router();
const axios = require('axios')
require('dotenv').config()

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
let currentPage = 1;

router.post('/recipes/page', (req, res) => {
    const { action } = req.body;
    if (action === 'next') {
        currentPage++;
    } else if (action === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (action === 'reset') {
        currentPage = 1;
    }
    res.json({ currentPage });
});

router.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const response = await axios.get(`${API_URL}/complexSearch`, {
            params: {
                apiKey: API_KEY,
                query: searchQuery,
                number: 20,
                addRecipeInformation: true
            }
        });

        res.json({
            success: true,
            data: response.data.results,
            totalResults: response.data.totalResults
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching recipes',
            error: error.message
        });
    }
});

router.get('/recipes', async (req, res)=>{
    try {
        const limit = 20;
        const offset = (currentPage - 1) * limit;
        const response = await axios.get(`${API_URL}/complexSearch?apiKey=${API_KEY}&number=${limit}&offset=${offset}`);
        
        const recipes = response.data.results;
        const totalResults = response.data.totalResults;
        const totalPages = Math.ceil(totalResults / limit);

        console.log('Current Page:', currentPage);
        console.log('Offset:', offset);

        res.json({
            success: true,
            data: recipes,
            pagination: {
                currentPage,
                totalPages,
                totalResults,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1
            }
        })
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching recipes',
            error: error.message
        })
    }
})

module.exports = router