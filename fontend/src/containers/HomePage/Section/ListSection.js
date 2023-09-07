import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListSection.scss'
import { FormattedMessage } from 'react-intl'
import * as actions from "../../../store/actions"
import { LANGUAGES } from '../../../utils'

import { getAllSpecialty, getAllClinic, getAllHandbook } from '../../../services/userService';
import { withRouter } from 'react-router';


class ListSection extends Component {
    constructor (props) {
        super(props)
        this.state = {
            secsionName: this.props.match.params && this.props.match.params.name ? this.props.match.params.name : '',
            datalist: []
        }
    }

    async componentDidMount() {
        let { secsionName } = this.state
        if (secsionName && secsionName === "specialty") {
            let res = await getAllSpecialty();
            if (res && res.errCode === 0) {
                this.setState({
                    datalist: res.data ? res.data : []
                })
            }
        } else if (secsionName && secsionName === "outstandingdoctor") {
            this.props.loadTopDoctors();
            this.setState({
                datalist: this.props.topDoctorsRedux
            })


        } else if (secsionName && secsionName === "clinic") {
            let res = await getAllClinic();
            if (res && res.errCode === 0) {
                this.setState({
                    datalist: res.data ? res.data : []
                })
            }


        } else if (secsionName && secsionName === "handbook") {
            let res = await getAllHandbook();
            if (res && res.errCode === 0) {
                this.setState({
                    datalist: res.data ? res.data : []
                })
            }

        }

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                datalist: this.props.topDoctorsRedux
            })

        }

    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`)
        }
    }

    handleViewDetailDoctor = (doctor) => {
        // console.log("check doctor detail: ", doctor);
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }

    }
    handleback = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }
    handleViewDetailHandbook = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${item.id}`)
        }
    }
    render() {
        let { language } = this.props;
        let { datalist, secsionName } = this.state
        // datalist = [...datalist, ...datalist]

        // console.log("check cdm",this.state);
        return (
            <div className='section-share '>
                <div className='list-header'>

                    <div className='wrapper-header'>
                        <i onClick={() => this.handleback()} className="fas fa-arrow-left back-arrow"></i>
                        <span className='title-list'>
                            {secsionName && secsionName === "specialty" && <FormattedMessage id="homepage.popular-specialties" />}
                            {secsionName && secsionName === "outstandingdoctor" && <FormattedMessage id="homepage.outstanding-doctor" />}
                            {secsionName && secsionName === "clinic" && "clinic"}
                            {secsionName && secsionName === "handbook" && <FormattedMessage id="menu.admin.handbook" />}
                        </span>
                    </div>
                </div>
                <div className='section-container'>



                    <div className='section-list-body'>

                        {secsionName && secsionName === "outstandingdoctor" && datalist && datalist.length > 0 &&
                            datalist.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                }
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                return (

                                    <div className='section-customize list-child' key={index}
                                        onClick={() => this.handleViewDetailDoctor(item)}  >


                                        <div className='outer-bg'>
                                            <div className='list-doctor-image section-list'
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                            > </div>
                                        </div>
                                        <div className='list-name '>    {language === LANGUAGES.VI ? nameVi : nameEn}
                                        </div>

                                    </div>

                                )
                            })

                        }{

                            secsionName && secsionName === "specialty" &&
                            datalist && datalist.length > 0 &&
                            datalist.map((item, index) => {
                                return (
                                    <div className='section-customize list-child' key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div className='bg-image section-list'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        > </div>
                                        <div className='list-name'>{item.name}</div>
                                    </div>
                                )

                            })
                        }
                        {

                            secsionName && secsionName === "clinic" &&
                            datalist && datalist.length > 0 &&
                            datalist.map((item, index) => {
                                return (
                                    <div className='section-customize list-child' key={index}
                                        onClick={() => this.handleViewDetailClinic(item)}
                                    >
                                        <div className='bg-image section-list'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        > </div>
                                        <div className='list-name'>{item.name}</div>
                                    </div>
                                )

                            })
                        }
                        {

                            secsionName && secsionName === "handbook" &&
                            datalist && datalist.length > 0 &&
                            datalist.map((item, index) => {
                                return (
                                    <div className='section-customize list-child' key={index}
                                        onClick={() => this.handleViewDetailHandbook(item)}
                                    >
                                        <div className='bg-image section-list'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        > </div>
                                        <div className='list-name'>{item.name}</div>
                                    </div>
                                )

                            })
                        }












                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctors())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListSection));
