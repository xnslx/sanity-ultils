import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import imageUrlBuilder from '@sanity/image-url';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useInView } from 'react-cool-inview';
import clsx from 'clsx';

import { SanityImageAssetDocument } from '@sanity/client';

const VariedTypeCarousel = ({ s }, key) => {
  const { observe, inView } = useInView();

  switch (s._type) {
    case 'image':
      return (
        <div className="embla__slide__nested" key={s._key}>
          <div className="embla__slide__inner__nested">
            <img
              className="embla__slide__img__nested"
              src={urlFor(s.asset._ref).height(480).url()}
              alt="A cool cat."
            />
          </div>
        </div>
      );
    case 'video':
      return (
        <div className="embla__slide__nested">
          <div className="embla__slide__inner__nested">
            <div className="embla__slide__img__nested">
              <video
                autoPlay="autoplay"
                muted
                playsInline
                loop
                className="video"
              >
                <source src={`${s.id}`} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        // <div className={styles.video}>
        //   <iframe
        //     ref={(node) => {
        //       observe(node);
        //     }}
        //     src={`https://player.vimeo.com/video/${s.id}?background=1&autoplay=1&autopause=0&loop=1&muted=1`}
        //     frameBorder="0"
        //     title={s.title}
        //     allow="autoplay"
        //     style={{
        //       height: '100vw',
        //       minWidth: '150vh',
        //     }}
        //   ></iframe>
        // </div>
      );
    default:
      return null;
  }
};

const NestedCarousel = ({ slides, setLockParentScroll }) => {
  const [viewportRef, embla] = useEmblaCarousel(
    {
      axis: 'y',
      skipSnaps: false,
    },
    [WheelGesturesPlugin({ forceWheelAxis: 'y' })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  const scrollTo = useCallback(
    (index) => {
      embla && embla.scrollTo(index);
    },
    [embla]
  );

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, onSelect, setScrollSnaps]);

  return (
    <>
      <div className="embla__nested">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container__nested">
            {slides.map((s, index) => {
              return <VariedTypeCarousel s={s} key={index} />;
            })}
          </div>
        </div>
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => {
          return (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          );
        })}
      </div>
    </>
  );
};

export const DotButton = ({ selected, onClick }) => {
  return (
    <button
      className={clsx('embla__dot', { 'is-selected': selected })}
      type="button"
      onClick={onClick}
    />
  );
};

export default NestedCarousel;

export const projectId = 'bkokj2ln';
export const dataset = 'production';
export const apiVersion = '2024-4-1';

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageAssetDocument) {
  return builder.image(source);
}
