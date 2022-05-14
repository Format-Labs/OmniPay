import styled from "styled-components";

const Conatainer = styled.div`
  height: 30px;
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: 14px;
  font-weight: 500;
`;

const Anouncement = () => {
  return <Conatainer>Super Deal! Free shippingon Orders $ 50+</Conatainer>;
};

export default Anouncement;
