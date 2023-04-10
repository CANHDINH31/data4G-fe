import { TextareaAutosize, styled } from "@mui/material";

export const TextAreaCustom = styled(TextareaAutosize)`
  width: 25vw;
  border: none;
  resize: none;
  border-bottom: 1px solid green;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  padding: 0 14px;
  &:focus {
    border-bottom: 1px solid #1976d2;
  }
`;
