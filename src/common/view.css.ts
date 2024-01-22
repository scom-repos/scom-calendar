import { Styles } from '@ijstech/components';

export const transitionStyle = Styles.style({
  transition: 'height 0.3s ease'
})

export const swipeStyle = Styles.style({
  // scrollSnapType: 'x mandatory',
  // "-webkit-scroll-snap-type": 'x mandatory',
  // '-webkit-overflow-scrolling': 'unset',
  // transition: 'transform 0.3s ease',
  $nest: {
    '.scroll-item': {
      scrollSnapAlign: 'start'
    },
    '&::-webkit-scrollbar': {
      height: 0
    },
  }
})

export const monthListStyle = Styles.style({
  $nest: {
    '&:not(.--full) > .scroll-item > .scroll-item': {
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