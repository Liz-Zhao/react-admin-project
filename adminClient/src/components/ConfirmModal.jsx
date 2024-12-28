import { Modal, Box, Typography, Button } from "@mui/material";
const ConfirmModal = ({open, onClose, onConfirm}) => {
    
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-modal"
      aria-describedby="confirm-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="confirm-modal-description" sx={{ mb: 3 }}>
          确定要删除这条记录吗？
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            取消
          </Button>
          <Button onClick={() => {
            onConfirm();
            onClose();
          }} variant="contained" color="error">
            确定
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal
