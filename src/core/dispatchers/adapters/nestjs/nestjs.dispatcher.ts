import { CommandBus } from '@nestjs/cqrs';
import { Dispatcher } from '../../dispatcher';

export class NestJsDispatcher implements Dispatcher {
  constructor(private commandBus: CommandBus) {}
  dispatch<E>(event: E): Promise<void> {
    return this.commandBus.execute(event);
  }
}
