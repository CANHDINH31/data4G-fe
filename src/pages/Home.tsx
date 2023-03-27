import { useEffect, useState } from "react";
import Introduce from "@/components/home/Introduce";
import Service from "@/components/home/Service";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  getListCategory,
  getStructre,
  getUserInfo,
  searchService,
  toggleFavourite,
} from "@/utils/api/api";
import { RootState, typeCategory, typeService } from "@/types";
import { useSelector } from "react-redux";
import { notification } from "@/utils/helper";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useLocation, useNavigate } from "react-router-dom";
import CardItem from "@/components/home/CardItem";
import { BiSearch } from "react-icons/bi";
import { BsArrowUpCircle } from "react-icons/bs";
import { KeyboardEvent } from "react";
import NoResult from "@/assets/image/no.png";
import * as Scroll from "react-scroll";

const Home = (): JSX.Element => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramValue = searchParams.get("key");

  const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");

  let scroll = Scroll.animateScroll;

  const navigate = useNavigate();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [listFavourite, setListFavourite] = useState<string[]>([]);
  const [listCategory, setListCategory] = useState<typeCategory[]>([]);
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [offerCheck, setOfferCheck] = useState<string>("");

  const [searchParam, setSearchParam] = useState<string>("");
  const [listResult, setListResult] = useState<typeService[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showToTop, setShowToTop] = useState<boolean>(false);

  const handleToggleFavourite = async (id: string) => {
    if (!currentUser?.name)
      return notification("warn", "Đăng nhập để sử dụng tính năng");
    try {
      const res = await toggleFavourite({
        idUser: currentUser._id,
        idService: id,
      });
      const isExist = listFavourite.includes(id);
      if (isExist) {
        const newListFavourite = listFavourite.filter(
          element => element !== id
        );
        setListFavourite(newListFavourite);
        notification("success", "Đã xóa khỏi danh mục yêu thích");
      } else {
        setListFavourite([id, ...listFavourite]);
        notification("success", "Đã thêm vào danh mục yêu thích");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    searchParam && navigate("/?key=" + searchParam);
    !searchParam && notification("warn", "Nhập từ khóa để tìm kiếm dịch vụ");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
    const getResultSearch = async () => {
      setIsLoading(true);
      try {
        const res = await searchService(paramValue as string);
        setListResult(res.data);
      } catch (error) {
        notification("system");
      }
      setIsLoading(false);
    };
    paramValue && getResultSearch();
    paramValue && setSearchParam(paramValue);
    window.scrollTo(0, 0);
  }, [paramValue]);

  useEffect(() => {
    const getInfoStruct = async () => {
      try {
        const res = (await getStructre()) as {
          data: {
            data: {
              registerSms: string;
              registerLink: string;
              offerCheck: string;
            };
          };
        };
        setRegisterSms(res.data.data.registerSms);
        setRegisterLink(res.data.data.registerLink);
        setOfferCheck(res.data.data.offerCheck);
      } catch (error) {
        notification("system");
      }
    };
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    getInfoStruct();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
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
          {!paramValue ? (
            <>
              <Introduce offerCheck={offerCheck} />
              {listCategory?.map((category: typeCategory) => (
                <Service
                  key={category._id}
                  title={category.title}
                  listService={category.listService}
                  listFavourite={listFavourite}
                  handleToggleFavourite={handleToggleFavourite}
                  registerSms={registerSms}
                  registerLink={registerLink}
                />
              ))}
            </>
          ) : (
            <Stack>
              <Box>
                <Typography variant="h5">{`KẾT QUẢ TÌM KIẾM (${listResult?.length})`}</Typography>
                <Grid container spacing={2} mt={2}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      placeholder="Tìm kiếm"
                      size="small"
                      fullWidth
                      value={searchParam}
                      onChange={e => setSearchParam(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BiSearch />
                          </InputAdornment>
                        ),
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={handleSearch}
                    >
                      Tìm kiếm
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <Box mt={4}>
                {listResult?.length > 0 ? (
                  <Grid container spacing={2}>
                    {listResult?.map(service => (
                      <Grid item lg={3} md={4} sm={6} xs={12} key={service._id}>
                        <CardItem
                          service={service}
                          isFavourite={listFavourite?.includes(service._id)}
                          handleToggleFavourite={handleToggleFavourite}
                          registerSms={registerSms}
                          registerLink={registerLink}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    mt={10}
                    gap={4}
                  >
                    <img src={NoResult} />
                    <Typography variant="subtitle2">
                      {`Không có kết quả tim kiếm "${paramValue}"`}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </Box>
      )}
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
