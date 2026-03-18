import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Loader, LoadingWrap, StyledButton, StartIconWrap, EndIconWrap, TextWrap } from './Button.styled';

type ClickHandler = MouseEventHandler<HTMLButtonElement> | Array<() => void>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'style'> {
  variant?: 'default' | 'ghost' | 'dashed';
  active?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** When true, replace button text with a loader spinner. */
  loading?: boolean;
  /** Optional aria-label when loading. */
  loadingAriaLabel?: string;
  classNames?: {
    root?: string;
    startIcon?: string;
    text?: string;
    endIcon?: string;
    active?: string;
  };
  className?: string;
  style?: CSSProperties;
  onClick?: ClickHandler;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'default',
    active = false,
    startIcon,
    endIcon,
    classNames = {},
    className,
    style,
    onClick,
    loading = false,
    loadingAriaLabel,
    disabled: disabledProp,
    children,
    type,
    ...rest
  },
  ref
) {
  const computedDisabled = loading ? true : disabledProp;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;
    if (loading) return;
    if (Array.isArray(onClick)) onClick.forEach((fn) => fn());
    else onClick(e);
  };

  const rootClassName = [classNames.root, className, active ? classNames.active : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <StyledButton
      ref={ref}
      type={type ?? 'button'}
      $variant={variant}
      data-active={active ? 'true' : 'false'}
      className={rootClassName || undefined}
      style={style}
      onClick={handleClick}
      disabled={computedDisabled}
      {...rest}
    >
      {startIcon && (
        <StartIconWrap className={classNames.startIcon} aria-hidden>
          {startIcon}
        </StartIconWrap>
      )}
      {loading ? (
        <LoadingWrap aria-label={loadingAriaLabel}>
          <Loader />
        </LoadingWrap>
      ) : children ? (
        <TextWrap className={classNames.text}>{children}</TextWrap>
      ) : null}
      {endIcon && (
        <EndIconWrap className={classNames.endIcon} aria-hidden>
          {endIcon}
        </EndIconWrap>
      )}
    </StyledButton>
  );
});
