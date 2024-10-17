import { Handler } from 'src/core/handlers/handler';
import { Dispatcher } from '../dispatcher';

export class FakeDispatcher implements Dispatcher {
  private dispatched: unknown[] = [];
  private handlers = new Map<unknown, Handler<unknown>>();

  async dispatch(command: unknown): Promise<void> {
    this.dispatched.push(command);
    const handler = this.handlers.get(command.constructor);
    if (handler) {
      await handler.handle(command);
    }
  }

  registerHandler(type: any, handler: Handler<unknown>): void {
    this.handlers.set(type, handler);
  }
}
