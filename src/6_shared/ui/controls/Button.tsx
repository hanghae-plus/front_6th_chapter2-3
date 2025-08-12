import { cva, VariantProps } from 'class-variance-authority';

/**
 * 버튼 컴포넌트 variant 정의
 * - CVA를 사용한 조건부 스타일링
 * - variant: 용도별 스타일 (default, destructive, outline, secondary, ghost, link)
 * - size: 크기별 스타일 (default, sm, lg, icon)
 * - 접근성 기본 스타일 포함 (focus-visible, disabled)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline:
          'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        link: 'underline-offset-4 hover:underline text-blue-500',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 rounded-md text-xs',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};
