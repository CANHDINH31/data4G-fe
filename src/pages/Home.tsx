import { useEffect, useState } from "react";
import Introduce from "@/components/home/Introduce";
import Service from "@/components/home/Service";
import { Box, Container } from "@mui/material";
import {
  getListCategory,
  getStructre,
  getUserInfo,
  toggleFavourite,
} from "@/utils/api/api";
import { RootState, typeCategory } from "@/types";
import { useSelector } from "react-redux";
import { notification } from "@/utils/helper";
import PropagateLoader from "react-spinners/PropagateLoader";

const Home = (): JSX.Element => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [listFavourite, setListFavourite] = useState<string[]>([]);
  const [listCategory, setListCategory] = useState<typeCategory[]>([]);
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");
  const [offerCheck, setOfferCheck] = useState<string>("");

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
      try {
        const res = await getListCategory();
        const categoryList = res.data;
        setListCategory(categoryList);
      } catch (error) {
        notification("system");
      }
    };
    fetchCategory();
  }, [currentUser]);

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
    getInfoStruct();
  }, []);

  return (
    <Container>
      {listCategory?.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={"100%"}
        >
          <PropagateLoader color={"#EE0033"} loading={true} size={10} />
        </Box>
      ) : (
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
      )}
    </Container>
  );
};

export default Home;
