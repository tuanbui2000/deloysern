
import React, { Component } from 'react';
import { connect } from 'react-redux';


class HomeFooter extends Component {





    render() {
        let style = { 
            color: 'red',
            fontSize: '16px',
            backgroundColor: 'lightgray'
 }
        return (
            <div className='home-footer'>
                <p>&copy; 2023 buidinhtuan. More information <a target="_blank" href='https://www.facebook.com/profile.php'>Click here</a> </p>
                <div className='notice' style={{border:'1px solid gray'}}>
                    {this.props.language === 'vi' &&
                        <div style={style} className='notice-content'>Trang web này đã được tạo ra vì mục đích học tập và không có bất kỳ ý định thương mại nào!<div>  Nếu có bất kỳ khiếu nại nào, vui lòng liên hệ với tôi qua email: <a href='https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=namman165@gmail.com'>namman165@gmail.com</a></div>
                            <div> Xin cảm ơn!</div>
                          </div>


                    }
                    {
                        this.props.language === 'en' &&
                        <div style={style} className='notice-content'>This website has been created for educational purposes and does not have any commercial intent!!
                                <div>  If there are any complaints, please contact me via email: <a href='https://mail.google.com/mail/u/0/?tf=cm&fs=1&to=namman165@gmail.com'>namman165@gmail.com</a> </div>
                                <div> Thanks & Best regards!</div>
                           </div>

                    }
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
