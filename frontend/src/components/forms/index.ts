import styled from 'styled-components';
import { Box, Text } from '../ui';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.space[2]};
    padding: ${({ theme }) => theme.space[2]};
  }
`;

export const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.space[1]};
  }
`;

export const Label = styled(Text).attrs({ as: 'label', variant: 'label' })`
  cursor: pointer;
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

// Intentional CSS issue: File input styling problems
export const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export const CustomFileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

export const CustomFileButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  @media (max-width: 600px) {
    padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;