
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from '../api/articlesApi';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Tag, X } from 'lucide-react';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (article: Article) => Promise<void>;
  categories: string[];
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  article, 
  onSubmit,
  categories
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || (categories.length > 0 ? categories[0] : ''));
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...article,
        title,
        content,
        category,
        tags,
      });
      navigate('/');
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content here..."
          rows={10}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex space-x-2">
          <Input
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addTag}
            variant="outline"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <div 
              key={tag} 
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              <Tag className="w-3 h-3" />
              <span className="text-sm">{tag}</span>
              <button 
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;
