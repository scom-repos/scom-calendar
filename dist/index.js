var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-calendar/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-calendar/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.closeIconStyle = exports.aspectRatioStyle = exports.transitionStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.transitionStyle = components_1.Styles.style({
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
    });
    exports.aspectRatioStyle = components_1.Styles.style({
        aspectRatio: '1 / 1'
    });
    exports.closeIconStyle = components_1.Styles.style({
        $nest: {
            '&:hover': {
                background: `${Theme.colors.primary.dark} !important`,
                borderRadius: '100%',
                $nest: {
                    'svg': {
                        fill: `${Theme.colors.primary.contrastText} !important`
                    }
                }
            }
        }
    });
});
define("@scom/scom-calendar", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/index.css.ts", "@scom/scom-calendar/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomCalendar = class ScomCalendar extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.dayMap = new Map();
            this.datesMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this._events = [];
            this.filteredData = {};
            this.onFilterData = this.onFilterData.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get events() {
            return this._events ?? [];
        }
        set events(value) {
            this._events = value ?? [];
        }
        setData({ events }) {
            this.events = events;
            this.pnlNotSelected.visible = true;
            this.pnlSelected.visible = false;
            this.renderMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
        }
        isCurrentDate(date) {
            if (!date)
                return false;
            return this.currentDate.getDate() === date.date &&
                this.currentDate.getMonth() + 1 === date.month &&
                this.currentDate.getFullYear() === date.year;
        }
        renderHeader() {
            this.gridHeader.clearInnerHTML();
            this.dayMap = new Map();
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            for (let i = 0; i < days.length; i++) {
                const color = i === 0 ? Theme.colors.error.main : Theme.text.primary;
                const el = this.$render("i-label", { caption: days[i], font: { size: '0.875rem', weight: 500, color }, opacity: 0.7, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, lineHeight: '1.5rem', class: "text-center" });
                this.gridHeader.append(el);
                this.dayMap.set(days[i], el);
            }
        }
        renderMonth(month, year) {
            this.listStack.clearInnerHTML();
            this.gridEvents.clearInnerHTML();
            this.lbMonth.caption = (0, components_2.moment)(this.initialDate).format('MMMM');
            this.lbYear.caption = (0, components_2.moment)(this.initialDate).format('YYYY');
            this.lbYear.visible = this.initialDate.getFullYear() !== this.currentDate.getFullYear();
            const gridDates = this.$render("i-grid-layout", { templateRows: ['repeat(6, 1fr)'], templateColumns: ['repeat(7, 1fr)'], width: '100%' });
            const event1 = (this.$render("i-vstack", { grid: { column: 3, row: 3, columnSpan: 3 } },
                this.$render("i-label", { caption: 'Event 1' })));
            gridDates.append(event1);
            let dates = [];
            if (this.datesMap.has(`${month}-${year}`)) {
                dates = this.datesMap.get(`${month}-${year}`);
            }
            else {
                dates = this.getDates(month, year);
            }
            for (let item of dates) {
                const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
                const isEnabled = this.hasData(item);
                const el = this.$render("i-vstack", { gap: "0.125rem", horizontalAlignment: 'center', verticalAlignment: 'center', padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, class: index_css_1.aspectRatioStyle, border: { radius: '100%' }, cursor: isEnabled ? 'pointer' : 'default', hover: { backgroundColor: isEnabled ? Theme.action.hoverBackground : 'transparent' }, onClick: (target) => this.onDateClick(target, item) },
                    this.$render("i-label", { caption: item.date, font: { size: '0.875rem', weight: 500, color: this.isCurrentDate(item) ? Theme.colors.primary.dark : Theme.text.primary }, opacity: inMonth ? 1 : 0.36, lineHeight: '1rem', class: "text-center" }),
                    this.$render("i-panel", { width: '0.313rem', height: '0.313rem', border: { radius: '100%' }, background: { color: Theme.text.primary }, stack: { shrink: '0' }, opacity: isEnabled ? 0.36 : 0 }));
                gridDates.append(el);
            }
            this.listStack.append(gridDates);
            this.datesMap.set(`${month}-${year}`, dates);
        }
        renderSelected(data) {
            this.pnlSelected.clearInnerHTML();
            const { month, year, date } = data;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'long' });
            const caption = `${monthName} ${date}`;
            this.pnlSelected.append(this.$render("i-label", { caption: caption, font: { size: '0.875rem', weight: 500 } }), this.$render("i-icon", { stack: { shrink: '0' }, cursor: 'pointer', border: { radius: '100%' }, tooltip: { content: 'Close', placement: 'top' }, padding: { top: '0.325rem', bottom: '0.325rem', left: '0.325rem', right: '0.325rem' }, background: { color: Theme.colors.secondary.light }, name: 'times', width: '1rem', height: '1rem', fill: Theme.text.primary, class: index_css_1.closeIconStyle, onClick: () => this.onCloseClick(data) }));
        }
        getDates(month, year) {
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
                    const before = (0, components_2.moment)(prevDateStr).subtract(i, 'days');
                    dates.unshift({ month: prevMonth, year: prevYear, date: before.get('date') });
                }
            }
            for (let i = 1; i <= daysInMonth; i++) {
                dates.push({ month, year, date: i });
            }
            const fillingDates = 42 - dates.length;
            if (fillingDates > 0) {
                for (let i = 1; i <= fillingDates; i++) {
                    const after = (0, components_2.moment)(`${year}-${month}-${daysInMonth}`).add(i, 'days');
                    dates.push({ month: month + 1, year: year, date: after.get('date') });
                }
            }
            return dates;
        }
        daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }
        hasData(item) {
            const finded = this.events.find(event => {
                const date = (0, components_2.moment)(event.startDate);
                if (date.get('month') + 1 === item.month && date.get('year') === item.year && date.get('date') === item.date) {
                    return true;
                }
            });
            return !!finded;
        }
        onDateClick(target, date) {
            if (!this.hasData(date))
                return;
            this.renderSelected(date);
            this.resetSelectedDate(date, true);
            this.selectedDate = target;
            target.background.color = Theme.colors.primary.dark;
            const label = target.querySelector('i-label');
            if (label)
                label.font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
            const point = target.querySelector('i-panel');
            if (point)
                point.background.color = Theme.colors.primary.contrastText;
            this.filteredData.date = date;
            if (this.onFilter)
                this.onFilter({ date });
        }
        onCloseClick(date) {
            this.resetSelectedDate(date, false);
            if (this.onFilter)
                this.onFilter();
        }
        resetSelectedDate(date, isSelected) {
            this.pnlNotSelected.visible = !isSelected;
            this.pnlSelected.visible = isSelected;
            if (this.selectedDate) {
                this.selectedDate.background.color = 'transparent';
                const label = this.selectedDate.querySelector('i-label');
                if (label)
                    label.font = { size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.dark : Theme.text.primary };
                const point = this.selectedDate.querySelector('i-panel');
                if (point)
                    point.background.color = Theme.text.primary;
            }
        }
        onNext() {
            this.initialDate.setMonth(this.initialDate.getMonth() + 1);
            this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
        }
        onPrev() {
            this.initialDate.setMonth(this.initialDate.getMonth() - 1);
            this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
        }
        onCurrent() {
            this.initialDate = new Date();
            this.currentDate = new Date();
            this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
        }
        onFilterData(target) {
            const children = target.parent?.children || [];
            for (let child of children) {
                if (child.id === target.id) {
                    child.background.color = Theme.background.default;
                    child.font.color = Theme.text.primary;
                }
                else {
                    child.background.color = 'transparent';
                    child.font.color = Theme.text.secondary;
                }
            }
            this.filteredData.type = target.caption;
            if (this.onFilter)
                this.onFilter({ type: target.caption });
        }
        init() {
            super.init();
            this.onFilter = this.getAttribute('onFilter', true) || this.onFilter;
            const events = this.getAttribute('events', true);
            this.renderHeader();
            this.setData({ events });
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, border: { radius: '0.5rem', width: 1, style: 'solid', color: Theme.divider }, overflow: 'hidden' },
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.5rem' },
                    this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.25rem" },
                        this.$render("i-label", { id: "lbMonth", font: { size: 'clamp(1rem, 0.9489rem + 0.2273vw, 1.125rem)', weight: 600 } }),
                        this.$render("i-label", { id: "lbYear", font: { size: '1rem', color: Theme.text.secondary } })),
                    this.$render("i-hstack", { verticalAlignment: 'center' },
                        this.$render("i-panel", { stack: { shrink: '0' }, opacity: 0.36, hover: { opacity: 1 }, cursor: 'pointer', onClick: this.onPrev.bind(this) },
                            this.$render("i-icon", { padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, name: 'angle-left', width: '1.5rem', height: '1.5rem', fill: Theme.text.primary })),
                        this.$render("i-panel", { stack: { shrink: '0' }, opacity: 0.36, hover: { opacity: 1 }, cursor: 'pointer', onClick: this.onCurrent.bind(this) },
                            this.$render("i-icon", { padding: { left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem' }, name: 'circle', width: '1.5rem', height: '1.5rem', fill: Theme.text.primary })),
                        this.$render("i-panel", { stack: { shrink: '0' }, opacity: 0.36, hover: { opacity: 1 }, cursor: 'pointer', onClick: this.onNext.bind(this) },
                            this.$render("i-icon", { padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, name: 'angle-right', width: '1.5rem', height: '1.5rem', fill: Theme.text.primary })))),
                this.$render("i-grid-layout", { id: "gridHeader", columnsPerRow: 7, margin: { top: '0.5rem' } }),
                this.$render("i-hstack", { id: "listStack", overflow: { x: 'auto', y: 'hidden' }, minHeight: '1.875rem' }),
                this.$render("i-grid-layout", { id: "gridEvents", templateRows: ['repeat(6, 1fr)'], templateColumns: ['repeat(7, 1fr)'], width: '100%' }),
                this.$render("i-hstack", { id: "pnlSelected", verticalAlignment: "center", horizontalAlignment: 'space-between', padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, margin: { top: '0.5rem' }, visible: false }),
                this.$render("i-hstack", { id: "pnlNotSelected", verticalAlignment: "center", horizontalAlignment: 'space-between', padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '0.5rem' }, background: { color: Theme.colors.secondary.light }, margin: { top: '0.5rem' } },
                    this.$render("i-button", { id: "btnUpcoming", caption: 'Upcoming', font: { size: '0.875rem', weight: 500, color: Theme.text.primary }, border: { radius: '0.5rem' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, height: '1.875rem', width: '100%', background: { color: Theme.background.default }, boxShadow: 'none', class: index_css_1.transitionStyle, onClick: this.onFilterData }),
                    this.$render("i-button", { id: "btnPast", caption: 'Past', font: { size: '0.875rem', weight: 500, color: Theme.text.secondary }, border: { radius: '0.5rem' }, height: '1.875rem', width: '100%', padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, background: { color: 'transparent' }, boxShadow: 'none', class: index_css_1.transitionStyle, onClick: this.onFilterData }))));
        }
    };
    ScomCalendar = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-calendar')
    ], ScomCalendar);
    exports.default = ScomCalendar;
});
