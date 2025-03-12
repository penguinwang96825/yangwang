#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import readline from 'readline';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Path to the personal-info.yaml file
const personalInfoPath = path.join(rootDir, 'public', 'data', 'personal-info.yaml');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask a question and return the answer
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to load the YAML file
function loadYaml() {
  try {
    if (!fs.existsSync(personalInfoPath)) {
      console.error(`Personal info file not found at: ${personalInfoPath}`);
      process.exit(1);
    }

    const yamlContent = fs.readFileSync(personalInfoPath, 'utf8');
    return yaml.load(yamlContent);
  } catch (error) {
    console.error('Error loading YAML file:', error);
    process.exit(1);
  }
}

// Function to save the YAML file
function saveYaml(data) {
  try {
    const yamlContent = yaml.dump(data, {
      lineWidth: 100,
      quotingType: '"',
      forceQuotes: true
    });
    fs.writeFileSync(personalInfoPath, yamlContent, 'utf8');
    console.log(`\nPersonal info updated successfully at: ${personalInfoPath}`);
  } catch (error) {
    console.error('Error saving YAML file:', error);
    process.exit(1);
  }
}

// Function to update basic information
async function updateBasicInfo(personalInfo) {
  console.log('\n=== Basic Information ===');
  
  personalInfo.name = await ask(`Name [${personalInfo.name}]: `) || personalInfo.name;
  personalInfo.title = await ask(`Title [${personalInfo.title}]: `) || personalInfo.title;
  personalInfo.profileImage = await ask(`Profile Image Path [${personalInfo.profileImage}]: `) || personalInfo.profileImage;
  personalInfo.email = await ask(`Email [${personalInfo.email}]: `) || personalInfo.email;
  personalInfo.github = await ask(`GitHub Username [${personalInfo.github}]: `) || personalInfo.github;
  personalInfo.linkedin = await ask(`LinkedIn Username [${personalInfo.linkedin}]: `) || personalInfo.linkedin;
  personalInfo.twitter = await ask(`Twitter Username [${personalInfo.twitter}]: `) || personalInfo.twitter;
  personalInfo.resumeLink = await ask(`Resume Link [${personalInfo.resumeLink}]: `) || personalInfo.resumeLink;
  
  return personalInfo;
}

// Function to update welcome message and about
async function updateContent(personalInfo) {
  console.log('\n=== Content ===');
  
  console.log('\nCurrent Welcome Message:');
  console.log(personalInfo.welcomeMessage);
  const updateWelcome = await ask('\nUpdate welcome message? (y/n): ');
  
  if (updateWelcome.toLowerCase() === 'y') {
    personalInfo.welcomeMessage = await ask('New Welcome Message: ');
  }
  
  console.log('\nCurrent About:');
  console.log(personalInfo.about);
  const updateAbout = await ask('\nUpdate about section? (y/n): ');
  
  if (updateAbout.toLowerCase() === 'y') {
    personalInfo.about = await ask('New About Section: ');
  }
  
  return personalInfo;
}

// Function to update display settings
async function updateDisplaySettings(personalInfo) {
  console.log('\n=== Display Settings ===');
  
  // If showSkills doesn't exist, add it with default value
  if (personalInfo.showSkills === undefined) {
    personalInfo.showSkills = true;
  }
  
  const showSkillsValue = personalInfo.showSkills ? 'yes' : 'no';
  const response = await ask(`Show Skills Section? (yes/no) [${showSkillsValue}]: `);
  
  if (response.toLowerCase() === 'yes' || response.toLowerCase() === 'y') {
    personalInfo.showSkills = true;
  } else if (response.toLowerCase() === 'no' || response.toLowerCase() === 'n') {
    personalInfo.showSkills = false;
  }
  
  return personalInfo;
}

