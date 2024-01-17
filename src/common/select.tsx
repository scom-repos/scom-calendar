import {
  Module,
  ControlElement,
  customElements,
  customModule,
  Styles,
  Label,
  Container,
  VStack
} from '@ijstech/components'
import { IDate, IPos } from '../interface';
import { transitionStyle } from './select.css';
const Theme = Styles.Theme.ThemeVars;

interface ScomCalendarSelectElement extends ControlElement {
  date?: string;
  onChanged?: (date: string) => void;
  onClose?: () => void;
}

interface ISelect {
  date: string;
}

type IType = 'date' | 'month' | 'year';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar--select"]: ScomCalendarSelectElement;
    }
  }
}

const itemHeight = 50;
const font = {size: '2rem', weight: 600};
const lineHeight = '3.125rem';

@customModule
@customElements('i-scom-calendar--select')
export class ScomCalendarSelect extends Module {
  private lbDate: Label;
  private dateStack: VStack;
  private yearStack: VStack;
  private monthStack: VStack;
  private yearMap: Map<number, Label> = new Map();
  private monthMap: Map<number, Label> = new Map();
  private dateMap: Map<number, Label> = new Map();

  private initialDate: Date;
  private _data: ISelect;
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private yearList: number[];
  private monthList: number[];
  private dateList: number[];
  private newDate: IDate = { date: 0, month: 0, year: 0 };

