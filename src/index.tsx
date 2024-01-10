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
  Input
} from '@ijstech/components'
import { IDate, IEvent } from './interface'
import holidayList from './data/holidays.json';
import './index.css'
import { swipeStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;
const DATES_PER_SLIDE = 35;
const DAYS = 7;
const ROWS = 5;
const defaultHolidayColor = Theme.colors.info.main;
const defaultEventColor = Theme.colors.primary.main;

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
  private pnlSelected: Panel;
  private inputAdd: Input;
  private pnlDates: Panel;

  private datesMap: Map<string, IDate[]> = new Map();
  private gridMap: Map<string, GridLayout> = new Map();
  private eventsMap: Map<string, Control[]> = new Map();
  private selectedMap: Map<string, Control> = new Map();
  private initialDate: Date = new Date();
  private currentDate: Date = new Date();
  private _events: IEvent[] = [];
  private filteredData: any = {};
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private selectedMonth: string = '';
  private selectedString: string = '';

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

  setData({ events }: { events: IEvent[] }) {
    this.listStack.clearInnerHTML();
    this.pnlSelected.clearInnerHTML();
    this.events = events;
    this.pnlSelected.visible = false;
    this.renderMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
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
        >
          <i-grid-layout
            templateRows={['auto']}
            templateColumns={[`repeat(${DAYS}, 1fr)`]}
            width={'100%'}
          ></i-grid-layout>
          <i-grid-layout
            templateRows={['auto']}
            templateColumns={[`repeat(${DAYS}, 1fr)`]}
            width={'100%'} height={'100%'}
            overflow={'hidden'}
            gap={{row: '0.25rem'}}
            padding={{bottom: '0.75rem'}}
            autoRowSize='auto'
            autoFillInHoles={true}
          ></i-grid-layout>
        </i-vstack>
      )
    }

    let dates = [];
    if (this.datesMap.has(monthKey)) {
      dates = this.datesMap.get(monthKey);
    } else {
      dates = this.getDates(month, year);
    }
    for (let i = 0; i < dates.length; i++) {
      const rowIndex = Math.floor(i / DAYS);
      if (!gridDates.children[rowIndex]) break;
      const columnIndex = i % DAYS;
      const item = dates[i];
      const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
      const defaultColor = i === rowIndex * DAYS ? Theme.colors.error.main : Theme.text.primary
      const color = this.isCurrentDate(item) ? Theme.colors.primary.contrastText : defaultColor;
      const bgColor = this.isCurrentDate(item) ? Theme.colors.primary.main : 'transparent';
      const holiday = this.getHoliday(item);
      const events = this.getEventByStartDate(item);

      const el = (
        <i-vstack
          gap="0.125rem"
          horizontalAlignment='center'
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          border={{radius: '0.25rem', width: '1px', style: 'solid', color: 'transparent'}}
          cursor='pointer'
          onClick={(target: VStack, event: MouseEvent) => this.onDateClick(target, event, item, holiday, i === rowIndex * DAYS)}
        >
          <i-label
            caption={item.date}
            font={{size: '1rem', weight: 500, color }}
            opacity={inMonth ? 1 : 0.36}
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem'}}
            border={{radius: '0.125rem'}}
            background={{color: bgColor}}
            class="text-center"
          ></i-label>
        </i-vstack>
      );

      if (holiday) {
        const holidayEl = this.renderHoliday(holiday, columnIndex);
        gridDates.children[rowIndex].children[1].append(holidayEl);
      }
      if (events?.length) {
        for (let event of events) {
          const eventEl = this.renderEvent(event, columnIndex);
          gridDates.children[rowIndex].children[1].append(eventEl);
          if (this.eventsMap.has(monthKey)) {
            const list = this.eventsMap.get(monthKey);
            this.eventsMap.set(monthKey, [...list, eventEl]);
          } else {
            this.eventsMap.set(monthKey, [eventEl]);
          }
        }
      }
      gridDates.children[rowIndex].children[0].append(el);
    }

    const oldMonth = this.gridMap.get(this.selectedMonth);
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
        grid={{column: columnIndex + 1, columnSpan, verticalAlignment: 'center'}}
        border={{radius: '0.25rem'}}
        background={{color: event.color || defaultEventColor}}
        minHeight={3} maxHeight={'1rem'}
        overflow={'hidden'}
        cursor='pointer'
      >
        <i-label
          caption={event.title}
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
      grid={{column: columnIndex + 1, verticalAlignment: 'center'}}
      padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
      minHeight={3} maxHeight={'1rem'}
      overflow={'hidden'}
      cursor='pointer'
    >
      <i-label
        caption={holiday.name}
        wordBreak='break-word'
        lineClamp={2}
        font={{size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500}}
      />
    </i-vstack>
  }

  private renderSelected(data: IDate, holiday: any, events: IEvent[], direction?: 1 | -1) {
    const {month, year, date} = data;
    const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
    this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
    const dateKey = `${date}-${month}-${year}`;
    const selectedPanel = this.selectedMap.get(dateKey);
    if (selectedPanel) return;

    const selectedWrap = <i-vstack
      width={'100%'}
      stack={{shrink: '0', grow: '0', basis: 'auto'}}
      class="scroll-item"
    ></i-vstack>
    const caption = `${date} ${monthName}`;
    selectedWrap.append(
      <i-hstack
        gap={'0.5rem'}
        verticalAlignment='center'
        margin={{top: '1rem'}}
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
        <i-icon
          stack={{shrink: '0'}}
          width='0.75rem' height='0.75rem'
          margin={{left: 'auto'}}
          fill={Theme.text.primary}
          name='smile'
        ></i-icon>
      </i-hstack>
    )
    const eventsStack = <i-vstack width="100%" gap="1rem" margin={{top: '0.5rem'}}></i-vstack>;
    selectedWrap.append(eventsStack);
    this.renderSelectedHoliday(holiday, eventsStack);
    for (let i = 0; i < events.length; i++) {
      this.renderSelectedEvent(events[i], eventsStack, i === events.length - 1);
    }
    this.pnlSelected.append(selectedWrap);
    this.selectedMap.set(dateKey, selectedWrap);
    const oldSelected = this.selectedMap.get(this.selectedString);
    if (oldSelected && direction) {
      if (direction === 1) {
        this.pnlSelected.insertBefore(oldSelected, selectedWrap);
      } else {
        this.pnlSelected.insertBefore(selectedWrap, oldSelected);
      }
    }
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

  private getDates(month: number, year: number) {
    let dates = [];
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = this.daysInMonth(month, year);
    const prevMonthLastDate = new Date(year, month - 1, 0);
    const prevMonth = prevMonthLastDate.getMonth() + 1;
    const prevYear = prevMonthLastDate.getFullYear();
    const prevDate = prevMonthLastDate.getDate();
    const prevDateStr = `${prevYear}-${prevMonth}-${prevDate}`;
    if (firstDay > 0) {
      dates.unshift({ month: prevMonth, year: prevYear, date: prevDate });
      for (let i = 1; i < firstDay; i++) {
        const before = moment(prevDateStr).subtract(i, 'days');
        dates.unshift({ month: prevMonth, year: prevYear, date: before.get('date') });
      }
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({month, year, date: i});
    }

    const fillingDates = DATES_PER_SLIDE - dates.length;
    if (fillingDates > 0) {
      for (let i = 1; i <= fillingDates; i++) {
        const after = moment(`${year}-${month}-${daysInMonth}`).add(i, 'days');
        dates.push({ month: month + 1, year: year, date: after.get('date') });
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
      const checkingDate = moment(`${year}-${month}-${date}`).startOf('day');
      return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
    })
  }

  private getHoliday(item: IDate) {
    const {year, month, date} = item;
    const finded = holidayList.find(holiday => {
      return moment(holiday.date).isSame(moment(`${year}-${month}-${date}`));
    })
    return finded;
  }

  private onDateClick(target: VStack, event: MouseEvent, date: IDate, holiday: any, isSunday: boolean) {
    event.preventDefault();
    event.stopPropagation();
    const events = this.getEvents(date);
    this.resetSelectedDate(date, isSunday);
    if (!holiday && !events?.length) {
      this.pnlSelected.visible = false;
      return;
    }

    this.updateSelected(date, holiday, events);
    this.filteredData.date = date;
    if (this.onFilter) this.onFilter({ date });
  }

  private updateSelected(date: IDate, holiday: any, events: IEvent[], direction?: 1|-1) {
    this.pnlSelected.visible = true;
    this.renderSelected(date, holiday, events, direction);
    // this.selectedDate = target;
    // const label = target.querySelector('i-label') as Control;
    // if (label) {
    //   label.font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
    //   label.background.color = Theme.colors.primary.main;
    // }
  }

  private resetSelectedDate(date: IDate|undefined, isSunday: boolean) {
    if (this.selectedDate) {
      const label = this.selectedDate.querySelector('i-label') as Control;
      if (label) {
        const defaultColor = isSunday ? Theme.colors.error.main : Theme.text.primary;
        label.font = {size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.contrastText : defaultColor};
        label.background.color = 'transparent';
      }
    }
  }

  private onNextMonth() {
    this.selectedMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setMonth(this.initialDate.getMonth() + 1);
    this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear(), 1);
  }

  private onPrevMonth() {
    this.selectedMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setMonth(this.initialDate.getMonth() - 1);
    this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear(), -1);
  }

  private onNextDay() {
    this.selectedString = `${this.initialDate.getDate()}-${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setDate(this.initialDate.getDate() + 1);
    const date = {
      month: this.initialDate.getMonth() + 1,
      year: this.initialDate.getFullYear(),
      date: this.initialDate.getDate()
    }
    const holiday = this.getHoliday(date);
    const events = this.getEvents(date);
    this.updateSelected(date, holiday, events, 1);
  }

  private onPrevDay() {
    this.selectedString = `${this.initialDate.getDate()}-${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
    this.initialDate.setDate(this.initialDate.getDate() - 1);
    const date = {
      month: this.initialDate.getMonth() + 1,
      year: this.initialDate.getFullYear(),
      date: this.initialDate.getDate()
    }
    const holiday = this.getHoliday(date);
    const events = this.getEvents(date);
    this.updateSelected(date, holiday, events, -1);
  }

  // private onCurrent() {
  //   this.initialDate = new Date();
  //   this.currentDate = new Date();
  //   this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
  // }

  private onFilterData(target: Button) {
    const children = target.parent?.children || [];
    for (let child of children) {
      if (child.id === target.id) {
        child.background.color = Theme.background.default;
        child.font.color = Theme.text.primary;
      } else {
        child.background.color = 'transparent';
        child.font.color = Theme.text.secondary;
      }
    }
    this.filteredData.type = target.caption;
    if (this.onFilter) this.onFilter({ type: target.caption });
  }

  private onAddEvent() {
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseDown(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('#listStack');
      const pnlSelected = target.closest('#pnlSelected');
      if (sliderList || pnlSelected) {
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
      const pnlSelected = target.closest('#pnlSelected');
      if (sliderList || pnlSelected) {
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
      const pnlSelected = target.closest('#pnlSelected');
      if (pnlSelected) {
        this.dragSelectedEndHandler(event);
        return true;
      }
    }
    return false;
  }

  dragStartHandler(event: MouseEvent | TouchEvent) {
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
  }

  dragHandler(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].clientX,
        y: this.pos1.y - event.touches[0].clientY
      }
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: this.pos1.y - event.clientY
      }
    }
  }

  dragEndHandler(event: MouseEvent | TouchEvent) {
    const threshold = this.pnlWrapper.offsetWidth * 0.3;
    if (this.pos2.x < -threshold) {
      this.onPrevMonth();
      this.listStack.scrollTo({
        left: this.listStack.scrollLeft - this.pnlWrapper.offsetWidth,
        behavior: 'smooth',
      });
    } else if (this.pos2.x > threshold) {
      this.onNextMonth();
      this.listStack.scrollTo({
        left: this.listStack.scrollLeft + this.pnlWrapper.offsetWidth,
        behavior: 'smooth',
      });
    }
  }

  dragSelectedEndHandler(event: MouseEvent | TouchEvent) {
    const threshold = this.pnlWrapper.offsetWidth * 0.2;
    if (this.pos2.x < -threshold) {
      this.onPrevDay();
      this.listStack.scrollTo({
        left: this.pnlSelected.scrollLeft - this.pnlWrapper.offsetWidth,
        behavior: 'smooth',
      });
    } else if (this.pos2.x > threshold) {
      this.onNextDay();
      this.pnlSelected.scrollTo({
        left: this.listStack.scrollLeft + this.pnlWrapper.offsetWidth,
        behavior: 'smooth',
      });
    }
  }

  updateHeight() {
    const threshold = this.pnlWrapper.offsetHeight * 0.3;
    if (this.pos2.y < -threshold) {
      this.pnlSelected.visible = true;
    } else if (this.pos2.y > threshold) {
      this.pnlSelected.visible = false;
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
      <i-panel id="pnlWrapper">
        <i-vstack
          width='100%' height={'calc(100dvh - 3.125rem)'} overflow={'hidden'}
          padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
          gap="1rem"
        >
          <i-vstack
            id="pnlDates"
            stack={{ grow: '1', shrink: '1', basis: 'auto'}}
            minHeight={200}
            overflow={{y: 'auto'}}
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
          <i-hstack
            id="pnlSelected"
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}}}
            stack={{ grow: '1', shrink: '1', basis: 'auto'}}
            minHeight={'50%'}
            overflow={{x: 'auto'}}
            class={swipeStyle}
            visible={false}
          ></i-hstack>
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
