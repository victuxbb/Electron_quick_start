import request from 'superagent';

export default class ChatScanner {
    const LAN = '172.30.15';
    const PORT_SERVER = 666;

    constructor({lan,port}){

    }

    scan(){
        for(var i=74; i <=74; i++){
          request
              .get('http://'+LAN+'.'+i+':'+PORT_SERVER+'/healthcheck')
              .timeout(3000)
              .end(function(err, res){
                if(res){
                  clients.push(res.request.host);
                }
              });
        }
    }

}

