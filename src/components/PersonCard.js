import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { adventurePreferences as preferenceConfig, skillColors } from '@/lib/constants/userMeta';

export default function PersonCard({
  name,
  age,
  skillLevel,
  bio,
  adventurePreferences,
  imgSrc,
  useNextImage = true, // Toggle for optimized vs. live preview
}) {
  const fallbackImgSrc = '/member_pictures/default.png';
  const [source, setSource] = useState(() => (imgSrc?.trim() ? imgSrc : fallbackImgSrc));
  const skill = skillColors[skillLevel?.toLowerCase()] || null;

  return (
    <div className="relative bg-slate-100 rounded-md shadow-md border border-gray-300 w-full max-w-[22rem] hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Banner Strip */}
      <div className="h-2 w-full bg-primary rounded-t-xl" />

      <div className="p-4 flex flex-col items-center text-center space-y-4">
        {/* Profile Image */}
        <div className="relative">
          {useNextImage ? (
            <Image
              src={source}
              alt={name || 'Adventra user profile'}
              width={220}
              height={290}
              onError={() => setSource(fallbackImgSrc)}
              className="rounded-md object-cover border border-gray-200 shadow-sm"
              loading="lazy"
              data-testid="person-card-image"
            />
          ) : (
            <img
              key={source} // Forces React to remount the image when source changes
              src={source}
              alt={name || 'Adventra user profile'}
              width={220}
              height={290}
              onError={() => setSource(fallbackImgSrc)}
              className="rounded-md object-cover border border-gray-200 shadow-sm"
              loading="lazy"
              data-testid="person-card-image"
            />
          )}
        </div>

        {/* Name + Age */}
        <h3 className="text-lg font-bold text-gray-900 -mb-1" data-testid="person-card-name">
          {age ? `${age} | ` : ''}
          {name || 'Unnamed Explorer'}
        </h3>

        {/* Skill Level */}
        <div className="w-full flex justify-center items-center gap-2 text-xs text-gray-600">
          <span className="font-semibold uppercase">Skill Level:</span>
          {skill ? (
            <span
              className={clsx(
                'inline-block px-3 py-0.5 rounded text-xs font-bold uppercase border',
                skill.border,
                skill.text,
                skill.bg
              )}
            >
              {skill.label}
            </span>
          ) : (
            <span className="italic text-gray-400">Not specified</span>
          )}
        </div>

        {/* Bio */}
        <div className="w-full">
          <h4 className="text-xs font-semibold text-gray-600 mb-1 uppercase">Bio</h4>
          <p
            className="text-gray-700 text-sm leading-snug max-w-xs mx-auto"
            data-testid="person-card-bio"
          >
            {bio?.trim() || 'This adventurer hasn’t written a bio yet.'}
          </p>
        </div>

        {/* Preferences */}
        <div className="w-full">
          <h4 className="text-xs font-semibold text-gray-600 mb-1 uppercase">
            Adventure Preferences
          </h4>
          <div
            className="flex flex-wrap justify-center gap-2"
            data-testid="person-card-preferences"
          >
            {adventurePreferences?.length > 0 ? (
              adventurePreferences.map((pref) => {
                const config = preferenceConfig.find((p) => p.value === pref);
                if (!config) return null;

                const Icon = config.icon;

                return (
                  <span
                    key={pref}
                    className={clsx(
                      'flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold uppercase border',
                      config.bg,
                      config.border,
                      config.text,
                      'transition-transform duration-200 hover:scale-105'
                    )}
                  >
                    <Icon className={`w-4 h-4 ${config.text}`} />
                    {config.label}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-gray-400 italic">None selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
