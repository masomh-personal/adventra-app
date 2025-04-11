import { useState } from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { adventurePreferences as preferenceConfig } from '@/lib/constants/userMeta';

export default function PersonCard({ name, age, skillLevel, bio, adventurePreferences, imgSrc }) {
  const fallbackImgSrc = '/member_pictures/default.png';
  const [source, setSource] = useState(() => (imgSrc?.trim() ? imgSrc : fallbackImgSrc));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 transition-all">
      <div className="flex flex-col items-center mb-6">
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

        <div className="mt-4 text-center">
          <h3
            className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2"
            data-testid="person-card-name"
          >
            <FaUserCircle className="text-gray-400" />
            {age ? `${age} | ${name}` : name || 'Unnamed Explorer'}
          </h3>
          <h4
            className="text-sm font-semibold text-gray-700 mt-1"
            data-testid="person-card-skill-level"
          >
            Skill Level: <span className="font-bold">{skillLevel || 'N/A'}</span>
          </h4>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <p className="text-gray-700 mb-4 text-sm leading-relaxed" data-testid="person-card-bio">
        {bio?.trim() || 'This adventurer hasn’t written a bio yet.'}
      </p>

      <div>
        <h5 className="text-sm font-bold text-gray-800 mb-2">Adventure Preferences:</h5>
        <div className="flex flex-wrap gap-2" data-testid="person-card-preferences">
          {adventurePreferences?.length > 0 ? (
            adventurePreferences.map((pref) => {
              const config = preferenceConfig.find((p) => p.value === pref);
              if (!config) return null;

              const Icon = config.icon;

              return (
                <span
                  key={pref}
                  className={`
                    flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase
                    border ${config.border} ${config.text} ${config.bg}
                    transition-transform duration-200 transform hover:scale-105
                  `}
                >
                  <Icon className={`text-sm ${config.text}`} />
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
