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
    export interface IHoliday {
        country: string;
        iso: string;
        year: number;
        date: string;
        day: string;
        name: string;
        type: string;
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
    export const selectorStyles: string;
}
/// <amd-module name="@scom/scom-calendar/common/view.css.ts" />
declare module "@scom/scom-calendar/common/view.css.ts" {
    export const transitionStyle: string;
    export const swipeStyle: string;
    export const eventSliderStyle: string;
    export interface IViewStyle {
        event: any;
        border: string;
        month: any;
        week: any;
    }
    export const getViewStyle: (value: IViewStyle) => string;
}
/// <amd-module name="@scom/scom-calendar/assets.ts" />
declare module "@scom/scom-calendar/assets.ts" {
    function fullPath(path: string): string;
    const _default_1: {
        fullPath: typeof fullPath;
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-calendar/common/view.tsx" />
declare module "@scom/scom-calendar/common/view.tsx" {
    import { Module, Container, ControlElement, Control } from '@ijstech/components';
    import { IEvent, IHoliday, IViewMode } from "@scom/scom-calendar/interface.ts";
    type callbackType = (data: IEvent, event: MouseEvent) => void;
    type swipeCallbackType = () => boolean;
    type selectCallbackType = (date: string) => void;
    type onMonthChangedCallbackType = (value: {
        month: number;
        year: number;
    }) => void;
    type onMonthRenderCallbackType = () => void;
    interface ScomCalendarViewElement extends ControlElement {
        loadingSpinner?: Control;
        holidays?: IHoliday[];
        events?: IEvent[];
        mode?: IViewMode;
        date?: string;
        isPicker?: boolean;
        onEventClicked?: callbackType;
        onDateClicked?: selectCallbackType;
        onSwiping?: swipeCallbackType;
        onMonthChanged?: onMonthChangedCallbackType;
    }
    interface IViewData {
        holidays?: IHoliday[];
        events?: IEvent[];
        mode: IViewMode;
        date?: string;
        isPicker?: boolean;
        isMonthEventShown?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar--view"]: ScomCalendarViewElement;
            }
        }
    }
    export class ScomCalendarView extends Module {
        private pnlWrapper;
        private gridHeader;
        private listStack;
        private pnlSelectedDate;
        private pnlDates;
        private pnlSelected;
        private eventSlider;
        private datesMap;
        private monthsMap;
        private selectedMap;
        private initialDate;
        private currentDate;
        private oldMonth;
        private initalDay;
        private currentMonth;
        private currentStyle;
        private selectedDate;
        private _loadingSpinner;
        private _data;
        onEventClicked: callbackType;
        onDateClicked: selectCallbackType;
        onSwiping: swipeCallbackType;
        onMonthChanged: onMonthChangedCallbackType;
        OnMonthRenderStart: onMonthRenderCallbackType;
        OnMonthRenderEnd: onMonthRenderCallbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarViewElement, parent?: Container): Promise<ScomCalendarView>;
        get holidays(): IHoliday[];
        set holidays(value: IHoliday[]);
        get events(): IEvent[];
        set events(value: IEvent[]);
        get mode(): IViewMode;
        set mode(value: IViewMode);
        get date(): string;
        set date(value: string);
        get isPicker(): boolean;
        set isPicker(value: boolean);
        get activeItemScrollTop(): any;
        get isMonthEventShown(): boolean;
        set isMonthEventShown(value: boolean);
        private isCurrentDate;
        private get initialData();
        private get monthKey();
        private get datesInMonth();
        private get isWeekMode();
        private getDatesHeightByMode;
        private getDates;
        private daysInMonth;
        private get calendarData();
        private getEvents;
        private getHoliday;
        setData(data: IViewData): void;
        private renderUI;
        clear(): void;
        private updateStyle;
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
        private onMonthChangedFn;
        private onSlideChanged;
        private onSelectedDateChanged;
        private animateFn;
        onSwipeFullMonth(direction?: number, isStartOfMonth?: boolean): {
            month: number;
            year: number;
        };
        onSwipeMonthEvents(direction?: number, isStartOfMonth?: boolean): void;
        onSwipeWeek(direction?: number, outOfMonth?: boolean): void;
        private activeDateWeek;
        private onScroll;
        private testSupportsSmoothScroll;
        private smoothScroll;
        private smoothScrollPolyfill;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/monthPicker.tsx" />
declare module "@scom/scom-calendar/common/monthPicker.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    interface ScomCalendarMonthPickerElement extends ControlElement {
        date?: string;
        onChanged?: (date: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar--month-picker"]: ScomCalendarMonthPickerElement;
            }
        }
    }
    export class ScomCalendarMonthPicker extends Module {
        private monthView;
        private _date;
        onChanged: (date: string) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarMonthPickerElement, parent?: Container): Promise<ScomCalendarMonthPicker>;
        get date(): string;
        set date(value: string);
        setData(date: string): void;
        private onDateClick;
        onSwipeFullMonth(direction: number): {
            month: number;
            year: number;
        };
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/utils.ts" />
declare module "@scom/scom-calendar/common/utils.ts" {
    export class IosSelector {
        private options;
        halfCount: number;
        quarterCount: number;
        a: number;
        minV: number;
        source: any;
        exceedA: number;
        moveT: number;
        moving: boolean;
        elems: {
            el: any;
            circleList: any;
            circleItems: any;
            highlight: any;
            highlightList: any;
            highListItems: any;
        };
        events: {
            touchstart: any;
            touchmove: any;
            touchend: any;
        };
        itemHeight: number;
        itemAngle: number;
        radius: number;
        scroll: number;
        value: any;
        type: string;
        selected: any;
        onChange: any;
        constructor(options: any);
        _init(): void;
        _touchstart(e: any, touchData: any): void;
        _touchmove(e: any, touchData: any): void;
        _touchend(e: any, touchData: any): void;
        _create(source: any): void;
        /**
         * 对 scroll 取模，eg source.length = 5 scroll = 6.1
         * 取模之后 normalizedScroll = 1.1
         * @param {init} scroll
         * @return 取模之后的 normalizedScroll
         */
        _normalizeScroll(scroll: any): any;
        /**
         * 定位到 scroll，无动画
         * @param {init} scroll
         * @return 返回指定 normalize 之后的 scroll
         */
        _moveTo(scroll: any): any;
        /**
         * 以初速度 initV 滚动
         * @param {init} initV， initV 会被重置
         * 以根据加速度确保滚动到整数 scroll (保证能通过 scroll 定位到一个选中值)
         */
        _animateMoveByInitV(initV: any): Promise<void>;
        _animateToScroll(initScroll: any, finalScroll: any, t: any, easingName?: string): Promise<void>;
        _stop(): void;
        _selectByScroll(scroll: any): void;
        updateSource(source: any): void;
        select(value: any): void;
        destroy(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/datePicker.tsx" />
declare module "@scom/scom-calendar/common/datePicker.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    interface ScomCalendarDatePickerElement extends ControlElement {
        date?: string;
        onChanged?: (date: string) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar--date-picker"]: ScomCalendarDatePickerElement;
            }
        }
    }
    export class ScomCalendarDatePicker extends Module {
        private pnlYear;
        private pnlMonth;
        private pnlDate;
        private yearSelector;
        private monthSelector;
        private daySelector;
        private initialDate;
        private _date;
        private currentYear;
        private currentMonth;
        private currentDay;
        onChanged: (date: string) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarDatePickerElement, parent?: Container): Promise<ScomCalendarDatePicker>;
        get date(): string;
        set date(value: string);
        setData(data: string): void;
        private renderUI;
        private renderSelectors;
        private getYears;
        getMonths(): any[];
        getDays(year: number, month: number): any[];
        private onChangedSelect;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/select.tsx" />
