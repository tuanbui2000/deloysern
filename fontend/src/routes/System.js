import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect,BrowserRouter as Router ,Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/Patient/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/HandBook/ManageHandbook';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';

class System extends Component {
    render() {


        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <Router >
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">

                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-schedule" component={ManageSchedule} />

                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/manage-handbook" component={ManageHandbook} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>

                    </div>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
