import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Briefcase, GraduationCap, Code } from 'lucide-react';

// Animated messages array
const messages = [
  "follow me",
  "i tweet great stuff",
  "wow moving text wow",
  "you wonder how many of those i wrote ?",
  "hahaha",
  "a lot of them",
  "more text incoming",
  "still reading?",
  "impressive dedication",
  "did you know...",
  "scrolling text is fun",
  "especially when it's random",
  "like this one",
  "and this one too",
  "infinite wisdom ahead",
  "or maybe not",
  "keep scrolling",
  "there's more",
  "much more",
  "trust me",
  "I'm a developer",
  "beep boop",
  "loading more text...",
  "text loaded successfully",
  "error 404: joke not found",
  "just kidding",
  "found it",
  "or did I?",
  "mysteries abound",
  "in scrolling text",
  "like this one",
  "and the next one",
  "recursion is fun",
  "until it isn't",
  "stack overflow",
  "but not that one",
  "the other one",
  "you know what I mean",
  "right?",
  "...right?",
  "hello from the other side",
  "42 messages... the answer to everything", // 42nd message
  "keep going",
  "almost there",
  "well, not really",
  "still a way to go",
  "persistence is key",
  "like this text",
  "it just keeps going",
  "and going",
  "and going...",
  "insert clever message here",
  "🚀",
  "to infinity",
  "and beyond",
  "quantum text mechanics",
  "schrödinger's message",
  "both here and not here",
  "until you read it",
  "then it collapses",
  "into this one",
  "or maybe that one",
  "who knows?",
  "the text knows",
  "but it won't tell",
  "secrets of the scroll",
  "revealed slowly",
  "one message at a time",
  "patience young padawan",
  "the text is strong with this one",
  "may the scroll be with you",
  "always",
  "void where prohibited",
  "terms and conditions apply",
  "batteries not included",
  "some assembly required",
  "no purchase necessary",
  "void where prohibited",
  "again",
  "because why not",
  "recursion strikes back",
  "return of the text",
  "a new scroll",
  "the phantom message",
  "attack of the scrolls",
  "revenge of the text",
  "a new hope",
  "for more messages",
  "the scroll awakens",
  "the last message",
  "or is it?",
  "narrator: it wasn't",
  "plot twist ahead",
  "or maybe not",
  "suspense building",
  "anticipation rising",
  "almost there",
  "getting closer",
  "so close now",
  "just a few more",
  "hang in there",
  "almost done",
  "thx for reading everything :)", // 99th message
  "the end" // 100th message
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing text
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="h-6 mt-4 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-purple-400"
      >
        {messages[currentIndex]}
      </motion.p>
    </div>
  );
};

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)] animate-pulse" />
    </div>
  );
};

const ExpandableCard = ({ title, icon: Icon, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-white/60"
        >
          ↓
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0">{children}</div>
      </motion.div>
    </motion.div>
  );
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              <a href="https://x.com/AliLeisR" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                Alice Leiser
              </a>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              As a great man once said, H2 becomes H
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-24">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* About Section */}
          <ExpandableCard title="About Me" icon={Briefcase}>
            <div className="space-y-4 text-gray-300">
              <p>
                Marketing professional pursuing a Master's degree while exploring the world of software development. Currently collaborating on PXL3 and passionate about bridging the gap between business and technology.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {['Marketing', 'Business Development', 'Web Development', 'React'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ExpandableCard>

          {/* Education Section */}
          <ExpandableCard title="Education" icon={GraduationCap}>
            <div className="space-y-6 text-gray-300">
              <div className="relative pl-6 border-l border-purple-400">
                <div className="mb-4">
                  <h4 className="text-white font-semibold">Master's in Marketing</h4>
                  <p className="text-sm text-gray-400">
                    <a href="https://neoma-bs.com/programmes/master-in-management/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="hover:text-white transition-colors">
                      NEOMA
                    </a> - Current
                  </p>
                </div>
              </div>
              <div className="relative pl-6 border-l border-blue-400">
                <div>
                  <h4 className="text-white font-semibold">Self-Taught Developer</h4>
                  <p className="text-sm text-gray-400">Continuous Learning</p>
                  <p className="mt-2">Focused on modern web development technologies and practices.</p>
                </div>
              </div>
            </div>
          </ExpandableCard>

          {/* Projects Section */}
          <ExpandableCard title="Projects" icon={Code}>
            <div className="grid gap-6">
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="text-lg font-semibold text-white mb-2">
                  <a href="https://webpixelle3.netlify.app/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="hover:text-purple-400 transition-colors">
                    PXL3
                  </a>
                </h4>
                <p className="text-gray-400 mb-3">
                  Collaboration with <a href="https://github.com/Klima42" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-purple-400 hover:text-purple-300 transition-colors">
                                        @Klima42
                                    </a>
                </p>
                <div className="flex gap-2">
                  <a href="https://webpixelle3.netlify.app/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="px-3 py-1 text-sm bg-purple-900/30 text-purple-300 rounded-full hover:bg-purple-900/50 transition-colors">
                    View Project
                  </a>
                </div>
              </div>
            </div>
          </ExpandableCard>

          {/* Social Links with Animated Text */}
          <div className="flex flex-col items-center pt-8">
            <div className="flex justify-center gap-6 mb-2">
              <a
                href="https://github.com/AliKelDev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/AliLeisR"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <AnimatedText />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;