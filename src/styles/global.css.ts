import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// CSS Reset
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  WebkitTextSizeAdjust: '100%',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
  margin: 0,
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '16px',
  lineHeight: 1.6,
  backgroundColor: vars.color.background,
  color: vars.color.text,
});

// Typography
globalStyle('h1, h2, h3, h4, h5, h6', {
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.3,
  color: vars.color.text,
});

globalStyle('h1', {
  fontSize: vars.fontSize.xxxl,
});

globalStyle('h2', {
  fontSize: vars.fontSize.xxl,
});

globalStyle('h3', {
  fontSize: vars.fontSize.xl,
});

globalStyle('p', {
  marginBottom: vars.space.md,
});

// Links
globalStyle('a', {
  color: vars.color.primary,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
});

globalStyle('a:hover', {
  color: vars.color.primaryHover,
});

// Form elements
globalStyle('input, select, textarea, button', {
  fontFamily: 'inherit',
  fontSize: 'inherit',
});

globalStyle('button', {
  cursor: 'pointer',
  border: 'none',
  background: 'none',
});

globalStyle('input:focus, select:focus, textarea:focus, button:focus', {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: '2px',
});

// Remove number input spinners
globalStyle('input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button', {
  WebkitAppearance: 'none',
  margin: 0,
});

globalStyle('input[type="number"]', {
  MozAppearance: 'textfield',
});

// Tables
globalStyle('table', {
  borderCollapse: 'collapse',
  width: '100%',
});

// Images
globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
});

// Selection
globalStyle('::selection', {
  backgroundColor: vars.color.primaryLight,
  color: vars.color.primary,
});
