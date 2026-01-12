import { SelectHTMLAttributes, forwardRef } from 'react';
import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  // onChange receives a synthetic event-like object with target.value
  onChange?: (e: { target: { value: string } }) => void;
  // support react-hook-form register props
  name?: string;
  onBlur?: () => void;
  ref?: any;
}

export default function Select({ label, error, options, value = '', placeholder = 'Select...', onChange, name, onBlur, ref }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight || 200;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    // open upward if not enough space below and enough space above
    setOpenUp(spaceBelow < menuHeight && spaceAbove > menuHeight);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        ref={triggerRef}
        onClick={(e) => { e.stopPropagation(); setOpen((s) => !s); }}
        className={`w-full px-3 py-2 border-2 rounded-lg bg-white text-left flex items-center justify-between focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-primary-300 hover:border-primary-500'}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg className="h-4 w-4 text-gray-500 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className={`absolute left-0 w-full mt-2 z-40 ${openUp ? 'bottom-full mb-2' : ''}`}
          style={{
            top: openUp ? undefined : '100%',
          }}
        >
          <div className="bg-white border-2 border-primary-100 rounded-lg shadow-lg max-h-56 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onChange) onChange({ target: { value: opt.value } });
                  if (onBlur) onBlur();
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors ${value === opt.value ? 'bg-primary-50 font-medium' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {/* Hidden input for react-hook-form compatibility (ref, name) */}
      {name && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <input type="hidden" name={name} value={value} ref={ref} />
      )}
    </div>
  );
}
