"use client"; // Required for GSAP in Next.js App Router

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const startingSlides = [
  {
    type: "start",
    content: { heading: "NEW ON SALE", location: "NEW YORK, NY" },
  },
  { type: "image", content: "https://picsum.photos/200/300" },
  { type: "image", content: "https://picsum.photos/300/400" },
  { type: "image", content: "https://picsum.photos/400/500" },
  {
    type: "end",
    content: { brand: "My Brand", desc: "See full listing in description" },
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const tlRef = useRef(null);
  const itemsRef = useRef([]);
  const containerRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [slides, setSlides] = useState(startingSlides);

  useEffect(() => {
    let tl = gsap.timeline({
      repeat: -1,
      onUpdate: () => setSliderValue(tl.progress()),
    });

    tlRef.current = tl;

    itemsRef.current.forEach((el, index) => {
      if (index === 0) return;

      const moveDistance1 = "8.75rem";
      const moveDistance2 = "10.625rem";
      const itemShrink = "7.5rem";
      const itemExpand = "9.375rem";

      if (index === itemsRef.current.length - 1) {
        gsap.set(itemsRef.current[index], {
          width: itemExpand,
          height: itemExpand,
        });

        tl.to(containerRef.current, {
          x: `-=${moveDistance2}`,
          duration: 1.2,
          
          ease: "power2.inOut",
        })
          .to(
            itemsRef.current[index - 1],
            { autoAlpha: 0, duration: 1.2 },
            "-=1"
          )
          .set(containerRef.current, { x: "3.125rem" })
          .set(itemsRef.current[index], { x: "0rem" });

        return;
      }

      tl.to(containerRef.current, {
        x: `-=${moveDistance1}`,
        duration: 1.2,
        ease: "power2.inOut",
      })
        .to(
          itemsRef.current[index - 1],
          {
            width: itemShrink,
            height: itemShrink,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "-=1"
        )
        .to(
          itemsRef.current[index],
          {
            width: itemExpand,
            height: itemExpand,
            duration: 1.2,
            ease: "power2.inOut",
            onStart: () => setActiveIndex(index),
          },
          "-=1"
        );
    });

    return () => tl.kill();
  }, []);

  const togglePlayPause = () => {
    isPlaying ? tlRef.current.pause() : tlRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSlider = (e) => {
    const newProgress = parseFloat(e.target.value);
    tlRef.current.pause();
    setIsPlaying(false);
    setSliderValue(newProgress);
    tlRef.current.progress(newProgress === 1 ? 0.9999 : newProgress);
  };
  
  const handleJsonChange = (e) => {
    try {
      const parsedData = JSON.parse(e.target.value);
      setSlides(parsedData);
    } catch (e){
      alert("Invalid JSON");
    }
  };
  
  const handleClick=(index)=>{
    setActiveIndex(index);
    tlRef.current.pause();
    setIsPlaying(false);
    const newProgress=index/(slides.length-1);
    setSliderValue(newProgress);
    tlRef.current.progress(newProgress === 1 ? 0.9999 : newProgress);
  }

  const renderSlideContent = (slide) => {
    if (slide.type === "image") {
      return (
        <img
          src={slide.content}
          alt="slide"
          className="w-full h-full object-cover rounded-sm shadow-md"
        />
      );
    } else if (slide.type === "start") {
      return (
        <div className="text-black text-center font-bold pl-6">
          <h1 className="text-2xl text-start font-[Poppins]"> {slide.content.heading} </h1>
          <p className="text-xs text-start"> {slide.content.location} </p>
        </div>
      );
    } else if (slide.type === "end") {
      return (
        <div className=" text-center font-bold flex flex-col gap-3 ">
          <div className="flex items-center gap-2 ">
            <div className="h-6 w-6 rounded-full bg-orange-600 flex items-center justify-center"></div>
            <h1 className="text-orange-600 text-2xl">
              {" "}
              {slide.content.brand}{" "}
            </h1>
          </div>
          <p className="text-lg text-start font-[Palatino] text-black">
            {" "}
            {slide.content.desc}{" "}
          </p>
        </div>
      );
    } else {
      return <span className="text-black font-bold">{slide.content}</span>;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-[15.625rem] h-60 flex items-center overflow-hidden relative">
        <div
          ref={containerRef}
          className="flex gap-5 relative items-center translate-x-[3.125rem]"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="h-[7.5rem] w-[7.5rem] shrink-0 flex items-center justify-center"
              
            >
              {renderSlideContent(slide)}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        {slides.map((_, index) =>
          index > 0 && index < slides.length - 1 ? (
            <div
              key={index}
              onClick={()=>handleClick(index)}
              className={`w-4 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === index ? "bg-black scale-125" : "bg-gray-500"
              }`}
            ></div>
          ) : null
        )}
      </div>
      <button
        onClick={togglePlayPause}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-all"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step={0.01}
        value={sliderValue}
        onChange={handleSlider}
        className="mt-4 w-[15rem] cursor-pointer"
      />
      <textarea
        value={JSON.stringify(slides, null, 2)}
        onChange={handleJsonChange}
        className="w-80 h-60 p-2 border border-gray-400 rounded-md bg-gray-100 text-black"
      ></textarea>
    </div>
  );
}
