import { toast, type ToastOptions } from 'react-toastify';

const DEFAULT_ERROR_MESSAGE = 'Hệ thống đang bận. Vui lòng thử lại sau.';

export const successNotification = (
  message: string,
  options: ToastOptions = {}
) => {
  toast.success(message, options);
};

export const errorNotification = (
  message: string,
  options: ToastOptions = {}
) => {
  if (message) {
    const finalMessage =
      typeof message === 'string' && message.trim() !== ''
        ? message
        : DEFAULT_ERROR_MESSAGE;

    toast.error(finalMessage, options);
  }
};

export const infoNotification = (
  message: string,
  options: ToastOptions = {}
) => {
  toast.info(message, options);
};

export const warningNotification = (
  message: string,
  options: ToastOptions = {}
) => {
  toast.warning(message, options);
};
