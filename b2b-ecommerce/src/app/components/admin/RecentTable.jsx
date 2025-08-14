import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const RecentTable = ({ title, data, columns, type }) => {
    const theme = useTheme();

    const getStatusChipColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'published':
            case 'responded':
                return 'success';
            case 'pending':
            case 'draft':
                return 'warning';
            case 'inactive':
                return 'error';
            default:
                return 'default';
        }
    };

    const renderCellContent = (item, column) => {
        const value = item[column.key];

        if (column.key === 'thumbnail' && type === 'products') {
            return (
                <Avatar
                    src={value}
                    alt={item.name}
                    sx={{ width: 32, height: 32 }}
                >
                    {item.name?.charAt(0)}
                </Avatar>
            );
        }

        if (column.key === 'status') {
            return (
                <Chip
                    label={value}
                    size="small"
                    color={getStatusChipColor(value)}
                    variant="outlined"
                />
            );
        }

        if (column.key === 'name' && type === 'products') {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src={item.thumbnail}
                        alt={value}
                        sx={{ width: 32, height: 32 }}
                    >
                        {value?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {value}
                    </Typography>
                </Box>
            );
        }

        if (column.key === 'email') {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem'
                    }}
                >
                    {value}
                </Typography>
            );
        }

        if (column.key.toLowerCase().includes('date')) {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem'
                    }}
                >
                    {new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Typography>
            );
        }

        return (
            <Typography variant="body2">
                {value}
            </Typography>
        );
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

            <CardContent sx={{ pt: 0 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.secondary,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.slice(0, 5).map((item, index) => (
                                <TableRow
                                    key={item.id || index}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                        '&:last-child td': {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            sx={{
                                                py: 1.5,
                                                borderBottom: `1px solid ${theme.palette.divider}`
                                            }}
                                        >
                                            {renderCellContent(item, column)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {data.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            color: theme.palette.text.secondary
                        }}
                    >
                        <Typography variant="body2">
                            No data available
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentTable;