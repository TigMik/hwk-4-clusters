const cluster = require('cluster');
const http = require('http');
const process = require('process');

if (cluster.isMaster) {

    // Keep track of http requests
    let sum = 0;
    setInterval(() => {
        console.log(`sum = ${sum}`);
    }, 1000);


    function iterFact(num) {
        var rval = 1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }

    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', (msg) => {
            if (msg.cmd && msg.cmd === 'notifyRequest') {
                sum += iterFact(50);
            }
        });
    }

} else {

    // Worker processes have a http server.
    http.Server((req, res) => {
        res.writeHead(200);
        res.end('hello world');

        process.send({ cmd: 'notifyRequest' });
    }).listen(8000);
}
