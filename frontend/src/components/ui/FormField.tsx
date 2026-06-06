import React from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

export default function FormField({ label, error, required, children, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label-base">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-mist-500">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`input-base ${error ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''} ${className}`}
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  children: React.ReactNode
}

export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`input-base ${error ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`input-base resize-none ${error ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''} ${className}`}
      {...props}
    />
  )
}
