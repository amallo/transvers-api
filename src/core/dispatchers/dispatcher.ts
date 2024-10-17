export interface Dispatcher {
  dispatch<E>(event: E): Promise<void>;
}
