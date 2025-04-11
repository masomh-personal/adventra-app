import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { adventurePreferences as preferenceConfig, skillColors } from '@/lib/constants/userMeta';

export default function PersonCard({ name, age, skillLevel, bio, adventurePreferences, imgSrc }) {
  const fallbackImgSrc = '/member_pictures/default.png';
  const [source, setSource] = useState(() => (imgSrc?.trim() ? imgSrc : fallbackImgSrc));

  const skill = skillColors[skillLevel?.toLowerCase()] || null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex flex-col items-center text-center">
      <Image
        src={source}
        alt={name || 'Adventra user profile'}
        width={240}
        height={320}
        onError={() => setSource(fallbackImgSrc)}
        className="rounded-md object-cover border border-gray-200 shadow-sm"
        loading="lazy"
        data-testid="person-card-image"
      />

      <div className="mt-5 space-y-1">
        {age && <div className="text-2xl font-extrabold text-gray-900 leading-tight">{age}</div>}
        <h3 className="text-lg font-bold text-gray-800" data-testid="person-card-name">
          {name || 'Unnamed Explorer'}
        </h3>
      </div>

      <div className="mt-4 w-full">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 uppercase">Skill Level</h4>
        {skill ? (
          <span
            className={clsx(
              'inline-block px-3 py-1 rounded-md text-xs font-bold uppercase border-2',
              skill.border,
              skill.text,
              skill.bg
            )}
          >
            {skill.label}
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Not specified</span>
        )}
      </div>

      <div className="mt-6 w-full">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 uppercase">Bio</h4>
        <p
          className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto"
          data-testid="person-card-bio"
        >
          {bio?.trim() || 'This adventurer hasn’t written a bio yet.'}
        </p>
      </div>

      <div className="mt-6 w-full">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 uppercase">
          Adventure Preferences
        </h4>
        <div className="flex flex-wrap justify-center gap-2" data-testid="person-card-preferences">
          {adventurePreferences?.length > 0 ? (
            adventurePreferences.map((pref) => {
              const config = preferenceConfig.find((p) => p.value === pref);
              if (!config) return null;

              const Icon = config.icon;

              return (
                <span
                  key={pref}
                  className={clsx(
                    'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold uppercase border',
                    config.bg,
                    config.border,
                    config.text,
                    'transition-transform duration-200 transform hover:scale-105'
                  )}
                >
                  <Icon className={`w-4 h-4 ${config.text}`} />
                  {config.label}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-gray-500 italic">None selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
