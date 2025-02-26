import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styling/favour.css'
import { API_KEY } from '../../config/config';
const Favourite = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipeDetails, setRecipeDetails] = useState({});
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setFavorites(response.data.favorites);
                    await Promise.all(
                        response.data.favorites.map(async (fav) => {
                            try {
                                const recipeResponse = await axios.get(
                                    `https://api.spoonacular.com/recipes/${fav.recipeId}/information?apiKey=${API_KEY}&&includeNutrition=true`
                                );
                                setRecipeDetails(prev => ({
                                    ...prev,
                                    [fav.recipeId]: recipeResponse.data
                                }));
                            } catch (error) {
                                console.error(`Error fetching recipe ${fav.recipeId}:`, error);
                            }
                        })
                    );
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="container mx-auto px-4 pt-20 flex flex-col items-center login">
            <h1 className="text-3xl font-bold mb-6 text-center">My Favorite Recipes</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                </div>
            ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
                    {favorites.map((recipe) => {
                        const details = recipeDetails[recipe.recipeId];
                        return details ? (
                            <div key={recipe.recipeId} className="bg-white rounded-lg shadow-md overflow-hidden mx-auto w-full">
                                <div className="relative">
                                    <img 
                                        src={details.image} 
                                        alt={details.title} 
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {details.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Ready in: {details.readyInMinutes} mins</span>
                                        <span>Servings: {details.servings}</span>
                                    </div>
                                </div>
                            </div>
                        ) : null;
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-600 w-full">
                    <p>No favorite recipes yet.</p>
                </div>
            )}
        </div>
    );
};

export default Favourite;