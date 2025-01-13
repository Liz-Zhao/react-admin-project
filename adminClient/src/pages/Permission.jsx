import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";
import { getRolesAPI } from "../apis/apiRequest";


const Permission = () => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0)
  const navigate =useNavigate()

  const columns = [
    { field: "roleName", headerName: "角色名称", width: 130 },
    { field: "description", headerName: "角色描述", width: 180},
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
          onClick={()=>navigate(`/permission/${params.id}`)}
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon color="error" />}
          label="删除"
        />
       
      ],
    },
  ];

  useEffect(()=>{
    getRoles(paginationModel.page, paginationModel.pageSize)
  },[paginationModel])

  const getRoles = async(page, pageSize)=>{
    const res = await getRolesAPI({page:page+1, limit:pageSize});
    if (res.success) {
      const formattedData = res.data.data.map((item) => ({
        ...item,
        id: item._id,
      }));
      setRows(formattedData);
      setTotalRows(res.data.totals)
    }
  }


  return (
    <>
    <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold", marginBottom:2, marginTop:2 }}>权限管理</Typography>
      <Button variant="text" startIcon={<AddIcon />} onClick={()=>navigate('/permission_add')}>新增</Button>
      {/* <ConfirmModal open={open} onClose={()=>{setOpen(false)}} onConfirm={deleteShop} /> */}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalRows}
          paginationModel={paginationModel}
          pageSizeOptions={[5,10, 20]}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  )
}

export default Permission
