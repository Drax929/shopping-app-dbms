
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../api/articlesApi';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const createdAt = article.createdAt ? new Date(article.createdAt) : new Date();
  
  return (
    <Link to={`/article/${article._id}`}>
      <div className="h-full p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {article.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
          {article.title}
        </h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {article.content}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {article.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
              onClick={(e) => e.preventDefault()}
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
              +{article.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
