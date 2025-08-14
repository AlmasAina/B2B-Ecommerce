import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StatsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
    const theme = useTheme();

    const getChangeColor = () => {
        if (changeType === 'positive') return theme.palette.success.main;
        if (changeType === 'negative') return theme.palette.error.main;
        return theme.palette.text.secondary;
    };

    const getBackgroundColor = () => {
        switch (color) {
            case 'primary':
                return theme.palette.primary.main;
            case 'info':
                return theme.palette.info.main;
            case 'success':
                return theme.palette.success.main;
            case 'warning':
                return theme.palette.warning.main;
            case 'error':
                return theme.palette.error.main;
            default:
                return theme.palette.primary.main;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
                boxShadow: theme.shadows[3],
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    transition: 'all 0.3s ease-in-out'
                },
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                        sx={{
                            backgroundColor: getBackgroundColor(),
                            width: 56,
                            height: 56,
                            '& svg': {
                                fontSize: '1.5rem'
                            }
                        }}
                    >
                        {icon}
                    </Avatar>

                    {change && (
                        <Chip
                            label={change}
                            size="small"
                            sx={{
                                backgroundColor: changeType === 'positive'
                                    ? theme.palette.success.light + '20'
                                    : theme.palette.error.light + '20',
                                color: getChangeColor(),
                                fontWeight: 600,
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                </Box>

                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: theme.palette.text.primary
                    }}
                >
                    {value}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}
                >
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatsCard;