import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface OrderProcessingLoaderProps {
  message?: string;
  className?: string;
}

export default function OrderProcessingLoader({ 
  message = "Votre commande est en cours de création...",
  className = ""
}: OrderProcessingLoaderProps) {
  return (
    <div className={`bg-white shadow sm:rounded-lg ${className}`}>
      <div className="px-4 py-8 sm:p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous traitons votre commande.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 