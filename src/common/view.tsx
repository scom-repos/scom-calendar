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
  VStack,
  Styles,
  moment,
  CarouselSlider,
  StackLayout
} from '@ijstech/components'
import { IDate, IEvent, IHoliday, IViewMode } from '../interface'
import { IViewStyle, eventSliderStyle, getViewStyle, swipeStyle, transitionStyle } from './view.css';
import assets from '../assets';

const Theme = Styles.Theme.ThemeVars;
const DATES_PER_SLIDE = 42;
const DAYS = 7;
const ROWS = 6;
const defaultHolidayColor = Theme.colors.info.main;
const defaultEventColor = Theme.colors.primary.main;
const currentColor = Theme.colors.secondary.main;

type callbackType = (data: IEvent, event: MouseEvent) => void;
type swipeCallbackType = () => boolean;
type selectCallbackType = (date: string) => void;
type onMonthChangedCallbackType = (value: {month: number, year: number}) => void;

interface ScomCalendarViewElement extends ControlElement {
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar--view"]: ScomCalendarViewElement;
    }
  }
}

@customModule
@customElements('i-scom-calendar--view')
export class ScomCalendarView extends Module {
  private pnlWrapper: VStack;
  private gridHeader: GridLayout;
  private listStack: HStack;
  private pnlSelectedDate: VStack;
  private pnlDates: Panel;
  private pnlSelected: Panel;
  private eventSlider: CarouselSlider;

  private datesMap: Map<string, IDate[]> = new Map();
  private monthsMap: Map<string, StackLayout> = new Map();
  private selectedMap: Map<string, Control> = new Map();
  private initialDate: Date = new Date();
  private currentDate: Date = new Date();
  private oldMonth: string = '';
  private initalDay: number = 0;
  private currentMonth: { month: number, year: number };
  private currentStyle: string = '';
  private selectedDate: Date;

  private _data: IViewData;

  onEventClicked: callbackType;
  onDateClicked: selectCallbackType;
  onSwiping: swipeCallbackType;
  onMonthChanged: onMonthChangedCallbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomCalendarViewElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get holidays() {
    return this._data.holidays || [];
  }
  set holidays(value: IHoliday[]) {
    this._data.holidays = value || [];
  }

  get events() {
    return this._data.events || [];
  }
  set events(value: IEvent[]) {
    this._data.events = value || [];
  }

  get mode () {
    return this._data.mode ?? 'full';
  }
  set mode(value: IViewMode) {
    this._data.mode = value ?? 'full';
  }

  get date () {
    return this._data.date;
  }
  set date(value: string) {
    this._data.date = value;
  }

  get isPicker () {
    return this._data.isPicker ?? false;
  }
  set isPicker(value: boolean) {
    this._data.isPicker = value ?? false;
  }

  get activeItemScrollTop () {
    const controls = (this.eventSlider.items[this.eventSlider.activeSlide] as any)?.controls;
    return controls?.[0]?.scrollTop || 0;
  }

  get isMonthEventShown() {
    return this._data.isMonthEventShown ?? false;
  }
  set isMonthEventShown(value: boolean) {
    this._data.isMonthEventShown = value ?? false;
  }

  private isCurrentDate(date: IDate) {
    if (!date) return false;
    return this.currentDate.getDate() === date.date &&
      this.currentDate.getMonth() + 1 === date.month &&
      this.currentDate.getFullYear() === date.year
  }

  private get initialData() {
    const month = this.initialDate.getMonth() + 1;
    const year = this.initialDate.getFullYear();
    const date = this.initialDate.getDate();
    const day = this.initialDate.getDay();
    return {
      month,
      year,
      date,
      day
    }
  }

  private get monthKey() {
    return `${this.initialData.month}-${this.initialData.year}`
  }

  private get datesInMonth() {
    const { month, year } = this.initialData;
    let dates: IDate[] = [];
    if (this.datesMap.has(this.monthKey)) {
      dates = this.datesMap.get(this.monthKey);
    } else {
      dates = this.getDates(month, year);
    }
    return dates;
  }

  private get isWeekMode() {
    return this.mode === 'week';
  }

