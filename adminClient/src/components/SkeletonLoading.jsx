import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoading = () => {
  return (
    <Box sx={{ width: 550, textAlign:'center', margin: 'auto', padding: 50}}>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" height={60} />
      <Skeleton animation="wave" height={60} />
      <Typography variant="h6" gutterBottom>
        Loading ... 
      </Typography>
    </Box>
  );
};

export default SkeletonLoading;
