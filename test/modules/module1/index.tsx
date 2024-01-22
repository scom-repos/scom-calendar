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
                startDate: 1704927600000,
                endDate: 1705197600000,
            },
            {
                title: 'Event 2',
                startDate: 1704859200000,
                endDate: 1705204800000,
            },
            {
                title: 'Event 3',
                startDate: 1705309200000,
                endDate: 1705323600000,
                data: {
                    test: '123'
                }
            },
            {
                title: 'Meeting 1',
                startDate: 1705309200000,
                endDate: 1705323600000,
                link: 'https://meet.google.com/meeting_id'
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
                height="100vh"
                width={'100vw'}
                display='block'
                overflow={'hidden'}
                onEventClicked={(data) => console.log(data)}
            ></i-scom-calendar>
        </i-panel>
    }
}