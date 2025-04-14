import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './assets/styles/app.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppTree = (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

const enableStrict = import.meta.env.VITE_ENABLE_STRICT === 'true';
console.log('enableStrict:', enableStrict);
root.render(
    enableStrict ? <React.StrictMode>{AppTree}</React.StrictMode> : AppTree
);
