export interface Dispatcher {
  dispatch(event: any): Promise<void>;
}
