export class Base {
  constructor () {
  }

  /*
    Levels:
        0 = Application not initialized
        1 = Application initialization phase started
        2 = Load Core Modules and Models
        3 = Apply Environment Configurations
        4 = Starting Background Components
        5 = Render Main Interface
        6 = Application Ready

  */
  // async log(message, title=null, objectName=null, methodName=null) {
  //   const stack = (new Error()).stack;
  //   console.log(' stack: ', stack);

  //   const lines = stack.split('\n');
  //   console.log(' lines: ', lines);

  //   let result = { class: 'Unknown', method: 'Unknown' };

  //   const regexChrome  = /at (?:new |(.*?)\.)?(\w+) \(/;
  //   const regexFirefox = /(\w+)(\.\w+)?@/;

  //   // for(const line of lines) {
  //   //   console.log(' for line: ', line);
  //   // }

  //   // console.log(' matchChromeNode: ', matchChromeNode);
  //   // console.log(' matchFirefox: ', matchFirefox);

  //   // const firefoxNode = lines[4];

  //   if (lines[0] == "Error") {
  //     console.log(' chrome detected: ', lines[0]);
  //     // const chromeNone = lines[2];

  //     const matchChromeNode = lines[2].match(/at (?:new |(.*?)\.)?(\w+) \(/);

  //     // Grupo 1: Nome da Classe ou undefined/null se for uma função solta
  //     // Grupo 2: Nome do Método
  //     result.class  = matchChromeNode[1] || 'Global/Anonymmus';
  //     result.method = matchChromeNode[2];
  //   }


  //   // console.log(' lines[4]: ', lines[4]);
  //   // const matchFirefox = lines[4].match(/(\w+)(\.\w+)?@/);
  //   // console.log(' testing firefox detect: ', matchFirefox);



  //   if(lines[0] != "Error") {
  //        // Formato Firefox pode ser: "metodo@..." ou "Classe.metodo@..."
  //     console.log(' firefox detected: ', lines[4]);

  //        // if (matchFirefox) {
  //           // Se o nome incluir a classe (ex: 'Classe.metodo'), separamos
  //           const line_array1 = lines[2].split('/');
  //           if (line_array1.length > 1) {
  //               result.class = line_array1[0];
  //           } else {
  //               // Caso não tenha ponto, é só o método
  //               result.class = 'UnknownObjectClass';
  //           }

  //           const line_array2 = lines[1].split('@');
  //           if (line_array2.length > 1) {
  //               result.method = line_array2[0];
  //           } else {
  //               // Caso não tenha ponto, é só o método
  //               result.method = 'UnknownMethod';
  //           }
  //        // }
  //   }


  //   console.log(result);
  // }


async log(message, title = null) {
  const stack = (new Error()).stack || "";
  console.log(' stack: ', stack);
  const lines = stack.split("\n").map(l => l.trim());

  let result = {
    class: "Unknown",
    method: "Unknown",
    file: "Unknown",
    line: null,
    column: null
  };

  const isFirefox = !lines[1]?.includes("at ");
  const regexChrome  = /at (?:new\s+)?(?:(.*?)\.)?(\w+)\s*\((.*?):(\d+):(\d+)\)/;
  const regexFirefox = /(?:(.*?)\/)?(?:(.*?)\.)?(\w+)@(.+):(\d+):(\d+)/;

  let methodFound = null;
  let classFound  = null;
  let fileFound   = null;
  let lineFound   = null;
  let colFound    = null;

  // skip the first line (the current log() call)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // 🔹 Chrome / Node.js
    if (!isFirefox) {
      const match = line.match(regexChrome);
      if (match) {
        result.class  = match[1] || "Global/Anonymous";
        result.method = match[2];
        result.file   = match[3]?.split("/").pop() || "Unknown";
        result.line   = parseInt(match[4], 10);
        result.column = parseInt(match[5], 10);
        break;
      }
    }

    // 🔹 Firefox
    else {
      // 1️⃣ método sem classe
      const matchMethod = line.match(/^(\w+)@(.+):(\d+):(\d+)/);
      if (matchMethod && !methodFound) {
        methodFound = matchMethod[1];
        fileFound   = matchMethod[2]?.split("/").pop();
        lineFound   = parseInt(matchMethod[3], 10);
        colFound    = parseInt(matchMethod[4], 10);
        continue;
      }

      // 2️⃣ classe, pode vir com ou sem "/"
      const matchClass = line.match(/^(\w+)(?:\/<)?@(.+):(\d+):(\d+)/);
      if (matchClass && methodFound) {
        classFound = matchClass[1];
        fileFound  = fileFound || matchClass[2]?.split("/").pop();
        lineFound  = lineFound || parseInt(matchClass[3], 10);
        colFound   = colFound || parseInt(matchClass[4], 10);
        break;
      }
    }
  }

  // Se Firefox e classe não foi detectada, tenta última heurística
  if (isFirefox && !classFound && methodFound) {
    const nextClassLine = lines.find(l => l.includes("@") && l.match(/^(\w+)/));
    if (nextClassLine) {
      const match = nextClassLine.match(/^(\w+)/);
      if (match) classFound = match[1];
    }
  }

  // Aplicar os resultados finais
  if (methodFound) result.method = methodFound;
  if (classFound)  result.class  = classFound;
  if (fileFound)   result.file   = fileFound;
  if (lineFound)   result.line   = lineFound;
  if (colFound)    result.column = colFound;

  console.groupCollapsed(`🪵 Log: ${title || "Mensagem"}`);
  console.log("Mensagem:", message);
  console.log("Origem:", `${result.class}.${result.method}()`);
  console.log("Arquivo:", `${result.file}:${result.line}:${result.column}`);
  console.log("Result:", result);
  console.groupEnd();

  return result;
}





  async getCaller(functionBack= 0) {
    const back = functionBack * 2;
    console.log(' back: ', back);
    const stack = new Error().stack.split('at ');
    console.log(' stack: ', stack);
    const stackIndex = stack[3 + back].includes('C:') ? (3 + back) : (4 + back);
    console.log(' stackIndex: ', stackIndex);
    const isAsync = stack[stackIndex].includes('async');
    console.log(' isAsync: ', isAsync);
    let result;


    if (isAsync)
      result = stack[stackIndex].split(' ')[1].split(' ')[0];
    else
      result = stack[stackIndex].split(' ')[0];

    console.log(' getCaller: result', result);

    return result;
  }
}
