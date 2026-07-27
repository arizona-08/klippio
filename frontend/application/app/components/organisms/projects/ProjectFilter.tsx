'use client';
import Image from 'next/image'
import React from 'react'

interface ProjectSorterProps {
  onSortChange?: (sortOption: {value: string, order: 'asc' | 'desc'}) => void;
}

function ProjectSorter({ onSortChange }: ProjectSorterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  function toggleOpen(){
    setIsOpen(!isOpen);
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.group')) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortingOptions: { label: string; value: string; order: 'asc' | 'desc' }[] = [
    { label: 'Date de modification décroissante', value: 'lastOpenedAt', order: 'desc' },
    { label: 'Date de modification croissante', value: 'lastOpenedAt', order: 'asc' },
    { label: 'Date de création croissante', value: 'createdAt', order: 'asc' },
    { label: 'Date de création décroissante', value: 'createdAt', order: 'desc' },
    { label: 'Nom du projet croissant', value: 'title', order: 'asc' },
    { label: 'Nom du projet décroissant', value: 'title', order: 'desc' },
  ];

  const [selectedOption, setSelectedOption] = React.useState<{label: string, value:string, order: 'asc' | 'desc'}>(sortingOptions[0]);

  return (
    <div 
      className="group relative"
      onClick={toggleOpen}
    >
      <div className="flex items-center gap-2 bg-white hover:bg-gray-200 border border-gray-300 rounded-md px-4 py-2 cursor-pointer transition-all duration-150">
        <Image
          src="/icons/sort.svg"
          alt="sort icon"
          width={16}
          height={16}
        />
        <span className="text-sm font-medium">{selectedOption.label}</span>
      </div>

      <div className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute top-full right-0 z-10 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-100`}>
        <ul className="">
          {sortingOptions.map((option, index) => (
            <li key={index}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${index === sortingOptions.findIndex(opt => opt.value === selectedOption.value && opt.order === selectedOption.order) ? 'bg-gray-200' : ''}`}
              onClick={() => {
                setSelectedOption(option);
                if (onSortChange) {
                  onSortChange({value: option.value, order: option.order});
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectSorter