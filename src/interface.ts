export interface IDate {
  date: number;
  month: number;
  year: number;
  day?: number;
}

export interface IEvent {
  title: string;
  startDate: number;
  endDate: number;
  color?: string;
  location?: string;
  description?: string;
  link?: string;
  data?: any;
}

export interface IHoliday {
  country: string,
  iso: string,
  year: number,
  date: string
  day: string,
  name: string,
  type: string
}

export interface ICalendar {
  events?: IEvent[];
}

export interface IPos {
  x: number;
  y: number;
}

export interface ISelectOption {
  text: string;
  value: number;
}

export type IViewMode = 'month' | 'week' | 'full';