// Function to update education
async function updateEducation(personalInfo) {
  console.log('\n=== Education ===');
  
  // Display current education
  if (personalInfo.education && personalInfo.education.length > 0) {
    console.log('\nCurrent Education:');
    personalInfo.education.forEach((edu, index) => {
      console.log(`${index + 1}. ${edu.degree} - ${edu.institution} (${edu.period})`);
    });
    
    const updateOption = await ask('\nOptions: (a)dd, (e)dit, (d)elete, (s)kip: ');
    
    if (updateOption.toLowerCase() === 'a') {
      // Add new education
      const newEducation = {
        degree: await ask('Degree: '),
        institution: await ask('Institution: '),
        location: await ask('Location: '),
        period: await ask('Period: '),
        description: await ask('Description: ')
      };
      
      personalInfo.education.push(newEducation);
    } else if (updateOption.toLowerCase() === 'e') {
      // Edit existing education
      const editIndex = parseInt(await ask('Enter the number to edit: ')) - 1;
      
      if (editIndex >= 0 && editIndex < personalInfo.education.length) {
        const edu = personalInfo.education[editIndex];
        edu.degree = await ask(`Degree [${edu.degree}]: `) || edu.degree;
        edu.institution = await ask(`Institution [${edu.institution}]: `) || edu.institution;
        edu.location = await ask(`Location [${edu.location}]: `) || edu.location;
        edu.period = await ask(`Period [${edu.period}]: `) || edu.period;
        console.log('Current Description:');
        console.log(edu.description);
        const newDesc = await ask('New Description (press Enter to keep current): ');
        if (newDesc) {
          edu.description = newDesc;
        }
      } else {
        console.log('Invalid selection.');
      }
    } else if (updateOption.toLowerCase() === 'd') {
      // Delete existing education
      const deleteIndex = parseInt(await ask('Enter the number to delete: ')) - 1;
      
      if (deleteIndex >= 0 && deleteIndex < personalInfo.education.length) {
        personalInfo.education.splice(deleteIndex, 1);
        console.log('Education entry deleted.');
      } else {
        console.log('Invalid selection.');
      }
    }
  } else {
    console.log('No education entries found.');
    const addNew = await ask('Add education entry? (y/n): ');
    
    if (addNew.toLowerCase() === 'y') {
      if (!personalInfo.education) {
        personalInfo.education = [];
      }
      
      const newEducation = {
        degree: await ask('Degree: '),
        institution: await ask('Institution: '),
        location: await ask('Location: '),
        period: await ask('Period: '),
        description: await ask('Description: ')
      };
      
      personalInfo.education.push(newEducation);
    }
  }
  
  return personalInfo;
}

// Function to update work experience
async function updateWorkExperience(personalInfo) {
  console.log('\n=== Work Experience ===');
  
  // Display current work experience
  if (personalInfo.workExperience && personalInfo.workExperience.length > 0) {
    console.log('\nCurrent Work Experience:');
    personalInfo.workExperience.forEach((work, index) => {
      console.log(`${index + 1}. ${work.position} - ${work.company} (${work.period})`);
    });
    
    const updateOption = await ask('\nOptions: (a)dd, (e)dit, (d)elete, (s)kip: ');
    
    if (updateOption.toLowerCase() === 'a') {
      // Add new work experience
      const newWork = {
        position: await ask('Position: '),
        company: await ask('Company: '),
        location: await ask('Location: '),
        period: await ask('Period: '),
        description: await ask('Description: ')
      };
      
      personalInfo.workExperience.push(newWork);
    } else if (updateOption.toLowerCase() === 'e') {
      // Edit existing work experience
      const editIndex = parseInt(await ask('Enter the number to edit: ')) - 1;
      
      if (editIndex >= 0 && editIndex < personalInfo.workExperience.length) {
        const work = personalInfo.workExperience[editIndex];
        work.position = await ask(`Position [${work.position}]: `) || work.position;
        work.company = await ask(`Company [${work.company}]: `) || work.company;
        work.location = await ask(`Location [${work.location}]: `) || work.location;
        work.period = await ask(`Period [${work.period}]: `) || work.period;
        console.log('Current Description:');
        console.log(work.description);
        const newDesc = await ask('New Description (press Enter to keep current): ');
        if (newDesc) {
          work.description = newDesc;
        }
      } else {
        console.log('Invalid selection.');
      }
    } else if (updateOption.toLowerCase() === 'd') {
      // Delete existing work experience
      const deleteIndex = parseInt(await ask('Enter the number to delete: ')) - 1;
      
      if (deleteIndex >= 0 && deleteIndex < personalInfo.workExperience.length) {
        personalInfo.workExperience.splice(deleteIndex, 1);
        console.log('Work experience entry deleted.');
      } else {
        console.log('Invalid selection.');
      }
    }
  } else {
    console.log('No work experience entries found.');
    const addNew = await ask('Add work experience entry? (y/n): ');
    
    if (addNew.toLowerCase() === 'y') {
      if (!personalInfo.workExperience) {
        personalInfo.workExperience = [];
      }
      
      const newWork = {
        position: await ask('Position: '),
        company: await ask('Company: '),
        location: await ask('Location: '),
        period: await ask('Period: '),
        description: await ask('Description: ')
      };
      
      personalInfo.workExperience.push(newWork);
    }
  }
  
  return personalInfo;
}

