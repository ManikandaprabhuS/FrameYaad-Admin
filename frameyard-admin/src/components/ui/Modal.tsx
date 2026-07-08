import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-x-hidden overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      <div
        className={`relative w-full bg-surface-container-lowest border border-outline-variant rounded-t-2xl sm:rounded-xl shadow-2xl z-10 overflow-hidden transform transition-all duration-300 max-h-[92vh] sm:max-h-[90vh] flex flex-col ${sizeClasses}`}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-outline-variant bg-surface-container-low flex-shrink-0">
          <h3 className="text-base font-bold text-on-surface pr-4 truncate">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 p-4 bg-surface border-t border-outline-variant flex-shrink-0 [&>button]:w-full sm:[&>button]:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
