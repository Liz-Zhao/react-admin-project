import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { deleteShopAPI, getShopsAPI, updateShopStatusAPI } from "../apis/apiRequest";
import { useNavigate } from "react-router";
import ConfirmModal from "../components/ConfirmModal";


const paginationModel = { page: 0, pageSize: 10 };

export default function Shop() {
  const columns = [
    { field: "title", headerName: "标题", width: 130 },
    { field: "shopcates", headerName: "类型", width: 180,valueGetter: (params) => params.map(item => item.title).join(',')},
    { field: "price", headerName: "价格", type: "number", width: 100 },
    { field: "stockNums", headerName: "库存", type: "number", width: 100 },
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
      width: 220,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem 
          key={`edit-${params.id}`}
          icon={<EditIcon color="primary" />}
          label="编辑"
          onClick={() => navigate(`/shop/${params.id}`)}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon color="error" />}
          label="删除"
          onClick={()=>{setOpen(true); setDeleteId(params.id)}}
        />,
        <GridActionsCellItem 
          key={`on-${params.id}`}
          icon={<span style={{color:'green'}}>{params.row.status === '1' ? '暂停销售' : '上架'}</span>}
          label="上架"
          onClick={() => onShop({id:params.id,status:params.row.status === '0' ? '1' : '2'})}
        />
      ],
    },
  ];
  
  const [shops, setShops] = useState([]);
  const navigate =useNavigate()
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


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

  const deleteShop = async()=>{
    const res = await deleteShopAPI(deleteId)
    if(res.success){
      getShops()
      setOpen(false)
    }
  }

  const onShop = async(params)=>{
    const res = await updateShopStatusAPI(params)
    if(res.success){
      getShops()
    }
  }


  return (
    <>
      <h2>商品管理</h2>
      <Button variant="text" startIcon={<AddIcon />} onClick={toAddPage}>新增</Button>
      <ConfirmModal open={open} onClose={()=>{setOpen(false)}} onConfirm={deleteShop} />

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
