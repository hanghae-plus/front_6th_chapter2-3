interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
}

function CardHeader({ className = '', ...props }: CardProps) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

function CardTitle({ className = '', ...props }: CardTitleProps) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
  );
}

function CardContent({ className = '', ...props }: CardProps) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;

export { Card };
