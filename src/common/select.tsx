import {
  Module,
  ControlElement,
  customElements,
  customModule,
  Styles,
  Label,
  Container,
  VStack,
  Control
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
  private pnlSelect: Control;
  private yearMap: Map<number, Label> = new Map();
  private monthMap: Map<number, Label> = new Map();
  private dateMap: Map<number, Label> = new Map();

  private initialDate: Date;
  private initialYear: number;
  private _data: ISelect;
  private pos1: IPos = { x: 0, y: 0 };
  private pos2: IPos = { x: 0, y: 0 };
  private startX: number = 0;
  private startY: number = 0;
  private yearList: number[] = [];
  private monthList: number[] = [];
  private dateList: number[] = [];
  private newDate: IDate = { date: 0, month: 0, year: 0 };
  private isAnimating: boolean = false;
  private threshold: number = 10;
  private isScrolling: boolean = false;

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

  private get daysInMonth() {
    const { month, year } = this.newDate;
    return new Date(year, month, 0).getDate();
  }

  setData(data: ISelect) {
    this._data = data;
    this.clear();
    this.renderUI();
  }

  clear() {
    this.initialDate = new Date();
    this.newDate = {...this.initialData};
    this.dateStack.style.transform = '';
    this.yearStack.style.transform = '';
    this.monthStack.style.transform = '';
  }

  private renderUI() {
    if (this.date) {
      this.initialDate = new Date(this.date);
      const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
      this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
      this.newDate = {...this.initialData};
    }
    this.initialYear = this.initialDate.getFullYear();
    this.renderCurrent();
  }

  private renderDateList() {
    this.dateStack.clearInnerHTML();
    this.dateMap = new Map();
    const { date }  = this.initialData;
    this.dateList = [date];

    let prevValue = date;
    let nextValue = date;

    for (let i = 0; i < 5; i++) {
      const newPrev = this.getPrev('date', prevValue);
      prevValue = newPrev;
      this.dateList.unshift(newPrev);
      const newNext = this.getNext('date', nextValue);
      nextValue = newNext;
      this.dateList.push(newNext);
    }
    for (let i of this.dateList) {
      const lb = <i-label
        stack={{grow: '0'}}
        caption={`${i}`}
        font={font}
        opacity={i === date ? 1 : 0.5}
        lineHeight={lineHeight}
      ></i-label>
      lb.setAttribute('data-date', `${i}`);
      this.dateStack.appendChild(lb);
      this.dateMap.set(i, lb);
    }
    this._translate(0, -4 * itemHeight, this.dateStack);
  }

  private renderMonthList() {
    this.monthStack.clearInnerHTML();
    this.monthMap = new Map();
    const { month }  = this.initialData;
    let prevValue = month;
    let nextValue = month;
    this.monthList = [month];
    for (let i = 0; i < 5; i++) {
      const newPrev = this.getPrev('month', prevValue);
      prevValue = newPrev;
      this.monthList.unshift(newPrev);
      const newNext = this.getNext('month', nextValue);
      nextValue = newNext;
      this.monthList.push(newNext);
    }
    for (let i of this.monthList) {
      const lb = <i-label
        stack={{grow: '0'}}
        caption={`${i}`}
        font={font}
        opacity={i === month ? 1 : 0.5}
        lineHeight={lineHeight}
      ></i-label>
      lb.setAttribute('data-month', `${i}`);
      this.monthStack.appendChild(lb);
      this.monthMap.set(i, lb);
    }
    this._translate(0, -4 * itemHeight, this.monthStack);
  }

  private renderYearList() {
    this.yearStack.clearInnerHTML();
    this.yearMap = new Map();
    const { year }  = this.initialData;
    this.yearList = [year];

    let prevValue = year;
    let nextValue = year;
    for (let i = 0; i < 5; i++) {
      const newPrev = this.getPrev('year', prevValue);
      prevValue = newPrev;
      this.yearList.unshift(newPrev);
      const newNext = this.getNext('year', nextValue);
      nextValue = newNext;
      this.yearList.push(newNext);
    }
    for (let i of this.yearList) {
      const lb = <i-label
        stack={{grow: '0'}}
        caption={`${i}`}
        font={font}
        opacity={i === year ? 1 : 0.5}
        lineHeight={lineHeight}
      ></i-label>
      lb.setAttribute('data-year', `${i}`);
      this.yearStack.appendChild(lb);
      this.yearMap.set(i, lb);
    }
    this._translate(0, -4 * itemHeight, this.yearStack);
  }

  private getPrev(type: IType, value: number) {
    let result = 0;
    if (type === 'date') {
      result = value === 1 ? this.daysInMonth : value - 1;
    } else if (type === 'month') {
      result = value === 1 ? 12 : value - 1;
    } else {
      if (value > this.initialYear - 20) result = value - 1;
    }
    return result;
  }

  private getNext(type: IType, value: number) {
    let result = 0;
    if (type === 'date') {
      result = value === this.daysInMonth ? 1 : value + 1;
    } else if (type === 'month') {
      result = value === 12 ? 1 : value + 1;
    } else {
      if (value < this.initialYear + 20) result = value + 1;
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
    this.startY = this.pos1.y;
    this.isScrolling = true;
  }

  private dragHandler(event: MouseEvent | TouchEvent) {
    let deltaY = 0;
    if (event instanceof TouchEvent) {
      this.pos2 = {
        x: this.pos1.x - event.touches[0].pageX,
        y: this.pos1.y - event.touches[0].pageY
      }
      deltaY = event.touches[0].pageY - this.startY;
      this.startY = event.touches[0].pageY;
      this.startX = event.touches[0].pageX;
    } else {
      this.pos2 = {
        x: this.pos1.x - event.clientX,
        y: this.pos1.y - event.clientY,
      }
      deltaY = event.clientY - this.startY;
      this.startY = event.clientY;
      this.startX = event.clientX;
    }

    const scroller = this.findNearestChild(this.startX, this.startY)
    const parentStack = scroller ? scroller.children[0] as Control : null;

    if (parentStack) {
      const type: IType = this.getParentType(parentStack);
      const distance = Math.abs(deltaY / itemHeight);
      if (distance > 1) this.updateList(type, deltaY > 0 ? 1 : -1, distance);
      const { x, y } = this.getTransform(parentStack);
      this._translate(x, y + deltaY, parentStack);
    } else {
      event.preventDefault();
      return false;
    }
  }

  private findNearestChild(x: number, y: number) {
    for (let child of this.pnlSelect.children) {
      const c = child as Control;
      const { left, top } = child.getBoundingClientRect();
      if (x >= left && x <= left + c.offsetWidth && y >= top && y <= top + c.offsetHeight) {
        return child;
      }
    }
    return null;
  }

  private dragEndHandler(event: MouseEvent | TouchEvent) {
    this.isScrolling = false;
    let clientX = 0;
    let clientY = 0;
    if (event instanceof TouchEvent) {
      clientY = event.touches[0].pageY;
      clientX = event.touches[0].pageX;
    } else {
      clientY = event.clientY;
      clientX = event.clientX;
    }

    const scroller = this.findNearestChild(clientX, clientY);
    const parentStack = scroller ? scroller.children[0] as Control : null;

    const type: IType = this.getParentType(parentStack);
    if (type) {
      if (this.pos2.y < -this.threshold) {
        this.onScroll(type, -1);
      } else if (this.pos2.y > this.threshold) {
        this.onScroll(type, 1);
      } else {
        this.onRefresh(type);
      }
    } else {
      this.onRefresh('date');
      this.onRefresh('month');
      this.onRefresh('year');
    }
  }

  private getParentType(parentStack: Control) {
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
    return type;
  }

  private onScroll(type: 'date' | 'month' | 'year', direction: number) {
    const mapEl = this[`${type}Map`];
    const parentStack = this[`${type}Stack`];
    const distance = Math.round(Math.abs(this.pos2.y) / itemHeight);

    const oldEl = mapEl.get(this.newDate[type]);
    if (oldEl) oldEl.opacity = 0.5;

    this.updateList(type, direction, distance);

    let newValue = 0;
    if (type === 'month') {
      this.initialDate.setMonth(this.initialDate.getMonth() + (distance * direction));
      newValue = this.initialDate.getMonth() + 1;
    } else if (type === 'year') {
      this.initialDate.setFullYear(this.initialDate.getFullYear() + (distance * direction));
      newValue = this.initialDate.getFullYear();
    } else {
      this.initialDate.setDate(this.initialDate.getDate() + (distance * direction));
      newValue = this.initialDate.getDate();
    }
    this.newDate[type] = newValue;

    const newEl = mapEl.get(newValue);
    if (newEl) newEl.opacity = 1;
    const index = Array.from(parentStack.children).findIndex(child => (child as Control).dataset[type] === `${newValue}`);
    if (index > 0) {
      const y = (index - 1) * itemHeight;
      if (distance < 2) {
        this._translate(0, -y, parentStack);
      } else {
        this.animateFn(0, y, 300, parentStack);
      }
    }

    if (type === 'month') this.renderDateList();
  }

  private onRefresh(type: 'date' | 'month' | 'year') {
    const parentStack = this[`${type}Stack`];
    const index = Array.from(parentStack.children).findIndex(child => (child as Control).dataset[type] === `${this.newDate[type]}`);
    if (index > 0) {
      const y = (index - 1) * itemHeight;
      this._translate(0, -y, parentStack);
    } else this._translate(0, 0, parentStack);
  }

  private _translate(x: number, y: number, parentStack: Control): void {
    parentStack.style.transform = `translate3d(0px, ${y}px, 0)`;
    parentStack.style.transform = `translate(0px, ${y}px)`;
  }

  private animateFn(destX: number, destY: number, duration: number, parentStack: Control): void {
    let that = this;
    let startX = this.pos1.x;
    let startY = this.pos1.y;
    let startTime = Date.now();
    let destTime = startTime + duration;

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  
    function step () {
      let now = Date.now();
      let newX: number;
      let newY: number;
      let easedTime: number;

      if (now >= destTime) {
        that.isAnimating = false;
        that._translate(destX, -destY, parentStack);
        return;
      }

      now = (now - startTime) / duration;
      easedTime = easeInOutQuad(now);
      newX = (destX - startX) * easedTime + startX;
      newY = (destY - startY) * easedTime + startY;

      that._translate(newX, -newY, parentStack);

      if (that.isAnimating) {
        window.requestAnimationFrame(step);
      }
    }
    this.isAnimating = true;
    step();
  }

  private updateList(type: 'date' | 'month' | 'year', direction: number, distance: number) {
    const mapEl = this[`${type}Map`];
    const parentStack = this[`${type}Stack`];

    const getLabel = (value: number) => {
      const lb = mapEl.get(value) || <i-label caption={`${value}`} font={font} lineHeight={lineHeight} opacity={0.5}></i-label>;
      lb.setAttribute(`data-${type}`, `${value}`);
      return lb;
    }

    if (direction === -1) {
      let prevValue = +(parentStack.firstChild as Control).dataset[type];
      for (let i = 0; i < distance; i++) {
        const newPrev = this.getPrev(type as any, prevValue);
        if (!newPrev) break;
        prevValue = newPrev;
        const prevLb = getLabel(newPrev);
        parentStack.append(prevLb);
        parentStack.insertBefore(prevLb, parentStack.firstChild);
        mapEl.set(newPrev, prevLb);
      }
    }
    else if (direction === 1) {
      let nextValue = +(parentStack.lastChild as Control).dataset[type];
      for (let i = 0; i < distance; i++) {
        const newNext = this.getNext(type as any, nextValue);
        if (!newNext) break;
        nextValue = newNext;
        const lb = getLabel(newNext);
        lb.setAttribute(`data-${type}`, `${newNext}`);
        parentStack.append(lb);
        mapEl.set(newNext, lb);
      }
    }
  }

  private getTransform(parent: Control) {
    let matrix = getComputedStyle(parent, null)['transform'].replace(/[^0-9-.,]/g, '').split(',');
    return {
      x: Number(matrix[4] || 0),
      y: Number(matrix[5] || 0)
    }
  }

  _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const target = event.target as HTMLElement;
    const wrapper = target.closest('.scroller');
    if (wrapper) {
      this.dragStartHandler(event);
      return true;
    }
    return super._handleMouseDown(event, stopPropagation);
  }

  _handleMouseMove(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const target = event.target as HTMLElement;
    const wrapper = target.closest('#pnlSelect');
    if (wrapper) {
      this.dragHandler(event);
      return true;
    }
    return super._handleMouseMove(event, stopPropagation);
  }

  _handleMouseUp(event: PointerEvent|MouseEvent|TouchEvent, stopPropagation?: boolean): boolean {
    const target = event.target as HTMLElement;
    const wrapper = target.closest('#pnlSelect');
    if (wrapper) {
      this.dragEndHandler(event);
      return true;
    } else {
      this.onRefresh('date');
      this.onRefresh('month');
      this.onRefresh('year');
    }
    return super._handleMouseUp(event, stopPropagation);
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
          position='relative'
        >
          <i-grid-layout
            id="pnlSelect"
            columnsPerRow={3}
            horizontalAlignment='center'
            gap={{column: '1rem', row: '0.25rem'}}
          >
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
              class="scroller"
            >
              <i-vstack
                id="dateStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                // overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container date-container"
              ></i-vstack>
            </i-panel>
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
              class="scroller"
            >
              <i-vstack
                id="monthStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                // overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container month-container"
              ></i-vstack>
            </i-panel>
            <i-panel
              overflow={'hidden'}
              height={'9.375rem'} width={'100%'}
              class="scroller"
            >
              <i-vstack
                id="yearStack"
                verticalAlignment='start'
                horizontalAlignment='center'
                position='relative'
                // overflow={{x: 'hidden', y: 'auto'}}
                width={'100%'} height={'100%'}
                cursor='pointer'
                class="scroll-container year-container"
              ></i-vstack>
            </i-panel>
          </i-grid-layout>
          {/* <i-panel
            width={'100%'} height={`${itemHeight}px`}
            position='absolute'
            top="calc(50% - ${itemHeight / 2}px)"
            border={{top: {width: '1px', style: 'solid', color: Theme.divider}, bottom: {width: '1px', style: 'solid', color: Theme.divider}}}
          ></i-panel> */}
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
