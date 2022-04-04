const configFile = './env.json';
console.log('reading env file'); 
Deno.readTextFile(configFile).then(data => {
    console.log(JSON.parse(data))
});