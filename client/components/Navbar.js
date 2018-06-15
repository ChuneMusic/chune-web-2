import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';

import SearchForm from './SearchForm'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const styles = theme => ({
    root: {
      flexGrow: 1,
      height: 74,
      backgroundColor: "#552e89",
      transition: 'all 0.8s',
    },
    indicator: {
      backgroundColor: "white",
      height: 5,
    },
    logoContainer: {
      height: 74,
      width: 95,
      paddingLeft: 25,
      paddingTop: 22,
      align: "center"
    },
    tabContainer: {
      alignItems: 'flex-end',
      alignContent: 'flex-end',
      justify: 'center',
    },
    thetab: {
      height: 74,
      minWidth: 80,
      width: 90,
    },
    tabLabel: {
      fontFamily: "Roboto",
      fontSize: 20,
      fontWeight: "normal",
      lineHeight: "normal",
      letterSpacing: 0.3,
      textAlign: "right",
      textTransform: 'none',
    },
    avatar: {
      width: 32,
      height: 32
    },
    avatarContainer: {
      height: 74,
      display: "flex",
      alignItems: "center",
      alignContent: "flex-end",
      justifyContent: "flex-end",
      textAlign: "right",
      marginRight: 24,
      cursor: "pointer",
    },
});

class Navbar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: props.value,
        searching: false,
      };
    }

    handleChange(event, value) {
      this.setState({ value });
    }

    toggleSearch = () => {
      this.setState({searching: !this.state.searching});
    }

    render() {

      const { classes } = this.props;
      const { value, searching } = this.state;

      const searchForm = <SearchForm cancelSearch={ this.toggleSearch } />;

      const normalMenu = (
        <div className={classes.root}>
          <AppBar position="static" className={classes.root}>
            <Grid
              container
              alignItems="flex-end"
              alignContent="flex-end"
              direction="row"
              justify="center"
              >
              <Grid item xs={5}>
                <div className={classes.logoContainer}>
                  <img src="images/logo.svg" />
                </div>
              </Grid>
              <Grid item xs={7}>
                <Grid
                  container
                  justify="space-between">
                  <Grid item xs={2} />
                  <Grid
                    item
                    xs={8}>
                    <Tabs value={value} onChange={this.handleChange.bind(this)} fullWidth={true} classes={{root: classes.tabContainer, indicator: classes.indicator}}>
                      <Tab
                        label={<span className={classes.tabLabel}>Home</span>}
                        component={Link}
                        to="/"
                        className={classes.thetab} />
                      <Tab
                        label={<span className={classes.tabLabel}>Artists</span>}
                        component={Link}
                        to="/artists"
                        className={classes.thetab} />
                      <Tab
                        label={<span className={classes.tabLabel}>Articles</span>}
                        component={Link}
                        to="/news"
                        className={classes.thetab} />
                      <Tab
                        label={<span className={classes.tabLabel}>Videos</span>}
                        component={Link}
                        to="/videos"
                        className={classes.thetab} />
                      <Tab
                        label={<span className={classes.tabLabel}>Events</span>}
                        component={Link}
                        to="/events"
                        className={classes.thetab} />
                    </Tabs>
                  </Grid>
                  <Grid
                    item
                    xs={1}>
                    <div className={classes.avatarContainer}>
                      <Avatar
                        alt="Remy Sharp"
                        src="http://via.placeholder.com/32x32"
                        component={Link}
                        to="/account"
                        className={classes.avatar} />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={1}>
                    <div className={classes.avatarContainer} onClick={this.toggleSearch.bind(this)}>
                      <SearchIcon ></SearchIcon>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AppBar>
        </div>

      );

      return searching ? searchForm : normalMenu;
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = store => ({ userID: store.user })

export default withStyles(styles)(connect(mapState, null)(Navbar));
