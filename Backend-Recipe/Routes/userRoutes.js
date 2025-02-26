const express = require('express');
const router = express.Router();
const User = require('../model/user-Schema');
const auth = require('../middleware/auth');

// Add recipe to favorites
router.post('/favorites/add', auth, async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if recipe already exists in favorites
        if (user.favoriteRecipes.some(recipe => recipe.recipeId === recipeId)) {
            return res.status(400).json({ message: 'Recipe already in favorites' });
        }

        user.favoriteRecipes.push({ recipeId });
        await user.save();

        res.json({ success: true, favorites: user.favoriteRecipes });
    } catch (error) {
        console.error('Favorite add error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove recipe from favorites
router.delete('/favorites/remove/:recipeId', auth, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        user.favoriteRecipes = user.favoriteRecipes.filter(recipe => recipe.recipeId !== recipeId);
        await user.save();

        res.json({ success: true, favorites: user.favoriteRecipes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Get user's favorite recipes
router.get('/favorites', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            success: true, 
            favorites: user.favoriteRecipes,
            count: user.favoriteRecipes.length 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router;