import React, {Component} from "react";
import {connect} from "react-redux"
import {getUrl} from "redux/reducer/auth"

@connect(state=>({authReducer:state.authReducer}),{getUrl})
export default class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.props.getUrl()
    console.log(__KKK);
  }
  componentWillReceiveProps(nextProps){
    console.log(this.props.authReducer,nextProps.authReducer);
  }
  render() {
    return (
      <div>
        AppLayoutAppLayoutAppLayoutAppLayout
        {this.props.children}
      </div>
    )
  }
}
