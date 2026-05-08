import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import getLocalizedField from "../../utils/getLocalizedField";
import "../../styles/Slider.css";

const Slider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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
        {slides.map((slide, index) => {
          const title = getLocalizedField(slide, "title", lang);
          const subtitle = getLocalizedField(slide, "subtitle", lang);

          return (
            <div
              key={slide.id}
              className={`slide ${currentIndex === index ? "active" : ""}`}
            >
              <img
                src={slide.imageUrl}
                alt={title}
                className="slide-image"
              />
              <div className="slide-overlay">
                <div className="container">
                  <div className="slide-content">
                    <span className="slide-category">{slide.category}</span>
                    <h1 className="slide-title">{title}</h1>
                    <p className="slide-subtitle">{subtitle}</p>
                    <Link to={`/news/${slide.id}`} className="btn btn-primary btn-lg">
                      {t("slider.readStory")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
