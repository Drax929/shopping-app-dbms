
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  createArticle, 
  getCategories,
  Article 
} from '../api/articlesApi';
import ArticleForm from '../components/ArticleForm';

const NewArticle = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const handleSubmit = async (article: Article) => {
    try {
      await createArticle(article);
      toast.success('Article created successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Failed to create article. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
        </div>
      </header>
      
      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <ArticleForm 
            onSubmit={handleSubmit} 
            categories={categories} 
          />
        </div>
      </main>
    </div>
  );
};

export default NewArticle;
