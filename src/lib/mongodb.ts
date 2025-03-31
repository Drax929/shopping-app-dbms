
// This file provides a mock implementation for browser environments
// In a real application, you would use a backend API instead of direct MongoDB access

import { Product, ProductFilter } from '../api/productsApi';

// Mock data
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 20-hour battery life.',
    price: 129.99,
    category: 'Electronics',
    tags: ['Featured', 'Trending'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 25,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    _id: '2',
    name: 'Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt in classic fit.',
    price: 24.99,
    category: 'Clothing',
    tags: ['New', 'Eco-Friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 100,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
  },
  {
    _id: '3',
    name: 'Smart Watch',
    description: 'Track fitness, receive notifications, and more with this waterproof smart watch.',
    price: 199.99,
    category: 'Electronics',
    tags: ['Featured', 'New'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 15,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
  },
  {
    _id: '4',
    name: 'Yoga Mat',
    description: 'Non-slip, eco-friendly yoga mat perfect for all types of yoga.',
    price: 39.99,
    category: 'Sports',
    tags: ['Eco-Friendly', 'New'],
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 30,
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-20'),
  },
  {
    _id: '5',
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted ceramic mug that keeps your beverages hot longer.',
    price: 14.99,
    category: 'Home',
    tags: ['Eco-Friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 50,
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-12'),
  },
  {
    _id: '6',
    name: 'Organic Face Serum',
    description: 'Revitalize your skin with this all-natural, organic face serum.',
    price: 29.99,
    category: 'Beauty',
    tags: ['Organic', 'New'],
    imageUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    inventory: 20,
    createdAt: new Date('2023-06-08'),
    updatedAt: new Date('2023-06-08'),
  },
];

// Mock database implementation
class MockDB {
  private products: Product[] = [...mockProducts];

  // Collection methods
  collection(name: string) {
    if (name === 'products') {
      return {
        find: (query: any) => ({
          sort: () => ({
            toArray: async () => this.filterProducts(query)
          })
        }),
        findOne: async (query: any) => {
          const id = query._id;
          return this.products.find(product => product._id === id) || null;
        },
        insertOne: async (doc: any) => {
          const id = Date.now().toString();
          const newProduct = { ...doc, _id: id };
          this.products.push(newProduct);
          return { insertedId: id };
        },
        updateOne: async (query: any, update: any) => {
          const id = query._id;
          const index = this.products.findIndex(product => product._id === id);
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...update.$set };
            return { modifiedCount: 1 };
          }
          return { modifiedCount: 0 };
        },
        deleteOne: async (query: any) => {
          const id = query._id;
          const initialLength = this.products.length;
          this.products = this.products.filter(product => product._id !== id);
          return { deletedCount: initialLength - this.products.length };
        },
        distinct: async (field: string) => {
          const values = new Set<string>();
          this.products.forEach(product => {
            if (field === 'category') {
              values.add(product.category);
            } else if (field === 'tags') {
              product.tags.forEach(tag => values.add(tag));
            }
          });
          return Array.from(values);
        }
      };
    }
    throw new Error(`Collection ${name} not implemented in mock`);
  }

  private filterProducts(query: any): Product[] {
    return this.products.filter(product => {
      // Filter by category (with regex support)
      if (query.category) {
        if (query.category.$regex instanceof RegExp) {
          if (!query.category.$regex.test(product.category)) {
            return false;
          }
        } else if (product.category !== query.category) {
          return false;
        }
      }
      
      // Filter by tags
      if (query.tags && query.tags.$in) {
        const hasTag = query.tags.$in.some((tag: string) => 
          product.tags.includes(tag)
        );
        if (!hasTag) return false;
      }
      
      // Search in name or description
      if (query.$or) {
        const searchTerms = query.$or.map((condition: any) => {
          if (condition.name) return condition.name.$regex;
          if (condition.description) return condition.description.$regex;
          return '';
        }).filter(Boolean);
        
        if (searchTerms.length > 0) {
          const searchPattern = new RegExp(searchTerms.join('|'), 'i');
          const matches = searchPattern.test(product.name) || searchPattern.test(product.description);
          if (!matches) return false;
        }
      }
      
      // Filter by price range
      if (query.price) {
        if (query.price.$gte !== undefined && product.price < query.price.$gte) {
          return false;
        }
        if (query.price.$lte !== undefined && product.price > query.price.$lte) {
          return false;
        }
      }
      
      return true;
    });
  }
}

// Mock client
class MockClient {
  db() {
    return new MockDB();
  }
}

// Create a mock client promise
const mockClientPromise = Promise.resolve(new MockClient());

// Export the mock client
export default mockClientPromise;
