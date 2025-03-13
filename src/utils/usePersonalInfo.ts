import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

interface WorkExperience {
  position: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

interface Publication {
  title: string;
  conference: string;
  authors: string;
  description: string;
  codeLink?: string;
  pdfLink?: string;
}

interface Skill {
  name: string;
  proficiency: number;
}

interface Skills {
  languages: Skill[];
  technologies: Skill[];
}

interface PersonalInfo {
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
  showSkills: boolean;
  education: Education[];
  workExperience: WorkExperience[];
  publications: Publication[];
  skills: Skills;
}

/**
 * Custom hook to fetch and parse personal information from YAML file
 */
export default function usePersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/personal-info.yaml');
        
        if (!response.ok) {
          throw new Error('Failed to load personal info');
        }
        
        const yamlText = await response.text();
        const parsedInfo = yaml.load(yamlText) as PersonalInfo;
        setPersonalInfo(parsedInfo);
        setError(null);
      } catch (err) {
        console.error('Error loading personal info:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersonalInfo();
  }, []);
  
  return { personalInfo, loading, error };
} 