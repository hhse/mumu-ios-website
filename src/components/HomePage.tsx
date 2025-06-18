import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Download, Eye, Calendar, Clock, Tag } from 'lucide-react';

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
}

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  rating: number;
  features: string[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  publishDate: string;
  featured: boolean;
  bilibiliUrl: string;
}

interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  stats: {
    tutorials: number;
    tools: number;
    videos: number;
    totalViews: string;
  };
}

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);

  useEffect(() => {
    // 加载数据
    Promise.all([
      fetch('/data/profile.json').then(res => res.json()),
      fetch('/data/tutorials.json').then(res => res.json()),
      fetch('/data/tools.json').then(res => res.json()),
      fetch('/data/videos.json').then(res => res.json())
    ]).then(([profileData, tutorialsData, toolsData, videosData]) => {
      setProfile(profileData.profile);
      setFeaturedTutorials(tutorialsData.tutorials.filter((t: Tutorial) => t.featured));
      setFeaturedTools(toolsData.tools.filter((t: Tool) => t.featured));
      setFeaturedVideos(videosData.videos.filter((v: Video) => v.featured));
    });
  }, []);

  const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="glass-card rounded-xl p-4 text-center">
      <div className="text-blue-400 mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );

  const ContentCard = ({ 
    title, 
    description, 
    image, 
    category, 
    tags, 
    meta,
    onClick 
  }: {
    title: string;
    description: string;
    image: string;
    category: string;
    tags?: string[];
    meta?: string;
    onClick: () => void;
  }) => (
    <div 
      className="glass-card rounded-xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        {tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        {meta && (
          <div className="text-xs text-gray-500">
            {meta}
          </div>
        )}
      </div>
    </div>
  );

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pixel-loading text-blue-400 pixel-font">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden glass-effect p-2">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-4">
              <h1 className="responsive-title font-bold text-white glow-text">
                {profile.name}
              </h1>
              <p className="text-xl text-blue-400 pixel-font">
                {profile.title}
              </p>
              <p className="responsive-text text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <StatCard icon={<Star size={20} />} label="教程" value={profile.stats.tutorials} />
              <StatCard icon={<Download size={20} />} label="工具" value={profile.stats.tools} />
              <StatCard icon={<Eye size={20} />} label="视频" value={profile.stats.videos} />
              <StatCard icon={<Calendar size={20} />} label="总浏览" value={profile.stats.totalViews} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => onPageChange('tutorials')}
                className="ios-button px-8 py-3 flex items-center space-x-2"
              >
                <span>浏览教程</span>
                <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => onPageChange('tools')}
                className="px-8 py-3 border border-blue-500 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200"
              >
                推荐工具
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Featured Tutorials */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">精选教程</h2>
              <p className="text-gray-400">最新的iOS黑科技教程和技巧分享</p>
            </div>
            <button 
              onClick={() => onPageChange('tutorials')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>查看全部</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <ContentCard
                key={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                image={tutorial.image}
                category={tutorial.category}
                tags={tutorial.tags}
                meta={`${tutorial.readTime} • ${tutorial.publishDate}`}
                onClick={() => window.open(tutorial.url, '_blank')}
              />
            ))}
          </div>
        </section>

        {/* Featured Tools */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">推荐工具</h2>
              <p className="text-gray-400">精选的iOS开发和使用工具</p>
            </div>
            <button 
              onClick={() => onPageChange('tools')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>查看全部</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ContentCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                image={tool.image}
                category={tool.category}
                tags={tool.features}
                meta={`⭐ ${tool.rating}/5`}
                onClick={() => onPageChange('tools')}
              />
            ))}
          </div>
        </section>

        {/* Featured Videos */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">热门视频</h2>
              <p className="text-gray-400">B站精选视频内容</p>
            </div>
            <button 
              onClick={() => onPageChange('videos')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>查看全部</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <ContentCard
                key={video.id}
                title={video.title}
                description={video.description}
                image={video.thumbnail}
                category="视频"
                meta={`${video.views} 播放 • ${video.publishDate}`}
                onClick={() => window.open(video.bilibiliUrl, '_blank')}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
