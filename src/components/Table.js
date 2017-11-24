/*
  selectKey         string      选中状态row的唯一key，if(selectKey)则可点击整行响应

  dataSource        array       数据源
  header            array       定义列表头部显示的内容以及 解析dataSource（顺序key->func->view）
                                value = dataSource[row][key]
                                rowData = dataSource[row]
                                itemData = {rowData,column,row,value}
                                propsObj = {
                                  [header[column].propsKey]:value,
                                  onClick:header[column].view.onClick(itemData),
                                  onChange:header[column].view.onChange(itemData)
                                }
      header[column].name     string        thead->td头部内容
      header[column].key      string        td展示内容为：value
      header[column].func     func          td展示内容为：header[column].func(value, rowData, itemData)
      header[column].view     func          td展示内容为：header[column].view(value, rowData, itemData) 并且传递propsObj
      header[column].view     class         td展示内容为：header[column].view 并且传递propsObj
      header[column].propsKey string


*/

import React, {Component} from "react";
import classname from "classname";
import {getVOO, formatterDate} from 'static/utils'
import styles from "./Table.scss";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {}

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource != nextProps.dataSource) { // dataSource 变化需要重新计算宽度
      this.setState({change: true});
    } else {
      this.setState({change: false});
    }
  }

  componentDidMount() {
    let _this = this, {loadMore, fetching, noMore} = this.props;
    if (loadMore) {
      this.refs.tableBody.onscroll = function() {
        if (!_this.state.scroll) {
          _this.setState({scroll: true, change: true});
          // _this.refs.tableBody.onresize = ()=>{
          //   console.log("adfa");
          // }
          // window.aa = _this.refs.tableBody
        }
        if (this.scrollHeight - this.scrollTop - this.offsetHeight <= 20) {
          // if (!fetching && !noMore) {} 回调会有延迟，可能连续抛两次，故判断条件放外部
          loadMore();
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.state.change && this.state.scroll) {
      this.updateHeaderWidth(this);
    }
  }

  updateHeaderWidth = (_this) => {
    if (_this.props.header && _this.props.loadMore) {
      let height = 0;
      for (var i = 0; i < _this.props.header.length; i++) {
        if (_this.refs['header' + i]) {
          _this.refs["scrollheader" + i].style.width = _this.refs['header' + i].clientWidth + "px"; //设置title的每个td宽，
        }
      }
      _this.refs.scrollheader.style.width = _this.refs.header.offsetWidth + "px";
    }
  }

  parseValue = (value, data, itemData) => {
    if (typeof data.func == "function") {
      value = data.func(value, itemData.rowData, itemData);
    }
    return value;
  }

  parseView = (value, data, itemData) => {
    let view = data.view,
      propsKey = data.propsKey || "value",
      realView = view,
      onClick,
      onChange,
      propsObj = {
        [propsKey]: itemData.value
      };
    if (typeof view == "function" && !view.defaultProps) { // view.defaultProps 区分function还是class
      realView = view(value, itemData.rowData, itemData);
    }
    if (realView) {
      onClick = getVOO(realView, "props.onClick");
      if (onClick)
        propsObj.onClick = ()=> onClick(itemData);
      onChange = getVOO(realView, "props.onChange");
      if (onChange)
        propsObj.onChange = ()=> onChange(itemData);

      realView = realView.type
        ? React.cloneElement(realView, propsObj) //view带尖括号则克隆元素
        : React.createElement(realView, propsObj) //view：div，则创建元素
      return realView;
    }
    return value;
  }

  bodyTR = (rowData, row) => {
    let {header, selectKey, selectValue, rowClick} = this.props;
    let className = classname(selectKey ? styles.canClick : "", rowData.id == selectValue ? styles.select : "");
    rowClick = rowClick || new Function();
    return (
      <tr key={row} className={className}>
        {header && header.map((data, column) => {
          let itemData = {rowData, column, row, selectValue},
            value = getVOO(rowData, data.key);
          value = data.propsKey == "date" ? formatterDate(value) : value; // lambo 偷懒
          value = this.parseValue(value, data, itemData);
          itemData.value = value;
          let view = this.parseView(value, data, itemData);
          return (
            <td key={column} style={data.style} data-d={itemData.column} className={data.className} onClick={() => rowClick(itemData)}>{view}</td>
          );
        })}
      </tr>
    );
  }

  headerTR = (scrollHeader) => {
    let {header} = this.props;
    return (
      <tr>
        {header && header.map((data, index) => {
          return (
            <td ref={(scrollHeader ? "scroll" : "") + "header" + index} key={index}>{data.name}</td>
          );
        })}
      </tr>
    );
  }

  bottomView = (text) => {
    return (
      <div style={{
        textAlign: "center",
        padding: "5px"
      }}>{text}</div>
    );
  }

  render() {
    let {className, style, dataSource, fetching, noMore, loadMore} = this.props;
    let {scroll} = this.state;

    return (
      <div style={style} className={classname(styles.table, className)}>
        <div className={styles.body} ref="tableBody">
          <table ref="header">
            <thead>
              {this.headerTR(0)}
            </thead>
            <tbody>
              {dataSource && dataSource.map(this.bodyTR)}
            </tbody>
          </table>
          {fetching && this.bottomView("正在加载更多...")}
          {!fetching && (noMore
            ? this.bottomView("已展示全部")
            : noMore != undefined && this.bottomView(
              <span className="pointer" onClick={loadMore}>查看更多</span>
            ))}
        </div>
        <table ref="scrollheader" style={{
          opacity: scroll
            ? 1
            : 0
        }}>
          <thead>
            {this.headerTR(1)}
          </thead>
        </table>
      </div>
    );
  }
}
