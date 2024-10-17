export interface Handler<E> {
  handle(command: E): Promise<void>;
}