  onChanged: (date: string) => void;
  onClose: () => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onCloseSelect = this.onCloseSelect.bind(this);
    this.onChangedSelect = this.onChangedSelect.bind(this);
  }

  static async create(options?: ScomCalendarSelectElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }


  get date() {
    return this._data.date;
  }
  set date(value: string) {
    this._data.date = value;
  }

  private get daysInMonth() {
    const { month, year } = this.initialData;
    return new Date(year, month, 0).getDate();
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

  setData(data: ISelect) {
    this._data = data;
    this.clear();
    this.renderUI();
  }

  clear() {
    this.initialDate = new Date();
    this.newDate = {...this.initialData};
    // this.monthStack.scrollTop = 0;
    // this.yearStack.scrollTop = 0;
    // this.dateStack.scrollTop = 0;
  }

  private renderUI() {
    if (this.date) {
      this.initialDate = new Date(this.date);
      const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
      this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
      this.newDate = {...this.initialData};
    }
    this.renderCurrent();
  }

  private renderDateList() {
    this.dateStack.clearInnerHTML();
    this.dateMap = new Map();
    const { date, year, month }  = this.initialData;
    const previousDaysInMonth = new Date(year, month - 1, 0).getDate();
    const first = date === 1 ? previousDaysInMonth : date - 1;
    const last = date === this.daysInMonth ? 1 : date + 1;
    this.dateList = [first, date, last];
    for (let d of this.dateList) {
      const lb = <i-label
        stack={{grow: '0'}}
        caption={`${d}`}
        font={font}
        opacity={d === date ? 1 : 0.5}
        lineHeight={lineHeight}
      ></i-label>
      lb.setAttribute('data-date', `${d}`);
      this.dateStack.appendChild(lb);
      this.dateMap.set(d, lb);
    }
  }

  private renderMonthList() {
    this.monthStack.clearInnerHTML();
    this.monthMap = new Map();
    const { month }  = this.initialData;
    const first = month === 1 ? 12 : month - 1;
    const last = month === 12 ? 1 : month + 1;
    this.monthList = [first, month, last];
    for (let m of this.monthList) {
      const lb = <i-label
        stack={{grow: '0'}}
        caption={`${m}`}
        font={font}
        opacity={m === month ? 1 : 0.5}
        lineHeight={lineHeight}
      ></i-label>
      lb.setAttribute('data-month', `${m}`);
      this.monthStack.appendChild(lb);
      this.monthMap.set(m, lb);
    }
  }

  private renderYearList() {
    this.yearStack.clearInnerHTML();
    this.yearMap = new Map();
    const { year }  = this.initialData;
    this.yearList = [year - 1, year, year + 1];
    for (let y of this.yearList) {
      const lbYear = <i-label caption={`${y}`} font={font} lineHeight={lineHeight} opacity={y === year ? 1 : 0.5}></i-label>;
      lbYear.setAttribute('data-year', `${y}`);
      this.yearStack.appendChild(lbYear);
      this.yearMap.set(y, lbYear);
    }
  }

  private getPrev(type: IType, value: number) {
    let result = 0;
    if (type === 'date') {
      const { year, month }  = this.newDate;
      const previousDaysInMonth = new Date(year, month - 1, 0).getDate();
      result = value === 1 ? previousDaysInMonth : value - 1;
    } else if (type === 'month') {
      result = value === 1 ? 12 : value - 1;
    } else {
      result = value - 1;
    }
    return result;
  }
  
  private getNext(type: IType, value: number) {
    let result = 0;
    if (type === 'date') {
      // const { year, month }  = this.newDate;
      // const nextDaysInMonth = new Date(year, month + 1, 0).getDate();
      result = value === this.daysInMonth ? 1 : value + 1;
    } else if (type === 'month') {
      result = value === 12 ? 1 : value + 1;
    } else {
      result = value + 1;
    }
    return result;
  }

  private renderCurrent() {
    this.renderDateList();
    this.renderMonthList();
    this.renderYearList();
  }

  private onCloseSelect() {
    if (this.onClose) this.onClose();
  }

  private onChangedSelect() {
    const { year, month, date } = this.newDate;
    const newDate = new Date(year, month - 1, date);
    console.log(newDate);
    if (this.onChanged) this.onChanged(newDate.toISOString());
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
  }

  private dragHandler(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].pageX,
        y: this.pos1.y - event.touches[0].pageY
      }
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: this.pos1.y - event.clientY,
      }
    }
  }

  private dragEndHandler(event: MouseEvent | TouchEvent) {
    const verticalThreshold = 10;
    let direction: 1 | -1 = 1;
    if (this.pos2.y < -verticalThreshold) {
      direction = -1;
    } else if (this.pos2.y > verticalThreshold) {
      direction = 1;
    }
    const target = event.target as HTMLElement;
    const parentStack = target.closest('.scroll-container') as VStack;
    let type: IType;
    switch(parentStack?.id) {
      case 'dateStack':
        type = 'date';
        break;
      case 'monthStack':
        type = 'month';
        break;
      case 'yearStack':
        type = 'year';
        break;
    }
    if (type) this.onScroll(type, direction);
  }

  private onScroll(type: 'date' | 'month' | 'year', direction: 1 | -1) {
    const mapEl = this[`${type}Map`];
    const parentStack = this[`${type}Stack`];
    const listData = this[`${type}List`];

    const oldEl = mapEl.get(this.newDate[type]);
    if (oldEl) oldEl.opacity = 0.5;

    if (direction === -1) {
      const newData = this.getPrev(type as any, listData[0]);
      listData.unshift(newData);
      const lb = <i-label caption={`${newData}`} font={font} lineHeight={lineHeight} opacity={0.5}></i-label>;
      lb.setAttribute(`data-${type}`, `${newData}`);
      parentStack.append(lb);
      parentStack.insertBefore(lb, parentStack.firstChild);
      mapEl.set(newData, lb);
    } else {
      const newData = this.getNext(type as any, listData[listData.length - 1]);
      listData.push(newData);
      const lb = <i-label caption={`${newData}`} font={font} lineHeight={lineHeight} opacity={0.5}></i-label>;
      lb.setAttribute(`data-${type}`, `${newData}`);
      parentStack.append(lb);
      mapEl.set(newData, lb);
    }


    let newValue = 0;
    if (type === 'month') {
      this.initialDate.setMonth(this.initialDate.getMonth() + direction);
      newValue = this.initialDate.getMonth() + 1;
    } else if (type === 'year') {
      this.initialDate.setFullYear(this.initialDate.getFullYear() + direction);
      newValue = this.initialDate.getFullYear();
    } else {
      this.initialDate.setDate(this.initialDate.getDate() + direction);
      newValue = this.initialDate.getDate();
    }

    const newEl = mapEl.get(newValue);
    if (newEl) newEl.opacity = 1;
    const index = listData.indexOf(newValue);
    parentStack.scrollTop = index * itemHeight - itemHeight;
    parentStack.scrollIntoView({ inline: 'center' });
    this.newDate[type] = newValue;
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const result = super._handleMouseDown(event, stopPropagation);
    if (result !== undefined) {
      const target = event.target as HTMLElement;
      const sliderList = target.closest('.scroll-container');
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
      const sliderList = target.closest('.scroll-container');
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
      const sliderList = target.closest('.scroll-container');
      if (sliderList) {
        this.dragEndHandler(event);
        return true;
      }
    }
    return false;
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    this.onClose = this.getAttribute('onClose', true) || this.onClose;
    const date = this.getAttribute('date', true);
    if (date) this.setData({ date });
  }

  render(): void {
    return (
      <i-panel
        padding={{top: '2rem', bottom: '2rem', left: '2rem', right: '2rem'}}
        class={transitionStyle}
      >
        <i-hstack verticalAlignment='center' horizontalAlignment='space-between' gap={'0.5rem'}>
          <i-hstack gap="1rem" horizontalAlignment='center'>
            <i-label id="lbDate" caption=''></i-label>
            <i-icon name="caret-up" width={'1rem'} height={'1rem'} fill={Theme.text.primary}></i-icon>
          </i-hstack>
        </i-hstack>
        <i-vstack
          verticalAlignment='center' horizontalAlignment='center'
          gap="1rem"
          minHeight={'50vh'}
        >
          <i-grid-layout
            columnsPerRow={3}
            horizontalAlignment='center'
            gap={{column: '1rem', row: '0.25rem'}}
          >
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
            >
              <i-vstack
                id="dateStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container date-container"
              ></i-vstack>
            </i-panel>
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
            >
              <i-vstack
                id="monthStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container month-container"
              ></i-vstack>
            </i-panel>
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
            >
              <i-vstack
                id="yearStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container year-container"
              ></i-vstack>
            </i-panel>
          </i-grid-layout>
        </i-vstack>
        <i-hstack verticalAlignment='center' horizontalAlignment='space-between'>
          <i-button
            caption='Cancel'
            font={{weight: 600, size: '1rem', color: Theme.text.primary}}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            stack={{basis: '50%'}}
            background={{color: 'transparent'}}
            boxShadow='none'
            border={{radius: 0}}
            onClick={this.onCloseSelect}
          ></i-button>
          <i-button
            caption='Ok'
            font={{weight: 600, size: '1rem', color: Theme.text.primary}}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            stack={{basis: '50%'}}
            background={{color: 'transparent'}}
            border={{radius: 0}}
            boxShadow='none'
            onClick={this.onChangedSelect}
          ></i-button>
        </i-hstack>
      </i-panel>
    )
  }
}
