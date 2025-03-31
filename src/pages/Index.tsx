
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ArticleCard from '../components/ArticleCard';
import { 
  getArticles, 
  getCategories, 
  getTags,
  Article, 
  ArticleFilter 
} from '../api/articlesApi';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load categories and tags
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
        
        // Load articles without filters initially
        const articlesData = await getArticles();
        setArticles(articlesData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        
        const filter: ArticleFilter = {};
        
        if (selectedCategory) {
          filter.category = selectedCategory;
        }
        
        if (selectedTags.length > 0) {
          filter.tags = selectedTags;
        }
        
        if (searchTerm) {
          filter.searchTerm = searchTerm;
        }
        
        const articlesData = await getArticles(filter);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error loading filtered articles:', error);
        toast.error('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the search to avoid too many requests
    const timer = setTimeout(loadArticles, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedTags]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <div className="flex flex-1">
        <Sidebar 
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
        />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </h1>
            {selectedTags.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Filtered by tags: {selectedTags.join(', ')}
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first article'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
