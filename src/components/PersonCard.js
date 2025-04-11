import { useState } from 'react';
import Image from 'next/image';

export default function PersonCard({ name, skillLevel, bio, adventurePreferences, imgSrc }) {
  const fallbackImgSrc = '/member_pictures/default.png';

  const [source, setSource] = useState(() => {
    return imgSrc?.trim() ? imgSrc : fallbackImgSrc;
  });

  const formatLabel = (str) =>
    str
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');

  // Define tag colors per adventure type
  const tagColors = {
    hiking: 'bg-green-100 text-green-800 border-green-300',
    camping: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    rock_climbing: 'bg-red-100 text-red-800 border-red-300',
    photography: 'bg-blue-100 text-blue-800 border-blue-300',
    default: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="bg-slate-50 p-6 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl duration-300">
      <div className="flex flex-col items-center mb-6">
        <div className="w-40 h-40 relative rounded-full overflow-hidden shadow-md border-2 border-primary">
          <Image
            src={source}
            alt={name || 'Adventra user profile'}
            fill
            onError={() => setSource(fallbackImgSrc)}
            className="object-cover"
            loading="lazy"
            data-testid="person-card-image"
          />
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold" data-testid="person-card-name">
            {name || 'Unnamed Explorer'}
          </h3>
          <p className="text-sm text-gray-700 mt-1" data-testid="person-card-skill-level">
            <span className="font-semibold text-gray-900">Skill Level:</span> {skillLevel || 'N/A'}
          </p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="mb-4">
        <h5 className="text-sm font-bold mb-1 text-gray-800">Bio:</h5>
        <p className="text-gray-700 text-sm" data-testid="person-card-bio">
          {bio?.trim() || 'This adventurer hasn’t written a bio yet.'}
        </p>
      </div>

      <hr className="my-4 border-gray-300" />

      <div>
        <h5 className="text-sm font-bold mb-2 text-gray-800">Adventure Preferences:</h5>
        {adventurePreferences?.length > 0 ? (
          <div className="flex flex-wrap gap-2" data-testid="person-card-preferences">
            {adventurePreferences.map((pref) => {
              const color = tagColors[pref] || tagColors.default;
              return (
                <span
                  key={pref}
                  className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm transition-transform duration-200 transform hover:scale-105 ${color}`}
                >
                  {formatLabel(pref)}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600">None selected</p>
        )}
      </div>
    </div>
  );
}
