import {
  Module,
  ControlElement,
  customElements,
  customModule,
  Styles,
  Label,
  Container,
  Icon
} from '@ijstech/components'
import { selectorStyles } from './select.css';
import { ScomCalendarMonthPicker } from './monthPicker';
import { ScomCalendarDatePicker } from './datePicker';
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
  private monthPicker: ScomCalendarMonthPicker;
  private datePicker: ScomCalendarDatePicker;
  private iconLeft: Icon;
  private iconRight: Icon;

  private initialDate: Date;
  private _data: ISelect;

  onChanged: (date: string) => void;
  onClose: () => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onShowMonth = this.onShowMonth.bind(this);
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
    this.renderUI();
  }

  private renderUI() {
    this.initialDate = this.date ? new Date(this.date) : new Date();
    this.iconLeft.visible = this.iconRight.visible = this.monthPicker.visible;
    this.updateHeader();
    this.datePicker.setData(this.date);
    this.monthPicker.setData(this.date);
  }

  private onCancel() {;
    this.datePicker.visible = true;
    this,this.monthPicker.visible = false;
    if (this.onClose) this.onClose();
  }

  private onConfirm() {
    const date = this.monthPicker.visible ? this.monthPicker.date : this.datePicker.date;
    if (this.onChanged) this.onChanged(date);
  }

  private onShowMonth() {
    this.monthPicker.visible = !this.monthPicker.visible;
    const visible = this.monthPicker.visible;
    this.datePicker.visible = !visible;
    if (this.datePicker.visible) {
      this.datePicker.display = 'flex';
    }
    this.iconLeft.visible = this.iconRight.visible = visible;
  }

  private async onMonthChanged(direction: 1|-1) {
    const { month, year } = await this.monthPicker.onSwipeFullMonth(direction);
    this.initialDate.setMonth(month - 1);
    this.initialDate.setFullYear(year);
    this.monthPicker.date = this.initialDate.toISOString();
    this.updateHeader();
  }

  private updateHeader() {
    const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
    this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
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
        <i-hstack verticalAlignment='center' gap={'1rem'}>
          <i-panel
            stack={{shrink: '0'}}
            opacity={0.36}
            hover={{opacity: 1}}
            cursor='pointer'
          >
            <i-icon
              id="iconLeft"
              padding={{left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem'}}
              name='angle-left'
              width='1.5rem' height='1.5rem'
              fill={Theme.text.primary}
              visible={false}
              onClick={() => this.onMonthChanged(-1)}
            ></i-icon>
          </i-panel>
          <i-hstack
            gap="0.5rem"
            horizontalAlignment='center' verticalAlignment='start'
            cursor='pointer'
            onClick={this.onShowMonth}
          >
            <i-label id="lbDate" caption='' font={{size: '1rem', weight: 500}}></i-label>
            <i-icon name="caret-down" width={'1rem'} height={'1rem'} fill={Theme.text.primary}></i-icon>
          </i-hstack>
          <i-panel
            stack={{shrink: '0'}}
            opacity={0.36}
            hover={{opacity: 1}}
            cursor='pointer'
          >
            <i-icon
              id="iconRight"
              padding={{left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem'}}
              name='angle-right'
              width='1.5rem' height='1.5rem'
              fill={Theme.text.primary}
              visible={false}
              onClick={() => this.onMonthChanged(1)}
            ></i-icon>
          </i-panel>
        </i-hstack>
        <i-vstack
          verticalAlignment='center' horizontalAlignment='center'
          gap="1rem"
          minHeight={'50vh'}
          position='relative'
        >
          <i-scom-calendar--date-picker
            id="datePicker"
            display='block'
            width={'100%'} height={'100%'}
          />
          <i-scom-calendar--month-picker
            id="monthPicker"
            visible={false}
            width="31.25rem" height="auto"
            maxWidth={'100%'}
            overflow={'hidden'}
          />
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
            onClick={this.onCancel}
          ></i-button>
          <i-button
            caption='Ok'
            font={{weight: 600, size: '1rem', color: Theme.text.primary}}
            padding={{top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem'}}
            stack={{basis: '50%'}}
            background={{color: 'transparent'}}
            border={{radius: 0}}
            boxShadow='none'
            onClick={this.onConfirm}
          ></i-button>
        </i-hstack>
      </i-panel>
    )
  }
}
