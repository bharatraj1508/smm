import classNames from "classnames";
import { HTMLAttributes, ReactNode } from "react";

type FormControlProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
  error?: string;
};

export default function FormControl({
  label,
  error,
  children,
  className,
  ...props
}: FormControlProps) {
  return (
    <div {...props} className={classNames(className)}>
      {label}
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
