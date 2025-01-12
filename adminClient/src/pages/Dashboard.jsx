import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import { LineChart } from "@mui/x-charts/LineChart";

const cardData = [
  {
    title: "总收入",
    value: "12,361",
    increase: "+24%",
    icon: <EmailIcon />,
    color: "#4CAF50",
  },
  {
    title: "总订单",
    value: "431,225",
    increase: "+21%",
    icon: <ShoppingCartIcon />,
    color: "#2196F3",
  },
  {
    title: "收益额",
    value: "32,441",
    increase: "+27%",
    icon: <TrafficIcon />,
    color: "#9C27B0",
  },
  {
    title: "用户数",
    value: "1,325,134",
    increase: "+43%",
    icon: <PersonAddIcon />,
    color: "#00BCD4",
  },
];

const orderData = [
  { id: 1, name: "订单1", date: "2024-01-01", amount: "100" },
  { id: 2, name: "订单2", date: "2024-01-02", amount: "200" },
  { id: 3, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 4, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 5, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 6, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 7, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 8, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 9, name: "订单3", date: "2024-01-03", amount: "300" },
  { id: 10, name: "订单3", date: "2024-01-03", amount: "300" },
];

const Dashboard = () => {
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 3,
            mb: 3,
          }}
        >
          {cardData.map((card, index) => (
            <Card key={index} sx={{ minWidth: 200 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                    <Box sx={{ color: card.color }}>{card.icon}</Box>
                  </Box>
                  <Typography variant="box2" color="success.main">
                    {card.increase}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* two row */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3 }}>
          {/* 折线图 */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              每日收入
            </Typography>
            <LineChart
              xAxis={[{ scaleType: "point", data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                { data: [2, 5.5, 2, 8.5, 1.5, 5], label: "收入" },
                { data: [1, 5, 2, 9.5, 15, 6], label: "订单" },
              ]}
              width={800}
              height={400}
            />
          </Paper>

          {/* 订单列表 */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              近期订单
            </Typography>
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {orderData.map((order) => (
                <ListItem key={order.id} divider sx={{ display: "flex", width: "100%" ,flexDirection: "column", alignItems: "flex-start"}}>
                  <ListItemText primary={order.name} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography component="span" variant="body2">
                      {order.date}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="success.main"
                    >
                      ¥{order.amount}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
