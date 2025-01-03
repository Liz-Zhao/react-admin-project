import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { visuallyHidden } from "@mui/utils";
import { getOrdersAPI, updateOrderStatusAPI } from "../apis/apiRequest";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { formatDate } from "../utils/formatDate";
import dayjs from "dayjs";

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
        return "已完结";
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
    id: "totalMoney",
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

// sort
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Order() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [totals, setTotals] = React.useState(0);
  const [searchForm, setSearchForm] = React.useState({
    orderStatus: "",
    createdAt1: null,
    createdAt2: null,
  });

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("createdAt");

  const visibleRows = React.useMemo(
    () =>
      [...orders]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, orders],
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFinish = (id) => {
    updateOrderStatusAPI({ id, type: "finish" }).then((res) => {
      if (res.success) {
        // message.success('完结成功')
        setOrders(
          orders.map((item) =>
            item._id === id ? { ...item, status: "1" } : item
          )
        );
      }
    });
  };

  React.useEffect(() => {
    getOrdersAPI().then((res) => {
      setOrders(res.data.data);
      setTotals(res.data.totals);
    });
  }, []);

  const handleSearch = () => {
    const params = {
      status: searchForm.orderStatus,
      "createdAt[gte]": searchForm.createdAt1
        ? dayjs(searchForm.createdAt1).format("YYYY-MM-DD")
        : null,
      "createdAt[lte]": searchForm.createdAt2
        ? dayjs(searchForm.createdAt2).format("YYYY-MM-DD")
        : null,
    };
    // console.log(params);
    getOrdersAPI(params).then((res) => {
      setOrders(res.data.data);
      setTotals(res.data.totals);
    });
  };

  const handleReset = () => {
    setSearchForm({ orderStatus: "", createdAt1: null, createdAt2: null });
    getOrdersAPI().then((res) => {
      setOrders(res.data.data);
      setTotals(res.data.totals);
    });
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          color: "text.primary",
          fontWeight: "bold",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        订单管理
      </Typography>
      <Box sx={{ marginBottom: 3, display: "flex", alignItems: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="orderStatus">订单状态</InputLabel>
          <Select
            labelId="orderStatus"
            id="orderStatus"
            value={searchForm.orderStatus}
            label="orderStatus"
            onChange={() =>
              setSearchForm((prev) => ({
                ...prev,
                orderStatus: event.target.value,
              }))
            }
          >
            <MenuItem value={0}>进行中</MenuItem>
            <MenuItem value={1}>已完结</MenuItem>
            <MenuItem value={2}>取消完结</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="开始时间"
                value={searchForm.createdAt1}
                onChange={(newValue) =>
                  setSearchForm((prev) => ({ ...prev, createdAt1: newValue }))
                }
              />
              <DatePicker
                label="结束时间"
                value={searchForm.createdAt2}
                onChange={(newValue) =>
                  setSearchForm((prev) => ({ ...prev, createdAt2: newValue }))
                }
              />
            </Box>
          </LocalizationProvider>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={handleSearch}
        >
          查询
        </Button>
        <Button variant="outlined" color="primary" onClick={handleReset}>
          重置
        </Button>
      </Box>
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
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "action") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Button
                                onClick={() => navigate(`/order/${row._id}`)}
                              >
                                详情
                              </Button>
                              {row?.status == "0" && (
                                <Button onClick={() => handleFinish(row._id)}>
                                  手动完结
                                </Button>
                              )}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell></TableCell>
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
