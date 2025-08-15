import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const LoadingSpinner = ({
  size = 'md',
  className = '',
  text = '로딩 중...',
}: LoadingSpinnerProps) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 w-full h-full ${className}`}
    >
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className='text-sm text-muted-foreground'>{text}</span>}
    </div>
  );
};
