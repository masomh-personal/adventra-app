import Button from './Button';
import Image from 'next/image';

const InfoCard = ({
  title,
  description,
  buttonLabel,
  onClick,
  imgSrc,
  imgAlt,
  buttonIcon,
  testId,
  buttonVariant = 'primary', // Set default variant as 'primary'
}) => {
  return (
    <div
      className="bg-slate-100 p-6 rounded-lg text-center border border-gray-300 shadow-md"
      data-testid={testId || 'infocard-container'}
    >
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={imgAlt || title}
          width={100}
          height={100}
          className="rounded-full mx-auto"
          data-testid="infocard-image"
        />
      )}
      <h3 className="text-lg font-medium leading-none mb-2" data-testid="infocard-title">
        {title}
      </h3>
      <p className="text-gray-600 mb-4" data-testid="infocard-description">
        {description}
      </p>
      {buttonLabel && (
        <Button
          label={buttonLabel}
          onClick={onClick}
          leftIcon={buttonIcon}
          variant={buttonVariant} // Pass the variant prop to the Button
          data-testid={`infocard-button-${buttonLabel.toLowerCase().replace(/\s+/g, '-')}`}
        />
      )}
    </div>
  );
};

export default InfoCard;
