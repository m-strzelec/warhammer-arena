import { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
