import { Module, Provider } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { Dependencies, DependenciesFactory } from 'src/core/dependencies';
import { ApocalyptizeService } from 'src/core/services/apocalytize.service';
import { NanoidIdGenerator } from 'src/core/gateways/adapters/nanoid-id.generator';
import { ConfigModule } from '@nestjs/config';
import { NestJSConfigGateway } from 'src/core/gateways/adapters/nestjs-config.gateway';
import { StartApocalyptizeCommandHandler } from './handlers/start-apocalytize.handler';

const makeDepenciesProvider = (): Provider[] => {
  return [
    {
      provide: 'DEPENDENCIES',
      useFactory: (config: NestJSConfigGateway): Dependencies =>
        DependenciesFactory.build({
          pictureIdGenerator: new NanoidIdGenerator(),
          notificationIdGenerator: new NanoidIdGenerator(),
          jobIdGenerator: new NanoidIdGenerator(),
          config,
        }),
      inject: [NestJSConfigGateway],
    },
  ];
};

const makeServicesProvider = (): Provider[] => {
  return [
    {
      provide: 'APOCALYPTIZE_SERVICE',
      useFactory: (dependencies): ApocalyptizeService =>
        new ApocalyptizeService(dependencies),
      inject: ['DEPENDENCIES'],
    },
  ];
};

@Module({
  imports: [CqrsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    ...makeDepenciesProvider(),
    ...makeServicesProvider(),
    StartApocalyptizeCommandHandler,
    NestJSConfigGateway,
  ],
})
export class AppModule {}
