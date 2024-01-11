import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const transitionStyle = Styles.style({
  transition: 'height 0.3s ease'
})

export const swipeStyle = Styles.style({
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
})
