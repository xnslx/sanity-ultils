import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import { useNestedEmblaCarousel } from './useNestedEmblaCarousel';
import NestedCarousel from './NestedCarousel';
import styles from './Carousels.module.css';
import EmblaCarouselPrevButton from './EmblaCarouselPrevButton';
import EmblaCarouselNextButton from './EmblaCarouselNextButton';

// import { PrevButton, NextButton } from "../EmblaCarouselButton";

export default function Carousels({ data }: any) {
  const { carousels, _key, _type } = data;

  const [rotation, setRotation] = useState(0);
  const [rotateNum, setRotateNum] = useState(0);

  const prevBtnRotation = () => {
    setRotation((rotation) => rotation + 18);
    setRotateNum(rotation);
  };

  const nextBtnRotation = () => {
    setRotation((rotation) => rotation - 18);
    setRotateNum(rotation);
  };

  const [viewportRef, embla] = useEmblaCarousel(
    {
      axis: 'x',
      skipSnaps: false,
      dragFree: false,
    },
    [WheelGesturesPlugin({ forceWheelAxis: 'x' })]
  );
  const setLockParentScroll = useNestedEmblaCarousel(embla);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const scrollPrev = useCallback(() => {
    embla && embla.scrollPrev();
    prevBtnRotation();
  }, [embla]);
  const scrollNext = useCallback(() => {
    embla && embla.scrollNext();
    nextBtnRotation();
  }, [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  const onScroll = useCallback(() => {
    if (!embla) return;

    const engine = embla.internalEngine();
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

    if (location.get() > limit.max) {
      embla.scrollTo(0);
    }
    if (location.get() < limit.min) {
      embla.scrollTo(embla.scrollSnapList().length - 1);
    }
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    embla.on('scroll', onScroll);
    onSelect();
    onScroll();
  }, [embla, onSelect, onScroll]);

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {carousels.map(
              (
                s: {
                  menu:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Iterable<React.ReactNode>
                    | null
                    | undefined;
                  carousels: any;
                },
                index: React.Key | null | undefined
              ) => {
                return (
                  <div
                    className="embla__slide"
                    id={`embla__slide__${index}`}
                    key={index}
                  >
                    <NestedCarousel
                      //@ts-ignore
                      slides={s.carouselItems}
                      setLockParentScroll={setLockParentScroll}
                      id={index}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
        {/* <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} /> */}
        {/* <NextButton onClick={scrollNext} enabled={nextBtnEnabled} /> */}
        <EmblaCarouselPrevButton
          onClick={scrollPrev}
          enabled={prevBtnEnabled}
        />
        <EmblaCarouselNextButton
          onClick={scrollNext}
          enabled={nextBtnEnabled}
        />
      </div>
    </>
  );
}
