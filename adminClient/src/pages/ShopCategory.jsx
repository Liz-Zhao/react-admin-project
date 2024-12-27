import { DataGrid,GridToolbarContainer,GridRowModes,GridRowEditStopReasons,GridActionsCellItem } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { addShopcateAPI, deleteShopcateAPI, getShopcatesAPI, updateShopcateAPI } from '../apis/apiRequest';


function EditToolbar(props) {
  const { setShopcates, setRowModesModel } = props;

  const handleClick = async() => {
    let index = 1;
    const res = await addShopcateAPI({title:'示例'+index++,description:'描述',status:'0'})
    if(res.success){
      const id = res?.data?._id;
      setShopcates((oldRows) => [
        ...oldRows,
        { ...res.data,id,isNew:true},
      ]);
      
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
      }));
    }
    
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        新增
      </Button>
    </GridToolbarContainer>
  );
}



const paginationModel = { page: 0, pageSize: 10 };


export default function ShopCategory() {
  const [shopcates, setShopcates] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

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
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
            key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={()=>handleCancelClick(id)}
              color="error"
            />,
          ];
        }
  
        return [
          <GridActionsCellItem
          key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={()=>handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
          key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={()=>handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    }
  ];

  useEffect(() => {
    getShopCategory();
  }, []);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate =async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const res = await updateShopcateAPI({
      id: updatedRow._id,
      title: updatedRow.title,
      description: updatedRow.description,
      status: updatedRow.status
    });

    if (res.success) {
      setShopcates(prevRows => 
        prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
      );
    }
    
    return updatedRow;
  };

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

  const handleEditClick = (id) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  
  const handleDeleteClick = async(id) => {
    const res = await deleteShopcateAPI(id);
    if(res.success){
      setShopcates(shopcates.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick=(id)=>{
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = shopcates.find((row) => row.id === id);
    if (editedRow.isNew) {
      setShopcates(shopcates.filter((row) => row.id !== id));
    }
  }
  

  return (
    <>
    <h2>商品类型管理</h2>
    <Paper sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={shopcates}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 20]}
        editMode="row"
        rowModesModel={rowModesModel}
        processRowUpdate={processRowUpdate}
        onRowModesModelChange={handleRowModesModelChange}
        onProcessRowUpdateError={(error) => {
          console.error('Error during row update:', error);
        }}
        onRowEditStop={handleRowEditStop}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setShopcates, setRowModesModel },
        }}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
    </>
    
  );
}
