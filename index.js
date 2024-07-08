//added strict mode .. its really really good

SYMBOL = "-";
function test(){
console.log(_q("something --lookup=this is a test"))
console.log(_q("this is a --lookup=--bulshit"))
console.log(_q("test -m other -p=.1+.25 -pr -e --tomb"))
console.log(_q("-m some bullshit to test --math=1+3 -g and end stuff"))
console.log(_q("test -m other -p=.1+.25 -pr next -e --tomb=false"))
console.log(_q("bandos+melee --lookup"))
}
function _q(q){
  const g = {
    "range": Number, 
    "mage": Number, 
    "melee": Number, 
    "tomb": Boolean, 
    "spell": Number, 
    "passive": [Number],  
    "pot": Number, 
    "lvl": Number, 
    "prayer": Number, 
    "isPraying": Boolean,
    "elysian": Boolean,
    "lookup": [String],
    full: Boolean,

    "s": "spell", 
    "p": "passive",
    "l": "lvl",
    "m": "melee",
    "ma": "mage",
    "r": "range",
    "e": "elysian",
    "pr": "isPraying",
    }

    return Parse(q,g, true);
}
String.prototype.parse = function(commandSchema, strict){

  return Parse(this, commandSchema, strict);
}
SETTINGS = {
  SHORTCUT_MAX_LENGTH: 2,
}

function Parse(commandString, commandSchema, strict=false){

    this.keys = Object.keys(commandSchema);

    const fCommand = _Format(commandString + " ", strict? commandSchema : undefined);
    const extracts = _Extract(commandString, fCommand);
    const commandsRaw = extracts.commands;

    //console.log(fCommand, commandsRaw);
    
    const results = {};
    commandsRaw.filter(x => this.keys.indexOf(x[0]) !== -1).forEach(x => {
      let name = x[0], arg = x[1];
      let scheme = commandSchema[name];

      if(typeof scheme === "string"){
        name = scheme;
        scheme = commandSchema[scheme];
      }
      //console.log(name, ":", scheme instanceof Array? scheme[0] : scheme, "vs", scheme, scheme instanceof Array, typeof scheme, scheme !== undefined);
      //console.log(name, scheme, arg);
      // if(scheme[0] !== undefined)
      // console.log(scheme["0"].call, scheme[0].call(this, 123), Object.keys(scheme[0]), scheme.length, typeof scheme);
      
      const isPreferredTypeBoolean = scheme.toString().indexOf("Boolean") !== -1;

      if(arg === true){
        results[name] = isPreferredTypeBoolean? true : (scheme[0] != null? scheme[0]() : scheme());
      }else if(isPreferredTypeBoolean === true){
        results[name] = arg === 'true'? true : false;
      }else if(scheme[0] !== undefined){
        results[name] = (arg||"").split(/[+\|]/g).map(b => scheme[0].call(this, b, name));
      }else{
        results[name] = scheme(arg, name);
      }


    })
  return {beginning: extracts.text.trim(), args: results};
}

function _Extract(commandString, fCommand){

  let start,end,commandList = [];

  let extractedText = "", last = 0;
  for(let i = 0; i < fCommand.length; i++){

    let command = fCommand[i];

    const start = command.beginsAt;
    let end = 0;
    if(commandString[command.nameEnd] === "="){
      end = i === fCommand.length - 1 ? fCommand.length : fCommand[i+1].beginsAt;
    }else{
      end = command.nameEnd
    }
    // new variable .. might need more testing.. defaults to using the command string when no text is present
    const lacksCommands = command.beginsAt === -1 && command.isEnd === true;
    extractedText += lacksCommands ? commandString : commandString.substring(last, command.nameStart-(command.nameStart - command.beginsAt));
    last = (command.del === "=" ? (command.isEnd? commandString.length : fCommand[i + 1].beginsAt - (commandString[fCommand[i+1].beginsAt - 1] === " "? 1 : 0)) : command.nameEnd)+1;

    commandList.push([commandString.substring(command.nameStart, command.nameEnd), command.del === "="? commandString.substring(command.nameEnd + 1, command.isEnd? commandString.length : fCommand[i + 1].beginsAt - (commandString[fCommand[i+1].beginsAt - 1] === " "? 1 : 0)) : true]);
  }

  if(fCommand[fCommand.length - 1].del === " ") extractedText += commandString.substring(fCommand[fCommand.length - 1].nameEnd + 1);
  
  return {commands: commandList, text: extractedText};
}

function _Format(commandString, filterList){
  
    const filterListExists = filterList !== undefined;
    const lp = {
      escaped: false,
      command: {
        beginsAt: -1,
        nameStart: -1,
        started: false,
        nameEnd: -1,
        del: null
      }

    }

    const results = [];
    for(let i = 0; i < commandString.length; i++){
      
      Start_Of_Condition:
      if(lp.command.started === false){
        if(commandString[i] === SYMBOL && (i===0||commandString[i-1]===" ") && (i+5 > commandString.length || commandString[i+1]===SYMBOL||"= ".split("").find(x=>commandString.substring(i+2,i+2+SETTINGS.SHORTCUT_MAX_LENGTH).indexOf(x) !== -1)) && !lp.escaped){
          lp.command.started = true;
          if(lp.command.beginsAt !== -1){
            //this is where we reset and package our info
             const isAllowed = !filterListExists || filterList[commandString.substring(lp.command.nameStart, lp.command.nameEnd)] !== undefined;
            if(isAllowed) //added
            results.push(Object.assign({}, lp.command));
            lp.command = {
              beginsAt: -1,
              nameStart: -1,
              started: true,
              nameEnd: -1,
              del: null

            };
          }
          lp.command.beginsAt = i;
          
        }
      } else {
        if(lp.command.nameStart === -1){
          if(commandString[i] !== SYMBOL) lp.command.nameStart = i;
        }else if(lp.command.nameEnd === -1){
          if ((commandString[i] === "=" || commandString[i] === " ") && !lp.escaped) {
            lp.command.nameEnd = i;
            lp.command.started=false;
            lp.command.del = commandString[i]
          }
        }
      }


    }
    const isAllowed = !filterListExists || filterList[commandString.substring(lp.command.nameStart, lp.command.nameEnd)] !== undefined;
    
    results.push(Object.assign({del: " "}, isAllowed? lp.command : {
              beginsAt: -1,
              nameStart: -1,
              started: true,
              nameEnd: -1,
              }, {nameEnd: lp.command.nameEnd !== -1? lp.command.nameEnd : commandString.length, isEnd: true}));
           
            
    //console.log(results);

    return results;
}
