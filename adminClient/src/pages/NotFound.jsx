import { Box } from '@mui/material'
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react'

const NotFound = () => {
  return (
    <Box component="section" sx={{ p: 2, textAlign:'center',display: 'flex',flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100vh'  }}>
      <Typography gutterBottom>
        该资源不存在
      </Typography>
      
      <Link href="/">去首页</Link>
    </Box>
  )
}

export default NotFound
