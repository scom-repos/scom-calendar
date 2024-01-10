import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const transitionStyle = Styles.style({
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
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
