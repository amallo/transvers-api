import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApocalyptizeService } from 'src/core/services/apocalytize.service';
import { StartApocalyptizeCommand } from 'src/core/usecases/start-apocalyptize.usecase';

@CommandHandler(StartApocalyptizeCommand)
export class StartApocalyptizeCommandHandler
  implements ICommandHandler<StartApocalyptizeCommand>
{
  constructor(
    @Inject('APOCALYPTIZE_SERVICE')
    private readonly apocalyptizeService: ApocalyptizeService,
  ) {}

  async execute(command: StartApocalyptizeCommand): Promise<void> {
    return this.apocalyptizeService.start(command);
  }
}
