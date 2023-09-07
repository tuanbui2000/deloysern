import React, { Component } from 'react';
import { connect } from "react-redux";
import './CopyrightModal.scss'
import { Modal } from 'reactstrap';

class CopyrightModal extends Component {

    constructor (props) {
        super(props);
        this.state = {


        }
    }
    componentDidMount() {


    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }





    render() {

        // console.log("check prop", this.props);

        // console.log()
        let { isOpenModalCPR, closeCPRModal } = this.props
        return (
            <Modal isOpen={isOpenModalCPR}>

                <>
                    <div className='notice-container'>
                        <div className='notice-body'>
                            <div className='close-btn' onClick={closeCPRModal} >
                                <i className=" icon2 fas fa-poo"> </i>
                                <i className=" icon1 fas fa-poo"></i>
                            </div>
                            <div className='notice-header'>
                                <div className='title'>NOTICE!!! </div>
                            </div>
                            <div className='notice-content'>
                            Trang web này được tạo ra vì mục đích học tập và không có bất kỳ ý định thương mại nào!<div>  Nếu có bất kỳ khiếu nại nào, vui lòng liên hệ với tôi qua email: <a href='https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=namman165@gmail.com'>namman165@gmail.com</a></div>
                            <div> Xin cảm ơn!</div>
                            </div>
                        </div>

                    </div>
                </>
            </Modal>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(CopyrightModal);
