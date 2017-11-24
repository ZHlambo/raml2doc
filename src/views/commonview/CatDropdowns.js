import React, { Component } from "react";
import {connect} from "react-redux";
import Dropdown from "components/Dropdown";
import {getCats, getCatChild} from "redux/reducer/cat";

@connect(state => ({catReducer: state.catReducer}), {getCats, getCatChild})
export default class CatDropdowns extends Component {
  constructor(props){
    super(props);
    this.state = {
      catsDataSource: [],
      selectCats: [],
    };
  }

  componentDidMount(){
    if (!this.props.catReducer.cats) {
      this.props.getCats();
    } else {
      this.setState({catsDataSource: [this.props.catReducer.cats]});
    }
  }

  componentWillReceiveProps(nextProps){
    let {catsDataSource} = this.state;
    if (this.props.catReducer.cats != nextProps.catReducer.cats) {
      this.setState({catsDataSource: [nextProps.catReducer.cats]});
    }
    if (this.props.catReducer.catChild != nextProps.catReducer.catChild) {
      console.log(nextProps.catReducer.catChild);
      if (!!catsDataSource.length && !catsDataSource[catsDataSource.length - 1]) {
        catsDataSource[catsDataSource.length - 1] = nextProps.catReducer.catChild
      } else {
        catsDataSource.push(nextProps.catReducer.catChild);
      }
      this.setState({});
    }
  }

  onChange = (id, cat, level) => {
    let {catsDataSource, parentid, selectCats} = this.state;

    if (id != -1) {
      if (!cat.child) {
        this.props.getCatChild(id, cat);
      }
      catsDataSource.splice(level + 1, catsDataSource.length, cat.child);
      selectCats.splice(level, selectCats.length, cat);
    } else {
      catsDataSource.splice(level + 1, catsDataSource.length);
      selectCats.splice(level, selectCats.length);
      id = selectCats.length ? selectCats[selectCats.length - 1] : undefined;
    }
    this.setState({});
    this.props.onCatSelect && this.props.onCatSelect(id, cat);
  }

  catDropdown = (cats, level) => {
    if (cats) {
      if (cats.length) {
        return (
          <Dropdown key={level} className="margin-left-10" dataSource={cats} optionValue="id" onChange={(id, cat) => this.onChange(id, cat, level)}/>
        );
      } else {
        return "";
      }
    } else {
      return (
        <span key={level} className="margin-left-10 fs-12">加载中...</span>
      );
    }
  }

  render(){
    let {catsDataSource} = this.state;

    return (
      <span>
        <span className="fs-12">分类选择：</span>
        {catsDataSource && catsDataSource.map(this.catDropdown)}
      </span>
    );
  }
}