// Function to update publications
async function updatePublications(personalInfo) {
  console.log('\n=== Publications ===');
  
  // Display current publications
  if (personalInfo.publications && personalInfo.publications.length > 0) {
    console.log('\nCurrent Publications:');
    personalInfo.publications.forEach((pub, index) => {
      console.log(`${index + 1}. ${pub.title} - ${pub.conference}`);
    });
    
    const updateOption = await ask('\nOptions: (a)dd, (e)dit, (d)elete, (s)kip: ');
    
    if (updateOption.toLowerCase() === 'a') {
      // Add new publication
      const newPub = {
        title: await ask('Title: '),
        conference: await ask('Conference/Journal: '),
        authors: await ask('Authors: '),
        description: await ask('Description: ')
      };
      
      personalInfo.publications.push(newPub);
    } else if (updateOption.toLowerCase() === 'e') {
      // Edit existing publication
      const editIndex = parseInt(await ask('Enter the number to edit: ')) - 1;
      
      if (editIndex >= 0 && editIndex < personalInfo.publications.length) {
        const pub = personalInfo.publications[editIndex];
        pub.title = await ask(`Title [${pub.title}]: `) || pub.title;
        pub.conference = await ask(`Conference/Journal [${pub.conference}]: `) || pub.conference;
        pub.authors = await ask(`Authors [${pub.authors}]: `) || pub.authors;
        console.log('Current Description:');
        console.log(pub.description);
        const newDesc = await ask('New Description (press Enter to keep current): ');
        if (newDesc) {
          pub.description = newDesc;
        }
      } else {
        console.log('Invalid selection.');
      }
    } else if (updateOption.toLowerCase() === 'd') {
      // Delete existing publication
      const deleteIndex = parseInt(await ask('Enter the number to delete: ')) - 1;
      
      if (deleteIndex >= 0 && deleteIndex < personalInfo.publications.length) {
        personalInfo.publications.splice(deleteIndex, 1);
        console.log('Publication entry deleted.');
      } else {
        console.log('Invalid selection.');
      }
    }
  } else {
    console.log('No publication entries found.');
    const addNew = await ask('Add publication entry? (y/n): ');
    
    if (addNew.toLowerCase() === 'y') {
      if (!personalInfo.publications) {
        personalInfo.publications = [];
      }
      
      const newPub = {
        title: await ask('Title: '),
        conference: await ask('Conference/Journal: '),
        authors: await ask('Authors: '),
        description: await ask('Description: ')
      };
      
      personalInfo.publications.push(newPub);
    }
  }
  
  return personalInfo;
}

