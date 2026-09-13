import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Zap, Radio, ChevronRight } from 'lucide-react';

const GAME_TIPS = [
  "TIP: Manage your budget carefully. Overspending early on marquee players might leave you with a weak squad.",
  "DID YOU KNOW: MS Dhoni has captained the most matches in IPL history, leading in over 220 games.",
  "TIP: Make sure to retain at least one top-tier spinner. They are crucial during the middle overs.",
  "DID YOU KNOW: Virat Kohli holds the record for the most runs in a single IPL season, scoring 973 runs in 2016.",
  "TIP: Keep an eye on the base price of players. Snatching quality players at base price is the key to winning.",
  "DID YOU KNOW: Chris Gayle holds the record for the highest individual score in IPL history - 175* off 66 balls.",
  "TIP: Pace bowlers with good yorker execution are essential for controlling the death overs."
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15
    }
  }
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    x: -25
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 15,
      delay: 0.15
    }
  }
};

const PageLoader = ({ isGame = false }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const isGameMode =
    isGame ||
    (typeof window !== 'undefined' && window.location.pathname === '/');

  useEffect(() => {
    if (!isGameMode) return;

    let progressInterval = null;
    let simulatedInterval = null;

    const finishLoading = () => {
      setProgress(100);
      setIsLoaded(true);
      setShowLoader(false);

      if (progressInterval) clearInterval(progressInterval);
      if (simulatedInterval) clearInterval(simulatedInterval);
    };

    const startRealProgress = () => {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + 0.5;
        });
      }, 30);
    };

    const simulatedStep = 100 / (2000 / 30);

    simulatedInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return Math.min(prev + simulatedStep, 95);
      });
    }, 30);

    const switchTimeout = setTimeout(() => {
      if (simulatedInterval) {
        clearInterval(simulatedInterval);
      }

      startRealProgress();

      if (document.readyState === 'complete') {
        finishLoading();
      } else {
        window.addEventListener('load', finishLoading);
      }
    }, 2000);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GAME_TIPS.length);
    }, 4000);

    const handleKeyDown = (e) => {
      if (e.key === 'x' || e.key === 'X' || e.key === 'Enter') {
        setIsLoaded(true);
        setProgress(100);
        document.dispatchEvent(new CustomEvent('skipIntro'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (simulatedInterval) clearInterval(simulatedInterval);
      if (switchTimeout) clearTimeout(switchTimeout);

      clearInterval(tipTimer);

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('load', finishLoading);
    };
  }, [isGameMode]);

  const handleContinue = () => {
    setIsLoaded(true);
    setProgress(100);
    document.dispatchEvent(new CustomEvent('skipIntro'));
  };

  if (isGameMode && !skippedLocalState(isLoaded)) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          fixed inset-0 z-[9999]
          bg-[#020617]
          overflow-hidden
          select-none
          font-sans
          text-white
        "
      >

        {/* ============================================================
            BACKGROUND
        ============================================================ */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {/* Deep background */}
          <div className="absolute inset-0 bg-[#020617]" />

          {/* Blue cinematic glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 40, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="
              absolute
              -top-[25%]
              -left-[15%]
              w-[70%]
              h-[75%]
              rounded-full
              bg-blue-600/20
              blur-[140px]
            "
          />

          {/* Cyan glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 35, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
            className="
              absolute
              -bottom-[30%]
              -right-[20%]
              w-[70%]
              h-[70%]
              rounded-full
              bg-cyan-500/10
              blur-[150px]
            "
          />

          {/* Premium yellow accent */}
          <motion.div
            animate={{
              opacity: [0.05, 0.13, 0.05],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="
              absolute
              top-[8%]
              right-[15%]
              w-[20rem]
              h-[20rem]
              rounded-full
              bg-yellow-400/10
              blur-[110px]
            "
          />

          {/* Perspective grid */}
          <div
            className="
              absolute inset-0
              opacity-[0.035]
              bg-[linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)]
              bg-[size:5rem_5rem]
            "
          />

          {/* Scan line */}
          <motion.div
            animate={{
              y: ['-100vh', '100vh']
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="
              absolute
              left-0
              right-0
              h-[1px]
              bg-gradient-to-r
              from-transparent
              via-blue-400/20
              to-transparent
            "
          />

          {/* Vignette */}
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_45%_40%,transparent_15%,rgba(2,6,23,0.25)_55%,#020617_100%)]
            "
          />

          {/* Bottom gradient */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[45%]
              bg-gradient-to-t
              from-[#020617]
              via-[#020617]/80
              to-transparent
            "
          />
        </div>


        {/* ============================================================
            TOP NAV / LIVE STATUS
        ============================================================ */}

        <motion.div
          variants={itemVariants}
          className="
            absolute
            top-6
            left-6
            right-6
            z-30
            flex
            items-center
            justify-between
          "
        >

          {/* Brand */}
          <div className="flex items-center gap-3">

            <div
              className="
                flex
                items-center
                justify-center
                w-9
                h-9
                rounded-lg
                bg-blue-500/10
                border
                border-blue-400/20
                backdrop-blur-xl
              "
            >
              <Gavel
                size={17}
                className="text-blue-400"
              />
            </div>

            <div className="hidden sm:block">

              <div
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.28em]
                  text-white/90
                "
              >
                Auction Arena
              </div>

              <div
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-white/35
                  mt-0.5
                "
              >
                Multiplayer Experience
              </div>

            </div>

          </div>


          {/* Live badge */}
          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-full
              bg-black/30
              border
              border-white/10
              backdrop-blur-xl
            "
          >

            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.85, 1, 0.85]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity
              }}
              className="
                w-1.5
                h-1.5
                rounded-full
                bg-green-500
                shadow-[0_0_10px_rgba(239,68,68,0.8)]
              "
            />

            <Radio
              size={11}
              className="text-green-400"
            />

            <span
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.2em]
                text-white/70
              "
            >
              Live Auction
            </span>

          </div>

        </motion.div>


        {/* ============================================================
            MAIN HERO
        ============================================================ */}

        <div className="absolute inset-0 z-10">

          {/* Artwork */}
          <motion.div
            variants={imageVariants}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              md:left-[3%]
              md:translate-x-0
              top-[8%]
              md:top-[10%]
              bottom-[27%]
              md:bottom-[20%]
              w-[92vw]
              md:w-[52vw]
              max-w-[720px]
              flex
              items-center
              justify-center
            "
          >

            {/* Halo */}
            <div
              className="
                absolute
                w-[65%]
                h-[65%]
                rounded-full
                bg-blue-500/15
                blur-[90px]
              "
            />

            <div
              className="
                absolute
                w-[48%]
                h-[48%]
                rounded-full
                border
                border-blue-400/10
              "
            />

            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="
                absolute
                w-[55%]
                h-[55%]
                rounded-full
                border
                border-dashed
                border-blue-400/10
              "
            />

            <img
              src="/images/auct1.png"
              alt="IPL Auction"
              className="
                relative
                z-10
                w-full
                h-full
                object-contain
                opacity-[0.96]
                filter
                drop-shadow-[0_25px_60px_rgba(37,99,235,0.38)]
              "
            />

          </motion.div>


          {/* ==========================================================
              HERO TYPOGRAPHY
          ========================================================== */}

          <motion.div
            variants={itemVariants}
            className="
              absolute
              left-6
              right-6
              md:left-[48%]
              md:right-[5%]
              top-[30%]
              md:top-[26%]
              z-20
            "
          >

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">

              <span
                className="
                  h-px
                  w-10
                  bg-blue-500
                "
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.35em]
                  text-blue-400
                "
              >
                The bidding begins
              </span>

            </div>


            {/* Main title */}
            <div
              className="
                font-black
                uppercase
                leading-[0.82]
                tracking-[-0.055em]
              "
            >

              <div
                className="
                  text-[clamp(3.8rem,9vw,8rem)]
                  text-white
                "
              >
                IPL
              </div>

              <div
                className="
                  text-[clamp(3.8rem,9vw,8rem)]
                  bg-gradient-to-r
                  from-yellow-300
                  via-yellow-500
                  to-yellow-400
                  bg-clip-text
                  text-transparent
                "
              >
                AUCTION
              </div>

            </div>


            {/* Season line */}
            <div className="flex items-center gap-4 mt-6">

              <span
                className="
                  text-[10px]
                  font-black
                  tracking-[0.35em]
                  text-white/40
                "
              >
                SEASON 2026
              </span>

              <span className="h-1 w-1 rounded-full bg-yellow-400" />

              <span
                className="
                  text-[10px]
                  font-black
                  tracking-[0.35em]
                  text-yellow-400
                "
              >
                BID. BUILD. DOMINATE.
              </span>

            </div>

          </motion.div>

  

        </div>


        {/* ============================================================
            BOTTOM CONTROL AREA
        ============================================================ */}

        <motion.div
          variants={itemVariants}
          className="
            absolute
            bottom-5
            left-6
            right-6
            md:bottom-8
            md:left-12
            md:right-12
            z-30
          "
        >

          <div
            className="
              max-w-[1500px]
              mx-auto
            "
          >

            {/* Tip */}
            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-end
                justify-between
                gap-5
                mb-5
              "
            >

              <div
                className="
                  max-w-2xl
                  border-l-2
                  border-blue-500
                  pl-4
                "
              >

                <div className="flex items-center gap-2 mb-1">

                  <Zap
                    size={10}
                    className="text-yellow-400"
                  />

                  <span
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-blue-400
                    "
                  >
                    Auction Intelligence
                  </span>

                </div>

                <div className="min-h-[32px]">

                  <AnimatePresence mode="wait">

                    <motion.p
                      key={tipIndex}
                      initial={{
                        opacity: 0,
                        y: 5
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      exit={{
                        opacity: 0,
                        y: -5
                      }}
                      transition={{
                        duration: 0.25
                      }}
                      className="
                        text-[10px]
                        md:text-xs
                        font-semibold
                        leading-relaxed
                        text-white/65
                      "
                    >
                      {GAME_TIPS[tipIndex]}
                    </motion.p>

                  </AnimatePresence>

                </div>

              </div>


              {/* Enter button */}
              <div>

                {(!isLoaded && showLoader) ? (

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      bg-white/[0.03]
                      border
                      border-white/10
                      backdrop-blur-xl
                    "
                  >

                    <motion.div
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="
                        w-6
                        h-6
                        rounded-full
                        border-2
                        border-white/10
                        border-t-blue-400
                        border-r-cyan-400
                      "
                    />

                    <div>

                      <div
                        className="
                          text-[8px]
                          uppercase
                          tracking-[0.2em]
                          font-black
                          text-white/40
                        "
                      >
                        Connecting
                      </div>

                      <div
                        className="
                          text-[10px]
                          font-bold
                          text-white/80
                          mt-0.5
                        "
                      >
                        Preparing Arena
                      </div>

                    </div>

                  </div>

                ) : (

                  <motion.button
                    onClick={handleContinue}
                    whileHover={{
                      scale: 1.035,
                      x: 2
                    }}
                    whileTap={{
                      scale: 0.97
                    }}
                    className="
                      group
                      relative
                      flex
                      items-center
                      gap-4
                      overflow-hidden
                      px-5
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-500
                      border
                      border-blue-400/40
                      text-white
                      shadow-[0_10px_40px_rgba(37,99,235,0.35)]
                      transition-all
                      duration-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-400/50
                    "
                    initial={{
                      opacity: 0,
                      scale: 0.96
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                  >

                    {/* Shine */}
                    <motion.span
                      animate={{
                        x: ['-120%', '120%']
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="
                        absolute
                        inset-y-0
                        w-16
                        bg-gradient-to-r
                        from-transparent
                        via-white/20
                        to-transparent
                        skew-x-[-20deg]
                      "
                    />

                    <span className="relative z-10">

                      <span
                        className="
                          block
                          text-[7px]
                          font-black
                          uppercase
                          tracking-[0.2em]
                          text-blue-100/70
                        "
                      >
                        Ready?
                      </span>

                      <span
                        className="
                          block
                          text-[10px]
                          font-black
                          uppercase
                          tracking-[0.18em]
                          mt-0.5
                        "
                      >
                        Enter Auction
                      </span>

                    </span>

                    <ChevronRight
                      size={17}
                      className="
                        relative
                        z-10
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />

                  </motion.button>

                )}

              </div>

            </div>


            {/* ========================================================
                PROGRESS
            ======================================================== */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-[7px]
                    uppercase
                    tracking-[0.25em]
                    font-black
                    text-white/30
                  "
                >

                  <span>Initializing Systems</span>

                  <span className="text-white/15">/</span>

                  <span className="text-blue-400/60">
                    AUCTION ENGINE
                  </span>

                </div>

                <span
                  className="
                    text-[8px]
                    font-black
                    tabular-nums
                    text-blue-400
                  "
                >
                  {Math.round(progress)}%
                </span>

              </div>


              <div
                className="
                  relative
                  w-full
                  h-[3px]
                  rounded-full
                  bg-white/5
                  overflow-hidden
                "
              >

                <motion.div
                  className="
                    absolute
                    inset-y-0
                    left-0
                    rounded-full
                    bg-gradient-to-r
                    from-blue-700
                    via-blue-500
                    to-cyan-400
                    shadow-[0_0_14px_rgba(59,130,246,0.8)]
                  "
                  initial={{
                    width: '0%'
                  }}
                  animate={{
                    width: `${progress}%`
                  }}
                  transition={{
                    duration: 0.25,
                    ease: 'easeOut'
                  }}
                />

              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mt-2
                "
              >

                <span
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.22em]
                    font-bold
                    text-white/20
                  "
                >
                  Secure realtime connection
                </span>

                <span
                  className="
                    text-[6px]
                    uppercase
                    tracking-[0.22em]
                    font-bold
                    text-yellow-400/50
                  "
                >
                  Press ENTER to continue
                </span>

              </div>

            </div>

          </div>

        </motion.div>


        {/* Decorative corner brackets */}

        <div
          className="
            absolute
            top-20
            left-6
            w-8
            h-8
            border-l
            border-t
            border-blue-400/15
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            top-20
            right-6
            w-8
            h-8
            border-r
            border-t
            border-blue-400/15
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            bottom-24
            left-6
            w-8
            h-8
            border-l
            border-b
            border-blue-400/10
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            bottom-24
            right-6
            w-8
            h-8
            border-r
            border-b
            border-blue-400/10
            pointer-events-none
          "
        />

      </motion.div>
    );
  }

  // Minimal loader for other pages/sections
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-[#020617]
        flex
        flex-col
        items-center
        justify-center
        p-4
        overflow-hidden
      "
    >

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            -top-[15%]
            -left-[15%]
            w-[55%]
            h-[55%]
            bg-blue-600/20
            blur-[120px]
            rounded-full
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="
            absolute
            -bottom-[15%]
            -right-[15%]
            w-[55%]
            h-[55%]
            bg-cyan-500/10
            blur-[120px]
            rounded-full
          "
        />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            bg-[linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)]
            bg-[size:4rem_4rem]
          "
        />

      </div>


      <div className="relative z-10 flex flex-col items-center">

        <div className="relative w-16 h-16 flex items-center justify-center">

          <motion.div
            className="
              absolute
              inset-0
              rounded-full
              border-2
              border-white/10
              border-t-blue-400
              border-r-cyan-400/50
            "
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          <motion.div
            className="
              absolute
              inset-2
              rounded-full
              border
              border-blue-400/10
              border-b-blue-400
            "
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          <Gavel
            size={19}
            className="text-blue-400"
          />

        </div>

        <div
          className="
            mt-5
            text-[9px]
            font-black
            uppercase
            tracking-[0.28em]
            text-blue-400/70
          "
        >
          Loading Arena
        </div>

      </div>

    </div>
  );
};


// ================================================================
// Helper hook/function to check if intro was skipped locally
// ================================================================

const skippedLocalState = (isLoaded) => {
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const handleSkip = () => setSkipped(true);

    document.addEventListener('skipIntro', handleSkip);

    return () => {
      document.removeEventListener('skipIntro', handleSkip);
    };
  }, []);

  return skipped;
};

export default PageLoader;