import styled from "styled-components";
import { Paper, Typography, Divider, Button, Box } from "@mui/material";
import LogoImage from "@/assets/image/card-img.svg";
import { BsFillDatabaseFill } from "react-icons/bs";
import { BiDollarCircle } from "react-icons/bi";
import { ColorType, ServiceType } from "@/types";
import { registerSMS } from "@/utils/helper";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart } from "react-icons/ai";

const WrapContainer = styled(Paper)`
  width: 94%;
  cursor: pointer;
  img {
    width: 100%;
    object-fit: cover;
  }
  position: relative;
  margin-top: 20px;
  border-radius: 20px !important;
`;

const TitleCard = styled(Typography)`
  text-transform: uppercase;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-weight: 700;
`;

const WrapText = styled.div`
  padding: 10px;
  min-height: 140px;
  position: relative;
`;

const WrapIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  &::after {
    top: -36px;
    right: -36px;
    position: absolute;
    content: "";
    width: 170px;
    height: 80px;
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 18px;
    margin-right: 4px;
    color: ${ColorType.PRIMARY};
  }
`;

const Content = styled.div`
  margin-top: 8px;
  text-align: justify;
  svg {
    font-size: 18px;
    margin-right: 4px;
    color: ${ColorType.PRIMARY};
  }
  span {
    font-size: 14px;
  }
`;

type Props = {
  service: ServiceType;
  isFavourite: boolean;
  registerSms: string;
  registerLink: string;
  handleToggleFavourite: (id: string) => void;
};

const CardItem = ({
  service,
  isFavourite,
  registerSms,
  registerLink,
  handleToggleFavourite,
}: Props): JSX.Element => {
  return (
    <WrapContainer>
      <img src={LogoImage} alt="card-img" />
      <TitleCard variant="h5">{service.title}</TitleCard>
      <WrapText>
        <Price>
          <BiDollarCircle />
          <Typography variant="subtitle2">{service.price}</Typography>
        </Price>
        <Content>
          <BsFillDatabaseFill />
          <span>{service.content}</span>
        </Content>
        <WrapIcon onClick={() => handleToggleFavourite(service._id as string)}>
          {isFavourite ? <FcLike size={20} /> : <AiOutlineHeart size={20} />}
        </WrapIcon>
      </WrapText>
      <Divider />
      <Box
        sx={{ padding: "10px" }}
        display="flex"
        flexDirection="column"
        gap="8px"
      >
        <Button
          variant="contained"
          size="large"
          color="error"
          href={registerSMS(service.title as string, registerSms)}
        >
          Đăng kí qua SMS
        </Button>
        <Button
          variant="contained"
          size="large"
          href={registerLink}
          target={"_blank"}
        >
          Đăng kí qua Link
        </Button>
      </Box>
    </WrapContainer>
  );
};

export default CardItem;
