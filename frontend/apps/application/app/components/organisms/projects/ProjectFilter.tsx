'use client';
import Image from 'next/image'
import React from 'react'

function ProjectSorter() {
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

  const sortingOptions = [
    { label: 'Date de création', value: 'creationDate' },
    { label: 'Nom du projet', value: 'projectName' },
    { label: 'Nombre de plans', value: 'numberOfPlans' },
    { label: 'Nombre de photos', value: 'numberOfPhotos' },
  ];

  const [selectedOption, setSelectedOption] = React.useState<{label: string, value:string}>(sortingOptions[0]);

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

      <div className={`${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} absolute top-full right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-100`}>
        <ul className="py-2">
          {sortingOptions.map((option) => (
            <li key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedOption.value === option.value ? 'bg-gray-200' : ''}`}
              onClick={() => setSelectedOption(option)}
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