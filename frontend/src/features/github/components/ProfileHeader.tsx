import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, Link as LinkIcon, Mail, Calendar, Users, Book, ShieldCheck } from 'lucide-react';
import { useGithubProfile } from '../hooks/useGithubData';
import { CircularProgress } from './CircularProgress';

export const ProfileHeader: React.FC<{ username: string }> = ({ username }) => {
  const { data: profile, isLoading, isError } = useGithubProfile(username);

  if (isLoading) {
    return (
      <div className="w-full h-48 animate-pulse bg-bg-elevated rounded-2xl border border-border" />
    );
  }

  if (isError || !profile) {
    return (
      <div className="w-full p-6 bg-red-950/20 text-red-400 rounded-2xl border border-red-900/50">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-canvas border border-border-light rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Identity Section */}
      <div className="flex items-start gap-6 lg:w-1/3">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover ring-1 ring-zinc-800"
          />
          {profile.isHireable && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-green-500/20">
              Hireable
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-50">{profile.name}</h1>
            <ShieldCheck className="w-5 h-5 text-blue-500" />
          </div>
          <a href={`https://github/${profile.login}`} target="_blank" rel="noreferrer" className="text-text-secondary font-medium mb-3 hover:text-blue-400 transition-colors">
            @{profile.login}
          </a>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-4">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm text-text-secondary lg:w-1/3 lg:border-l lg:border-border-light lg:pl-8">
        {profile.company && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="truncate">{profile.company}</span>
          </div>
        )}
        {profile.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
        {profile.website && (
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <a href={profile.website} target="_blank" rel="noreferrer" className="truncate hover:text-text-primary transition-colors">
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {profile.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${profile.email}`} className="truncate hover:text-text-primary transition-colors">
              {profile.email}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Joined {new Date(profile.createdAt).getFullYear()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span><strong className="text-text-primary">{profile.followers.totalCount}</strong> followers</span>
        </div>
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4" />
          <span><strong className="text-text-primary">{profile.repositories.totalCount}</strong> repos</span>
        </div>
      </div>

      {/* Scores Section */}
      <div className="flex gap-4 lg:w-1/3 lg:border-l lg:border-border-light lg:pl-8 flex-wrap lg:flex-nowrap justify-between items-center">
        <CircularProgress value={profile.scores.completion} label="Completion" color="#3B82F6" />
        <CircularProgress value={profile.scores.developer} label="Developer" color="#8B5CF6" />
        <CircularProgress value={profile.scores.trust} label="Trust" color="#10B981" />
        <CircularProgress value={profile.scores.activityLevel} label="Activity" color="#F59E0B" />
      </div>
    </motion.div>
  );
};
