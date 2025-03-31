
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ShopHeader from '../components/ShopHeader';
import ShopSidebar from '../components/ShopSidebar';
import ProductCard from '../components/ProductCard';
import { 
  getProducts, 
  getCategories, 
  getTags,
  Product, 
  ProductFilter 
} from '../api/productsApi';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const location = useLocation();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        
        setCategories(categoriesData);
        setTags(tagsData);
        
        const productsData = await getProducts();
        setProducts(productsData);
        
        // Calculate min and max price from products
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange([min, max]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [location.pathname]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        const filter: ProductFilter = {};
        
        if (selectedCategory) {
          filter.category = selectedCategory;
        }
        
        if (selectedTags.length > 0) {
          filter.tags = selectedTags;
        }
        
        if (searchTerm) {
          filter.searchTerm = searchTerm;
        }
        
        filter.minPrice = priceRange[0];
        filter.maxPrice = priceRange[1];
        
        const productsData = await getProducts(filter);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading filtered products:', error);
        toast.error('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedTags, priceRange]);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ShopHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <div className="flex flex-1">
        <ShopSidebar 
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory}` : 'All Products'}
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.length > 0 && (
                <p className="text-sm text-gray-600">
                  Tags: {selectedTags.join(', ')}
                </p>
              )}
              
              {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                <p className="text-sm text-gray-600">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                </p>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
