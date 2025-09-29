import styled from 'styled-components';
import { FormGroup, Label, ErrorText } from './index';
import { useState, forwardRef } from 'react';
import { Icon } from 'react-icons-kit';
import { eye, eyeOff } from 'react-icons-kit/feather';

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: any;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', placeholder, error, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
      <FormGroup>
        {label && <Label htmlFor={props.name}>{label}</Label>}
        <InputWrapper>
          {icon && <IconLeft><Icon icon={icon} size={20} /></IconLeft>}
          <StyledInput
            id={props.name}
            type={inputType}
            placeholder={placeholder}
            hasIcon={!!icon}
            hasEye={type === 'password'}
            hasError={!!error}
            ref={ref}
            {...props}     
          />
          {type === 'password' && (
            <EyeButton type="button" onClick={() => setShowPassword(prev => !prev)}>
              <Icon icon={showPassword ? eyeOff : eye} size={20} />
            </EyeButton>
          )}
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
      </FormGroup>
    );
  }
);

InputField.displayName = 'InputField';

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconLeft = styled.div`
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

interface StyledInputProps {
  hasIcon?: boolean;
  hasEye?: boolean;
  hasError?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: ${({ hasIcon, hasEye }) => {
    if (hasIcon && hasEye) return '8px 40px 8px 36px';
    if (hasIcon) return '8px 12px 8px 36px';
    if (hasEye) return '8px 40px 8px 12px';
    return '8px 12px';
  }};
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.red[500] : theme.colors.gray[300])};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => (hasError ? theme.colors.red[500] : theme.colors.primary[500])};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => (hasError ? `${theme.colors.red[500]}20` : `${theme.colors.primary[500]}20`)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;
