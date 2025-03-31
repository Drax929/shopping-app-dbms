
import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold text-blue-900">ArticleBase</span>
        </Link>
        
        <div className="relative w-full max-w-md mx-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/new" 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            New Article
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
