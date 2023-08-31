// import { NotificationProps } from '@mantine/core';
import { notifications as ns, NotificationProps } from '@mantine/notifications';

export const notifications = {
  success(options: Partial<NotificationProps>) {
    ns.show({
      title: 'Success',
      withBorder: true,
      withCloseButton: true,
      autoClose: 3 * 1000,
      color: 'teal',
      message: '',
      ...options
    });
  },
  error(options: Partial<NotificationProps>) {
    ns.show({
      title: 'Error',
      withBorder: true,
      withCloseButton: true,
      autoClose: 10 * 1000,
      color: 'red',
      message: '',
      ...options
    });
  },
  onError(options: Partial<NotificationProps>) {
    return (error: unknown) => {
      console.error(error);
      if (!options.message && error instanceof Error) {
        options.message = error.message;
      }
      this.error(options);
    };
  }
};
