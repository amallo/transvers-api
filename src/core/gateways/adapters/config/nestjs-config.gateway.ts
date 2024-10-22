import { ConfigService } from '@nestjs/config';
import { ConfigGateway } from '../../config.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestJSConfigGateway implements ConfigGateway {
  constructor(private configService: ConfigService) {}
  get filesUrl(): string {
    return this.configService.get('FILES_BASE_URL');
  }
}
