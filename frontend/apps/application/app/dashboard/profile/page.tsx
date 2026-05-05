import React from 'react'

function ProfilePage() {
  return (
    <div className="p-4">
      {/* profile header */}
      <div className="relative w-full h-52 bg-gray-200 rounded-md mb-12">

        <div className="absolute -bottom-15 left-4 flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-400 border-4 border-white">

          </div>

          <div>
            <h1 className="text-2xl font-semibold">Jonathan ASSI</h1>
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default ProfilePage