/// <amd-module name="@scom/scom-calendar/interface.ts" />
declare module "@scom/scom-calendar/interface.ts" {
    export interface IDate {
        date: number;
        month: number;
        year: number;
        day?: number;
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
        private inputAdd;
        private pnlDates;
        private pnlSelected;
        private eventSlider;
        private datesMap;
        private gridMap;
        private selectedMap;
        private initialDate;
        private currentDate;
        private filteredData;
        private pos1;
        private pos2;
        private oldMonth;
        private datePnlHeight;
        private isVerticalSwiping;
        private _events;
        onFilter: (data?: any) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarElement, parent?: Container): Promise<ScomCalendar>;
        get events(): IEvent[];
        set events(value: IEvent[]);
        private isCurrentDate;
        private get datesInMonth();
        private get calendarData();
        private getDates;
        private daysInMonth;
        private getEventByStartDate;
        private getEvents;
        private getHoliday;
        setData({ events }: {
            events: IEvent[];
        }): void;
        private renderUI;
        clear(): void;
        private renderHeader;
        private renderMonth;
        private renderEvent;
        private renderHoliday;
        private renderEventSlider;
        private renderSliderItem;
        private renderSelectedEvent;
        private renderSelectedHoliday;
        private onDateClick;
        private updateOldDate;
        private updateNewDate;
        private updateDatesHeight;
        private onNextMonth;
        private onPrevMonth;
        private onFilterData;
        private onAddEvent;
        private onSlideChanged;
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        dragStartHandler(event: MouseEvent | TouchEvent): void;
        dragHandler(event: MouseEvent | TouchEvent): void;
        dragEndHandler(event: MouseEvent | TouchEvent): void;
        init(): void;
        render(): void;
    }
}
