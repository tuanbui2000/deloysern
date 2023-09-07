import React, { Component } from 'react';
import { connect } from "react-redux";
// import './DefaultClass.scss'
// import { FormattedMessage } from 'react-intl';

class DefaultClass extends Component {

    constructor (props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {

     







    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.language !== this.props.language) {
        //     let arrDate = this.getArrayDays(this.props.language);
        //     this.setState({
 
        //     })
        // }



    }


    render() {


        return (
            <div className='container'>
              

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,


    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
