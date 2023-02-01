import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// Dummy ===================================================
// import App from "./dummy/App";
// import * as serviceWorker from "./dummy/serviceWorker";
// import reducer from "./dummy/store/reducer";
// import config from "./dummy/config";

// const store = createStore(reducer);

// const app = (
//   <Provider store={store}>
//     <BrowserRouter basename={config.basename}>
//       {/* basename="/datta-able" */}
//       <App />
//     </BrowserRouter>
//   </Provider>
// );

// ReactDOM.render(app, document.getElementById("root"));

// serviceWorker.unregister();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// Main =====================================================
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
