/// <amd-module name="@scom/scom-calendar/interface.ts" />
declare module "@scom/scom-calendar/interface.ts" {
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
    export interface ICalendar {
        events?: IEvent[];
    }
    export interface IPos {
        x: number;
        y: number;
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
/// <amd-module name="@scom/scom-calendar/common/select.css.ts" />
declare module "@scom/scom-calendar/common/select.css.ts" {
    export const transitionStyle: string;
}
/// <amd-module name="@scom/scom-calendar/common/select.tsx" />
declare module "@scom/scom-calendar/common/select.tsx" {
    import { Module, ControlElement, Container, Control } from '@ijstech/components';
    interface ScomCalendarSelectElement extends ControlElement {
        date?: string;
        onChanged?: (date: string) => void;
        onClose?: () => void;
    }
    interface ISelect {
        date: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar--select"]: ScomCalendarSelectElement;
            }
        }
    }
    export class ScomCalendarSelect extends Module {
        private lbDate;
        private dateStack;
        private yearStack;
        private monthStack;
        private yearMap;
        private monthMap;
        private dateMap;
        private initialDate;
        private _data;
        private pos1;
        private pos2;
        private yearList;
        private monthList;
        private dateList;
        private newDate;
        private isAnimating;
        onChanged: (date: string) => void;
        onClose: () => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarSelectElement, parent?: Container): Promise<ScomCalendarSelect>;
        get date(): string;
        set date(value: string);
        private get daysInMonth();
        private get initialData();
        setData(data: ISelect): void;
        clear(): void;
        private renderUI;
        private renderDateList;
        private renderMonthList;
        private renderYearList;
        private getPrev;
        private getNext;
        private renderCurrent;
        private onCloseSelect;
        private onChangedSelect;
        private dragStartHandler;
        private dragHandler;
        private dragEndHandler;
        private onScroll;
        _translate(x: number, y: number, parentStack: Control): void;
        animateFn(destX: number, destY: number, duration: number, parentStack: Control): void;
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/index.ts" />
declare module "@scom/scom-calendar/common/index.ts" {
    export { ScomCalendarSelect } from "@scom/scom-calendar/common/select.tsx";
}
/// <amd-module name="@scom/scom-calendar/index.css.ts" />
declare module "@scom/scom-calendar/index.css.ts" {
    export const transitionStyle: string;
    export const swipeStyle: string;
    export const monthListStyle: string;
    export const eventSliderStyle: string;
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
    type callbackType = (data: IEvent, event: MouseEvent) => void;
    interface ScomCalendarElement extends ControlElement {
        events?: IEvent[];
        onFilter?: (data?: any) => void;
        onItemClicked?: callbackType;
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
        private selectEl;
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
        private initalDay;
        private currentMonth;
        private _events;
        onFilter: (data?: any) => void;
        onItemClicked: callbackType;
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
        private handleEventClick;
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
        private onChangeDate;
        init(): void;
        render(): void;
    }
}
