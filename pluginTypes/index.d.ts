/// <amd-module name="@scom/scom-calendar/interface.ts" />
declare module "@scom/scom-calendar/interface.ts" {
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
}
/// <amd-module name="@scom/scom-calendar/data/holidays.json.ts" />
declare module "@scom/scom-calendar/data/holidays.json.ts" {
    const _default: {
        country: string;
        iso: string;
        year: number;
        date: string;
        day: string;
        name: string;
        type: string;
    }[];
    export default _default;
}
/// <amd-module name="@scom/scom-calendar/index.css.ts" />
declare module "@scom/scom-calendar/index.css.ts" {
    export const transitionStyle: string;
    export const swipeStyle: string;
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
        private pnlWrapper;
        private gridHeader;
        private listStack;
        private lbMonth;
        private lbYear;
        private selectedDate;
        private pnlSelected;
        private inputAdd;
        private pnlDates;
        private datesMap;
        private gridMap;
        private eventsMap;
        private selectedMap;
        private initialDate;
        private currentDate;
        private _events;
        private filteredData;
        private pos1;
        private pos2;
        private selectedMonth;
        private selectedString;
        onFilter: (data?: any) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarElement, parent?: Container): Promise<ScomCalendar>;
        get events(): IEvent[];
        set events(value: IEvent[]);
        private isCurrentDate;
        setData({ events }: {
            events: IEvent[];
        }): void;
        private renderHeader;
        private renderMonth;
        private renderEvent;
        private renderHoliday;
        private renderSelected;
        private renderSelectedEvent;
        private renderSelectedHoliday;
        private getDates;
        private daysInMonth;
        private getEventByStartDate;
        private getEvents;
        private getHoliday;
        private onDateClick;
        private updateSelected;
        private resetSelectedDate;
        private onNextMonth;
        private onPrevMonth;
        private onNextDay;
        private onPrevDay;
        private onFilterData;
        private onAddEvent;
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        dragStartHandler(event: MouseEvent | TouchEvent): void;
        dragHandler(event: MouseEvent | TouchEvent): void;
        dragEndHandler(event: MouseEvent | TouchEvent): void;
        dragSelectedEndHandler(event: MouseEvent | TouchEvent): void;
        updateHeight(): void;
        init(): void;
        render(): void;
    }
}
