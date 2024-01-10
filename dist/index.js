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
define("@scom/scom-calendar/data/holidays.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-calendar/data/holidays.json.ts'/> 
    exports.default = [
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-12",
            "day": "Monday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-09",
            "day": "Friday",
            "name": "Vietnamese New Year's Eve",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-10",
            "day": "Saturday",
            "name": "Vietnamese New Year",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-04-18",
            "day": "Thursday",
            "name": "Hung Kings Festival",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-01-01",
            "day": "Monday",
            "name": "International New Year's Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-05-01",
            "day": "Wednesday",
            "name": "International Labor Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-09-02",
            "day": "Monday",
            "name": "Independence Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-13",
            "day": "Tuesday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-04-30",
            "day": "Tuesday",
            "name": "Liberation Day/Reunification Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-11",
            "day": "Sunday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        }
    ];
});
define("@scom/scom-calendar/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.swipeStyle = exports.transitionStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.transitionStyle = components_1.Styles.style({
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
    });
    exports.swipeStyle = components_1.Styles.style({
        scrollSnapType: 'x mandatory',
        "-webkit-scroll-snap-type": 'x mandatory',
        overflowX: 'auto',
        '-webkit-overflow-scrolling': 'touch',
        $nest: {
            '.scroll-item': {
                scrollSnapAlign: 'start'
            },
            '&::-webkit-scrollbar': {
                height: 0
            },
        }
    });
});
define("@scom/scom-calendar", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/data/holidays.json.ts", "@scom/scom-calendar/index.css.ts", "@scom/scom-calendar/index.css.ts"], function (require, exports, components_2, holidays_json_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const DATES_PER_SLIDE = 35;
    const DAYS = 7;
    const ROWS = 5;
    const defaultHolidayColor = Theme.colors.info.main;
    const defaultEventColor = Theme.colors.primary.main;
    let ScomCalendar = class ScomCalendar extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.datesMap = new Map();
            this.gridMap = new Map();
            this.eventsMap = new Map();
            this.selectedMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this._events = [];
            this.filteredData = {};
            this.pos1 = { x: 0, y: 0 };
            this.pos2 = { x: 0, y: 0 };
            this.selectedMonth = '';
            this.selectedString = '';
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
        isCurrentDate(date) {
            if (!date)
                return false;
            return this.currentDate.getDate() === date.date &&
                this.currentDate.getMonth() + 1 === date.month &&
                this.currentDate.getFullYear() === date.year;
        }
        setData({ events }) {
            this.listStack.clearInnerHTML();
            this.pnlSelected.clearInnerHTML();
            this.events = events;
            this.pnlSelected.visible = false;
            this.renderMonth(this.currentDate.getMonth() + 1, this.currentDate.getFullYear());
        }
        renderHeader() {
            this.gridHeader.clearInnerHTML();
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            for (let i = 0; i < days.length; i++) {
                const color = i === 0 ? Theme.colors.error.main : Theme.text.primary;
                const el = this.$render("i-label", { caption: days[i], font: { size: '1rem', weight: 500, color }, opacity: 0.7, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, lineHeight: '1.5rem', class: "text-center" });
                this.gridHeader.append(el);
            }
        }
        renderMonth(month, year, direction) {
            const monthKey = `${month}-${year}`;
            this.lbMonth.caption = (0, components_2.moment)(this.initialDate).format('MMM');
            this.lbYear.caption = (0, components_2.moment)(this.initialDate).format('YYYY');
            this.lbYear.visible = this.initialDate.getFullYear() !== this.currentDate.getFullYear();
            const gridMonth = this.gridMap.get(monthKey);
            if (gridMonth)
                return;
            const gridDates = this.$render("i-grid-layout", { templateRows: [`repeat(${ROWS}, 1fr)`], autoRowSize: 'auto', autoFillInHoles: true, columnsPerRow: 1, width: '100%', stack: { shrink: '0', grow: '0', basis: 'auto' }, class: "scroll-item" });
            gridDates.setAttribute('data-month', monthKey);
            for (let i = 0; i < ROWS; i++) {
                gridDates.append(this.$render("i-vstack", { border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, width: '100%', overflow: 'hidden' },
                    this.$render("i-grid-layout", { templateRows: ['auto'], templateColumns: [`repeat(${DAYS}, 1fr)`], width: '100%' }),
                    this.$render("i-grid-layout", { templateRows: ['auto'], templateColumns: [`repeat(${DAYS}, 1fr)`], width: '100%', height: '100%', overflow: 'hidden', gap: { row: '0.25rem' }, padding: { bottom: '0.75rem' }, autoRowSize: 'auto', autoFillInHoles: true })));
            }
            let dates = [];
            if (this.datesMap.has(monthKey)) {
                dates = this.datesMap.get(monthKey);
            }
            else {
                dates = this.getDates(month, year);
            }
            for (let i = 0; i < dates.length; i++) {
                const rowIndex = Math.floor(i / DAYS);
                if (!gridDates.children[rowIndex])
                    break;
                const columnIndex = i % DAYS;
                const item = dates[i];
                const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
                const defaultColor = i === rowIndex * DAYS ? Theme.colors.error.main : Theme.text.primary;
                const color = this.isCurrentDate(item) ? Theme.colors.primary.contrastText : defaultColor;
                const bgColor = this.isCurrentDate(item) ? Theme.colors.primary.main : 'transparent';
                const holiday = this.getHoliday(item);
                const events = this.getEventByStartDate(item);
                const el = (this.$render("i-vstack", { gap: "0.125rem", horizontalAlignment: 'center', padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '0.25rem', width: '1px', style: 'solid', color: 'transparent' }, cursor: 'pointer', onClick: (target, event) => this.onDateClick(target, event, item, holiday, i === rowIndex * DAYS) },
                    this.$render("i-label", { caption: item.date, font: { size: '1rem', weight: 500, color }, opacity: inMonth ? 1 : 0.36, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, border: { radius: '0.125rem' }, background: { color: bgColor }, class: "text-center" })));
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
                        }
                        else {
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
                }
                else {
                    this.listStack.insertBefore(gridDates, oldMonth);
                }
            }
            this.datesMap.set(`${month}-${year}`, dates);
            this.gridMap.set(`${month}-${year}`, gridDates);
        }
        renderEvent(event, columnIndex) {
            const spanDays = (0, components_2.moment)(event.endDate).startOf('day').diff((0, components_2.moment)(event.startDate).startOf('day'), 'days');
            const columnSpan = spanDays === 0 ? 1 : spanDays;
            const eventEl = (this.$render("i-vstack", { grid: { column: columnIndex + 1, columnSpan, verticalAlignment: 'center' }, border: { radius: '0.25rem' }, background: { color: event.color || defaultEventColor }, minHeight: 3, maxHeight: '1rem', overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: event.title, font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } })));
            return eventEl;
        }
        renderHoliday(holiday, columnIndex) {
            return this.$render("i-vstack", { border: { radius: '0.25rem' }, background: { color: defaultHolidayColor }, grid: { column: columnIndex + 1, verticalAlignment: 'center' }, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, minHeight: 3, maxHeight: '1rem', overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: holiday.name, wordBreak: 'break-word', lineClamp: 2, font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } }));
        }
        renderSelected(data, holiday, events, direction) {
            const { month, year, date } = data;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
            const dateKey = `${date}-${month}-${year}`;
            const selectedPanel = this.selectedMap.get(dateKey);
            if (selectedPanel)
                return;
            const selectedWrap = this.$render("i-vstack", { width: '100%', stack: { shrink: '0', grow: '0', basis: 'auto' }, class: "scroll-item" });
            const caption = `${date} ${monthName}`;
            selectedWrap.append(this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', margin: { top: '1rem' } },
                this.$render("i-label", { caption: caption, font: { size: '0.75rem', weight: 600 } }),
                this.$render("i-panel", { border: { left: { width: '1px', style: 'solid', color: Theme.divider } }, height: '100%' }),
                this.$render("i-label", { caption: '12c / 8c', font: { size: '0.75rem', weight: 600 } }),
                this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', fill: Theme.colors.warning.main, name: 'sun' }),
                this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', margin: { left: 'auto' }, fill: Theme.text.primary, name: 'smile' })));
            const eventsStack = this.$render("i-vstack", { width: "100%", gap: "1rem", margin: { top: '0.5rem' } });
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
                }
                else {
                    this.pnlSelected.insertBefore(selectedWrap, oldSelected);
                }
            }
        }
        renderSelectedEvent(event, parent, isLast) {
            const startTime = (0, components_2.moment)(event.startDate).format('HH:mm');
            const endTime = (0, components_2.moment)(event.endDate).format('HH:mm');
            parent.appendChild(this.$render("i-panel", { border: { bottom: { width: '1px', style: isLast ? 'none' : 'solid', color: Theme.divider } } },
                this.$render("i-hstack", { padding: { top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem' }, gap: '0.25rem' },
                    this.$render("i-hstack", { stack: { shrink: '0', basis: '2.5rem' } },
                        this.$render("i-label", { caption: startTime, font: { size: '0.75rem', weight: 500 } })),
                    this.$render("i-panel", { stack: { shrink: '0', basis: '3px' }, height: '1.25rem', width: 3, border: { radius: '0.25rem' }, margin: { right: '0.625rem' }, background: { color: event.color || defaultEventColor } }),
                    this.$render("i-vstack", { gap: "0.25rem" },
                        this.$render("i-label", { caption: event.title, font: { size: '1rem', weight: 500 } }),
                        this.$render("i-label", { caption: `${startTime} - ${endTime}`, font: { size: '0.75rem', weight: 500 }, opacity: 0.36 })))));
        }
        renderSelectedHoliday(holiday, parent) {
            if (!holiday)
                return;
            parent.appendChild(this.$render("i-panel", null,
                this.$render("i-hstack", { padding: { top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem' }, gap: '0.25rem' },
                    this.$render("i-hstack", { stack: { shrink: '0', basis: '2.5rem' }, horizontalAlignment: 'center' },
                        this.$render("i-icon", { width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'calendar' })),
                    this.$render("i-panel", { stack: { shrink: '0', basis: '3px' }, height: '1.25rem', width: 3, border: { radius: '0.25rem' }, margin: { right: '0.625rem' }, background: { color: holiday?.color || defaultHolidayColor } }),
                    this.$render("i-label", { caption: holiday.name, font: { size: '1rem', weight: 500 } }),
                    this.$render("i-vstack", { verticalAlignment: 'center', margin: { left: 'auto' }, stack: { shrink: '0' } },
                        this.$render("i-icon", { width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'calendar-week' })))));
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
            const fillingDates = DATES_PER_SLIDE - dates.length;
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
        getEventByStartDate(item) {
            return [...this.events].filter(event => {
                const date = (0, components_2.moment)(event.startDate);
                if (date.get('month') + 1 === item.month && date.get('year') === item.year && date.get('date') === item.date) {
                    return true;
                }
            });
        }
        getEvents(item) {
            const { year, month, date } = item;
            return [...this.events].filter(event => {
                const startDate = (0, components_2.moment)(event.startDate).startOf('day');
                const endDate = (0, components_2.moment)(event.endDate).endOf('day');
                const checkingDate = (0, components_2.moment)(`${year}-${month}-${date}`).startOf('day');
                return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
            });
        }
        getHoliday(item) {
            const { year, month, date } = item;
            const finded = holidays_json_1.default.find(holiday => {
                return (0, components_2.moment)(holiday.date).isSame((0, components_2.moment)(`${year}-${month}-${date}`));
            });
            return finded;
        }
        onDateClick(target, event, date, holiday, isSunday) {
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
            if (this.onFilter)
                this.onFilter({ date });
        }
        updateSelected(date, holiday, events, direction) {
            this.pnlSelected.visible = true;
            this.renderSelected(date, holiday, events, direction);
            // this.selectedDate = target;
            // const label = target.querySelector('i-label') as Control;
            // if (label) {
            //   label.font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
            //   label.background.color = Theme.colors.primary.main;
            // }
        }
        resetSelectedDate(date, isSunday) {
            if (this.selectedDate) {
                const label = this.selectedDate.querySelector('i-label');
                if (label) {
                    const defaultColor = isSunday ? Theme.colors.error.main : Theme.text.primary;
                    label.font = { size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.contrastText : defaultColor };
                    label.background.color = 'transparent';
                }
            }
        }
        onNextMonth() {
            this.selectedMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() + 1);
            this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear(), 1);
        }
        onPrevMonth() {
            this.selectedMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() - 1);
            this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear(), -1);
        }
        onNextDay() {
            this.selectedString = `${this.initialDate.getDate()}-${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setDate(this.initialDate.getDate() + 1);
            const date = {
                month: this.initialDate.getMonth() + 1,
                year: this.initialDate.getFullYear(),
                date: this.initialDate.getDate()
            };
            const holiday = this.getHoliday(date);
            const events = this.getEvents(date);
            this.updateSelected(date, holiday, events, 1);
        }
        onPrevDay() {
            this.selectedString = `${this.initialDate.getDate()}-${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setDate(this.initialDate.getDate() - 1);
            const date = {
                month: this.initialDate.getMonth() + 1,
                year: this.initialDate.getFullYear(),
                date: this.initialDate.getDate()
            };
            const holiday = this.getHoliday(date);
            const events = this.getEvents(date);
            this.updateSelected(date, holiday, events, -1);
        }
        // private onCurrent() {
        //   this.initialDate = new Date();
        //   this.currentDate = new Date();
        //   this.renderMonth(this.initialDate.getMonth() + 1, this.initialDate.getFullYear());
        // }
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
        onAddEvent() {
        }
        _handleMouseDown(event, stopPropagation) {
            const result = super._handleMouseDown(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                const pnlSelected = target.closest('#pnlSelected');
                if (sliderList || pnlSelected) {
                    this.dragStartHandler(event);
                    return true;
                }
            }
            return false;
        }
        _handleMouseMove(event, stopPropagation) {
            const result = super._handleMouseMove(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                const pnlSelected = target.closest('#pnlSelected');
                if (sliderList || pnlSelected) {
                    this.dragHandler(event);
                    return true;
                }
            }
            return false;
        }
        _handleMouseUp(event, stopPropagation) {
            const result = super._handleMouseUp(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
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
        dragStartHandler(event) {
            if (event instanceof TouchEvent) {
                this.pos1 = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
            else {
                event.preventDefault();
                this.pos1 = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
            this.pos2 = { x: 0, y: 0 };
        }
        dragHandler(event) {
            if (event instanceof TouchEvent) {
                this.pos2 = {
                    x: this.pos1.x - event.touches[0].clientX,
                    y: this.pos1.y - event.touches[0].clientY
                };
            }
            else {
                this.pos2 = {
                    x: this.pos1.x - event.clientX,
                    y: this.pos1.y - event.clientY
                };
            }
        }
        dragEndHandler(event) {
            const threshold = this.pnlWrapper.offsetWidth * 0.3;
            if (this.pos2.x < -threshold) {
                this.onPrevMonth();
                this.listStack.scrollTo({
                    left: this.listStack.scrollLeft - this.pnlWrapper.offsetWidth,
                    behavior: 'smooth',
                });
            }
            else if (this.pos2.x > threshold) {
                this.onNextMonth();
                this.listStack.scrollTo({
                    left: this.listStack.scrollLeft + this.pnlWrapper.offsetWidth,
                    behavior: 'smooth',
                });
            }
        }
        dragSelectedEndHandler(event) {
            const threshold = this.pnlWrapper.offsetWidth * 0.2;
            if (this.pos2.x < -threshold) {
                this.onPrevDay();
                this.listStack.scrollTo({
                    left: this.pnlSelected.scrollLeft - this.pnlWrapper.offsetWidth,
                    behavior: 'smooth',
                });
            }
            else if (this.pos2.x > threshold) {
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
            }
            else if (this.pos2.y > threshold) {
                this.pnlSelected.visible = false;
            }
        }
        init() {
            super.init();
            this.onFilter = this.getAttribute('onFilter', true) || this.onFilter;
            const events = this.getAttribute('events', true);
            this.renderHeader();
            this.setData({ events });
        }
        render() {
            return (this.$render("i-panel", { id: "pnlWrapper" },
                this.$render("i-vstack", { width: '100%', height: 'calc(100dvh - 3.125rem)', overflow: 'hidden', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }, gap: "1rem" },
                    this.$render("i-vstack", { id: "pnlDates", stack: { grow: '1', shrink: '1', basis: 'auto' }, minHeight: 200, overflow: { y: 'auto' } },
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'center', gap: "0.25rem" },
                            this.$render("i-label", { id: "lbMonth", font: { size: '1.25rem', weight: 600 } }),
                            this.$render("i-label", { id: "lbYear", font: { size: '1.25rem', color: Theme.text.secondary } })),
                        this.$render("i-grid-layout", { id: "gridHeader", columnsPerRow: DAYS, margin: { top: '0.75rem' } }),
                        this.$render("i-hstack", { id: "listStack", overflow: { x: 'auto', y: 'hidden' }, minHeight: '1.875rem', class: index_css_1.swipeStyle, stack: { grow: '1' } })),
                    this.$render("i-hstack", { id: "pnlSelected", border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, stack: { grow: '1', shrink: '1', basis: 'auto' }, minHeight: '50%', overflow: { x: 'auto' }, class: index_css_1.swipeStyle, visible: false })),
                this.$render("i-panel", { position: 'fixed', bottom: "0px", left: "0px", zIndex: 999, width: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '1rem' },
                        this.$render("i-input", { id: "inputAdd", placeholder: "Add event on", border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, height: '3.125rem', width: '100%', font: { size: '1rem' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem' }, boxShadow: 'none' }),
                        this.$render("i-button", { id: "btnAdd", icon: { name: 'plus', width: '1rem', height: '1rem', fill: Theme.text.primary }, background: { color: 'transparent' }, border: { radius: '9999px' }, height: 50, width: 50, stack: { shrink: '0' }, onClick: this.onAddEvent })))));
        }
    };
    ScomCalendar = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-calendar')
    ], ScomCalendar);
    exports.default = ScomCalendar;
});
