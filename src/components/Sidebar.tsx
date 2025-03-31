
import React from 'react';
import { Tag, Folder } from 'lucide-react';

interface SidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  tags,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  toggleTag,
}) => {
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto sticky top-16">
      <div className="mb-6">
        <h2 className="flex items-center text-sm font-semibold text-gray-600 uppercase mb-2">
          <Folder className="w-4 h-4 mr-2" />
          Categories
        </h2>
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                selectedCategory === null ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <button
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                  selectedCategory === category ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="flex items-center text-sm font-semibold text-gray-600 uppercase mb-2">
          <Tag className="w-4 h-4 mr-2" />
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-2 py-1 text-xs rounded-full ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
