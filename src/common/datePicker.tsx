import {
  Module,
  ControlElement,
  customElements,
  customModule,
  Styles,
  Container,
  Panel
} from '@ijstech/components'
import { ISelectOption } from '../interface';
import { selectorStyles } from './select.css';
import { IosSelector } from './utils';

interface ScomCalendarDatePickerElement extends ControlElement {
  date?: string;
  onChanged?: (date: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar--date-picker"]: ScomCalendarDatePickerElement;
    }
  }
}

const COUNT = 10;

@customModule
@customElements('i-scom-calendar--date-picker')
export class ScomCalendarDatePicker extends Module {
  private pnlYear: Panel;
  private pnlMonth: Panel;
  private pnlDate: Panel;
  private yearSelector: IosSelector;
  private monthSelector: IosSelector;
  private daySelector: IosSelector;

  private initialDate: Date;
  private _date: string;

  private currentYear: number = new Date().getFullYear();
  private currentMonth: number = 1;
  private currentDay: number = 1;

  onChanged: (date: string) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onChangedSelect = this.onChangedSelect.bind(this);
  }

  static async create(options?: ScomCalendarDatePickerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }


  get date() {
    return this._date;
  }
  set date(value: string) {
    this._date = value;
  }

  setData(data: string) {
    this.date = data;
    this.renderUI();
  }

  private renderUI() {
    this.initialDate = this.date ? new Date(this.date) : new Date();
    this.currentDay = this.initialDate.getDate();
    this.currentMonth = this.initialDate.getMonth() + 1;
    this.currentYear = this.initialDate.getFullYear();
    this.renderSelectors();
  }

  private renderSelectors() {
    if (!this.daySelector) {
      this.daySelector = new IosSelector({
        el: this.pnlDate,
        type: 'infinite',
        source: this.getDays(this.currentYear, this.currentMonth),
        count: COUNT,
        onChange: (selected: ISelectOption) => {
          this.currentDay = selected.value;
          this.onChangedSelect();
        }
      });
    }

    if (!this.yearSelector) {
      this.yearSelector = new IosSelector({
        el: this.pnlYear,
        type: 'infinite',
        source: this.getYears(),
        count: COUNT,
        onChange: (selected: ISelectOption) => {
          this.currentYear = selected.value;
          const daySource = this.getDays(this.currentYear, this.currentMonth);
          this.daySelector.updateSource(daySource);
          this.onChangedSelect();
        }
      });
    }
    
    if (!this.monthSelector) {
      this.monthSelector = new IosSelector({
        el: this.pnlMonth,
        type: 'infinite',
        source: this.getMonths(),
        count: COUNT,
        onChange: (selected: ISelectOption) => {
          this.currentMonth = selected.value;
          const daySource = this.getDays(this.currentYear, this.currentMonth);
          this.daySelector.updateSource(daySource);
          this.onChangedSelect();
        }
      });
    }

    this.daySelector.select(this.currentDay);
    this.yearSelector.select(this.currentYear);
    this.monthSelector.select(this.currentMonth);
  }

  private getYears() {
    let currentYear = new Date().getFullYear();
    let years = [];
  
    for (let i = currentYear - 20; i < currentYear + 20; i++) {
      years.push({
        value: i,
        text: i
      });
    }
    return years;
  }

  getMonths() {
    let months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        value: i,
        text: i
      });
    }
    return months;
  }
  
  getDays(year: number, month: number) {
    let dayCount = new Date(year, month, 0).getDate(); 
    let days = [];

    for (let i = 1; i <= dayCount; i++) {
      days.push({
        value: i,
        text: i
      });
    }
  
    return days; 
  }

  private onChangedSelect() {
    const newDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);
    this._date = newDate.toISOString();
    if (this.onChanged) this.onChanged(this._date);
  }


  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const date = this.getAttribute('date', true);
    this.setData(date);
  }

  render(): void {
    return (
      <i-panel width={'100%'} height={'100%'} class={selectorStyles}>
        <i-hstack
          id="datePicker"
          position='absolute'
          top="50%" left="50%"
          verticalAlignment="stretch"
          horizontalAlignment='space-between'
          class="date-selector"
        >
          <i-panel class="year" id="pnlYear" stack={{grow: '1', shrink: '1'}}></i-panel>
          <i-panel class="month" id="pnlMonth" stack={{grow: '1', shrink: '1'}}></i-panel>
          <i-panel class="date" id="pnlDate" stack={{grow: '1', shrink: '1'}}></i-panel>
        </i-hstack>
      </i-panel>
    )
  }
}
