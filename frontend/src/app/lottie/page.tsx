import React from "react";
import LottieAnimation from "../../components/LottieAnimation";
import animationData from "../../assets/animation/face-animation.json";

export default function Home() {
  return (
    <div>
      <LottieAnimation animationData={animationData} />
    </div>
  );
}
