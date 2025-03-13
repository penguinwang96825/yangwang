import { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Billboard, Html } from '@react-three/drei'
import 'katex/dist/katex.min.css'
import katex from 'katex'

// Import pages
import Home from './components/Home'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Import hooks and providers
import useTheme from './hooks/useTheme'
import ThemeProvider from './components/ThemeProvider'

// Mathematical symbols and equations to display with LaTeX support
const mathSymbols = [
  // Basic equations
  'E = mc^2', 'F = ma', 'e^{i\\pi} + 1 = 0',
  
  // Complex equations
  '\\frac{d}{dx}\\left( \\int_{a}^{x} f(t) \\, dt \\right) = f(x)',
  '\\nabla \\times \\vec{E} = -\\frac{\\partial\\vec{B}}{\\partial t}',
  '\\nabla \\times \\vec{B} = \\mu_0\\vec{J} + \\mu_0\\varepsilon_0\\frac{\\partial\\vec{E}}{\\partial t}',
  '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}',
  '\\nabla \\cdot \\vec{B} = 0',
  '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
  'P(A \\mid B) = \\frac{P(B \\mid A) \\, P(A)}{P(B)}',
  '\\iint_D \\! f(x,y) \\, dx \\, dy',
  '\\mathcal{L}\\{f(t)\\} = F(s) = \\int_{0}^{\\infty} f(t) e^{-st} \\, dt',
  'f\'(a) = \\lim_{h \\to 0}\\frac{f(a+h) - f(a)}{h}',
  '\\oint_C f(z) \\, dz = 2\\pi i \\sum_{k=1}^{n} \\text{Res}(f, a_k)',
  'e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}',
];

// Function to render LaTeX to HTML
const renderLatex = (formula: string): string => {
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: false,
      output: 'html',
    });
  } catch (error) {
    console.error("Error rendering LaTeX:", error);
    return formula;
  }
};

interface MathParticleProps {
  position: [number, number, number];
  symbol: string;
  color: string;
}

// Math particle component with LaTeX support
function MathParticle({ position, symbol, color }: MathParticleProps) {
  const meshRef = useMemo(() => ({ current: null }), []);
  const speed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.01
  }), []);
  
  useFrame(() => {
    if (meshRef.current) {
      // @ts-ignore - we know meshRef.current exists in this context
      meshRef.current.position.x += speed.x;
      // @ts-ignore
      meshRef.current.position.y += speed.y;
      // @ts-ignore
      meshRef.current.position.z += speed.z;
      
      // Bounce off boundaries
      // @ts-ignore
      if (Math.abs(meshRef.current.position.x) > 15) speed.x *= -1;
      // @ts-ignore
      if (Math.abs(meshRef.current.position.y) > 15) speed.y *= -1;
      // @ts-ignore
      if (Math.abs(meshRef.current.position.z) > 15) speed.z *= -1;
    }
  });
  
  // Use Html component to render LaTeX
  return (
    // @ts-ignore - Billboard is from drei but TypeScript might not recognize it
    <Billboard position={position} ref={meshRef}>
      <Html
        transform
        occlude
        distanceFactor={10}
        style={{
          color: color,
          fontSize: '0.5rem',
          userSelect: 'none',
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          mixBlendMode: 'normal', // Helps with transparency
        }}
      >
        <div 
          className="math-formula" 
          dangerouslySetInnerHTML={{ __html: renderLatex(symbol) }} 
        />
      </Html>
    </Billboard>
  );
}

interface MathElement {
  id: number;
  position: [number, number, number];
  symbol: string;
  color: string;
}

// Math background with particles
function MathBackground() {
  const [particles, setParticles] = useState<MathElement[]>([]);
  
  useEffect(() => {
    const elements: MathElement[] = [];
    for (let i = 0; i < 50; i++) {
      elements.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        color: `hsl(${Math.random() * 360}, 70%, 75%)`
      });
    }
    setParticles(elements);
  }, []);
  
  return (
    <group>
      {particles.map((particle) => (
        <MathParticle
          key={particle.id}
          position={particle.position}
          symbol={particle.symbol}
          color={particle.color}
        />
      ))}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

function App() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mathEnabled, setMathEnabled] = useState(true)

  // Save math preference to localStorage
  useEffect(() => {
    localStorage.setItem('mathEnabled', mathEnabled.toString());
  }, [mathEnabled]);

  // Load math preference from localStorage
  useEffect(() => {
    const savedMathEnabled = localStorage.getItem('mathEnabled');
    if (savedMathEnabled !== null) {
      setMathEnabled(savedMathEnabled === 'true');
    }
  }, []);

  // Toggle math background
  const toggleMath = () => {
    setMathEnabled(!mathEnabled);
  };

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Extract base path for navigation highlighting
  const currentPath = location.pathname.split('/')[1] || '';

  return (
    <ThemeProvider>
      <div className={`min-h-screen flex flex-col ${theme} ${!mathEnabled ? 'math-disabled' : ''}`}>
        <div className="bg-gray-100 dark:bg-black flex-grow flex flex-col">
          {/* 3D Math background */}
          <div className="fixed inset-0 z-0 math-background">
            {mathEnabled && (
              <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  enableRotate={true}
                  autoRotate
                  autoRotateSpeed={0.3}
                />
                <MathBackground />
              </Canvas>
            )}
          </div>

          {/* Navigation */}
          <nav className="relative z-10 bg-white/80 dark:bg-black/90 backdrop-blur-md shadow">
            <div className="container-custom">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                      Yang's Space
                    </Link>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-4 md:items-center">
                    <Link to="/" className={`nav-link ${currentPath === '' ? 'nav-link-active' : 'nav-link-inactive'}`}>Home</Link>
                    <Link to="/blog" className={`nav-link ${currentPath === 'blog' ? 'nav-link-active' : 'nav-link-inactive'}`}>Blog</Link>
                    <Link to="/contact" className={`nav-link ${currentPath === 'contact' ? 'nav-link-active' : 'nav-link-inactive'}`}>Contact</Link>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Math Background Toggle */}
                  <button
                    onClick={toggleMath}
                    className="p-1 rounded-full text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                    aria-label={mathEnabled ? "Disable math background" : "Enable math background"}
                    title={mathEnabled ? "Disable math background" : "Enable math background"}
                  >
                    {mathEnabled ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-1 rounded-full text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                    aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                    title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === 'dark' ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  <div className="md:hidden ml-3">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      <svg
                        className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <svg
                        className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className={`nav-link block ${currentPath === '' ? 'nav-link-active' : 'nav-link-inactive'}`}>Home</Link>
                <Link to="/blog" className={`nav-link block ${currentPath === 'blog' ? 'nav-link-active' : 'nav-link-inactive'}`}>Blog</Link>
                <Link to="/contact" className={`nav-link block ${currentPath === 'contact' ? 'nav-link-active' : 'nav-link-inactive'}`}>Contact</Link>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="relative z-10 flex-grow py-10">
            <div className="container-custom">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
