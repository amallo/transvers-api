import { Dispatcher } from '../dispatcher';

export class FakeDispatcher implements Dispatcher {
  private dispatched: any[] = [];
  private handlers = new Map();

  async dispatch(command: any): Promise<void> {
    this.dispatched.push(command);
    const handler = this.handlers.get(command.constructor);
    if (handler) {
      await handler.handle(command);
    }
  }

  registerHandler(type: any, handler: any): void {
    this.handlers.set(type, handler);
  }
}
