import http from 'http';
import dispatcher from 'httpdispatcher';

const PORT_SERVER=6666;

export default class RestChatServer {

    constructor({port,mainWindow}){

        dispatcher.setStatic('resources');
        dispatcher.onPost("/", function(req, res) {
            mainWindow.webContents.send('msg',JSON.parse(req.body));
            res.end('Ok');

        });

        dispatcher.onGet("/healthcheck", function(req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('live!');
        });
        this.server = http.createServer(this.handleRequest);
        this.server.listen(PORT_SERVER, function(){
            //Callback triggered when server is successfully listening. Hurray!
            console.log("Server listening on: http://localhost:%s", PORT_SERVER);
        });

    }

    handleRequest(request, response){
        try {
            //log the request on console
            console.log(request.url);
            //Dispatch
            dispatcher.dispatch(request, response);
        } catch(err) {
            console.log(err);
        }

    }

}
