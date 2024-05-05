import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { IEmployes } from './src/app/interface/IEmployes';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  const employes: IEmployes[] = [
    {
      name: 'Jonson',
      address: 'Jakarta',
      position: 'HRD',
    },
    {
      name: 'Jabrik',
      address: 'Bandung',
      position: 'Talent',
    },
    {
      name: 'Jangkrik',
      address: 'Magelang',
      position: 'Humas',
    },
    {
      name: 'Jule',
      address: 'Bandung',
      position: 'Editor',
    },
  ];

  // server.get('/api/pegawai', (req, res) => {
  //   res.send(employes);
  // });

  // server.post('/api/pegawai', (req, res) => {
  //   const newEmployee: IEmployes = req.body;
  //   employes.push(newEmployee);
  //   res.status(201).json(newEmployee);
  // });

  // server.put('/api/pegawai/:name', (req, res) => {
  //   const { name } = req.params;
  //   const updatedEmploye: IEmployes = req.body;
  //   const index = employes.findIndex((employes) => (employes.name = name));

  //   if (index !== 1) {
  //     employes[index] = { ...employes[index], ...updatedEmploye };
  //     res.json(employes[index]);
  //   } else {
  //     res.status(404).json({ message: 'Data Tidak Ada' });
  //   }
  // });

  // server.delete('/api/pegawai/:name', (req, res) => {
  //   const { name } = req.params;
  //   const index = employes.findIndex((employe) => employe.name === name);
  //   if (index !== -1) {
  //     employes.splice(index, 1);
  //     res.json({ message: 'Employe deleted' });
  //   } else {
  //     res.status(404).json({ message: 'Employe not found' });
  //   }
  // });

  // Middleware to parse JSON bodies
  server.use(express.json());

  server.get('/api/pegawai', (req, res) => {
    res.json(employes);
  });

  server.post('/api/pegawai', (req, res) => {
    const newEmployee: IEmployes = req.body;
    employes.push(newEmployee);
    res.status(201).json({ ...newEmployee, created: new Date() });
  });

  server.put('/api/pegawai/:name', (req, res) => {
    const { name } = req.params;
    const updatedEmploye: IEmployes = req.body;
    const index = employes.findIndex((employe) => employe.name === name);

    if (index !== -1) {
      employes[index] = { ...employes[index], ...updatedEmploye };
      res.json(employes[index]);
    } else {
      res.status(404).json({ message: 'Data Tidak Ada' });
    }
  });

  server.delete('/api/pegawai/:name', (req, res) => {
    const { name } = req.params;
    const index = employes.findIndex((employe) => employe.name === name);

    if (index !== -1) {
      const deletedEmploye = employes.splice(index, 1)[0];
      res.json(deletedEmploye);
    } else {
      res.status(404).json({ message: 'Employe not found' });
    }
  });

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
