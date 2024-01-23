var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
define("@scom/scom-calendar/common/select.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.selectorStyles = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    function generateFn() {
        let result = {};
        for (let i = 1; i <= 100; i++) {
            result[`&:nth-child(${i})`] = {
                transform: `rotateX(-18deg * (${i} - 1)) translateZ(9.375rem)`
            };
        }
        return result;
    }
    exports.selectorStyles = components_1.Styles.style({
        $nest: {
            '.select-wrap': {
                position: 'relative',
                height: "100%",
                textAlign: 'center',
                overflow: "hidden",
                fontSize: '1.25rem',
                color: Theme.text.primary,
                $nest: {
                    '&:before, &:after': {
                        position: "absolute",
                        zIndex: 1,
                        display: "block",
                        content: '',
                        width: '100%',
                        height: '50%'
                    },
                    "&:before": {
                        top: 0,
                        backgroundImage: "linear-gradient(to bottom, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0))",
                    },
                    "&:after": {
                        bottom: 0,
                        backgroundImage: "linear-gradient(to top, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0))"
                    },
                    ".select-options": {
                        position: "absolute",
                        top: '50%',
                        left: 0,
                        width: "100%",
                        height: 0,
                        transformStyle: 'preserve-3d',
                        margin: '0 auto',
                        display: 'block',
                        transform: 'translateZ(-9.375rem) rotateX(0deg)',
                        '-webkit-font-smoothing': 'subpixel-antialiased',
                        color: Theme.text.primary,
                        $nest: {
                            '.select-option': {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: '3.125rem',
                                '-webkit-font-smoothing': 'subpixel-antialiased',
                                $nest: generateFn()
                            }
                        }
                    }
                },
            },
            '.highlight': {
                position: "absolute",
                top: "50%",
                transform: "translate(0, -50%)",
                width: "100%",
                borderTop: `0.5px solid ${Theme.action.hoverBackground}`,
                borderBottom: `0.5px solid ${Theme.action.hoverBackground}`,
                fontSize: '1.5rem',
                overflow: "hidden",
            },
            ".highlight-list": {
                position: "absolute",
                padding: 0,
                width: "100%",
                listStyle: 'none'
            },
            /* date */
            ".date-selector": {
                transform: 'translate(-50%, -50%)',
                perspective: '2000px',
                width: '37.5rem',
                maxWidth: '100%',
                height: '18.75rem',
                $nest: {
                    ".select-wrap": {
                        fontSize: '1.25rem'
                    },
                    ".highlight": {
                        fontSize: '1.25rem'
                    }
                },
            }
        }
    });
});
define("@scom/scom-calendar/common/view.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.eventSliderStyle = exports.monthListStyle = exports.swipeStyle = exports.transitionStyle = void 0;
    exports.transitionStyle = components_2.Styles.style({
        transition: 'height 0.3s ease'
    });
    exports.swipeStyle = components_2.Styles.style({
        // transition: 'transform 0.3s ease',
        $nest: {
            '&::-webkit-scrollbar': {
                height: 0
            },
        }
    });
    exports.monthListStyle = components_2.Styles.style({
        $nest: {
            '&:not(.--full) > .scroll-item > .scroll-item': {
                gridTemplateRows: 55
            }
        }
    });
    exports.eventSliderStyle = components_2.Styles.style({
        $nest: {
            "> div": {
                height: '100%'
            }
        }
    });
});
define("@scom/scom-calendar/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_3.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-calendar/common/view.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/common/view.css.ts", "@scom/scom-calendar/assets.ts"], function (require, exports, components_4, view_css_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarView = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    const DATES_PER_SLIDE = 35;
    const DAYS = 7;
    const ROWS = 5;
    const defaultHolidayColor = Theme.colors.info.main;
    const defaultEventColor = Theme.colors.primary.main;
    const currentColor = Theme.colors.secondary.main;
    let ScomCalendarView = class ScomCalendarView extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.datesMap = new Map();
            this.monthsMap = new Map();
            this.selectedMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this.oldMonth = '';
            this.initalDay = 0;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get holidays() {
            return this._data.holidays || [];
        }
        set holidays(value) {
            this._data.holidays = value || [];
        }
        get events() {
            return this._data.events || [];
        }
        set events(value) {
            this._data.events = value || [];
        }
        get mode() {
            return this._data.mode ?? 'full';
        }
        set mode(value) {
            this._data.mode = value ?? 'full';
        }
        get date() {
            return this._data.date;
        }
        set date(value) {
            this._data.date = value;
        }
        get isPicker() {
            return this._data.isPicker ?? false;
        }
        set isPicker(value) {
            this._data.isPicker = value ?? false;
        }
        isCurrentDate(date) {
            if (!date)
                return false;
            return this.currentDate.getDate() === date.date &&
                this.currentDate.getMonth() + 1 === date.month &&
                this.currentDate.getFullYear() === date.year;
        }
        get initialData() {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const date = this.initialDate.getDate();
            const day = this.initialDate.getDay();
            return {
                month,
                year,
                date,
                day
            };
        }
        get monthKey() {
            return `${this.initialData.month}-${this.initialData.year}`;
        }
        get datesInMonth() {
            const { month, year } = this.initialData;
            let dates = [];
            if (this.datesMap.has(this.monthKey)) {
                dates = this.datesMap.get(this.monthKey);
            }
            else {
                dates = this.getDates(month, year);
            }
            return dates;
        }
        get isWeekMode() {
            return this.mode === 'week';
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
                    const before = (0, components_4.moment)(prevDateStr).subtract(i, 'days');
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
                    const after = (0, components_4.moment)(`${month}/${daysInMonth}-${year}`).add(i, 'days');
                    dates.push({ month: month + 1, year: year, date: after.get('date'), day: after.get('day') });
                }
            }
            return dates;
        }
        daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }
        get calendarData() {
            const eventsMap = {};
            for (let i = 0; i < this.datesInMonth.length; i++) {
                const item = this.datesInMonth[i];
                const holiday = this.getHoliday(item);
                const events = this.getEvents(item);
                const dateKey = `${item.date}-${item.month}-${item.year}`;
                eventsMap[dateKey] = { holiday, events };
            }
            return eventsMap;
        }
        getEvents(item) {
            const { year, month, date } = item;
            return [...this.events].filter(event => {
                const startDate = (0, components_4.moment)(event.startDate).startOf('day');
                const endDate = (0, components_4.moment)(event.endDate).endOf('day');
                const checkingDate = (0, components_4.moment)(`${month}/${date}/${year}`).startOf('day');
                return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
            });
        }
        getHoliday(item) {
            const { year, month, date } = item;
            const finded = this.holidays.find(holiday => {
                return (0, components_4.moment)(holiday.date).isSame((0, components_4.moment)(`${month}/${date}/${year}`));
            });
            return finded;
        }
        setData(data) {
            this._data = data;
            this.initialDate = this.date ? new Date(this.date) : new Date();
            this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
            this.clear();
            this.renderUI();
        }
        renderUI(direction) {
            const { month, year } = this.initialData;
            this.renderMonth(month, year, direction);
            this.eventSlider.visible = !this.isPicker;
            if (!this.isPicker) {
                this.renderEventSlider();
            }
        }
        clear() {
            this.listStack.clearInnerHTML();
            this.updateDatesHeight('100%');
            this.mode = 'full';
            this.pnlSelected.height = 0;
            this.pnlSelected.stack = { grow: '0', shrink: '1', basis: '0%' };
            this.monthsMap = new Map();
            this.selectedMap = new Map();
            this.initalDay = this.initialDate.getDay();
            this.currentDate = new Date();
            this.style.setProperty('--border-color', this.isPicker ? Theme.background.main : Theme.divider);
            this.style.setProperty('--grow', this.isWeekMode ? '1' : '0');
            this.style.setProperty('--inner-grow', this.isWeekMode ? '0' : '1');
            this.style.setProperty('--inner-basis', this.isWeekMode ? '100%' : '20%');
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
            const gridMonth = this.monthsMap.get(this.monthKey);
            if (gridMonth) {
                this.updateMonthUI(gridMonth);
                return;
            }
            const gridDates = this.$render("i-stack", { direction: this.isWeekMode ? 'horizontal' : 'vertical', width: '100%', stack: { shrink: '0', grow: 'var(--grow, 0)' }, overflow: { x: 'auto', y: 'hidden' }, class: `${view_css_1.swipeStyle} scroll-item`, position: 'relative' });
            gridDates.setAttribute('data-month', this.monthKey);
            for (let i = 0; i < ROWS; i++) {
                gridDates.append(this.$render("i-grid-layout", { border: { top: { width: '1px', style: 'solid', color: 'var(--border-color)' } }, width: '100%', class: "scroll-item", templateRows: ['1fr'], templateColumns: [`repeat(${DAYS}, 1fr)`], gap: { column: '0.25rem' }, stack: { shrink: 'var(--inner-grow, 1)', grow: 'var(--inner-grow, 1)', basis: 'var(--inner-basis, 20%)' }, autoRowSize: 'auto', autoFillInHoles: true, position: 'relative' }));
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
                const { holiday = null, events = [] } = this.calendarData[`${item.date}-${item.month}-${item.year}`] || {};
                const isSelectedDate = this.initialDate.getDate() === item.date;
                const borderColor = isSelectedDate ? Theme.colors.primary.main : Theme.background.main;
                const el = (this.$render("i-vstack", { gap: "0.125rem", margin: { top: '0.125rem', bottom: '0.125rem' }, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '0.25rem', width: '1px', style: 'solid', color: borderColor }, cursor: 'pointer', overflow: 'hidden', onClick: (target, event) => this.onDateClick(target, event, item) },
                    this.$render("i-label", { caption: `${item.date}`, font: { size: '1rem', weight: 500, color }, opacity: inMonth ? 1 : 0.36, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, border: { radius: '0.125rem' }, background: { color: bgColor }, class: "text-center" })));
                el.setAttribute('data-date', `${item.date}-${item.month}-${item.year}`);
                el.setAttribute('data-week', `${rowIndex}`);
                if (holiday) {
                    const holidayEl = this.renderHoliday(holiday, columnIndex);
                    el.append(holidayEl);
                }
                if (events?.length) {
                    for (let event of events) {
                        const eventEl = this.renderEvent(event, columnIndex);
                        el.append(eventEl);
                    }
                }
                gridDates.children[rowIndex].append(el);
                if (isSelectedDate) {
                    this.updateOldDate();
                    this.selectedDate = el;
                }
            }
            const oldMonth = this.monthsMap.get(this.oldMonth);
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
            this.monthsMap.set(`${month}-${year}`, gridDates);
        }
        renderEvent(event, columnIndex) {
            // const spanDays = moment(event.endDate).startOf('day').diff(moment(event.startDate).startOf('day'), 'days');
            // const columnSpan = spanDays === 0 ? 1 : spanDays;
            const eventEl = (this.$render("i-vstack", { grid: { column: columnIndex + 1, columnSpan: 1, verticalAlignment: 'start' }, border: { radius: '0.25rem' }, background: { color: event.color || defaultEventColor }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: event.title, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 }, textOverflow: 'ellipsis' })));
            return eventEl;
        }
        renderHoliday(holiday, columnIndex) {
            return this.$render("i-vstack", { border: { radius: '0.25rem' }, background: { color: defaultHolidayColor }, grid: { column: columnIndex + 1, verticalAlignment: 'start' }, padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: holiday.name, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', wordBreak: 'break-word', lineClamp: 2, font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } }));
        }
        renderEventSlider() {
            const itemsData = [];
            let activeIndex = 0;
            const currentDate = this.initialDate.getDate();
            const currentMonth = this.initialDate.getMonth() + 1;
            for (let i = 0; i < this.datesInMonth.length; i++) {
                const date = this.datesInMonth[i];
                const { holiday = null, events = [] } = this.calendarData[`${date.date}-${date.month}-${date.year}`] || {};
                const eventEl = this.renderSliderItem(date, holiday, events);
                itemsData.push({
                    name: '',
                    controls: [eventEl]
                });
                if (currentDate === date.date && currentMonth === date.month) {
                    activeIndex = i;
                }
            }
            this.eventSlider.items = itemsData;
            this.eventSlider.activeSlide = activeIndex;
        }
        renderSliderItem(item, holiday, events) {
            const { date, month, year } = item;
            const dateKey = `${date}-${month}-${year}`;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            const selectedPanel = this.selectedMap.get(dateKey);
            if (selectedPanel)
                return;
            const selectedWrap = (this.$render("i-vstack", { width: '100%', height: '100%', overflow: { y: 'auto' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' } }));
            selectedWrap.setAttribute('data-slider-date', dateKey);
            const caption = `${date} ${monthName}`;
            selectedWrap.append(this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between', margin: { top: '1rem' }, width: '100%', overflow: 'hidden', stack: { shrink: '0' } },
                this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                    this.$render("i-label", { caption: caption, font: { size: '0.75rem', weight: 600 } })),
                this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'smile' })));
            const eventsStack = this.$render("i-vstack", { width: "100%", gap: "1rem", margin: { top: '0.5rem' } });
            selectedWrap.append(eventsStack);
            if (!holiday && !events?.length) {
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
        handleEventClick(data, event) {
            if (this.onEventClicked)
                this.onEventClicked(data, event);
        }
        renderSelectedEvent(event, parent, isLast) {
            const startTime = (0, components_4.moment)(event.startDate).format('HH:mm');
            const endTime = (0, components_4.moment)(event.endDate).format('HH:mm');
            let iconAttr = {};
            if (event.link?.startsWith('https://meet.google.com/')) {
                iconAttr = { image: { url: assets_1.default.fullPath('img/google-drive.png'), width: '1rem', height: '1rem', display: 'inline-block' } };
            }
            else {
                iconAttr = { width: '1rem', height: '1rem', name: 'globe' };
            }
            parent.appendChild(this.$render("i-panel", { border: { bottom: { width: '1px', style: isLast ? 'none' : 'solid', color: Theme.divider } }, cursor: 'pointer', onClick: (t, e) => this.handleEventClick(event, e) },
                this.$render("i-hstack", { padding: { top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem' }, gap: '0.25rem', horizontalAlignment: 'space-between' },
                    this.$render("i-hstack", { gap: '0.25rem', stack: { grow: '1' } },
                        this.$render("i-hstack", { stack: { shrink: '0', basis: '2.5rem' } },
                            this.$render("i-label", { caption: startTime, font: { size: '0.75rem', weight: 500 } })),
                        this.$render("i-panel", { stack: { shrink: '0', basis: '3px' }, height: '1.25rem', width: 3, border: { radius: '0.25rem' }, margin: { right: '0.625rem' }, background: { color: event.color || defaultEventColor } }),
                        this.$render("i-vstack", { gap: "0.25rem" },
                            this.$render("i-label", { caption: event.title, font: { size: '1rem', weight: 500 } }),
                            this.$render("i-label", { caption: `${startTime} - ${endTime}`, font: { size: '0.75rem', weight: 500 }, opacity: 0.36 }))),
                    this.$render("i-icon", { cursor: 'pointer', stack: { shrink: '0' }, onClick: () => window.open(event.link, '_blank'), visible: !!event.link, ...iconAttr }))));
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
        onDateClick(target, event, date) {
            event.preventDefault();
            event.stopPropagation();
            const isSwiping = this.onSwiping ? this.onSwiping() : false;
            if (isSwiping)
                return;
            this.updateOldDate();
            this.initialDate = new Date(date.year, date.month - 1, date.date);
            this.initalDay = this.initialDate.getDay();
            this.updateNewDate(date);
            if (this.mode === 'full' && !this.isPicker) {
                this.updateDatesHeight('345px');
                this.style.setProperty('--border-color', Theme.background.main);
                this.pnlSelected.height = 'auto';
                this.pnlSelected.stack = { grow: '1', shrink: '1', basis: 'auto' };
            }
            const { month, year } = this.currentMonth || this.initialData;
            const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date.date && d.month === date.month);
            this.eventSlider.activeSlide = index;
            if (this.onDateClicked)
                this.onDateClicked(this.initialDate.toISOString());
        }
        updateOldDate() {
            if (this.selectedDate) {
                this.selectedDate.border.color = Theme.background.main;
            }
        }
        updateNewDate(data) {
            const { date, month, year } = data;
            const { month: mMonth, year: mYear } = this.currentMonth;
            const dataDate = `${date}-${month}-${year}`;
            const monthTarget = this.listStack.querySelector(`[data-month="${mMonth}-${mYear}"]`);
            const target = monthTarget?.querySelector(`[data-date="${dataDate}"]`);
            if (target) {
                this.selectedDate = target;
                target.border = { radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important` };
            }
        }
        updateDatesHeight(height) {
            this.pnlDates.height = height;
            if (height === '100%') {
                this.listStack.classList.add('--full');
            }
            else {
                this.listStack.classList.remove('--full');
            }
            let opacity = height === '345px' || height === '125px' ? '0' : '1';
            this.style.setProperty('--event-opacity', opacity);
            this.style.setProperty('--event-height', opacity === '0' ? '3px' : 'auto');
        }
        onMonthChangedFn(direction) {
            this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() + direction);
            this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
            this.renderUI(direction);
            if (this.onMonthChanged)
                this.onMonthChanged({ ...this.currentMonth });
        }
        onSlideChanged(index) {
            const { month, year } = this.currentMonth || this.initialData;
            const dates = this.datesMap.get(`${month}-${year}`);
            const newDate = dates[index];
            this.onSelectedDateChanged(newDate, index);
        }
        onSelectedDateChanged(data, index) {
            this.updateOldDate();
            const oldDay = this.initialDate.getDay();
            const { date, month, year } = data;
            this.initialDate = new Date(year, month - 1, date);
            this.initalDay = this.initialDate.getDay();
            this.updateNewDate(data);
            if (this.isWeekMode) {
                if (oldDay === 6 && (this.initalDay === 6 || this.initalDay === 0)) {
                    this.onSwipeWeek(1);
                }
                else if (oldDay === 0 && (this.initalDay === 6 || this.initalDay === 0)) {
                    this.onSwipeWeek(-1);
                }
            }
            else {
                if (this.initalDay === 6 && index === 34) {
                    this.onSwipeMonthEvents(1);
                }
                else if (this.initalDay === 0 && index === 0) {
                    this.onSwipeMonthEvents(-1);
                }
            }
        }
        animateFn(framefn) {
            const duration = 300;
            const easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const animateScroll = (timestamp) => {
                const progress = Math.min(1, (timestamp - startTime) / duration);
                const easedProgress = easing(progress);
                framefn(easedProgress);
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            const startTime = performance.now();
            requestAnimationFrame(animateScroll);
        }
        onSwipeFullMonth(direction) {
            this.mode = 'full';
            this.style.setProperty('--grow', '0');
            this.style.setProperty('--inner-grow', '1');
            this.style.setProperty('--inner-basis', '20%');
            this.style.setProperty('--border-color', this.isPicker ? Theme.background.main : Theme.divider);
            if (direction) {
                this.onMonthChangedFn(direction);
                this.onScroll(this.listStack, direction);
            }
            else {
                const { month, year } = this.initialData;
                const monthEl = this.monthsMap.get(`${month}-${year}`);
                if (monthEl)
                    this.updateMonthUI(monthEl);
                this.updateDatesHeight('100%');
                this.pnlSelected.height = 0;
                this.pnlSelected.stack = { grow: '0', shrink: '1', basis: '0%' };
            }
            return { ...this.currentMonth };
        }
        onSwipeMonthEvents(direction) {
            this.mode = 'month';
            this.style.setProperty('--grow', '0');
            this.style.setProperty('--inner-grow', '1');
            this.style.setProperty('--inner-basis', '100%');
            this.style.setProperty('--border-color', Theme.background.main);
            this.updateDatesHeight('345px');
            this.pnlSelected.height = 'auto';
            this.pnlSelected.stack = { grow: '1', shrink: '1', basis: 'auto' };
            if (direction) {
                this.onMonthChangedFn(direction);
                this.onScroll(this.listStack, direction);
            }
            const { date } = this.initialData;
            const { month, year } = this.currentMonth || this.initialData;
            const monthEl = this.monthsMap.get(`${month}-${year}`);
            if (monthEl)
                this.updateMonthUI(monthEl);
            this.updateOldDate();
            this.updateNewDate({ date, month, year });
            const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date && d.month === month);
            this.eventSlider.activeSlide = index;
        }
        onSwipeWeek(direction) {
            this.mode = 'week';
            this.style.setProperty('--grow', '1');
            this.style.setProperty('--inner-grow', '0');
            this.style.setProperty('--inner-basis', '100%');
            this.style.setProperty('--border-color', Theme.background.main);
            this.updateDatesHeight('125px');
            this.pnlSelected.height = 'auto';
            this.pnlSelected.stack = { grow: '1', shrink: '1', basis: 'auto' };
            const { month, year } = this.currentMonth || this.initialData;
            let monthEl = this.monthsMap.get(`${month}-${year}`);
            if (!monthEl)
                return;
            this.updateMonthUI(monthEl);
            if (!direction) {
                if (this.selectedDate) {
                    const week = this.selectedDate.getAttribute('data-week') || 0;
                    if (week) {
                        const startScrollLeft = monthEl.scrollLeft;
                        const targetScrollLeft = monthEl.scrollLeft + (Number(week) * monthEl.offsetWidth);
                        this.animateFn((progress) => {
                            monthEl.scrollTo({
                                left: startScrollLeft + (targetScrollLeft - startScrollLeft) * progress
                            });
                        });
                    }
                }
                return;
            }
            const threshold = this.listStack.offsetWidth * 3;
            const outOfMonth = (monthEl.scrollLeft > threshold && direction === 1) || (monthEl.scrollLeft === 0 && direction === -1);
            if (outOfMonth) {
                this.initialDate = new Date(year, month - 1, 1);
                this.onMonthChangedFn(direction);
                const { month: newMonth, year: newYear } = this.initialData;
                const newMonthEl = this.monthsMap.get(`${newMonth}-${newYear}`);
                this.onScroll(this.listStack, direction);
                this.updateMonthUI(newMonthEl);
                const factor = direction === 1 ? 0 : 4;
                newMonthEl.scrollLeft = factor * newMonthEl.offsetWidth;
                this.activeDateWeek(newMonthEl, factor);
            }
            else {
                this.onScroll(monthEl, direction);
                const week = Math.round(monthEl.scrollLeft / this.listStack.offsetWidth) + direction;
                this.activeDateWeek(monthEl, week);
            }
        }
        activeDateWeek(monthEl, week) {
            const dateEl = monthEl.children?.[week]?.children?.[this.initalDay];
            if (dateEl) {
                this.updateOldDate();
                const dateData = dateEl.getAttribute('data-date');
                const [date, month, year] = dateData.split('-');
                if (date) {
                    this.initialDate = new Date(year, month - 1, Number(date));
                    const { month: currentMonth } = this.currentMonth || this.initialData;
                    const index = this.datesMap.get(`${currentMonth}-${year}`).findIndex(d => d.date === Number(date) && d.month === Number(month));
                    this.eventSlider.activeSlide = index;
                    this.selectedDate = dateEl;
                    dateEl.border = { radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important` };
                }
            }
        }
        updateMonthUI(month) {
            month.direction = this.isWeekMode ? 'horizontal' : 'vertical';
        }
        onScroll(parent, direction) {
            const containerWidth = this.listStack.offsetWidth;
            const index = Math.round(parent.scrollLeft / containerWidth);
            const startScrollLeft = index * containerWidth;
            const targetScrollLeft = startScrollLeft + (direction * containerWidth);
            this.animateFn((progress) => {
                parent.scrollTo({
                    left: startScrollLeft + (targetScrollLeft - startScrollLeft) * progress
                });
            });
        }
        init() {
            super.init();
            this.onSwiping = this.getAttribute('onSwiping', true) || this.onSwiping;
            this.onEventClicked = this.getAttribute('onEventClicked', true) || this.onEventClicked;
            this.onDateClicked = this.getAttribute('onDateClicked', true) || this.onDateClicked;
            this.onMonthChanged = this.getAttribute('onMonthChanged', true) || this.onMonthChanged;
            const holidays = this.getAttribute('holidays', true);
            const events = this.getAttribute('events', true);
            const mode = this.getAttribute('mode', true, 'full');
            const date = this.getAttribute('date', true);
            const isPicker = this.getAttribute('isPicker', true, false);
            this.renderHeader();
            this.setData({ holidays, events, mode, date, isPicker });
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlWrapper", width: '100%', height: "100%", overflow: 'hidden', gap: "1rem" },
                this.$render("i-vstack", { id: "pnlDates", width: '100%', maxHeight: '100%', overflow: 'hidden', class: view_css_1.transitionStyle },
                    this.$render("i-grid-layout", { id: "gridHeader", columnsPerRow: DAYS, margin: { top: '0.75rem' } }),
                    this.$render("i-hstack", { id: "listStack", overflow: { x: 'auto', y: 'hidden' }, minHeight: '1.875rem', class: `${view_css_1.swipeStyle} ${view_css_1.monthListStyle}`, stack: { grow: '1' } })),
                this.$render("i-panel", { id: "pnlSelected", stack: { grow: '1', shrink: '1', basis: '0' }, minHeight: 0, height: 0, overflow: 'hidden' },
                    this.$render("i-carousel-slider", { id: "eventSlider", class: view_css_1.eventSliderStyle, swipe: true, width: '100%', height: '100%', indicators: false, autoplay: false, border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, onSlideChange: this.onSlideChanged }))));
        }
    };
    ScomCalendarView = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-calendar--view')
    ], ScomCalendarView);
    exports.ScomCalendarView = ScomCalendarView;
});
define("@scom/scom-calendar/common/monthPicker.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarMonthPicker = void 0;
    let ScomCalendarMonthPicker = class ScomCalendarMonthPicker extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get date() {
            return this._date;
        }
        set date(value) {
            this._date = value;
        }
        setData(date) {
            this.date = date;
            this.monthView.onDateClicked = this.onDateClick.bind(this);
            this.monthView.setData({
                mode: 'full',
                date: this.date,
                isPicker: true
            });
        }
        onDateClick(date) {
            this._date = date;
            if (this.onChanged)
                this.onChanged(date);
        }
        onSwipeFullMonth(direction) {
            return this.monthView.onSwipeFullMonth(direction);
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            const date = this.getAttribute('date', true);
            this.setData(date);
        }
        render() {
            return (this.$render("i-scom-calendar--view", { id: "monthView" }));
        }
    };
    ScomCalendarMonthPicker = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-calendar--month-picker')
    ], ScomCalendarMonthPicker);
    exports.ScomCalendarMonthPicker = ScomCalendarMonthPicker;
});
define("@scom/scom-calendar/common/utils.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IosSelector = void 0;
    ///<amd-module name='@scom/scom-calendar/common/utils.ts'/> 
    const easing = {
        easeOutCubic: function (pos) {
            return (Math.pow((pos - 1), 3) + 1);
        },
        easeOutQuart: function (pos) {
            return -(Math.pow((pos - 1), 4) - 1);
        },
    };
    class IosSelector {
        constructor(options) {
            this.options = {};
            let defaults = {
                el: null,
                type: 'infinite',
                count: 4,
                sensitivity: 0.8,
                source: [],
                value: null,
                onChange: null
            };
            this.options = Object.assign({}, defaults, options);
            this.options.count = this.options.count - this.options.count % 4;
            Object.assign(this, this.options);
            this.halfCount = this.options.count / 2;
            this.quarterCount = this.options.count / 4;
            this.a = this.options.sensitivity * 10; // 滚动减速度
            this.minV = Math.sqrt(1 / this.a); // 最小初速度
            this.selected = this.source[0];
            this.exceedA = 10; // 超出减速 
            this.moveT = 0; // 滚动 tick
            this.moving = false;
            this.elems = {
                el: this.options.el,
                circleList: null,
                circleItems: null,
                highlight: null,
                highlightList: null,
                highListItems: null // list
            };
            this.events = {
                touchstart: null,
                touchmove: null,
                touchend: null
            };
            this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count; // 每项高度
            this.itemAngle = 360 / this.options.count; // 每项之间旋转度数
            this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180); // 圆环半径 
            this.scroll = 0; // 单位为一个 item 的高度（度数）
            this._init();
        }
        _init() {
            this._create(this.options.source);
            let touchData = {
                startY: 0,
                yArr: []
            };
            for (let eventName in this.events) {
                this.events[eventName] = ((eventName) => {
                    return (e) => {
                        if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
                            e.preventDefault();
                            if (this.source.length) {
                                this['_' + eventName](e, touchData);
                            }
                        }
                    };
                })(eventName);
            }
            this.elems.el.addEventListener('touchstart', this.events.touchstart);
            document.addEventListener('mousedown', this.events.touchstart);
            this.elems.el.addEventListener('touchend', this.events.touchend);
            document.addEventListener('mouseup', this.events.touchend);
            if (this.source.length) {
                this.value = this.value !== null ? this.value : this.source[0].value;
                this.select(this.value);
            }
        }
        _touchstart(e, touchData) {
            this.elems.el.addEventListener('touchmove', this.events.touchmove);
            document.addEventListener('mousemove', this.events.touchmove);
            let eventY = e.clientY || e.touches[0].clientY;
            touchData.startY = eventY;
            touchData.yArr = [[eventY, new Date().getTime()]];
            touchData.touchScroll = this.scroll;
            this._stop();
        }
        _touchmove(e, touchData) {
            let eventY = e.clientY || e.touches[0].clientY;
            touchData.yArr.push([eventY, new Date().getTime()]);
            if (touchData.length > 5) {
                touchData.unshift();
            }
            let scrollAdd = (touchData.startY - eventY) / this.itemHeight;
            let moveToScroll = scrollAdd + this.scroll;
            // 非无限滚动时，超出范围使滚动变得困难
            if (this.type === 'normal') {
                if (moveToScroll < 0) {
                    moveToScroll *= 0.3;
                }
                else if (moveToScroll > this.source.length) {
                    moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
                }
                // console.log(moveToScroll);
            }
            else {
                moveToScroll = this._normalizeScroll(moveToScroll);
            }
            touchData.touchScroll = this._moveTo(moveToScroll);
        }
        _touchend(e, touchData) {
            // console.log(e);
            this.elems.el.removeEventListener('touchmove', this.events.touchmove);
            document.removeEventListener('mousemove', this.events.touchmove);
            let v;
            if (touchData.yArr.length === 1) {
                v = 0;
            }
            else {
                let startTime = touchData.yArr[touchData.yArr.length - 2][1];
                let endTime = touchData.yArr[touchData.yArr.length - 1][1];
                let startY = touchData.yArr[touchData.yArr.length - 2][0];
                let endY = touchData.yArr[touchData.yArr.length - 1][0];
                // 计算速度
                v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
                let sign = v > 0 ? 1 : -1;
                v = Math.abs(v) > 30 ? 30 * sign : v;
            }
            this.scroll = touchData.touchScroll;
            this._animateMoveByInitV(v);
            // console.log('end');
        }
        _create(source) {
            if (!source.length) {
                return;
            }
            let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
          {{circleListHTML}}
          <!-- <li class="select-option">a0</li> -->
        </ul>
        <div class="highlight">
          <ul class="highlight-list">
            <!-- <li class="highlight-item"></li> -->
            {{highListHTML}}
          </ul>
        </div>
      </div>
    `;
            // source 处理
            if (this.options.type === 'infinite') {
                let concatSource = [].concat(source);
                while (concatSource.length < this.halfCount) {
                    concatSource = concatSource.concat(source);
                }
                source = concatSource;
            }
            this.source = source;
            let sourceLength = source.length;
            // 圆环 HTML
            let circleListHTML = '';
            for (let i = 0; i < source.length; i++) {
                circleListHTML += `<li class="select-option"
                    style="
                      top: ${this.itemHeight * -0.5}px;
                      height: ${this.itemHeight}px;
                      line-height: ${this.itemHeight}px;
                      transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`;
            }
            // 中间高亮 HTML
            let highListHTML = '';
            for (let i = 0; i < source.length; i++) {
                highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`;
            }
            if (this.options.type === 'infinite') {
                // 圆环头尾
                for (let i = 0; i < this.quarterCount; i++) {
                    // 头
                    circleListHTML = `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` + circleListHTML;
                    // 尾
                    circleListHTML += `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
                }
                // 高亮头尾
                highListHTML = `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                          ${source[sourceLength - 1].text}
                      </li>` + highListHTML;
                highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`;
            }
            this.elems.el.innerHTML = template
                .replace('{{circleListHTML}}', circleListHTML)
                .replace('{{highListHTML}}', highListHTML);
            this.elems.circleList = this.elems.el.querySelector('.select-options');
            this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');
            this.elems.highlight = this.elems.el.querySelector('.highlight');
            this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
            this.elems.highListItems = this.elems.el.querySelectorAll('.highlight-item');
            if (this.type === 'infinite') {
                this.elems.highlightList.style.top = -(this.itemHeight + 20) + 'px'; // TODO
            }
            this.elems.highlight.style.height = this.itemHeight + 'px';
            this.elems.highlight.style.lineHeight = `${this.itemHeight}px`;
        }
        /**
         * 对 scroll 取模，eg source.length = 5 scroll = 6.1
         * 取模之后 normalizedScroll = 1.1
         * @param {init} scroll
         * @return 取模之后的 normalizedScroll
         */
        _normalizeScroll(scroll) {
            let normalizedScroll = scroll;
            while (normalizedScroll < 0) {
                normalizedScroll += this.source.length;
            }
            normalizedScroll = normalizedScroll % this.source.length;
            return normalizedScroll;
        }
        /**
         * 定位到 scroll，无动画
         * @param {init} scroll
         * @return 返回指定 normalize 之后的 scroll
         */
        _moveTo(scroll) {
            if (this.type === 'infinite') {
                scroll = this._normalizeScroll(scroll);
            }
            this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
            this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll) * this.itemHeight}px, 0)`;
            [...this.elems.circleItems].forEach(itemElem => {
                if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
                    itemElem.style.visibility = 'hidden';
                }
                else {
                    itemElem.style.visibility = 'visible';
                }
            });
            // console.log(scroll);
            // console.log(`translate3d(0, 0, ${-this.radius}px) rotateX(${-this.itemAngle * scroll}deg)`);
            return scroll;
        }
        /**
         * 以初速度 initV 滚动
         * @param {init} initV， initV 会被重置
         * 以根据加速度确保滚动到整数 scroll (保证能通过 scroll 定位到一个选中值)
         */
        async _animateMoveByInitV(initV) {
            // console.log(initV);
            let initScroll;
            let finalScroll;
            let totalScrollLen;
            let a;
            let t;
            if (this.type === 'normal') {
                if (this.scroll < 0 || this.scroll > this.source.length - 1) {
                    a = this.exceedA;
                    initScroll = this.scroll;
                    finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
                    totalScrollLen = initScroll - finalScroll;
                    t = Math.sqrt(Math.abs(totalScrollLen / a));
                    initV = a * t;
                    initV = this.scroll > 0 ? -initV : initV;
                    await this._animateToScroll(initScroll, finalScroll, t);
                }
                else {
                    initScroll = this.scroll;
                    a = initV > 0 ? -this.a : this.a; // 减速加速度
                    t = Math.abs(initV / a); // 速度减到 0 花费时间
                    totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
                    finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
                    finalScroll = finalScroll < 0 ? 0 : (finalScroll > this.source.length - 1 ? this.source.length - 1 : finalScroll);
                    totalScrollLen = finalScroll - initScroll;
                    t = Math.sqrt(Math.abs(totalScrollLen / a));
                    await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
                }
            }
            else {
                initScroll = this.scroll;
                a = initV > 0 ? -this.a : this.a; // 减速加速度
                t = Math.abs(initV / a); // 速度减到 0 花费时间
                totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
                finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
                await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
            }
            // await this._animateToScroll(this.scroll, finalScroll, initV, 0);
            this._selectByScroll(this.scroll);
        }
        _animateToScroll(initScroll, finalScroll, t, easingName = 'easeOutQuart') {
            if (initScroll === finalScroll || t === 0) {
                this._moveTo(initScroll);
                return;
            }
            let start = new Date().getTime() / 1000;
            let pass = 0;
            let totalScrollLen = finalScroll - initScroll;
            return new Promise((resolve, reject) => {
                this.moving = true;
                let tick = () => {
                    pass = new Date().getTime() / 1000 - start;
                    if (pass < t) {
                        this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
                        this.moveT = requestAnimationFrame(tick);
                    }
                    else {
                        resolve();
                        this._stop();
                        this.scroll = this._moveTo(initScroll + totalScrollLen);
                    }
                };
                tick();
            });
        }
        _stop() {
            this.moving = false;
            cancelAnimationFrame(this.moveT);
        }
        _selectByScroll(scroll) {
            scroll = this._normalizeScroll(scroll) | 0;
            if (scroll > this.source.length - 1) {
                scroll = this.source.length - 1;
                this._moveTo(scroll);
            }
            this._moveTo(scroll);
            this.scroll = scroll;
            this.selected = this.source[scroll];
            this.value = this.selected.value;
            this.onChange && this.onChange(this.selected);
        }
        updateSource(source) {
            this._create(source);
            if (!this.moving) {
                this._selectByScroll(this.scroll);
            }
        }
        select(value) {
            for (let i = 0; i < this.source.length; i++) {
                if (this.source[i].value === value) {
                    window.cancelAnimationFrame(this.moveT);
                    // this.scroll = this._moveTo(i);
                    let initScroll = this._normalizeScroll(this.scroll);
                    let finalScroll = i;
                    let t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
                    this._animateToScroll(initScroll, finalScroll, t);
                    setTimeout(() => this._selectByScroll(i));
                    return;
                }
            }
            throw new Error(`can not select value: ${value}, ${value} match nothing in current source`);
        }
        destroy() {
            this._stop();
            // document 事件解绑
            for (let eventName in this.events) {
                this.elems.el.removeEventListener(`${eventName}`, this.events[eventName]);
            }
            document.removeEventListener('mousedown', this.events['touchstart']);
            document.removeEventListener('mousemove', this.events['touchmove']);
            document.removeEventListener('mouseup', this.events['touchend']);
            // 元素移除
            this.elems.el.innerHTML = '';
            this.elems = null;
        }
    }
    exports.IosSelector = IosSelector;
});
define("@scom/scom-calendar/common/datePicker.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/common/select.css.ts", "@scom/scom-calendar/common/utils.ts"], function (require, exports, components_6, select_css_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarDatePicker = void 0;
    const COUNT = 10;
    let ScomCalendarDatePicker = class ScomCalendarDatePicker extends components_6.Module {
        constructor(parent, options) {
            super(parent, options);
            this.currentYear = new Date().getFullYear();
            this.currentMonth = 1;
            this.currentDay = 1;
            this.onChangedSelect = this.onChangedSelect.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get date() {
            return this._date;
        }
        set date(value) {
            this._date = value;
        }
        setData(data) {
            this.date = data;
            this.renderUI();
        }
        renderUI() {
            this.initialDate = this.date ? new Date(this.date) : new Date();
            this.currentDay = this.initialDate.getDate();
            this.currentMonth = this.initialDate.getMonth() + 1;
            this.currentYear = this.initialDate.getFullYear();
            this.renderSelectors();
        }
        renderSelectors() {
            if (!this.daySelector) {
                this.daySelector = new utils_1.IosSelector({
                    el: this.pnlDate,
                    type: 'infinite',
                    source: this.getDays(this.currentYear, this.currentMonth),
                    count: COUNT,
                    onChange: (selected) => {
                        this.currentDay = selected.value;
                        this.onChangedSelect();
                    }
                });
            }
            if (!this.yearSelector) {
                this.yearSelector = new utils_1.IosSelector({
                    el: this.pnlYear,
                    type: 'infinite',
                    source: this.getYears(),
                    count: COUNT,
                    onChange: (selected) => {
                        this.currentYear = selected.value;
                        const daySource = this.getDays(this.currentYear, this.currentMonth);
                        this.daySelector.updateSource(daySource);
                        this.onChangedSelect();
                    }
                });
            }
            if (!this.monthSelector) {
                this.monthSelector = new utils_1.IosSelector({
                    el: this.pnlMonth,
                    type: 'infinite',
                    source: this.getMonths(),
                    count: COUNT,
                    onChange: (selected) => {
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
        getYears() {
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
        getDays(year, month) {
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
        onChangedSelect() {
            const newDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);
            this._date = newDate.toISOString();
            if (this.onChanged)
                this.onChanged(this._date);
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            const date = this.getAttribute('date', true);
            this.setData(date);
        }
        render() {
            return (this.$render("i-panel", { width: '100%', height: '100%', class: select_css_1.selectorStyles },
                this.$render("i-hstack", { id: "datePicker", position: 'absolute', top: "50%", left: "50%", verticalAlignment: "stretch", horizontalAlignment: 'space-between', class: "date-selector" },
                    this.$render("i-panel", { class: "year", id: "pnlYear", stack: { grow: '1', shrink: '1' } }),
                    this.$render("i-panel", { class: "month", id: "pnlMonth", stack: { grow: '1', shrink: '1' } }),
                    this.$render("i-panel", { class: "date", id: "pnlDate", stack: { grow: '1', shrink: '1' } }))));
        }
    };
    ScomCalendarDatePicker = __decorate([
        components_6.customModule,
        (0, components_6.customElements)('i-scom-calendar--date-picker')
    ], ScomCalendarDatePicker);
    exports.ScomCalendarDatePicker = ScomCalendarDatePicker;
});
define("@scom/scom-calendar/common/select.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/common/select.css.ts"], function (require, exports, components_7, select_css_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarSelect = void 0;
    const Theme = components_7.Styles.Theme.ThemeVars;
    let ScomCalendarSelect = class ScomCalendarSelect extends components_7.Module {
        constructor(parent, options) {
            super(parent, options);
            this.onCancel = this.onCancel.bind(this);
            this.onConfirm = this.onConfirm.bind(this);
            this.onShowMonth = this.onShowMonth.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get date() {
            return this._data.date;
        }
        set date(value) {
            this._data.date = value;
        }
        setData(data) {
            this._data = data;
            this.renderUI();
        }
        renderUI() {
            this.initialDate = this.date ? new Date(this.date) : new Date();
            this.iconLeft.visible = this.iconRight.visible = this.monthPicker.visible;
            this.updateHeader();
            this.datePicker.setData(this.date);
            this.monthPicker.setData(this.date);
        }
        onCancel() {
            ;
            this.datePicker.visible = true;
            this, this.monthPicker.visible = false;
            if (this.onClose)
                this.onClose();
        }
        onConfirm() {
            const date = this.monthPicker.visible ? this.monthPicker.date : this.datePicker.date;
            if (this.onChanged)
                this.onChanged(date);
        }
        onShowMonth() {
            this.monthPicker.visible = !this.monthPicker.visible;
            const visible = this.monthPicker.visible;
            this.datePicker.visible = !visible;
            if (this.datePicker.visible) {
                this.datePicker.display = 'flex';
            }
            this.iconLeft.visible = this.iconRight.visible = visible;
        }
        onMonthChanged(direction) {
            const { month, year } = this.monthPicker.onSwipeFullMonth(direction);
            this.initialDate.setMonth(month - 1);
            this.initialDate.setFullYear(year);
            this.monthPicker.date = this.initialDate.toISOString();
            this.updateHeader();
        }
        updateHeader() {
            const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
            this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
            const date = this.getAttribute('date', true);
            if (date)
                this.setData({ date });
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '2rem', bottom: '2rem', left: '2rem', right: '2rem' }, class: select_css_2.selectorStyles },
                this.$render("i-hstack", { verticalAlignment: 'center', gap: '1rem' },
                    this.$render("i-panel", { stack: { shrink: '0' }, opacity: 0.36, hover: { opacity: 1 }, cursor: 'pointer' },
                        this.$render("i-icon", { id: "iconLeft", padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, name: 'angle-left', width: '1.5rem', height: '1.5rem', fill: Theme.text.primary, visible: false, onClick: () => this.onMonthChanged(-1) })),
                    this.$render("i-hstack", { gap: "0.5rem", horizontalAlignment: 'center', verticalAlignment: 'start', cursor: 'pointer', onClick: this.onShowMonth },
                        this.$render("i-label", { id: "lbDate", caption: '', font: { size: '1rem', weight: 500 } }),
                        this.$render("i-icon", { name: "caret-down", width: '1rem', height: '1rem', fill: Theme.text.primary })),
                    this.$render("i-panel", { stack: { shrink: '0' }, opacity: 0.36, hover: { opacity: 1 }, cursor: 'pointer' },
                        this.$render("i-icon", { id: "iconRight", padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, name: 'angle-right', width: '1.5rem', height: '1.5rem', fill: Theme.text.primary, visible: false, onClick: () => this.onMonthChanged(1) }))),
                this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', gap: "1rem", minHeight: '50vh', position: 'relative' },
                    this.$render("i-scom-calendar--date-picker", { id: "datePicker", display: 'block', width: '100%', height: '100%' }),
                    this.$render("i-scom-calendar--month-picker", { id: "monthPicker", visible: false, width: "31.25rem", height: "auto", maxWidth: '100%', overflow: 'hidden' })),
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                    this.$render("i-button", { caption: 'Cancel', font: { weight: 600, size: '1rem', color: Theme.text.primary }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, stack: { basis: '50%' }, background: { color: 'transparent' }, boxShadow: 'none', border: { radius: 0 }, onClick: this.onCancel }),
                    this.$render("i-button", { caption: 'Ok', font: { weight: 600, size: '1rem', color: Theme.text.primary }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, stack: { basis: '50%' }, background: { color: 'transparent' }, border: { radius: 0 }, boxShadow: 'none', onClick: this.onConfirm }))));
        }
    };
    ScomCalendarSelect = __decorate([
        components_7.customModule,
        (0, components_7.customElements)('i-scom-calendar--select')
    ], ScomCalendarSelect);
    exports.ScomCalendarSelect = ScomCalendarSelect;
});
define("@scom/scom-calendar/common/index.ts", ["require", "exports", "@scom/scom-calendar/common/select.tsx", "@scom/scom-calendar/common/monthPicker.tsx", "@scom/scom-calendar/common/datePicker.tsx", "@scom/scom-calendar/common/view.tsx", "@scom/scom-calendar/common/utils.ts"], function (require, exports, select_1, monthPicker_1, datePicker_1, view_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarView = exports.ScomCalendarDatePicker = exports.ScomCalendarMonthPicker = exports.ScomCalendarSelect = void 0;
    Object.defineProperty(exports, "ScomCalendarSelect", { enumerable: true, get: function () { return select_1.ScomCalendarSelect; } });
    Object.defineProperty(exports, "ScomCalendarMonthPicker", { enumerable: true, get: function () { return monthPicker_1.ScomCalendarMonthPicker; } });
    Object.defineProperty(exports, "ScomCalendarDatePicker", { enumerable: true, get: function () { return datePicker_1.ScomCalendarDatePicker; } });
    Object.defineProperty(exports, "ScomCalendarView", { enumerable: true, get: function () { return view_1.ScomCalendarView; } });
    __exportStar(utils_2, exports);
});
define("@scom/scom-calendar", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/data/holidays.json.ts", "@scom/scom-calendar/common/index.ts"], function (require, exports, components_8, holidays_json_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_8.Styles.Theme.ThemeVars;
    let ScomCalendar = class ScomCalendar extends components_8.Module {
        constructor(parent, options) {
            super(parent, options);
            this.initialDate = new Date();
            this.pos1 = { x: 0, y: 0 };
            this.pos2 = { x: 0, y: 0 };
            this.datePnlHeight = 0;
            this.isVerticalSwiping = false;
            this.isHorizontalSwiping = false;
            this._events = [];
            this.onUpdateMonth = this.onUpdateMonth.bind(this);
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
            this.calendarView.onSwiping = () => this.isVerticalSwiping || this.isHorizontalSwiping;
            if (this.onEventClicked)
                this.calendarView.onEventClicked = this.onEventClicked.bind(this);
            this.calendarView.onDateClicked = this.onSelectedDate.bind(this);
            this.calendarView.setData({
                mode: 'full',
                events: this.events,
                holidays: holidays_json_1.default
            });
            this.updateHeader();
            this.maxHeight = window.innerHeight;
        }
        onSelectedDate(date) {
            this.initialDate = new Date(date);
            if (this.onDateClicked)
                this.onDateClicked(date);
        }
        updateHeader() {
            const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
            this.lbMonth.caption = monthName;
            const year = this.initialDate.getFullYear();
            this.lbYear.caption = `${year}`;
            this.lbYear.visible = year !== new Date().getFullYear();
        }
        _handleMouseDown(event, stopPropagation) {
            const result = super._handleMouseDown(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#pnlDates');
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
                const sliderList = target.closest('#pnlDates');
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
                const sliderList = target.closest('#pnlDates');
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
            const pnlDates = this.calendarView.querySelector('#pnlDates');
            if (pnlDates) {
                this.datePnlHeight = pnlDates.offsetHeight;
            }
            this.isVerticalSwiping = false;
            this.isHorizontalSwiping = false;
        }
        dragHandler(event) {
            event.preventDefault();
            let deltaX = 0;
            if (event instanceof TouchEvent) {
                this.pos2 = {
                    x: this.pos1.x - event.touches[0].pageX,
                    y: event.touches[0].pageY - this.pos1.y
                };
                deltaX = event.touches[0].pageX - this.pos1.x;
            }
            else {
                this.pos2 = {
                    x: this.pos1.x - event.clientX,
                    y: event.pageY - this.pos1.y
                };
                deltaX = event.clientX - this.pos1.x;
            }
            const listStack = this.calendarView.querySelector('#listStack');
            const containerWidth = listStack ? listStack.offsetWidth : this.calendarView.offsetWidth;
            const containerHeight = this.calendarView.offsetHeight;
            const horizontalThreshold = containerWidth * 0.1;
            const verticalThreshold = this.datePnlHeight * 0.1;
            if (Math.abs(this.pos2.y) >= verticalThreshold && Math.abs(deltaX) < horizontalThreshold) {
                this.isVerticalSwiping = true;
                this.isHorizontalSwiping = false;
                const newHeight = this.datePnlHeight + this.pos2.y;
                let mode = 'full';
                if (newHeight > containerHeight * 0.4 && this.pos2.y > verticalThreshold) {
                    mode = 'full';
                }
                else if (newHeight < containerHeight * 0.4 && this.pos2.y < -verticalThreshold) {
                    mode = 'week';
                }
                else {
                    mode = 'month';
                }
                this.onSwipeView(undefined, mode);
                return false;
            }
            else if (Math.abs(deltaX) >= horizontalThreshold) {
                this.isVerticalSwiping = false;
                this.isHorizontalSwiping = true;
            }
            else {
                this.isVerticalSwiping = false;
                this.isHorizontalSwiping = false;
            }
        }
        dragEndHandler(event) {
            if (this.isVerticalSwiping || !this.isHorizontalSwiping) {
                event.preventDefault();
                return false;
            }
            const horizontalThreshold = 30;
            let direction = 1;
            if (this.pos2.x < -horizontalThreshold) {
                direction = -1;
            }
            else if (this.pos2.x > horizontalThreshold) {
                direction = 1;
            }
            const mode = this.calendarView.mode;
            this.onSwipeView(direction, mode);
        }
        onSwipeView(direction, mode = 'full') {
            if (mode === 'week') {
                this.calendarView.onSwipeWeek(direction);
            }
            else if (mode === 'month') {
                this.calendarView.onSwipeMonthEvents(direction);
            }
            else {
                this.calendarView.onSwipeFullMonth(direction);
            }
        }
        onUpdateMonth(data) {
            const { month, year } = data;
            if (month && year) {
                this.initialDate.setMonth(month - 1);
                this.initialDate.setFullYear(year);
                this.updateHeader();
            }
        }
        onChangeDate() {
            const date = this.initialDate.toISOString();
            if (this.selectEl) {
                this.selectEl.setData({ date });
            }
            else {
                this.selectEl = new index_1.ScomCalendarSelect(undefined, {
                    date,
                    onClose: () => {
                        this.selectEl.closeModal();
                    },
                    onChanged: (date) => {
                        this.selectEl.closeModal();
                        this.calendarView.setData({
                            mode: 'full',
                            events: this.events,
                            holidays: holidays_json_1.default,
                            date
                        });
                        this.initialDate = new Date(date);
                        this.updateHeader();
                    }
                });
            }
            this.selectEl.openModal({
                showBackdrop: true,
                popupPlacement: 'bottom',
                width: 'calc(100vw - 2rem)',
                height: 'auto',
                closeIcon: null,
                closeOnBackdropClick: false,
                border: { radius: '1rem' }
            });
        }
        init() {
            super.init();
            this.onEventClicked = this.getAttribute('onEventClicked', true) || this.onEventClicked;
            const events = this.getAttribute('events', true);
            this.setData({ events });
        }
        render() {
            return (this.$render("i-vstack", { background: { color: Theme.background.main }, width: '100%', height: '100%', maxHeight: "-webkit-fill-available" },
                this.$render("i-hstack", { id: "pnlHeader", verticalAlignment: 'center', horizontalAlignment: 'center', gap: "0.25rem", cursor: 'pointer', onClick: this.onChangeDate },
                    this.$render("i-label", { id: "lbMonth", font: { size: '1.25rem', weight: 600 } }),
                    this.$render("i-label", { id: "lbYear", font: { size: '1.25rem', color: Theme.text.secondary } })),
                this.$render("i-scom-calendar--view", { id: "calendarView", stack: { grow: '1' }, onMonthChanged: this.onUpdateMonth, display: 'flex', maxHeight: '100%', overflow: 'hidden' })));
        }
    };
    ScomCalendar = __decorate([
        components_8.customModule,
        (0, components_8.customElements)('i-scom-calendar')
    ], ScomCalendar);
    exports.default = ScomCalendar;
});
