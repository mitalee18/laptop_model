const filesys = require('fs'); //for files
const http = require('http'); // for server
const url = require('url');// url module

const json = filesys.readFileSync(`${__dirname}/data/data.json`,'utf-8'); // synchronous callback function runs only one time when you start your app
// utf-8 to get a file and not buffer
const laptopData = JSON.parse(json);

const server = http.createServer((request, response) =>{ //callback function
    // console.log('Someone accessed our server');, send response instead of just keep on 
    //short-circuit favicon requests
    if (request.url !== '/favicon.ico') {
        const pathname = url.parse(request.url, true).pathname;
        const id = url.parse(request.url, true).query.id;
        
        //product overview
        if (pathname === '/products' || pathname === ''){
            response.writeHead(200, {'Content-type': 'text/html'});
            
            filesys.readFile(`${__dirname}/templates/template_overview.html`,'utf-8',(err, data) =>{
                //read card after reading overview
                let overviewOutput = data;

                filesys.readFile(`${__dirname}/templates/template_card.html`,'utf-8',(err, data) =>{
                    const cardsOutput_arr =laptopData.map(el => replace_template(data, el)).join(''); // pass og html and laptop
                    overviewOutput = overviewOutput.replace(/{%CARDS%}/g, cardsOutput_arr);
                    response.end(overviewOutput);
                }); 
            }); 

        }
        // laptop detail
        else if (pathname === '/laptop' && laptopData.length > id)
        {
            response.writeHead(200, {'Content-type': 'text/html'});
            
            filesys.readFile(`${__dirname}/templates/template_laptop.html`,'utf-8',(err, data) =>{
                const laptop = laptopData[id]
                const output = replace_template(data, laptop);
                response.end(output); // sends response to our window

            }); //asyncronous fileread
        }

        //IMAGES
        else if((/\.(jpg|jpeg|png|gif)$/i).test(pathname))
        {
            filesys.readFile(`${__dirname}/data/img${pathname}`, (err, ImageData) => {
                response.writeHead(200, {'Content-type':'image/jpg'});
                response.end(ImageData);
            });
        }

        //url not found
        else{
            response.writeHead(404, {'Content-type': 'text/html'});
            response.end('Page Not Found');
        }
       
    }
});

server.listen(1337, '127.0.0.1', ()=> {
    console.log('Server has started listening for requests now');
});

function replace_template(originalHTML, laptop){
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName); // data (template_laptop) is a string format thus we can use replace method on it
    output = output.replace(/{%IMAGE%}/g,laptop.image); // thus we ca
    output = output.replace(/{%PRICE%}/g,laptop.price);
    output = output.replace(/{%SCREEN%}/g,laptop.screen);
    output = output.replace(/{%CPU%}/g,laptop.cpu);
    output = output.replace(/{%STORAGE%}/g,laptop.storage);
    output = output.replace(/{%RAM%}/g,laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g,laptop.description);
    output = output.replace(/{%ID%}/g,laptop.id )

    return output;
}