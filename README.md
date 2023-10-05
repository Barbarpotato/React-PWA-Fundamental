# React PWA Fundamental
A Progressive Web App is a type of web application that combines the best features of web and mobile applications. PWAs can be accessed through a web browser but can also be installed on a user's device like traditional mobile apps. Some key features of PWAs include:
- The ability to work offline
- Fast performance
- Responsive display on various devices
- Access through an icon on the device's home screen

in this case we will be focused on how to make our react applicaion running on offline, get the requested react module from cache instead from the server.
we will be learn about how to cache the customs api fetch that can be store to our react application.

## What Are Service Workers?
Service Workers are a crucial part of PWAs. They are JavaScript files that run in the background and enable features like offline caching, push notifications, and background sync. Service Workers act as intermediaries between your web application and the network, allowing you to control how your PWA behaves in various scenarios.

### VITE React PWA
In Vite React Project, there is some special configuration needed to applied the Progressive Web App. Below is the step-by-step to configure the PWA.

#### Installing vite-plugin-pwa
First we need to install the vite-plugin-pwa plugin, just add it to your project as a dev dependency:
```
npm install -D vite-plugin-pwa
```
`Note`: to running the implementation of PWA, we need to to build our react vite project, then running the react vite project trough `npm run preview`.
There is some extra configuration to make implementation of PWA running in development mode.

#### Configuring vite-plugin-pwa
Edit your vite.config.js / vite.config.ts file and add the vite-plugin-pwa:
```js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
```

#### Cache External Resources
If you have some additional resource like font and css, you must include them into  the service workerpre-cache and so your application will work when offline.
But in this scenario, we will trying to use some free-api named: `https://jsonplaceholder.typicode.com`. to fetch the data from it and then stored it to the cache browser. so it can be rendered to a front-end page without the network traffic.
The implementation is very easy. we need to addd some  property in `workbox` object named :`runtimeCaching`. Below the example of how to use it:
```js
 runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.match('/posts/1')
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
```

### Result Excercise
<img src='https://github.com/Barbarpotato/React-PWA-Fundamental/blob/main/git-images/Storage'/>
<img src='https://github.com/Barbarpotato/React-PWA-Fundamental/blob/main/git-images/Cache'/>

`Below is the result example of how the PWA can running the application without the network traffic and requested from the server.`
<img src='https://github.com/Barbarpotato/React-PWA-Fundamental/blob/main/git-images/Result.png'/>


### Service Worker without PWA capabilities
Sometimes you don't need the full blown PWA functionality like offline cache and manifest file, but need simple custom Service Worker.

#### Setup the Service Worker
You can first check the browsers are supporting the service worker by create the script like below:
```html
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/src/serviceWorker.js').then((reg) => {
          console.log('Worker Registered!')
        }).catch(err => {
          console.log('Error in service Worker', err)
        })
      })
    }
  </script>
```

This this code is responsible for registering a service worker for your web application. 

#### Offline Caching
If the services worker is available (it whill show the Worker Registered in your broswer console). Now let's create the `serviceWorker.js` file in public directory.
We can squeeze the serviceWorker file by create some eventlistener that installed some assests from server to `Cache Storage`. So the client is not calling the resource from the server anymore instead calling from the client browser cache data.
```js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('PWA-Cache').then((caches) => {
            console.log('Opened Cache')
            return caches.addAll([
                './assets/react.svg',
                '/vite.svg'
            ])
        })
    )
})
```
The purpose of this install event handler is to cache these specified assets when the service worker is first installed. Once the assets are cached, they can be served from the cache even if the user is offline, providing offline access to these resources. This is a fundamental step in building Progressive Web Apps (PWAs) that work seamlessly offline.

After installing all assest from the server to the client. we need to tell the browser that whenever we fetch the data, we need to check the browser cache data first before we calling the server resource. if the client request it is same as the data from a data cache browser, then just use the cache browser data.
Below is the example of how the explanation above implemented in javascript:
```js
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                // Cache hit, return the response
                return response;
            }
            // Not found in cache, fetch from the network
            return fetch(event.request);
        })
    );
});
```



