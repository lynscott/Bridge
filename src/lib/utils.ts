import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    background: 'rgba(55, 65, 81, 0.5)',
    borderColor: 'rgba(75, 85, 99, 0.5)',
    borderRadius: '0.75rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgba(34, 197, 94, 0.5)',
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: 'rgba(31, 41, 55, 0.95)',
    backdropFilter: 'blur(4px)',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    zIndex: 999, // Added z-index
    position: 'absolute', // Ensure absolute positioning
    width: '100%', // Match container width
    marginTop: '4px', // Add some spacing from the control
  }),
  menuList: (base: any) => ({
    ...base,
    padding: '4px',
    maxHeight: '250px', // Limit max height
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(31, 41, 55, 0.5)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(75, 85, 99, 0.5)',
      borderRadius: '4px',
      '&:hover': {
        background: 'rgba(75, 85, 99, 0.7)',
      },
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? 'rgba(55, 65, 81, 0.5)' : 'transparent',
    color: 'white', // Added explicit text color
    padding: '8px 12px',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    '&:active': {
      background: 'rgba(34, 197, 94, 0.2)',
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    background: 'rgba(34, 197, 94, 0.2)',
    borderRadius: '0.5rem',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'white',
    padding: '2px 6px',
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: 'white',
    borderRadius: '0 0.5rem 0.5rem 0',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.5)',
      color: 'white',
    },
  }),
  input: (base: any) => ({
    ...base,
    color: 'white',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'rgba(156, 163, 175, 0.8)',
  }),
  container: (base: any) => ({
    ...base,
    zIndex: 100, // Added z-index to container
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '2px 8px',
  }),
};
