import { createElement, memo, useMemo, useState } from 'react';
import { ModalProps } from '@mantine/core';
import { closeModal, useModalsEvents, ModalPayload, ModalsEvents } from '@/utils/modals';

export interface ModalState extends ModalPayload<ModalProps> {
  id: number;
  opened: boolean;
}

let count = 0;

function ModalAnchorComponent() {
  const [modals, setModals] = useState<ModalState[]>([]);

  const events = useMemo(() => {
    const set = (ss: ModalState[], idx: number, overrides: Partial<ModalState>) => {
      const state = ss[idx];
      const updated: ModalState = { ...state, ...overrides };
      return [...ss.slice(0, idx), updated, ...ss.slice(idx + 1)];
    };

    const events: ModalsEvents = {
      openModal: payload => {
        let id = count;

        setModals(ss => {
          const idx = ss.findIndex(i => i.component === payload.component);

          // not exists, add to `modals`
          if (idx === -1) {
            count = count + 1;
            id = count;
            const i = ss.length;

            const newState = [...ss, { id, ...payload, opened: false } as ModalState];

            // timeout make sure enter transition works
            setTimeout(() => setModals(m => set(m, i, { opened: true })));

            return newState;
          }

          return set(ss, idx, { opened: true, props: payload.props });
        });

        return id;
      },
      closeModal: payload =>
        setModals(m =>
          m.map(i => {
            const match = typeof payload === 'number' ? i.id === payload : i.component === payload;
            return match ? { ...i, opened: false } : i;
          })
        ),
      closeAllModals: () => setModals([])
    };
    return events;
  }, []);

  useModalsEvents(events);

  const nodes = modals.map(({ id, component, props, opened }) =>
    createElement(component, {
      ...props,
      key: id,
      opened,
      onClose: () => {
        props?.onClose?.();
        closeModal(id);
      },
      transitionProps: {
        onExited: () => {
          props?.transitionProps?.onExited?.();
          props?.keepMounted !== true && setModals(m => m.filter(i => i.id !== id));
        }
      }
    } satisfies ModalProps)
  );

  return nodes;
}

export const ModalAnchor = memo(ModalAnchorComponent);
