import styled, { css } from 'styled-components';
import type { Property } from 'csstype';
import type { LabelHTMLAttributes } from 'react';
import type { ResponsiveValue, TLengthStyledSystem } from 'styled-system';
import {
  space,
  color,
  layout,
  flexbox,
  typography,
  border,
  boxShadow,
  system,
  SpaceProps,
  ColorProps,
  LayoutProps,
  FlexboxProps,
  TypographyProps,
  BorderProps,
  BoxShadowProps,
} from 'styled-system';

interface BoxProps extends
  SpaceProps,
  ColorProps,
  LayoutProps,
  FlexboxProps,
  TypographyProps,
  BorderProps,
  BoxShadowProps
   {
  gap?: ResponsiveValue<Property.Gap<TLengthStyledSystem>>;
  as?: keyof JSX.IntrinsicElements;
}

const gap = system({
  gap: {
    property: 'gap',
    scale: 'space',
  },
});

export const Box = styled.div<BoxProps>`
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${typography}
  ${border}
  ${boxShadow}
  ${gap}
`;

export const Flex = styled(Box)`
  display: flex;
`;

export const Container = styled(Box)`
  width: 100%;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.space[4]};
  padding-right: ${({ theme }) => theme.space[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: ${({ theme }) => theme.sizes.container.sm};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: ${({ theme }) => theme.sizes.container.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: ${({ theme }) => theme.sizes.container.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: ${({ theme }) => theme.sizes.container.xl};
  }
`;

interface GridProps extends BoxProps {
  columns?: ResponsiveValue<Property.GridTemplateColumns>;
  gap?: ResponsiveValue<Property.Gap<TLengthStyledSystem>>;
}

export const Grid = styled(Box)<GridProps>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || '1fr'};
  ${gap}
`;

type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'color'>;

interface TextProps extends TypographyProps, ColorProps, SpaceProps, LabelProps, FlexboxProps {
  variant?: 'body' | 'heading' | 'caption' | 'label';
  as?: keyof JSX.IntrinsicElements;
}

export const Text = styled.span<TextProps>`
  ${typography}
  ${color}
  ${space}
  ${flexbox}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'heading':
        return css`
          font-family: ${theme.fonts.heading};
          font-weight: ${theme.fontWeights.bold};
          line-height: ${theme.lineHeights.tight};
        `;
      case 'caption':
        return css`
          font-size: ${theme.fontSizes.sm};
          color: ${theme.colors.gray[500]};
        `;
      case 'label':
        return css`
          font-size: ${theme.fontSizes.sm};
          font-weight: ${theme.fontWeights.medium};
        `;
      default:
        return css`
          font-family: ${theme.fonts.body};
          line-height: ${theme.lineHeights.normal};
        `;
    }
  }}
`;

export const Heading = styled(Text).attrs({ as: 'h2', variant: 'heading' })``;

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  as?: any;
  to?: string;
  gap?: ResponsiveValue<Property.Gap<TLengthStyledSystem>>;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  ${gap}

  &:hover,
  &:focus {
    text-decoration: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.space[4]} ${theme.space[6]};
          font-size: ${theme.fontSizes.lg};
        `;
      default:
        return css`
          padding: ${theme.space[3]} ${theme.space[4]};
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[800]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[300]};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border-color: ${theme.colors.primary[500]};
          color: ${theme.colors.primary[500]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[500]};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary[500]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
            color: ${theme.colors.primary[500]};

          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.red[600]};
          color: ${theme.colors.primary[50]};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.red[700]};
            color: ${theme.colors.primary[100]};

          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary[500]};
          color: white;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
            color: white;
          }
        `;
    }
  }}

  ${({ isLoading }) =>
    isLoading && css`
      pointer-events: none;
      opacity: 0.6;
    `
  }
`;

interface BadgeProps {
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = styled(Text).attrs({ as: 'span' })<BadgeProps>`
  display: inline-block;
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return `${theme.space[1]} ${theme.space[2]}`;
      case 'lg': return `${theme.space[2]} ${theme.space[3]}`;
      default: return `${theme.space[1]} ${theme.space[3]}`;
    }
  }};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return theme.fontSizes.xs;
      case 'lg': return theme.fontSizes.lg;
      default: return theme.fontSizes.sm;
    }
  }};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: white;

  ${({ colorScheme, theme }) => {
    switch (colorScheme) {
      case 'blue':
        return css`background-color: ${theme.colors.primary[500]};`;
      case 'green':
        return css`background-color: ${theme.colors.green[500]};`;
      case 'red':
        return css`background-color: ${theme.colors.red[500]};`;
      case 'yellow':
        return css`background-color: ${theme.colors.yellow[500]}; color: black;`;
      default:
        return css`background-color: ${theme.colors.gray[500]};`;
    }
  }}
`;

