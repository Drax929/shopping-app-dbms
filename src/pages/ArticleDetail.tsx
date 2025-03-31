
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  getArticleById, 
  deleteArticle,
  Article 
} from '../api/articlesApi';
import { Button } from '../components/ui/button';
import { Calendar, Tag, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const articleData = await getArticleById(id);
        
        if (!articleData) {
          toast.error('Article not found');
          navigate('/');
          return;
        }
        
        setArticle(articleData);
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const success = await deleteArticle(id);
      
      if (success) {
        toast.success('Article deleted successfully');
        navigate('/');
      } else {
        toast.error('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article. Please try again.');
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
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const createdAt = article.createdAt ? new Date(article.createdAt) : new Date();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">{article.title}</h1>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-6 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {article.category}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <time dateTime={createdAt.toISOString()}>
                  {format(createdAt, 'PPP')}
                </time>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/edit/${article._id}`)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none mb-6">
            <p className="whitespace-pre-line text-gray-700">{article.content}</p>
          </div>
          
          {article.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArticleDetail;
