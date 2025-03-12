import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

// Define the types for our personal information
export interface PersonalInfo {
  name: string;
  title: string;
  profileImage: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeLink: string;
  welcomeMessage: string;
  about: string;
  education: Education[];
  workExperience: WorkExperience[];
  publications: Publication[];
  skills: Skills;
  showSkills: boolean; // Whether to show the skills section
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

export interface WorkExperience {
  position: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface Publication {
  title: string;
  conference: string;
  authors: string;
  description: string;
}

export interface Skills {
  languages: Skill[];
  technologies: Skill[];
}

export interface Skill {
  name: string;
  proficiency: number;
}

// Default personal info as a fallback
const defaultPersonalInfo: PersonalInfo = {
  name: 'John Doe',
  title: 'Software Engineer',
  profileImage: '/images/profile.jpg',
  email: 'john.doe@example.com',
  github: 'johndoe',
  linkedin: 'johndoe',
  twitter: 'johndoe',
  resumeLink: '/resume.pdf',
  welcomeMessage: 'Welcome to my personal website.',
  about: 'I am a software engineer with a passion for building things.',
  education: [],
  workExperience: [],
  publications: [],
  skills: {
    languages: [],
    technologies: []
  },
  showSkills: true // Default to showing skills
};

/**
 * Hook to fetch and parse personal information from the YAML file
 */
export const usePersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/personal-info.yaml');
        
        if (!response.ok) {
          throw new Error('Failed to load personal information');
        }
        
        const yamlText = await response.text();
        const parsedInfo = yaml.load(yamlText) as PersonalInfo;
        
        setPersonalInfo(parsedInfo);
      } catch (err) {
        console.error('Error loading personal information:', err);
        setError('Failed to load personal information');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  return { personalInfo, loading, error };
}; 