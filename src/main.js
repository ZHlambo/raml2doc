import React, {Component} from "react";
import ReactDOM from 'react-dom'
import routes from './views/router'
import styles from './index.scss'

ReactDOM.render(routes(), document.getElementById('root'))
