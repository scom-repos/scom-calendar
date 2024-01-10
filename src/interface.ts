export interface IDate {
  date: number;
  month: number;
  year: number;
}

export interface IEvent {
  type?: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  location?: string;
  description?: string;
}

export interface ICalendar {
  events?: IEvent[];
}
