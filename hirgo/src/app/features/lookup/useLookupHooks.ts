// Import the base hook
import { useLookup } from './useLookup';
import { LookupType } from './lookupApi';

// Create specialized hooks for each lookup type
export function useEducationLevels() {
  return useLookup('EducationLevel');
}

export function useEmploymentTypes() {
  return useLookup('EmploymentType');
}

export function useExperienceLevels() {
  return useLookup('ExperienceLevel');
}

export function useLanguageSkills() {
  return useLookup('LanguageSkills');
}

export function useLocations() {
  return useLookup('Location');
}

export function useWorkSchedules() {
  return useLookup('WorkSchedule');
}

// Factory function to create a custom hook for any lookup type
// This is useful if new lookup types are added in the future
export function createLookupHook(type: LookupType) {
  return () => useLookup(type);
} 