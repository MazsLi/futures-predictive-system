import React from 'react';
const debug = require('debug')('mainpage');
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Icon
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import SettingsIcon from '@material-ui/icons/Settings';

import SideMenu from './SideMenu';
import Dashboard from './Dashboard';

const drawerWidth = 240;

const styles = theme => ({ // 直接指定 class name 的 style
    root: {
        flexGrow: 1,
        height: 'inherit',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        background: '#5b5c6e'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
    },
    inactivePage: { // 非目前 Focus 頁面
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    activePage: { // 目前 Focus 頁面
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
    },
});

class MainPage extends React.Component {

    state = {
        sidemenu_open: false,
        sidemenu_current: 'dashboard',
        sidemenu_current_name: 'Dashboard',
        sidemenu_items: [
            {   
                key: 'dashboard',    
                name: 'Dashboard',
                icon: <AssessmentIcon/>
            },
            {   
                key: 'training',
                name: 'Training Mode',
                icon: <FitnessCenterIcon/>
            },
            {   
                key: 'tools',
                name: 'Tools',
                icon: <SettingsIcon/>
            }
        ]
    }

    componentDidMount = () => {
        this.handleSideMenuClick('dashboard');
    }

    handleDrawerOpen = () => {
        this.setState({
            sidemenu_open: true 
        })
    }

    handleDrawerClose = () => {
        this.setState({ 
            sidemenu_open: false
        })
    }

    handleSideMenuClick = (key) => {

        let currentName;
        this.state.sidemenu_items.map( (item) => {
            if(item.key==key) currentName = item.name;
        })

        this.setState({ 
            sidemenu_current: key,
            sidemenu_current_name: currentName
        })
    }

    render() {
        const { classes, theme } = this.props;
        const { sidemenu_open, sidemenu_current, sidemenu_current_name, sidemenu_items } = this.state;

        let pages = [];
        sidemenu_items.map( (item) => {

            let page;

            switch(item.key) {
                case 'dashboard': page = <Dashboard />;
                case 'training': page = <Dashboard />;
                case 'tools': page = <Dashboard />;
            }

            pages.push(
                <Typography 
                    className={(sidemenu_current===item.key)?classes.activePage:classes.inactivePage} 
                    component='div'>
                    {page}
                </Typography>
            )
        })


        return (
            <div className={classes.root}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, sidemenu_open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!sidemenu_open}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, sidemenu_open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap>
                            { sidemenu_current_name }
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(classes.drawerPaper, !sidemenu_open && classes.drawerPaperClose),
                    }}
                    open={sidemenu_open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <SideMenu items={sidemenu_items} click={this.handleSideMenuClick}/>
                    
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    
                    {pages}
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainPage);

{/* <Typography component='div'>

{ ( sidemenu_current==='dashboard' && <Dashboard /> ) }
{ ( sidemenu_current==='training' && <Dashboard /> ) }
{ ( sidemenu_current==='tools' && <Dashboard /> ) }
</Typography> */}