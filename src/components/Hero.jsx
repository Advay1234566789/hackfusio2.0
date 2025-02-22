import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const TypingAnimation = ({ text, delay }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay }}
    className="mt-3 text-xl text-white drop-shadow-md inline-block"
  >
    {text}&nbsp;
  </motion.span>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 shadow-xl ${className}`}>
    {children}
  </div>
);

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  const descriptionText = "Experience a revolutionary, paperless, and transparent college system";
  const words = descriptionText.split(" ");

  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:10px_24px]" />

      {/* Spline Scene Background */}
      <div className="absolute -left-1/8 top-0 w-2/4 h-full z-0">
        <Spline
          scene="https://prod.spline.design/a0LmwOGXS3J8jYvF/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Animated Decorative Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-32 h-32 bg-blue-500/30 rounded-full blur-xl"
          style={{ top: '15%', left: '5%' }}
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-40 h-40 bg-purple-500/30 rounded-full blur-xl"
          style={{ bottom: '20%', right: '5%' }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-end justify-center h-full max-w-6xl mx-auto px-8">
        <div className="w-full flex flex-col items-end">
          {/* Title Card */}
          <GlassCard className="inline-block mb-8">
            <motion.h1
              className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              whileHover={{
                scale: 1.05,
                rotateX: [0, 5, -5, 0],
                transition: { duration: 0.6 },
              }}
            >
              EduSphere
            </motion.h1>

            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mt-2 ml-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </GlassCard>

          {/* Description Text Container */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="w-full max-w-lg"
          >
            <GlassCard>
              <div className="flex flex-wrap">
                {words.map((word, index) => (
                  <TypingAnimation key={index} text={word} delay={index * 0.5} />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        onClick={() => {
          document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <GlassCard className="p-2">
          <ChevronDown size={32} className="text-white" />
        </GlassCard>
      </motion.div>
    </section>
  );
};

export default Hero;
