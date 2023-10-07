import { ModalProps } from '@mantine/core';
import { createUseExternalEvents } from '@mantine/core';

export interface ModalPayload<T extends ModalProps> {
  component: React.ComponentType<Partial<T>>;
  props?: Partial<ModalProps>;
}

export type ModalsEvents = {
  openModal<T extends ModalProps>(context: ModalPayload<T>): number;
  closeModal(payload: number | React.ComponentType<Partial<ModalProps>>): void;
  closeAllModals(): void;
};

export const [useModalsEvents, createEvent] = createUseExternalEvents<ModalsEvents>('menu-modals');

export const openModal = createEvent('openModal');
export const closeModal = createEvent('closeModal');
export const closeAllModals = createEvent('closeAllModals');

export const createModalHandler = <T extends ModalProps>(c: React.ComponentType<T>) => {
  const component = c as React.ComponentType<Partial<ModalProps>>;
  const open = (props?: Omit<T, 'opened' | 'onClose'> & Partial<ModalProps>) => openModal({ props, component });
  const close = () => closeModal(component);
  return [open, close];
};