// Function to update skills
async function updateSkills(personalInfo) {
  console.log('\n=== Skills ===');
  
  if (!personalInfo.skills) {
    personalInfo.skills = {
      languages: [],
      technologies: []
    };
  }
  
  // Update programming languages
  console.log('\n--- Programming Languages ---');
  if (personalInfo.skills.languages && personalInfo.skills.languages.length > 0) {
    console.log('\nCurrent Programming Languages:');
    personalInfo.skills.languages.forEach((lang, index) => {
      console.log(`${index + 1}. ${lang.name} - ${lang.proficiency}%`);
    });
    
    const updateOption = await ask('\nOptions: (a)dd, (e)dit, (d)elete, (s)kip: ');
    
    if (updateOption.toLowerCase() === 'a') {
      // Add new language
      const newLang = {
        name: await ask('Language Name: '),
        proficiency: parseInt(await ask('Proficiency (0-100): '))
      };
      
      personalInfo.skills.languages.push(newLang);
    } else if (updateOption.toLowerCase() === 'e') {
      // Edit existing language
      const editIndex = parseInt(await ask('Enter the number to edit: ')) - 1;
      
      if (editIndex >= 0 && editIndex < personalInfo.skills.languages.length) {
        const lang = personalInfo.skills.languages[editIndex];
        lang.name = await ask(`Language Name [${lang.name}]: `) || lang.name;
        const proficiencyInput = await ask(`Proficiency (0-100) [${lang.proficiency}]: `);
        if (proficiencyInput) {
          lang.proficiency = parseInt(proficiencyInput);
        }
      } else {
        console.log('Invalid selection.');
      }
    } else if (updateOption.toLowerCase() === 'd') {
      // Delete existing language
      const deleteIndex = parseInt(await ask('Enter the number to delete: ')) - 1;
      
      if (deleteIndex >= 0 && deleteIndex < personalInfo.skills.languages.length) {
        personalInfo.skills.languages.splice(deleteIndex, 1);
        console.log('Language entry deleted.');
      } else {
        console.log('Invalid selection.');
      }
    }
  } else {
    console.log('No programming languages found.');
    const addNew = await ask('Add programming language? (y/n): ');
    
    if (addNew.toLowerCase() === 'y') {
      if (!personalInfo.skills.languages) {
        personalInfo.skills.languages = [];
      }
      
      const newLang = {
        name: await ask('Language Name: '),
        proficiency: parseInt(await ask('Proficiency (0-100): '))
      };
      
      personalInfo.skills.languages.push(newLang);
    }
  }
  
  // Update technologies/frameworks
  console.log('\n--- Technologies & Frameworks ---');
  if (personalInfo.skills.technologies && personalInfo.skills.technologies.length > 0) {
    console.log('\nCurrent Technologies & Frameworks:');
    personalInfo.skills.technologies.forEach((tech, index) => {
      console.log(`${index + 1}. ${tech.name} - ${tech.proficiency}%`);
    });
    
    const updateOption = await ask('\nOptions: (a)dd, (e)dit, (d)elete, (s)kip: ');
    
    if (updateOption.toLowerCase() === 'a') {
      // Add new technology
      const newTech = {
        name: await ask('Technology/Framework Name: '),
        proficiency: parseInt(await ask('Proficiency (0-100): '))
      };
      
      personalInfo.skills.technologies.push(newTech);
    } else if (updateOption.toLowerCase() === 'e') {
      // Edit existing technology
      const editIndex = parseInt(await ask('Enter the number to edit: ')) - 1;
      
      if (editIndex >= 0 && editIndex < personalInfo.skills.technologies.length) {
        const tech = personalInfo.skills.technologies[editIndex];
        tech.name = await ask(`Technology/Framework Name [${tech.name}]: `) || tech.name;
        const proficiencyInput = await ask(`Proficiency (0-100) [${tech.proficiency}]: `);
        if (proficiencyInput) {
          tech.proficiency = parseInt(proficiencyInput);
        }
      } else {
        console.log('Invalid selection.');
      }
    } else if (updateOption.toLowerCase() === 'd') {
      // Delete existing technology
      const deleteIndex = parseInt(await ask('Enter the number to delete: ')) - 1;
      
      if (deleteIndex >= 0 && deleteIndex < personalInfo.skills.technologies.length) {
        personalInfo.skills.technologies.splice(deleteIndex, 1);
        console.log('Technology entry deleted.');
      } else {
        console.log('Invalid selection.');
      }
    }
  } else {
    console.log('No technologies/frameworks found.');
    const addNew = await ask('Add technology/framework? (y/n): ');
    
    if (addNew.toLowerCase() === 'y') {
      if (!personalInfo.skills.technologies) {
        personalInfo.skills.technologies = [];
      }
      
      const newTech = {
        name: await ask('Technology/Framework Name: '),
        proficiency: parseInt(await ask('Proficiency (0-100): '))
      };
      
      personalInfo.skills.technologies.push(newTech);
    }
  }
  
  return personalInfo;
}

// Main function
async function main() {
  console.log('Personal Information Editor');
  console.log('==========================');
  
  try {
    // Load current personal info
    let personalInfo = loadYaml();
    
    // Display menu
    while (true) {
      console.log('\nOptions:');
      console.log('1. Update Basic Information');
      console.log('2. Update Welcome Message & About');
      console.log('3. Update Display Settings');
      console.log('4. Update Education');
      console.log('5. Update Work Experience');
      console.log('6. Update Publications');
      console.log('7. Update Skills');
      console.log('8. Save and Exit');
      console.log('9. Exit without Saving');
      
      const choice = await ask('\nEnter your choice (1-9): ');
      
      switch (choice) {
        case '1':
          personalInfo = await updateBasicInfo(personalInfo);
          break;
        case '2':
          personalInfo = await updateContent(personalInfo);
          break;
        case '3':
          personalInfo = await updateDisplaySettings(personalInfo);
          break;
        case '4':
          personalInfo = await updateEducation(personalInfo);
          break;
        case '5':
          personalInfo = await updateWorkExperience(personalInfo);
          break;
        case '6':
          personalInfo = await updatePublications(personalInfo);
          break;
        case '7':
          personalInfo = await updateSkills(personalInfo);
          break;
        case '8':
          saveYaml(personalInfo);
          rl.close();
          return;
        case '9':
          console.log('Exiting without saving changes.');
          rl.close();
          return;
        default:
          console.log('Invalid choice, please try again.');
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the main function
main(); 