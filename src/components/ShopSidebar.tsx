
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

const ShopSidebar: React.FC<SidebarProps> = ({
  categories,
  tags,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  toggleTag,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice
}) => {
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const resetFilters = () => {
    setSelectedCategory(null);
    selectedTags.forEach(tag => toggleTag(tag));
    setPriceRange([minPrice, maxPrice]);
  };
  
  return (
    <aside className="w-64 p-6 bg-white border-r">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="text-xs"
        >
          Reset All
        </Button>
      </div>
      
      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <div className="space-y-1">
          <div 
            className={`text-sm py-1 px-2 cursor-pointer rounded-md ${
              selectedCategory === null ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </div>
          
          {categories.map((category) => (
            <div
              key={category}
              className={`text-sm py-1 px-2 cursor-pointer rounded-md ${
                selectedCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            value={[priceRange[0], priceRange[1]]}
            max={maxPrice}
            min={minPrice}
            step={1}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm">
              ${priceRange[0]}
            </div>
            <div className="text-sm">
              ${priceRange[1]}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags Section */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox 
                id={`tag-${tag}`}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <Label 
                htmlFor={`tag-${tag}`}
                className="text-sm cursor-pointer"
              >
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ShopSidebar;
