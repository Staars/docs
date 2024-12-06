class Transpiler {

  code;
  output;
  preventTerminationWords = ["else","elif","except"];
  needTerminationWords = ["if","class","def","while","for","try"];
  opening =["(","{","["];
  closing =[")","}","]"];
  multiline;

  constructor(code) {
    this.code = code;
  }

  refactor_line(line, isOneliner){
    var refactored = line.replace(/:+$/, ""); // strip :
    if(isOneliner){
      const _l = line.split(":");
      _l.push("end");
      refactored = _l.join(" ");
    } else{
      refactored = line.split(":")[0]; // to do - make it more robust
    }
    refactored = refactored.replace("None","nil");
    refactored = refactored.replace("float","real");
    refactored = refactored.replace("True","true");
    refactored = refactored.replace("False","false");
    refactored = refactored.replace(" and "," && ");
    refactored = refactored.replace(" or "," || ");
    refactored = refactored.replace(" not "," !");
    refactored = refactored.replace("@staticmethod","static");
    refactored = refactored.replace("__init__","init");
    var regExp = /^class\s([^)]+)\(([^)]+)\)/;
    var matches = regExp.exec(line);
    if(matches && matches.length == 3){
      refactored = "class " + matches[1] + " : " + matches[2];
    }
    return refactored;
  }

  spaces(count){
    var spaces = "";
    for(let i=0;i < count; i++){
      spaces += " ";
    }
    return spaces;
  }

  exitLine(line){
    var exit = false;
    if(line.trim().length == 0){ //empty line
      this.output += line + "\n";
      exit = true; //ignore
    }
    else if(line.trim().startsWith("#")){ //comment line
      this.output += line + "\n";
      exit = true; //ignore
    }
    return exit;
  }

  oneLiner(line){
    var result = false;
    var l = line.trim();
    if(l.startsWith("if")){
      var i = l.split(":");
      if(i.length > 1){
        if(i[1].trim().startsWith("#") == false){
          console.log("Oneliner:",i);
          result = true;
        }
      }
    }
    return result;
  }

  completeLine(line){
    var open_brackets = 0;
    this.multiline += line;
    for (let i = 0; i < this.multiline.length; i++) {
      let c = this.multiline[i];
      if (this.opening.some(char=>c == char)){
        open_brackets += 1;
      };
      if (this.closing.some(char=>c == char)){
        open_brackets -= 1;
      };
    }
    if(open_brackets > 0){
      // console.log("Accumulating:",line);
      this.output += this.refactor_line(line, this.oneLiner(line));
      this.output += "\n";
      return false;
    }
    else{
      // console.log("Complete:",this.multiline);
      this.multiline = "";
      return true;
    }
  }

  parse(){
    var blocks_to_terminate = 0;
    var indent_list = [0];
    this.output = "";
    this.multiline = "";

    for(let line of this.code.split(/\r?\n/)){
      var line_indent = line.search(/\S/);


      if(this.completeLine(line) == false){ // or multiline
        // console.log(line)
        continue;
      }

      if(this.exitLine(line)){
        continue;
      }

      var preventTermination = false;
      if (this.preventTerminationWords.some(substring=>line.includes(substring))){
        var o = this.output.split("\n");
        console.log("remove last el",o);
        o.splice(-1);
        this.output = o.join("\n");
        blocks_to_terminate += 1;
        preventTermination = true;
      }

      var validKeyword = false;
      if (this.needTerminationWords.some(substring=>line.trim().startsWith(substring))){
          blocks_to_terminate += 1;
          validKeyword = true;
          console.log("blocks to terminate",blocks_to_terminate,"because of",line);
          if(this.oneLiner(line)){
            blocks_to_terminate -= 1;
            // console.log("no, it is not!");
          }
      }

      if(line_indent > indent_list[indent_list.length - 1]){
        indent_list.push(line_indent);
        console.log("New indentation in list",indent_list, line);
      }

      while((indent_list[indent_list.length - 1] > line_indent)){ //
        indent_list.pop();
        console.log("End block", indent_list, line_indent,"blocks_to_terminate",blocks_to_terminate);
        if(preventTermination == false && blocks_to_terminate > 0){
          this.output +=  this.spaces(indent_list[indent_list.length - 1]) + "end";
          blocks_to_terminate -= 1;
        }
        this.output += "\n";
      }
      // console.log("list vs indent:",indent_list,line_indent)

      this.output += this.refactor_line(line, this.oneLiner(line));
      this.output += "\n";

      this.indentation = line_indent;
      // console.log("after ....", this.output,blocks_to_terminate);
    }

    console.log("Block:",this.output, blocks_to_terminate);
    while(blocks_to_terminate > 0){
      indent_list.pop();
      this.output += this.spaces(indent_list[indent_list.length - 1]) + "end";
      this.output += "\n";
      blocks_to_terminate -= 1;
    }
    return this.output;
  }
};


function python2berry() {
  const python_src = document.getElementById("python_src").value;
  let t = new Transpiler(python_src);
  document.getElementById("berry_src").value = t.parse();
}