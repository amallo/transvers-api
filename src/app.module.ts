import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { makeDispatcherProvider } from './core/dispatchers/adapters/nestjs';

@Module({
  imports: [CqrsModule],
  controllers: [AppController],
  providers: [AppService, makeDispatcherProvider()],
})
export class AppModule {}
