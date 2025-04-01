
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById, Order } from '../api/orderApi';
import ShopHeader from '../components/ShopHeader';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const orderData = await getOrderById(id);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ShopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ShopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Link to="/">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ShopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-4">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for shopping with us. Your order has been received and is being processed.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between pb-2 border-b">
              <span className="font-medium">Order #:</span>
              <span className="text-gray-600">{order._id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Date:</span>
              <span className="text-gray-600">
                {order.createdAt instanceof Date ? 
                  order.createdAt.toLocaleString() : 
                  new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Status:</span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{order.customerInfo.name}</p>
              <p className="text-gray-600">{order.customerInfo.address}</p>
              <p className="text-gray-600">
                {order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}
              </p>
              <p className="text-gray-600 mt-2">{order.customerInfo.email}</p>
              <p className="text-gray-600">{order.customerInfo.phone}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Link to="/">
              <Button className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
