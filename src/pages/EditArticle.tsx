
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  getArticleById, 
  updateArticle,
  getCategories,
  Article 
} from '../api/articlesApi';
import ArticleForm from '../components/ArticleForm';

const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const [articleData, categoriesData] = await Promise.all([
          getArticleById(id),
          getCategories()
        ]);
        
        if (!articleData) {
          toast.error('Article not found');
          navigate('/');
          return;
        }
        
        setArticle(articleData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (updatedArticle: Article) => {
    if (!id) return;
    
    try {
      await updateArticle(id, updatedArticle);
      toast.success('Article updated successfully');
      navigate(`/article/${id}`);
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article. Please try again.');
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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
        </div>
      </header>
      
      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <ArticleForm 
            article={article}
            onSubmit={handleSubmit} 
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
};

export default EditArticle;
