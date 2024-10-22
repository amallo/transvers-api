import { Provider } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NestJsDispatcher } from './nestjs.dispatcher';

export const DISPATCHER_PROVIDER = 'DISPATCHER';

export const makeDispatcherProvider = (): Provider => {
  return {
    provide: DISPATCHER_PROVIDER,
    useFactory: (commandBus: CommandBus) => new NestJsDispatcher(commandBus),
    inject: [CommandBus],
  };
};