  private getDatesHeightByMode(): string {
    if (this.mode === 'full') return '100%';
    if (this.mode === 'week') return '101px';
    const viewHeight = this.offsetHeight || this.pnlWrapper.offsetHeight;
    if (viewHeight < 408) {
      return '255px';
    } else if (viewHeight < 438) {
      return '285px';
    } else if (viewHeight < 468) {
      return '315px';
    } else {
      return '345px';
    }
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

  private get calendarData() {
    const eventsMap = {}
    for (let i = 0; i < this.datesInMonth.length; i++) {
      const item = this.datesInMonth[i];
      const holiday = this.getHoliday(item);
      const events = this.getEvents(item);
      const dateKey = `${item.date}-${item.month}-${item.year}`
      eventsMap[dateKey] = { holiday, events };
    }
    return eventsMap;
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
    const finded = this.holidays.find(holiday => {
      return moment(holiday.date).isSame(moment(`${month}/${date}/${year}`));
    })
    return finded;
  }

  setData(data: IViewData) {
    this._data = data;
    this.initialDate = this.date ? new Date(this.date) : new Date();
    this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
    this.clear();
    this.renderUI();
  }

  private renderUI(direction?: number) {
    const { month, year } = this.initialData;
    this.renderMonth(month, year, direction);
    this.eventSlider.visible = !this.isPicker;
    if (!this.isPicker) {
      this.renderEventSlider();
    }
  }

  clear() {
    this.listStack.clearInnerHTML();
    this.mode = 'full';
    this.monthsMap = new Map();
    this.selectedMap = new Map();
    this.initalDay = this.initialDate.getDay();
    this.currentDate = new Date();
    const { event } = this.updateDatesHeight();
    this.updateStyle({
      month: { grow: this.isWeekMode ? '1' : '0', direction: this.isWeekMode ? 'row' : 'column' },
      week: { grow: this.isWeekMode ? '0' : '1', basis: this.isWeekMode ? '100%' : '20%' },
      border: this.isPicker ? Theme.background.main : Theme.divider,
      event
    });
  }

  private updateStyle(value: IViewStyle) {
    const { border, month, week, event } = value;
    this.style.setProperty('--border-color', border);
    this.style.setProperty('--grow', month.grow);
    this.style.setProperty('--inner-grow', week.grow);
    this.style.setProperty('--inner-basis', week.basis);
    // this.style.setProperty('--event-min-height', event.minHeight);
    // this.style.setProperty('--event-height', event.height);
    // this.style.setProperty('--event-opacity', event.opacity);
    if (this.currentStyle) this.listStack.classList.remove(this.currentStyle);
    this.currentStyle = getViewStyle(value);
    this.listStack.classList.add(this.currentStyle);
    this.style.setProperty('--direction', this.isWeekMode ? 'row' : 'column');
    this.pnlSelected.height = this.mode === 'full' ? 0 : 'auto';
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

  private renderMonth(month: number, year: number, direction?: number) {
    const gridMonth = this.monthsMap.get(this.monthKey);
    if (gridMonth) {
      this.updateOldDate();
      this.updateNewDate({ date: this.initialDate.getDate(), month: month, year: year });
      return;
    }
    this.selectedDate = new Date(this.initialDate);

    const gridDates = <i-stack
      direction='vertical'
      width={'100%'}
      stack={{shrink: '0', grow: 'var(--grow, 0)'}}
      overflow={{x: 'auto', y: 'hidden'}}
      class={`${swipeStyle} month-row`}
      position='relative'
    ></i-stack>
    gridDates.setAttribute('data-month', this.monthKey);

    for (let i = 0; i < ROWS; i++) {
      gridDates.append(
        <i-grid-layout
          border={{top: {width: '1px', style: 'solid', color: 'var(--border-color)'}}}
          width={'100%'}
          templateRows={['1fr']}
          templateColumns={[`repeat(${DAYS}, 1fr)`]}
          gap={{ column: '0.25rem' }}
          stack={{shrink: 'var(--inner-grow, 1)', grow: 'var(--inner-grow, 1)', basis: 'var(--inner-basis, 20%)'}}
          overflow={{x: 'auto', y: 'hidden'}}
          position='relative'
          class="week-row"
        ></i-grid-layout>
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
      const { holiday = null, events = [] } = this.calendarData[`${item.date}-${item.month}-${item.year}`] || {};
      const isSelectedDate = inMonth && this.initialDate.getDate() === item.date;
      const borderColor = isSelectedDate ? Theme.colors.primary.main : Theme.background.main;
      const el = (
        <i-vstack
          gap="0.125rem"
          margin={{top: '0.125rem', bottom: '0.125rem'}}
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          border={{radius: '0.25rem', width: '1px', style: 'solid', color: borderColor}}
          cursor='pointer'
          overflow={'hidden'}
          onClick={(target: VStack, event: MouseEvent) => this.onDateClick(target, event, item)}
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
      el.setAttribute('data-week', `${rowIndex}`);
      if (holiday) {
        const holidayEl = this.renderHoliday(holiday, columnIndex);
        el.append(holidayEl);
      }
      if (events?.length) {
        for (let event of events) {
          const eventEl = this.renderEvent(event, columnIndex);
          el.append(eventEl);
        }
      }
      gridDates.children[rowIndex].append(el);
      if (isSelectedDate) {
        this.updateOldDate();
        this.pnlSelectedDate = el;
      }
    }

    const oldMonth = this.monthsMap.get(this.oldMonth);
    this.listStack.append(gridDates);
    if (oldMonth && direction) {
      if (direction === 1) {
        this.listStack.insertBefore(oldMonth, gridDates);
      } else {
        this.listStack.insertBefore(gridDates, oldMonth);
      }
    }

    this.datesMap.set(`${month}-${year}`, dates);
    this.monthsMap.set(`${month}-${year}`, gridDates);
  }

  private renderEvent(event: IEvent, columnIndex: number) {
    // const spanDays = moment(event.endDate).startOf('day').diff(moment(event.startDate).startOf('day'), 'days');
    // const columnSpan = spanDays === 0 ? 1 : spanDays;
    const eventEl = (
      <i-vstack
        grid={{column: columnIndex + 1, columnSpan: 1, verticalAlignment: 'start'}}
        border={{radius: '0.25rem'}}
        background={{color: event.color || defaultEventColor}}
        // minHeight={'var(--event-min-height, 3px)'} maxHeight={'100%'}
        // height={'var(--event-height, auto)'}
        padding={{left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem'}}
        overflow={'hidden'}
        cursor='pointer'
        class="event"
      >
        <i-label
          caption={event.title}
          // opacity={'var(--event-opacity, 1)'}
          lineHeight={'1rem'}
          font={{size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500}}
          textOverflow='ellipsis'
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
      maxHeight={'100%'}
      // minHeight={'var(--event-min-height, 3px)'}
      // height={'var(--event-height, auto)'}
      overflow={'hidden'}
      cursor='pointer'
      class="event"
    >
      <i-label
        caption={holiday.name}
        // opacity={'var(--event-opacity, 1)'}
        lineHeight={'1rem'}
        wordBreak='break-word'
        lineClamp={2}
        font={{size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500}}
      />
    </i-vstack>
  }

  private renderEventSlider() {
    const itemsData = [];
    let activeIndex = 0;
    const currentDate = this.initialDate.getDate();
    const currentMonth = this.initialDate.getMonth() + 1;
    for (let i = 0; i < this.datesInMonth.length; i++) {
      const date = this.datesInMonth[i];
      const { holiday = null, events = [] } = this.calendarData[`${date.date}-${date.month}-${date.year}`] || {};
      const eventEl = this.renderSliderItem(date, holiday, events);
      itemsData.push({
        name: '',
        controls: [eventEl]
      })
      if (currentDate === date.date && currentMonth === date.month) {
        activeIndex = i;
      }
    }
    this.eventSlider.items = itemsData;
    this.eventSlider.activeSlide = activeIndex;
  }

  private renderSliderItem(item: IDate, holiday: any, events: IEvent[]) {
    const {date, month, year} = item;
    const dateKey = `${date}-${month}-${year}`;
    const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
    const selectedPanel = this.selectedMap.get(dateKey);
    if (selectedPanel) return;

    const selectedWrap = (
      <i-vstack
        width={'100%'}
        height='100%'
        overflow={{ y: 'auto' }}
        padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
      ></i-vstack>
    )
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
        stack={{ shrink: '0' }}
      >
        <i-hstack
          gap={'0.5rem'}
          verticalAlignment='center'
          horizontalAlignment='space-between'
        >
          <i-label caption={caption} font={{size: '0.75rem', weight: 600}}></i-label>
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
    if (!holiday && !events?.length) {
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

  private handleEventClick(data: IEvent, event?: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.onEventClicked) this.onEventClicked(data, event);
  }

  private renderSelectedEvent(event: IEvent, parent: Control, isLast: boolean) {
    const startDate = moment(event.startDate);
    const endDate = moment(event.endDate);
    let txtTime = "";
    if (startDate && endDate) {
      const isSameDay = startDate.isSame(endDate, 'day');
      const isSameYear = startDate.isSame(endDate, 'year');
      const endDateFormat = isSameDay ? 'HH:mm' : isSameYear ? 'MMM DD, HH:mm' : 'MMM DD YYYY, HH:mm';
      txtTime = `${startDate.format('HH:mm')} - ${endDate.format(endDateFormat)}`;
    } else if (startDate) {
      txtTime = `${startDate.format('HH:mm')}`;
    }
    const startTime = moment(event.startDate).format('HH:mm');
    const endTime = moment(event.endDate).format('HH:mm');
    let iconAttr = {};
    if (event.link?.startsWith('https://meet.google.com/')) {
      iconAttr = { image: { url: assets.fullPath('img/google-drive.png'), width: '1rem', height: '1rem', display: 'inline-block' } };
    } else {
      iconAttr = { width: '1rem', height: '1rem', name: 'globe' }
    }
    parent.appendChild(
      <i-panel
        border={{bottom: {width: '1px', style: isLast ? 'none' :'solid', color: Theme.divider}}}
        cursor='pointer'
        onClick={(t, e) => this.handleEventClick(event, e)}
      >
        <i-hstack
          padding={{top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem'}}
          gap={'0.25rem'}
          horizontalAlignment='space-between'
        >
          <i-hstack gap={'0.25rem'} stack={{grow: '1'}}>
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
              <i-label caption={txtTime} font={{size: '0.75rem', weight: 500}} opacity={0.36}></i-label>
            </i-vstack>
          </i-hstack>
          <i-icon
            cursor='pointer'
            stack={{shrink: '0'}}
            onClick={() => window.open(event.link, '_blank')}
            visible={!!event.link}
            {...iconAttr}
          ></i-icon>
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

  private onDateClick(target: VStack, event: MouseEvent, date: IDate) {
    event.preventDefault();
    event.stopPropagation();
    const isSwiping = this.onSwiping ? this.onSwiping() : false;
    if (isSwiping) return;

    this.updateOldDate();
    let direction;
    const oldDate = new Date(this.initialData.year, this.initialData.month - 1, this.initialData.date);
    this.initialDate = new Date(date.year, date.month - 1, date.date);
    this.initalDay = this.initialDate.getDay();
    this.updateNewDate(date);
    if (oldDate.getMonth() !== this.initialDate.getMonth()) direction = oldDate < this.initialDate ? 1 : -1;
    if (!this.isPicker && direction) {
      if (this.mode !== 'week')
        this.onSwipeMonthEvents(direction);
      else
        this.onSwipeWeek(direction);
    }
    const { month, year } = this.currentMonth;
    const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date.date && d.month === date.month);
    this.eventSlider.activeSlide = index;

    if (this.onDateClicked) this.onDateClicked(this.initialDate.toISOString());
  }

  private updateOldDate() {
    if (this.pnlSelectedDate) {
      this.pnlSelectedDate.border.radius = '0.25rem';
      this.pnlSelectedDate.border.width = '1px';
      this.pnlSelectedDate.border.style = 'solid';
      this.pnlSelectedDate.border.color = Theme.background.main;
      this.selectedDate = null;
    }
  }

  private updateNewDate(data: IDate) {
    const { date, month, year } = data;
    const { month: mMonth, year: mYear } = this.currentMonth;
    this.selectedDate = new Date(year, month, date);
    const dataDate = `${date}-${month}-${year}`;
    const monthTarget = this.listStack.querySelector(`[data-month="${mMonth}-${mYear}"]`) as Control;
    const target = monthTarget?.querySelector(`[data-date="${dataDate}"]`) as VStack;
    if (target) {
      this.pnlSelectedDate = target;
      target.border = {radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important`};
    }
  }

  private updateDatesHeight() {
    const height = this.getDatesHeightByMode();
    this.pnlDates.height = height;
    if (this.mode === 'full') {
      this.listStack.classList.add('--full');
    } else {
      this.listStack.classList.remove('--full');
    }

    const opacity = this.mode !== 'full' ? '0' : '1';
    return {
      height: height,
      event: {
        opacity,
        height: opacity === '0' ? '3px' : 'auto',
        minHeight: opacity === '0' ? '0px' : '20px'
      }
    }
  }

  private onMonthChangedFn(direction: number, isStartOfMonth?: boolean) {
    this.oldMonth = `${this.currentMonth.month}-${this.currentMonth.year}`;
    const month = this.currentMonth.month - 1 + direction;
    if (isStartOfMonth) {
      const currentDate = new Date();
      const date = currentDate.getFullYear() === this.initialDate.getFullYear() && currentDate.getMonth() === month ? currentDate.getDate() : 1;
      this.initialDate = new Date(this.initialDate.getFullYear(), month, date);
    } else {
      this.initialDate.setMonth(month);
    }
    this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
    this.renderUI(direction);
    if (this.onMonthChanged) this.onMonthChanged({...this.currentMonth});
  }

  private onSlideChanged(index: number) {
    const { month, year } = this.currentMonth;
    const dates = this.datesMap.get(`${month}-${year}`);
    const newDate = dates[index];
    this.onSelectedDateChanged(newDate, index);
  }

  private onSelectedDateChanged(data: IDate, index: number) {
    this.updateOldDate();
    const oldDate = new Date(this.initialData.year, this.initialData.month - 1, this.initialData.date);
    const oldDay = this.initialDate.getDay();
    const { date, month, year } = data;
    this.initialDate = new Date(year, month - 1, date);
    if (oldDate.getTime() === this.initialDate.getTime()) this.initialDate.setDate(date - 1);
    this.initalDay = this.initialDate.getDay();
    this.updateNewDate(data);
    const isMonthChanged = oldDate.getMonth() !== this.initialDate.getMonth();
    const direction = oldDate < this.initialDate ? 1 : -1;
    if (this.isWeekMode) {
      if (isMonthChanged) {
        this.onSwipeWeek(direction, true);
      } else if (oldDay === 6 && (this.initalDay === 6 || this.initalDay === 0)) {
        this.onSwipeWeek(1);
      } else if (oldDay === 0 && (this.initalDay === 6 || this.initalDay === 0)) {
        this.onSwipeWeek(-1);
      }
    } else if (this.mode === 'month') {
      if (isMonthChanged) {
        this.onSwipeMonthEvents(direction);
      } else if (this.initalDay === 6 && index === 34) {
        this.onSwipeMonthEvents(1);
      } else if (this.initalDay === 0 && index === 0) {
        this.onSwipeMonthEvents(-1);
      }
    }
  }

  private animateFn(framefn: any) {
    const duration = 300;
    const easing = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animateScroll = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const easedProgress = easing(progress);

      framefn(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    const startTime = performance.now();
    requestAnimationFrame(animateScroll);
  }

  onSwipeFullMonth(direction?: number, isStartOfMonth?: boolean) {
    this.mode = 'full';
    const { event } = this.updateDatesHeight();
    this.updateStyle({
      month: { grow: '0', direction: 'column' },
      week: { grow: '1', basis: '20%' },
      border: this.isPicker ? Theme.background.main : Theme.divider,
      event
    });

    if (direction) {
      this.onMonthChangedFn(direction, isStartOfMonth);
      this.onScroll(this.listStack, direction);
    }
    return {...this.currentMonth};
  }

  onSwipeMonthEvents(direction?: number, isStartOfMonth?: boolean) {
    this.mode = 'month';
    const { event } = this.updateDatesHeight();
    this.updateStyle({
      month: { grow: '0', direction: 'column' },
      week: { grow: '1', basis: '100%' },
      border: Theme.background.main,
      event
    });

    if (direction) {
      this.onMonthChangedFn(direction, isStartOfMonth);
      this.onScroll(this.listStack, direction);
    }
    // const { date } = this.initialData;
    // const { month, year } = this.currentMonth;
    // this.updateOldDate();
    // this.updateNewDate({date, month, year});
    // const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date && d.month === month);
    // this.eventSlider.activeSlide = index;
  }

  onSwipeWeek(direction?: number, outOfMonth?: boolean) {
    this.mode = 'week';
    const { event } = this.updateDatesHeight();
    this.updateStyle({
      month: { grow: '1', direction: 'row' },
      week: { grow: '0', basis: '100%' },
      border: Theme.background.main,
      event
    });

    const { month, year } = this.currentMonth;
    let monthEl = this.monthsMap.get(`${month}-${year}`);
    if (!monthEl) return;

    if (!direction) {
      if (this.pnlSelectedDate) {
        const week = this.pnlSelectedDate.getAttribute('data-week') || 0;
        if (week) {
          const startScrollLeft = monthEl.scrollLeft;
          const targetScrollLeft = monthEl.scrollLeft + (Number(week) * monthEl.offsetWidth);
          this.animateFn((progress: number) => {
            monthEl.scrollTo({
              left: startScrollLeft + (targetScrollLeft - startScrollLeft) * progress
            })
          })
        }
      }
      return;
    }

    const threshold = this.listStack.offsetWidth * 4;
    if (outOfMonth == null) outOfMonth = (monthEl.scrollLeft > threshold && direction === 1) || (monthEl.scrollLeft === 0 && direction === -1);
    if (!outOfMonth) {
      const week = Math.round(monthEl.scrollLeft / this.listStack.offsetWidth) + direction;
      const dateEl = monthEl.children?.[week]?.children?.[this.initalDay] as VStack;
      if (dateEl) {
        const dateData = dateEl.getAttribute('data-date');
        const [date, month, year] = dateData.split('-');
        if (this.initialDate.getMonth() !== month - 1) {
          outOfMonth = true;
        }
      }
    }
    if (outOfMonth) {
      this.initialDate = new Date(year, month - 1, 1);
      this.onMonthChangedFn(direction);
      const { month: newMonth, year: newYear } = this.initialData;
      const newMonthEl = this.monthsMap.get(`${newMonth}-${newYear}`);
      this.onScroll(this.listStack, direction);

      let factor = direction === 1 ? 0 : 5;
      const newDateEl = newMonthEl.children?.[factor]?.children?.[this.initalDay] as VStack;
      if (newDateEl) {
        const dateData = newDateEl.getAttribute('data-date');
        const [date, month, year] = dateData.split('-');
        if (newMonth != month) {
          factor += direction;
          if (direction < 0 && date >= 8) factor += direction;
        }
      }
      newMonthEl.scrollLeft = factor * newMonthEl.offsetWidth;
      this.activeDateWeek(newMonthEl, factor);
    } else {
      this.onScroll(monthEl, direction);
      const week = Math.round(monthEl.scrollLeft / this.listStack.offsetWidth) + direction;
      this.activeDateWeek(monthEl, week);
    }
  }

  private activeDateWeek(monthEl: Control, week: number) {
    const dateEl = monthEl.children?.[week]?.children?.[this.initalDay] as VStack;
    if (dateEl) {
      this.updateOldDate();
      const dateData = dateEl.getAttribute('data-date');
      const [date, month, year] = dateData.split('-');
      if (date) {
        this.selectedDate = new Date(year, month, date);
        this.initialDate = new Date(year, month - 1, Number(date));
        const { month: currentMonth, year: currentYear } = this.currentMonth;
        const index = this.datesMap.get(`${currentMonth}-${currentYear}`).findIndex(d => d.date === Number(date) && d.month === Number(month));
        this.eventSlider.activeSlide = index;
        this.pnlSelectedDate = dateEl;
        dateEl.border = {radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important`};
      }
    }
  }

  private onScroll(parent: Control, direction: number) {
    if (!direction) return;
    const containerWidth = this.listStack.offsetWidth;
    const index = Math.round(parent.scrollLeft / containerWidth);
    const startScrollLeft = index * containerWidth;

    let targetScrollLeft = 0;
    if (parent.id === 'listStack') {
      const monthIndex = Array.from(this.listStack.children).findIndex(c => (c as Control).dataset.month === `${this.currentMonth.month}-${this.currentMonth.year}`);
      targetScrollLeft = monthIndex * containerWidth;
    } else {
      targetScrollLeft = startScrollLeft + (direction * containerWidth)
    }
    this.smoothScroll(parent, targetScrollLeft, true);
  }

  private testSupportsSmoothScroll(): boolean {
    let supports = false;

    try {
      let div = document.createElement('div');
      div.scrollTo({
        top: 0,
        get behavior() {
          supports = true;
          return 'smooth' as any;
        },
      });
    } catch (err) {}
    return supports;
  }

  private smoothScroll(node: HTMLElement, topOrLeft: number, horizontal?: boolean): void {
    const hasNativeSmoothScroll = this.testSupportsSmoothScroll()
    if (hasNativeSmoothScroll) {
      return (node as Element).scrollTo({
        [horizontal ? 'left' : 'top']: topOrLeft,
        behavior: 'smooth',
      });
    } else {
      this.smoothScrollPolyfill(node, horizontal ? 'scrollLeft' : 'scrollTop', topOrLeft);
    }
  }

  private smoothScrollPolyfill(node: HTMLElement, key: string, target: number): () => void {
    const startTime = Date.now();
    const offset = node[key] as number;
    const gap = target - offset;
    const duration = 1000;
    let interrupt = false;

    const easingOutQuint = (x: number, t: number, b: number, c: number, d: number): number =>
      c * ((t = t / d - 1) * t * t * t * t + 1) + b;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const percentage = elapsed / duration;

      if (interrupt) {
        return;
      }

      if (percentage > 1) {
        cleanup();
        return;
      }

      node[key] = easingOutQuint(0, elapsed, offset, gap, duration);
      requestAnimationFrame(step);
    };

    const cancel = () => {
      interrupt = true;
      cleanup();
    };

    const cleanup = () => {
      node.removeEventListener('wheel', cancel);
      node.removeEventListener('touchstart', cancel);
    };

    node.addEventListener('wheel', cancel, { passive: true });
    node.addEventListener('touchstart', cancel, { passive: true });

    step();
    return cancel;
  }

  init() {
    super.init()
    this.onSwiping = this.getAttribute('onSwiping', true) || this.onSwiping;
    this.onEventClicked = this.getAttribute('onEventClicked', true) || this.onEventClicked;
    this.onDateClicked = this.getAttribute('onDateClicked', true) || this.onDateClicked;
    this.onMonthChanged = this.getAttribute('onMonthChanged', true) || this.onMonthChanged;
    const holidays = this.getAttribute('holidays', true);
    const events = this.getAttribute('events', true);
    const mode = this.getAttribute('mode', true, 'full');
    const date = this.getAttribute('date', true);
    const isPicker = this.getAttribute('isPicker', true, false);
    const isMonthEventShown = this.getAttribute('isMonthEventShown', true);
    this.renderHeader();
    this.setData({ holidays, events, mode, date, isPicker, isMonthEventShown });
  }

  render(): void {
    return (
      <i-vstack
        id="pnlWrapper"
        width='100%' height="100%"
        overflow={'hidden'}
        gap="1rem"
      >
        <i-vstack
          id="pnlDates"
          width={'100%'}
          maxHeight={'100%'}
          overflow={'hidden'}
          // class={transitionStyle}
          stack={{ shrink: '0' }}
        >
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
        >
          <i-carousel-slider
            id="eventSlider"
            class={eventSliderStyle}
            swipe={true}
            width={'100%'} height={'100%'}
            indicators={false}
            autoplay={false}
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
            onSlideChange={this.onSlideChanged}
          ></i-carousel-slider>
        </i-panel>
      </i-vstack>
    )
  }
}
