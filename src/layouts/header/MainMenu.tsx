import styled from "styled-components";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import { Color, RootState, SignInResponse } from "@/types";
import { FiLogOut } from "react-icons/fi";
import { FcManager, FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { listMenu } from "@/utils/configs";
import { notification } from "@/utils/helper";
import AvatarImg from "@/assets/image/vietnam.png";

const WrapContainer = styled.div``;

const WrapListMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListMenu = styled.div`
  display: flex;
`;

const MenuItem = styled.div`
  padding: 15px 10px;
  font-size: 15px;
  color: ${Color.TEXT_COLOR};
  cursor: pointer;
  &:hover {
    color: ${Color.PRIMARY};
  }
`;

const SubListInfo = styled(Paper)`
  position: absolute;
  top: calc(100% + 20px);
  left: -30px;
  display: none;
`;

const ImageUser = styled.img`
  display: block;
  height: 30px;
  width: 30px;
  border-radius: 50%;
`;

const InfoUser = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  &::after {
    top: 99%;
    left: -30px;
    position: absolute;
    content: "";
    width: 220px;
    height: 25px;
  }
  &:hover ${SubListInfo} {
    display: block;
  }
`;

const ListInfoItem = styled.div`
  min-width: 200px;
  padding: 12px 18px;
  width: max-content;
  svg {
    font-size: 24px;
  }
  &:hover {
    color: ${Color.PRIMARY};
    background-color: ${Color.BG_SECONDARY};
  }
`;

const MainMenu = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const hanldeLogout = (): void => {
    notification("success", "Tài khoản đã được đăng xuất");
    dispatch(logout());
  };

  return (
    <WrapContainer>
      <Container>
        <WrapListMenu>
          <ListMenu>
            {listMenu?.map(menu => (
              <MenuItem key={menu.id}>
                <ScrollLink
                  to={menu.id}
                  smooth={true}
                  offset={-200}
                  duration={1000}
                  onClick={() => navigate("/")}
                >
                  {menu.title}
                </ScrollLink>
              </MenuItem>
            ))}
          </ListMenu>

          {currentUser?.name ? (
            <InfoUser>
              <ImageUser
                src={currentUser?.image ? currentUser?.image : AvatarImg}
              />
              <Typography variant="subtitle2">{currentUser?.name}</Typography>
              <SubListInfo>
                {currentUser.isAdmin && (
                  <ListInfoItem
                    onClick={() => {
                      navigate("/service");
                    }}
                  >
                    <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                      <Box display={"flex"} alignItems={"center"}>
                        <FcManager />
                      </Box>
                      <Typography variant="subtitle1">
                        Quản lý dịch vụ
                      </Typography>
                    </Box>
                  </ListInfoItem>
                )}
                {/* <ListInfoItem onClick={() => navigate("/like")}>
                  <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                    <Box display={"flex"} alignItems={"center"}>
                      <FcLike />
                    </Box>
                    <Typography variant="subtitle1">
                      Các gói yêu thích
                    </Typography>
                  </Box>
                </ListInfoItem> */}
                <ListInfoItem onClick={hanldeLogout}>
                  <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                    <Box display={"flex"} alignItems={"center"}>
                      <FiLogOut />
                    </Box>
                    <Typography variant="subtitle1">Đăng xuất</Typography>
                  </Box>
                </ListInfoItem>
              </SubListInfo>
            </InfoUser>
          ) : (
            <Box display="flex" gap="10px">
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/login")}
                color="error"
              >
                Đăng nhập
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/register")}
              >
                Đăng kí
              </Button>
            </Box>
          )}
        </WrapListMenu>
      </Container>
    </WrapContainer>
  );
};

export default MainMenu;
