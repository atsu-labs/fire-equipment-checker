import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorMessageProps {
  message: string;
  icon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, icon = false }) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      {icon && <AlertCircle className="h-4 w-4 text-red-600" />}
      <span className="text-red-600">{message}</span>
    </div>
  );
};
