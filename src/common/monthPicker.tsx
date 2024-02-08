import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements
} from '@ijstech/components'
import { ScomCalendarView } from './view';

interface ScomCalendarMonthPickerElement extends ControlElement {
  date?: string;
  onChanged?: (date: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-calendar--month-picker"]: ScomCalendarMonthPickerElement;
    }
  }
}

@customModule
@customElements('i-scom-calendar--month-picker')
export class ScomCalendarMonthPicker extends Module {
  private monthView: ScomCalendarView;

  private _date: string;

  onChanged: (date: string) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomCalendarMonthPickerElement, parent?: Container) {
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

  setData(date: string) {
    this.date = date;
    this.monthView.onDateClicked = this.onDateClick.bind(this);
    this.monthView.setData({
      mode: 'full',
      date: this.date,
      isPicker: true
    })
  }

  private onDateClick(date: string) {
    this._date = date;
    if (this.onChanged) this.onChanged(date);
  }

  onSwipeFullMonth(direction: number) {
    return this.monthView.onSwipeFullMonth(direction);
  }

  init() {
    super.init()
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const date = this.getAttribute('date', true);
    this.setData(date);
  }

  render(): void {
    return (
      <i-scom-calendar--view id="monthView" />
    )
  }
}
