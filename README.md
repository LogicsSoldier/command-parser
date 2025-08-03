# command-parser
Parse command line arguments for virtually anything in a lightweight extensible way 


```js
const parsed = CommandParser.Parse(raw, {
      list: [String],
      keep: Number,

      "k": "keep" //shorthands/aliases
    }, true) //strict mode


    let { list, keep } = parsed.args;
    console.log(parsed);
```

can do a lot more to natively process custom types :D super flexible.. Booleans and Arrays have magic sorting properties but easily overrided with a custom type.
![image](https://github.com/LogicsSoldier/command-parser/assets/4423284/97bed225-09ec-4843-82ee-ede989511829)

###### email at logicssoldier@gmail.com for inquieries
