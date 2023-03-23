import styled from "styled-components";
import LogoImage from "@/assets/image/top-header-logo.png";
import { Paper, Box, Modal, Fade, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { Color, RootState } from "@/types";
import { useState } from "react";
import { listMenu } from "@/utils/configs";
import { Link as ScrollLink } from "react-scroll";
import { notification } from "@/utils/helper";
import { logout } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import AvatarImg from "@/assets/image/viettel.jpg";

const WrapContent = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    width: 200px;
    margin: 0;
  }
  position: relative;
`;

const MenuIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  & svg {
    color: #c0c0c0;
    font-size: 25px;
    border: 1px solid #c0c0c0;
    border-radius: 50%;
    padding: 4px;
    &:hover {
      background-color: ${Color.PRIMARY};
      color: #fff;
      border: none;
    }
  }
`;

const LogoHeader = styled.div`
  cursor: pointer;
  padding: 30px 0;
`;

const ListMenu = styled(Box)`
  position: fixed;
  background-color: ${Color.BG_SECONDARY};
  outline: none;
  border: none;
  height: 100vh;
  width: 60vw;
  padding: 30px 0;
`;

const MenuItem = styled.div`
  padding: 15px 0px;
  padding-left: 20px;
  font-size: 1em;
  font-weight: 500;
  color: ${Color.TEXT_COLOR_SECONDARY};
  cursor: pointer;
  &:hover {
    color: ${Color.PRIMARY};
  }
  & a {
    display: block;
    width: 100%;
  }
`;

const ImageUser = styled.img`
  display: block;
  height: 30px;
  width: 30px;
  border-radius: 50%;
`;

const MobileMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const hanldeLogout = (): void => {
    notification("success", "Tài khoản đã được đăng xuất");
    dispatch(logout());
    setIsOpenMenu(false);
  };

  return (
    <>
      <WrapContent elevation={3}>
        <MenuIcon onClick={() => setIsOpenMenu(true)}>
          <BsList />
        </MenuIcon>
        <Link to="/">
          <LogoHeader>
            <img src={LogoImage} alt="logo-viettel" />
          </LogoHeader>
        </Link>
      </WrapContent>
      <Modal
        open={isOpenMenu}
        onClose={() => setIsOpenMenu(false)}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpenMenu}>
          <ListMenu>
            <Box display="flex" justifyContent="end" padding={"0 15px"}>
              <FaTimes
                onClick={() => setIsOpenMenu(false)}
                color={Color.PRIMARY}
              />
            </Box>
            <Box
              display={"flex"}
              justifyContent="space-between"
              alignItems="center"
              padding={"0 15px"}
              marginY={4}
            >
              {currentUser ? (
                <>
                  <Box display={"flex"} alignItems="center" gap={"10px"}>
                    <ImageUser
                      src={currentUser?.image ? currentUser?.image : AvatarImg}
                    />
                    <Typography variant="subtitle2">
                      {currentUser?.name}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      navigate("/login");
                      setIsOpenMenu(false);
                    }}
                    size="small"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      navigate("/register");
                      setIsOpenMenu(false);
                    }}
                    size="small"
                  >
                    Đăng kí
                  </Button>
                </Box>
              )}
            </Box>

            {listMenu?.map(menu => (
              <MenuItem key={menu.id}>
                <ScrollLink
                  to={menu.id}
                  smooth={true}
                  offset={-200}
                  duration={1000}
                  onClick={() => setIsOpenMenu(false)}
                >
                  {menu.title}
                </ScrollLink>
              </MenuItem>
            ))}
            {currentUser && (
              <Box padding={"0 15px"} mt={4}>
                <Button
                  onClick={hanldeLogout}
                  variant="contained"
                  color="error"
                  startIcon={<FiLogOut />}
                  fullWidth
                >
                  Đăng xuất
                </Button>
              </Box>
            )}
          </ListMenu>
        </Fade>
      </Modal>
    </>
  );
};

export default MobileMenu;
