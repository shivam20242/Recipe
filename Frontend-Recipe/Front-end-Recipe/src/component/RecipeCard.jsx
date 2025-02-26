import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RecipeCard = () => {
    const { id } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_KEY = process.env.REACT_APP_API_KEY
    console.log(id)
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&&includeNutrition=true`);
                console.log('Recipe details:', response.data); // Debug log
                setRecipeDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
                setError('Failed to load recipe details');
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipeDetails();
        }
    }, [id]);
    console.log(recipeDetails)
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!recipeDetails) return <div>No recipe found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 mt-20">
            <h1 className="text-3xl font-bold mb-6">{recipeDetails.title}</h1>
            <img 
                src={recipeDetails.image} 
                alt={recipeDetails.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                    <span className="font-semibold mr-2">Ready in:</span>
                    {recipeDetails.readyInMinutes} minutes
                </div>
                <div className="flex items-center">
                    <span className="font-semibold mr-2">Servings:</span>
                    {recipeDetails.servings}
                </div>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Summary</h2>
                <div dangerouslySetInnerHTML={{ __html: recipeDetails.summary }} />
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
                <div dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }} />
            </div>
        </div>
    );
};

export default RecipeCard;