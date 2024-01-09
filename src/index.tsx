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
  Button
} from '@ijstech/components'
import { ICalendar, IDate, IEvent } from './interface'
import './index.css'
import { aspectRatioStyle, closeIconStyle, transitionStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

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
  private gridHeader: GridLayout;
  private listStack: HStack;
  private lbMonth: Label;
  private lbYear: Label;
  private selectedDate: VStack;
  private pnlSelected: Panel;
  private pnlNotSelected: Panel;
  private gridEvents: GridLayout;

  private dayMap: Map<string, Label> = new Map();
  private datesMap: Map<string, IDate[]> = new Map();
  private initialDate: Date = new Date();
  private currentDate: Date = new Date();
  private _events: IEvent[] = [];
  private filteredData: any = {};

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

  setData({ events }: { events: IEvent[] }) {
    this.events = events;
    this.pnlNotSelected.visible = true;
    this.pnlSelected.visible = false;
    this.renderMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
  }

  private isCurrentDate(date: IDate) {
    if (!date) return false;
    return this.currentDate.getDate() === date.date &&
      this.currentDate.getMonth() + 1 === date.month &&
      this.currentDate.getFullYear() === date.year
  }

  private renderHeader() {
    this.gridHeader.clearInnerHTML();
    this.dayMap = new Map();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 0; i < days.length; i++) {
      const color = i === 0 ? Theme.colors.error.main : Theme.text.primary;
      const el = <i-label
        caption={days[i]}
        font={{size: '0.875rem', weight: 500, color }}
        opacity={0.7}
        padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
        lineHeight={'1.5rem'}
        class="text-center"
      ></i-label>;
      this.gridHeader.append(el);
      this.dayMap.set(days[i], el);
    }
  }

  private renderMonth(month: number, year: number) {
    this.listStack.clearInnerHTML();
    this.gridEvents.clearInnerHTML();
    this.lbMonth.caption = moment(this.initialDate).format('MMMM');
    this.lbYear.caption = moment(this.initialDate).format('YYYY');
    this.lbYear.visible = this.initialDate.getFullYear() !== this.currentDate.getFullYear();
    const gridDates = <i-grid-layout
      templateRows={['repeat(6, 1fr)']}
      templateColumns={['repeat(7, 1fr)']}
      width={'100%'}
    ></i-grid-layout>
    const event1 = (
      <i-vstack grid={{column: 3, row: 3, columnSpan: 3}}>
        <i-label caption='Event 1'></i-label>
      </i-vstack>
    ) as Control
    gridDates.append(event1)
    let dates = [];
    if (this.datesMap.has(`${month}-${year}`)) {
      dates = this.datesMap.get(`${month}-${year}`);
    } else {
      dates = this.getDates(month, year);
    }
    for (let item of dates) {
      const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
      const isEnabled = this.hasData(item);
      const el = <i-vstack
          gap="0.125rem" horizontalAlignment='center' verticalAlignment='center'
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          class={aspectRatioStyle}
          border={{radius: '100%'}}
          cursor={isEnabled ? 'pointer' : 'default'}
          hover={{backgroundColor: isEnabled ? Theme.action.hoverBackground : 'transparent'}}
          onClick={(target: VStack) => this.onDateClick(target, item)}
        >
          <i-label
            caption={item.date}
            font={{size: '0.875rem', weight: 500, color: this.isCurrentDate(item) ? Theme.colors.primary.dark : Theme.text.primary }}
            opacity={inMonth ? 1 : 0.36}
            lineHeight={'1rem'}
            class="text-center"
          ></i-label>
          <i-panel
            width={'0.313rem'} height={'0.313rem'}
            border={{radius: '100%'}}
            background={{color: Theme.text.primary}}
            stack={{shrink: '0'}}
            opacity={isEnabled ? 0.36 : 0}
          ></i-panel>
        </i-vstack>;
      gridDates.append(el);
    }
    this.listStack.append(gridDates);
    this.datesMap.set(`${month}-${year}`, dates);
  }

  private renderSelected(data: IDate) {
    this.pnlSelected.clearInnerHTML();
    const {month, year, date} = data;
    const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'long' });
    const caption = `${monthName} ${date}`;
    this.pnlSelected.append(
      <i-label caption={caption} font={{size: '0.875rem', weight: 500}}></i-label>,
      <i-icon
        stack={{shrink: '0'}}
        cursor='pointer'
        border={{radius: '100%'}}
        tooltip={{content: 'Close', placement: 'top'}}
        padding={{top: '0.325rem', bottom: '0.325rem', left: '0.325rem', right: '0.325rem'}}
        background={{color: Theme.colors.secondary.light}}
        name='times'
        width='1rem' height='1rem'
        fill={Theme.text.primary}
        class={closeIconStyle}
        onClick={() => this.onCloseClick(data)}
      ></i-icon>
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

    const fillingDates = 42 - dates.length;
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

  private hasData(item: IDate) {
    const finded = this.events.find(event => {
      const date = moment(event.startDate);
      if (date.get('month') + 1 === item.month && date.get('year') === item.year && date.get('date') === item.date) {
        return true;
      }
    })
    return !!finded;
  }

  private onDateClick(target: VStack, date: IDate) {
    if (!this.hasData(date)) return;
    this.renderSelected(date);
    this.resetSelectedDate(date, true);
    this.selectedDate = target;
    target.background.color = Theme.colors.primary.dark;
    const label = target.querySelector('i-label');
    if (label) (label as Label).font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
    const point = target.querySelector('i-panel');
    if (point) (point as Control).background.color = Theme.colors.primary.contrastText;
    this.filteredData.date = date;
    if (this.onFilter) this.onFilter({ date });
  }

  private onCloseClick(date: IDate) {
    this.resetSelectedDate(date, false);
    if (this.onFilter) this.onFilter();
  }

  private resetSelectedDate(date: IDate|undefined, isSelected: boolean) {
    this.pnlNotSelected.visible = !isSelected;
    this.pnlSelected.visible = isSelected;
    if (this.selectedDate) {
      this.selectedDate.background.color = 'transparent';
      const label = this.selectedDate.querySelector('i-label');
      if (label) (label as Label).font = {size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.dark : Theme.text.primary }
      const point = this.selectedDate.querySelector('i-panel');
      if (point) (point as Control).background.color = Theme.text.primary;
    }
  }

  private onNext() {
    this.initialDate.setMonth(this.initialDate.getMonth() + 1);
    this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
  }

  private onPrev() {
    this.initialDate.setMonth(this.initialDate.getMonth() - 1);
    this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
  }

  private onCurrent() {
    this.initialDate = new Date();
    this.currentDate = new Date();
    this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
  }

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

  init() {
    super.init()
    this.onFilter = this.getAttribute('onFilter', true) || this.onFilter;
    const events = this.getAttribute('events', true);
    this.renderHeader();
    this.setData({ events });
  }

  render(): void {
    return (
      <i-panel
        padding={{top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem'}}
        border={{radius: '0.5rem', width: 1, style: 'solid', color: Theme.divider}}
        overflow={'hidden'}
      >
        <i-hstack verticalAlignment='center' horizontalAlignment='space-between' gap={'0.5rem'}>
          <i-hstack verticalAlignment='center' gap="0.25rem">
            <i-label id="lbMonth" font={{size: 'clamp(1rem, 0.9489rem + 0.2273vw, 1.125rem)', weight: 600}}></i-label>
            <i-label id="lbYear" font={{size: '1rem', color: Theme.text.secondary}}></i-label>
          </i-hstack>
          <i-hstack verticalAlignment='center'>
            <i-panel
              stack={{shrink: '0'}}
              opacity={0.36}
              hover={{opacity: 1}}
              cursor='pointer'
              onClick={this.onPrev.bind(this)}
            >
              <i-icon
                padding={{left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem'}}
                name='angle-left'
                width='1.5rem' height='1.5rem'
                fill={Theme.text.primary}
              ></i-icon>
            </i-panel>
            <i-panel
              stack={{shrink: '0'}}
              opacity={0.36}
              hover={{opacity: 1}}
              cursor='pointer'
              onClick={this.onCurrent.bind(this)}
            >
              <i-icon
                padding={{left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem'}}
                name='circle'
                width='1.5rem' height='1.5rem'
                fill={Theme.text.primary}
              ></i-icon>
            </i-panel>
            <i-panel
              stack={{shrink: '0'}}
              opacity={0.36}
              hover={{opacity: 1}}
              cursor='pointer'
              onClick={this.onNext.bind(this)}
            >
              <i-icon
                padding={{left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem'}}
                name='angle-right'
                width='1.5rem' height='1.5rem'
                fill={Theme.text.primary}
              ></i-icon>
            </i-panel>
          </i-hstack>
        </i-hstack>
        <i-grid-layout
          id="gridHeader"
          columnsPerRow={7}
          margin={{top: '0.5rem'}}
        ></i-grid-layout>
        <i-hstack id="listStack" overflow={{x: 'auto', y: 'hidden'}} minHeight={'1.875rem'}></i-hstack>
        <i-grid-layout
          id="gridEvents"
          templateRows={['repeat(6, 1fr)']}
          templateColumns={['repeat(7, 1fr)']}
          width={'100%'}
        ></i-grid-layout>
        <i-hstack
          id="pnlSelected"
          verticalAlignment="center" horizontalAlignment='space-between'
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          margin={{top: '0.5rem'}}
          visible={false}
        ></i-hstack>
        <i-hstack
          id="pnlNotSelected"
          verticalAlignment="center" horizontalAlignment='space-between'
          padding={{top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'}}
          border={{radius: '0.5rem'}}
          background={{color: Theme.colors.secondary.light}}
          margin={{top: '0.5rem'}}
        >
          <i-button
            id="btnUpcoming"
            caption='Upcoming'
            font={{size: '0.875rem', weight: 500, color: Theme.text.primary}}
            border={{radius: '0.5rem'}}
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
            height={'1.875rem'} width={'100%'}
            background={{color: Theme.background.default}}
            boxShadow='none'
            class={transitionStyle}
            onClick={this.onFilterData}
          ></i-button>
          <i-button
            id="btnPast"
            caption='Past'
            font={{size: '0.875rem', weight: 500, color: Theme.text.secondary}}
            border={{radius: '0.5rem'}}
            height={'1.875rem'} width={'100%'}
            padding={{top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem'}}
            background={{color: 'transparent'}}
            boxShadow='none'
            class={transitionStyle}
            onClick={this.onFilterData}
          ></i-button>
        </i-hstack>
      </i-panel>
    )
  }
}
