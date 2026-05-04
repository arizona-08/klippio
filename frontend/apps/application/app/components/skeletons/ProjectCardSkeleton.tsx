import React from 'react'

function ProjectCardSkeleton() {
  return (
    <>
      <li className='w-full cursor-pointer border border-gray-200 rounded-md p-4 hover:shadow-sm hover:scale-101 transition-all duration-150 relative hover:z-10'>
        <div>
          <div className="relative project-pic-container bg-gray-500 aspect-video rounded-md mb-4">
            <div className="absolute top-5 right-5 bg-primary-light rounded-full h-4 w-6 animate-pulse"></div>
          </div>

          <div className="project-infos-container">
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>

              <div className=" flex flex-col items-end gap-1 w-4 cursor-pointer">
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              </div>

            </div>

            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </li>
    </>
  )
}

export default ProjectCardSkeleton