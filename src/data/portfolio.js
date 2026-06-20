/**
 * @file Portfolio data loader
 * 
 * ALL YOUR DATA LIVES IN portfolio.json
 * Edit that file to update your portfolio content.
 * No need to touch any other file.
 */
import data from './portfolio.json';

export const navigationSections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

// Transform skills from simple string arrays to object format
const transformedData = {
  ...data,
  skills: data.skills.map((category) => ({
    name: category.name,
    skills: category.skills.map((skill) =>
      typeof skill === 'string' ? { name: skill } : skill
    ),
  })),
};

export const portfolioData = transformedData;
export const resumeUrl = data.resumeUrl;
export const email = data.email;
export const availableForWork = data.availableForWork;
export const stats = data.stats;
export const siteTitle = data.siteTitle;
