import { getStructre } from "@/utils/api/api";
import { notification } from "@/utils/helper";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundImg from "@/assets/image/404.png";
import styled from "styled-components";

const WrapImage = styled("div")`
  display: flex;
  justify-content: center;
  & > img {
    display: block;
    width: 80%;
    height: auto;
    object-fit: contain;
  }
`;

const NotFound = () => {
  const navigation = useNavigate();
  const [takeCareGuest, setTakeCareGuest] = useState<string>("");

  useEffect(() => {
    const getInfoStruct = async () => {
      try {
        const res = (await getStructre()) as {
          data: {
            data: {
              takeCareGuest: string;
            };
          };
        };
        setTakeCareGuest(res.data.data.takeCareGuest);
      } catch (error) {
        notification("system");
      }
    };
    getInfoStruct();
  }, []);
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={8}
      >
        <WrapImage>
          <img src={NotFoundImg} />
        </WrapImage>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <Typography variant="h6" textAlign="center">
            RẤT TIẾC, TRANG BẠN TÌM KIẾM KHÔNG TỒN TẠI!
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigation("/")}
          >
            Trở về trang chủ
          </Button>
          <Typography textAlign="center">{`Nếu bạn cần hỗ trợ, vui lòng gọi đến CSKH ${takeCareGuest}`}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
