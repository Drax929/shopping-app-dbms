
// This file provides a mock implementation for browser environments
// In a real application, you would use a backend API instead of direct MongoDB access

import { Article, ArticleFilter } from '../api/articlesApi';

// Mock data
const mockArticles: Article[] = [
  {
    _id: '1',
    title: 'Getting Started with MongoDB',
    content: 'MongoDB is a NoSQL database that provides high performance, high availability, and easy scalability.',
    category: 'Database',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    _id: '2',
    title: 'React Hooks Explained',
    content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components.',
    category: 'Frontend',
    tags: ['React', 'JavaScript', 'Hooks'],
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-02'),
  },
  {
    _id: '3',
    title: 'Tailwind CSS Tips and Tricks',
    content: 'Tailwind CSS is a utility-first CSS framework that can be composed to build any design, directly in your markup.',
    category: 'CSS',
    tags: ['CSS', 'Tailwind', 'Frontend'],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-02'),
  },
];

// Mock database implementation
class MockDB {
  private articles: Article[] = [...mockArticles];

  // Collection methods
  collection(name: string) {
    if (name === 'articles') {
      return {
        find: (query: any) => ({
          sort: () => ({
            toArray: async () => this.filterArticles(query)
          })
        }),
        findOne: async (query: any) => {
          const id = query._id;
          return this.articles.find(article => article._id === id) || null;
        },
        insertOne: async (doc: Article) => {
          const id = Date.now().toString();
          const newArticle = { ...doc, _id: id };
          this.articles.push(newArticle);
          return { insertedId: id };
        },
        updateOne: async (query: any, update: any) => {
          const id = query._id;
          const index = this.articles.findIndex(article => article._id === id);
          if (index !== -1) {
            this.articles[index] = { ...this.articles[index], ...update.$set };
            return { modifiedCount: 1 };
          }
          return { modifiedCount: 0 };
        },
        deleteOne: async (query: any) => {
          const id = query._id;
          const initialLength = this.articles.length;
          this.articles = this.articles.filter(article => article._id !== id);
          return { deletedCount: initialLength - this.articles.length };
        },
        distinct: async (field: string) => {
          const values = new Set<string>();
          this.articles.forEach(article => {
            if (field === 'category') {
              values.add(article.category);
            } else if (field === 'tags') {
              article.tags.forEach(tag => values.add(tag));
            }
          });
          return Array.from(values);
        }
      };
    }
    throw new Error(`Collection ${name} not implemented in mock`);
  }

  private filterArticles(query: any): Article[] {
    return this.articles.filter(article => {
      // Filter by category (with regex support)
      if (query.category) {
        if (query.category.$regex instanceof RegExp) {
          // Handle regex-based category matching
          if (!query.category.$regex.test(article.category)) {
            return false;
          }
        } else if (article.category !== query.category) {
          // Direct string comparison as fallback
          return false;
        }
      }
      
      // Filter by tags
      if (query.tags && query.tags.$in) {
        const hasTag = query.tags.$in.some((tag: string) => 
          article.tags.includes(tag)
        );
        if (!hasTag) return false;
      }
      
      // Search in title or content
      if (query.$or) {
        const searchTerms = query.$or.map((condition: any) => {
          if (condition.title) return condition.title.$regex;
          if (condition.content) return condition.content.$regex;
          return '';
        }).filter(Boolean);
        
        if (searchTerms.length > 0) {
          const searchPattern = new RegExp(searchTerms.join('|'), 'i');
          const matches = searchPattern.test(article.title) || searchPattern.test(article.content);
          if (!matches) return false;
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
