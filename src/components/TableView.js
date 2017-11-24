/**********表格常用属性
dataSource       表格数据，数组类型
title(必传)       [{key:"",name:"",view:"",className:styles.class,style:{width:"50px"},propsKey:"value"}]
                title[index]，定义每一个td  <View?`View`:td `propsKey`={func?func(dataSource[i][`key`]):dataSource[i][`key`]} idy={i}/>
                name:title显示文案，
                propsKey:传入td的数据 对应的key
                key:将dataSource[i][key]作为 传入td的数据
                view：td的视图
                func：处理传入td的数据
                className:td的className,style:td的style
                maxWidth:特殊字段因为td不支持maxWidth百分比，故此需要计算，此maxWidth只能是百分比即0.5=50%
onRowClick      点击表格行的回调事件，{rowData:dataSource[idy],idy,key}  (通过key可知道列,idy为行)
/************辅助属性
style           表格外框div style
className       表格外框div className
tableStyle      表格 Style
tableClassName  表格 ClassName
trStyle         表格每行tr Style
trClassName     表格每行tr ClassName

rowHeight       表格行高，不包括title
titleStyle     title的tr  style样式，默认有样式，传则合并样式
titleClassName  title的tr  className样式，默认有style样式，不加important部分属性会被覆盖
isAverage       （Boolean）是否每个td宽度一致，默认为false

canHover        （Boolean）是否开启整行（tr）hover样式
canclick        （Boolean）是否开启整行（tr）点击样式
selectKey       tr点击选中对应的key if(selectKey) canclick=true canHover=true
defaultSelect   默认选中第一个

editTitle       表格编辑状态的td样式，与title用法一致
editKey         表格编辑状态的editValue对应的key
editValue       dataSource[i][editKey] == editValue 的时候该行（tr）的td使用editTitle样式

maxHeight        table body的最大高度，超过则body滚动（传则可内部滚动，不传则table无限高度）
scrollToBottom   滚动到底部20px时的回调
fetching         （Boolean）是否展示底部加载更多,true的时候滚到底部不调用scrollToBottom
noMore            Boolean）是否展示底部已展示全部，fetching必须为fasle
*/
import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'
import styles from "./scss/TableView.scss";

