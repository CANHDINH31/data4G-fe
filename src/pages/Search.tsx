import CardItem from "@/components/home/CardItem";
import { RootState, typeCategory, typeService } from "@/types";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyboardEvent } from "react";
import NoResult from "@/assets/image/no.png";
import { BiSearch } from "react-icons/bi";
import {
  getInfoStruct,
  handleToggleFavourite,
  notification,
} from "@/utils/helper";
import { getStructre, searchService, toggleFavourite } from "@/utils/api/api";
import { useSelector } from "react-redux";

const Search = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const searchParams = new URLSearchParams(location.search);
  const paramValue = searchParams.get("key");

  const [searchParam, setSearchParam] = useState<string>("");
  const [listResult, setListResult] = useState<typeService[]>([]);
  const [listFavourite, setListFavourite] = useState<string[]>([]);
  const [registerSms, setRegisterSms] = useState<string>("");
  const [registerLink, setRegisterLink] = useState<string>("");

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    searchParam && navigate("/search?key=" + searchParam);
    !searchParam && notification("warn", "Nhập từ khóa để tìm kiếm dịch vụ");
  };

  useEffect(() => {
    getInfoStruct(setRegisterSms, setRegisterLink);
  }, []);

  useEffect(() => {
    const getResultSearch = async () => {
      try {
        const res = await searchService(paramValue as string);
        setListResult(res.data);
      } catch (error) {
        notification("system");
      }
    };
    paramValue && getResultSearch();
    paramValue && setSearchParam(paramValue);
    window.scrollTo(0, 0);
  }, [paramValue]);

  return (
    <Container>
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
                    handleToggleFavourite={() =>
                      handleToggleFavourite(
                        service._id,
                        currentUser,
                        listFavourite,
                        setListFavourite
                      )
                    }
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
    </Container>
  );
};

export default Search;
