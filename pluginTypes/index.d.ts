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
        link?: string;
        conferenceId?: string;
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
/// <amd-module name="@scom/scom-calendar/assets.ts" />
declare module "@scom/scom-calendar/assets.ts" {
    function fullPath(path: string): string;
    const _default_1: {
        fullPath: typeof fullPath;
    };
    export default _default_1;
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
        private selectedMonth;
        private datesMap;
        private monthsMap;
        private selectedMap;
        private initialDate;
        private currentDate;
        private filteredData;
        private pos1;
        private pos2;
        private oldMonth;
        private datePnlHeight;
        private isVerticalSwiping;
        private isHorizontalSwiping;
        private viewMode;
        private isInitialWeek;
        private initalDay;
        private currentMonth;
        private _events;
        onFilter: (data?: any) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarElement, parent?: Container): Promise<ScomCalendar>;
        get events(): IEvent[];
        set events(value: IEvent[]);
        private isCurrentDate;
        private get initialData();
        private get monthKey();
        private get datesInMonth();
        private get calendarData();
        private get isWeekMode();
        private getDates;
        private daysInMonth;
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
        private onMonthChanged;
        private onFilterData;
        private onSlideChanged;
        private onSelectedDateChanged;
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        private dragStartHandler;
        private dragHandler;
        private dragEndHandler;
        private animateFn;
        onSwipeFullMonth(direction?: 1 | -1): void;
        onSwipeMonthEvents(): void;
        onSwipeWeek(direction?: 1 | -1): void;
        private activeDateWeek;
        private updateMonthUI;
        private onScroll;
        init(): void;
        render(): void;
    }
}
