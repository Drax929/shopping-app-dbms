
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../api/productsApi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {product.tags.includes('New') && (
              <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">New</span>
            )}
            {product.tags.includes('Sale') && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">Sale</span>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 flex-1">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
