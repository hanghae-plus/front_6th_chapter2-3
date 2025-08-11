import { forwardRef } from 'react';
import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>{
  className?: string
  ref?: React.Ref<HTMLDivElement>
}


const CardRoot = ({ className, ...props }: CardProps) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: CardProps) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: CardProps) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  />
);

const CardContent = ({ className, ...props }: CardProps) => (
  <div
    className={`p-6 pt-0 ${className || ''}`}
    {...props}
  />
);

// ============================================
// 컴파운드 패턴 구성
// ============================================
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
});

// 개별 export도 제공 (하위 호환성)
export { CardHeader, CardTitle, CardContent };
