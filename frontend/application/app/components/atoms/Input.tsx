import React from 'react'

interface InputProps {
  type?: string
  label: string
  name: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  inputClassName?: string
  disabled?: boolean
}
function Input({ type = "text", label, name, placeholder, value, onChange, className, inputClassName, disabled }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 items-start ${className || ''}`}>
      <label className="font-medium text-gray-700 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`inline-block w-full border-1 border-stroke rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${inputClassName || ''}`}
      />
    </div>
  )
}

export default Input
