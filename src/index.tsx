import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Control,
  Styles,
  Label
} from '@ijstech/components'
import { IEvent, IPos, IViewMode } from './interface'
import holidayList from './data/holidays.json';
import { ScomCalendarSelect, ScomCalendarView } from './common/index';

const Theme = Styles.Theme.ThemeVars;

type callbackType = (data: IEvent, event: MouseEvent) => void;
type selectCallbackType = (date: string) => void;

interface ScomCalendarElement extends ControlElement {
  events?: IEvent[];
  isMonthEventShown?: boolean;
  onEventClicked?: callbackType;
  onDateClicked?: selectCallbackType;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar"]: ScomCalendarElement;
    }
  }
}

@customModule
@customElements('i-scom-calendar')
export default class ScomCalendar extends Module {
  private calendarView: ScomCalendarView;
  private selectEl: ScomCalendarSelect;
  private lbMonth: Label;
  private lbYear: Label;

  private initialDate: Date = new Date();
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private datePnlHeight: number = 0;
  private isVerticalSwiping: boolean = false;
  private isHorizontalSwiping: boolean = false;
  private calendarViewMode: IViewMode;
  private threshold: number = 35;

  private _events: IEvent[] = [];
  private _isMonthEventShown: boolean = false;

  onEventClicked: callbackType;
  onDateClicked: selectCallbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onUpdateMonth = this.onUpdateMonth.bind(this);
  }

  static async create(options?: ScomCalendarElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get events() {
    return this._events ?? [];
  }
  set events(value: IEvent[]) {
    this._events = value ?? []
  }

  get isMonthEventShown() {
    return this._isMonthEventShown ?? false;
  }
  set isMonthEventShown(value: boolean) {
    this._isMonthEventShown = value ?? false;
  }

  get isTouchDevice() {
    return this.getDeviceType() !== 'desktop';
  }

  setData({ events, isMonthEventShown }: { events: IEvent[], isMonthEventShown?: boolean }) {
    this.events = events;
    this.isMonthEventShown = isMonthEventShown;
    this.calendarView.onSwiping = () => this.isVerticalSwiping || this.isHorizontalSwiping;
    if (this.onEventClicked)
      this.calendarView.onEventClicked = this.onEventClicked.bind(this);
    this.calendarView.onDateClicked = this.onSelectedDate.bind(this);
    this.calendarView.setData({
      mode: 'full',
      events: this.events,
      holidays: holidayList,
      isMonthEventShown: this.isMonthEventShown
    });
    this.updateHeader();
    this.maxHeight = window.innerHeight;
  }

  private onSelectedDate(date: string) {
    this.initialDate = new Date(date);
    if (this.onDateClicked) this.onDateClicked(date);
  }

  private updateHeader() {
    const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
    this.lbMonth.caption = monthName;
    const year = this.initialDate.getFullYear();
    this.lbYear.caption = `${year}`;
    this.lbYear.visible = year !== new Date().getFullYear();
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseDown(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('#pnlDates');
      const elmEventList = target.closest('#pnlSelected');
      if (sliderList || elmEventList) {
        this.dragStartHandler(event);
        return true;
      }
    }
    return false;
  }

  _handleMouseMove(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseMove(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('#pnlDates');
      const elmEventList = target.closest('#pnlSelected');
      if (sliderList || elmEventList) {
        this.dragHandler(event);
        return true;
      }
    }
    return false;
  }

  _handleMouseUp(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseUp(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('#pnlDates');
      if (sliderList) {
        this.dragEndHandler(event);
        return true;
      }
      const elmEventList = target.closest('#pnlSelected');
      if (elmEventList) {
        this.eventDragEndHandler(event);
        return true;
      }
    }
    return false;
  }

  private dragStartHandler(event: MouseEvent | TouchEvent) {
    if (this.isTouchDevice && event instanceof MouseEvent) {
      event.preventDefault();
      return false;
    }
    if (event instanceof TouchEvent) {
      this.pos1 = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    } else {
      event.preventDefault();
      this.pos1 = {
        x: event.clientX,
        y: event.clientY
      }
    }
    this.pos2 = {x: 0, y: 0};
    const pnlDates = this.calendarView.querySelector('#pnlDates') as Control;
    if (pnlDates) {
      this.datePnlHeight = pnlDates.offsetHeight;
    }
    this.isVerticalSwiping = false;
    this.isHorizontalSwiping = false;
    this.calendarViewMode = this.calendarView.mode;
  }

  private dragHandler(event: MouseEvent | TouchEvent) {
    if (this.isTouchDevice && event instanceof MouseEvent) {
      event.preventDefault();
      return false;
    }
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].clientX,
        y: this.pos1.y - event.touches[0].clientY
      }
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: this.pos1.y - event.pageY
      }
    }
    if (Math.abs(this.pos2.x) > Math.abs(this.pos2.y)) {
      if (event.cancelable) {
        event.preventDefault();
      }
    } else {
      if (this.calendarViewMode === 'week' && (this.pos2.y > 0 || this.calendarView.activeItemScrollTop > 0)) {
      } else if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  private dragEndHandler(event: MouseEvent | TouchEvent) {
    if (Math.abs(this.pos2.x) > Math.abs(this.pos2.y)) {
      if (Math.abs(this.pos2.x) > this.threshold) {
        this.isHorizontalSwiping = true;
        let direction = this.pos2.x > 0 ? 1 : -1;
        const mode = this.calendarViewMode;
        this.onSwipeView(direction, mode);
      }
    } else {
      if (Math.abs(this.pos2.y) > this.threshold) {
        this.isVerticalSwiping = true;
        let mode;
        if (this.pos2.y > 0) {
          if (this.calendarViewMode === 'full') {
            mode = this.isMonthEventShown ? 'month' : 'week';
          };
          if (this.calendarViewMode === 'month') mode = 'week';
        } else {
          if (this.calendarViewMode === 'week') {
            mode = this.isMonthEventShown ? 'month' : 'full';
          }
          if (this.calendarViewMode === 'month') mode = 'full';
        }
        if (mode) this.onSwipeView(undefined, mode);
        return false;
      }
    }
  }

  private eventDragEndHandler(event: MouseEvent | TouchEvent) {
    if (Math.abs(this.pos2.x) > Math.abs(this.pos2.y)) return;
    if (Math.abs(this.pos2.y) > this.threshold) {
      this.isVerticalSwiping = true;
      let mode;
      if (this.pos2.y > 0) {
        if (this.calendarViewMode === 'month' || (this.calendarViewMode === 'full' && !this.isMonthEventShown)) mode = 'week';
      } else {
        if (this.calendarViewMode === 'week' && this.calendarView.activeItemScrollTop === 0) {
          mode = this.isMonthEventShown ? 'month' : 'full';
        }
        if (this.calendarViewMode === 'month' || (this.calendarViewMode === 'week' && !this.isMonthEventShown)) mode = 'full';
      }
      if (mode) this.onSwipeView(undefined, mode);
      return false;
    }
  }

  private getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  };

  private onSwipeView(direction?: number, mode: IViewMode = 'full') {
    if (mode === 'week') {
      this.calendarView.onSwipeWeek(direction);
    } else if (mode === 'month') {
      this.calendarView.onSwipeMonthEvents(direction);
    } else {
      this.calendarView.onSwipeFullMonth(direction);
    }
  }

  private onUpdateMonth(data: { month: number, year: number }) {
    const { month, year } = data;
    if (month && year) {
      this.initialDate.setMonth(month - 1);
      this.initialDate.setFullYear(year);
      this.updateHeader();
    }
  }

  private onChangeDate() {
    const date = this.initialDate.toISOString();
    if (this.selectEl) {
      this.selectEl.setData({ date });
    } else {
      this.selectEl = new ScomCalendarSelect(undefined, {
        date,
        onClose: () => {
          this.selectEl.closeModal();
        },
        onChanged: (date: string) => {
          this.selectEl.closeModal();
          this.calendarView.setData({
            mode: 'full',
            events: this.events,
            holidays: holidayList,
            date
          });
          this.initialDate = new Date(date);
          this.updateHeader();
        }
      }) as ScomCalendarSelect;
    }
    this.selectEl.openModal({
      showBackdrop: true,
      popupPlacement: 'bottom',
      width: 'calc(100vw - 2rem)',
      height: 'auto',
      closeIcon: null,
      closeOnBackdropClick: false,
      border: {radius: '1rem'}
    })
  }

  refresh() {
    super.refresh();
    this.maxHeight = window.innerHeight;
  }

  init() {
    super.init()
    this.onEventClicked = this.getAttribute('onEventClicked', true) || this.onEventClicked;
    const events = this.getAttribute('events', true);
    const isMonthEventShown = this.getAttribute('isMonthEventShown', true);
    this.setData({ events, isMonthEventShown });
  }

  render(): void {
    return (
      <i-vstack
        background={{color: Theme.background.main}}
        width='100%'
        height={'100%'}
        maxHeight="-webkit-fill-available"
      >
        <i-hstack
          id="pnlHeader"
          verticalAlignment='center' horizontalAlignment='center' gap="0.25rem"
          cursor='pointer'
          onClick={this.onChangeDate}
        >
          <i-label id="lbMonth" font={{size: '1.25rem', weight: 600}}></i-label>
          <i-label id="lbYear" font={{size: '1.25rem', color: Theme.text.secondary}}></i-label>
        </i-hstack>
        <i-scom-calendar--view
          id="calendarView"
          stack={{grow: '1'}}
          onMonthChanged={this.onUpdateMonth}
          display='flex'
          maxHeight={'100%'}
          overflow={'hidden'}
        />
      </i-vstack>
    )
  }
}
