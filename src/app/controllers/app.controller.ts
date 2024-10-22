import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { StartApocalyptizeCommand } from 'src/core/usecases/start-apocalyptize.usecase';

@Controller()
export class AppController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('apocalyptize')
  @UseInterceptors(FileInterceptor('input'))
  apocalyptize(
    @UploadedFile() inputPicture: Express.Multer.File,
  ): Promise<void> {
    return this.commandBus.execute(
      new StartApocalyptizeCommand(inputPicture.stream, 'audie'),
    );
  }
}
