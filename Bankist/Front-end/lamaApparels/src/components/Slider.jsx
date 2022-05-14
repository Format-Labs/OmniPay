import { useState } from "react";
import styled from "styled-components";

import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import {sliderItems } from "../data"

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff7f7;
  color: hotpink;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  cursor: pointer;
  opacity: 0.5;
  margin: auto;
  z-index: 2;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transform: translateX(00vw);
`;
const Slide = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
`;
const ImgContainer = styled.div`
  flex: 1;
  height: 100%;
`;
const Image = styled.img`
  height: 80%;
`;
const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;
`;

const Title = styled.h1`
  font-size: 70px;
`;
const Desc = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3;
`;
const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
  border-radius: 5px;
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const handleClick = (direction) => {
    console.log(direction);
  };
  return (
    <Container>
      <Arrow direction="left" onClick={() => handleClick("left")}>
        <ArrowLeftOutlinedIcon />
      </Arrow>
      <Wrapper>
        <Slide bg="f5fafd">
          <ImgContainer>
            <Image src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBzaG9wcGluZ3xlbnwwfHwwfHw%3D&w=1000&q=80" />
          </ImgContainer>
          <InfoContainer>
            <Title>SPRING SALE! </Title>
            <Desc>
              DON'T COMPROMISE ON STYLE! GET FLAT 40% OFF NEW ARRIVALS TODAY!
            </Desc>
            <Button>Buy Now</Button>
          </InfoContainer>
        </Slide>
        <Slide bg="f5f1ed">
          <ImgContainer>
            <Image src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBzaG9wcGluZ3xlbnwwfHwwfHw%3D&w=1000&q=80" />
          </ImgContainer>
          <InfoContainer>
            <Title>POPULAR TODAY! </Title>
            <Desc>GET WHAT OTHERS LIKE AND GET 50% OFF!</Desc>
            <Button>Buy Now</Button>
          </InfoContainer>
        </Slide>
        <Slide bg="f5f0f4">
          <ImgContainer>
            <Image src="https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW4lMjBzaG9wcGluZ3xlbnwwfHwwfHw%3D&w=1000&q=80" />
          </ImgContainer>
          <InfoContainer>
            <Title>AMAZING PRICES </Title>
            <Desc>
              SPEND MORE THAN 1000 AND GET A CHANCE TO WIN A TRIP TO BALI!
            </Desc>
            <Button>Buy Now</Button>
          </InfoContainer>
        </Slide>
      </Wrapper>
      <Arrow direction="right" onClick={() => handleClick("right")}>
        <ArrowRightOutlinedIcon />
      </Arrow>
    </Container>
  );
};
//  <Title>AMAZING PRICES</Title>
// <Desc> SPEND MORE THAN 1000 AND GET A CHANCE TO WIN A TRIP TO BALI! <Desc></Desc>

export default Slider;
