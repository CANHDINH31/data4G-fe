import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Container, Link } from "@mui/material";
import { Color } from "@/types";
import LogoImage from "@/assets/image/top-header-logo.png";
import { SiZalo } from "react-icons/si";
import { BsFacebook } from "react-icons/bs";
import { notification } from "@/utils/helper";
import { getStructre } from "@/utils/api/api";

const WrapContainer = styled.div`
  background-color: ${Color.BG_SECONDARY};
  padding: 30px 0;
`;
const WrapFooter = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 1060px) {
    flex-direction: column;
    align-items: center;
  }
`;
const LeftFooter = styled.div`
  flex: 2;
`;
const LogoFooter = styled.div``;
const TextFooter = styled.div`
  margin-top: 40px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 0.1px;
  word-wrap: break-word;
  white-space: pre-wrap;
  color: ${Color.TEXT_COLOR};
`;
const DescriptionFooter = styled.div`
  margin-top: 40px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: 0.1px;
  word-wrap: break-word;
  white-space: pre-wrap;
  color: ${Color.TEXT_COLOR};
`;
const RightFooter = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  @media (max-width: 1060px) {
    width: 100%;
    display: block;
    margin-top: 40px;
  }
`;
const RightFooterContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleFooter = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${Color.TEXT_COLOR};
`;

const FooterMenu = styled.div`
  margin-top: 15px;
`;
const FooterMenuItem = styled.div`
  font-size: 12px;
  color: ${Color.TEXT_COLOR};
  letter-spacing: 0.1px;
  cursor: pointer;
  margin-bottom: 4px;
`;

const FooterIcon = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 10px;
  svg {
    cursor: pointer;
    font-size: 30px;
    color: #1b74e4;
  }
`;

const MainFooter = (): JSX.Element => {
  const [facebookLink, setFacebookLink] = useState<string>("");
  const [zaloLink, setZaloLink] = useState<string>("");

  useEffect(() => {
    const getInfoStruct = async () => {
      try {
        const res = (await getStructre()) as {
          data: {
            data: {
              facebookLink: string;
              zaloLink: string;
            };
          };
        };
        setFacebookLink(res.data.data.facebookLink);
        setZaloLink(res.data.data.zaloLink);
      } catch (error) {
        notification("system");
      }
    };
    getInfoStruct();
  }, []);
  return (
    <WrapContainer>
      <Container>
        <WrapFooter>
          <LeftFooter>
            <LogoFooter>
              <img src={LogoImage} alt="logo-viettel" />
            </LogoFooter>
            <TextFooter>
              WEBSITE MUA SẮM ONLINE CHÍNH THỨC CỦA VIETTEL TELECOM.
            </TextFooter>
            <DescriptionFooter>
              Cơ quan chủ quản: Tổng Công ty Viễn thông Viettel (Viettel
              Telecom) - Chi nhánh Tập đoàn Công nghiệp - Viễn thông Quân đội.
              Mã số doanh nghiệp: 0100109106-011 do Sở Kế hoạch và Đầu tư Thành
              phố Hà Nội cấp lần đầu ngày 18/07/2005, sửa đổi lần thứ 15 ngày
              18/12/2018. Chịu trách nhiệm nội dung: Ông Cao Anh Sơn
            </DescriptionFooter>
          </LeftFooter>
          <RightFooter>
            <RightFooterContent>
              <TitleFooter>Hỗ trợ khách hàng</TitleFooter>
              <FooterMenu>
                <FooterMenuItem>
                  <Link
                    sx={{ color: "rgba(0,0,0,1)" }}
                    target="_blank"
                    href={facebookLink}
                  >
                    Chat Online với chăm sóc khách hàng
                  </Link>
                </FooterMenuItem>
                <FooterMenuItem>
                  <Link
                    sx={{ color: "rgba(0,0,0,1)" }}
                    target="_blank"
                    href={facebookLink}
                  >
                    Liên hệ Facebook
                  </Link>
                </FooterMenuItem>
                <FooterMenuItem>
                  <Link
                    sx={{ color: "rgba(0,0,0,1)" }}
                    target="_blank"
                    href={zaloLink}
                  >
                    Liên hệ Zalo
                  </Link>
                </FooterMenuItem>
              </FooterMenu>
              <FooterIcon>
                <Link
                  sx={{ color: "rgba(0,0,0,1)" }}
                  target="_blank"
                  href={zaloLink}
                >
                  <SiZalo />
                </Link>
                <Link
                  sx={{ color: "rgba(0,0,0,1)" }}
                  target="_blank"
                  href={facebookLink}
                >
                  <BsFacebook />
                </Link>
              </FooterIcon>
            </RightFooterContent>
          </RightFooter>
        </WrapFooter>
      </Container>
    </WrapContainer>
  );
};

export default MainFooter;
