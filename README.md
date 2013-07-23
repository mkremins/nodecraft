Nodecraft
=======================================

Nodecraft is an open-source Minecraft server implementation written in JavaScript. It's built on top of node.js and the excellent [node-minecraft-protocol](http://github.com/superjoe30/node-minecraft-protocol) module.

Much of Nodecraft's functionality is implemented in plugins. Heavy internal use of the plugin API – which, in keeping with Node's strengths, is primarily asynchronous and event-driven – ensures that the server remains moddable, modular, and extensible. Additionally, it enables any developer with enough knowledge of the API to create a plugin of her own to begin hacking on almost any part of the server with relative ease.
