import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import mixpanel from 'mixpanel-browser';
import { connect } from 'react-redux';

import store from './store';
import { auth, database } from './firebase';
import { addUser } from './store/user';
import { addArtists } from './store/artists';
import { fetchFollowingArtists } from './store/followingArtists';
import {
  Artists, Artist, Videos,
  News, Home, ForYou,
  Landing, TermsOfUse, PrivacyPolicy,
  FAQ, AboutUs, SignUp,
  SignIn, ForgotPassword, EmailVerification,
  Music, Events, ArtistEvents,
  Loading
} from './components';
import { ModalBlockConnect } from './components/blocks/LargeAudioPlayer/modalAudioPlayer';

mixpanel.init("34f4d0ce6ee0830af62b12a7d0e53e1f");

const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#552e89',
      },
    },
    status: {
      danger: 'orange',
    },
});

function PrivateRoute ({component: Component, user, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) =>  {
          if(user) {
            return <Component {...props} />;
          } else {
            return <Redirect to={{pathname: '/', state: {from: props.location}}} />
          }
        }
      }
    />
  )
}

function PublicRoute ({component: Component, user, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => !user
        ? <Component {...props} />
        : <Redirect to='/home' />}
    />
  )
}

class App extends Component {
  state = {
    loading: true,
  }
  componentDidMount () {
    const props = this.props;
    this.removeListener = auth.onAuthStateChanged((user) => {
      if (user) {
        props.addUser(user);
        const userId = user.uid
        const userRef = database.ref(`users/${userId}/artists`)
        userRef.on('value', snapshot => {
          console.log("Data from firebase => ", snapshot.val())
          if(snapshot.val()) {
            props.fetchFollowingArtists(Object.keys(snapshot.val()));
          } else {
            props.fetchFollowingArtists([]);
          }

          this.setState({
            loading: false,
          });

        })
      } else {
        this.setState({
          loading: false,
        });
      }

    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render() {
    if(this.state.loading) {
      return <Loading />
    }

    const user = this.props.user;

    return (
      <BrowserRouter>
        <Switch>
            <PublicRoute exact path='/' user={this.props.user} component={Landing}/>
            <Route exact path='/terms-of-use' user={this.props.user} render={(props) => (<TermsOfUse user={user} {...props}/>)}/>
            <Route exact path='/privacy' user={this.props.user} render={(props) => (<PrivacyPolicy user={user} {...props}/>)}/>
            <Route exact path='/faq' user={this.props.user} render={(props) => (<FAQ user={user} {...props}/>)}/>
            <Route exact path='/about' user={this.props.user} render={(props) => (<AboutUs user={user} {...props}/>)}/>
            {/* <Route exact path='/verify' user={this.props.user} render={(props) => (<EmailVerification user={this.props.user} />)} /> */}
            <PrivateRoute exact path='/home' user={this.props.user} component={Home}/>
            <PrivateRoute exact path='/for-you' user={this.props.user} component={ForYou}/>
            <PrivateRoute exact path='/artists' user={this.props.user} component={Artists}/>
            <PrivateRoute exact path='/artist/:artistName' user={this.props.user} component={Artist}/>
            <PrivateRoute exact path='/videos' user={this.props.user} component={Videos}/>
            <PrivateRoute exact path='/news' user={this.props.user} component={News}/>
            <PrivateRoute exact path='/events/:artistName' user={this.props.user} component={ArtistEvents}/>
            <PrivateRoute exact path='/events' user={this.props.user} component={Events}/>
            <PrivateRoute exact path='/music' user={this.props.user} component={Music}/>
            <PublicRoute exact path='/signup' user={this.props.user} component={SignUp}/>
            <PublicRoute exact path='/login' user={this.props.user} component={SignIn}/>
            <PublicRoute exact path='/reset-password' user={this.props.user} component={ForgotPassword}/>
            <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    )
  }
}

const mapState = state => ({
  ...state
});

const mapDispatch = dispatch => ({
    addUser: userId => dispatch(addUser(userId)),
    addArtists: artists => dispatch(addArtists(artists)),
    fetchFollowingArtists: artists => dispatch(fetchFollowingArtists(artists)),
    fetchFollowingArtistsWithEvents: artists => dispatch(fetchFollowingArtistsWithEvents(artists)),
})

const ChuneApp = connect(mapState, mapDispatch)(App);

// store.subscribe(state => {
//   const
// })
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ChuneApp />
      </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
