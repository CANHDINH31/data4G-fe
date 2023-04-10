import { Color } from "@/types";
import styled from "styled-components";
import { GiPositionMarker } from "react-icons/gi";
import { BsFillTelephoneFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { getStructre } from "@/utils/api";
import { notification } from "@/utils/helper";
import { Link } from "react-router-dom";

const WrapFooter = styled.div`
  background-color: ${Color.PRIMARY};
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 30px 0;
  @media (max-width: 1060px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.1px;
  font-weight: normal;
  cursor: pointer;
  svg {
    margin-right: 4px;
  }
`;

const RightContent = styled(LeftContent)``;

const BottomFooter = (): JSX.Element => {
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
    <WrapFooter>
      <LeftContent>
        <GiPositionMarker />
        <span>
          Trụ sở: Số 1 Giang Văn Minh, P Kim Mã, Q Ba Đình, TP Hà Nội.
        </span>
      </LeftContent>
      <RightContent>
        <BsFillTelephoneFill />
        <a
          href={`tel:${takeCareGuest}`}
          style={{ color: "white" }}
        >{`Chăm sóc khách hàng: ${takeCareGuest}`}</a>
      </RightContent>
    </WrapFooter>
  );
};

export default BottomFooter;
