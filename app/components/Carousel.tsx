import React, { useState } from 'react';
import Image from 'next/image';

interface Props {
  num: number;
}

const Carousel = ({ num }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? num - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === num - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div id="carouselExample" className="carousel slide">
      <div className="carousel-inner">
        {Array.from({ length: num }).map((_, index) => (
          <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
            <Image src={`https://picsum.photos/800/500?grayscale&random=${index}`} className="d-block w-100" alt={`Slide ${index + 1}`} width={800} height={500} />
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" onClick={handlePrev}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={handleNext}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;


