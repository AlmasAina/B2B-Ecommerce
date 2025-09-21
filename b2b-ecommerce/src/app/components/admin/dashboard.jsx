// src/app/admin/dashboard.jsx
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
    ListItemButton,
    Alert,
    Snackbar,
    Button,
    Paper,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Pagination,
    Stack,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
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
    Settings as SettingsIcon,
    AccountCircle,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    FilterList as FilterIcon,
    Download as ExportIcon,
    Upload as ImportIcon,
    ContentCopy as DuplicateIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Import custom components
import SEOHead from '../product/SEOHead';
import StatsCard from '../admin/StatsCard';
import RecentTable from '../admin/RecentTable';
import ChartCard from '../admin/ChartCard';
import EmailStatusCard from '../admin/EmailStatusCard';
import WebsiteSettings from '../admin/WebsiteSettings';
import AddProductForm from '../admin/AddProductForm'; // Updated import to use the enhanced form
import BlogManagement from '../admin/BlogManagement';

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
    const [currentView, setCurrentView] = useState('dashboard');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Enhanced Product management state
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productFilters, setProductFilters] = useState({
        search: '',
        category: 'all',
        status: 'all',
        visibility: 'all'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [bulkActionDialog, setBulkActionDialog] = useState(false);
    const [bulkAction, setBulkAction] = useState('');
    const [productStats, setProductStats] = useState({
        total: 0,
        published: 0,
        draft: 0,
        lowStock: 0
    });

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        if (isMobile) {
            setDrawerOpen(false);
        } else {
            setDrawerOpen(true);
        }
    }, [isMobile]);

    // Enhanced product fetching with filters and pagination
    useEffect(() => {
        if (currentView === 'products') {
            fetchProducts();
        }
    }, [currentView, productFilters, pagination.page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(productFilters.search && { search: productFilters.search }),
                ...(productFilters.category !== 'all' && { category: productFilters.category }),
                ...(productFilters.status !== 'all' && { status: productFilters.status }),
                ...(productFilters.visibility !== 'all' && { visibility: productFilters.visibility })
            });

            const response = await fetch(`/api/products?${params}`);
            const data = await response.json();

            if (data.success) {
                setProducts(data.data?.products || []);
                setPagination(prev => ({
                    ...prev,
                    total: data.data?.pagination?.totalCount || 0,
                    totalPages: data.data?.pagination?.totalPages || 0
                }));

                // Update product stats
                setProductStats({
                    total: data.data?.pagination?.totalCount || 0,
                    published: data.data?.products?.filter(p => p.visibility === 'visible').length || 0,
                    draft: data.data?.products?.filter(p => p.visibility === 'draft').length || 0,
                    lowStock: data.data?.products?.filter(p => p.stock <= p.lowStockThreshold).length || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showSnackbar('Failed to fetch products', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle product actions
    const handleProductEdit = (productId) => {
        const product = products.find(p => p._id === productId);
        setEditingProduct(product);
        setCurrentView('editProduct');
    };

    const handleProductDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products?id=${productId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();

                if (data.success) {
                    showSnackbar('Product deleted successfully');
                    fetchProducts();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                showSnackbar('Failed to delete product', 'error');
            }
        }
    };

    const handleProductDuplicate = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            const duplicatedProduct = {
                ...product,
                title: `${product.title} (Copy)`,
                slug: `${product.slug}-copy-${Date.now()}`,
                sku: product.sku ? `${product.sku}-COPY` : undefined,
                visibility: 'draft'
            };
            delete duplicatedProduct._id;
            delete duplicatedProduct.createdAt;
            delete duplicatedProduct.updatedAt;

            setEditingProduct(duplicatedProduct);
            setCurrentView('addProduct');
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedProducts.length === 0) return;

        try {
            setLoading(true);
            // Implement bulk actions based on bulkAction value
            switch (bulkAction) {
                case 'delete':
                    await Promise.all(selectedProducts.map(id =>
                        fetch(`/api/products?id=${id}`, { method: 'DELETE' })
                    ));
                    showSnackbar(`${selectedProducts.length} products deleted`);
                    break;
                case 'publish':
                    await Promise.all(selectedProducts.map(id =>
                        fetch('/api/products', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ _id: id, visibility: 'visible' })
                        })
                    ));
                    showSnackbar(`${selectedProducts.length} products published`);
                    break;
                case 'draft':
                    await Promise.all(selectedProducts.map(id =>
                        fetch('/api/products', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ _id: id, visibility: 'draft' })
                        })
                    ));
                    showSnackbar(`${selectedProducts.length} products moved to draft`);
                    break;
            }

            fetchProducts();
            setSelectedProducts([]);
            setBulkActionDialog(false);
            setBulkAction('');
        } catch (error) {
            showSnackbar('Bulk action failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSaved = (savedProduct) => {
        showSnackbar('Product saved successfully!');
        setEditingProduct(null);
        setCurrentView('products');
        fetchProducts();
    };

    // Filter handlers
    const handleFilterChange = (field, value) => {
        setProductFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    const resetFilters = () => {
        setProductFilters({
            search: '',
            category: 'all',
            status: 'all',
            visibility: 'all'
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Dummy data for dashboard (keeping existing data)
    const statsData = [
        {
            title: 'Total Products',
            value: productStats.total.toString(),
            change: '+12%',
            changeType: 'positive',
            icon: <ProductsIcon />,
            color: 'primary'
        },
        {
            title: 'Published Products',
            value: productStats.published.toString(),
            change: '+8%',
            changeType: 'positive',
            icon: <ViewIcon />,
            color: 'success'
        },
        {
            title: 'Draft Products',
            value: productStats.draft.toString(),
            change: '+3%',
            changeType: 'positive',
            icon: <EditIcon />,
            color: 'warning'
        },
        {
            title: 'Low Stock Alerts',
            value: productStats.lowStock.toString(),
            change: '-2%',
            changeType: 'negative',
            icon: <ProductsIcon />,
            color: 'error'
        }
    ];

    // Keep existing dummy data for other sections
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
        { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
        { text: 'Products', icon: <ProductsIcon />, view: 'products' },
        { text: 'Add Product', icon: <AddIcon />, view: 'addProduct' },
        { text: 'Inquiries', icon: <InquiriesIcon />, view: 'inquiries' },
        { text: 'Analytics', icon: <AnalyticsIcon />, view: 'analytics' },
        { text: 'Users', icon: <UsersIcon />, view: 'users' },
        { text: 'Blog Management', icon: <BlogIcon />, view: 'blog' },
        { text: 'Website Settings', icon: <SettingsIcon />, view: 'websiteSettings' }
    ];

    const getCurrentViewTitle = () => {
        const currentMenuItem = menuItems.find(item => item.view === currentView);
        return currentMenuItem ? currentMenuItem.text : 'Dashboard';
    };

    // Enhanced Products Management View
    const ProductsManagementView = () => (
        <Box>
            {/* Products Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatsCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Filters and Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Products Management
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<ImportIcon />}
                            size="small"
                        >
                            Import
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ExportIcon />}
                            size="small"
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCurrentView('addProduct')}
                        >
                            Add Product
                        </Button>
                    </Stack>
                </Box>

                {/* Filters Row */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={productFilters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={productFilters.category}
                                label="Category"
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                <MenuItem value="surgical-instruments">Surgical Instruments</MenuItem>
                                <MenuItem value="medical-gloves">Medical Gloves</MenuItem>
                                <MenuItem value="beauty-tools">Beauty Tools</MenuItem>
                                <MenuItem value="leather-products">Leather Products</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={productFilters.status}
                                label="Status"
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="discontinued">Discontinued</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Visibility</InputLabel>
                            <Select
                                value={productFilters.visibility}
                                label="Visibility"
                                onChange={(e) => handleFilterChange('visibility', e.target.value)}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="visible">Published</MenuItem>
                                <MenuItem value="hidden">Hidden</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={resetFilters}
                                size="small"
                            >
                                Reset Filters
                            </Button>
                            {selectedProducts.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setBulkActionDialog(true)}
                                    size="small"
                                >
                                    Bulk Actions ({selectedProducts.length})
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Products Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.length === products.length && products.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts(products.map(p => p._id));
                                            } else {
                                                setSelectedProducts([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Visibility</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No products found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product._id} hover>
                                        <TableCell padding="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts(prev => [...prev, product._id]);
                                                    } else {
                                                        setSelectedProducts(prev => prev.filter(id => id !== product._id));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    src={product.media?.[0]?.url}
                                                    alt={product.title}
                                                    sx={{ width: 40, height: 40 }}
                                                >
                                                    {product.title?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {product.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        SKU: {product.sku || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {product.categories?.map(cat => (
                                                    <Chip key={cat} label={cat} size="small" variant="outlined" />
                                                )) || <Chip label="Uncategorized" size="small" />}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {product.currency} {product.salePrice || product.price}
                                                </Typography>
                                                {product.salePrice && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                                    >
                                                        {product.currency} {product.price}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.stock}
                                                size="small"
                                                color={product.stock <= product.lowStockThreshold ? 'error' : 'success'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.status}
                                                size="small"
                                                color={product.status === 'active' ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={product.visibility}
                                                size="small"
                                                color={
                                                    product.visibility === 'visible' ? 'success' :
                                                        product.visibility === 'draft' ? 'warning' : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleProductEdit(product._id)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Duplicate">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleProductDuplicate(product._id)}
                                                    >
                                                        <DuplicateIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleProductDelete(product._id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={(e, page) => setPagination(prev => ({ ...prev, page }))}
                            color="primary"
                        />
                    </Box>
                )}
            </Paper>

            {/* Bulk Action Dialog */}
            <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
                <DialogTitle>Bulk Actions</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Select an action to apply to {selectedProducts.length} selected products:
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Action</InputLabel>
                        <Select
                            value={bulkAction}
                            label="Action"
                            onChange={(e) => setBulkAction(e.target.value)}
                        >
                            <MenuItem value="publish">Publish Products</MenuItem>
                            <MenuItem value="draft">Move to Draft</MenuItem>
                            <MenuItem value="delete">Delete Products</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleBulkAction}
                        variant="contained"
                        disabled={!bulkAction || loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Apply Action'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'dashboard':
                return (
                    <>
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
                                data={products.slice(0, 5).map(p => ({
                                    id: p._id,
                                    name: p.title,
                                    category: p.categories?.join(', ') || 'Uncategorized',
                                    thumbnail: p.media?.[0]?.url || '/api/placeholder/40/40',
                                    dateAdded: new Date(p.createdAt).toISOString(),
                                    price: `${p.currency} ${p.salePrice || p.price}`,
                                    stock: p.stock
                                }))}
                                columns={[
                                    { key: 'name', label: 'Product Name' },
                                    { key: 'category', label: 'Category' },
                                    { key: 'price', label: 'Price' },
                                    { key: 'stock', label: 'Stock' }
                                ]}
                                type="products"
                                onEdit={handleProductEdit}
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
                    </>
                );

            case 'websiteSettings':
                return (
                    <Grid item xs={12}>
                        <WebsiteSettings />
                    </Grid>
                );

            case 'products':
                return (
                    <Grid item xs={12}>
                        <ProductsManagementView />
                    </Grid>
                );

            case 'addProduct':
                return (
                    <Grid item xs={12}>
                        <AddProductForm
                            product={editingProduct}
                            isEdit={false}
                            onSave={handleProductSaved}
                            onCancel={() => setCurrentView('products')}
                        />
                    </Grid>
                );

            case 'editProduct':
                return (
                    <Grid item xs={12}>
                        <AddProductForm
                            product={editingProduct}
                            isEdit={true}
                            onSave={handleProductSaved}
                            onCancel={() => setCurrentView('products')}
                        />
                    </Grid>
                );

            case 'inquiries':
                return (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Customer Inquiries
                        </Typography>
                        <RecentTable
                            title="All Customer Inquiries"
                            data={recentInquiries}
                            columns={[
                                { key: 'customerName', label: 'Customer' },
                                { key: 'productName', label: 'Product' },
                                { key: 'date', label: 'Date' },
                                { key: 'status', label: 'Status' }
                            ]}
                            type="inquiries"
                            showActions={true}
                        />
                    </Grid>
                );

            case 'analytics':
                return (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Analytics & Reports
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <ChartCard
                                    title="Sales Analytics"
                                    data={salesData}
                                    type="line"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatsCard
                                    title="Total Revenue"
                                    value="$245,680"
                                    change="+15.3%"
                                    changeType="positive"
                                    icon={<AnalyticsIcon />}
                                    color="success"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                );

            case 'users':
                return (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            User Management
                        </Typography>
                        <RecentTable
                            title="All Users"
                            data={recentUsers}
                            columns={[
                                { key: 'name', label: 'Name' },
                                { key: 'email', label: 'Email' },
                                { key: 'signupDate', label: 'Signup Date' },
                                { key: 'status', label: 'Status' }
                            ]}
                            type="users"
                            showActions={true}
                        />
                    </Grid>
                );

            case 'blog':
                return (
                    <Grid item xs={12}>
                        <BlogManagement />
                    </Grid>
                );

            default:
                return (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Page Not Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            The requested page could not be found.
                        </Typography>
                    </Grid>
                );
        }
    };

    const drawer = (
        <div>
            <DrawerHeader>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    B2B Admin Panel
                </Typography>
            </DrawerHeader>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => setCurrentView(item.view)}
                            sx={{
                                backgroundColor: currentView === item.view ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: currentView === item.view ? theme.palette.primary.main : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    color: currentView === item.view ? theme.palette.primary.main : 'inherit',
                                    '& .MuiListItemText-primary': {
                                        fontWeight: currentView === item.view ? 600 : 400
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
                            {getCurrentViewTitle()}
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

                <Main open={drawerOpen && !isMobile}>
                    <DrawerHeader />

                    <Container maxWidth="xl" sx={{ mt: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            {getCurrentViewTitle()}
                        </Typography>

                        <Grid container spacing={3}>
                            {renderCurrentView()}
                        </Grid>
                    </Container>
                </Main>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AdminDashboard;