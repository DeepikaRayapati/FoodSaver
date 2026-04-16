import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Package, DollarSign, Leaf, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    // Mock analytics data
    const mockData = {
      summary: {
        totalFoodSaved: 45670,
        totalCO2Saved: 114175,
        totalWaterSaved: 45670000,
        totalMoneySaved: 234567,
        totalOrders: 5678
      },
      trends: {
        categories: [
          { _id: 'produce', count: 234, totalValue: 12345 },
          { _id: 'bakery', count: 156, totalValue: 8765 },
          { _id: 'dairy', count: 123, totalValue: 6543 }
        ],
        daily: [
          { _id: { year: 2024, month: 3, day: 20 }, orders: 45, revenue: 1234, foodSaved: 67 },
          { _id: { year: 2024, month: 3, day: 21 }, orders: 52, revenue: 1456, foodSaved: 78 },
          { _id: { year: 2024, month: 3, day: 22 }, orders: 48, revenue: 1345, foodSaved: 72 }
        ]
      },
      predictions: {
        wasteRisk: [
          { _id: 'produce', avgExpiryHours: 24, totalItems: 45 },
          { _id: 'bakery', avgExpiryHours: 12, totalItems: 23 }
        ],
        highRiskItems: [
          { title: 'Fresh Vegetables Bundle', vendor: { businessName: 'Green Grocer' } },
          { title: 'Baked Goods Assortment', vendor: { businessName: 'Sweet Bakery' } }
        ],
        demandTrends: [
          { _id: 'produce', demand: 234, avgPrice: 25 },
          { _id: 'bakery', demand: 156, avgPrice: 18 }
        ]
      }
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">AI-powered analytics and environmental impact tracking</p>
          
          {/* Time Range Selector */}
          <div className="mt-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field w-auto"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Food Saved</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.summary.totalFoodSaved)} kg</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.summary.totalCO2Saved)} kg</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Package className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Water Saved</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.summary.totalWaterSaved)} L</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Money Saved</p>
                <p className="text-2xl font-bold text-gray-900">${formatNumber(analyticsData.summary.totalMoneySaved)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <div className="space-y-4">
              {analyticsData.trends.categories.map((category) => (
                <div key={category._id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{category._id}</span>
                    <span className="text-sm text-gray-500">{category.count} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(category.count / 300) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Trends */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Daily Trends</h3>
            <div className="space-y-3">
              {analyticsData.trends.daily.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Day {index + 1}</p>
                    <p className="text-sm text-gray-500">{day.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${day.revenue}</p>
                    <p className="text-sm text-gray-500">{day.foodSaved} kg saved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="card">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold">AI-Powered Predictions & Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waste Risk Analysis */}
            <div>
              <h4 className="font-medium mb-3">Waste Risk Analysis</h4>
              <div className="space-y-2">
                {analyticsData.predictions.wasteRisk.map((risk) => (
                  <div key={risk._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm capitalize">{risk._id}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{risk.totalItems} items</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        risk.avgExpiryHours < 24 ? 'bg-red-100 text-red-800' :
                        risk.avgExpiryHours < 48 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.avgExpiryHours}h avg expiry
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Risk Items */}
            <div>
              <h4 className="font-medium mb-3">High Risk Items (Expiring Soon)</h4>
              <div className="space-y-2">
                {analyticsData.predictions.highRiskItems.map((item, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-600">{item.vendor.businessName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium mb-2 text-purple-900">AI Recommendations</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Consider increasing discounts for produce items with high waste risk</li>
              <li>• Send urgent notifications for bakery items expiring within 12 hours</li>
              <li>• Promote high-demand categories to attract more buyers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
