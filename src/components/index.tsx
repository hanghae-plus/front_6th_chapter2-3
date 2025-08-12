/**
 * 공통 UI 컴포넌트 라이브러리
 *
 * 역할:
 * - 애플리케이션 전반에서 사용되는 재사용 가능한 UI 컴포넌트들을 정의
 * - Radix UI 기반의 접근성이 보장된 헤드리스 컴포넌트들을 커스터마이징
 * - 일관된 디자인 시스템과 variant 기반 스타일링 제공
 *
 * 주요 컴포넌트:
 * 1. Button: variant와 size를 지원하는 버튼 컴포넌트
 * 2. Input/Textarea: 폼 입력 컴포넌트들
 * 3. Card 계열: 콘텐츠 컨테이너 컴포넌트들
 * 4. Select 계열: 드롭다운 선택 컴포넌트들
 * 5. Dialog 계열: 모달 및 팝업 컴포넌트들
 * 6. Table 계열: 데이터 테이블 컴포넌트들
 *
 * 로직:
 * - CVA(Class Variance Authority)를 통한 variant 기반 스타일 관리
 * - forwardRef를 통한 ref 전달로 접근성 및 포커스 관리 지원
 * - Radix UI의 복합 컴포넌트 패턴을 따른 조합 가능한 컴포넌트 구조
 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as SelectPrimitive from '@radix-ui/react-select';

import * as React from 'react';
import { forwardRef } from 'react';

import { VariantProps, cva } from 'class-variance-authority';
import { Check, ChevronDown, X } from 'lucide-react';

/**
 * 버튼 컴포넌트 variant 정의
 * - CVA를 사용한 조건부 스타일링
 * - variant: 용도별 스타일 (default, destructive, outline, secondary, ghost, link)
 * - size: 크기별 스타일 (default, sm, lg, icon)
 * - 접근성 기본 스타일 포함 (focus-visible, disabled)
 */
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

/**
 * 입력 컴포넌트
 * - 기본 HTML input 요소를 확장한 커스텀 입력 컴포넌트
 * - 일관된 스타일링과 접근성 기능 제공
 * - forwardRef를 통한 ref 전달로 포커스 관리 지원
 */
export const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

/**
 * 카드 컴포넌트 계열
 * - 콘텐츠를 그룹화하고 시각적으로 구분하는 컨테이너 컴포넌트들
 * - Card, CardHeader, CardTitle, CardContent로 구성된 복합 컴포넌트
 * - 일관된 간격과 스타일을 통한 계층적 정보 표현
 */
export const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * 텍스트 영역 컴포넌트
 * - 여러 줄 텍스트 입력을 위한 textarea 컴포넌트
 * - Input 컴포넌트와 일관된 스타일링 유지
 * - 최소 높이 설정으로 사용성 향상
 */
export const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[150px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

/**
 * 선택 컴포넌트 계열
 * - Radix UI Select를 기반으로 한 드롭다운 선택 컴포넌트들
 * - Select, SelectTrigger, SelectContent, SelectItem으로 구성
 * - 키보드 네비게이션과 접근성 기능 내장
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={`flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className='h-4 w-4 opacity-50' />
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = forwardRef(
  ({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className='p-1'>
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      {...props}
    >
      <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <Check className='h-4 w-4' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * 대화상자 컴포넌트 계열
 * - Radix UI Dialog를 기반으로 한 모달 및 팝업 컴포넌트들
 * - Dialog, DialogContent, DialogHeader, DialogTitle로 구성
 * - 포커스 트랩, ESC 키 닫기, 오버레이 클릭 닫기 등 UX 기능 내장
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Overlay;

export const DialogContent = forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay className='fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
          <X className='h-4 w-4' />
          <span className='sr-only'>닫기</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * 테이블 컴포넌트 계열
 * - 데이터를 구조화된 표 형태로 표시하는 컴포넌트들
 * - Table, TableHeader, TableBody, TableRow, TableHead, TableCell로 구성
 * - 반응형 스크롤 지원과 일관된 스타일링 제공
 */
export const Table = forwardRef(({ className, ...props }, ref) => (
  <div className='w-full overflow-auto'>
    <table
      ref={ref}
      className={`table-fixed w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

export const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className}`}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
));
TableCell.displayName = 'TableCell';
