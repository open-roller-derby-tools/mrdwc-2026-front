import type { ITranslation } from "./custom";

export interface IEvent {
  id: number;
  start_time: string;
  end_time: string;
  translations: IEventTranslation[];
}

export interface IEventTranslation extends ITranslation {
  name: string;
  description: string | null;
}

export interface ILocalizedEvent {
  id: number;
  start_time: string;
  end_time: string;
  name: string;
  description: string | null;
}

export interface IEventsRequestData {
  data: IEvent[];
}
