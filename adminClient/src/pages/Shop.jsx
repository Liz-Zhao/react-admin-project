import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getShopsAPI } from "../apis/apiRequest";
import { useNavigate } from "react-router";

const columns = [
  { field: "title", headerName: "标题", width: 130 },
  { field: "shopcates", headerName: "类型", width: 130,valueGetter: (params) => params.map(item => item.title).join(',')},
  { field: "price", headerName: "价格", type: "number", width: 130 },
  { field: "stockNums", headerName: "库存", type: "number", width: 120 },
  { field: "status", headerName: "状态", width: 130, valueFormatter: (params) => 
  {
    if(params === '0'){
      return '未上架'
    }else if(params === '1'){
      return '上架'
    }else if(params === '2'){
      return '暂停销售'
    }
  }
   },
  {
    field: "actions",
    headerName: "操作",
    width: 120,
    type: "actions",
    getActions: (params) => [
      <GridActionsCellItem
        key={params}
        icon={<DeleteIcon />}
        label="Delete"
        // onClick={deleteUser(params.id)}
      />,
    ],
  },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function Shop() {
  const [shops, setShops] = useState([]);
  const navigate =useNavigate()

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    const res = await getShopsAPI();
    if (res.success) {
      const formattedData = res.data.data.map((item) => ({
        ...item,
        id: item._id,
      }));
      setShops(formattedData);
    }
  };

  const toAddPage = ()=>{
    navigate('/shop_add')
  }

  return (
    <>
      <h2>商品管理</h2>
      <Button variant="text" onClick={toAddPage}>新增</Button>

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={shops}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}
