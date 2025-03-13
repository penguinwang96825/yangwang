import { useState } from 'react';
import { motion } from 'framer-motion';
import usePersonalInfo from '../utils/usePersonalInfo';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { personalInfo } = usePersonalInfo();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    try {
      // In a real application, you would send this to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Thank you for your message! I will get back to you soon.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold dark:text-white text-black mb-8">
          Contact Me
        </h1>

        <div className="bg-white dark:bg-black backdrop-blur-md rounded-xl shadow-xl p-8 mb-8">
          <p className="dark:text-white text-black mb-6">
            I'm always interested in hearing about new opportunities, collaborations, or just having a chat 
            about technology and innovation. Feel free to reach out!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium dark:text-white text-black mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black/80 text-black dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-white text-black mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black/80 text-black dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium dark:text-white text-black mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black/80 text-black dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium dark:text-white text-black mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black/80 text-black dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-colors duration-300"
              />
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-md ${
                  status.type === 'success'
                    ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-200'
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black font-medium py-2 px-4 rounded-md transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact; 