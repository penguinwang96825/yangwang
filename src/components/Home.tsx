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
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-500 dark:border-indigo-400">
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
              <h2 className="text-2xl text-indigo-600 dark:text-indigo-400 mb-4">{personalInfo.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {personalInfo.welcomeMessage}
              </p>
              <div className="flex space-x-4">
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          About Me
        </h2>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
          <p className="text-gray-600 dark:text-gray-300">
            {personalInfo.about}
          </p>
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          Education
        </h2>
        <div className="space-y-6">
          {personalInfo.education.map((edu, index) => (
            <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{edu.degree}</h3>
                <span className="text-indigo-600 dark:text-indigo-400">{edu.period}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{edu.institution}, {edu.location}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          Work Experience
        </h2>
        <div className="space-y-6">
          {personalInfo.workExperience.map((work, index) => (
            <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{work.position}</h3>
                <span className="text-indigo-600 dark:text-indigo-400">{work.period}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{work.company}, {work.location}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {work.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Publications Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          Publications
        </h2>
        <div className="space-y-6">
          {personalInfo.publications.map((pub, index) => (
            <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {pub.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{pub.conference}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Authors: {pub.authors}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {pub.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section - Conditionally rendered based on showSkills */}
      {personalInfo.showSkills && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Skills
          </h2>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Programming Languages</h3>
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Technologies & Frameworks</h3>
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