import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Color, RootState } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, Tab, Tabs } from "@mui/material";
import ServiceManagement from "@/components/service/ServiceManagement";
import CategoryManagement from "@/components/service/CategoryManagement";
import StructureManagement from "@/components/service/StructureManagement";
import UserManagement from "@/components/service/UserManagement";

const Service = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue > 0) return navigate("/service/" + newValue);
    return navigate("/service");
  };

  useEffect(() => {
    const handleCheckAuth = (): void => {
      if (!currentUser?.isAdmin) {
        navigate("/");
      }
    };
    handleCheckAuth();
  }, []);

  useEffect(() => {
    id && setValue(Number(id));
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container sx={{ paddingBottom: 10 }}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        m={4}
        sx={{ color: `${Color.PRIMARY}` }}
      >
        <Typography variant="h4">Quản lý hệ thống</Typography>
      </Box>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Quản lý danh mục" />
            <Tab label="Quản lý dịch vụ" />
            <Tab label="Quản lý cú pháp" />
            <Tab label="Quản lý người dùng" />
          </Tabs>
        </Box>
        <Box mt={3}>
          {!value && <CategoryManagement />}
          {value == 1 && <ServiceManagement />}
          {value == 2 && <StructureManagement />}
          {value == 3 && <UserManagement />}
        </Box>
      </Box>
    </Container>
  );
};

export default Service;
