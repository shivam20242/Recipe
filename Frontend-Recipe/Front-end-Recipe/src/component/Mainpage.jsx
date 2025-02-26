import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardModal from './CardModal';

const Mainpage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
    });

    const fetchAllRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/recipes`);
            if (response.data && response.data.data) {
                setAllRecipes(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        } finally {
            setLoading(false);
        }
    };
console.log(allRecipes)
    const handleRecipeClick = (recipeId) => {
        console.log('Recipe ID:', recipeId);
    };

    const handlePageChange = async (action) => {
        try {
            await axios.post('http://localhost:5000/api/recipes/page', { action });
            fetchAllRecipes();
        } catch (error) {
            console.error('Pagination failed:', error);
        }
    };
    useEffect(() => {
        fetchAllRecipes();
    }, []);
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/search`, {
                params: {
                    q: searchQuery
                }
            });
            
            if (response.data && response.data.data) {
                setSearchResults(response.data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    const displayRecipes = searchQuery.trim() ? searchResults : allRecipes;
    return (
        <div className="min-h-screen bg-gray-50 pt-20 w-screen overflow-x-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Search Section */}
                <div className="text-center py-16 sm:py-20 w-full">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                        Find Your Perfect Recipe
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                        Discover thousands of recipes for every taste and occasion
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for recipes..."
                                    className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-4 bg-rose-500 text-white rounded-full text-lg font-medium hover:bg-rose-600 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Search Results or All Recipes */}
            {loading ? (
                <div className="text-center mt-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                </div>
            ) : (
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
                    {displayRecipes.length > 0 ? (
                        displayRecipes.map((recipe) => (
                            <CardModal 
                                key={recipe.id} 
                                recipe={recipe} 
                                onClick={() => handleRecipeClick(recipe.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            {searchQuery.trim() ? 'No recipes found for your search' : 'Loading recipes...'}
                        </div>
                    )}
                </div>
            )}
            {/* Pagination Controls */}
            {!searchQuery && displayRecipes.length > 0 && (
                <div className="flex justify-center items-center gap-4 my-8">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={!pagination.hasPrev}
                        className={`px-4 py-2 rounded-md ${
                            pagination.hasPrev 
                            ? 'bg-rose-500 text-white hover:bg-rose-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <span className="text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={!pagination.hasNext}
                        className={`px-4 py-2 rounded-md ${
                            pagination.hasNext 
                            ? 'bg-rose-500 text-white hover:bg-rose-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>

                    {pagination.currentPage !== 1 && (
                        <button
                            onClick={() => handlePageChange('reset')}
                            className="px-4 py-2 rounded-md text-rose-500 hover:text-rose-600"
                        >
                            Reset
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Mainpage;