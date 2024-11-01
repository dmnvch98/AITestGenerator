import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Button, Grid} from "@mui/material";
import Link from "@mui/material/Link";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import useAuthStore from "../../pages/auth/authStore";
import {useLocation} from 'react-router-dom';

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

interface TabIcon {
    name: string;
    icon: any;
    redirect: string;
}

export const SidebarHeader = ({children}: any) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const {logout} = useAuthStore();
    const location = useLocation();

    const tabs: TabIcon[] = [
        {
            name: 'Тесты',
            icon: <ArticleOutlinedIcon/>,
            redirect: '/tests',
        },
        {
            name: 'Файлы',
            icon: <FolderIcon/>,
            redirect: '/files',
        }
    ];

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Grid container>
                        <Grid item sm={12}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                <Typography variant="h6" noWrap component="div">
                                    ГенТест
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <Button
                                        sx={{color: 'black'}}
                                        onClick={logout}
                                    >
                                        Выход
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    {tabs.map((t) => (
                        <Link href={t.redirect} underline="none" color="inherit" key={t.name}>
                            <ListItem disablePadding sx={{display: 'block'}}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 58,
                                        justifyContent: 'center',
                                        backgroundColor: location.pathname === t.redirect ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            mr: 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {t.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={t.name} sx={{opacity: open ? 1 : 0}}/>
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>

            <Grid container sx={{mt: 10}}>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    );
};
