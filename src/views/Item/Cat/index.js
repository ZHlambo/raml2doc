import React, {Component} from "react";
import classname from "classname";
import {connect} from "react-redux";
import {getCats, getCatChild, createCat, delCat, putCatInfo} from "redux/reducer/cat";
import styles from "./index.scss"

@connect(state => ({catReducer: state.catReducer}), {getCats, getCatChild, createCat, delCat, putCatInfo})
export default class Cat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getCats({limit: 100});
  }

  componentWillReceiveProps(nextProps){
    if (this.props.catReducer.cats != nextProps.catReducer.cats && nextProps.catReducer.cats) {
      console.log(nextProps.catReducer.cats);
      for (let i = 0; i < nextProps.catReducer.cats.length; i++) {
        nextProps.getCatChild(nextProps.catReducer.cats[i].id, nextProps.catReducer.cats[i]);
      }
    }
  }

  putCatInfo = (cat) => {
    this.props.putCatInfo(cat.id, {
      name: this.refs[cat.id].value
    });
  }

  delCatInfo = (cat) => {
    this.props.delCat(cat.id);
  }

  clickBtn = (cat, type, index, cats) => {
    switch (type) {
      case "fold":
        cat.open = !cat.open;
        if (cat.open) {
          for (var i = 0; i < cat.child.length; i++) {
            if (!cat.child[i].child) {
              this.props.getCatChild(cat.child[i].id, cat.child[i]);
            }
          }
        }
        this.setState({});
        break;
      case "save":
        if (cat.id) {
          this.props.putCatInfo(cat.id, {
            name: this.refs[cat.id].value
          });
        } else {
          console.log(cat.index, this.refs[cat.index]);
          cat.name = this.refs[cat.index].value;
          this.props.createCat({name: cat.name, parentid: cat.parentid}, cat);
        }
        break;
      case "del":
        if (cat.id) {
          this.props.delCat(cat.id, cats);
        } else {
          cats.splice(index, 1);
        }
        this.setState({});
        break;
      case "add":
        cat.open = true;
        // 没有id的用index作为key，remove dom 的时候才能精确remove
        cat.child.push({index: new Date().getTime(),parentid: cat.id});
        this.setState({})
        break;
      default:
        break;
    }
  }

  catList = (cat, index, cats, parentCat) => {
    let open =  cat.open && styles.open;
    let disable =  (!cat.child || cat.child.length == 0) && styles.disable;
    if(cat.index)console.log(cat.index);
    return (
      <li key={cat.id || cat.index} className="padding-5">
        <span className={classname(styles.fold, open, disable)} onClick={() => this.clickBtn(cat, "fold")}></span>
        <input className={styles.input} ref={cat.id || cat.index} defaultValue={cat.name}/>
        <button className="btn margin-left-10" onClick={() => this.clickBtn(cat, "save")}>保存</button>
        <button className="btn margin-left-10" onClick={() => this.clickBtn(cat, "del", index, cats)}>删除</button>
        {cat.id && <button className="btn margin-left-10" onClick={(e) => this.clickBtn(cat, "add")}>添加子类</button>}
        {open && cat.child && <ul className="padding-left-10">
          {cat.child.map((cat, index, cats) => this.catList(cat, index, cats, cat))}
        </ul>}
      </li>
    );
  }

  render() {
    let {cats} = this.props.catReducer;

    return (
      <div>
        <ul className={styles.catList}>
          {cats && cats.map(this.catList)}
        </ul>
      </div>
    );
  }
}
