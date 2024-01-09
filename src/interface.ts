export interface IDate {
  date: number;
  month: number;
  year: number;
}

export interface IEvent {
  title: string;
  startDate: string;
  endDate: string;
}

export interface ICalendar {
  events?: IEvent[];
}
