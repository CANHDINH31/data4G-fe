import { useEffect, useState } from "react";
import Introduce from "@/components/home/Introduce";
import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import { getCategoryBySlug, getListCategory, getUserInfo } from "@/utils/api";
import { CategoryType, RootState } from "@/types";
import { useSelector } from "react-redux";
import {
  getInfoStruct,
  handleToggleFavourite,
  notification,
} from "@/utils/helper";
import PropagateLoader from "react-spinners/PropagateLoader";
import CardItem from "@/components/home/CardItem";
import { BsArrowUpCircle } from "react-icons/bs";
import * as Scroll from "react-scroll";
import { useParams } from "react-router-dom";

const Home = (): JSX.Element => {
  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
  let scroll = Scroll.animateScroll;

  const param = useParams();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [listFavourite, setListFavourite] = useState<string[]>([]);
  const [listCategory, setListCategory] = useState<CategoryType[]>([]);
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [offerCheck, setOfferCheck] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showToTop, setShowToTop] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.name) {
      const getListFavourite = async () => {
        try {
          const res = await getUserInfo(currentUser?._id);
          setListFavourite(res?.data?.listService);
        } catch (error) {
          notification("system");
        }
      };
      currentUser ? getListFavourite() : setListFavourite([]);
    }
  }, [currentUser]);

  useEffect(() => {
    const getListCategory = async () => {
      try {
        const res = await getCategoryBySlug(param?.slug as string);
        setListCategory(res.data);
      } catch (error) {
        notification("system");
      }
    };
    getListCategory();
  }, [param]);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const res = await getListCategory();
        const categoryList = res.data;
        setListCategory(categoryList);
      } catch (error) {
        notification("system");
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, [currentUser]);

  useEffect(() => {
    getInfoStruct(setRegisterSms, setRegisterLink, setOfferCheck);
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
      {/* Loading data */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={"100%"}
      >
        <PropagateLoader color={"#EE0033"} loading={isLoading} size={10} />
      </Box>

      {!isLoading && (
        <Box>
          <Introduce offerCheck={offerCheck} />
          <Grid container spacing={2} mt={4}>
            {listCategory?.map((category: CategoryType) => {
              return category?.listService?.map(service => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={service._id}>
                  <CardItem
                    service={service}
                    isFavourite={listFavourite?.includes(service._id as string)}
                    handleToggleFavourite={() =>
                      handleToggleFavourite(
                        service._id as string,
                        currentUser,
                        listFavourite,
                        setListFavourite
                      )
                    }
                    registerSms={registerSms}
                    registerLink={registerLink}
                  />
                </Grid>
              ));
            })}
          </Grid>
        </Box>
      )}

      {/* Press To Top */}
      {isAboveMediumScreens && showToTop && (
        <Box
          position="fixed"
          bottom="80px"
          right="0px"
          component="a"
          onClick={() => scroll.scrollToTop()}
          sx={{ cursor: "pointer" }}
          padding={3}
        >
          <BsArrowUpCircle fontSize={40} />
        </Box>
      )}
    </Container>
  );
};

export default Home;
