import { Styles } from '@ijstech/components';

export const transitionStyle = Styles.style({
  $nest: {
    '.scroll-container': {
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      $nest: {
        '&::-webkit-scrollbar': {
          height: 0,
          width: 0
        },
      }
    }
  }
})
