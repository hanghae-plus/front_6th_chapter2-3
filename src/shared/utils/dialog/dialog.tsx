import { useSyncExternalStore } from 'react';
import type { ComponentType } from 'react';

type DialogEntry<Props extends object = any> = {
  id: number;
  Component: ComponentType<Props>;
  props: Props;
};

type Listener = () => void;

class DialogStore {
  private dialogs: DialogEntry[] = [];
  private listeners = new Set<Listener>();
  private nextId = 1;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.dialogs;

  private emit() {
    this.listeners.forEach((l) => l());
  }

  open<Props extends object>(Component: ComponentType<Props>, props: Props) {
    const id = this.nextId++;
    this.dialogs = [...this.dialogs, { id, Component, props } as DialogEntry];
    this.emit();
    return id;
  }

  close(target?: number | ComponentType<any>) {
    if (typeof target === 'number') {
      this.dialogs = this.dialogs.filter((d) => d.id !== target);
      this.emit();
      return;
    }
    if (target) {
      this.dialogs = this.dialogs.filter((d) => d.Component !== target);
      this.emit();
      return;
    }
    // close all
    if (this.dialogs.length > 0) {
      this.dialogs = [];
      this.emit();
    }
  }
}

const store = new DialogStore();

export function useDialog() {
  return {
    open: store.open.bind(store) as <Props extends object>(
      Component: ComponentType<Props>,
      props: Props,
    ) => number,
    close: store.close.bind(store) as (target?: number | ComponentType<any>) => void,
  };
}

function useDialogEntries() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function DialogPortal() {
  const dialogs = useDialogEntries();
  return (
    <>
      {dialogs.map((entry) => {
        const Comp = entry.Component as ComponentType<any>;
        return <Comp key={entry.id} {...(entry.props as any)} />;
      })}
    </>
  );
}
