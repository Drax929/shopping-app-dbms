
import mockClientPromise from '../lib/mongodb';
import { CartItem } from '../hooks/useCart';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  _id?: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export const createOrder = async (
  items: CartItem[],
  customerInfo: CustomerInfo,
  totalAmount: number
): Promise<Order> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const now = new Date();
    const newOrder = {
      items,
      customerInfo,
      totalAmount,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection('orders').insertOne(newOrder);
    
    return {
      ...newOrder,
      _id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const order = await db
      .collection('orders')
      .findOne({ _id: id });
      
    if (!order) return null;
    
    return order as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const getOrdersByCustomerEmail = async (email: string): Promise<Order[]> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const orders = await db
      .collection('orders')
      .find({ 'customerInfo.email': email })
      .sort({ createdAt: -1 })
      .toArray();
      
    return orders as Order[];
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<boolean> => {
  try {
    const client = await mockClientPromise;
    const db = client.db();
    
    const result = await db.collection('orders').updateOne(
      { _id: id },
      { 
        $set: {
          status,
          updatedAt: new Date()
        } 
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};
