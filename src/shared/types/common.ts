export interface BaseProps {
  className?: string;
}

export interface BasePropsWithChildren extends BaseProps {
  children?: React.ReactNode;
}
