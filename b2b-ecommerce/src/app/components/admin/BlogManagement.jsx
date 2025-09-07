import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Tabs,
    Tab,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress,
    Checkbox,
    Menu,
    ListItemText,
    OutlinedInput,
    Autocomplete,
    Breadcrumbs,
    Link,
    Stack,
    Alert,
    CardMedia,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    MoreVert as MoreVertIcon,
    Article as ArticleIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    FormatBold as BoldIcon,
    FormatItalic as ItalicIcon,
    FormatUnderlined as UnderlineIcon,
    FormatAlignLeft as AlignLeftIcon,
    FormatAlignCenter as AlignCenterIcon,
    FormatAlignRight as AlignRightIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    Drafts as DraftIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Home as HomeIcon,
    Category as CategoryIcon,
    LocalOffer as TagIcon,
    Preview as PreviewIcon,
    ExpandMore as ExpandMoreIcon,
    Clear as ClearIcon,
    CloudUpload as UploadIcon,
    Link as LinkIcon,
    PhotoLibrary as GalleryIcon,
    PlayCircleOutline as VideoIconOutlined,
    InsertLink as InsertLinkIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const BlogManagement = () => {
    const [currentView, setCurrentView] = useState('posts'); // 'posts', 'categories', 'tags', 'add-post'
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    // Media dialog states
    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
    const [mediaTab, setMediaTab] = useState(0); // 0: Upload, 1: Library, 2: URL
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    // Post editor states
    const [editingPost, setEditingPost] = useState(null);
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        categories: [],
        tags: [],
        featuredImage: '',
        visibility: 'public',
        publishDate: new Date().toISOString().split('T')[0],
        permalink: '',
        contentBlocks: [],
        mediaItems: [], // New field for media attachments
        mediaSize: 'medium',
        textAlignment: 'left',
        fontSize: 'medium',
        fontColor: '#000000',
        bold: false,
        italic: false,
        underline: false,
        links: [],
        layoutSettings: 'left-right'
    });

    // Initialize data
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = () => {
        setLoading(true);

        // Mock data with media items
        const mockPosts = [
            {
                _id: '1',
                title: 'What Is The WordPress Admin Area?',
                content: 'This is a blog post about the WordPress admin area...',
                status: 'published',
                author: 'Alex White',
                categories: ['Uncategorized'],
                tags: ['wordpress', 'admin'],
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z',
                views: 245,
                mediaItems: []
            },
            {
                _id: '2',
                title: 'This is another post',
                content: 'Content of another post...',
                status: 'published',
                author: 'Alex White',
                categories: ['Uncategorized'],
                tags: ['tutorial'],
                createdAt: '2024-01-12T10:00:00Z',
                updatedAt: '2024-01-12T10:00:00Z',
                views: 189,
                mediaItems: []
            },
            {
                _id: '3',
                title: 'Hello world!',
                content: 'Welcome to WordPress. This is your first post...',
                status: 'draft',
                author: 'Admin',
                categories: ['Welcome'],
                tags: ['hello', 'first-post'],
                createdAt: '2024-01-10T10:00:00Z',
                updatedAt: '2024-01-10T10:00:00Z',
                views: 0,
                mediaItems: []
            }
        ];

        const mockCategories = [
            { _id: '1', name: 'Uncategorized', slug: 'uncategorized', count: 2, description: 'Default category' },
            { _id: '2', name: 'Welcome', slug: 'welcome', count: 1, description: 'Welcome posts' },
            { _id: '3', name: 'Technology', slug: 'technology', count: 0, description: 'Tech related posts' }
        ];

        const mockTags = [
            { _id: '1', name: 'wordpress', slug: 'wordpress', count: 1 },
            { _id: '2', name: 'admin', slug: 'admin', count: 1 },
            { _id: '3', name: 'tutorial', slug: 'tutorial', count: 1 },
            { _id: '4', name: 'hello', slug: 'hello', count: 1 },
            { _id: '5', name: 'first-post', slug: 'first-post', count: 1 }
        ];

        const mockMediaItems = [
            {
                _id: '1',
                filename: 'sample-image.jpg',
                originalName: 'sample-image.jpg',
                url: 'https://via.placeholder.com/300x200',
                type: 'image',
                size: 45678,
                uploadDate: '2024-01-15T10:00:00Z',
                alt: 'Sample image'
            },
            {
                _id: '2',
                filename: 'video-sample.mp4',
                originalName: 'video-sample.mp4',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                type: 'video',
                size: 1048576,
                uploadDate: '2024-01-14T10:00:00Z',
                alt: 'Sample video'
            }
        ];

        setTimeout(() => {
            setPosts(mockPosts);
            setCategories(mockCategories);
            setTags(mockTags);
            setMediaItems(mockMediaItems);
            setLoading(false);
        }, 1000);
    };

    // Media handling functions
    const handleMediaDialog = () => {
        setMediaDialogOpen(true);
        setMediaTab(0);
        setSelectedMedia(null);
        setMediaUrl('');
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploadProgress(0);

        for (let file of files) {
            // Simulate upload progress
            const uploadInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(uploadInterval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Create mock media item
            const newMediaItem = {
                _id: Date.now().toString(),
                filename: file.name,
                originalName: file.name,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : 'file',
                size: file.size,
                uploadDate: new Date().toISOString(),
                alt: file.name.split('.')[0]
            };

            setTimeout(() => {
                setMediaItems(prev => [newMediaItem, ...prev]);
                setUploadProgress(0);
            }, 1000);
        }
    };

    const handleUrlEmbed = () => {
        if (!mediaUrl) return;

        let type = 'link';
        let embedHtml = '';

        // YouTube
        if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
            type = 'youtube';
            const videoId = extractYouTubeId(mediaUrl);
            embedHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
        // Instagram
        else if (mediaUrl.includes('instagram.com')) {
            type = 'instagram';
            embedHtml = `<blockquote class="instagram-media" data-instgrm-permalink="${mediaUrl}"></blockquote>`;
        }
        // TikTok
        else if (mediaUrl.includes('tiktok.com')) {
            type = 'tiktok';
            embedHtml = `<blockquote class="tiktok-embed" cite="${mediaUrl}"></blockquote>`;
        }
        // Twitter
        else if (mediaUrl.includes('twitter.com') || mediaUrl.includes('x.com')) {
            type = 'twitter';
            embedHtml = `<blockquote class="twitter-tweet"><a href="${mediaUrl}"></a></blockquote>`;
        }

        const embedItem = {
            _id: Date.now().toString(),
            url: mediaUrl,
            type: type,
            embedHtml: embedHtml,
            createdAt: new Date().toISOString()
        };

        // Add to current content
        insertMediaIntoContent(embedItem);
        setMediaDialogOpen(false);
        setMediaUrl('');
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const insertMediaIntoContent = (mediaItem) => {
        let insertText = '';

        if (mediaItem.type === 'image') {
            insertText = `<img src="${mediaItem.url}" alt="${mediaItem.alt || ''}" />`;
        } else if (mediaItem.type === 'video') {
            insertText = `<video controls><source src="${mediaItem.url}" type="video/mp4"></video>`;
        } else if (mediaItem.embedHtml) {
            insertText = mediaItem.embedHtml;
        } else {
            insertText = `<a href="${mediaItem.url}" target="_blank">${mediaItem.url}</a>`;
        }

        setPostData(prev => ({
            ...prev,
            content: prev.content + '\n\n' + insertText,
            mediaItems: [...prev.mediaItems, mediaItem]
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedPosts(filteredPosts.map(post => post._id));
        } else {
            setSelectedPosts([]);
        }
    };

    const handleSelectPost = (postId) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const handleBulkAction = () => {
        if (!bulkAction || selectedPosts.length === 0) return;

        console.log(`Applying ${bulkAction} to posts:`, selectedPosts);
        // Implement bulk actions here
        setSelectedPosts([]);
        setBulkAction('');
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || post.categories.includes(categoryFilter);
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleNewPost = () => {
        setEditingPost(null);
        setPostData({
            title: '',
            content: '',
            excerpt: '',
            status: 'draft',
            categories: [],
            tags: [],
            featuredImage: '',
            visibility: 'public',
            publishDate: new Date().toISOString().split('T')[0],
            permalink: '',
            contentBlocks: [],
            mediaItems: [],
            mediaSize: 'medium',
            textAlignment: 'left',
            fontSize: 'medium',
            fontColor: '#000000',
            bold: false,
            italic: false,
            underline: false,
            links: [],
            layoutSettings: 'left-right'
        });
        setCurrentView('add-post');
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setPostData({
            title: post.title,
            content: post.content || '',
            excerpt: post.excerpt || '',
            status: post.status,
            categories: post.categories || [],
            tags: post.tags || [],
            featuredImage: post.featuredImage || '',
            visibility: 'public',
            publishDate: new Date(post.createdAt).toISOString().split('T')[0],
            permalink: post.title.toLowerCase().replace(/\s+/g, '-'),
            contentBlocks: post.contentBlocks || [],
            mediaItems: post.mediaItems || [],
            mediaSize: post.mediaSize || 'medium',
            textAlignment: post.textAlignment || 'left',
            fontSize: post.fontSize || 'medium',
            fontColor: post.fontColor || '#000000',
            bold: post.bold || false,
            italic: post.italic || false,
            underline: post.underline || false,
            links: post.links || [],
            layoutSettings: post.layoutSettings || 'left-right'
        });
        setCurrentView('add-post');
    };

    const handleSavePost = () => {
        setLoading(true);

        setTimeout(() => {
            if (editingPost) {
                setPosts(posts.map(post =>
                    post._id === editingPost._id
                        ? { ...post, ...postData, updatedAt: new Date().toISOString() }
                        : post
                ));
            } else {
                const newPost = {
                    _id: Date.now().toString(),
                    ...postData,
                    author: 'Current User',
                    views: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setPosts([newPost, ...posts]);
            }

            setLoading(false);
            setCurrentView('posts');
        }, 1000);
    };

    // Media Dialog Component
    const MediaDialog = () => (
        <Dialog
            open={mediaDialogOpen}
            onClose={() => setMediaDialogOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Add Media
                    <IconButton onClick={() => setMediaDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Tabs value={mediaTab} onChange={(_, newValue) => setMediaTab(newValue)}>
                    <Tab label="Upload Files" />
                    <Tab label="Media Library" />
                    <Tab label="Insert from URL" />
                </Tabs>

                {/* Upload Tab */}
                {mediaTab === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                border: '2px dashed #ccc',
                                borderRadius: 2,
                                p: 4,
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': { borderColor: '#999' }
                            }}
                            component="label"
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <UploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Drop files to upload
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                or click to select files
                            </Typography>
                            <Button variant="outlined" sx={{ mt: 2 }}>
                                Select Files
                            </Button>
                        </Box>

                        {uploadProgress > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">Uploading...</Typography>
                                <Box sx={{ width: '100%', mt: 1 }}>
                                    <Box sx={{ bgcolor: '#e0e0e0', height: 8, borderRadius: 4 }}>
                                        <Box
                                            sx={{
                                                bgcolor: 'primary.main',
                                                height: 8,
                                                borderRadius: 4,
                                                width: `${uploadProgress}%`,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Media Library Tab */}
                {mediaTab === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <ImageList cols={3} rowHeight={164}>
                            {mediaItems.map((item) => (
                                <ImageListItem
                                    key={item._id}
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedMedia?._id === item._id ? '3px solid #2271b1' : 'none'
                                    }}
                                    onClick={() => setSelectedMedia(item)}
                                >
                                    {item.type === 'image' ? (
                                        <img
                                            src={item.url}
                                            alt={item.alt}
                                            loading="lazy"
                                            style={{ height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : item.type === 'video' ? (
                                        <Box sx={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#f0f0f0'
                                        }}>
                                            <VideoIconOutlined sx={{ fontSize: 48, color: '#666' }} />
                                        </Box>
                                    ) : (
                                        <Box sx={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#f0f0f0'
                                        }}>
                                            <ArticleIcon sx={{ fontSize: 48, color: '#666' }} />
                                        </Box>
                                    )}
                                    <ImageListItemBar
                                        title={item.filename}
                                        subtitle={formatFileSize(item.size)}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>

                        {selectedMedia && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="h6">{selectedMedia.filename}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatFileSize(selectedMedia.size)} • {formatDate(selectedMedia.uploadDate)}
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Alt Text"
                                    value={selectedMedia.alt || ''}
                                    onChange={(e) => setSelectedMedia(prev => ({ ...prev, alt: e.target.value }))}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                )}

                {/* Insert from URL Tab */}
                {mediaTab === 2 && (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Media URL"
                            placeholder="https://youtube.com/watch?v=... or https://instagram.com/p/..."
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            helperText="Supports YouTube, Instagram, TikTok, Twitter, and direct image/video links"
                        />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Supported platforms:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip label="YouTube" size="small" />
                                <Chip label="Instagram" size="small" />
                                <Chip label="TikTok" size="small" />
                                <Chip label="Twitter/X" size="small" />
                                <Chip label="Direct Links" size="small" />
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMediaDialogOpen(false)}>
                    Cancel
                </Button>
                {mediaTab === 1 && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedMedia) {
                                insertMediaIntoContent(selectedMedia);
                                setMediaDialogOpen(false);
                            }
                        }}
                        disabled={!selectedMedia}
                    >
                        Insert Media
                    </Button>
                )}
                {mediaTab === 2 && (
                    <Button
                        variant="contained"
                        onClick={handleUrlEmbed}
                        disabled={!mediaUrl}
                    >
                        Insert URL
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );

    const Breadcrumb = () => (
        <Breadcrumbs sx={{ mb: 2 }}>
            <Link
                color="inherit"
                href="#"
                onClick={() => setCurrentView('posts')}
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Dashboard
            </Link>
            {currentView === 'posts' && <Typography color="text.primary">Posts</Typography>}
            {currentView === 'categories' && <Typography color="text.primary">Categories</Typography>}
            {currentView === 'tags' && <Typography color="text.primary">Tags</Typography>}
            {currentView === 'add-post' && <Typography color="text.primary">{editingPost ? 'Edit Post' : 'Add New Post'}</Typography>}
        </Breadcrumbs>
    );

    const PostsList = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Posts
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewPost}
                    sx={{ backgroundColor: '#2271b1', '&:hover': { backgroundColor: '#135e96' } }}
                >
                    Add New
                </Button>
            </Box>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Tabs value={statusFilter} onChange={(_, value) => setStatusFilter(value)}>
                    <Tab label="All (3)" value="all" />
                    <Tab label="Published (2)" value="published" />
                    <Tab label="Draft (1)" value="draft" />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="all">All dates</MenuItem>
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="week">This week</MenuItem>
                            <MenuItem value="month">This month</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="all">All categories</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" size="small">Filter</Button>

                    <TextField
                        size="small"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 200 }}
                    />
                    <Button variant="outlined" size="small">Search Posts</Button>
                </Box>
            </Box>

            {/* Bulk Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="">Bulk actions</MenuItem>
                        <MenuItem value="delete">Move to Trash</MenuItem>
                        <MenuItem value="publish">Publish</MenuItem>
                        <MenuItem value="draft">Move to Draft</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleBulkAction}
                    disabled={!bulkAction || selectedPosts.length === 0}
                >
                    Apply
                </Button>
                {selectedPosts.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                        {selectedPosts.length} item(s) selected
                    </Typography>
                )}
            </Box>

            {/* Posts Table */}
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f1' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                                    indeterminate={selectedPosts.length > 0 && selectedPosts.length < filteredPosts.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Author</strong></TableCell>
                            <TableCell><strong>Categories</strong></TableCell>
                            <TableCell><strong>Tags</strong></TableCell>
                            <TableCell align="center"><strong>Comments</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        No posts found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post) => (
                                <TableRow key={post._id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedPosts.includes(post._id)}
                                            onChange={() => handleSelectPost(post._id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: post.status === 'published' ? 'inherit' : 'text.secondary',
                                                    cursor: 'pointer',
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                                onClick={() => handleEditPost(post)}
                                            >
                                                {post.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    onClick={() => handleEditPost(post)}
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    Edit
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">|</Typography>
                                                <Link component="button" variant="body2" sx={{ textDecoration: 'none' }}>
                                                    Quick Edit
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">|</Typography>
                                                <Link component="button" variant="body2" color="error" sx={{ textDecoration: 'none' }}>
                                                    Trash
                                                </Link>
                                                <Typography variant="body2" color="text.secondary">|</Typography>
                                                <Link component="button" variant="body2" sx={{ textDecoration: 'none' }}>
                                                    View
                                                </Link>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{post.author}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {post.categories.map(cat => (
                                                <Chip key={cat} label={cat} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {post.tags.map(tag => (
                                                <Chip key={tag} label={tag} size="small" />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">0</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate(post.updatedAt)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    2 items
                </Typography>
            </Box>
        </Box>
    );

    const PostEditor = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {editingPost ? 'Edit Post' : 'Add New Post'}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {/* Title */}
                        <TextField
                            fullWidth
                            placeholder="Add title"
                            value={postData.title}
                            onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: '1.7rem',
                                    fontWeight: 400,
                                    lineHeight: 1.2
                                }
                            }}
                        />

                        {/* Permalink */}
                        {postData.title && (
                            <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderRadius: 1 }}>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Permalink:</strong> http://testsite.kinsta.com/
                                    <TextField
                                        size="small"
                                        value={postData.permalink || postData.title.toLowerCase().replace(/\s+/g, '-')}
                                        onChange={(e) => setPostData(prev => ({ ...prev, permalink: e.target.value }))}
                                        variant="standard"
                                        sx={{ mx: 1 }}
                                    />
                                    <Button size="small">Edit</Button>
                                </Typography>
                            </Box>
                        )}

                        {/* Content Editor */}
                        <Card>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
                                <Tabs value={0}>
                                    <Tab label="Visual" />
                                    <Tab label="Text" />
                                </Tabs>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                {/* Toolbar */}
                                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <FormControl size="small" sx={{ minWidth: 100 }}>
                                        <Select value="paragraph" displayEmpty>
                                            <MenuItem value="paragraph">Paragraph</MenuItem>
                                            <MenuItem value="heading1">Heading 1</MenuItem>
                                            <MenuItem value="heading2">Heading 2</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Divider orientation="vertical" flexItem />

                                    <IconButton size="small">
                                        <BoldIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <ItalicIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <UnderlineIcon />
                                    </IconButton>

                                    <Divider orientation="vertical" flexItem />

                                    <IconButton size="small">
                                        <AlignLeftIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <AlignCenterIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <AlignRightIcon />
                                    </IconButton>

                                    <Divider orientation="vertical" flexItem />

                                    {/* Add Media Button */}
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ImageIcon />}
                                        onClick={handleMediaDialog}
                                        sx={{ minWidth: 'auto' }}
                                    >
                                        Add Media
                                    </Button>

                                    <IconButton size="small" title="Insert Link">
                                        <InsertLinkIcon />
                                    </IconButton>
                                </Box>

                                {/* Content Area */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={12}
                                    placeholder="This is a blog post about the WordPress admin area..."
                                    value={postData.content}
                                    onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minHeight: '300px'
                                        }
                                    }}
                                />

                                {/* Media Attachments Display */}
                                {postData.mediaItems.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Media Attachments:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {postData.mediaItems.map((media, index) => (
                                                <Chip
                                                    key={index}
                                                    label={media.filename || media.type}
                                                    variant="outlined"
                                                    size="small"
                                                    onDelete={() => {
                                                        setPostData(prev => ({
                                                            ...prev,
                                                            mediaItems: prev.mediaItems.filter((_, i) => i !== index)
                                                        }));
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Word count: {postData.content.split(' ').filter(word => word.length > 0).length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Draft saved at 3:46:47 am.
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Stack>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                        {/* Publish */}
                        <Card>
                            <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6">Publish</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                                            Save Draft
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            Preview
                                        </Button>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Status:</strong> {postData.status}
                                            <Link component="button" variant="body2" sx={{ ml: 1 }}>Edit</Link>
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Visibility:</strong> Public
                                            <Link component="button" variant="body2" sx={{ ml: 1 }}>Edit</Link>
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Publish immediately</strong>
                                            <Link component="button" variant="body2" sx={{ ml: 1 }}>Edit</Link>
                                        </Typography>
                                    </Box>

                                    <Button color="error" variant="outlined" size="small">
                                        Move to Trash
                                    </Button>

                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSavePost}
                                        disabled={loading}
                                        sx={{ backgroundColor: '#2271b1' }}
                                    >
                                        {loading ? <CircularProgress size={20} /> : 'Publish'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Card>

                        {/* Format */}
                        <Card>
                            <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6">Format</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Standard" />
                                    <FormControlLabel control={<Checkbox />} label="Aside" />
                                    <FormControlLabel control={<Checkbox />} label="Image" />
                                    <FormControlLabel control={<Checkbox />} label="Video" />
                                    <FormControlLabel control={<Checkbox />} label="Quote" />
                                    <FormControlLabel control={<Checkbox />} label="Link" />
                                    <FormControlLabel control={<Checkbox />} label="Gallery" />
                                    <FormControlLabel control={<Checkbox />} label="Audio" />
                                </Stack>
                            </Box>
                        </Card>

                        {/* Categories */}
                        <Card>
                            <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6">Categories</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    {categories.map(category => (
                                        <FormControlLabel
                                            key={category._id}
                                            control={
                                                <Checkbox
                                                    checked={postData.categories.includes(category.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPostData(prev => ({
                                                                ...prev,
                                                                categories: [...prev.categories, category.name]
                                                            }));
                                                        } else {
                                                            setPostData(prev => ({
                                                                ...prev,
                                                                categories: prev.categories.filter(cat => cat !== category.name)
                                                            }));
                                                        }
                                                    }}
                                                />
                                            }
                                            label={category.name}
                                        />
                                    ))}
                                </Stack>
                                <Box sx={{ mt: 2 }}>
                                    <Link component="button" variant="body2">+ Add New Category</Link>
                                </Box>
                            </Box>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6">Tags</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={tags.map(tag => tag.name)}
                                    value={postData.tags}
                                    onChange={(_, newValue) => setPostData(prev => ({ ...prev, tags: newValue }))}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Add tags"
                                            size="small"
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                key={option}
                                                label={option}
                                                {...getTagProps({ index })}
                                                size="small"
                                            />
                                        ))
                                    }
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    Separate tags with commas
                                </Typography>
                            </Box>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            {/* Media Dialog */}
            <MediaDialog />
        </Box>
    );

    const CategoriesView = () => (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Categories
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6">Add New Category</Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    placeholder="Category name"
                                    size="small"
                                />
                                <TextField
                                    fullWidth
                                    label="Slug"
                                    placeholder="category-slug"
                                    size="small"
                                />
                                <TextField
                                    fullWidth
                                    label="Parent Category"
                                    select
                                    size="small"
                                    defaultValue="none"
                                >
                                    <MenuItem value="none">None</MenuItem>
                                    {categories.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    size="small"
                                    placeholder="The description is not prominent by default; however, some themes may show it."
                                />
                                <Button variant="contained" sx={{ backgroundColor: '#2271b1' }}>
                                    Add New Category
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f0f0f1' }}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Slug</strong></TableCell>
                                    <TableCell><strong>Count</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {category.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    <Link component="button" variant="body2">Edit</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2">Quick Edit</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2" color="error">Delete</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2">View</Link>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.description || '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{category.slug}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{category.count}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );

    const TagsView = () => (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Tags
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <Box sx={{ p: 2, backgroundColor: '#f0f0f1', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6">Add New Tag</Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    placeholder="Tag name"
                                    size="small"
                                />
                                <TextField
                                    fullWidth
                                    label="Slug"
                                    placeholder="tag-slug"
                                    size="small"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    size="small"
                                    placeholder="The description is not prominent by default; however, some themes may show it."
                                />
                                <Button variant="contained" sx={{ backgroundColor: '#2271b1' }}>
                                    Add New Tag
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f0f0f1' }}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Slug</strong></TableCell>
                                    <TableCell><strong>Count</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tags.map((tag) => (
                                    <TableRow key={tag._id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {tag.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    <Link component="button" variant="body2">Edit</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2">Quick Edit</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2" color="error">Delete</Link>
                                                    <Typography variant="body2" color="text.secondary">|</Typography>
                                                    <Link component="button" variant="body2">View</Link>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                —
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{tag.slug}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{tag.count}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );

    // Navigation menu
    const NavigationMenu = () => (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
                <Button
                    variant={currentView === 'posts' ? 'contained' : 'outlined'}
                    startIcon={<ArticleIcon />}
                    onClick={() => setCurrentView('posts')}
                    sx={{ backgroundColor: currentView === 'posts' ? '#2271b1' : 'transparent' }}
                >
                    Posts
                </Button>
                <Button
                    variant={currentView === 'categories' ? 'contained' : 'outlined'}
                    startIcon={<CategoryIcon />}
                    onClick={() => setCurrentView('categories')}
                    sx={{ backgroundColor: currentView === 'categories' ? '#2271b1' : 'transparent' }}
                >
                    Categories
                </Button>
                <Button
                    variant={currentView === 'tags' ? 'contained' : 'outlined'}
                    startIcon={<TagIcon />}
                    onClick={() => setCurrentView('tags')}
                    sx={{ backgroundColor: currentView === 'tags' ? '#2271b1' : 'transparent' }}
                >
                    Tags
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ p: 3, backgroundColor: '#f0f0f1', minHeight: '100vh' }}>
            <Breadcrumb />
            <NavigationMenu />

            {currentView === 'posts' && <PostsList />}
            {currentView === 'categories' && <CategoriesView />}
            {currentView === 'tags' && <TagsView />}
            {currentView === 'add-post' && <PostEditor />}
        </Box>
    );
};

export default BlogManagement;