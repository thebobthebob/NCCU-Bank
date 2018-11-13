const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

/*
* connect to ethereum node
*/ 
const ethereumUri = 'http://localhost:8545';
var address="0xee0df7385e30f4f56751f4b614386046220c841e";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

// web3.eth.getCoinbase().then((response) => {
//     console.log("帳號：" + response);
//     return web3.eth.getBalance(response);
// }).then((response) => {
//     console.log("餘額：" + response);
// }).catch((error) => {
//     console.log(error);
// });

/*
* Compile Contract and Fetch ABI
*/ 
let source = fs.readFileSync("./contract/bank.sol", 'utf8');

console.log('compiling contract...');
let compiledContract = solc.compile(source);

for (let contractName in compiledContract.contracts) {
    var bytecode = compiledContract.contracts[contractName].bytecode;
    var abi = JSON.parse(compiledContract.contracts[contractName].interface);
}

/*
* deploy contract
*/ 
const MyContract = new web3.eth.Contract(abi);
MyContract.deploy({
    data: bytecode,
  })
  .send({
    from: address,
    gas: 6000000,
  })
  .then((instance) => {
    console.log(`Address: ${instance.options.address}`);
    fs.writeFileSync('./address.txt', instance.options.address);
  }).catch((error) => {
    console.log(error);
});





