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
                endDate: '2024-01-11T02:00:00.000Z',
            },
            {
                title: 'Event 2',
                startDate: '2024-01-13T09:00:00.000Z',
                endDate: '2024-01-13T13:00:00.000Z',
            }
        ]
    }

    async init() {
        super.init();
    }

    render() {
        return <i-panel>
            <i-scom-calendar></i-scom-calendar>
        </i-panel>
    }
}