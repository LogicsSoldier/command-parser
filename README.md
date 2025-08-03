# command-parser
Parse command line arguments for virtually anything in a lightweight extensible way 


![image](https://github.com/LogicsSoldier/command-parser/assets/4423284/97bed225-09ec-4843-82ee-ede989511829)
<details>

<summary>examples</summary>

<br/>

super flexible and lightweight, can do a lot more to natively process custom types :D .. Booleans and Arrays have magic sorting properties but easily overrided with a custom type.

### using aliases

```js
const parsed = CommandParser.Parse("Category: People --list=James+John+Luke+Harry -k=2", {
      list: [String],
      keep: Number,

      "k": "keep" //shorthands/aliases
    }, true) //strict mode is true by default


    let { list, keep } = parsed.args;
    console.log(parsed);
```

### using custom types

```js
const customDate = (valueRecieved, tagName) => valueRecieved.split("/");
const parsed = CommandParser.Parse("jeffery --birthday=08/03/1973", {birthday: customDate});

const {beginning, args} = parsed;
console.log(beginning, args.birthday); // OUTPUT: jeffery [08, 03, 1973]
```

</details>


###### email at logicssoldier@gmail.com for inquieries
