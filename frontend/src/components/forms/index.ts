import styled from 'styled-components';
import { Box, Text } from '../ui';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

export const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Label = styled(Text).attrs({ as: 'label', variant: 'label' })`
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.normal};
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.red[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.red[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) =>
      hasError ? `${theme.colors.red[500]}20` : `${theme.colors.primary[500]}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.red[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-family: ${({ theme }) => theme.fonts.body};
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.red[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) =>
      hasError ? `${theme.colors.red[500]}20` : `${theme.colors.primary[500]}20`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const Select = styled.select<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.red[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.red[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) =>
      hasError ? `${theme.colors.red[500]}20` : `${theme.colors.primary[500]}20`};
  }
`;

export const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.red[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const HelpText = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

interface FileInputWrapperProps {
  label?: string;
}

export const FileInputWrapper = styled.label<FileInputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  cursor: pointer;
  width: 100%;
`;

export const FileInputButton = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const FileInputStyled = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export const SelectedFileText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export { Box };
