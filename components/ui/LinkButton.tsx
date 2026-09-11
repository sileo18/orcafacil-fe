import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassNames, type ButtonSize, type ButtonVariant } from "./Button";

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** <Link> estilizado como botão — evita aninhar <button> dentro de <a>. */
export function LinkButton({ variant, size, fullWidth, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClassNames({ variant, size, fullWidth, className })} {...props} />;
}
