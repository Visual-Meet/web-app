import React, { useEffect, useState } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { DataGrid, getColDef } from '@material-ui/data-grid';
import { BaseUrl } from '../App.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import RefreshIcon from '@material-ui/icons/Refresh';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FilterListIcon from '@material-ui/icons/FilterList';
import Pagination from '@material-ui/lab/Pagination';
import BlogCards from './BlogCards';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Alert from '@material-ui/lab/Alert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import './QueryBlog.scss'
import './BlogCards.css';

const QueryBlog = (props) => {
    let state = useSelector(state => {
        if (props.type === "student") {
            return state.signin;
        }
        if (props.type === "teacher") {
            return state.teachersignin;
        }
    });
    let state1 = useSelector(state => state.QueryBlog);
    let state2 = useSelector(state => state.titleExists);
    let state3 = useSelector(state => state.addQuestion);
    let [currentPage, setCurrentPage] = useState(1);
    let [pageCount, setPageCount] = useState(1);
    let [currentPageData, setCurrentPageData] = useState([]);
    let [records, setRecords] = useState(4);
    let [postvis, setpostvis] = useState(true);
    let [details, setDetails] = useState({ "title": "", "description": "" });
    let [titleDisplay, setTitleDisplay] = useState("hidden");
    let [addDisplay, setAddDisplay] = useState("hidden");
    let [onAdd, setOnAdd] = useState(false);
    let [onRefresh, setOnRefresh] = useState(false);
    const [SearchDisplay,setSearchDisplay]  =useState("hidden");
    const [userFilter, setUserFilter] = useState();
    const [searchVal,setSearchVal] = useState();
    const [onDel,setOnDel] = useState(false);
    const options = [1, 3, 5, 10, 15, 20, 25, 30];
    const ITEM_HEIGHT = 48;
    console.log(currentPageData);
    let dispatch = useDispatch();
    const H = useHistory();
    useEffect(async () => {
        let d = new Date();
        const d_s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        const value = JSON.parse(localStorage.getItem('value'));
        let info = { ...value, 'date': d_s };
        if(props.type==="student"){
            dispatch({ type: 'request_signin' });
        }
        else if(props.type==="teacher"){
            dispatch({ type: 'request_teachersignin' });
        }
        try {
            const data = await axios({
                method: "post",
                url: BaseUrl + props.type+"exists/",
                headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                data: info,
                responseType: 'json'
            })
            if(props.type==="student"){
                dispatch({ type: "success_signin", payload: data.data });
            }
            else if(props.type==="teacher"){
                dispatch({ type: "success_teachersignin", payload: data.data });
            }
            // H.push(`/mainblog`);
            setUserFilter("all");
        }
        catch {
            if(props.type==="student"){
                dispatch({ type: "error_signin", payload: "" });
            }
            else if(props.type==="teacher"){
                dispatch({ type: "error_teachersignin", payload: "" });
            }
            H.push('/error');
        }
    }, []);
    useEffect(async () => {
        console.log(userFilter, records, currentPage);
        if (userFilter === "all") {
            setSearchDisplay("hidden");
            dispatch({ 'type': "request_QueryBlog" })
            try {
                const data = await axios({
                    method: "get",
                    url: BaseUrl + `PostQueryQ/?page=${currentPage}&pagerecords=${records}`,
                    headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                    responseType: 'json'
                })
                dispatch({ 'type': 'success_QueryBlog', payload: data.data });
                setPageCount(data.data.count);
                setCurrentPageData(data.data.results);
            }
            catch {
                dispatch({ 'type': 'error_QueryBlog', payload: "" });
                // H.push('\error');
                setCurrentPage(1);
            }
        }
        else if (userFilter === "myposts") {
            setSearchDisplay("hidden");
            dispatch({ 'type': "request_QueryBlog" })
            // setCurrentPage(1);
            // console.log(BaseUrl + `GetQueryQ/${JSON.parse(localStorage.getItem('value')).rollno}/?page=${currentPage}&pagerecords=${records}/`);
            try {
                const data = await axios({
                    method: "get",
                    url: BaseUrl + `GetQueryQ/${JSON.parse(localStorage.getItem('value')).rollno}/?page=${currentPage}&pagerecords=${records}`,
                    headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                    responseType: 'json'
                })
                dispatch({ 'type': 'success_QueryBlog', payload: data.data });
                setPageCount(data.data.count);
                setCurrentPageData(data.data.results);
            }
            catch {
                dispatch({ 'type': 'error_QueryBlog', payload: "" });
                // H.push('\error');
                setCurrentPage(1);
            }
        }
        else if(userFilter==="onsearch"){
            dispatch({'type':"request_QueryBlog"});
            try {
                const data = await axios({
                    method: "get",
                    url: BaseUrl + `PostQueryQ/?search=${searchVal}&page=${currentPage}&pagerecords=${records}`,
                    headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                    responseType: 'json'
                })
                dispatch({ 'type': 'success_QueryBlog', payload: data.data });
                setPageCount(data.data.count);
                setCurrentPageData(data.data.results);
                setSearchDisplay("visible");
            }
            catch {
                dispatch({ 'type': 'error_QueryBlog', payload: "" });
                // H.push('\error');
                setCurrentPage(1);
            }
        }
    }, [currentPage, onAdd, onRefresh, records, userFilter,searchVal,onDel]);
    const onPageChange = (event, page) => {
        setCurrentPage(page);
    }
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));
    // useEffect(async ()=>{
    //     if(userFilter==="myposts"){
    //         dispatch({ 'type': "request_QueryBlog" })
    //         setCurrentPage(1);
    //         try {
    //             const data = await axios({
    //                 method: "get",
    //                 url: BaseUrl + `GetQueryQ/${JSON.parse(localStorage.getItem('value')).rollno}/?page=${currentPage}&pagerecords=${records}/`,
    //                 headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
    //                 responseType: 'json'
    //             })
    //             dispatch({ 'type': 'success_QueryBlog', payload: data.data });
    //             setPageCount(data.data.count);
    //             setCurrentPageData(data.data.results);
    //         }
    //         catch {
    //             dispatch({ 'type': 'error_QueryBlog', payload: "" });
    //             // H.push('\error');
    //         }
    //     }
    // },[currentPage, onAdd, onRefresh,records ,userFilter]);
    const userPostedQuestions = () => {
        setUserFilter("myposts");
    }
    const addoption = () => {
        setpostvis(false);
    }
    const AddQuestion = async () => {
        console.log("hii");
        const info = { "type": props.type, "posted_by": JSON.parse(localStorage.getItem('value')).rollno, ...details };
        console.log(info);
        dispatch({ "type": "request_addQuestion" });
        try {
            const data = await axios({
                method: "post",
                url: BaseUrl + "PostQueryQ/",
                headers: { "Authorization": "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                responseType: "json",
                data: info
            });
            dispatch({ "type": "success_addQuestion", payload: data.data });
            setAddDisplay("hidden");
            setOnAdd((pre) => !pre);
            setpostvis(true);
        }
        catch {
            setAddDisplay("visible");
        }
        console.log("clicked")
    }
    const TitleExists = async (e) => {
        console.log(e.target.value);
        setDetails((pre) => ({ ...pre, "title": e.target.value }));
        console.log(BaseUrl + `PostQueryQ/${e.target.value}/`);
        dispatch({ 'type': "request_titleExists" });
        try {
            const data = await axios({
                method: "get",
                url: BaseUrl + `PostQueryQ/${e.target.value}/`,
                headers: { "Authorization": "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                responseType: "json"
            })
            console.log(data);
            dispatch({ 'type': "success_titleExists", payload: data.data });
            setTitleDisplay("visible");
        }
        catch {
            dispatch({ 'type': "error_titleExists", payload: "" });
            setTitleDisplay("hidden");
        }
    }
    const onSearch = (val) => {
        setSearchVal(val);
        setUserFilter("onsearch");
    }
    const onDeletePost = async (val) => {
        dispatch({ 'type':"request_QueryBlog"});
        try{
            const data = await axios({
                method:"delete",
                url:BaseUrl+`PostQueryQ/${val}/`,
                headers: { 'Authorization': "Token de5fca1fb449f586b63136af9a12ab5afc96602e" },
                responseType:"json",
            });
            dispatch({ 'type':"success_QueryBlog",payload: data.data });
            setOnDel((pre)=>!pre);
        }
        catch{
            dispatch({ 'type':"error_QueryBlog",payload: "" });
            H.push('/error');
        }
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (records) => {
        setRecords(records);
        setAnchorEl(null);
    };
    const classes = useStyles();
    return (
        <>
            {/* <div className="row PostingBlog fixed-top vh-100" onClick={()=>setpostvis(false)} style={{visibility:(postvis)?"visible":"hidden"}}> */}

            <Alert className="fixed-top"
                style={{ visibility: titleDisplay }}
                severity="error">Cannot be added some error as been occured</Alert>
            <Alert className="fixed-top"
                style={{ visibility: titleDisplay }}
                severity="error">Title already exists</Alert>
            <div
                className="mx-auto boxx QueryPostEditor  px-5 pt-5 shadow fixed-bottom"
                style={{ background: "#d3e0f5", borderRadius: "2rem", bottom: "50%", visibility: (postvis) ? "hidden" : "visible" }}>
                <TextField id="standard-basic"
                    onChange={TitleExists}
                    label="TITLE" /><br />
                <br />
                <TextField
                    // value={values.link}
                    onChange={(e) => setDetails((pre) => ({ ...pre, description: e.target.value }))}
                    id="standard-multiline-static"
                    label="LINK"
                    multiline
                    rows={3}
                // defaultValue=""
                />  <br /> <br />
                <Button id="circleicon"

                    onClick={AddQuestion}
                ><AddIcon id="addcircle" /></Button>
            </div>
            {/* </div> */}
            <div className="loader-spinner" style={{ visibility: (state.loading || state2.loading) ? "visible" : "hidden" }}>
                <div className="spinner-grow text-success mr-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-danger mr-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-warning mr-1" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <div className="container-fluid p-0" style={{ visibility: (state.loading || state3.loading) ? "hidden" : "visible" }}>
                <div className={classes.root}>
                    <AppBar position="static" style={{ background: "#3f50b5" }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer">
                                <RefreshIcon onClick={() => { setUserFilter("all"); }} />
                            </IconButton>
                            <Typography className={classes.title} variant="h6" noWrap>
                                QUERYBLOG
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    onChange={(e)=>onSearch(e.target.value)}
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            {/* <div className="flex flex-wrap justify-align-content-between ml-5"> */}
                            {/* <IconButton
                                style={{ marginLeft: "0.5rem" }}
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer">
                                <FilterListIcon />
                            </IconButton> */}
                            <IconButton
                                style={{ marginLeft: "0.5rem" }}
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                onClick={userPostedQuestions}
                                aria-label="open drawer">
                                <AccountCircleIcon />
                            </IconButton>
                            {/* <div className="mr-4"> */}

                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                // style={{ marginLeft: "0.5rem" }}
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon className="text-white" />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: 'max-content',
                                    },
                                }}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={() => handleClose(option)}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                            {/* </div> */}
                            <IconButton
                                onClick={addoption}
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer">
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>
                {/* <h1>in QueryBlog</h1> */}
                <div >
                    <Accordion style={{background:"#3f50b5",borderRadius:"none"}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className="text-white">Note ⬇️</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="m-0 text-white text-justify text-center">
                            <Typography>
                                click on user icon for your posts and filter the posts with title,
                                type and username who posted it click on the add icon for adding more post.
                                If you switch to your posts to go back please click on refresh icon for all posts
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <Alert 
                style={{ visibility: SearchDisplay,display:(SearchDisplay==="hidden")?"none":"" }}
                className=""
                severity="success">{pageCount} results founded</Alert>
                <div className="loader-spinner" style={{ visibility: (state1.loading) ? "visible" : "hidden" }}>
                    <div className="spinner-grow text-success mr-1" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="spinner-grow text-danger mr-1" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="spinner-grow text-warning mr-1" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                <div class="card-columns my-5  mx-5" onClick={() => setpostvis(true)} style={{ visibility: (state1.loading) ? "hidden" : "visible" }}>
                    {currentPageData.map((v) => (<BlogCards posted_byy={v.posted_by} onDeletePost={onDeletePost} user_type={props.type} posted_on={v.posted_on} type={v.type} title={v.title} description={v.description} />))}
                </div>
                <div className="fixed-bottom BottomPagination">
                    <Pagination style={{ justifyContent: 'center !important' }} onChange={(event, page) => onPageChange(event, page)} count={Math.ceil(pageCount / records)} variant="outlined" color="primary" />
                </div>
            </div>
        </>
    )
}

export default QueryBlog;
