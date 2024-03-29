import React, { useCallback, useState } from "react";
import "./Carousel.css";
import useEmblaCarousel from "embla-carousel-react";
import CarouselImage from "./CarouselImage";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import Autoplay from "embla-carousel-autoplay";

export default function CustomCarousel(props) {
  const {
    data,
    options,
    handleTask,
    handleClose,
    isOpen,
    handleOpen,
    message,
    Fragment,
    refetch,
  } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  console.log(emblaRef);

  console.log("image data:", data?.length);
  return (
    <div className="embla w-full md:w-[75%] ">
      <div className="embla__viewport " ref={emblaRef}>
        <div className="embla__container">
          {data?.map((item, index) => (
            <div key={index} className="embla__slide">
              <div className="relaive">
                <div className="absolute rounded-full bg-slate-100 ml-2 top-2 left-4">
                  <span className="text-sm p-2 ">
                    {index + 1} / {data?.length}
                  </span>
                </div>

                {/* delete picture */}
                <div
                  onClick={handleOpen}
                  className="absolute top-2 right-4 hover:cursor-pointer hover:bg-slate-200  bg-slate-100 rounded-full p-2 md:p-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 md:w-6 md:h-6 stroke-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <CustomDialogBox
                  Fragment={Fragment}
                  isOpen={isOpen}
                  handleClose={handleClose}
                  handleTask={() => {
                    console.log("item:", item);
                    handleTask({ item: item });
                  }}
                  message={message}
                />

                {/* left arrow */}
                <div onClick={scrollPrev} className="absolute top-[50%] left-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 md:w-16 md:h-16 fill-slate-100 hover:fill-slate-300 hover:cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* right arrow */}
                <div
                  onClick={scrollNext}
                  className="absolute top-[50%] right-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 md:w-16 md:h-16 fill-slate-100 hover:fill-slate-300 hover:cursor-pointer"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                  <CarouselImage data={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
