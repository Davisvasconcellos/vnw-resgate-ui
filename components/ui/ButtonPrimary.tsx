'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'ghost'
  size?: 'lg' | 'xl'
  fullWidth?: boolean
  children: ReactNode
}

const variants = {
  primary:
    'bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white shadow-[0_8px_24px_-6px_rgba(21,101,192,0.45)] hover:from-[#1976D2] hover:to-[#1E88E5]',
  danger:
    'bg-gradient-to-r from-[#C62828] to-[#E53935] text-white shadow-[0_8px_24px_-6px_rgba(198,40,40,0.45)] hover:from-[#D32F2F] hover:to-[#EF5350]',
  success:
    'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white shadow-[0_8px_24px_-6px_rgba(27,94,32,0.45)] hover:from-[#2E7D32] hover:to-[#388E3C]',
  warning:
    'bg-gradient-to-r from-[#E65100] to-[#F57C00] text-white shadow-[0_8px_24px_-6px_rgba(230,81,0,0.45)] hover:from-[#F57C00] hover:to-[#FF8F00]',
  ghost:
    'bg-white/10 border-2 border-white/30 text-white backdrop-blur-sm hover:bg-white/20',
}

const sizes = {
  lg: 'py-4 px-6 text-lg min-h-[56px]',
  xl: 'py-5 px-6 text-xl min-h-[68px]',
}

export default function ButtonPrimary({
  icon,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`
        flex items-center gap-3 rounded-2xl font-bold font-headline
        transition-all duration-200 active:scale-[0.97] disabled:opacity-50
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full justify-between' : 'justify-center'}
        ${className}
      `}
      {...rest}
    >
      <span className="flex-1 text-left">{children}</span>
      {icon && (
        <span className="material-symbols-outlined text-[28px] opacity-90">
          {icon}
        </span>
      )}
    </button>
  )
}
