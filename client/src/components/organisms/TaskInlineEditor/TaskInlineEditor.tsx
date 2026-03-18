import { useState, useRef, useEffect } from 'react';
import { InlineInput } from './TaskInlineEditor.styled';

interface TaskInlineEditorProps {
  placeholder?: string;
  initialValue?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export function TaskInlineEditor({
  placeholder = 'Title...',
  initialValue = '',
  onCommit,
  onCancel,
}: TaskInlineEditorProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const v = value.trim();
    if (v) onCommit(v);
    else onCancel();
  };

  return (
    <InlineInput
      bare
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') submit();
        if (e.key === 'Escape') onCancel();
      }}
      onBlur={submit}
      placeholder={placeholder}
    />
  );
}
