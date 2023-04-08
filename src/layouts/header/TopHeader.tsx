import styled from "styled-components";
import LogoImage from "@/assets/image/top-header-logo.png";
import { AiOutlineSearch } from "react-icons/ai";
import { Color } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { KeyboardEvent, useState } from "react";

const WrapContainer = styled.div`
  background-color: ${Color.BG_SECONDARY};
`;

const TopHeaderContainer = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const LogoHeader = styled.div`
  cursor: pointer;
`;

const SearchHeader = styled.div`
  background-color: ${Color.BG_WHITE};
  display: flex;
  border-radius: 9px;
  padding: 8px 10px;
  & input {
    border: none;
    font-size: 14px;
    color: ${Color.TEXT_COLOR_SECONDARY};
  }
`;

const LogoSearch = styled.div`
  display: flex;
  align-items: center;
  & svg {
    font-size: 20px;
    margin-right: 7px;
    color: ${Color.TEXT_COLOR_SECONDARY};
  }
`;

const TopHeader = (): JSX.Element => {
  const navigate = useNavigate();
  const [key, setKey] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && key) {
      navigate("/search?key=" + key);
      setKey("");
    }
  };
  return (
    <WrapContainer>
      <Container>
        <TopHeaderContainer>
          <Link to="/">
            <LogoHeader>
              <img src={LogoImage} alt="logo-viettel" />
            </LogoHeader>
          </Link>

          <SearchHeader>
            <LogoSearch>
              <AiOutlineSearch />
            </LogoSearch>
            <input
              placeholder="Tìm kiếm ..."
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </SearchHeader>
        </TopHeaderContainer>
      </Container>
    </WrapContainer>
  );
};

export default TopHeader;
