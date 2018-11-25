import React from 'react';
import { Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from './components/Header';
import SideBar from './components/SideBar';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex"
  },
  toolbar: theme.mixins.toolbar,
});

function App(props) {
  return (
    <div>
      <header>
        <Header />
      </header>
      <nav>
        <SideBar />
      </nav>
      <main>
        <Route exact path="/" component={Dashboard} />
      </main>
    </div>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);