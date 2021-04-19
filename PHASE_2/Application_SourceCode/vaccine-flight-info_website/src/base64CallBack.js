import React, { useState } from "react";
import FileBase64 from "react-file-base64";

const App2 = () => {
  const [files, setFiles] = useState({});
  console.log(files.base64);
  return (
    <>
      <FileBase64
        multiple={false}
        onDone={x => {
          setFiles(x);
          console.log("x", x);
        }}
      />
      <div style={{ position: "fixed", padding: 20, width: 300, height: 300 }}>
        <text
          disabled
          style={{
            wordwrap: "break-word",

            width: "80%",
            height: "100%",
            display: "inline-block"
            //flexDirection: "column"
          }}
        >
          {files.base64}
        </text>
      </div>
    </>
  );
};

export default App2;