import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ControlInput, ControlTextarea, Error, Hint, Label, Root } from './Field.styled';

type SharedProps = {
  label?: string;
  hint?: string;
  error?: string;
  variant?: 'default' | 'header';
  bare?: boolean;
  classNames?: {
    root?: string;
    label?: string;
    input?: string;
    hint?: string;
    error?: string;
  };
  className?: string;
  id?: string;
};

type InputProps = SharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
    as?: 'input';
  };

type TextareaProps = SharedProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
    as: 'textarea';
  };

export type FieldProps = InputProps | TextareaProps;

export const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldProps>(function Field(
  { label, hint, error, variant = 'default', bare = false, classNames = {}, className, as, id: idProp, ...rest },
  ref
) {
  const generatedId = useId();
  const isTextarea = as === 'textarea';
  const id =
    idProp ??
    (label ? `field-${label.replace(/\s+/g, '-').toLowerCase()}` : generatedId);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errorId, hint && !error && hintId].filter(Boolean).join(' ') || undefined;

  return (
    <Root
      $bare={bare}
      className={[classNames.root, className].filter(Boolean).join(' ') || undefined}
    >
      {label && !bare && (
        <Label htmlFor={id} className={classNames.label}>
          {label}
        </Label>
      )}

      {isTextarea ? (
        <ControlTextarea
          {...(rest as TextareaProps)}
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-variant={variant}
          className={classNames.input}
        />
      ) : (
        <ControlInput
          {...(rest as InputProps)}
          id={id}
          ref={ref as React.Ref<HTMLInputElement>}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-variant={variant}
          className={classNames.input}
        />
      )}

      {error && !bare && (
        <Error id={errorId} role="alert" className={classNames.error}>
          {error}
        </Error>
      )}
      {hint && !error && !bare && (
        <Hint id={hintId} className={classNames.hint}>
          {hint}
        </Hint>
      )}
    </Root>
  );
});

