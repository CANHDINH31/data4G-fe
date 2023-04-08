import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NoResult from "@/assets/image/no.png";
import CardItem from "@/components/home/CardItem";
import { useSelector } from "react-redux";
import { RootState, typeService } from "@/types";
import { getInfoStruct, notification } from "@/utils/helper";
import { getUserInfo, toggleFavourite } from "@/utils/api/api";

const Like = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");

  const [listFavourite, setListFavourite] = useState<typeService[]>([]);

  const handleRemoveLike = async (id: string) => {
    try {
      await toggleFavourite({
        idUser: currentUser._id,
        idService: id,
      });

      const newListFavourite = listFavourite.filter(
        element => element._id !== id
      );
      setListFavourite(newListFavourite);
      notification("success", "Đã xóa khỏi danh mục yêu thích");
    } catch (error) {
      notification("system");
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
    window.scrollTo(0, 0);
    getInfoStruct(setRegisterSms, setRegisterLink);
  }, []);

  return (
    <Container>
      <Typography variant="h5">{`DANH MỤC YÊU THÍCH (${listFavourite?.length})`}</Typography>
      {listFavourite?.length > 0 ? (
        <Box mt={4}>
          <Grid container spacing={2}>
            {listFavourite?.map(service => (
              <Grid item lg={3} md={4} sm={6} xs={12} key={service._id}>
                <CardItem
                  service={service}
                  isFavourite={true}
                  handleToggleFavourite={handleRemoveLike}
                  registerSms={registerSms}
                  registerLink={registerLink}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
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
            {`Danh mục yêu thích đang trống`}
          </Typography>
          <Button variant="contained" color="error" size="small" href="/">
            Quay lại trang chủ
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Like;
