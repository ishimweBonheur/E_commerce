import toast, { ToastPosition } from 'react-hot-toast';

const customToastOptions = {
  duration: 3000,
  position: 'top-center' as ToastPosition,
  style: {
    background: '#fff',
    color: '#333',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...customToastOptions,
    id: message,
    style: {
      ...customToastOptions.style,
      background: '#f0fdf4',
      color: '#166534',
    },
    icon: '✅',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...customToastOptions,
    id: message,
    style: {
      ...customToastOptions.style,
      background: '#fef2f2',
      color: '#991b1b',
    },
    icon: '❌',
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    ...customToastOptions,
    id: message,
    style: {
      ...customToastOptions.style,
      background: '#eff6ff',
      color: '#1e40af',
    },
    icon: 'ℹ️',
  });
};
