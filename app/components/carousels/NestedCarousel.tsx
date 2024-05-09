import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import imageUrlBuilder from '@sanity/image-url';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import clsx from 'clsx';
import { SanityImageAssetDocument } from '@sanity/client';
import { useDotButton } from './EmblaCarouselDotButton';

const VariedTypeCarousel = ({ s, parallaxValues, index }: any) => {
  console.log('parallaxValues[index]', parallaxValues[index]);
  switch (s._type) {
    case 'image':
      return (
        <div className="embla__slide__nested" key={index}>
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
                //@ts-ignore
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

const NestedCarousel = ({ slides }: any) => {
  const [viewportRef, embla] = useEmblaCarousel(
    {
      axis: 'y',
      skipSnaps: false,
      loop: true,
      dragFree: false,
    },
    [WheelGesturesPlugin({ forceWheelAxis: 'y' })]
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(embla);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;

    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  const PARALLAX_FACTOR = 1;

  const [parallaxValues, setParallaxValues] = useState([]);
  console.log('parallaxValues', parallaxValues);

  const scrollTo = useCallback(
    (index: number) => {
      if (!embla) return;
      embla && embla.scrollTo(index);
    },
    [embla]
  );

  const onScroll = useCallback(() => {
    if (!embla) return;

    const engine = embla.internalEngine();
    // console.log('engine', engine);
    const { limit, target, location, offsetLocation, translate, scrollBody } =
      engine;

    if (location.get() > limit.max) {
      scrollTo(0);
    }
    if (location.get() < limit.min) {
      scrollTo(embla.scrollSnapList().length - 1);
    }

    const scrollProgress = embla.scrollProgress();
    const length = embla.slideNodes().length;

    const styles = embla.scrollSnapList().map((scrollSnap, index) => {
      if (!embla.slidesInView().includes(index)) return 0;
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
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
    //@ts-ignore
    setParallaxValues(styles);

    console.log('styles', styles);
  }, [embla, setParallaxValues]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    onScroll();
    embla.on('select', onSelect);
    embla.on('scroll', onScroll);
  }, [embla, onSelect, onScroll]);

  // const dummyArray = [
  //   { id: 1, content: 'Div 1', bgColor: 'bg-red-300' },
  //   { id: 2, content: 'Div 2', bgColor: 'bg-green-300' },
  //   { id: 3, content: 'Div 3', bgColor: 'bg-blue-300' },
  //   { id: 4, content: 'Div 4', bgColor: 'bg-yellow-300' },
  //   { id: 5, content: 'Div 5', bgColor: 'bg-purple-300' },
  // ];

  return (
    <>
      {/* <div className="embla__nested">
        <div className="embla__nested__viewport" ref={viewportRef}>
          <div className="embla__nested__container">
            {slides.map((s: any, index: any) => {
              return (
                <VariedTypeCarousel
                  s={s}
                  index={index}
                  parallaxValues={parallaxValues}
                />
              );
            })}
          </div>
        </div>
      </div> */}
      {/* <div className="relative max-w-full h-full">
        <div className="h-screen w-full" ref={viewportRef}>
          <div className="flex flex-col h-screen">
            {dummyArray.map((d, index) => {
              console.log('183', index);
              return (
                <div className="relative min-h-screen">
                  <div
                    className={`h-screen relative flex justify-center items-center overflow-hidden ${d.bgColor}`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: `translateY(${parallaxValues[index]}%)`,
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 block w-auto min-h-full min-w-full max-w-none"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      <div className="relative max-w-full h-full">
        <div className="h-screen w-full" ref={viewportRef}>
          <div className="flex flex-col h-screen">
            {slides.map((s: any, index: any) => {
              return (
                <VariedTypeCarousel
                  s={s}
                  index={index}
                  parallaxValues={parallaxValues}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="embla__dots">
        {parallaxValues.map((_, index) => {
          return (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
            />
          );
        })}
      </div>
    </>
  );
};

export const DotButton = ({ selected, onClick }: any) => {
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
