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
  private hThreshold: number = 30;
  private isVerticalSwiping: boolean = false;
  private isHorizontalSwiping: boolean = false;

  private _events: IEvent[] = [];

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

  setData({ events }: { events: IEvent[] }) {
    this.events = events;
    this.calendarView.onSwiping = () => this.isVerticalSwiping || this.isHorizontalSwiping;
    if (this.onEventClicked)
      this.calendarView.onEventClicked = this.onEventClicked.bind(this);
    this.calendarView.onDateClicked = this.onSelectedDate.bind(this);
    this.calendarView.setData({
      mode: 'full',
      events: this.events,
      holidays: holidayList
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
      if (sliderList) {
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
      if (sliderList) {
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
    }
    return false;
  }

  private dragStartHandler(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      this.pos1 = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
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
  }

  private dragHandler(event: MouseEvent | TouchEvent) {
    if (event.cancelable) {
      event.preventDefault();
    }
    let deltaX = 0;
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].pageX,
        y: event.touches[0].pageY - this.pos1.y
      }
      deltaX = event.touches[0].pageX - this.pos1.x;
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: event.pageY - this.pos1.y
      }
      deltaX = event.clientX - this.pos1.x;
    }

    const listStack = this.calendarView.querySelector('#listStack') as Control;
    const containerWidth = listStack ? listStack.offsetWidth : this.calendarView.offsetWidth;
    // const containerHeight = this.calendarView.offsetHeight;
    const hThreshold = containerWidth * 0.1;
    const verticalThreshold = this.datePnlHeight * 0.1;
    if (Math.abs(this.pos2.y) >= verticalThreshold && Math.abs(deltaX) < hThreshold) {
      this.isVerticalSwiping = true;
      this.isHorizontalSwiping = false;
      const newHeight = this.datePnlHeight + this.pos2.y;
      let mode: IViewMode = 'full';
      if (newHeight > 345 && this.pos2.y > verticalThreshold) {
        mode = 'full';
      } else if (newHeight < 345 && this.pos2.y < -verticalThreshold) {
        mode = 'week';
      } else {
        mode = 'month';
      }
      this.calendarView.mode = mode;
      return false;
    } else if (Math.abs(deltaX) >= hThreshold) {
      this.isVerticalSwiping = false;
      this.isHorizontalSwiping = true;
    } else {
      this.isVerticalSwiping = false;
      this.isHorizontalSwiping = false;
    }
  }

  private dragEndHandler(event: MouseEvent | TouchEvent) {
    if (this.isVerticalSwiping) {
      const mode = this.calendarView.mode;
      this.onSwipeView(undefined, mode);
      return false;
    } else if (this.isHorizontalSwiping) {
      let direction: 1 | -1 = 1;
      if (this.pos2.x < -this.hThreshold) {
        direction = -1;
      } else if (this.pos2.x > this.hThreshold) {
        direction = 1;
      }
      const mode = this.calendarView.mode;
      this.onSwipeView(direction, mode);
    }
  }

  private onSwipeView(direction?: 1 | -1, mode: IViewMode = 'full') {
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
    this.setData({ events });
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
