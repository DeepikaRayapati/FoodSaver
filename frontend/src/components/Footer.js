import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Leaf } from 'lucide-react';
import API from "./api";

API.get("/api/users");
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FoodSaver</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting communities to reduce food waste through smart technology and sustainable practices. 
              Together, we can make a difference one meal at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-green-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">info@foodsaver.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">1-800-FOODSAVE</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">123 Green Street, Eco City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">50,000+</div>
              <div className="text-sm text-gray-400">Kg Food Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">10,000+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">500+</div>
              <div className="text-sm text-gray-400">Partner Vendors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">25%</div>
              <div className="text-sm text-gray-400">Waste Reduction</div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 FoodSaver. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for a sustainable future</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
