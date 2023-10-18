<template>
  <ChangeLog class="change-log-md"/>
</template>
<script setup>
import ChangeLog from '../../../CHANGELOG.zh-CN.md'
</script>
<style lang="scss">
.change-log-md {
  font-size: 14px;
  margin-top: -40px;
  h1 {
    font-size: 2em;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 4px;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.5em;
    margin-top: 2.2em;
    margin-bottom: 4px;
  }
  h2 {
    font-size: 1.6em;
    margin: 40px 10px 20px 0;
    padding-left: 9px;
    border-left: 6px solid #5b9df3;
    font-weight: 700;
    line-height: 1.4;
  }
  h3 {
    font-weight: 700;
    font-size: 1.4em;
    line-height: 1.4;
    margin: 20px 0 5px;
    padding-top: 10px;
  }
  h4 {
    font-weight: 700;
    font-size: 1.2em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px;
  }
  h5,
  h6 {
    font-size: 0.9em;
  }
  h5 {
    font-weight: bold;
  }
  h6 {
    font-weight: normal;
    color: #aaa;
  }
  img {
    width: 100%;
    border-radius: 5px;
    display: block;
    margin-bottom: 15px;
    height: auto;
  }
  dl,
  ol,
  ul {
    margin-top: 12px;
    margin-bottom: 10px;
    padding-left: 20px;
    line-height: 1.8;
  }
  p {
    margin: 0 0 10px;
    padding: 0;
    line-height: 1.8;
  }
  a {
    color: #5b9df3;
    text-decoration: none;
  }
  a:hover {
    color: #5b9df3;
    text-decoration: underline;
  }
  a:focus {
    outline-offset: -2px;
  }
  blockquote {
    font-size: 1em;
    font-style: normal;
    padding: 20px 30px 10px;
    margin: 0 0 15px;
    position: relative;
    line-height: 1.8;
    text-indent: 0;
    border: none;
    color: #888;
  }
  blockquote:before {
    content: '“';
    left: 8px;
    top: 0;
    color: #e0e0e0;
    font-size: 3em;
    font-family: Arial, serif;
    line-height: 1em;
    font-weight: 700;
    position: absolute;
  }
  blockquote:after {
    content: '”';
    right: 8px;
    color: #e0e0e0;
    font-size: 3em;
    font-family: Arial, serif;
    line-height: 1em;
    font-weight: 700;
    position: absolute;
    bottom: -20px;
  }
  strong,
  dfn {
    font-weight: 700;
  }
  em,
  dfn {
    font-style: italic;
    font-weight: 400;
  }
  del {
    text-decoration: line-through;
  }
  code {
    display: inline-block;
    padding: 0 3px;
    margin: 0 3px;
    background: rgba(255,229,100,0.2);
    border-radius: 2px;
    color: #1a1a1a;
    font-family: inherit;
  }

  pre {
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857;
    word-break: break-all;
    word-wrap: break-word;
    border-radius: 4px;
    white-space: pre-wrap;
    display: block;
    background: #282c34;
    padding: 10px 20px;
    border: none;
    margin-bottom: 25px;
    color: #cacaca;
    font-family: Courier, sans-serif;
  }
  figure {
    margin: 1em 0;
  }
  figcaption {
    font-size: 0.75em;
    padding: 0.5em 2em;
    margin-bottom: 2em;
  }
  figure img {
    margin-bottom: 0px;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  ol p,
  ul p {
    margin-bottom: 0px;
  }
  li {
    margin-bottom: 0.75em;
    margin-top: 0.75em;
    list-style: circle;
  }
}
</style>
