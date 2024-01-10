import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomCalendar from '@scom/scom-calendar'
@customModule
export default class Module1 extends Module {
    private _events: any[] = [];

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this._events = [
            {
                title: 'Event 1',
                startDate: '2024-01-10T23:00:00.000Z',
                endDate: '2024-01-14T02:00:00.000Z',
            },
            {
                title: 'Event 2',
                startDate: '2024-01-10T04:00:00.000Z',
                endDate: '2024-01-14T04:00:00.000Z',
            },
            {
                title: 'Event 3',
                startDate: '2024-01-15T09:00:00.000Z',
                endDate: '2024-01-15T13:00:00.000Z',
            }
        ]
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-scom-calendar
                events={this._events}
            ></i-scom-calendar>
        </i-panel>
    }
}