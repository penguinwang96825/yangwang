import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

// Import pages
import Home from './components/Home'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Import hooks
import useTheme from './hooks/useTheme'

function App() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <div className="bg-gray-100 dark:bg-gray-900 flex-grow flex flex-col">
        {/* 3D background */}
        <div className="fixed inset-0 z-0">
          <Canvas>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={true}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <Stars 
              radius={100} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={1} 
            />
            <ambientLight intensity={0.5} />
          </Canvas>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow">
          <div className="container-custom">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                    My Portfolio
                  </Link>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-4 md:items-center">
                  <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : 'nav-link-inactive'}`}>Home</Link>
                  <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'nav-link-active' : 'nav-link-inactive'}`}>Blog</Link>
                  <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'nav-link-active' : 'nav-link-inactive'}`}>Contact</Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleTheme}
                  className="p-1 rounded-full text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white focus:outline-none"
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
              <Link to="/" className={`nav-link block ${location.pathname === '/' ? 'nav-link-active' : 'nav-link-inactive'}`}>Home</Link>
              <Link to="/blog" className={`nav-link block ${location.pathname === '/blog' ? 'nav-link-active' : 'nav-link-inactive'}`}>Blog</Link>
              <Link to="/contact" className={`nav-link block ${location.pathname === '/contact' ? 'nav-link-active' : 'nav-link-inactive'}`}>Contact</Link>
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
              </Routes>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default App
