import React, {Component} from "react";
import classname from "classname";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import NavList from "components/NavList";
import request from 'redux/request'
import sidebar from "./data";
import styles from "./index.scss"

const getKey = (handler) => {
  return handler.verb + handler.uri.replace(/\//g,"");
}

@connect(state => ({}),{push})
// export default withRouter(connect(mapStateToProp, mapDispatchToProp)(AppContainer));
export default class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlers: window.handlers,
    }
    for (var i = 0; i < this.state.handlers.length; i++) {
    }
  }

  componentDidMount = () => {
    let {handlers} = this.state;
    for (var i = 0; i < handlers.length; i++) {
      this.state.handlers[i].headers = [
        {name: "Authorization", value: ""}
      ];
      this.initTextArea(handlers[i], "req");
      this.initTextArea(handlers[i], "res");
    }
    this.setState({})
  }

  initTextArea = (handler, key) => {
      let textarea = this.refs[`${key}${getKey(handler)}`];
      var editor = CodeMirror.fromTextArea(textarea, {
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "application/ld+json",
        lineWrapping: true
      });
      this.state[`${key}${getKey(handler)}`] = editor;
      editor.setValue("");
      var totalLines = editor.lineCount();
      editor.autoFormatRange({
        line: 0,
        ch: 0
      }, {
        line: totalLines
      });
  }

  clickOpen = (e, handler) => {
    e.stopPropagation();

    handler.open = !handler.open;
    // this.setState({});

    let li = this.refs[`li${getKey(handler)}`];
    li.className = li.className == styles.close ? styles.open : styles.close;
    this.setValue(handler, handler.body && JSON.stringify(handler.body.example || {}) || "", 'req');
  }

  add = (handler) => {
    handler.headers.push({});
    this.setState({});
  }
  remove = (handler, index) => {
    handler.headers.splice(index, 1);
    this.setState({});
  }

  // change = (e, header, key) => {
  //   header[key] = e.target.value;
  //   e.target.focus();
  //   this.setState({})
  // }

  send = (tag, handler) => {
    let api = "http://localhost:3000/manage" + handler.uri;
    let data = this.state[`req${getKey(handler)}`].getValue();
    try {
      data = JSON.parse(data || "");
    } catch (e) {
      data = {}
    } finally {

    }
    let headers = {};
    for (var i = 0; i < handler.headers.length; i++) {
      handler.headers[i].name = this.refs[`header${tag}name${i}`].value;
      handler.headers[i].value = this.refs[`header${tag}value${i}`].value;
      if (handler.headers[i].name) {
        headers[handler.headers[i].name] = handler.headers[i].value;
      }
    }
    console.log(data,headers);
    request[handler.verb](api,{
      headers,
      data
    }).then(e => {
      this.setValue(handler, e, 'res')
    }, e => {
      this.setValue(handler, e, 'res')
    })
  }

  setValue = (handler, data, key) => {
    let editor = this.state[`${key}${getKey(handler)}`];
    editor.setValue(typeof data == "object" ? JSON.stringify(data) : data);
    var totalLines = editor.lineCount();
    editor.autoFormatRange({
      line: 0,
      ch: 0
    }, {
      line: totalLines
    });
  }

  render() {
    let {handlers, headers} = this.state;

    return (
      <div>
        <ul>
          {handlers && handlers.map((handler, tag) => {
            return (
              <li ref={`li${getKey(handler)}`} className={styles.close} key={tag}>
                <div className={styles.handler} onClick={(e) => this.clickOpen(e, handler)}>
                  <div>{handler.uri}</div>
                  <button className={classname(styles[handler.verb], styles.btn)}>{handler.verb}</button>
                </div>
                <div className={styles.urlBody}>
                  <div className={styles.req}>
                    <div className={styles.title}>description:</div>
                    <div>{handler.description}</div>
                    <div className={styles.title}>
                      <span>HEADERS:</span>
                      <button onClick={() => this.add(handler)}>Add</button>
                    </div>
                    {handler.headers && handler.headers.map((header, index) => {
                      return (
                        <div key={header.name + "" + index}>
                          <div className={styles.header}>
                            <input ref={`header${tag}name${index}`} defaultValue={header.name} className={styles.input}/>
                            ：
                            <input ref={`header${tag}value${index}`} defaultValue={header.value} className={styles.input}/>
                            <span onClick={() => this.remove(handler, index)}> X </span>
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <span className={styles.header}>body:</span>
                      <div className={styles.body}>
                        <textarea ref={`req${getKey(handler)}`} className={styles.textarea}></textarea>
                      </div>
                    </div>
                  </div>
                  <div className={styles.res}>
                    <span className={styles.header}>
                      response:
                      <button onClick={() => this.send(tag, handler)}>try it</button>
                    </span>
                    <div className={styles.body} style={{height:"calc(100% - 50px)"}}>
                      <textarea ref={`res${getKey(handler)}`}></textarea>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }
}
