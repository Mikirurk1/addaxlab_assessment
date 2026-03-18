import type { FormHTMLAttributes, ReactNode } from 'react';
import { FormRoot, FormSection, FormLabel, FormRow, FormActions } from './FormLayout.styled';

export function Form(props: FormHTMLAttributes<HTMLFormElement>) {
  return <FormRoot {...props} />;
}

export function FormGroup({
  label,
  children,
}: {
  label?: ReactNode;
  children: ReactNode;
}) {
  return (
    <FormSection>
      {label ? <FormLabel>{label}</FormLabel> : null}
      {children}
    </FormSection>
  );
}

export function FormGridRow({ children }: { children: ReactNode }) {
  return <FormRow>{children}</FormRow>;
}

export function FormButtonsRow({ children }: { children: ReactNode }) {
  return <FormActions>{children}</FormActions>;
}

