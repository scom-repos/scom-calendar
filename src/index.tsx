import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Panel,
  Control,
  GridLayout,
  HStack,
  Label,
  VStack,
  Styles,
  moment,
  Button,
  Input,
  CarouselSlider
} from '@ijstech/components'
import { IDate, IEvent } from './interface'
import holidayList from './data/holidays.json';
import './index.css'
import { swipeStyle, transitionStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;
const DATES_PER_SLIDE = 35;
const DAYS = 7;
const ROWS = 5;
const defaultHolidayColor = Theme.colors.info.main;
const defaultEventColor = Theme.colors.primary.main;
const currentColor = Theme.colors.secondary.main;
// DefaultColors

interface IPos {
  x: number;
  y: number;
}

interface ScomCalendarElement extends ControlElement {
  events?: IEvent[];
  onFilter?: (data?: any) => void;
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
  private pnlWrapper: Panel;
  private gridHeader: GridLayout;
  private listStack: HStack;
  private lbMonth: Label;
  private lbYear: Label;
  private selectedDate: VStack;
  private inputAdd: Input;
  private pnlDates: Panel;
  private pnlSelected: Panel;
  private eventSlider: CarouselSlider;

  private datesMap: Map<string, IDate[]> = new Map();
  private gridMap: Map<string, GridLayout> = new Map();
  private selectedMap: Map<string, Control> = new Map();
  private initialDate: Date = new Date();
  private currentDate: Date = new Date();
  private filteredData: any = {};
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private oldMonth: string = '';
  private datePnlHeight: number = 0;
  private isVerticalSwiping: boolean = false;
  private _events: IEvent[] = [];

  onFilter: (data?: any) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onFilterData = this.onFilterData.bind(this);
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

  private isCurrentDate(date: IDate) {
    if (!date) return false;
    return this.currentDate.getDate() === date.date &&
      this.currentDate.getMonth() + 1 === date.month &&
      this.currentDate.getFullYear() === date.year
  }

  private get datesInMonth() {
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const monthKey = `${month}-${year}`;
    let dates: IDate[] = [];
    if (this.datesMap.has(monthKey)) {
      dates = this.datesMap.get(monthKey);
    } else {
      dates = this.getDates(month, year);
    }
    return dates;
  }

  private get calendarData() {
    const eventsMap = new Map();
    for (let i = 0; i < this.datesInMonth.length; i++) {
      const item = this.datesInMonth[i];
      const holiday = this.getHoliday(item);
      const events = this.getEvents(item);
      const dateKey = `${item.date}-${item.month}-${item.year}`
      eventsMap.set(dateKey, { holiday, events });
    }
    return eventsMap;
  }

  private getDates(month: number, year: number) {
    let dates: IDate[] = [];
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = this.daysInMonth(month, year);
    const prevMonthLastDate = new Date(year, month - 1, 0);
    const prevMonth = prevMonthLastDate.getMonth() + 1;
    const prevYear = prevMonthLastDate.getFullYear();
    const prevDate = prevMonthLastDate.getDate();
    const prevDateStr = `${prevMonth}/${prevDate}/${prevYear}`;
    if (firstDay > 0) {
      dates.unshift({ month: prevMonth, year: prevYear, date: prevDate, day: prevMonthLastDate.getDay() });
      for (let i = 1; i < firstDay; i++) {
        const before = moment(prevDateStr).subtract(i, 'days');
        dates.unshift({ month: prevMonth, year: prevYear, date: before.get('date'), day: before.get('day') });
      }
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      dates.push({month, year, date: i, day: date.getDay()});
    }

    const fillingDates = DATES_PER_SLIDE - dates.length;
    if (fillingDates > 0) {
      for (let i = 1; i <= fillingDates; i++) {
        const after = moment(`${month}/${daysInMonth}-${year}`).add(i, 'days');
        dates.push({ month: month + 1, year: year, date: after.get('date'), day: after.get('day') });
      }
    }
    return dates;
  }

  private daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  private getEventByStartDate(item: IDate) {
    return [...this.events].filter(event => {
      const date = moment(event.startDate);
      if (date.get('month') + 1 === item.month && date.get('year') === item.year && date.get('date') === item.date) {
        return true;
      }
    })
  }

  private getEvents(item: IDate) {
    const { year, month, date } = item;
    return [...this.events].filter(event => {
      const startDate = moment(event.startDate).startOf('day');
      const endDate = moment(event.endDate).endOf('day');
      const checkingDate = moment(`${month}/${date}/${year}`).startOf('day');
      return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
    })
  }

  private getHoliday(item: IDate) {
    const {year, month, date} = item;
    const finded = holidayList.find(holiday => {
      return moment(holiday.date).isSame(moment(`${month}/${date}/${year}`));
    })
    return finded;
  }

  setData({ events }: { events: IEvent[] }) {
    this.clear();
    this.events = events;
    this.renderUI();
  }

  private renderUI(direction?: 1 | -1) {
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const date = this.initialDate.getDate();
    const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
    this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
    this.renderMonth(month, year, direction);
    this.renderEventSlider();
  }

  clear() {
    this.listStack.clearInnerHTML();
    this.updateDatesHeight('100%');
    this.pnlSelected.height = 0;
    this.gridMap = new Map();
    this.selectedMap = new Map();
    this.initialDate = new Date();
    this.currentDate = new Date();
    this.filteredData = {};
  }

  private renderHeader() {
    this.gridHeader.clearInnerHTML();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 0; i < days.length; i++) {
      const color = i === 0 ? Theme.colors.error.main : Theme.text.primary;
      const el = <i-label
        caption={days[i]}
        font={{size: '1rem', weight: 500, color }}
        opacity={0.7}
        padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
        lineHeight={'1.5rem'}
        class="text-center"
      ></i-label>;
      this.gridHeader.append(el);
    }
  }

  private renderMonth(month: number, year: number, direction?: 1 | -1) {
    const monthKey = `${month}-${year}`;
    this.lbMonth.caption = moment(this.initialDate).format('MMM');
    this.lbYear.caption = moment(this.initialDate).format('YYYY');
    this.lbYear.visible = this.initialDate.getFullYear() !== this.currentDate.getFullYear();
    const gridMonth = this.gridMap.get(monthKey);
    if (gridMonth) return;

    const gridDates: GridLayout = <i-grid-layout
      templateRows={[`repeat(${ROWS}, 1fr)`]}
      autoRowSize='auto'
      autoFillInHoles={true}
      columnsPerRow={1}
      width={'100%'}
      stack={{shrink: '0', grow: '0', basis: 'auto'}}
      class="scroll-item"
    ></i-grid-layout>
    gridDates.setAttribute('data-month', monthKey);
    for (let i = 0; i < ROWS; i++) {
      gridDates.append(
        <i-vstack
          border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
          width={'100%'}
          overflow={'hidden'}
          padding={{bottom: '0.75rem'}}
          minHeight={i == 0 ? '2rem' : 'auto'}
        >
          <i-grid-layout
            templateRows={['auto']}
            templateColumns={[`repeat(${DAYS}, 1fr)`]}
            width={'100%'}
          ></i-grid-layout>
          <i-grid-layout
            templateRows={['auto']}
            templateColumns={[`repeat(${DAYS}, 1fr)`]}
            width={'100%'}
            overflow={'hidden'}
            gap={{row: '0.25rem'}}
            autoRowSize='auto'
            autoFillInHoles={true}
          ></i-grid-layout>
        </i-vstack>
      )
    }

    const dates = [...this.datesInMonth];
    for (let i = 0; i < dates.length; i++) {
      const rowIndex = Math.floor(i / DAYS);
      if (!gridDates.children[rowIndex]) break;
      const columnIndex = i % DAYS;
      const item = dates[i];
      const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
      const defaultColor = i === rowIndex * DAYS ? Theme.colors.error.main : Theme.text.primary
      const color = this.isCurrentDate(item) ? Theme.colors.primary.contrastText : defaultColor;
      const bgColor = this.isCurrentDate(item) ? currentColor : 'transparent';
      const holiday = this.getHoliday(item);
      const events = this.getEventByStartDate(item);

      const el = (
        <i-vstack
          gap="0.125rem"
          horizontalAlignment='center'
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          border={{radius: '0.25rem', width: '1px', style: 'solid', color: 'transparent'}}
          cursor='pointer'
          onClick={(target: VStack, event: MouseEvent) => this.onDateClick(target, item)}
        >
          <i-label
            caption={`${item.date}`}
            font={{size: '1rem', weight: 500, color }}
            opacity={inMonth ? 1 : 0.36}
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem'}}
            border={{radius: '0.125rem'}}
            background={{color: bgColor}}
            class="text-center"
          ></i-label>
        </i-vstack>
      );
      el.setAttribute('data-date', `${item.date}-${item.month}-${item.year}`);

      if (holiday) {
        const holidayEl = this.renderHoliday(holiday, columnIndex);
        gridDates.children[rowIndex].children[1].append(holidayEl);
      }
      if (events?.length) {
        for (let event of events) {
          const eventEl = this.renderEvent(event, columnIndex);
          gridDates.children[rowIndex].children[1].append(eventEl);
        }
      }
      gridDates.children[rowIndex].children[0].append(el);
    }

    const oldMonth = this.gridMap.get(this.oldMonth);
    this.listStack.append(gridDates);
    if (oldMonth && direction) {
      if (direction === 1) {
        this.listStack.insertBefore(oldMonth, gridDates);
      } else {
        this.listStack.insertBefore(gridDates, oldMonth);
      }
    }

    this.datesMap.set(`${month}-${year}`, dates);
    this.gridMap.set(`${month}-${year}`, gridDates);
  }

  private renderEvent(event: IEvent, columnIndex: number) {
    const spanDays = moment(event.endDate).startOf('day').diff(moment(event.startDate).startOf('day'), 'days');
    const columnSpan = spanDays === 0 ? 1 : spanDays;
    const eventEl = (
      <i-vstack
        grid={{column: columnIndex + 1, columnSpan, verticalAlignment: 'start'}}
        border={{radius: '0.25rem'}}
        background={{color: event.color || defaultEventColor}}
        minHeight={3} maxHeight={'100%'}
        height={'var(--event-height, auto)'}
        padding={{left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem'}}
        overflow={'hidden'}
        cursor='pointer'
      >
        <i-label
          caption={event.title}
          opacity={'var(--event-opacity, 1)'}
          lineHeight={'1rem'}
          font={{size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500}}
        ></i-label>
      </i-vstack>
    ) as Control
    return eventEl;
  }

  private renderHoliday(holiday: any, columnIndex: number) {
    return <i-vstack
      border={{radius: '0.25rem'}}
      background={{color: defaultHolidayColor}}
      grid={{column: columnIndex + 1, verticalAlignment: 'start'}}
      padding={{left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem'}}
      minHeight={3} maxHeight={'100%'}
      height={'var(--event-height, auto)'}
      overflow={'hidden'}
      cursor='pointer'
    >
      <i-label
        caption={holiday.name}
        opacity={'var(--event-opacity, 1)'}
        lineHeight={'1rem'}
        textOverflow='ellipsis'
        font={{size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500}}
      />
    </i-vstack>
  }

  private renderEventSlider() {
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const calendarData = this.calendarData;
    const itemsData = [];
    for (let date of this.datesInMonth) {
      if (date.month !== month || date.year !== year) continue;
      const { holiday, events } = calendarData.get(`${date.date}-${date.month}-${date.year}`);
      const eventEl = this.renderSliderItem(date, holiday, events);
      itemsData.push({
        name: '',
        controls: [eventEl]
      })
    }
    this.eventSlider.items = itemsData;
    this.eventSlider.activeSlide = this.initialDate.getDate() - 1;
  }

  private renderSliderItem(item: IDate, holiday: any, events: IEvent[]) {
    const {date, month, year} = item;
    const dateKey = `${date}-${month}-${year}`;
    const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
    const selectedPanel = this.selectedMap.get(dateKey);
    if (selectedPanel) return;

    const selectedWrap = <i-vstack width={'100%'} padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}></i-vstack>
    selectedWrap.setAttribute('data-slider-date', dateKey);
    const caption = `${date} ${monthName}`;
    selectedWrap.append(
      <i-hstack
        gap={'0.5rem'}
        verticalAlignment='center'
        horizontalAlignment='space-between'
        margin={{top: '1rem'}}
        width={'100%'}
        overflow={'hidden'}
      >
        <i-hstack
          gap={'0.5rem'}
          verticalAlignment='center'
          horizontalAlignment='space-between'
        >
          <i-label caption={caption} font={{size: '0.75rem', weight: 600}}></i-label>
          <i-panel border={{left: {width: '1px', style: 'solid', color: Theme.divider}}} height={'100%'}></i-panel>
          <i-label caption={'12c / 8c'} font={{size: '0.75rem', weight: 600}}></i-label>
          <i-icon
            stack={{shrink: '0'}}
            width='0.75rem' height='0.75rem'
            fill={Theme.colors.warning.main}
            name='sun'
          ></i-icon>
          </i-hstack>
          <i-icon
            stack={{shrink: '0'}}
            width='0.75rem' height='0.75rem'
            fill={Theme.text.primary}
            name='smile'
          ></i-icon>
      </i-hstack>
    )
    const eventsStack = <i-vstack width="100%" gap="1rem" margin={{top: '0.5rem'}}></i-vstack>;
    selectedWrap.append(eventsStack);
    if (!holiday && !events.length) {
      eventsStack.append(
        <i-label
          margin={{top: '0.5rem'}}
          caption={'No events'}
          font={{size: '0.75rem', color: Theme.text.primary}}
        ></i-label>
      );
    } else {
      this.renderSelectedHoliday(holiday, eventsStack);
      for (let i = 0; i < events.length; i++) {
        this.renderSelectedEvent(events[i], eventsStack, i === events.length - 1);
      }
    }
    return selectedWrap;
  }

  private renderSelectedEvent(event: IEvent, parent: Control, isLast: boolean) {
    const startTime = moment(event.startDate).format('HH:mm');
    const endTime = moment(event.endDate).format('HH:mm');
    parent.appendChild(
      <i-panel
        border={{bottom: {width: '1px', style: isLast ? 'none' :'solid', color: Theme.divider}}}
      >
        <i-hstack
          padding={{top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem'}}
          gap={'0.25rem'}
        >
          <i-hstack stack={{shrink: '0', basis: '2.5rem'}}>
            <i-label caption={startTime} font={{size: '0.75rem', weight: 500}}></i-label>
          </i-hstack>
          <i-panel
            stack={{shrink: '0', basis: '3px'}}
            height={'1.25rem'}
            width={3} border={{radius: '0.25rem'}}
            margin={{right: '0.625rem'}}
            background={{color: event.color || defaultEventColor}}
          ></i-panel>
          <i-vstack gap="0.25rem">
            <i-label caption={event.title} font={{size: '1rem', weight: 500}}></i-label>
            <i-label caption={`${startTime} - ${endTime}`} font={{size: '0.75rem', weight: 500}} opacity={0.36}></i-label>
          </i-vstack>
        </i-hstack>
      </i-panel>
    )
  }

  private renderSelectedHoliday(holiday: any, parent: Control) {
    if (!holiday) return;
    parent.appendChild(
      <i-panel>
        <i-hstack
          padding={{top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem'}}
          gap={'0.25rem'}
        >
          <i-hstack stack={{shrink: '0', basis: '2.5rem'}} horizontalAlignment='center'>
            <i-icon
              width='0.75rem' height='0.75rem'
              fill={Theme.text.primary}
              name='calendar'
            ></i-icon>
          </i-hstack>
          <i-panel
            stack={{shrink: '0', basis: '3px'}}
            height={'1.25rem'}
            width={3} border={{radius: '0.25rem'}}
            margin={{right: '0.625rem'}}
            background={{color: holiday?.color || defaultHolidayColor}}
          ></i-panel>
          <i-label caption={holiday.name} font={{size: '1rem', weight: 500}}></i-label>
          <i-vstack verticalAlignment='center' margin={{left: 'auto'}} stack={{shrink: '0'}}>
            <i-icon
              width='0.75rem' height='0.75rem'
              fill={Theme.text.primary}
              name='calendar-week'
            ></i-icon>
          </i-vstack>
        </i-hstack>
      </i-panel>
    )
  }

  private onDateClick(target: VStack, date: IDate) {
    this.updateOldDate(date);
    this.initialDate = new Date(date.year, date.month - 1, date.date);
    this.updateNewDate(target, date);
    this.updateDatesHeight('40%');
    this.pnlSelected.height = 'auto';

    this.eventSlider.activeSlide = date.date - 1;

    this.filteredData.date = date;
    if (this.onFilter) this.onFilter({ date });
  }

  private updateOldDate(date: IDate) {
    if (this.selectedDate) {
      const label = this.selectedDate.querySelector('i-label') as Control;
      if (label) {
        const defaultColor = date.day === 0 ? Theme.colors.error.main : Theme.text.primary;
        label.font = {size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.contrastText : defaultColor};
        label.background.color = 'transparent';
      }
    }
  }

  private updateNewDate(target: VStack, data: IDate) {
    const {month, year, date} = data;
    const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
    this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
    this.selectedDate = target;
    const label = target?.querySelector('i-label') as Control;
    if (label) {
      label.font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
      label.background.color = Theme.colors.primary.main;
    }
  }

  private updateDatesHeight(height: number|string) {
    this.pnlDates.height = height;
    let opacity = '1';
    if (typeof height === 'string') {
      opacity = height === '40%' ? '0' : '1';
    } else {
      const eventHeight = height * 0.05;
      opacity = eventHeight < 20 ? '0': '1'
    }
    this.style.setProperty('--event-opacity', opacity);
    this.style.setProperty('--event-height', opacity === '0' ? '3px' : 'auto');
  }

  private onNextMonth() {
    this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setMonth(this.initialDate.getMonth() + 1);
    this.renderUI(1);
  }

  private onPrevMonth() {
    this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setMonth(this.initialDate.getMonth() - 1);
    this.renderUI(-1);
  }

  private onFilterData(target: Button) {
    this.filteredData.type = target.caption;
    if (this.onFilter) this.onFilter({ type: target.caption });
  }

  private onAddEvent() {
  }

  private onSlideChanged(index: number) {
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const dates = this.datesMap.get(`${month}-${year}`);
    const newDate = dates.find(date => date.date === index + 1);
    this.updateOldDate(newDate);
    this.initialDate.setDate(newDate.date);
    const dataDate = `${newDate.date}-${newDate.month}-${newDate.year}`;
    const target = this.listStack.querySelector(`[data-date="${dataDate}"]`) as VStack;
    this.updateNewDate(target, newDate);
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseDown(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('#listStack');
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
      const sliderList = target.closest('#listStack');
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
      const sliderList = target.closest('#listStack');
      if (sliderList) {
        this.dragEndHandler(event);
        return true;
      }
    }
    return false;
  }

  dragStartHandler(event: MouseEvent | TouchEvent) {
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
    this.datePnlHeight = this.pnlDates.offsetHeight;
    this.isVerticalSwiping = false;
  }

  dragHandler(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].pageX,
        y: event.touches[0].pageY - this.pos1.y
      }
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: event.pageY - this.pos1.y
      }
    }

    const containerHeight = this.pnlWrapper.offsetHeight;
    if (Math.abs(this.pos2.y) > 30) {
      this.isVerticalSwiping = true;
      let newHeight = this.datePnlHeight + this.pos2.y;
      this.pnlSelected.height = 'auto';
      if (newHeight > containerHeight) {
        newHeight = containerHeight;
        this.pnlSelected.height = 0;
      } else if (newHeight < 200) {
        newHeight = 100;
      }
      this.updateDatesHeight(newHeight);
    }
  }

  dragEndHandler(event: MouseEvent | TouchEvent) {
    if (!this.isVerticalSwiping) {
      const containerWidth = this.pnlWrapper.offsetWidth;
      const horizontalThreshold = 30; // containerWidth * 0.3;
      if (this.pos2.x < -horizontalThreshold) {
        this.onPrevMonth();
        this.listStack.scrollTo({
          left: this.listStack.scrollLeft - containerWidth,
          behavior: 'smooth',
        });
      } else if (this.pos2.x > horizontalThreshold) {
        this.onNextMonth();
        this.listStack.scrollTo({
          left: this.listStack.scrollLeft + containerWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  init() {
    super.init()
    this.onFilter = this.getAttribute('onFilter', true) || this.onFilter;
    const events = this.getAttribute('events', true);
    this.renderHeader();
    this.setData({ events });
  }

  render(): void {
    return (
      <i-panel maxHeight={'100dvh'} overflow={'hidden'}>
        <i-vstack
          id="pnlWrapper"
          width='100%'
          height={'calc(100vh - 3.125rem)'}
          overflow={'hidden'}
          gap="1rem"
        >
          <i-vstack
            id="pnlDates"
            minHeight={100}
            maxHeight={'99%'}
            padding={{top: '0.5rem', left: '0.75rem', right: '0.75rem'}}
            overflow={'hidden'}
            class={transitionStyle}
          >
            <i-hstack verticalAlignment='center' horizontalAlignment='center' gap="0.25rem">
              <i-label id="lbMonth" font={{size: '1.25rem', weight: 600}}></i-label>
              <i-label id="lbYear" font={{size: '1.25rem', color: Theme.text.secondary}}></i-label>
            </i-hstack>
            <i-grid-layout
              id="gridHeader"
              columnsPerRow={DAYS}
              margin={{top: '0.75rem'}}
            ></i-grid-layout>
            <i-hstack
              id="listStack"
              overflow={{x: 'auto', y: 'hidden'}}
              minHeight={'1.875rem'}
              class={swipeStyle}
              stack={{grow: '1'}}
            ></i-hstack>
          </i-vstack>
          <i-panel
            id="pnlSelected"
            stack={{ grow: '1', shrink: '1', basis: 'auto'}}
            minHeight={0} height={0}
            overflow={'hidden'}
          >
            <i-carousel-slider
              id="eventSlider"
              swipe={true}
              width={'100%'} height={'100%'}
              indicators={false}
              autoplay={false}
              border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
              onSlideChange={this.onSlideChanged}
            ></i-carousel-slider>
          </i-panel>
        </i-vstack>
        <i-panel
          position='fixed'
          bottom="0px" left="0px" zIndex={999} width={'100%'}
          padding={{top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'}}
        >
          <i-hstack
            verticalAlignment='center'
            horizontalAlignment='space-between'
            gap={'1rem'}
          >
            <i-input
              id="inputAdd"
              placeholder="Add event on"
              border={{radius: '9999px', width: '1px', style: 'solid', color: Theme.divider}}
              height={'3.125rem'} width={'100%'}
              font={{size: '1rem'}}
              padding={{top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem'}}
              boxShadow='none'
            ></i-input>
            <i-button
              id="btnAdd"
              icon={{name: 'plus', width: '1rem', height: '1rem', fill: Theme.text.primary}}
              background={{color: 'transparent'}}
              border={{radius: '9999px'}}
              height={50}
              width={50}
              stack={{shrink: '0'}}
              onClick={this.onAddEvent}
            ></i-button>
          </i-hstack>
        </i-panel>
      </i-panel>
    )
  }
}
