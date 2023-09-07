import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Homeheader.scss'
import logo from '../../assets/logo.svg'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../utils/constant'
import { changeLanguageApp } from "../../store/actions"
import { withRouter } from 'react-router';

class HomeHeader extends Component {
    changeLanguage = (language) => {
        // alert(language);
        //fire redux event:action
        this.props.changeLanguageAppRedux(language)



    }

    returnToHome = (destination) => {
        if (this.props.history) {
            this.props.history.push(`/${destination}`)
        }
    }
    render() {
        // console.log('check props: ', this.props);
        let language = this.props.language;
        // console.log('check language vi-en: ',LANGUAGES.VI,LANGUAGES.EN);
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <img className='header-logo' src={logo} onClick={() => this.returnToHome('home')} />

                        </div>


                        <div className='center-content'>

                            <div className='child-content'>
                                <div className='main-title' onClick={() => this.returnToHome('list/specialty')}><b >    <FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className='sub-title'> <FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title' onClick={() => this.returnToHome('list/clinic')}><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title' onClick={() => this.returnToHome('list/outstandingdoctor')}><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='sub-title'> <FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title' ><b><FormattedMessage id="homeheader.fee" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.check-health" /></div>
                            </div>
                        </div>

                        <div className='right-content'>
                            <div className='support'>
                                <span className='icon-1'>    <i className="fas fa-question-circle"></i>       </span>
                                {/* <span className='icon-2'>    <i className="fas fa-question-circle"></i>       </span> */}
                                <span className='text'>     <FormattedMessage id="homeheader.support" />      </span>

                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI
                                </span>
                            </div>

                            <div
                                className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>


                            <div className='title1' > <FormattedMessage id="banner.title1" />   </div>
                            <div className='title2' > <FormattedMessage id="banner.title2" />    </div>
                            <div className='search' >
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder='Tìm chuyên khoa khám bệnh' />
                            </div>

                        </div>
                        <div className='content-down'>
                            <div className='options' >


                                <div className='option-child'>
                                    <div className='icon-child'> <i className='far fa-hospital'></i> </div>
                                    <div className='text-child'><FormattedMessage id="banner.child1" />  </div>

                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'> <i className='fas fa-mobile-alt'></i> </div>
                                    <div className='text-child'><FormattedMessage id="banner.child2" /></div>

                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'> <i className='fas fa-procedures'></i> </div>
                                    <div className='text-child'><FormattedMessage id="banner.child3" /></div>

                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'> <i className='fas fa-flask'></i>  </div>
                                    <div className='text-child'><FormattedMessage id="banner.child4" /></div>

                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i>  </div>
                                    <div className='text-child'><FormattedMessage id="banner.child5" /></div>

                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'> <i className='fas fa-flask'></i>  </div>
                                    <div className='text-child'><FormattedMessage id="banner.child6" /></div>

                                </div>



                            </div>

                        </div>
                    </div>}
            </>
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));