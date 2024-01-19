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
    export interface ISelectOption {
        text: string;
        value: number;
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
    export const selectorStyles: string;
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
        private pnlYear;
        private pnlMonth;
        private pnlDate;
        private yearSelector;
        private monthSelector;
        private daySelector;
        private initialDate;
        private _data;
        private currentYear;
        private currentMonth;
        private currentDay;
        onChanged: (date: string) => void;
        onClose: () => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCalendarSelectElement, parent?: Container): Promise<ScomCalendarSelect>;
        get date(): string;
        set date(value: string);
        setData(data: ISelect): void;
        clear(): void;
        private renderUI;
        private renderSelectors;
        private getYears;
        getMonths(): any[];
        getDays(year: number, month: number): any[];
        private onCloseSelect;
        private onChangedSelect;
        init(): void;
        render(): void;
    }
}
/// <amd-module name="@scom/scom-calendar/common/index.ts" />
declare module "@scom/scom-calendar/common/index.ts" {
    export { ScomCalendarSelect } from "@scom/scom-calendar/common/select.tsx";
    export * from "@scom/scom-calendar/common/utils.ts";
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
