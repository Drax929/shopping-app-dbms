
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '../lib/mongodb';

// Types
export interface Article {
  _id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArticleFilter {
  category?: string;
  tags?: string[];
  searchTerm?: string;
}

// Mock data for development when MongoDB isn't connected
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

// Get all articles with optional filtering
export const getArticles = async (filter: ArticleFilter = {}): Promise<Article[]> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Build query based on filters
    const query: any = {};
    
    if (filter.category) {
      query.category = filter.category;
    }
    
    if (filter.tags && filter.tags.length > 0) {
      query.tags = { $in: filter.tags };
    }
    
    if (filter.searchTerm) {
      query.$or = [
        { title: { $regex: filter.searchTerm, $options: 'i' } },
        { content: { $regex: filter.searchTerm, $options: 'i' } },
      ];
    }
    
    const articles = await db
      .collection('articles')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    return articles as Article[];
  } catch (error) {
    console.error('Error fetching articles from MongoDB:', error);
    // Return mock data if MongoDB connection fails
    console.log('Returning mock data instead');
    return mockArticles;
  }
};

// Get a single article by ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const article = await db
      .collection('articles')
      .findOne({ _id: new ObjectId(id) });
      
    return article as Article;
  } catch (error) {
    console.error('Error fetching article from MongoDB:', error);
    // Return mock article if MongoDB connection fails
    const mockArticle = mockArticles.find(a => a._id === id);
    return mockArticle || null;
  }
};

// Create a new article
export const createArticle = async (article: Article): Promise<Article> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const now = new Date();
    const newArticle = {
      ...article,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection('articles').insertOne(newArticle);
    
    return {
      ...newArticle,
      _id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating article in MongoDB:', error);
    // Return the article with a mock ID if MongoDB connection fails
    return {
      ...article,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
};

// Update an existing article
export const updateArticle = async (id: string, article: Partial<Article>): Promise<Article | null> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const updatedArticle = {
      ...article,
      updatedAt: new Date(),
    };
    
    await db.collection('articles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedArticle }
    );
    
    return getArticleById(id);
  } catch (error) {
    console.error('Error updating article in MongoDB:', error);
    // Return null if MongoDB connection fails
    return null;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('articles').deleteOne({ _id: new ObjectId(id) });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting article from MongoDB:', error);
    // Return false if MongoDB connection fails
    return false;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const categories = await db
      .collection('articles')
      .distinct('category');
      
    return categories;
  } catch (error) {
    console.error('Error fetching categories from MongoDB:', error);
    // Return mock categories if MongoDB connection fails
    return ['Database', 'Frontend', 'CSS', 'JavaScript', 'Backend'];
  }
};

// Get all tags
export const getTags = async (): Promise<string[]> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const tags = await db
      .collection('articles')
      .distinct('tags');
      
    return tags;
  } catch (error) {
    console.error('Error fetching tags from MongoDB:', error);
    // Return mock tags if MongoDB connection fails
    return ['MongoDB', 'NoSQL', 'Database', 'React', 'JavaScript', 'Hooks', 'CSS', 'Tailwind', 'Frontend'];
  }
};
