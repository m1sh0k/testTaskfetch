const fs = require('fs')
const util = require('util')
const fetch = require("node-fetch");
const pipe = require('stream').pipeline
const streamPipeline = util.promisify(pipe);
const readline = require("readline");



async function downloadAvatar(name) {
    try{
        // Get data about github user
        const setings = { method: "Get" };
        const link = `https://api.github.com/users/${name}`
        let response = await fetch(link, setings);
        const githubUser = await response.json();
        const linkAwa = githubUser.avatar_url;
        console.log("avaLink: ",linkAwa);
        response = await fetch(linkAwa);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
        await streamPipeline(response.body, fs.createWriteStream(`./${name}.png`))
    }catch(err){
        throw new Error(`unexpected  ${err.stack}`)
    }
}
function reqName(){
    return new Promise((res,rej)=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("What is your Git name? ", (name)=>{
            res(name);
            rl.close();
        });
        rl.on("close", function() {
            console.log("\nBye !!!");
        });
    })
}
(async ()=>{
    try {
        let name = await reqName()
        await downloadAvatar(name);
        console.log("\nDownLoad Done !!!");
        process.exit(0);
    } catch (err) {
        throw new Error(`unexpected err ${err.stack}`)
    }

})()
