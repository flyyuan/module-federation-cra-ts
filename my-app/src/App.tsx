import React from "react";
import "./App.css";

// 动态加载Scrip
const useDynamicScript = (url: string) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!url) {
      return;
    }

    const element = document.createElement("script");
    element.src = url;
    element.type = "text/javascript";
    // 动态加载
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${url}`);
      setReady(false);
      setFailed(true);
    };

    // 添加到文档 head 处
    document.head.appendChild(element);

    // 通过 useEffect 回收机制注册的监听到需要被销毁时，调用销毁该 Script
    return () => {
      console.log(`Dynamic Script Removed: ${url}`);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    failed,
  };
};

const RemoteReactComponent = ({ url, scope, module, props }
  :{url:string,scope:string,module:string, props?:any}) => {
  const { ready, failed } = useDynamicScript(url);
  
  // 解决依赖版本冲突，让远程 Module 依赖使用当前项目依赖版本。冲突场景：远程 Module 的依赖版本 与当前项目不一致
  if (ready) {
    // 获取当前项目依赖
    const o = (global as any).__webpack_require__ ? (global as any).__webpack_require__.o : {};
    (window as any)[scope].override(
      // 使用当前项目依赖覆盖远程 Module 依赖
      Object.assign(
        {
          react: () => Promise.resolve().then(() => () => require("react")),
          "react-dom": () =>
            Promise.resolve().then(() => () => require("react-dom")),
        },
        o
      )
    );
  }

  if (!ready) {
    return <h2>Loading dynamic script: {url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {url}</h2>;
  }
  const Component = React.lazy(
    async () =>
    // 加载组件的作用域，通过window namespace。可以说 remote module 挂载在 window 上
      await (window as any)[scope].get(module).then((factory:any) => {
        const Module = factory();
        // 返回这个 Module
        return Module;
      })
  );
  console.log({...props})
  return (
    <React.Suspense fallback="Loading System">
      <Component {...props} />
    </React.Suspense>
  );
};

function App() {
  return (
    <div className="App">
      <RemoteReactComponent 
      url="http://localhost:3001/graph1/remoteEntry.js"
      scope="graph1"
      module="graph1"
      props={{number:'46546',name:'sdasdas'}}
      />
    </div>
  );
}

export default App;
