import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Package, Leaf, TrendingUp, Star, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Reduce Food Waste,
              <span className="text-green-600"> Save Money</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of restaurants, grocery stores, and consumers in the fight against food waste. 
              Get quality food at discounted prices while making a positive environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace" className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
                Browse Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/register" className="btn btn-outline text-lg px-8 py-3 inline-flex items-center justify-center">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Kg Food Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">$2M+</div>
              <div className="text-gray-600">Customer Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How FoodSaver Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to save food, money, and the environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Surplus Food</h3>
              <p className="text-gray-600">
                Vendors list surplus or near-expiry food items with discounted prices
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Purchase</h3>
              <p className="text-gray-600">
                Consumers browse listings and purchase quality food at great prices
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reduce Waste</h3>
              <p className="text-gray-600">
                Pick up or receive delivery and help reduce food waste
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FoodSaver?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Save Money</h3>
                  <p className="text-gray-600">
                    Get quality food at 30-70% discount compared to regular prices
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600">
                    Smart predictions for food expiration and optimal pricing
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Food Safety Compliant</h3>
                  <p className="text-gray-600">
                    All listings follow HACCP and ISO 22000 food safety standards
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Notifications</h3>
                  <p className="text-gray-600">
                    Get instant alerts for new deals and urgent food listings
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Easy Logistics</h3>
                  <p className="text-gray-600">
                    Simple pickup or delivery options with real-time tracking
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Environmental Impact</h3>
                  <p className="text-gray-600">
                    Track your contribution to reducing food waste and carbon footprint
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "FoodSaver has helped our restaurant reduce food waste by 40% while generating 
                additional revenue from items that would have been thrown away."
              </p>
              <div className="font-semibold">Restaurant Owner</div>
              <div className="text-sm text-gray-500">Downtown Bistro</div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I save over $200 per month on groceries while getting high-quality food. 
                It's a win-win for my wallet and the environment!"
              </p>
              <div className="font-semibold">Happy Customer</div>
              <div className="text-sm text-gray-500">Sarah M.</div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The platform is intuitive and the AI predictions help us optimize our inventory 
                and pricing strategy. Highly recommended!"
              </p>
              <div className="font-semibold">Grocery Manager</div>
              <div className="text-sm text-gray-500">Fresh Market</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join the Food Waste Revolution?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start saving money and reducing food waste today. It's free to join!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center justify-center">
              Sign Up Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/about" className="btn btn-outline border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