declare module "@scom/scom-calendar/common/select.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
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
        private monthPicker;
        private datePicker;
        private iconLeft;
        private iconRight;
        private initialDate;
        private _data;
        onChanged: (date: string) => void;
        onClose: () => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarSelectElement, parent?: Container): Promise<ScomCalendarSelect>;
        get date(): string;
        set date(value: string);
        setData(data: ISelect): void;
        private renderUI;
        private onCancel;
        private onConfirm;
        private onShowMonth;
        private onMonthChanged;
        private updateHeader;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/index.ts" />
declare module "@scom/scom-calendar/common/index.ts" {
    export { ScomCalendarSelect } from "@scom/scom-calendar/common/select.tsx";
    export { ScomCalendarMonthPicker } from "@scom/scom-calendar/common/monthPicker.tsx";
    export { ScomCalendarDatePicker } from "@scom/scom-calendar/common/datePicker.tsx";
    export { ScomCalendarView } from "@scom/scom-calendar/common/view.tsx";
    export * from "@scom/scom-calendar/common/utils.ts";
}
/// <amd-module name="@scom/scom-calendar" />
declare module "@scom/scom-calendar" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IEvent } from "@scom/scom-calendar/interface.ts";
    type callbackType = (data: IEvent, event: MouseEvent) => void;
    type selectCallbackType = (date: string) => void;
    interface ScomCalendarElement extends ControlElement {
        events?: IEvent[];
        isMonthEventShown?: boolean;
        onEventClicked?: callbackType;
        onDateClicked?: selectCallbackType;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-calendar"]: ScomCalendarElement;
            }
        }
    }
    export default class ScomCalendar extends Module {
        private pnlLoadingSpinner;
        private calendarView;
        private selectEl;
        private lbMonth;
        private lbYear;
        private initialDate;
        private pos1;
        private pos2;
        private datePnlHeight;
        private isVerticalSwiping;
        private isHorizontalSwiping;
        private calendarViewMode;
        private threshold;
        private _events;
        private _isMonthEventShown;
        onEventClicked: callbackType;
        onDateClicked: selectCallbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarElement, parent?: Container): Promise<ScomCalendar>;
        get events(): IEvent[];
        set events(value: IEvent[]);
        get isMonthEventShown(): boolean;
        set isMonthEventShown(value: boolean);
        get isTouchDevice(): boolean;
        setData({ events, isMonthEventShown }: {
            events: IEvent[];
            isMonthEventShown?: boolean;
        }): void;
        private onSelectedDate;
        private updateHeader;
        _handleMouseDown(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseMove(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        _handleMouseUp(event: PointerEvent | MouseEvent | TouchEvent, stopPropagation?: boolean): boolean;
        private dragStartHandler;
        private dragHandler;
        private dragEndHandler;
        private eventDragEndHandler;
        private getDeviceType;
        private onSwipeView;
        private onUpdateMonth;
        private onChangeDate;
        refresh(): void;
        init(): void;
        render(): void;
    }
}
