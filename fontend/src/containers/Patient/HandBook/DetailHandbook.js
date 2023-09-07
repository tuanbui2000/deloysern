import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailHandbook.scss'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import HandBook from '../../../containers/HomePage/Section/HandBook';
import HomeFooter from '../../HomePage/HomeFooter';
import '../../../containers/HomePage/HomePage.scss';
import { getDetailHandbook } from '../../../services/userService';
import _ from 'lodash';
import { withRouter } from 'react-router';
class DetailHandbook extends Component {

    constructor (props) {
        super(props);

        this.state = {

            detailHandbook: '',
            headings: [],
            slidesToShow: this.calculateSlidesToShow(window.innerWidth),
            id: this.props.match && this.props.match.params && this.props.match.params.id ? this.props.match.params.id : ''
        }

    }


    async componentDidMount() {
        if (this.state.id) {
            this.getdata(this.state.id)
        }

    }
    getdata = async (id) => {

        let res = await getDetailHandbook(id);
        if (res && res.errCode === 0) {
            this.setState({
                detailHandbook: res.data ? res.data : []
            })
        }
        const headings = Array.from(document.querySelectorAll("h2, h3")).map(
            (heading) => ({
                id: heading.id,
                text: heading.textContent,
            })
        );
        this.setState({ headings: headings });
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


    scrollToTop = () => {

        console.log(" scroll to top , i used window.scrollto(0,0). but didn't work "); 
       
    };

    async componentDidUpdate(prevProps, prevState) {
        let id = this.props.match.params.id
        if (prevState.id !== id) {

            this.getdata(id)
            this.setState({
                id: id
            })

            this.scrollToTop()
        }


       
            // Check if props or state have changed that require scrolling to top
            if (prevState.id !== id) {
              window.scrollTo(0, 0);
            }
          
    }

    calculateSlidesToShow(windowWidth) {
        // Tính toán giá trị slidesToShow dựa trên kích thước cửa sổ
    
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

    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }

    render() {
        let { detailHandbook, headings } = this.state
      

        let settings = {
            dots: false,
            infinite: true,
            speed: 600,
            slidesToShow: this.state.slidesToShow,
          
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
        }

        return (
            <>

                <HomeHeader isShowBanner={false} />
                <div className='detail-handbook-container'>
                    <div className='detail-handbook-body'>

                        <div className=' detail-handbook-content'>
                            <div className='hb-img'
                                style={{ backgroundImage: `url(${detailHandbook.image ? detailHandbook.image : ''})` }}
                            > </div>
                            <div className='detail-hanbook-title'>
                                {detailHandbook.name}
                            </div>



                            {detailHandbook && !_.isEmpty(detailHandbook) &&

                                <div dangerouslySetInnerHTML={{ __html: detailHandbook.hanbookContentHTML }} >
                                </div>}

                        </div>
                        <div className='detail-handbook-mokuji'>
                           <span>   <FormattedMessage id="patient.handbook.table-of-content" />  </span>
                            <ul>
                                {headings.map((heading, index) => (
                                    <li key={index}>
                                        <a className='table-of-contents' href={`#${heading.id}`} onClick={() => this.scrollToTop()}>{heading.text}</a>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    </div>
                    < HandBook settings={settings} inDetailHandbook={true} />
                    <HomeFooter />
                </div>
                <button  onClick={() =>this.scrollToTop()}>scrollTo</button>
            </>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailHandbook));
