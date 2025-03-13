import { motion } from 'framer-motion';
import { usePersonalInfo } from '../utils/personalInfo';

const Home = () => {
  const { personalInfo, loading, error } = usePersonalInfo();

  // Function to get absolute URL with the base path
  const getAssetUrl = (path: string) => {
    // If the path already starts with http or https, it's already an absolute URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Otherwise, prepend the base URL
    return `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.substring(1) : path}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-oxfordBlue dark:border-oxfordBlue">
                <img 
                  src={getAssetUrl(personalInfo.profileImage)}
                  alt={personalInfo.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/200x200?text=Profile';
                  }}
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{personalInfo.name}</h1>
              <h2 className="text-2xl text-oxfordBlue dark:text-oxfordBlue mb-4">{personalInfo.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {personalInfo.welcomeMessage}
              </p>
              <div className="flex space-x-4">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="bg-oxfordBlue hover:bg-oxfordBlue/80 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Contact Me
                </a>
                <a 
                  href={getAssetUrl(personalInfo.resumeLink)} 
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-grayNurse mb-6 border-b border-gray-200 dark:border-black/50 pb-2">
          About Me
        </h2>
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
          <p className="text-gray-600 dark:text-grayNurse">
            {personalInfo.about}
          </p>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-grayNurse mb-6 border-b border-gray-200 dark:border-black/50 pb-2">
          Education
        </h2>
        <div className="space-y-6">
          {personalInfo.education.map((edu, index) => (
            <div key={index} className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-grayNurse">{edu.degree}</h3>
                <span className="text-oxfordBlue dark:text-oxfordBlue">{edu.period}</span>
              </div>
              <p className="text-gray-700 dark:text-grayNurse/90 mb-2">{edu.institution}, {edu.location}</p>
              <p className="text-gray-600 dark:text-grayNurse/80">
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-grayNurse mb-6 border-b border-gray-200 dark:border-black/50 pb-2">
          Work Experience
        </h2>
        <div className="space-y-6">
          {personalInfo.workExperience.map((work, index) => (
            <div key={index} className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-grayNurse">{work.position}</h3>
                <span className="text-oxfordBlue dark:text-oxfordBlue">{work.period}</span>
              </div>
              <p className="text-gray-700 dark:text-grayNurse/90 mb-2">{work.company}, {work.location}</p>
              <p className="text-gray-600 dark:text-grayNurse/80">
                {work.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Publications Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-grayNurse mb-6 border-b border-gray-200 dark:border-black/50 pb-2">
          Publications
        </h2>
        <div className="space-y-6">
          {personalInfo.publications.map((pub, index) => (
            <div key={index} className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-grayNurse mb-2">
                {pub.title}
              </h3>
              <p className="text-gray-700 dark:text-grayNurse/90 mb-2">{pub.conference}</p>
              <p className="text-gray-600 dark:text-grayNurse/80 mb-4">
                Authors: {pub.authors}
              </p>
              <p className="text-gray-600 dark:text-grayNurse/80 mb-4">
                {pub.description}
              </p>
              
              {/* Publication links - only show if available */}
              {(pub.codeLink || pub.pdfLink) && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {pub.codeLink && (
                    <a 
                      href={getAssetUrl(pub.codeLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  )}
                  
                  {pub.pdfLink && (
                    <a 
                      href={getAssetUrl(pub.pdfLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7zm-4.5 8a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                      </svg>
                      PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section - Conditionally rendered based on showSkills */}
      {personalInfo.showSkills && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-grayNurse mb-6 border-b border-gray-200 dark:border-black/50 pb-2">
            Skills
          </h2>
          <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4">Programming Languages</h3>
                <div className="space-y-3">
                  {personalInfo.skills.languages.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-gray-700 dark:text-gray-300">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4">Technologies & Frameworks</h3>
                <div className="space-y-3">
                  {personalInfo.skills.technologies.map((tech, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{tech.name}</span>
                        <span className="text-gray-700 dark:text-gray-300">{tech.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${tech.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Home; 