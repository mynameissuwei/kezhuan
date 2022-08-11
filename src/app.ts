import { Component } from "react";
import "./app.less";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可

class App extends Component {
  render() {
    return this.props.children;
  }
}

export default App;
