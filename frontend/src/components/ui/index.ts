import styled, { css } from 'styled-components';
import { 
  space, 
  layout, 
  flexbox, 
  typography, 
  border,
  system,
  SpaceProps, 
  LayoutProps, 
  FlexboxProps,
  TypographyProps,
  BorderProps,
  ColorProps,
} from 'styled-system';
import { get } from 'lodash';
import isPropValid from '@emotion/is-prop-valid'; 


const gap = system({
  gap: {
    property: 'gap',
    scale: 'space',
  },
});

const customColor = (props: any) => {
  const customStyles: { [key: string]: any } = {};
  const { theme, color, backgroundColor, bg, borderColor } = props;
  const colorProps = {
    color: color,
    backgroundColor: backgroundColor || bg,
    borderColor: borderColor,
  };
  for (const [prop, value] of Object.entries(colorProps)) {
    if (value && typeof value === 'string') {
      const themeColor = get(theme.colors, value, value);
      customStyles[prop] = themeColor;
    }
  }
  return css(customStyles as any);
};

interface BoxProps extends 
  SpaceProps, 
  LayoutProps, 
  FlexboxProps,
  TypographyProps,
  BorderProps,
  ColorProps {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceProps['margin'];
}


export const Box = styled.div.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})<BoxProps>`
  /* As funções de styled-system são aplicadas aqui */
  ${space}
  ${layout}
  ${flexbox}
  ${typography}
  ${border}
  ${gap} 
  ${customColor} 
`;


export const Flex = styled(Box)`
  display: flex;
`;


export const Container = styled(Box)`
  width: 100%;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.space[4]};
  padding-right: ${({ theme }) => theme.space[4]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) { // sm
    max-width: ${({ theme }) => theme.sizes.container.sm};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) { // md
    max-width: ${({ theme }) => theme.sizes.container.md};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) { // lg
    max-width: ${({ theme }) => theme.sizes.container.lg};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints[3]}) { // xl
    max-width: ${({ theme }) => theme.sizes.container.xl};
  }
`;

export const Grid = styled(Box)`
  display: grid;
`;


interface TextProps extends TypographyProps, ColorProps, SpaceProps {
  variant?: 'body' | 'heading' | 'caption' | 'label';
  as?: keyof JSX.IntrinsicElements;
}

export const Text = styled.span.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop),
})<TextProps>`
  ${typography}
  ${space}
  ${customColor}
  
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
          color: ${get(theme.colors, 'gray.500', '#6c757d')};
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
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
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
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
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
