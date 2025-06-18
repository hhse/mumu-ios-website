import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Clock, Calendar, Tag } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  publishDate: string;
  readTime: string;
  featured: boolean;
  url: string;
  content: string;
}

const TutorialsPage: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/tutorials.json')
      .then(res => res.json())
      .then(data => {
        setTutorials(data.tutorials);
        setCategories(['全部', ...data.categories]);
        setFilteredTutorials(data.tutorials);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load tutorials:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = tutorials;

    // Category filter
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(tutorial => tutorial.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTutorials(filtered);
  }, [tutorials, selectedCategory, searchQuery]);

  const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => (
    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={tutorial.image} 
          alt={tutorial.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/ios-dev-icon.png';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
            {tutorial.category}
          </span>
        </div>
        {tutorial.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-medium">
              精选
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink size={20} className="text-white" />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {tutorial.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {tutorial.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/30"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{tutorial.readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{tutorial.publishDate}</span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(tutorial.url, '_blank');
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            阅读原文 →
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="pixel-loading text-blue-400 pixel-font">Loading Tutorials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            iOS 黑科技教程
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            深入探索iOS系统的奥秘，掌握TrollStore、越狱、应用签名等前沿技术
          </p>
        </div>

        {/* Search and Filter */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索教程、标签或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-800/70 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== '全部' || searchQuery) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory !== '全部' && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
                  分类: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('全部')}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                  搜索: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            找到 <span className="text-white font-semibold">{filteredTutorials.length}</span> 个教程
          </p>
        </div>

        {/* Tutorials Grid */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <div 
                key={tutorial.id}
                onClick={() => window.open(tutorial.url, '_blank')}
              >
                <TutorialCard tutorial={tutorial} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 opacity-50">
              <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">没有找到相关教程</h3>
            <p className="text-gray-500 mb-6">试试调整搜索条件或浏览其他分类</p>
            <button 
              onClick={() => {
                setSelectedCategory('全部');
                setSearchQuery('');
              }}
              className="ios-button px-6 py-2"
            >
              清除筛选条件
            </button>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => {
              const count = tutorials.filter(t => t.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`glass-card p-4 rounded-xl text-center transition-all duration-200 ${
                    selectedCategory === category 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'hover:border-blue-500/30'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {category === 'TrollStore' ? '🔧' : 
                     category === '越狱' ? '🔓' : 
                     category === '签名' ? '✍️' : 
                     category === '技巧' ? '💡' : '🛠️'}
                  </div>
                  <div className="text-white font-semibold">{category}</div>
                  <div className="text-gray-400 text-sm">{count} 个教程</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
