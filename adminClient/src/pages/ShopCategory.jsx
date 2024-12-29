import { DataGrid,GridRowModes,GridActionsCellItem } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useEffect, useState } from 'react';
import { addShopcateAPI, deleteShopcateAPI, getShopcatesAPI, updateShopcateAPI } from '../apis/apiRequest';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import ConfirmModal from '../components/ConfirmModal';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const AddDialog = ({ edit, open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '0'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      status: '0'
    });
  };

  useEffect(()=>{
    if(edit){
      setFormData({
      title: edit.title,
      description: edit.description,
      status: edit.status
    });
  }
  },[edit]);
  

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>{edit ? '编辑' : '新增'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="title"
          label="名称"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="description"
          label="描述"
          fullWidth
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
        />
        <FormControl margin="dense">
          <RadioGroup
            row
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <FormControlLabel value="0" control={<Radio />} label="禁用" />
            <FormControlLabel value="1" control={<Radio />} label="启用" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">确定</Button>
      </DialogActions>
    </Dialog>
  );
};


const paginationModel = { page: 0, pageSize: 10 };


export default function ShopCategory() {
  const [shopcates, setShopcates] = useState([]);
  const [open, setOpen] = useState(false);
  const [deletedOpen, setDeletedOpen] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [editRow,setEditRow] = useState(null);

  const columns = [
    { field: 'title', headerName: '名称', width: 130, editable: true, },
    { field: 'description', headerName: '描述', width: 130,editable: true },
    {
      field: 'status',headerName: '状态', width: 130,editable: true,
      type:"singleSelect",
      valueOptions: [{label:"禁用", value:'0'}, {label:"启用", value:'1'}],
      valueFormatter: (params) => {
        return params === '0' ? '禁用' : '启用';
      }
    },
    {field: 'createdAt', headerName: '创建时间' ,type:'string', width: 200,
      valueGetter: (value) => {
        return new Date(value).toLocaleString();
      },
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 120,
      type: 'actions',
      getActions: (params) => {
        return [
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon color="primary" />}
            label="Edit"
            className="textPrimary"
            onClick={()=>{
              setRowId(params.id); 
              setOpen(true); 
              setEditRow(params.row);
            }}
          />,
          <GridActionsCellItem
            key={`delete-${params.id}`}
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={()=>{
              setRowId(params.id);
              setDeletedOpen(true);}}
          />,
        ];
      },
    }
  ];

  useEffect(() => {
    getShopCategory();
  }, []);


  const getShopCategory = async () => {
    const res = await getShopcatesAPI();
    if(res.success){
      const formattedData = res.data.data.map(item => ({
        ...item,
        id: item._id
      }));
      setShopcates(formattedData);
    }
  }


  const handleSubmit = async(formData)=>{
    if(editRow){  
      const res = await updateShopcateAPI({id:editRow._id,...formData});
      if(res.success){
        setShopcates(shopcates.map(item => item.id === editRow._id ? { ...item, ...formData } : item));
        setEditRow(null);
        setOpen(false);
      }
    }else{
      const res = await addShopcateAPI(formData);
      if(res.success){
        const formattedData = {
          ...res.data,
        id: res.data._id}
        setShopcates([formattedData,...shopcates]);
        setEditRow(null);
        setOpen(false);
      }else{
        toast.error(res.message);
      }
    }

  }

  const handleDelete = async()=>{
    const res = await deleteShopcateAPI(rowId);
    if(res.success){
      setShopcates(shopcates.filter((row) => row.id !== rowId));
      setDeletedOpen(false)
    }else{
      toast.error(res.message);
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold", marginBottom:2, marginTop:2 }}>商品类型管理</Typography>
      <Button color="primary" startIcon={<AddIcon />} onClick={()=>setOpen(true)}>
        新增
      </Button>
    <AddDialog edit={editRow} open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    <ConfirmModal open={deletedOpen} onClose={() => setDeletedOpen(false)} onConfirm={handleDelete} />
    <Paper sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={shopcates}
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
