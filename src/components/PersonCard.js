import { useState } from 'react';
import Image from 'next/image';

export default function PersonCard({ name, skillLevel, bio, adventurePreferences, imgSrc }) {
  const fallbackImgSrc = '/member_pictures/default.png';

  const [source, setSource] = useState(() => {
    // Avoid setting "" as initial value, which throws a warning
    return imgSrc?.trim() ? imgSrc : fallbackImgSrc;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={source}
          alt={name || 'Adventra user profile'}
          width={300}
          height={400}
          onError={() => setSource(fallbackImgSrc)}
          className="rounded-md object-cover"
          loading="lazy"
          data-testid="person-card-image"
        />
        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold" data-testid="person-card-name">
            {name || 'Unnamed Explorer'}
          </h3>
          <h4 className="text-sm text-gray-600" data-testid="person-card-skill-level">
            Skill Level: {skillLevel || 'N/A'}
          </h4>
        </div>
      </div>

      <p className="text-gray-700 mb-4" data-testid="person-card-bio">
        {bio?.trim() || 'This adventurer hasn’t written a bio yet.'}
      </p>

      <div>
        <h5 className="text-sm font-bold mb-2">Adventure Preferences:</h5>
        <ul className="list-disc list-inside text-gray-700" data-testid="person-card-preferences">
          {adventurePreferences?.length > 0 ? (
            adventurePreferences.map((pref) => <li key={pref}>{pref}</li>)
          ) : (
            <li>None selected</li>
          )}
        </ul>
      </div>
    </div>
  );
}
