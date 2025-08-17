import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Container,
    useTheme,
    useMediaQuery,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Inventory as ProductsIcon,
    QuestionAnswer as InquiriesIcon,
    Analytics as AnalyticsIcon,
    People as UsersIcon,
    Article as BlogIcon,
    AccountCircle
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Import custom components
import SEOHead from '../product/SEOHead';
import StatsCard from '../../components/admin/StatsCard';
import RecentTable from '../../components/admin/RecentTable';
import ChartCard from '../../components/admin/ChartCard';
import EmailStatusCard from '../../components/admin/EmailStatusCard';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
        [theme.breakpoints.down('md')]: {
            marginLeft: 0,
        },
    }),
);

const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 0,
    },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const AdminDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    // Responsive drawer behavior
    useEffect(() => {
        if (isMobile) {
            setDrawerOpen(false);
        } else {
            setDrawerOpen(true);
        }
    }, [isMobile]);

    // Dummy data
    const statsData = [
        {
            title: 'Total Products',
            value: '1,248',
            change: '+12%',
            changeType: 'positive',
            icon: <ProductsIcon />,
            color: 'primary'
        },
        {
            title: 'Customer Inquiries',
            value: '86',
            change: '+5%',
            changeType: 'positive',
            icon: <InquiriesIcon />,
            color: 'info'
        },
        {
            title: 'Registered Users',
            value: '2,341',
            change: '+18%',
            changeType: 'positive',
            icon: <UsersIcon />,
            color: 'success'
        },
        {
            title: 'Blog Posts',
            value: '142',
            change: '+3%',
            changeType: 'positive',
            icon: <BlogIcon />,
            color: 'warning'
        }
    ];

    const recentProducts = [
        {
            id: 1,
            name: 'Industrial Pump X200',
            category: 'Machinery',
            thumbnail: '/api/placeholder/40/40',
            dateAdded: '2024-01-15'
        },
        {
            id: 2,
            name: 'Steel Pipe 6" Diameter',
            category: 'Materials',
            thumbnail: '/api/placeholder/40/40',
            dateAdded: '2024-01-14'
        },
        {
            id: 3,
            name: 'Safety Helmet Pro',
            category: 'Safety Equipment',
            thumbnail: '/api/placeholder/40/40',
            dateAdded: '2024-01-13'
        },
        {
            id: 4,
            name: 'Hydraulic Jack 5T',
            category: 'Tools',
            thumbnail: '/api/placeholder/40/40',
            dateAdded: '2024-01-12'
        }
    ];

    const recentInquiries = [
        {
            id: 1,
            customerName: 'John Smith',
            productName: 'Industrial Pump X200',
            date: '2024-01-15',
            status: 'Pending'
        },
        {
            id: 2,
            customerName: 'ABC Manufacturing',
            productName: 'Steel Pipe Bundle',
            date: '2024-01-14',
            status: 'Responded'
        },
        {
            id: 3,
            customerName: 'Tech Solutions Ltd',
            productName: 'Safety Equipment Set',
            date: '2024-01-13',
            status: 'Pending'
        }
    ];

    const recentUsers = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            signupDate: '2024-01-15',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Mike Wilson',
            email: 'mike@business.com',
            signupDate: '2024-01-14',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Lisa Chen',
            email: 'lisa@enterprise.com',
            signupDate: '2024-01-13',
            status: 'Pending'
        }
    ];

    const recentBlogs = [
        {
            id: 1,
            title: 'Top 10 Industrial Equipment Trends for 2024',
            author: 'Admin',
            publishDate: '2024-01-15',
            status: 'Published'
        },
        {
            id: 2,
            title: 'Safety Compliance in Manufacturing',
            author: 'Admin',
            publishDate: '2024-01-12',
            status: 'Published'
        },
        {
            id: 3,
            title: 'Sustainable Industrial Solutions',
            author: 'Admin',
            publishDate: '2024-01-10',
            status: 'Draft'
        }
    ];

    const salesData = [
        { name: 'Industrial Pumps', value: 245 },
        { name: 'Steel Materials', value: 189 },
        { name: 'Safety Equipment', value: 156 },
        { name: 'Tools', value: 123 },
        { name: 'Machinery Parts', value: 98 }
    ];

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard', active: true },
        { text: 'Products', icon: <ProductsIcon />, path: '/admin/products' },
        { text: 'Inquiries', icon: <InquiriesIcon />, path: '/admin/inquiries' },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
        { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
        { text: 'Blog', icon: <BlogIcon />, path: '/admin/blogs' }
    ];

    const drawer = (
        <div>
            <DrawerHeader>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Admin Panel
                </Typography>
            </DrawerHeader>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            sx={{
                                backgroundColor: item.active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: item.active ? theme.palette.primary.main : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    color: item.active ? theme.palette.primary.main : 'inherit',
                                    '& .MuiListItemText-primary': {
                                        fontWeight: item.active ? 600 : 400
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <>
            <SEOHead
                title="Admin Dashboard - B2B eCommerce"
                description="Comprehensive admin dashboard for managing products, customers, and business analytics"
            />

            <Box sx={{ display: 'flex' }}>
                {/* App Bar */}
                <AppBarStyled position="fixed" open={drawerOpen && !isMobile}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Dashboard
                        </Typography>

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: 'flex' }}>
                            <IconButton size="large" color="inherit">
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <IconButton
                                size="large"
                                edge="end"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBarStyled>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
                    <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
                </Menu>

                {/* Navigation Drawer */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant={isMobile ? 'temporary' : 'persistent'}
                    anchor="left"
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                >
                    {drawer}
                </Drawer>

                {/* Main Content */}
                <Main open={drawerOpen && !isMobile}>
                    <DrawerHeader />

                    <Container maxWidth="xl" sx={{ mt: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            Dashboard Overview
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Stats Cards */}
                            {statsData.map((stat, index) => (
                                <Grid item xs={12} sm={6} lg={3} key={index}>
                                    <StatsCard {...stat} />
                                </Grid>
                            ))}

                            {/* Sales Analytics Chart */}
                            <Grid item xs={12} lg={8}>
                                <ChartCard
                                    title="Product Demand Analytics"
                                    data={salesData}
                                    type="bar"
                                />
                            </Grid>

                            {/* Email Notifications Status */}
                            <Grid item xs={12} lg={4}>
                                <EmailStatusCard
                                    lastSent="2024-01-15 14:30"
                                    recipients={456}
                                    deliveryRate={98.5}
                                />
                            </Grid>

                            {/* Recent Products */}
                            <Grid item xs={12} lg={6}>
                                <RecentTable
                                    title="Latest Products"
                                    data={recentProducts}
                                    columns={[
                                        { key: 'name', label: 'Product Name' },
                                        { key: 'category', label: 'Category' },
                                        { key: 'dateAdded', label: 'Date Added' }
                                    ]}
                                    type="products"
                                />
                            </Grid>

                            {/* Recent Inquiries */}
                            <Grid item xs={12} lg={6}>
                                <RecentTable
                                    title="Recent Customer Inquiries"
                                    data={recentInquiries}
                                    columns={[
                                        { key: 'customerName', label: 'Customer' },
                                        { key: 'productName', label: 'Product' },
                                        { key: 'date', label: 'Date' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    type="inquiries"
                                />
                            </Grid>

                            {/* Recent Users */}
                            <Grid item xs={12} lg={6}>
                                <RecentTable
                                    title="New User Registrations"
                                    data={recentUsers}
                                    columns={[
                                        { key: 'name', label: 'Name' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'signupDate', label: 'Signup Date' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    type="users"
                                />
                            </Grid>

                            {/* Recent Blog Posts */}
                            <Grid item xs={12} lg={6}>
                                <RecentTable
                                    title="Latest Blog Posts"
                                    data={recentBlogs}
                                    columns={[
                                        { key: 'title', label: 'Title' },
                                        { key: 'author', label: 'Author' },
                                        { key: 'publishDate', label: 'Date' },
                                        { key: 'status', label: 'Status' }
                                    ]}
                                    type="blogs"
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Main>
            </Box>
        </>
    );
};

export default AdminDashboard;