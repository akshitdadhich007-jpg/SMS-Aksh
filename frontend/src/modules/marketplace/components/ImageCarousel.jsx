import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images = [] }) => {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="mp-carousel">
                <div className="mp-carousel-placeholder">
                    <span>🏠</span>
                    <p style={{ fontSize: 14, color: 'inherit', opacity: 0.7 }}>No images uploaded</p>
                </div>
            </div>
        );
    }

    const goTo = (idx) => {
        if (idx < 0) idx = images.length - 1;
        if (idx >= images.length) idx = 0;
        setCurrent(idx);
    };

    return (
        <div className="mp-carousel">
            <img
                className="mp-carousel-main"
                src={images[current]}
                alt={`Property image ${current + 1}`}
                loading="lazy"
            />
            {images.length > 1 && (
                <>
                    <button className="mp-carousel-nav prev" onClick={() => goTo(current - 1)} aria-label="Previous image">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="mp-carousel-nav next" onClick={() => goTo(current + 1)} aria-label="Next image">
                        <ChevronRight size={20} />
                    </button>
                    <div className="mp-carousel-counter">{current + 1} / {images.length}</div>
                </>
            )}
            {images.length > 1 && (
                <div className="mp-carousel-dots">
                    {images.map((_, i) => (
                        <button key={i} className={`mp-carousel-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`} />
                    ))}
                </div>
            )}
            {images.length > 1 && (
                <div className="mp-carousel-thumbs">
                    {images.map((img, i) => (
                        <img
                            key={i}
                            className={`mp-carousel-thumb ${i === current ? 'active' : ''}`}
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            onClick={() => goTo(i)}
                            loading="lazy"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;
