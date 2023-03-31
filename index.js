#!/usr/bin/env node
const express      = require('express');
const { program }  = require('commander');
const path         = require('path');
const fs           = require('fs');
const vue          = require('@vitejs/plugin-vue');

const { 
    createServer,
    send
} = require('vite');

const modulePath = path.resolve(__dirname);

program
    .option('--api <host>', 'Specify host to forward requests to when hitting /api on the frontend')
    .option('--ignore <block>', 'Ignore specific block type')
    .arguments('<component>')
    .description('Host a single .vue component with HMR using Vite')
    .action(async (component, options) => {
        const componentPath = path.resolve(process.cwd(), component);

        if (!fs.existsSync(componentPath)) {
            console.error('Error: The provided component path does not exist.');
            process.exit(1);
        }

        const server = await createServer({
            optimizeDeps: { include: ['vue'] },
            root: modulePath,
            plugins: [
                   {
                      name: 'index',
                      configureServer: (server) => {
                        server.middlewares.use(async (req, res, next) => {
                          if (
                              req.url.startsWith('/api') ||
                              req.url.startsWith('/@fs') ||
                              req.url.startsWith('/node_modules') ||
                              req.url.startsWith('/@id') ||
                              req.url.startsWith('/@vite')
                          ) {  return next() }
                          const html = await server.transformIndexHtml(
                            req.url,
                `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <style>
                body {
                    margin: 0;
                    padding: 0;
                }
                </style>
                <body>
                <div id="app"></div>
                <script type="module">
                    import { createApp } from 'vue'
                    import App from '/@fs${componentPath}'
                    const app = createApp(App)
                    app.mount('#app')
                </script>
                </body>
                </html>`,
                            req.originalUrl,
                          )
                          return send(req, res, html, 'html', {})
                        })
                      },
                    },
                    vue(),
                {
                    name: 'custom-blocks',
                    transform(code, id) {
                        const r = new RegExp('type=' + options.ignore);
                        if (r.test(id)) {
                            console.log('Ignoring block: ' + id);
                            return 'export default comp => {}';
                        }
                    }
                },
            ],
            server: {
                host: '0.0.0.0',
                port: 3000,
                proxy: {
                    ...(options.api && {'/api': options.api})
                }
            }
        });

        server.watcher.add(`${path.dirname(componentPath)}/**`);
        server.listen()

    });

program.parse(process.argv);

