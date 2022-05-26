import React from "react";
import { useState, useContext } from "react";
import Modal from "./Modal";
import { Typography, Button, Divider } from "@material-ui/core";
import { TransactionContext } from "../../context/Gcontext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Review from "./Review";

const PaymentForm = ({
  checkoutToken,
  nextStep,
  backStep,
  shippingData,
  onCaptureCheckout,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { confirmed, setIsConfirmed, isLoading } =
    useContext(TransactionContext);

  const handleSubmit = async () => {
    if (!confirmed) return;

    const orderData = {
      line_items: checkoutToken.live.line_items,
      customer: {
        firstname: shippingData.firstName,
        lastname: shippingData.lastName,
        email: shippingData.email,
      },
      shipping: {
        name: "International",
        street: shippingData.address1,
        town_city: shippingData.city,
        county_state: shippingData.shippingSubdivision,
        postal_zip_code: shippingData.zip,
        country: shippingData.shippingCountry,
      },
      fulfillment: { shipping_method: shippingData.shippingOption },
      payment: {
        gateway: "manual",
        manual: {
          id: "gway_Mo1p2z129OR1wN",
        },
      },
    };

    onCaptureCheckout(checkoutToken.id, orderData);

    nextStep();
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment method
      </Typography>
      {/* Create a blue button */}
      <div
        // center the button
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <Button
          onClick={() => {
            setOpenModal(true);
            setIsConfirmed(false);
          }}
          variant="contained"
          style={{
            fontSize: "16px",
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgb(0, 122, 255)",
            borderRadius: "10px",
            margin: "0.5rem",
            outline: "none",
            cursor: "pointer",
            borderColor: "transparent",
          }}
        >
          Pay With Crypto
        </Button>
      </div>
      {openModal && !confirmed && (
        <Modal amount={checkoutToken.live.subtotal.raw} />
      )}
      {/* Submit button */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {confirmed && (
        <div
          // center the button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <Button
            onClick={() => handleSubmit()}
            variant="contained"
            style={{
              alignSelf: "center",
              fontSize: "20px",
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "rgb(0, 122, 255)",
              borderRadius: "10px",
              margin: "0.5rem",
              outline: "none",
              cursor: "pointer",
              borderColor: "transparent",
            }}
          >
            Submit
          </Button>
        </div>
      )}
    </>
  );
};

export default PaymentForm;
