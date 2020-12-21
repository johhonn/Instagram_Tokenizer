const save = require('instagram-save');
const ipfsClient = require('ipfs-http-client');
let NFT=require('./build/contracts/testNFT.json')
const Web3 = require('web3');
require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const net = require("net")
var fs = require('fs');
let address=process.env.CONTRACT
let contractOwner=process.env.OWNER
let key=process.env.PRIVATEKEY
let network=process.env.INFURA
let provider = new HDWalletProvider(key, network);
let web3 = new Web3(provider);
let nft = new web3.eth.Contract(NFT.abi, address);

/*save('dU4fHDw-Ho', 'myDir').then(res => {
  console.log(res.file);

  fs.readFile(res.file,  (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(data)
    ipfsUpload(data).then((r)=>{
      console.log(r.path)
      let uri={image:`https://ipfs.infura.io/ipfs/${r.path}`}
      uri=JSON.stringify(uri)
      ipfsJSONUpload(uri).then((r)=>{
        console.log(r)
        setURI(uri)
      })
    })
  })
  
});
**/
const server = net.createServer(socket => {
   

  socket.on("data", data => {
    let json=JSON.parse(data)
    console.log(json[0])
    console.log(json[1])
    mintInstagramNFT(json[0].value,json[1].value)

  })
})

server.listen(8080)


function mintInstagramNFT(address, link){
  save(link, 'myDir').then(res => {
    console.log(res.file);
    address='0x'+address;
    fs.readFile(res.file,  (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(data)
      ipfsUpload(data).then((r)=>{
        console.log(r.path)
        let uri={image:`https://ipfs.infura.io/ipfs/${r.path}`}
        uri=JSON.stringify(uri)
        ipfsJSONUpload(uri).then((rr)=>{
          console.log(rr)
          console.log("the result")
          console.log(rr.path)
          setURI(address,`https://ipfs.infura.io/ipfs/${rr.path}`)
        })
      })
    })
    
  });
}


async function setURI(address,uri){
  console.log(`setting uri ${uri} `)
 let result= await nft.methods.mint(address,uri).send({from: contractOwner})
 console.log(result)
}

function getIPFS() {
  let ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port:5001,
    protocol: 'https'
  });
  return ipfs;
};

async function ipfsUpload(buffer) {
  
  // Client instance
  let ipfs = await getIPFS();
  // Do upload
  try {
    const filesAdded =await ipfs.add(buffer)
    
  
    console.log('IPFS files added: \n', filesAdded);
    return filesAdded;
  } catch (e) {
    console.error(e);
    return false;
  }
};
async function ipfsJSONUpload(json = null) {
  if (!json) {
    return false;
  } else if (typeof json !== 'string') {
    return false;
  }
  // Client instance
  let ipfs = await getIPFS();
  // Do upload
  try {
    const filesAdded = await 
      ipfs.add([json], { type: 'application/json' })
    
    console.log('IPFS files added: \n', filesAdded);
    return filesAdded;
  } catch (e) {
    console.error(e);
    return false;
  }
};