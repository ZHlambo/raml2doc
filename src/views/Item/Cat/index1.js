import React, {Component} from "react";
import classname from "classname";
import {connect} from "react-redux";
import NavList from "components/NavList"
import {getCats, getCatChild, delCat, putCatInfo} from "redux/reducer/cat";
import styles from "./index.scss"

@connect(state => ({catReducer: state.catReducer}), {getCats, getCatChild, delCat, putCatInfo})
export default class Cat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getCats({limit: 100});
  }

  clickBtn = (cat, type, e, clickCB) => {
    switch (type) {
      case "save":
        this.props.putCatInfo(cat.id, {
          name: this.refs[cat.id].value
        });
        break;
      case "del":
        this.props.delCat(cat.id);
        break;
      case "del":
        this.props.delCat(cat.id);
        break;
      case "add":
        cat.child.push({});
        this.setState({})
        break;
      default:
        break;
    }
  }

  catList = (cat, index, tag, clickCB) => {
    let open =  cat.open && styles.open;
    let disable =  !cat.child || cat.child.length == 0 && styles.disable;
    if(cat.id ==1)console.log(cat);
    return (
      <li key={index} className="padding-5">
        <span className={classname(styles.fold, open, disable)} onClick={(e) => clickCB(e, cat)}></span>
        <input className={styles.input} ref={cat.id} defaultValue={cat.name}/>
        <button className="btn margin-left-10" onClick={() => this.clickBtn(cat, "save")}>保存</button>
        <button className="btn margin-left-10" onClick={() => this.clickBtn(cat, "del")}>删除</button>
        {cat.child && <ul className="padding-left-10">
          {cat.child.map((cat, index) => this.catList(cat, index, tag + 1, clickCB))}
          {cat.child && <li>
            <button className="btn margin-left-10" onClick={(e) => {
              this.clickBtn(cat,"add");
            }}>添加分类</button>
            </li>}
        </ul>}
      </li>
    );
  }
  itemClick = (cat) => {
    for (let i = 0; i < cat.child.length; i++) {
      if (!cat.child[i].child) {
        this.props.getCatChild(cat.child[i].id, cat.child[i]);
      }
    }
    cat.open = !cat.open;
    this.setState({});
  }

  render() {
    let {cats} = this.props.catReducer;

    return (
      <div>
        <NavList dataSource={cats} itemClick={this.itemClick} itemView={this.catList} valueKey="id" lastReact={false}/>
      </div>
    );
  }
}
