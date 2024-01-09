import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const transitionStyle = Styles.style({
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)'
})

export const aspectRatioStyle = Styles.style({
  aspectRatio: '1 / 1'
})

export const closeIconStyle = Styles.style({
  $nest: {
    '&:hover': {
      background: `${Theme.colors.primary.dark} !important`,
      borderRadius: '100%',
      $nest: {
        'svg': {
          fill: `${Theme.colors.primary.contrastText} !important`
        }
      }
    }
  }
})
