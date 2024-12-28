import React from "react";
import { useParams } from "react-router";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getOrderAPI } from "../apis/apiRequest";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { formatDate } from "../utils/formatDate";

const steps = ["已下单", "进行中", "已完结 & 取消完结"];

const OrderDetial = () => {
  let { id } = useParams();
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    getOrderAPI(id).then((res) => {
      setOrder(res.data);
    });
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          用户信息
        </Typography>
        <Box component="section" sx={{ p: 2, border: "1px dashed grey", display:"flex", flexDirection:"column",gap:2 }}>
          <div>
          <Typography component="span" sx={{ color: "text.primary" }}>用户名称：</Typography>
          <span>{order?.user?.username}</span>
          </div>
          <div>
            <Typography component="span" sx={{ color: "text.primary" }}>下单时间：</Typography>
            <span>{formatDate(order?.createdAt)}</span>
          </div>
        </Box>
      </Box>

      <Box sx={{ width: "100%", marginBottom: 2 }}>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          订单进度
        </Typography>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        商品列表
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>商品编号</TableCell>
              <TableCell>商品名称</TableCell>
              <TableCell align="left">商品信息</TableCell>
              <TableCell align="right">单价</TableCell>
              <TableCell align="right">数量</TableCell>
              <TableCell align="right">总价</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.shops.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.shopID}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.shopTitle}
                </TableCell>
                <TableCell align="left">{row.details}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.solidNums}</TableCell>
                <TableCell align="right">{row.totalPrice}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={5} />
              <TableCell colSpan={3}>总数量</TableCell>
              <TableCell align="right">{order?.totalSolidNums}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>总价格</TableCell>
              <TableCell align="right">{order?.actualPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderDetial;
