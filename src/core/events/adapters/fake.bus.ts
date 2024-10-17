import { Handler } from 'src/core/handlers/handler';
import { Bus } from '../bus';

export class FakeBus implements Bus {
  private events: any[] = [];
  private handlers = new Map<unknown, Handler<unknown>>();
  async publish<E>(event: E): Promise<void> {
    this.events.push(event);
    const handler = this.handlers.get(event.constructor);
    if (handler) {
      await handler.handle(event);
    }
  }
  register(event: any, handler: Handler<unknown>): void {
    this.handlers.set(event, handler);
  }
}
