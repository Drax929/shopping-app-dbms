
// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  tags?: string[];
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}

import mockClientPromise from '../lib/mockDb';

// Get all products with optional filtering
export const getProducts = async (filter: ProductFilter = {}): Promise<Product[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    // Build query based on filters
    const query: any = {};
    
    if (filter.category) {
      // Make category matching case-insensitive
      query.category = { $regex: new RegExp(`^${filter.category}$`, 'i') };
    }
    
    if (filter.tags && filter.tags.length > 0) {
      query.tags = { $in: filter.tags };
    }
    
    if (filter.searchTerm) {
      query.$or = [
        { name: { $regex: filter.searchTerm, $options: 'i' } },
        { description: { $regex: filter.searchTerm, $options: 'i' } },
      ];
    }
    
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) {
        query.price.$gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        query.price.$lte = filter.maxPrice;
      }
    }
    
    const findResult = await db
      .collection('products')
      .find(query);
    
    const products = await findResult.toArray();
    
    // Sort products by createdAt (newest first)
    return products.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const product = await db
      .collection('products')
      .findOne({ _id: id });
      
    return product as Product | null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const now = new Date();
    const newProduct = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection('products').insertOne(newProduct);
    
    return {
      ...newProduct,
      _id: result.insertedId.toString(),
    } as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const updatedProduct = {
      ...product,
      updatedAt: new Date(),
    };
    
    await db.collection('products').updateOne(
      { _id: id },
      { $set: updatedProduct }
    );
    
    return getProductById(id);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const result = await db.collection('products').deleteOne({ _id: id });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const categories = await db
      .collection('products')
      .distinct('category');
      
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
  }
};

// Get all tags
export const getTags = async (): Promise<string[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const tags = await db
      .collection('products')
      .distinct('tags');
      
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return ['Featured', 'New', 'Sale', 'Trending', 'Eco-Friendly', 'Organic'];
  }
};
