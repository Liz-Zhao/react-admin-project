import { Box,Button,Dialog,DialogContent,DialogTitle,List,ListItem,ListItemButton,ListItemText,Paper, TextField, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { addUserWithRoleAPI, getRoleUsers, getUsersAPI, removeUserWithRoleAPI } from '../apis/apiRequest';

const AddUserDialog =({ open,onClose,onAddUser })=>{
    const [formData, setFormData] = React.useState({username: '',});
    const [searchItems, setSearchItems] = React.useState([]);


    const handleSearchUsers =async()=>{
        const res = await getUsersAPI({'username[regex]':formData.username})
        if(res.success){
            setSearchItems(res.data)
        }
    }

    const handleAddUser =(id)=>{
        onAddUser(id)
    }
    
    return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>新增用户</DialogTitle>
      <DialogContent >
        <Box sx={{display:'flex',textAlign:'center'}}>
        <TextField
          margin="dense"
          name="title"
          label="名称"
          variant="outlined"
          value={formData.username}
          onChange={(e)=> setFormData({username:e.target.value})}
          required
        />
        <Button variant="text" startIcon={<AddIcon /> } onClick={handleSearchUsers}>搜索用户</Button>
        </Box>
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {searchItems.map((value,index) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                <ListItem
                    key={index}
                    secondaryAction={
                        <AddIcon color="primary" />
                    }
                    disablePadding
                >
                    <ListItemButton onClick={()=>handleAddUser(value._id)}>
                    
                    <ListItemText id={labelId} primary={value.username} />
                    </ListItemButton>
                </ListItem>
                );
            })}
        </List> 
      </DialogContent>
      
    </Dialog>
    )
}

const ConnectUser = () => {
    let {id} = useParams()

    const columns = [
    { field: "username", headerName: "用户名称", width: 130 },
    { field: "email", headerName: "用户邮箱", width: 220},
    { field: "role", headerName: "角色名称", width: 180,valueGetter: (params) => params.roleName},
    {
        field: "actions",
        headerName: "操作",
        width: 220,
        type: "actions",
        getActions: (params) => [
        <GridActionsCellItem
            key={`delete-${params.id}`}
            icon={<LinkOffIcon color="error" />}
            label="取消关联"
            onClick={()=>handleDisconnectUser(params.id)}
        />,
        
        ],
    },
    ];

    const [rows, setRows] = React.useState([])
    const [totalRows, setTotalsRows] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    const getRows = async(page, pageSize)=>{
        const res = await getRoleUsers(id, {page:page+1, limit:pageSize});
        if(res.success){
            const formattedData = res.data.data.map((item) => ({
                ...item,
                id: item._id,
            }));
            setRows(formattedData)
            setTotalsRows(res.data.totals)
        }
    }

    const handleAddUser = async(userId)=>{
        const res = await addUserWithRoleAPI({roleId:id, userId})
        if(res.success){
            setRows(prev=> [{...res.data, id:res.data._id}, ...prev])
            setTotalsRows(prev=> prev+1)
        }
    }

    const handleDisconnectUser = async(userId)=>{
        const res = await removeUserWithRoleAPI({roleId:id, userId})
        if(res.success){
            setRows(prev => prev.filter((row)=> row.id !== userId))
            setTotalsRows(prev=> prev-1)
        }
    }

    useEffect(()=>{
        getRows(paginationModel.page, paginationModel.pageSize)
    },[paginationModel])

      
  return (
    <>
    <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold", marginBottom:2, marginTop:2 }}>关联用户</Typography>
    <Button variant="text" startIcon={<AddIcon />} onClick={()=> setOpen(true)} >新增用户</Button>
    <AddUserDialog open={open} onClose={()=> setOpen(false)} onAddUser={handleAddUser}/>
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

export default ConnectUser
