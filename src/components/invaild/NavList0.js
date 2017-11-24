import React, {Component} from "react";
import styles from "./NavList.scss"

export default class NavList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    if (this.refs[this.props.value]) {
      this.init = false;
      this.refs[this.props.value].click();
    }
  }

  componentWillReceiveProps(nextProps){}

  getChildHeight = (element) => {
    let height = 0;
    for (var i = 0; i < element.childNodes.length; i++) {
      height += element.childNodes[i].offsetHeight;
    }
    return height;
  }

  getParentElement = (element, tagName) => {
    if (element == this.refs.body) {
      return ;
    }
    if (element && element.parentElement) {
      if (element.parentElement.tagName == tagName) {
        return element.parentElement;
      } else {
        return this.getParentElement(element.parentElement, tagName);
      }
    }
  }

  setParentElementHeight = (ul, height) => {
    let parent = this.getParentElement(ul, "UL");
    if (parent && parent.getAttribute("class") === styles.nav) {
      parent.style.height = this.getChildHeight(parent) + height + "px";
      this.setParentElementHeight(parent);
    }
  }

  clickLi = (e, data) => {
    e.stopPropagation();
    let ul = e.currentTarget.getElementsByTagName("ul")[0];// bug
    if (!this.init && !ul) {// 初始化的时候点击展开父类ul，而不是响应点击时间
      this.init = true;
      ul = this.getParentElement(e.currentTarget,"UL");
    }
    if (!ul) {//  不存在则列表无子列表，回调点击事件，并获取父类ul，确定是否折叠；
      this.props.itemClick && data && this.props.itemClick(data);
      return ;
    }
    //  存在则列表还有子列表，则计算展开或折叠高度；
    let uls = this.refs.body.getElementsByTagName("ul");
    for (var i = 0; i < uls.length; i++) {
      if (uls[i] != ul)
        uls[i].style.height = "0px";
    }
    let height = this.getChildHeight(ul);
    let close = ul.style.height && ul.style.height != "0px";
    ul.style.height = close ? "0px" : (height + "px");
    this.setParentElementHeight(ul, close ? 0 - height : height);
  }

  item = (data, index, tag) => {
    let paddingLeft = {
      paddingLeft: (tag + 1) * 15,
      background: this.props.value == data.value ? "#f5f5f5" : "unset"
    };

    return (
      <li ref={data.value} key={index} onClick={e => this.clickLi(e, data)}>
        <div>
          <div style={paddingLeft} className={styles.hover}>
            {data.name}
          </div>
          {data.view && <ul className={styles.nav}>
            {data.view.map((data, index) => this.item(data, index, tag + 1))}
          </ul>}
        </div>
      </li>
    );
  }

  render() {
    let {dataSource} = this.props;

    return (
      <div className={styles.body}>
        <ul className={styles.nav} ref="body">
          {dataSource && dataSource.map((data, index) => this.item(data, index, 0))}
        </ul>
      </div>
    );
  }
}
