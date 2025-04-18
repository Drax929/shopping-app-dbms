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

import mockClientPromise from '../lib/mockDb';

// Get all articles with optional filtering
export const getArticles = async (filter: ArticleFilter = {}): Promise<Article[]> => {
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
    console.error('Error fetching articles:', error);
    return [];
  }
};

// Get a single article by ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const article = await db
      .collection('articles')
      .findOne({ _id: id });
      
    return article as Article | null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

// Create a new article
export const createArticle = async (article: Article): Promise<Article> => {
  try {
    const client = await mockClientPromise;
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
    console.error('Error creating article:', error);
    throw error;
  }
};

// Update an existing article
export const updateArticle = async (id: string, article: Partial<Article>): Promise<Article | null> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const updatedArticle = {
      ...article,
      updatedAt: new Date(),
    };
    
    await db.collection('articles').updateOne(
      { _id: id },
      { $set: updatedArticle }
    );
    
    return getArticleById(id);
  } catch (error) {
    console.error('Error updating article:', error);
    return null;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const result = await db.collection('articles').deleteOne({ _id: id });
    
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const categories = await db
      .collection('articles')
      .distinct('category');
      
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return ['Database', 'Frontend', 'CSS', 'JavaScript', 'Backend'];
  }
};

// Get all tags
export const getTags = async (): Promise<string[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const tags = await db
      .collection('articles')
      .distinct('tags');
      
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return ['MongoDB', 'NoSQL', 'Database', 'React', 'JavaScript', 'Hooks', 'CSS', 'Tailwind', 'Frontend'];
  }
};
