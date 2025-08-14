import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const ChartCard = ({ title, data, type = 'bar', height = 350 }) => {
    const theme = useTheme();

    const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.info.main
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        padding: theme.spacing(1, 2),
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3]
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Value: {payload[0].value}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                fill={theme.palette.primary.main}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={height}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={theme.palette.primary.main}
                                strokeWidth={3}
                                dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return (
                    <Box
                        sx={{
                            height: height,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.palette.text.secondary
                        }}
                    >
                        <Typography>Chart type not supported</Typography>
                    </Box>
                );
        }
    };

    return (
        <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardHeader
                title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                }
                action={
                    <IconButton size="small">
                        <MoreVertIcon />
                    </IconButton>
                }
                avatar={
                    <TrendingUpIcon color="primary" />
                }
                sx={{ pb: 1 }}
            />

            <CardContent sx={{ pt: 0, height: `calc(100% - 80px)` }}>
                {renderChart()}
            </CardContent>
        </Card>
    );
};

export default ChartCard;