nodecraft
=======================================

nodecraft is an open-source Minecraft server implementation written in JavaScript. It's built on top of node.js and the excellent [node-minecraft-protocol](http://github.com/superjoe30/node-minecraft-protocol) module.

Much of nodecraft's functionality is implemented in plugins. Heavy internal use of the plugin API – which, in keeping with node's strengths, is primarily asynchronous and event-driven – ensures that the server remains moddable, modular, and extensible. Additionally, it enables any developer with enough knowledge of the API to create a plugin of her own to begin hacking on almost any part of the server with relative ease.

installation
---------------------------------------

To install nodecraft and run a server instance, simply:

    git clone git://github.com/mkremins/nodecraft.git
    cd nodecraft
    node lib/server.js

Note that nodecraft is nowhere near stable or feature-complete. Unless you want to hack on the code, I'd advise against trying to run your own instance for now.
