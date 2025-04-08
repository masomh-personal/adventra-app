// src/components/InfoCard.js
import React from 'react';
import Button from './Button';
import Image from 'next/image';

const InfoCard = ({ title, description, buttonLabel, onClick, imgSrc, imgAlt, buttonIcon }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-md text-center">
      {imgSrc && (
        <div className="mb-4">
          <Image
            src={imgSrc}
            alt={imgAlt || title}
            width={100}
            height={100}
            className="rounded-full mx-auto"
          />
        </div>
      )}
      <h3 className="text-lg font-medium leading-none mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {buttonLabel && <Button label={buttonLabel} onClick={onClick} leftIcon={buttonIcon} />}
    </div>
  );
};

export default InfoCard;

// NOTE: Todo for for 'swiping' and 'matches' section, we can reuse this component like this:
// <InfoCard
//   title="John Doe"
//   description="Enjoys hiking and rock climbing."
//   buttonLabel="View Profile"
//   onClick={() => { /* View profile logic */ }}
//   imgSrc="/images/john-doe.jpg" // Replace with the actual image path
//   imgAlt="Profile picture of John Doe"
// />
