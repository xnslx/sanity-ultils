import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import imageUrlBuilder from '@sanity/image-url';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import clsx from 'clsx';
import { SanityImageAssetDocument } from '@sanity/client';

const VariedTypeCarousel = ({ s, parallaxValues, key, index }) => {
  switch (s._type) {
    case 'image':
      return (
        <div className="embla__slide__nested" key={key}>
          <div
            className="embla__slide__inner__nested"
            style={{ transform: `translateY(${parallaxValues[index]}%)` }}
          >
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
            <div
              className="embla__slide__img__nested"
              style={{ transform: `translateY(${parallaxValues[index]}%)` }}
            >
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
      skipSnaps: true,
      loop: false,
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

  const PARALLAX_FACTOR = 1.0;

  const [parallaxValues, setParallaxValues] = useState([]);

  const onScroll = useCallback(() => {
    if (!embla) return;

    const engine = embla.internalEngine();
    console.log('engine', engine);
    const {
      limit,
      target,
      location,
      offsetLocation,
      scrollTo,
      translate,
      scrollBody,
    } = engine;
    let edge: number | null = null;

    if (limit.reachedMax(location.get())) edge = limit.max;
    if (limit.reachedMin(location.get())) edge = limit.min;

    if (edge !== null) {
      offsetLocation.set(edge);
      location.set(edge);
      target.set(edge);
      translate.to(edge);
      translate.toggleActive(false);
      scrollBody.useDuration(0).useFriction(0);
      scrollTo.distance(0, false);
    } else {
      translate.toggleActive(true);
    }
    const scrollProgress = embla.scrollProgress();
    const length = embla.slideNodes().length;

    const styles = embla.scrollSnapList().map((scrollSnap, index) => {
      if (!embla.slidesInView().includes(index)) return 0;
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.getTarget();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      // return diffToTarget * (-1 / PARALLAX_FACTOR) * 100;
      return diffToTarget * (PARALLAX_FACTOR * length) * -100;
    });
    setParallaxValues(styles);
  }, [embla, setParallaxValues]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    onScroll();
    // setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
    embla.on('scroll', onScroll);
    embla.on('resize', onScroll);
  }, [embla, onSelect, onScroll, setScrollSnaps]);

  return (
    <>
      <div className="embla__nested">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container__nested">
            {slides.map((s, index) => {
              console.log('139', index);
              return (
                <VariedTypeCarousel
                  s={s}
                  key={index}
                  index={index}
                  parallaxValues={parallaxValues}
                />
              );
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
