
import { ArrowLeft, ChevronDown } from 'lucide-react'
import React from 'react'

function TopBar() {
  return (
    <div className="bg-gray-100 text-black p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <ArrowLeft />
        <h3>Titre du projet</h3>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <p>Aucun plan</p>
        <ChevronDown />
      </div>
    </div>
  )
}

export default TopBar