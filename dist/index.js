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
        transition: 'height 0.3s ease'
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
    const currentColor = Theme.colors.secondary.main;
    let ScomCalendar = class ScomCalendar extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.datesMap = new Map();
            this.gridMap = new Map();
            this.selectedMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this.filteredData = {};
            this.pos1 = { x: 0, y: 0 };
            this.pos2 = { x: 0, y: 0 };
            this.oldMonth = '';
            this.datePnlHeight = 0;
            this.isVerticalSwiping = false;
            this._events = [];
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
        get datesInMonth() {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const monthKey = `${month}-${year}`;
            let dates = [];
            if (this.datesMap.has(monthKey)) {
                dates = this.datesMap.get(monthKey);
            }
            else {
                dates = this.getDates(month, year);
            }
            return dates;
        }
        get calendarData() {
            const eventsMap = new Map();
            for (let i = 0; i < this.datesInMonth.length; i++) {
                const item = this.datesInMonth[i];
                const holiday = this.getHoliday(item);
                const events = this.getEvents(item);
                const dateKey = `${item.date}-${item.month}-${item.year}`;
                eventsMap.set(dateKey, { holiday, events });
            }
            return eventsMap;
        }
        getDates(month, year) {
            let dates = [];
            const firstDay = new Date(year, month - 1, 1).getDay();
            const daysInMonth = this.daysInMonth(month, year);
            const prevMonthLastDate = new Date(year, month - 1, 0);
            const prevMonth = prevMonthLastDate.getMonth() + 1;
            const prevYear = prevMonthLastDate.getFullYear();
            const prevDate = prevMonthLastDate.getDate();
            const prevDateStr = `${prevMonth}/${prevDate}/${prevYear}`;
            if (firstDay > 0) {
                dates.unshift({ month: prevMonth, year: prevYear, date: prevDate, day: prevMonthLastDate.getDay() });
                for (let i = 1; i < firstDay; i++) {
                    const before = (0, components_2.moment)(prevDateStr).subtract(i, 'days');
                    dates.unshift({ month: prevMonth, year: prevYear, date: before.get('date'), day: before.get('day') });
                }
            }
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month - 1, i);
                dates.push({ month, year, date: i, day: date.getDay() });
            }
            const fillingDates = DATES_PER_SLIDE - dates.length;
            if (fillingDates > 0) {
                for (let i = 1; i <= fillingDates; i++) {
                    const after = (0, components_2.moment)(`${month}/${daysInMonth}-${year}`).add(i, 'days');
                    dates.push({ month: month + 1, year: year, date: after.get('date'), day: after.get('day') });
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
                const checkingDate = (0, components_2.moment)(`${month}/${date}/${year}`).startOf('day');
                return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
            });
        }
        getHoliday(item) {
            const { year, month, date } = item;
            const finded = holidays_json_1.default.find(holiday => {
                return (0, components_2.moment)(holiday.date).isSame((0, components_2.moment)(`${month}/${date}/${year}`));
            });
            return finded;
        }
        setData({ events }) {
            this.clear();
            this.events = events;
            this.renderUI();
        }
        renderUI(direction) {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const date = this.initialDate.getDate();
            const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
            this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
            this.renderMonth(month, year, direction);
            this.renderEventSlider();
        }
        clear() {
            this.listStack.clearInnerHTML();
            this.updateDatesHeight('100%');
            this.pnlSelected.height = 0;
            this.gridMap = new Map();
            this.selectedMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this.filteredData = {};
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
                gridDates.append(this.$render("i-vstack", { border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, width: '100%', overflow: 'hidden', padding: { bottom: '0.75rem' }, minHeight: i == 0 ? '2rem' : 'auto' },
                    this.$render("i-grid-layout", { templateRows: ['auto'], templateColumns: [`repeat(${DAYS}, 1fr)`], width: '100%' }),
                    this.$render("i-grid-layout", { templateRows: ['auto'], templateColumns: [`repeat(${DAYS}, 1fr)`], width: '100%', overflow: 'hidden', gap: { row: '0.25rem' }, autoRowSize: 'auto', autoFillInHoles: true })));
            }
            const dates = [...this.datesInMonth];
            for (let i = 0; i < dates.length; i++) {
                const rowIndex = Math.floor(i / DAYS);
                if (!gridDates.children[rowIndex])
                    break;
                const columnIndex = i % DAYS;
                const item = dates[i];
                const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
                const defaultColor = i === rowIndex * DAYS ? Theme.colors.error.main : Theme.text.primary;
                const color = this.isCurrentDate(item) ? Theme.colors.primary.contrastText : defaultColor;
                const bgColor = this.isCurrentDate(item) ? currentColor : 'transparent';
                const holiday = this.getHoliday(item);
                const events = this.getEventByStartDate(item);
                const el = (this.$render("i-vstack", { gap: "0.125rem", horizontalAlignment: 'center', padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '0.25rem', width: '1px', style: 'solid', color: 'transparent' }, cursor: 'pointer', onClick: (target, event) => this.onDateClick(target, item) },
                    this.$render("i-label", { caption: `${item.date}`, font: { size: '1rem', weight: 500, color }, opacity: inMonth ? 1 : 0.36, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, border: { radius: '0.125rem' }, background: { color: bgColor }, class: "text-center" })));
                el.setAttribute('data-date', `${item.date}-${item.month}-${item.year}`);
                if (holiday) {
                    const holidayEl = this.renderHoliday(holiday, columnIndex);
                    gridDates.children[rowIndex].children[1].append(holidayEl);
                }
                if (events?.length) {
                    for (let event of events) {
                        const eventEl = this.renderEvent(event, columnIndex);
                        gridDates.children[rowIndex].children[1].append(eventEl);
                    }
                }
                gridDates.children[rowIndex].children[0].append(el);
            }
            const oldMonth = this.gridMap.get(this.oldMonth);
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
            const eventEl = (this.$render("i-vstack", { grid: { column: columnIndex + 1, columnSpan, verticalAlignment: 'start' }, border: { radius: '0.25rem' }, background: { color: event.color || defaultEventColor }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: event.title, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } })));
            return eventEl;
        }
        renderHoliday(holiday, columnIndex) {
            return this.$render("i-vstack", { border: { radius: '0.25rem' }, background: { color: defaultHolidayColor }, grid: { column: columnIndex + 1, verticalAlignment: 'start' }, padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: holiday.name, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', textOverflow: 'ellipsis', font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } }));
        }
        renderEventSlider() {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const calendarData = this.calendarData;
            const itemsData = [];
            for (let date of this.datesInMonth) {
                if (date.month !== month || date.year !== year)
                    continue;
                const { holiday, events } = calendarData.get(`${date.date}-${date.month}-${date.year}`);
                const eventEl = this.renderSliderItem(date, holiday, events);
                itemsData.push({
                    name: '',
                    controls: [eventEl]
                });
            }
            this.eventSlider.items = itemsData;
            this.eventSlider.activeSlide = this.initialDate.getDate() - 1;
        }
        renderSliderItem(item, holiday, events) {
            const { date, month, year } = item;
            const dateKey = `${date}-${month}-${year}`;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            const selectedPanel = this.selectedMap.get(dateKey);
            if (selectedPanel)
                return;
            const selectedWrap = this.$render("i-vstack", { width: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' } });
            selectedWrap.setAttribute('data-slider-date', dateKey);
            const caption = `${date} ${monthName}`;
            selectedWrap.append(this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between', margin: { top: '1rem' }, width: '100%', overflow: 'hidden' },
                this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                    this.$render("i-label", { caption: caption, font: { size: '0.75rem', weight: 600 } }),
                    this.$render("i-panel", { border: { left: { width: '1px', style: 'solid', color: Theme.divider } }, height: '100%' }),
                    this.$render("i-label", { caption: '12c / 8c', font: { size: '0.75rem', weight: 600 } }),
                    this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', fill: Theme.colors.warning.main, name: 'sun' })),
                this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'smile' })));
            const eventsStack = this.$render("i-vstack", { width: "100%", gap: "1rem", margin: { top: '0.5rem' } });
            selectedWrap.append(eventsStack);
            if (!holiday && !events.length) {
                eventsStack.append(this.$render("i-label", { margin: { top: '0.5rem' }, caption: 'No events', font: { size: '0.75rem', color: Theme.text.primary } }));
            }
            else {
                this.renderSelectedHoliday(holiday, eventsStack);
                for (let i = 0; i < events.length; i++) {
                    this.renderSelectedEvent(events[i], eventsStack, i === events.length - 1);
                }
            }
            return selectedWrap;
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
        onDateClick(target, date) {
            this.updateOldDate(date);
            this.initialDate = new Date(date.year, date.month - 1, date.date);
            this.updateNewDate(target, date);
            this.updateDatesHeight('40%');
            this.pnlSelected.height = 'auto';
            this.eventSlider.activeSlide = date.date - 1;
            this.filteredData.date = date;
            if (this.onFilter)
                this.onFilter({ date });
        }
        updateOldDate(date) {
            if (this.selectedDate) {
                const label = this.selectedDate.querySelector('i-label');
                if (label) {
                    const defaultColor = date.day === 0 ? Theme.colors.error.main : Theme.text.primary;
                    label.font = { size: '0.875rem', weight: 500, color: this.isCurrentDate(date) ? Theme.colors.primary.contrastText : defaultColor };
                    label.background.color = 'transparent';
                }
            }
        }
        updateNewDate(target, data) {
            const { month, year, date } = data;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
            this.selectedDate = target;
            const label = target?.querySelector('i-label');
            if (label) {
                label.font = { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 500 };
                label.background.color = Theme.colors.primary.main;
            }
        }
        updateDatesHeight(height) {
            this.pnlDates.height = height;
            let opacity = '1';
            if (typeof height === 'string') {
                opacity = height === '40%' ? '0' : '1';
            }
            else {
                const eventHeight = height * 0.05;
                opacity = eventHeight < 20 ? '0' : '1';
            }
            this.style.setProperty('--event-opacity', opacity);
            this.style.setProperty('--event-height', opacity === '0' ? '3px' : 'auto');
        }
        onNextMonth() {
            this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() + 1);
            this.renderUI(1);
        }
        onPrevMonth() {
            this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() - 1);
            this.renderUI(-1);
        }
        onFilterData(target) {
            this.filteredData.type = target.caption;
            if (this.onFilter)
                this.onFilter({ type: target.caption });
        }
        onAddEvent() {
        }
        onSlideChanged(index) {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const dates = this.datesMap.get(`${month}-${year}`);
            const newDate = dates.find(date => date.date === index + 1);
            this.updateOldDate(newDate);
            this.initialDate.setDate(newDate.date);
            const dataDate = `${newDate.date}-${newDate.month}-${newDate.year}`;
            const target = this.listStack.querySelector(`[data-date="${dataDate}"]`);
            this.updateNewDate(target, newDate);
        }
        _handleMouseDown(event, stopPropagation) {
            const result = super._handleMouseDown(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                if (sliderList) {
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
                if (sliderList) {
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
            }
            return false;
        }
        dragStartHandler(event) {
            if (event instanceof TouchEvent) {
                this.pos1 = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
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
            this.datePnlHeight = this.pnlDates.offsetHeight;
            this.isVerticalSwiping = false;
        }
        dragHandler(event) {
            event.preventDefault();
            if (event instanceof TouchEvent) {
                this.pos2 = {
                    x: this.pos1.x - event.touches[0].pageX,
                    y: event.touches[0].pageY - this.pos1.y
                };
            }
            else {
                this.pos2 = {
                    x: this.pos1.x - event.clientX,
                    y: event.pageY - this.pos1.y
                };
            }
            const containerHeight = this.pnlWrapper.offsetHeight;
            const verticalThreshold = 50;
            if (Math.abs(this.pos2.y) > verticalThreshold) {
                this.isVerticalSwiping = true;
                let newHeight = this.datePnlHeight + this.pos2.y;
                this.pnlSelected.height = 'auto';
                if (newHeight > containerHeight) {
                    newHeight = containerHeight;
                    this.pnlSelected.height = 0;
                }
                else if (newHeight < 200) {
                    newHeight = 100;
                }
                this.updateDatesHeight(newHeight);
            }
        }
        dragEndHandler(event) {
            if (!this.isVerticalSwiping) {
                const containerWidth = this.pnlWrapper.offsetWidth;
                const horizontalThreshold = containerWidth * 0.3;
                if (this.pos2.x < -horizontalThreshold) {
                    this.onPrevMonth();
                    this.listStack.scrollTo({
                        left: this.listStack.scrollLeft - containerWidth,
                        behavior: 'smooth',
                    });
                }
                else if (this.pos2.x > horizontalThreshold) {
                    this.onNextMonth();
                    this.listStack.scrollTo({
                        left: this.listStack.scrollLeft + containerWidth,
                        behavior: 'smooth',
                    });
                }
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
            return (this.$render("i-panel", { maxHeight: '100dvh', overflow: 'hidden' },
                this.$render("i-vstack", { id: "pnlWrapper", width: '100%', height: 'calc(100vh - 3.125rem)', overflow: 'hidden', gap: "1rem" },
                    this.$render("i-vstack", { id: "pnlDates", minHeight: 100, maxHeight: '99%', padding: { top: '0.5rem', left: '0.75rem', right: '0.75rem' }, overflow: 'hidden', class: index_css_1.transitionStyle },
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'center', gap: "0.25rem" },
                            this.$render("i-label", { id: "lbMonth", font: { size: '1.25rem', weight: 600 } }),
                            this.$render("i-label", { id: "lbYear", font: { size: '1.25rem', color: Theme.text.secondary } })),
                        this.$render("i-grid-layout", { id: "gridHeader", columnsPerRow: DAYS, margin: { top: '0.75rem' } }),
                        this.$render("i-hstack", { id: "listStack", overflow: { x: 'auto', y: 'hidden' }, minHeight: '1.875rem', class: index_css_1.swipeStyle, stack: { grow: '1' } })),
                    this.$render("i-panel", { id: "pnlSelected", stack: { grow: '1', shrink: '1', basis: 'auto' }, minHeight: 0, height: 0, overflow: 'hidden' },
                        this.$render("i-carousel-slider", { id: "eventSlider", swipe: true, width: '100%', height: '100%', indicators: false, autoplay: false, border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, onSlideChange: this.onSlideChanged }))),
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
