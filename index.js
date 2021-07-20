const cluster = require("cluster");

let sum = 0;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    cluster.fork();
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {

    function iterFact(num) {
        var rval = 1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }
    console.log(iterFact(50));
}
