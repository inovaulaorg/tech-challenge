import React from 'react';
import styled from 'styled-components';
import { Input } from '.'; // seu input já existente
import { Button } from '../ui';
import Icon from 'react-icons-kit';
import { send } from 'react-icons-kit/feather/send';

interface CommentInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Write your comment...',
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <Wrapper>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <SendButton onClick={onSubmit} disabled={disabled} aria-label="Send Comment">
        <Icon icon={send} size={18} />
      </SendButton>
    </Wrapper>
  );
};

/* === Styled Components === */
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
`;

const StyledInput = styled(Input)`
  border: none;
  background: transparent;
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;

  &:focus {
    outline: none;
  }
`;

const SendButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  min-width: unset;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;
