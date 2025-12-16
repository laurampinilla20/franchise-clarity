/**
 * IMPORTANT:
 * This component is a direct React port of an existing production animation.
 * The structure, CSS classes, and timing are intentional.
 * Do not refactor, optimize, or alter animation logic.
 */

import React, { useEffect, useRef, useState } from "react";
import "./AnimatedFeatureModule.css";

export default function AnimatedFeatureModule() {
  const animations = [
    { text: "restaurant", showFranchise: true, duration: 1450 },
    { text: "pet care", showFranchise: true, duration: 1450 },
    { text: "technology", showFranchise: true, duration: 1450 },
    { text: "franchise for you", showFranchise: false, duration: 2250 },
    { text: "beauty", showFranchise: true, duration: 1450 },
    { text: "home services", showFranchise: true, duration: 1450 },
    { text: "fitness", showFranchise: true, duration: 1450 },
    { text: "franchise for you", showFranchise: false, duration: 2250 },
    { text: "retail", showFranchise: true, duration: 1450 },
    { text: "automotive", showFranchise: true, duration: 1450 },
    { text: "lodge", showFranchise: true, duration: 1450 },
    { text: "franchise for you", showFranchise: false, duration: 2250 },
  ];

  const images = [
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/1.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/2.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/3.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/4.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/5.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/6.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/7.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/8.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/9.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/10.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/11.png",
    "https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/12.png",
  ];

  const alts = [
    "Restaurant Franchise",
    "Staffing Franchise",
    "Real Estate Franchise",
    "Franchise For You",
    "Healthcare Franchise",
    "Beauty Franchise",
    "Technology Franchise",
    "Franchise For You",
    "Retail Franchise",
    "Automotive Franchise",
    "Accounting Franchise",
    "Franchise For You",
  ];

  const FADE_DURATION = 400; // debe coincidir con CSS

  const [currentIndex, setCurrentIndex] = useState(3); // arranca en la que estaba "active" en tu HTML (4ta imagen)
  const [word, setWord] = useState("franchise for you");
  const [showFranchise, setShowFranchise] = useState(false);
  const [animClass, setAnimClass] = useState(""); // fade-in / fade-out

  const timeoutsRef = useRef<Array<NodeJS.Timeout>>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    // pausa inicial para mostrar el estado por defecto antes de empezar
    const startTimeout = setTimeout(() => runCycle(0), 2250);
    timeoutsRef.current.push(startTimeout);

    return () => clearAllTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runCycle = (cycleIndex: number) => {
    // 1) fade out
    setAnimClass("fade-out");

    const t1 = setTimeout(() => {
      // 2) datos del siguiente paso
      const step = animations[cycleIndex];

      // 3) actualiza texto + palabra franchise
      setWord(step.text);
      setShowFranchise(step.showFranchise);

      // 4) activa imagen correspondiente a este step
      setCurrentIndex(cycleIndex);

      // 5) fade in
      setAnimClass("fade-in");

      // 6) prepara siguiente ciclo
      const nextIndex = (cycleIndex + 1) % animations.length;

      const t2 = setTimeout(() => {
        runCycle(nextIndex);
      }, step.duration);

      timeoutsRef.current.push(t2);
    }, FADE_DURATION);

    timeoutsRef.current.push(t1);
  };

  return (
    <div className="animated-feature-module">
      {/* En móvil, el bloque de imagen aparecerá primero gracias al CSS */}
      <div className="image-wrapper">
        <div className="animated-images">
          <img
            src="https://mvp.franchisegrade.com/hubfs/New%20style/Home%20page/1.png"
            className="image-sizer"
            alt=""
          />

          {images.map((src, idx) => (
            <img
              key={src + idx}
              src={src}
              alt={alts[idx] || ""}
              className={`animated-image ${idx === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="content-wrapper">
        <div className="subtitle-container">
          <p className="subtitle">
            The <span className="highlight">largest franchise database</span> in North
            America
          </p>
        </div>

        <h1 className="animated-title">
          <span className="title-first-line">Find the best</span>&nbsp;
          <span className="word-container">
            <span className={`animated-word red-underline ${animClass}`}>{word}</span>
          </span>
          <span
            className="static-franchise-word"
            style={{ display: showFranchise ? "inline" : "none" }}
          >
            &nbsp;franchise
          </span>
        </h1>

        <p className="paragraph">
          If you're only focused on what's popular or flashy, you're risking your
          money. Make informed decisions and see what real franchise data and expert
          advice can do for your investment.
        </p>

        <a href="/best-franchises" className="cta-button">
          Find the best franchise for you
        </a>
      </div>

      {/* Features Section */}
      <div className="features-inner-section w-full px-0 md:px-4 lg:px-8 py-10 md:py-12 mt-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-center justify-center">
            <div className="flex flex-col gap-5 items-center px-8 md:px-[32px] py-[10px] text-center w-full md:w-[363px]">
              <div className="flex items-center justify-center shrink-0 w-[62px] h-[62px]">
                <div className="bg-[#a4c6e8] flex items-center justify-center p-[6.986px] rounded-[10px] w-[62px] h-[62px]">
                  <img
                    src="https://www.figma.com/api/mcp/asset/3f717d2c-7dc0-46b2-8e21-6db96f4c089e"
                    alt=""
                    className="w-auto h-auto max-w-[48px] max-h-[48px] object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 items-center text-white w-full">
                <h3 className="font-bold text-2xl leading-8">Smart decision</h3>
                <p className="font-normal text-base leading-6">
                  Invest backed by data. We'll show you exactly which franchises thrive, and which to avoid.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center px-8 md:px-[32px] py-[10px] text-center w-full md:w-[363px]">
              <div className="flex items-center justify-center shrink-0 w-[62px] h-[62px]">
                <div className="bg-[#a4c6e8] flex items-center justify-center p-[6.986px] rounded-[10px] w-[62px] h-[62px]">
                  <img
                    src="https://www.figma.com/api/mcp/asset/8cc11dd5-4e01-4e7f-9fe8-fb3095711d6e"
                    alt=""
                    className="w-auto h-auto max-w-[48px] max-h-[48px] object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 items-center text-white w-full">
                <h3 className="font-bold text-2xl leading-8">Expert guidance</h3>
                <p className="font-normal text-base leading-6">
                  Get 1-on-1 support from a trusted franchise advisor who treats your investment like their own.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center px-8 md:px-[32px] py-[10px] text-center w-full md:w-[363px]">
              <div className="flex items-center justify-center shrink-0 w-[62px] h-[62px]">
                <div className="bg-[#a4c6e8] flex items-center justify-center p-[6.986px] rounded-[10px] w-[62px] h-[62px]">
                  <img
                    src="https://www.figma.com/api/mcp/asset/081a7dfc-5dde-4a52-92ad-56dbfa76078b"
                    alt=""
                    className="w-auto h-auto max-w-[48px] max-h-[48px] object-contain"
                    style={{ transform: "rotate(180deg) scaleY(-1)" }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 items-center text-white w-full">
                <h3 className="font-bold text-2xl leading-8">Complete panorama</h3>
                <p className="font-normal text-base leading-6">
                  Explore the full franchise market. Spot real opportunities and make truly unbiased decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

