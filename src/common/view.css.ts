import { Styles } from '@ijstech/components';

export const transitionStyle = Styles.style({
  transition: 'height 0.3s ease'
})

export const swipeStyle = Styles.style({
  '-webkit-overflow-scrolling': 'touch',
  $nest: {
    '&::-webkit-scrollbar': {
      height: 0
    },
    '&.month-row': {
      flexDirection: 'var(--direction, column)' as any,
    }
  }
})

export const monthListStyle = Styles.style({
  $nest: {
    '&:not(.--full) > .month-row > .week-row': {
      gridTemplateRows: 55
    }
  }
})

export const eventSliderStyle = Styles.style({
  $nest: {
    "> div": {
      height: '100%'
    }
  }
})

export interface IViewStyle {
  event: any;
  border: string;
  month: any;
  week: any
}

export const getViewStyle = (value: IViewStyle) => {
  const { border, month, week, event } = value;
  const style: any = {
    $nest: {
      // '.week-row': {
      //   borderTop : `1px solid ${border}`,
      //   flexShrink: week.grow,
      //   flexBasis : week.basis,
      //   flexGrow: week.grow
      // },
      // '.month-row': {
      //   flexGrow: month.grow,
      //   flexShrink: 0,
      //   flexDirection: month.direction,
      // },
      '.event': {
        minHeight: event.minHeight,
        height: event.height,
        $nest: {
          'i-label': {
            opacity: event.opacity
          }
        }
      },
      // '@supports (scroll-snap-align: start)': {
      //   $nest: {
      //     [`.${swipeStyle}`]: {
      //       scrollSnapType: 'x mandatory'
      //     },
      //     '.scroll-item': {
      //       scrollSnapAlign: 'center'
      //     }
      //   }
      // },
      // '@supports not (scroll-snap-align: start)': {
      //   $nest: {
      //     [`.${swipeStyle}`]: {
      //       '-webkit-scroll-snap-type': 'mandatory',
      //       scrollSnapType: 'mandatory',
      //       // '-webkit-scroll-snap-destination:': '0 50%',
      //       scrollSnapDestination: '0 50%',
      //       // '-webkit-scroll-snap-points-x:': 'repeat(100%)',
      //       scrollSnapPointsX: 'repeat(100%)'
      //     },
      //     '.scroll-item': {
      //       scrollSnapCoordinate: '0 0'
      //     }
      //   }
      // }
    }
  };
  return Styles.style(style);
}
