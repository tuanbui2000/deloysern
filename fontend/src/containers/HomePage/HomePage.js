import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicaFacility from './Section/MedicaFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HomeFooter from './HomeFooter';
// import CopyrightModal from './CopyrightModal';
import './HomePage.scss';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

class HomePage extends Component {
    // handleAfterChange= (event, )={

    constructor (props) {
        super(props);
        this.state = {
            slidesToShow: this.calculateSlidesToShow(window.innerWidth),
            isOpenModalCPR: true
        };
    }



    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const newWindowWidth = window.innerWidth;
        const newSlidesToShow = this.calculateSlidesToShow(newWindowWidth);

        this.setState({
            slidesToShow: newSlidesToShow
        });
    }



    calculateSlidesToShow(windowWidth) {
        // Tính toán giá trị slidesToShow dựa trên kích thước cửa sổ
        // console.log(windowWidth);
        if (windowWidth >= 1200) {
            return 4;
        } else if (windowWidth >= 847) {
            return 3;
        } else if (windowWidth >= 563) {
            return 2;
        } else {
            return 1;
        }
    }
    closeCPRModal = () => {
        this.setState({
            isOpenModalCPR: false

        })
        // console.log("baasm rooif", this.state);
    }


    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 600,
            slidesToShow: this.state.slidesToShow,
            // slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
        }
        let { isOpenModalCPR } = this.state
        return (
            <div>


                <HomeHeader isShowBanner={true} />
                < Specialty settings={{ ...settings, autoplaySpeed: 6000 }} />
                < MedicaFacility settings={{ ...settings, autoplaySpeed: 3000 }} />
                < OutStandingDoctor settings={{ ...settings, autoplaySpeed: 5000 }} />
                < HandBook settings={settings} />
                <About />
                <HomeFooter />
                {/* <CopyrightModal
                    isOpenModalCPR={isOpenModalCPR}
                    closeCPRModal={this.closeCPRModal} /> */}
            </div>
        );


    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
