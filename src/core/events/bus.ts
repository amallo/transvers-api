export interface Bus {
  publish<E>(event: E): void;
}
