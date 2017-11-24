import React, { Component } from "react";
import classname from "classname";
import styles from "./Dropdown.scss"

export default class Dropdown extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectData: {},
    };
  }

  static defaultProps = {
    optionName: "name",
    optionValue: "value",
    value: -1,
    hasDefault: true,
    defaultOption: "请选择",
  }

  componentDidMount(){
    this.initDropdown(this.props);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.dataSource != nextProps.dataSource || this.props.value != nextProps.value) {
      this.initDropdown(nextProps);
    }
  }

  initDropdown = (props) => {
    let {value, dataSource, optionValue, optionName, defaultOption} = props;
    let selectData = {[optionValue]: -1, [optionName]: defaultOption};
    if (dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i][optionValue] == value) {
          selectData = dataSource[i];
        }
      }
    }
    this.setState({selectData});
  }

  clickBtn = (event) => {
    if (event.timeStamp != this.timeStamp) {
      this.setState({open: true});
      let click = (event) => {
        this.setState({open: false});
        this.timeStamp = event.timeStamp;
        document.removeEventListener("mouseup", click, false);
      }
      document.addEventListener("mouseup", click, false);
    } else {
      this.timeStamp = undefined;
    }
  }

  clickItem = (value, data) => {
    let {dataSource, optionValue, optionName, defaultOption} = this.props;
    let selectData = {[optionValue]: -1, [optionName]: defaultOption};
    if (dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i][optionValue] == value) {
          selectData = dataSource[i];
        }
      }
    }
    this.setState({selectData});
    this.props.onChange && this.props.onChange(value, data);
  }

  render(){
    let {style, className, dataSource, optionName, optionValue, hasDefault, defaultOption,
      btnClassName, btnStyle} = this.props;
    let {selectData, open} = this.state;

    return (
      <span style={style} className={classname(styles.dropdown, className)}>
        <a style={btnStyle} className={classname("btn", btnClassName)} onClick={this.clickBtn}>{selectData[optionName]}</a>
        <ul className={classname(styles.dropdownMenu, open && styles.open)}>
          {hasDefault && <li><a onClick={() => this.clickItem(-1, {})}>{defaultOption}</a></li>}
          {dataSource && dataSource.map((data, index) => {
            return (
              <li key={index}>
                <a onClick={() => this.clickItem(data[optionValue], data)}>{data[optionName]}</a>
              </li>
            );
          })}
        </ul>
      </span>
    );
  }
}
