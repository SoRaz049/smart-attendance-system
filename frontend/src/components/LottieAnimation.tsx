"use client";
import React, { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  animationData: object; // JSON object for the Lottie animation
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData }) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData,
      });
    }

    return () => {
      animationInstance.current?.destroy();
    };
  }, [animationData]);

  const playFullAnimation = () => {
    animationInstance.current?.play();
  };

  const playPart = (
    startFrame: number,
    endFrame: number,
    step2?: boolean,
    greenColor?: boolean
  ) => {
    if (animationContainer.current) {
      animationContainer.current.style.transform = step2
        ? "scale(1.2)"
        : "scale(1)";
      animationContainer.current.style.transition = "transform 0.3s ease";

      animationContainer.current.style.filter = greenColor
        ? "hue-rotate(-60deg)"
        : "none";
      if (step2) {
        animationContainer.current?.classList.add("pulse");
      } else {
        animationContainer.current?.classList.remove("pulse");
      }
    }

    animationInstance.current?.playSegments([startFrame, endFrame], true);
  };

  return (
    <div>
      <div
        ref={animationContainer}
        style={{ width: 300, height: 300, transition: "transform 0.3s ease" }}
        className="m-4"
      ></div>
      <div className="flex gap-2 mt-8">
        <button onClick={() => playPart(0, 5)}>Step 1</button>
        <button
          onClick={() => {
            playPart(75, 84, true, true);
          }}
        >
          Step 2
        </button>
        <button onClick={() => playPart(107, 150, false, true)}>Step 3</button>
        <button onClick={() => playPart(83, 70)}>Reverse 2</button>
      </div>
    </div>
  );
};

export default LottieAnimation;
