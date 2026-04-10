const { exec } = require('child_process');

const ports = [3000, 4200];

console.log('--- HerStyle Port Clearer ---');

ports.forEach(port => {
  const findCmd = process.platform === 'win32' 
    ? `netstat -ano | findstr :${port}` 
    : `lsof -i :${port} -t`;

  exec(findCmd, (err, stdout) => {
    if (err || !stdout) {
      console.log(`Port ${port} is already clear.`);
      return;
    }

    const lines = stdout.trim().split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = process.platform === 'win32' ? parts[parts.length - 1] : line.trim();
      
      if (pid && pid !== '0') {
        const killCmd = process.platform === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
        exec(killCmd, (kErr) => {
          if (!kErr) console.log(`Successfully cleared port ${port} (PID ${pid})`);
        });
      }
    });
  });
});
