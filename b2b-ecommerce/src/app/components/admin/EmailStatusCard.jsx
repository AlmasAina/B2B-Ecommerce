import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    LinearProgress,
    Avatar,
    Divider,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Schedule as ScheduleIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const EmailStatusCard = ({ lastSent, recipients, deliveryRate }) => {
    const theme = useTheme();

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const { date, time } = formatDateTime(lastSent);

    return (
        <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardHeader
                title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Email Notifications
                    </Typography>
                }
                action={
                    <IconButton size="small">
                        <MoreVertIcon />
                    </IconButton>
                }
                avatar={
                    <EmailIcon color="primary" />
                }
                sx={{ pb: 1 }}
            />

            <CardContent sx={{ pt: 0 }}>
                {/* Last Sent Section */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                            sx={{
                                backgroundColor: theme.palette.info.light,
                                color: theme.palette.info.main,
                                width: 32,
                                height: 32,
                                mr: 2
                            }}
                        >
                            <ScheduleIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Last Sent
                        </Typography>
                    </Box>

                    <Box sx={{ ml: 5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {time}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Recipients Section */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                            sx={{
                                backgroundColor: theme.palette.success.light,
                                color: theme.palette.success.main,
                                width: 32,
                                height: 32,
                                mr: 2
                            }}
                        >
                            <PeopleIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Recipients
                        </Typography>
                    </Box>

                    <Box sx={{ ml: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {recipients.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total subscribers
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Delivery Rate Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                                width: 32,
                                height: 32,
                                mr: 2
                            }}
                        >
                            <TrendingUpIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Delivery Rate
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                                {deliveryRate}%
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ ml: 5 }}>
                        <LinearProgress
                            variant="determinate"
                            value={deliveryRate}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: theme.palette.grey[200],
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: theme.palette.success.main,
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Delivered: {Math.round((recipients * deliveryRate) / 100)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Failed: {recipients - Math.round((recipients * deliveryRate) / 100)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EmailStatusCard;