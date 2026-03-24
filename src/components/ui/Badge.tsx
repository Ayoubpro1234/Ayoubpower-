import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  children?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-black text-white border-black',
    secondary: 'bg-zinc-100 text-black border-black',
    outline: 'bg-transparent text-black border-black',
    destructive: 'bg-red-500 text-white border-black',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-2 px-2.5 py-0.5 text-xs font-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
