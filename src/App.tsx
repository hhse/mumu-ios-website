import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import TutorialsPage from './components/TutorialsPage';
import ToolsPage from './components/ToolsPage';
import VideosPage from './components/VideosPage';
import AboutPage from './components/AboutPage';
import { ArrowUp } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    setTimeout(() => scrollToTop(), 100);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'tutorials':
        return <TutorialsPage />;
      case 'tools':
        return <ToolsPage />;
      case 'videos':
        return <VideosPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
      />

      {/* Main Content */}
      <main>
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center pixel-decoration">
                  <span className="text-xs font-bold text-white pixel-font">木</span>
                </div>
                <h3 className="text-lg font-bold text-white">木木iOS分享</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                专业的iOS黑科技分享平台，提供TrollStore教程、越狱工具、应用签名等技术内容，助力iOS用户探索更多可能。
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://space.bilibili.com/your-uid', '_blank')}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  B站
                </button>
                <button 
                  onClick={() => window.open('https://github.com/mumu-ios', '_blank')}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  GitHub
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">快速导航</h4>
              <div className="space-y-2">
                {[
                  { label: '首页', page: 'home' },
                  { label: '教程', page: 'tutorials' },
                  { label: '工具', page: 'tools' },
                  { label: '视频', page: 'videos' },
                  { label: '关于', page: 'about' }
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handlePageChange(item.page)}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold mb-4">热门分类</h4>
              <div className="space-y-2">
                {[
                  'TrollStore',
                  'iOS越狱',
                  '应用签名',
                  '使用技巧',
                  '工具推荐'
                ].map((category) => (
                  <div key={category} className="text-gray-400 text-sm">
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © 2024 木木iOS分享. All rights reserved.
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              Built with React + TypeScript + TailwindCSS
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

export default App;
