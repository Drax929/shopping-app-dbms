// FOR CATEGORIES, USER DETAILS
import { Product } from '../api/productsApi';
import { Order } from '../api/orderApi';
import { Article } from '../api/articlesApi';
import { mockProducts } from './mockData';

interface FilterQuery {
  category?: { $regex: RegExp };
  tags?: { $in: string[] };
  $or?: Array<{ [key: string]: { $regex: string; $options?: string } }>;
  price?: { $gte?: number; $lte?: number };
}

export class MockCollection<T extends { _id?: string }> {
  private data: T[];

  constructor(initialData: T[] = []) {
    this.data = [...initialData];
  }

  async find(query: FilterQuery = {}) {
    return {
      sort: () => ({
        toArray: async () => this.filterData(query)
      })
    };
  }

  async findOne(query: { _id: string }): Promise<T | null> {
    const item = this.data.find(item => item._id === query._id);
    return item || null;
  }

  async insertOne(doc: Partial<T>): Promise<{ insertedId: string }> {
    const id = Date.now().toString();
    const newDoc = { ...doc, _id: id } as T;
    this.data.push(newDoc);
    return { insertedId: id };
  }

  async updateOne(
    query: { _id: string },
    update: { $set: Partial<T> }
  ): Promise<{ modifiedCount: number }> {
    const index = this.data.findIndex(item => item._id === query._id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...update.$set };
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query: { _id: string }): Promise<{ deletedCount: number }> {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item._id !== query._id);
    return { deletedCount: initialLength - this.data.length };
  }

  async distinct(field: keyof T): Promise<string[]> {
    const values = new Set<string>();
    this.data.forEach(item => {
      const value = item[field];
      if (Array.isArray(value)) {
        value.forEach(v => values.add(v as string));
      } else if (typeof value === 'string') {
        values.add(value);
      }
    });
    return Array.from(values);
  }

  private filterData(query: FilterQuery): T[] {
    return this.data.filter(item => {
      const product = item as unknown as Product;
      
      if (query.category) {
        if (!query.category.$regex.test(product.category)) {
          return false;
        }
      }
      
      if (query.tags && query.tags.$in) {
        const hasTag = query.tags.$in.some(tag => 
          product.tags.includes(tag)
        );
        if (!hasTag) return false;
      }
      
      if (query.$or) {
        const searchTerms = query.$or.map(condition => {
          const key = Object.keys(condition)[0];
          return condition[key].$regex;
        }).filter(Boolean);
        
        if (searchTerms.length > 0) {
          const searchPattern = new RegExp(searchTerms.join('|'), 'i');
          const matches = searchPattern.test(product.name) || 
                         searchPattern.test(product.description);
          if (!matches) return false;
        }
      }
      
      if ('price' in query && query.price) {
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

export class MockDB {
  private collections: Map<string, MockCollection<any>> = new Map();

  constructor() {
    this.collections.set('products', new MockCollection<Product>(mockProducts));
    this.collections.set('orders', new MockCollection<Order>([]));
    this.collections.set('articles', new MockCollection<Article>([]));
  }

  collection(name: string) {
    const collection = this.collections.get(name);
    if (!collection) {
      throw new Error(`Collection ${name} not implemented in mock`);
    }
    return collection;
  }
}

export class MockClient {
  db() {
    return new MockDB();
  }
}

const mockClientPromise = Promise.resolve(new MockClient());
export default mockClientPromise;
