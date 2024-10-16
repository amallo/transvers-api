export interface Dispatcher {
  dispatch(event: any): Promise<void>;
  registerHandler(eventType: any, handler: any): void;
}
