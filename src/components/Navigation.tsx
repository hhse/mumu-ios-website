import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Github, Play } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'tutorials', label: '教程', icon: '📚' },
    { id: 'tools', label: '工具', icon: '🛠️' },
    { id: 'videos', label: '视频', icon: '🎬' },
    { id: 'about', label: '关于', icon: '👨‍💻' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center pixel-decoration">
              <span className="text-xs font-bold text-white pixel-font">木</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">
                木木iOS分享
              </h1>
              <p className="text-xs text-gray-400 pixel-font">
                iOS BlackTech Expert
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>

            {/* Social Links */}
            <div className="hidden sm:flex items-center space-x-2">
              <button 
                onClick={() => window.open('https://space.bilibili.com/your-uid', '_blank')}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors tooltip"
                data-tooltip="B站主页"
              >
                <Play size={20} />
              </button>
              <button 
                onClick={() => window.open('https://github.com/mumu-ios', '_blank')}
                className="p-2 text-gray-400 hover:text-green-400 transition-colors tooltip"
                data-tooltip="GitHub"
              >
                <Github size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-effect border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              {/* Mobile Social Links */}
              <div className="pt-4 border-t border-white/10 flex space-x-4">
                <button 
                  onClick={() => window.open('https://space.bilibili.com/your-uid', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Play size={20} />
                  <span>B站</span>
                </button>
                <button 
                  onClick={() => window.open('https://github.com/mumu-ios', '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
