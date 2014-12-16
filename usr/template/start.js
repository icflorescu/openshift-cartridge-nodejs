var cluster = require('cluster'),
    stopSignals = [
      'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ],
    stopping = false,
    env = process.env,
    i;

cluster.on('disconnect', function(worker) {
  if (env.NODE_ENV == 'production') {
    if (!stopping) {
      cluster.fork();
    }
  } else {
    process.exit(1);
  }
});

if (cluster.isMaster) {
  console.log('Starting %d workers...', env.NODE_CLUSTER_WORKERS || 4);
  for (i = 0; i < (env.NODE_CLUSTER_WORKERS || 4); i++) {
    cluster.fork();
  }
  if (env.NODE_ENV == 'production') {
    stopSignals.forEach(function(signal) {
      process.on(signal, function() {
        console.log('Got %s, stopping workers...', signal);
        stopping = true;
        cluster.disconnect();
      });
    });
  }
} else {
  require('./app.js');
}
