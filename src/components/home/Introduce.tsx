import { ColorType } from "@/types";
import { Paper, Typography, Button } from "@mui/material";
import { BsGift } from "react-icons/bs";
import styled from "styled-components";

const WrapContent = styled(Paper)`
  padding: 40px;
  text-align: center;
`;

const MainContent = styled(Typography)`
  & > span {
    color: ${ColorType.PRIMARY};
  }
`;

const Introduce = ({ offerCheck }: { offerCheck: string }): JSX.Element => {
  return (
    <WrapContent>
      <MainContent>
        Cú pháp đã được tích hợp sẵn vào nút{" "}
        <span>“Đăng ký qua SMS hoặc link”</span> cho từng gói cước, khi nhấn sẽ
        tự động chuyển về soạn thảo tin nhắn, quý khách chỉ cần{" "}
        <span>nhấn gửi tin</span> đi là đã đăng ký thành công. (nếu đăng ký
        không thành công sẽ không bị trừ tiền).
      </MainContent>
      <Typography sx={{ marginTop: "20px" }} variant="h6">
        Kiểm tra ưu đãi dành riêng cho thuê bao của bạn
      </Typography>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        color="error"
        startIcon={<BsGift />}
        href={offerCheck}
        target="_blank"
      >
        KIỂM TRA ƯU ĐÃI
      </Button>
    </WrapContent>
  );
};

export default Introduce;
