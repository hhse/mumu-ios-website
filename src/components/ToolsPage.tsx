import React, { useState, useEffect } from 'react';
import { Download, Star, ExternalLink, Filter, Search, CheckCircle } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  downloadUrl: string;
  platform: string;
  featured: boolean;
  price: string;
  rating: number;
  features: string[];
}

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'featured' | 'name'>('featured');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/tools.json')
      .then(res => res.json())
      .then(data => {
        setTools(data.tools);
        setCategories(['全部', ...data.categories]);
        setFilteredTools(data.tools);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load tools:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = tools;

    // Category filter
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchQuery, sortBy]);

  const ToolCard = ({ tool }: { tool: Tool }) => (
    <div className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={tool.image} 
          alt={tool.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/ios-dev-icon.png';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-gray-800/80 text-white text-xs rounded-full font-medium">
            {tool.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          {tool.featured && (
            <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-medium">
              推荐
            </span>
          )}
          {tool.price === '免费' && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              免费
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
            {tool.title}
          </h3>
          <div className="flex items-center space-x-1 ml-3">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{tool.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {tool.description}
        </p>
        
        {/* Platform */}
        <div className="mb-4">
          <span className="text-xs text-gray-500">支持平台:</span>
          <span className="text-sm text-gray-300 ml-2">{tool.platform}</span>
        </div>
        
        {/* Features */}
        <div className="space-y-2 mb-6">
          {tool.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/30"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Download Button */}
        <button 
          onClick={() => {
            if (tool.downloadUrl && tool.downloadUrl !== '#') {
              window.open(tool.downloadUrl, '_blank');
            }
          }}
          disabled={tool.downloadUrl === '#'}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 ${
            tool.downloadUrl === '#'
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'ios-button'
          }`}
        >
          <Download size={18} />
          <span>{tool.downloadUrl === '#' ? '暂未提供' : '立即下载'}</span>
          {tool.downloadUrl !== '#' && <ExternalLink size={16} />}
        </button>
      </div>
    </div>
  );

  const CategoryCard = ({ category, icon, count }: { category: string, icon: string, count: number }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`glass-card p-6 rounded-xl text-center transition-all duration-200 group ${
        selectedCategory === category 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'hover:border-blue-500/30 hover:bg-blue-500/5'
      }`}
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-white font-semibold mb-1">{category}</div>
      <div className="text-gray-400 text-sm">{count} 个工具</div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="pixel-loading text-blue-400 pixel-font">Loading Tools...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            iOS 工具推荐
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            精选最实用的iOS开发、越狱、签名和美化工具，提升你的iOS体验
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
                placeholder="搜索工具名称、标签或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-800/70 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'featured' | 'name')}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="featured">推荐排序</option>
                <option value="rating">评分排序</option>
                <option value="name">名称排序</option>
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

        {/* Category Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">工具分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => {
              const count = tools.filter(t => t.category === category).length;
              const icons: { [key: string]: string } = {
                '核心工具': '🔧',
                '签名工具': '✍️',
                '应用商店': '🏪',
                '安装工具': '📱',
                '文件管理': '📁',
                '越狱工具': '🔓'
              };
              return (
                <CategoryCard
                  key={category}
                  category={category}
                  icon={icons[category] || '🛠️'}
                  count={count}
                />
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            找到 <span className="text-white font-semibold">{filteredTools.length}</span> 个工具
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 opacity-50">
              <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">没有找到相关工具</h3>
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

        {/* Featured Tools Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">编辑推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.filter(tool => tool.featured).slice(0, 3).map((tool) => (
              <ToolCard key={`featured-${tool.id}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
