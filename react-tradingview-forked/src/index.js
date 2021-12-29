import React from "react";
import ReactDOM from 'react-dom';
import { render } from "react-dom";
import {Dashboard} from "./components/dashboard";
import "./app.css";

// class App extends React.Component {
//   render() {
//     return (
//       <div className="AppContainer">
//         <Dashboard />
//       </div>
//     );
//   }
// }

ReactDOM.render(

  <Dashboard />,
  document.getElementById('root')

    

);

// render(<App />, document.getElementById("root"));
