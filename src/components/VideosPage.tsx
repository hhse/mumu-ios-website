import React, { useState, useEffect } from 'react';
import { Play, Eye, Calendar, ExternalLink, Filter, Search } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  duration?: string;
  views: string;
  publishDate: string;
  featured: boolean;
  bilibiliUrl: string;
  bvid: string;
}

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/videos.json')
      .then(res => res.json())
      .then(data => {
        setVideos(data.videos);
        setCategories(['全部', ...data.categories]);
        setFilteredVideos(data.videos);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load videos:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Category filter
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by featured first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    setFilteredVideos(filtered);
  }, [videos, selectedCategory, searchQuery]);

  const VideoCard = ({ video }: { video: Video }) => (
    <div 
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
      onClick={() => window.open(video.bilibiliUrl, '_blank')}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/bilibili-icon.jpg';
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs rounded">
            {video.duration}
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
            {video.category}
          </span>
        </div>
        
        {/* Featured Badge */}
        {video.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-medium">
              热门
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {video.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {video.tags.slice(0, 3).map((tag) => (
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
              <Eye size={14} />
              <span>{video.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{video.publishDate}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-blue-400">
            <span>B站观看</span>
            <ExternalLink size={14} />
          </div>
        </div>
      </div>
    </div>
  );

  const CategoryStats = ({ category, icon, count }: { category: string, icon: string, count: number }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`glass-card p-4 rounded-xl text-center transition-all duration-200 group ${
        selectedCategory === category 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'hover:border-blue-500/30 hover:bg-blue-500/5'
      }`}
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-white font-semibold text-sm mb-1">{category}</div>
      <div className="text-gray-400 text-xs">{count} 个视频</div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="pixel-loading text-blue-400 pixel-font">Loading Videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            精选视频内容
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            B站优质视频内容，直观演示iOS黑科技和实用技巧，让学习更轻松
          </p>
          
          {/* B站主页链接 */}
          <div className="mt-6">
            <button 
              onClick={() => window.open('https://space.bilibili.com/your-uid', '_blank')}
              className="ios-button px-6 py-3 inline-flex items-center space-x-2"
            >
              <Play size={20} />
              <span>访问B站主页</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索视频标题、描述或标签..."
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

        {/* Category Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">视频分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => {
              const count = videos.filter(v => v.category === category).length;
              const icons: { [key: string]: string } = {
                'TrollStore': '🔧',
                '工具演示': '🛠️',
                '个性化': '🎨',
                'AI工具': '🤖',
                '使用技巧': '💡',
                '美化': '✨'
              };
              return (
                <CategoryStats
                  key={category}
                  category={category}
                  icon={icons[category] || '🎬'}
                  count={count}
                />
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            找到 <span className="text-white font-semibold">{filteredVideos.length}</span> 个视频
          </p>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <>
            {/* Featured Videos */}
            {filteredVideos.some(v => v.featured) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">热门视频</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredVideos.filter(v => v.featured).map((video) => (
                    <VideoCard key={`featured-${video.id}`} video={video} />
                  ))}
                </div>
              </div>
            )}

            {/* All Videos */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedCategory === '全部' ? '所有视频' : `${selectedCategory} 分类视频`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 opacity-50">
              <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                <Play size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">没有找到相关视频</h3>
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

        {/* Video Stats */}
        <div className="mt-16 glass-effect rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">频道统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {videos.length}
              </div>
              <div className="text-gray-400">总视频数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {videos.reduce((total, video) => {
                  const views = video.views.replace(/[万千]/g, (match) => {
                    return match === '万' ? '0000' : '000';
                  }).replace(/[^\d]/g, '');
                  return total + parseInt(views || '0');
                }, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">总播放量</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {categories.length - 1}
              </div>
              <div className="text-gray-400">内容分类</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
