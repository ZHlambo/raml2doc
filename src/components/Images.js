import React, {PropTypes, Component} from 'react';
import {IMAGE_PREFIX, NOPICTRUE} from 'redux/api';
import {getVOO} from 'static/utils';

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  static defaultProps = {
    size: 80
  }
  getImageArray = () => {
    let src = [];
    let {value, size} = this.props;

    if (value instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        if (value[i].indexOf("http") != 0) {
          src[i] = IMAGE_PREFIX + value[i];
        } else {
          src[i] = value[i];
        }
      }
    } else if (value) {
      let temp = value.split(",");
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].indexOf("http") != 0) {
          src[i] = IMAGE_PREFIX + temp[i];
        } else {
          src[i] = temp[i];
        }
      }
    }
    if (src.length > 0) {
      return src;
    } else {
      return '';
    }
  }
  onError = () => {
    let {size, style} = this.props
    this.refs.img.src = NOPICTRUE + "?imageView2/0/h/" + size;
    if (style && style.height) {
      this.refs.img.src = NOPICTRUE + "?imageView2/0/h/" + Number((style.height + "").replace("px", "")).toFixed(0);
    } else if (style && style.width) {
      this.refs.img.src = NOPICTRUE + "?imageView2/0/h/" + Number((style.width + "").replace("px", "")).toFixed(0);
    }
  }
  render() {
    let styles = {
      width: '80px',
      height: "80px"
    }
    let {size, style} = this.props
    if (style && style.height) {
      size = Number((style.height + "").replace("px", "")).toFixed(0);
    } else if (style && style.width) {
      size = Number((style.width + "").replace("px", "")).toFixed(0);
    }
    return (<img ref='img' style={styles} src={getVOO(this.getImageArray(), "0") + "?imageView2/0/h/" + size} onError={this.onError} {...this.props}/>)
  }
}
