interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`${sizeMap[size]} rounded-full border-ink-500 border-t-azure animate-spin ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-mist-500 text-sm font-sans">Carregando...</p>
    </div>
  )
}
