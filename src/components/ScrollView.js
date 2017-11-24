import React, {Component} from "react";
import styles from "./ScrollView.scss"

export default class ScrollView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: [],
      index: 0
    }
  }
  static defaultProps = {
    width: 300,
    height: 300,
    time: 4000,
    viewWidth: 3
  }
  componentDidMount() {
    let views = this.props.views;
    if (views && views.length > 0) {
      this.state.views = views;
      this.setState({});
      this.interval = setInterval(() => {
        this.setState({
          views: this.changeViews(this.state.views, 1)
        });
      }, this.props.time);
    }
  }
  changeViews = (views, index) => {
    if (index) {
      let item = views[0];
      views.splice(0, 1);
      views.push(item);
    }
    return views;
  }
  componentWillUnmount() {
    if (this.interval)
      clearInterval(this.interval);
    }
  render() {
    let {width, height, viewWidth} = this.props;
    return (
      <div className={styles.scrollviews} style={{width, height}}>
        <div style={{height, width: this.state.views.length * width}}>
          {this.state.views.map((view, index) => {
            return (
              <div key={view.id} className={styles.scrollview} style={{
                transform: `translate(-${viewWidth % 2 * width}px)`,
                height: "100%",
                float: "left",
                width: index == 0 ? 0 : width
              }}>
                {view.view}
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}
