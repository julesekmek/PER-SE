import React from 'react';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
            type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <div className={`text-2xl ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>⚠️</div>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">{title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              variant={type === 'danger' ? 'danger' : 'warning'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 