import React from "react";
import TopHeader from "@/layouts/header/TopHeader";
import MainMenu from "@/layouts/header/MainMenu";
import MainFooter from "@/layouts/footer/MainFooter";
import BottomFooter from "@/layouts/footer/BottomFooter";
import styled from "styled-components";
import useMediaQuery from "@/utils/hooks/useMediaQuery";
import MobileMenu from "@/layouts/header/MobileMenu";

type Props = {
  children: React.ReactNode;
};

const WrapHeader = styled.div`
  position: sticky;
  top: 0px;
  box-shadow: 0 5px 10px rgb(129 126 126 / 31%);
  background-color: #fff;
  z-index: 1000;
`;

const WrapContainer = styled.div`
  background-color: #fbfbfb;
  padding: 40px 0;
  min-height: 70vh;
`;

const MainLayout = ({ children }: Props): JSX.Element => {
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
  return (
    <>
      <WrapHeader>
        {isAboveMediumScreens ? (
          <>
            <TopHeader />
            <MainMenu />
          </>
        ) : (
          <MobileMenu />
        )}
      </WrapHeader>
      <WrapContainer>{children}</WrapContainer>
      <MainFooter />
      <BottomFooter />
    </>
  );
};

export default MainLayout;
