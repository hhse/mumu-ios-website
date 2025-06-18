import React, { useState, useEffect } from 'react';
import { Github, Play, Mail, MapPin, Calendar, Star, Award, Code, Users } from 'lucide-react';

interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  social: {
    bilibili: {
      name: string;
      url: string;
      followers: string;
    };
    wechat: {
      name: string;
      qrcode: string;
    };
    github: {
      name: string;
      url: string;
    };
  };
  stats: {
    tutorials: number;
    tools: number;
    videos: number;
    totalViews: string;
  };
  skills: string[];
  expertise: Array<{
    name: string;
    level: string;
    description: string;
  }>;
}

interface SiteConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
}

const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/profile.json')
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        setSiteConfig(data.siteConfig);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load profile:', error);
        setIsLoading(false);
      });
  }, []);

  const SkillCard = ({ skill }: { skill: string }) => (
    <div className="glass-card rounded-lg p-4 text-center group hover:border-blue-500/30 transition-all duration-200">
      <div className="text-2xl mb-2">
        {skill.includes('TrollStore') ? '🔧' :
         skill.includes('越狱') ? '🔓' :
         skill.includes('签名') ? '✍️' :
         skill.includes('逆向') ? '🔍' :
         skill.includes('安全') ? '🛡️' :
         skill.includes('开发') ? '💻' : '⚡'}
      </div>
      <div className="text-sm text-white font-medium group-hover:text-blue-400 transition-colors">
        {skill}
      </div>
    </div>
  );

  const ExpertiseCard = ({ expertise }: { expertise: Profile['expertise'][0] }) => {
    const getLevelColor = (level: string) => {
      switch (level) {
        case '专家': return 'text-red-400 bg-red-500/20 border-red-500/30';
        case '高级': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
        case '中级': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    };

    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{expertise.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(expertise.level)}`}>
            {expertise.level}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {expertise.description}
        </p>
      </div>
    );
  };

  const StatCard = ({ icon, label, value, color = "text-blue-400" }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number; 
    color?: string; 
  }) => (
    <div className="glass-card rounded-xl p-6 text-center">
      <div className={`${color} mb-3 flex justify-center`}>{icon}</div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );

  const SocialButton = ({ 
    icon, 
    label, 
    url, 
    color = "hover:text-blue-400" 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    url: string; 
    color?: string; 
  }) => (
    <button 
      onClick={() => window.open(url, '_blank')}
      className={`flex items-center space-x-3 p-4 glass-card rounded-xl ${color} transition-all duration-200 group hover:scale-105`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-gray-600/50 transition-colors">
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium text-white">{label}</div>
        <div className="text-sm text-gray-400">点击访问</div>
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="pixel-loading text-blue-400 pixel-font">Loading Profile...</div>
      </div>
    );
  }

  if (!profile || !siteConfig) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-red-400">Failed to load profile data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 page-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
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
          
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            {profile.name}
          </h1>
          <p className="text-xl text-blue-400 pixel-font mb-6">
            {profile.title}
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
            {profile.bio}
          </p>
          
          {/* Location */}
          <div className="flex items-center justify-center space-x-2 mt-6 text-gray-400">
            <MapPin size={16} />
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatCard 
            icon={<Award size={24} />} 
            label="教程发布" 
            value={profile.stats.tutorials} 
            color="text-blue-400"
          />
          <StatCard 
            icon={<Code size={24} />} 
            label="工具推荐" 
            value={profile.stats.tools} 
            color="text-green-400"
          />
          <StatCard 
            icon={<Play size={24} />} 
            label="视频制作" 
            value={profile.stats.videos} 
            color="text-purple-400"
          />
          <StatCard 
            icon={<Users size={24} />} 
            label="总浏览量" 
            value={profile.stats.totalViews} 
            color="text-orange-400"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Skills & Expertise */}
          <div className="space-y-12">
            
            {/* Skills Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Star className="text-blue-400" size={24} />
                <span>技术技能</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.skills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))}
              </div>
            </div>

            {/* Expertise Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Award className="text-green-400" size={24} />
                <span>专业领域</span>
              </h2>
              <div className="space-y-4">
                {profile.expertise.map((expertise, index) => (
                  <ExpertiseCard key={index} expertise={expertise} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Social & Contact */}
          <div className="space-y-12">
            
            {/* Social Links */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Users className="text-purple-400" size={24} />
                <span>社交媒体</span>
              </h2>
              <div className="space-y-4">
                <SocialButton
                  icon={<Play size={20} className="text-blue-400" />}
                  label={`B站 - ${profile.social.bilibili.name}`}
                  url={profile.social.bilibili.url}
                  color="hover:text-blue-400"
                />
                <SocialButton
                  icon={<Github size={20} className="text-green-400" />}
                  label={`GitHub - ${profile.social.github.name}`}
                  url={profile.social.github.url}
                  color="hover:text-green-400"
                />
              </div>
              
              {/* WeChat QR Code */}
              <div className="glass-card rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  微信公众号
                </h3>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-sm">二维码</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    扫码关注：{profile.social.wechat.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Mail className="text-orange-400" size={24} />
                <span>联系我</span>
              </h2>
              <div className="glass-card rounded-xl p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      消息
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all resize-none"
                      placeholder="请输入您想说的话..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full ios-button py-3 flex items-center justify-center space-x-2"
                  >
                    <Mail size={18} />
                    <span>发送消息</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Site Info */}
        <div className="mt-16 glass-effect rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            关于本站
          </h2>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-gray-300 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {siteConfig.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <p>© 2024 {profile.name}. All rights reserved.</p>
              <p className="mt-2">
                Built with ❤️ using React + TypeScript + TailwindCSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