export default class TableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: "",//选中态的值
      hasScroll:false,//table是否滑动，滑动则需要添加一个固定在头部的title（tr）
    }
  }
  static defaultProps = {
    isAverage: false,
    rowHeight: "35px",
    canHover:true
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.onRowClick && nextProps.defaultSelect && this.props.dataSource!=nextProps.dataSource
      && nextProps.dataSource instanceof Array && nextProps.dataSource.length > 0){
        let change = false
        if(getVOK(this.props,"dataSource.length")){
          for (var i = 0; i < this.props.dataSource.length; i++) {
            if(!nextProps.dataSource[i]
              || this.props.dataSource[i][nextProps.selectKey] != nextProps.dataSource[i][nextProps.selectKey]){
                change = true
              }
          }
        }else{
          change = true
        }
        if(!change) return
        let index = 0
        for (var i = 0; i < nextProps.dataSource.length; i++) {
          if(nextProps.dataSource[i][nextProps.selectKey] == nextProps.defaultSelect){
            index = i
            break;
          }
        }
      this.setState({selectValue:nextProps.dataSource[index][nextProps.selectKey]})
      nextProps.onRowClick({rowData:nextProps.dataSource[index]})
    }
  }
  /*初始状态 即使有滑动固定title效果，固定的title也不显示，因为初始化的td宽度没自适应，一旦滑动就调用updateTable更新table，使固定的title显示*/
  componentDidMount(){
    if (this.props.scrollToBottom) {
      let _this = this
      this.refs.tableBody.onscroll = function() {
        if(!_this.state.hasScroll){
          _this.setState({hasScroll:true})
          $(_this.refs.table).resize(()=>{//base js 里面的最后部分代码，支持了标签级别的resize监听
            _this.updateTable(_this)
          })
        }
        if (this.scrollHeight - this.scrollTop - this.offsetHeight <= 20) {
          if (!_this.props.fetching) _this.props.scrollToBottom && _this.props.scrollToBottom()
        }
      }
    }
    this.timeout = setTimeout(()=>{//延时处理，使得每个td的最小宽度按照minWidth按照实际的fontsize来
      this.setState({})
    },100)
  }
  componentDidUpdate(){
    this.updateTable(this)
  }
  componentWillUnmount(){
    $(this.refs.table).unbind("resize")
    if(this.timeout) clearTimeout(this.timeout)
  }
  updateTable=(_this)=>{
    if (_this.props.title && _this.props.scrollToBottom) {
      for (var i = 0; i < _this.props.title.length; i++) {
        if(_this.refs['nonetitle'+i]) $(_this.refs["blocktitle"+i]).css({width:_this.refs['nonetitle'+i].offsetWidth})//设置title的每个td宽，
      }
    }
  }
  onRowClick = (returnObject) => {
    this.state.selectValue = this.props.selectKey
      ? getVOK(returnObject.rowData,this.props.selectKey)
      : ""
    this.setState({})
    let onRowClick = this.props.onRowClick
    onRowClick && onRowClick(returnObject)
  }
  fontSize = (index,object) =>{
    let self = this.refs["blocktitle"+index] || this.refs["nonetitle"+index]
    let fontSize = self && $(self).css('font-size')
    if(fontSize && typeof fontSize == "string"){
      fontSize = getVOK(object,"name.length")*Number(fontSize.replace("px","")||0)||0
    }
    return fontSize
  }
  creatTDItem = (value, index, data, idy) => {
    let {title,onRowDoubleClick,selectKey,selectValue,editTitle,editKey,editValue} = this.props
    let col = (editKey && (editValue && data[editKey] == editValue || !data[editKey])) ? editTitle[index] : title[index]
    value = col.func ? col.func(value,data) : value
    let returnObject = {rowData: data,idy: idy,key:col.key}
    let tdViewProps = {data,idy,key:col.key,id:col.key.replace(".","")+idy}
    if(getVOK(value,"props.value") == undefined) tdViewProps[col.propsKey || "value"] =  value//传了col.func且是一个标签，标签有赋值的属性则不再赋值
    let onClick = getVOK(col,"view.props.onClick")
    onClick = onClick || getVOK(value,"props.onClick")//配合col.func  return的是一个视图并传递参数
    if (onClick) {tdViewProps.onClick = ()=>onClick(returnObject)}
    let onChange = getVOK(col,"view.props.onChange")
    onChange = onChange || getVOK(value,"props.onChange")//配合col.func  return的是一个视图并传递参数
    if (onChange) {tdViewProps.onChange = (e)=>onChange(e,returnObject)}
    let tdClassName = col.className
    let maxWidth = col.maxWidth && Number(col.maxWidth) && this.refs.table && this.refs.table.offsetWidth*col.maxWidth || col.maxWidth
    let tdStyle = Object.assign({maxWidth},col.style||{})
    let view = col.view
      ? col.view.type
        ? React.cloneElement(col.view, tdViewProps) //view带尖括号则克隆元素
        : React.createElement(col.view, tdViewProps) //view：div，则创建元素
      : value && value.type
        ? React.cloneElement(value, tdViewProps)
        : value
    return <td key={index} style={tdStyle} className={tdClassName} ishidden={col.ishidden}
      onClick={() =>this.onRowClick(returnObject)} onDoubleClick={onRowDoubleClick && (() => onRowDoubleClick(returnObject))}>{view}</td>
  }
  creatTRItem = (data, idy) => {
    let {title,dataSource,rowHeight,trStyle,trClassName,selectKey,selectStyle,defaultSelect,canClick,canHover,
      editTitle,editKey,editValue} = this.props
    title = title || []
    let selectValue = this.state.selectValue || defaultSelect && dataSource[0][selectKey] || ""
    let seleted  = selectKey && selectValue == getVOK(data,selectKey)
    let className = seleted
      ? styles.TRselected
      : selectKey || canClick
        ? styles.cursor
        : canHover && styles.background
    let boxShadow = editKey && (editValue && data[editKey] == editValue || !data[editKey]) ? '1px 0 10px 1px rgba(0, 0, 0, .3)' :""
    let style = Object.assign({height: rowHeight,boxShadow},trStyle||{})
    let array = [];
    for (var i = 0; i < title.length; i++) {
      array.push(title[i].key === "index" ? idy + 1 : getVOK(data, title[i].key)); //添加td展示的数据
    }
    return <tr key={idy} className={classNames(className,trClassName)} style={style}>
      {array&&array.map((value, index) => this.creatTDItem(value, index, data, idy))}
    </tr>
  }

  creatTitle = (display) => {//display为none的是要隐藏的thead，实现thead固定tbody滚动
    let {title,titleClassName,titleStyle,rowHeight,isAverage} = this.props
    title = title || []
    let length = title.length
    let show = !(this.state.hasScroll && display=="none")
    let tdWidth = isAverage
      ? 100 / length + '%'
      : 'auto'
    let style = {
      height: rowHeight,
      width: tdWidth,
      backgroundColor:"white",
      textAlign: 'left',
      color: 'black',
      fontSize: '15px',
      fontWeight: 600,
      borderBottom:`4px ${show?"#f24c38":"transparent"} solid`,
    }
    let styleTR = titleStyle ? Object.assign(style,titleStyle) : style
    if (length > 0) {
      return <thead style={{opacity:show?1:0}}><tr className={classNames(titleClassName)} style={styleTR}>
        {title&&title.map((object,index)=>{
          return <td ref={display+"title"+index} style={{padding:"10px 5px"}} key={index} onClick={()=>{this.props.onTitleClick &&this.props.onTitleClick(object, index)}}>
            <div style={{display:"inline-block",minWidth:this.fontSize(index,object)+"px"}}>{object.name}</div>
          </td>
        })}</tr></thead>
    }
  }
  // <div className={styles.loading}>
  //   <div></div>
  //   <div></div>
  //   <div></div>
  //   <div></div>
  //   <div></div>
  // </div>
  render() {
    let {title,style,className,tableStyle,tableClassName,dataSource,maxHeight,fetching,noMore,scrollToBottom,id} = this.props
    dataSource = dataSource || []
    let minWidth = 0
    if(title){
      for (var i = 0; i < title.length; i++) {
        minWidth += this.fontSize(i,title[i]) + 10
      }
    }
    style=Object.assign({position:"relative",minWidth:minWidth+"px"},style||{})
    //display:"initial" 会使maxHeight失效
    let height = maxHeight || (scrollToBottom&&"100%" || "auto")
    return <div className={className} style={Object.assign({padding:0,clear:"both",height:"100%",marginRight:scrollToBottom&&"10px"},style)}>
        {scrollToBottom && <table className={styles.table} style={{position:"absolute",zIndex:100,display:this.state.hasScroll ? "block" : "none"}}>
          {this.creatTitle("block")}
        </table>}
        <div ref="tableBody" className={scrollToBottom && 'tableParent'} style={{display:!scrollToBottom && "initial",height,marginRight:scrollToBottom ? "-10px" : "0"}}>
        <table id={id} ref="table" className={classNames(styles.table,tableClassName)} style={tableStyle}>
          {this.creatTitle("none")}
          <tbody>
            {dataSource&&dataSource.map(this.creatTRItem)}
          </tbody>
        </table>
        {fetching && <div style={{textAlign:"center",width:"100%",padding:"5px"}}>
        <i className='fa fa-spinner fa-pulse fa-fw' style={{verticalAlign: "bottom",fontSize:"20px"}}></i> 正在加载更多...</div>}
        {!fetching && noMore && <div style={{textAlign:"center",width:"100%",padding:"5px"}}>已展示全部</div>}
        </div>
      </div>
  }
}
