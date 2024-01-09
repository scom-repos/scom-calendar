/// <amd-module name="@scom/scom-calendar/interface.ts" />
declare module "@scom/scom-calendar/interface.ts" {
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
        evenst?: IEvent[];
    }
}
/// <amd-module name="@scom/scom-calendar/index.css.ts" />
declare module "@scom/scom-calendar/index.css.ts" {
    export const transitionStyle: string;
    export const aspectRatioStyle: string;
    export const closeIconStyle: string;
}
/// <amd-module name="@scom/scom-calendar" />
declare module "@scom/scom-calendar" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IEvent } from "@scom/scom-calendar/interface.ts";
    import "@scom/scom-calendar/index.css.ts";
    interface ScomCalendarElement extends ControlElement {
        events?: IEvent[];
        onFilter?: (data?: any) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar"]: ScomCalendarElement;
            }
        }
    }
    export default class ScomCalendar extends Module {
        private gridHeader;
        private listStack;
        private lbMonth;
        private lbYear;
        private selectedDate;
        private pnlSelected;
        private pnlNotSelected;
        private gridEvents;
        private dayMap;
        private datesMap;
        private initialDate;
        private currentDate;
        private _events;
        private filteredData;
        onFilter: (data?: any) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarElement, parent?: Container): Promise<ScomCalendar>;
        get events(): IEvent[];
        set events(value: IEvent[]);
        setData({ events }: {
            events: IEvent[];
        }): void;
        private isCurrentDate;
        private renderHeader;
        private renderMonth;
        private renderSelected;
        private getDates;
        private daysInMonth;
        private hasData;
        private onDateClick;
        private onCloseClick;
        private resetSelectedDate;
        private onNext;
        private onPrev;
        private onCurrent;
        private onFilterData;
        init(): void;
        render(): void;
    }
}
