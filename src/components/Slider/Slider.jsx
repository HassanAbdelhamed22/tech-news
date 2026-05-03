import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/Slider.css";

const Slider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const prevSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="slider-container"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${currentIndex === index ? "active" : ""}`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="slide-image"
            />
            <div className="slide-overlay">
              <div className="container">
                <div className="slide-content">
                  <span className="slide-category">{slide.category}</span>
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                  <button className="btn btn-primary btn-lg">
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-nav prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="slider-nav next" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;

