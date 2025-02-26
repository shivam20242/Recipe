import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY,SERVER_URL } from '../../config/config';
const CardModal = ({ recipe }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to add favorites');
                return;
            }

            if (!isFavorite) {
                const response = await axios.post(`${SERVER_URL}api/favorites/add`, 
                    {
                        recipeId: recipe.id.toString()
                    },
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (response.data.success) {
                    setIsFavorite(true);
                }
            } else {
                // Remove from favorites
                const response = await axios.delete(`${SERVER_URL}api/favorites/remove/${recipe.id}`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (response.data.success) {
                    setIsFavorite(false);
                }
            }
        } catch (error) {
            console.error('Favorite action failed:', error);
            alert('Failed to update favorites');
        }
    };

    const handleCardClick = async () => {
        setIsModalOpen(true);
        setLoading(true);
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}&&includeNutrition=true`);
            setRecipeDetails(response.data);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${SERVER_URL}api/favorites`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    const isFav = response.data.favorites.some(fav => fav.recipeId === recipe.id.toString());
                    setIsFavorite(isFav);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [recipe.id]);

    return (
        <>
            <div 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="relative">
                    <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-48 object-cover"
                    />
                    {/* Updated heart button */}
                    <button 
                        className={`absolute top-4 right-4 ${isFavorite ? 'text-rose-500' : 'text-white'} hover:text-rose-500 transition-colors`}
                        onClick={handleFavoriteClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" 
                            fill={isFavorite ? "currentColor" : "none"} 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {recipe.title}
                    </h3>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">{recipe.title}</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                                </div>
                            ) : recipeDetails && (
                                <div className="space-y-6">
                                    <img 
                                        src={recipeDetails.image} 
                                        alt={recipeDetails.title}
                                        className="w-full h-96 object-cover rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Ready in:</span>
                                            {recipeDetails.readyInMinutes} minutes
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Servings:</span>
                                            {recipeDetails.servings}
                                        </div>
                                    </div>
                                    {/* Additional Recipe Details */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Health Score:</span>
                                                <span className="text-green-600">{recipeDetails.healthScore}%</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Price per Serving:</span>
                                                <span>${(recipeDetails.pricePerServing / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Likes:</span>
                                                <span>{recipeDetails.aggregateLikes}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Source:</span>
                                                <a href={recipeDetails.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:text-rose-600">
                                                    {recipeDetails.sourceName}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {recipeDetails.vegetarian && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Vegetarian</span>
                                                )}
                                                {recipeDetails.vegan && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Vegan</span>
                                                )}
                                                {recipeDetails.glutenFree && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Gluten Free</span>
                                                )}
                                                {recipeDetails.dairyFree && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Dairy Free</span>
                                                )}
                                                {recipeDetails.veryHealthy && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Very Healthy</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Summary</h3>
                                        <div dangerouslySetInnerHTML={{ __html: recipeDetails.summary }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                                        <div dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardModal;