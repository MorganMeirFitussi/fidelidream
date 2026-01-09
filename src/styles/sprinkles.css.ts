import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

// Responsive breakpoints
const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline', 'inline-flex', 'grid'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    flexWrap: ['wrap', 'nowrap'],
    gap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    width: ['100%', 'auto', 'fit-content'],
    maxWidth: ['100%', '400px', '600px', '800px', '1200px'],
    textAlign: ['left', 'center', 'right'],
    fontSize: vars.fontSize,
    fontWeight: vars.fontWeight,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
  },
});

// Color properties (not responsive)
const colorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' },
    active: { selector: '&:active' },
  },
  defaultCondition: 'default',
  properties: {
    color: vars.color,
    backgroundColor: vars.color,
    borderColor: vars.color,
  },
});

// Static properties
const staticProperties = defineProperties({
  properties: {
    borderRadius: vars.borderRadius,
    boxShadow: vars.shadow,
    position: ['relative', 'absolute', 'fixed', 'sticky'],
    overflow: ['hidden', 'auto', 'visible', 'scroll'],
    cursor: ['pointer', 'default', 'not-allowed', 'text'],
    opacity: ['0', '0.5', '0.75', '1'],
    transition: {
      fast: 'all 0.15s ease',
      normal: 'all 0.2s ease',
      slow: 'all 0.3s ease',
    },
    flexGrow: ['0', '1'],
    flexShrink: ['0', '1'],
    borderWidth: ['0', '1px', '2px'],
    borderStyle: ['solid', 'dashed', 'none'],
  },
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  colorProperties,
  staticProperties
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
