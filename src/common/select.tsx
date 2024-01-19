import {
  Module,
  ControlElement,
  customElements,
  customModule,
  Styles,
  Label,
  Container,
  Panel
} from '@ijstech/components'
import { ISelectOption } from '../interface';
import { selectorStyles } from './select.css';
import { IosSelector } from './utils';
const Theme = Styles.Theme.ThemeVars;

interface ScomCalendarSelectElement extends ControlElement {
  date?: string;
  onChanged?: (date: string) => void;
  onClose?: () => void;
}

interface ISelect {
  date: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar--select"]: ScomCalendarSelectElement;
    }
  }
}

@customModule
@customElements('i-scom-calendar--select')
export class ScomCalendarSelect extends Module {
  private lbDate: Label;
  private pnlYear: Panel;
  private pnlMonth: Panel;
  private pnlDate: Panel;
  private yearSelector: IosSelector;
  private monthSelector: IosSelector;
  private daySelector: IosSelector;

  private initialDate: Date;
  private _data: ISelect;

  private currentYear: number = new Date().getFullYear();
  private currentMonth: number = 1;
  private currentDay: number = 1;

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

  setData(data: ISelect) {
    this._data = data;
    this.clear();
    this.renderUI();
  }

  clear() {
    this.initialDate = new Date();
  }

  private renderUI() {
    if (this.date) {
      this.initialDate = new Date(this.date);
      const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
      this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
      this.currentDay = this.initialDate.getDate();
      this.currentMonth = this.initialDate.getMonth() + 1;
      this.currentYear = this.initialDate.getFullYear();
    }
    this.renderSelectors();
  }

  private renderSelectors() {
    if (!this.daySelector) {
      this.daySelector = new IosSelector({
        el: this.pnlDate,
        type: 'infinite',
        source: this.getDays(this.currentYear, this.currentMonth),
        count: 20,
        onChange: (selected: ISelectOption) => {
          this.currentDay = selected.value;
        }
      });
    }

    if (!this.yearSelector) {
      this.yearSelector = new IosSelector({
        el: this.pnlYear,
        type: 'infinite',
        source: this.getYears(),
        count: 20,
        onChange: (selected: ISelectOption) => {
          this.currentYear = selected.value;
          const daySource = this.getDays(this.currentYear, this.currentMonth);
          this.daySelector.updateSource(daySource);
        }
      });
    }
    
    if (!this.monthSelector) {
      this.monthSelector = new IosSelector({
        el: this.pnlMonth,
        type: 'infinite',
        source: this.getMonths(),
        count: 20,
        onChange: (selected: ISelectOption) => {
          this.currentMonth = selected.value;
          const daySource = this.getDays(this.currentYear, this.currentMonth);
          this.daySelector.updateSource(daySource);
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

  private onCloseSelect() {;
    if (this.onClose) this.onClose();
  }

  private onChangedSelect() {
    const newDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);
    if (this.onChanged) this.onChanged(newDate.toISOString());
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
        class={selectorStyles}
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
          <i-hstack
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
