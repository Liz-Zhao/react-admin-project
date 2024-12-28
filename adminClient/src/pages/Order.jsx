import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { getOrdersAPI } from "../apis/apiRequest";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { formatDate } from "../utils/formatDate";

// 列表列：订单编号，下单人姓名，下单时间，订单状态，订单总金额，订单总数量，操作（查看详情，完结，取消 ）
const columns = [
  {
    id: "user",
    label: "下单人姓名",
    minWidth: 80,
    align: "left",
    format: (value) => value.username,
  },
  {
    id: "createdAt",
    label: "下单时间",
    minWidth: 120,
    format: (value) => {
      return formatDate(value);
    },
  },
  {
    id: "status",
    label: "订单状态",
    minWidth: 130,
    align: "right",
    format: (value) => {
      if (value === "0") {
        return "进行中";
      } else if (value === "1") {
        return "已完成";
      } else if (value === "2") {
        return "已取消";
      }
    },
  },
  {
    id: "totalSolidNums",
    label: "订单总数量",
    minWidth: 100,
    align: "right",
  },
  {
    id: "actualPrice",
    label: "订单总金额",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "action",
    label: "",
    minWidth: 170,
    align: "center",
  },
];

export default function Order() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [orders, setOrders] = React.useState([]);
  const [totals, setTotals] = React.useState(0);

  React.useEffect(() => {
    getOrdersAPI().then((res) => {
      setOrders(res.data.data);
      setTotals(res.data.totals);
    });
  }, []);

  return (
    <>
    <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold", marginBottom:2, marginTop:2 }}>订单管理</Typography>
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                style={{ backgroundColor: "#f0f0f0" }}
              >
                订单信息
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                style={{ backgroundColor: "#f0f0f0" }}
              >
                用户信息
              </TableCell>
              <TableCell
                align="center"
                colSpan={1}
                style={{ backgroundColor: "#f0f0f0" }}
              >
                操作
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === "action") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button onClick={() => navigate(`/order/${row._id}`)}>查看详情</Button>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 10, 20]}
        component="div"
        count={totals}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
}
