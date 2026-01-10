import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { ImSpinner9 } from 'react-icons/im';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import {
  adventurePreferences as preferenceConfig,
  skillColors,
  datingPreferences as datingConfig,
} from '@/lib/constants/userMeta';
import type { AdventurePreference, DatingPreference, SkillLevel } from '@/types/index';

interface PersonCardProps {
  name?: string;
  age?: number | null;
  skillLevel?: string | null;
  bio?: string | null;
  adventurePreferences?: AdventurePreference[] | null;
  datingPreference?: DatingPreference | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  imgSrc?: string | null;
  useNextImage?: boolean;
  swipeDirection?: 'left' | 'right' | null;
}

export default function PersonCard({
  name,
  age,
  skillLevel,
  bio,
  adventurePreferences,
  datingPreference,
  instagramUrl,
  facebookUrl,
  imgSrc,
  useNextImage = true,
  swipeDirection,
}: PersonCardProps): React.JSX.Element {
  const fallbackImgSrc = '/member_pictures/default.png';
  const [source, setSource] = useState<string>(() => (imgSrc?.trim() ? imgSrc : fallbackImgSrc));
  const [isImgLoading, setIsImgLoading] = useState<boolean>(true);
  const skill = skillLevel?.toLowerCase() ? skillColors[skillLevel.toLowerCase() as SkillLevel] || null : null;

  // Reset the loading state when the image source changes
  useEffect(() => {
    // Queue state update to avoid cascading renders
    const timer = setTimeout(() => setIsImgLoading(true), 0);
    return () => clearTimeout(timer);
  }, [source]);

  // Classnames for swipe animations
  const swipeClass = clsx({
    'animate-swipe-left': swipeDirection === 'left',
    'animate-swipe-right': swipeDirection === 'right',
  });

  return (
    <div
      className={clsx(
        'relative bg-slate-100 rounded-md shadow-md border border-gray-300 w-full max-w-[22rem] transition-all duration-300 group overflow-hidden hover:shadow-xl',
        swipeClass
      )}
    >
      {/* Banner Strip */}
      <div className="h-2 w-full bg-primary rounded-t-xl" />

      <div className="p-4 flex flex-col items-center text-center space-y-4">
        {/* Profile Image */}
        <div className="relative w-[220px] max-h-[290px] overflow-hidden">
          {useNextImage ? (
            <>
              {isImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-md z-10">
                  <ImSpinner9 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
                </div>
              )}
              <Image
                key={source}
                src={source}
                alt={name || 'Adventra user profile'}
                width={220}
                height={290}
                onError={() => setSource(fallbackImgSrc)}
                className="rounded-md object-cover border border-gray-200 shadow-sm"
                loading="lazy"
                data-testid="person-card-image"
                onLoad={() => setIsImgLoading(false)}
              />
            </>
          ) : (
            <>
              {isImgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-md z-10">
                  <ImSpinner9 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
                </div>
              )}
              <img
                key={source}
                src={source}
                alt={name || 'Adventra user profile'}
                onLoad={() => setIsImgLoading(false)}
                onError={() => {
                  setSource(fallbackImgSrc);
                  setIsImgLoading(false);
                }}
                className={clsx(
                  'w-full h-full object-cover rounded-md border border-gray-200 shadow-sm transition-opacity duration-500',
                  isImgLoading ? 'opacity-0' : 'opacity-100'
                )}
                loading="lazy"
                data-testid="person-card-image"
              />
            </>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 -mb-2" data-testid="person-card-name">
          {name || 'Unnamed Explorer'}
        </h3>

        <div className="w-full flex justify-center items-center gap-2 text-xs text-gray-600">
          {/* Display Age */}
          {age ? (
            <span
              className={clsx(
                'inline-block px-1 py-0 rounded font-bold text-sm uppercase border bg-tertiary/20 font-accent text-tertiary'
              )}
            >
              AGE: {age}
            </span>
          ) : (
            <span className="italic text-gray-400">Unknown</span>
          )}

          {/* Display Skill Level */}
          {skill && (
            <span
              className={clsx(
                'inline-block px-3 py-0.5 rounded font-bold uppercase border',
                skill.border,
                skill.text,
                skill.bg
              )}
            >
              {skill.label}
            </span>
          )}

          {/* Fallback if neither age nor skill are provided */}
          {!age && !skill && <span className="italic text-gray-400">Not specified</span>}
        </div>

        {/* Bio */}
        <div className="w-full">
          <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Bio</h5>
          <p
            className="text-gray-700 text-sm leading-snug max-w-xs mx-auto"
            data-testid="person-card-bio"
          >
            {bio?.trim() || "This adventurer hasn't written a bio yet."}
          </p>
        </div>

        {/* Adventure Preferences */}
        <div className="w-full">
          <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase">
            Adventure Preferences
          </h5>
          <div
            className="flex flex-wrap justify-center gap-2"
            data-testid="person-card-preferences"
          >
            {adventurePreferences && adventurePreferences.length > 0 ? (
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

        {/* Dating Preferences */}
        <div className="w-full">
          <h5 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Dating Preference</h5>
          <div className="flex justify-center gap-2" data-testid="person-card-dating-preference">
            {datingPreference ? (
              datingConfig
                .filter((pref) => pref.value === datingPreference)
                .map((pref) => {
                  const Icon = pref.icon;
                  return (
                    <span
                      key={pref.value}
                      className={clsx(
                        'flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold uppercase border',
                        pref.bg,
                        pref.border,
                        pref.text,
                        'transition-transform duration-200 hover:scale-105'
                      )}
                    >
                      <Icon className={`w-4 h-4 ${pref.text}`} />
                      {pref.label}
                    </span>
                  );
                })
            ) : (
              <span className="text-xs text-gray-400 italic">Not specified</span>
            )}
          </div>
        </div>

        {/* Divider Line (Main Body and Social Icons) */}
        <hr className="my-0 border-t-1 border-primary w-full" />

        {/* Instagram and Facebook Icons */}
        <div className="w-full flex justify-center gap-4 mt-2">
          {/* Instagram Icon */}
          <a
            href={instagramUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'transition',
              !instagramUrl && 'opacity-50 cursor-not-allowed',
              'cursor-pointer text-pink-600 hover:text-pink-800'
            )}
            title="Instagram Profile"
            aria-label="Instagram Profile"
          >
            <FaInstagram
              className={clsx(
                'w-6 h-6',
                !instagramUrl && 'opacity-50 cursor-not-allowed'
              )}
            />
          </a>

          {/* Facebook Icon */}
          <a
            href={facebookUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'transition',
              !facebookUrl && 'opacity-50 cursor-not-allowed',
              'cursor-pointer text-blue-600 hover:text-blue-800'
            )}
            title="Facebook Profile"
            aria-label="Facebook Profile"
          >
            <FaFacebook
              className={clsx(
                'w-6 h-6',
                !facebookUrl && 'opacity-50 cursor-not-allowed'
              )}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
