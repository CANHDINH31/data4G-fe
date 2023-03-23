import { Container, Typography, Box } from "@mui/material";
import styled from "styled-components";
import { Color, typeService } from "@/types";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./service.css";
import CardItem from "./CardItem";
import { findId } from "@/utils/helper";

const TitleService = styled(Typography)`
  color: ${Color.PRIMARY};
  margin-bottom: 40px;
  text-transform: uppercase;
`;

const settings: Settings = {
  autoplay: true,
  autoplaySpeed: 13000,
  dots: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  className: "slider-hover",
  infinite: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        autoplaySpeed: 3000,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false,
        dots: true,
        className: "slider-hover",
      },
    },
    {
      breakpoint: 900,
      settings: {
        autoplaySpeed: 3000,
        autoplay: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: false,
        dots: true,
        className: "slider-hover",
      },
    },
    {
      breakpoint: 600,
      settings: {
        autoplaySpeed: 3000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
        className: "slider-hover",
      },
    },
  ],
};

type Props = {
  title: string;
  listService: typeService[];
  listFavourite: string[];
  registerSms: string;
  registerLink: string;
  handleToggleFavourite: (id: string) => void;
};

const Service = ({
  title,
  listService,
  listFavourite,
  registerSms,
  registerLink,
  handleToggleFavourite,
}: Props) => {
  return (
    <Box mt={16}>
      <Container id={findId(title)}>
        <TitleService variant="h6">{title}</TitleService>
        <Slider {...settings}>
          {listService?.map((service: typeService) => (
            <CardItem
              key={service._id}
              service={service}
              isFavourite={listFavourite?.includes(service._id)}
              handleToggleFavourite={handleToggleFavourite}
              registerSms={registerSms}
              registerLink={registerLink}
            />
          ))}
        </Slider>
      </Container>
    </Box>
  );
};
export default Service;
