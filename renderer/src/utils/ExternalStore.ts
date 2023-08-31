export class ExternalStore<R> {
  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
  }

  protected snapshot: R;
  protected listeners: (() => void)[] = [];
  protected emitChange() {
    this.listeners.forEach(notify => notify());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getSnapshot() {
    return this.snapshot;
  }
}
