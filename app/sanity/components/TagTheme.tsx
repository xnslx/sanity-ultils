import styled, { css } from 'styled-components';

interface Props {
  background?: string;
  text?: string;
}

interface StyledSpanProps {
  background?: string;
}

const StyledSpan = styled.span<StyledSpanProps>(() => {
  const bg = 'white';

  return css`
    align-items: center;
    background-color: ${bg};
    border-radius: inherit;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    width: 100%;
  `;
});

const TagThemePreview = (props: Props) => {
  const { text } = props;
  console.log('text', text);

  return (
    <StyledSpan>
      <span style={{ fontSize: '1.5rem' }}>{text?.charAt(0)}</span>
    </StyledSpan>
  );
};

export default TagThemePreview;
