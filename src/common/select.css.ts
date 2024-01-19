import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

function generateFn() {
  let result: any = {};
  for (let i = 1; i <= 100; i++) {
    result[`&:nth-child(${i})`] = {
      transform: `rotateX(-18deg * (${i} - 1)) translateZ(9.375rem)`
    }
  }
  return result;
}

export const selectorStyles = Styles.style({
  $nest: {
    '.select-wrap': {
      position: 'relative',
      height: "100%",
      textAlign: 'center',
      overflow: "hidden",
      fontSize: '1.25rem',
      color: Theme.text.primary,
      $nest: {
        '&:before, &:after': {
          position: "absolute",
          zIndex: 1,
          display: "block",
          content: '',
          width: '100%',
          height: '50%'
        },
        "&:before": {
          top: 0,
          backgroundImage: "linear-gradient(to bottom, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0))",
        },
        "&:after": {
          bottom: 0,
          backgroundImage: "linear-gradient(to top, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0))"
        },
        ".select-options": {
          position: "absolute",
          top: '50%',
          left: 0,
          width: "100%",
          height: 0,
          transformStyle: 'preserve-3d',
          margin: '0 auto',
          display: 'block',
          transform: 'translateZ(-9.375rem) rotateX(0deg)',
          '-webkit-font-smoothing': 'subpixel-antialiased',
          color: Theme.text.primary,
          $nest: {
            '.select-option': {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: '3.125rem',
              '-webkit-font-smoothing': 'subpixel-antialiased',
              $nest: generateFn()
            }
          }
        }
      },
    },
  
    '.highlight': {
      position: "absolute",
      top: "50%",
      transform: "translate(0, -50%)",
      width: "100%",
      borderTop: `0.5px solid ${Theme.action.hoverBackground}`,
      borderBottom: `0.5px solid ${Theme.action.hoverBackground}`,
      fontSize: '1.5rem',
      overflow: "hidden",
    },

    ".highlight-list": {
      position: "absolute",
      padding: 0,
      width: "100%",
      listStyle: 'none'
    },
  
    /* date */
    ".date-selector": {
      transform: 'translate(-50%, -50%)',
      perspective: '2000px',
      width: '37.5rem',
      maxWidth: '100%',
      height: '18.75rem',
      $nest: {
        ".select-wrap": {
          fontSize: '1.25rem'
        },
        ".highlight": {
          fontSize: '1.25rem'
        }
      },
    }
  }
})
