import { Styles } from '@ijstech/components';

export const transitionStyle = Styles.style({
  $nest: {
    '.scroll-container': {
      // transition: 'transform .3s cubic-bezier(0.19, 1, 0.22, 1) 0s',
      $nest: {
        '&::-webkit-scrollbar': {
          height: 0,
          width: 0
        },
      }
    }
  }
})
