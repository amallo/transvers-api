import { ConfigGateway } from '../config.gateway';

type Config = {
  filesUrl: string;
};
export class FakeConfigGateway implements ConfigGateway {
  config: Config;

  withConfig(config: Partial<Config>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  get filesUrl() {
    return this.config.filesUrl;
  }
}
