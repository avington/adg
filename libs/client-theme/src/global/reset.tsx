import { createGlobalStyle } from 'styled-components';

const GlobalResetStyle = createGlobalStyle`
    /* CSS Reset */
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body {
        height: 100%;
        width: 100%;
        font-family: inherit;
        background: #fff;
        color: inherit;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    body {
        min-height: 100vh;
        font-family: 'Source Code Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    img, picture, video, canvas, svg {
        display: block;
        max-width: 100%;
    }

    input, button, textarea, select {
        font: inherit;
        color: inherit;
        background: none;
        border: none;
        outline: none;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    ul, ol {
        list-style: none;
    }
`;

export default GlobalResetStyle;
