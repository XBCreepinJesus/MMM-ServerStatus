# MMM-ServerStatus

A module for MagicMirror² to check the up/down status of servers/devices on your network.

## Installation

Install using Git into the modules directory of your MagicMirror installation:

```bash
git clone https://github.com/XBCreepinJesus/MMM-ServerStatus.git
```

**Note** - this module uses the Ping node module (https://github.com/danielzzz/node-ping). To install it on your MagicMirror setup, run `npm install ping` from inside the `node_modules` directory.

Add it to your config.js modules section like any other module:

```javascript
modules: [
    {
        module: "MMM-ServerStatus",
        header: "MagicMirror status",   // Can be anything you want, or blank
        position: "bottom_right",       // Choose a position
        config: {
            hosts: [    // For example
                { name: "localhost", ip: "127.0.0.1" },
                { name: "Router", ip: "192.168.0.1" },
                { name: "The Outside World", ip: "8.8.8.8" }
            ],
        },
    },
],
```

## Configuration

Technically, nothing is mandatory, but you will of course want to change the hosts to the IPs of your devices. Here are all the config options:
|Option|Description|
|---|---|
|`hosts`|Object array. Here's the important one. Each host must have _at least_ an `ip`; a friendly name is optional. You can also set a `timeout` per host - useful if you have a device that is slow to respond (default is 1 second).<br/>`{ name: "Friendly device name", ip: "127.0.0.1", timeout: 5 }`
|`pingInterval`|Integer (in **seconds**). Set the time in seconds between each round of pings. Please consider what you are pinging before setting a really short interval.<br/>_Default: 15_
|`loadDelay`|Integer (in **seconds**). Set a delay when the module first starts before firing off any ping requests.<br/>_Default: 0_
|`templateName`|String. Specify the name of the Nunjucks template to use (.njk extension not required). [See below](#Templates) for more info.<br/>_Default: default_
|`tableClass`|String. If given, the basic template provided will add it to the table element of the module's output.
|`upSymbol`|String. The symbol to use for an up/online/alive status. See [FontAwesome icons](https://fontawesome.com/icons?d=gallery&s=solid&m=free).
|`upText`|String. Text to show for an up/online/alive status (e.g., "UP").
|`downSymbol`|String. The symbol to use for a down/offline status.
|`downText`|String. Text to show for a down/offline status (e.g., "DOWN").
|`upColor`|String. Set a colour for up/online results. This gets passed directly to the `color` setting of the `<span>` tag so it can be anything you can use in HTML/CSS styling (e.g., "green" or "#00ff00").
|`downColor`|String. Set a colour for down/offline results. This gets passed directly to the `color` setting of the `<span>` tag so it can be anything you can use in HTML/CSS styling (e.g., "red" or "#ff0000").

## Templates

This module uses Nunjucks templates to render its output. This is so much easier than writing HTML through Javascript, and has the benefit of allowing the end user to simply create a new template to use without having to recode the module.

If you'd like to use a different template, create a `.njk` file in the module directory and set the `templateName` option in the config to the name of your template (minus the .njk extension). For example, if you've created a template called `fabNewTemplate.njk`, adjust your module config to include `templateName: "fabNewTemplate"`.

The module will pass all of the module configuration settings to the template (as `config`) and the ping results (as `pingResults`). In the default template, you will see the results are parsed through with:
```
{% for host in pingResults %}
    ...
{% endfor %}
```
where each `host` will have:
-   `name` - friendly name (as given in the module config)
-   `isAlive` - Boolean (true/false) to show whether the host responded or not
    `pingTime` - the time (in ms) of the first successful ping
-   `fullResults` - full ping response (see [ping module Output Specification](https://github.com/danielzzz/node-ping#output-specification)) so all the ping response data can be used in the templates

## Example uses

Of course, you don't have to use this to check on your server statuses specifically; you can use it for any ping-able device! Here are some other suggestions.

#### Plain old server status checker

![](/screenshots/DeviceStatusExample.png)<br/>
This template just has an up/down icon for each server with a red/green colour as needed.

#### As an "in/out" indicator

![](/screenshots/InOutExample.png)<br/>
Assign fixed IP addresses to family members' smartphones as a way of seeing whether they're home or out. This works on the assumption that when they're home they'll be connected to the WiFi. Here we have an icon and text set in the config, and a template that uses both.

#### Activity monitor?

Perhaps you can check whether the games console is online to assume someone's playing games? Or whether the TV is on? However, as this just pings, chances are a lot of devices that are "always on" will still respond even when not in use.

##### Acknowledgements

This is my first foray into MM2 modules and Javascript for some time, so I had a lot of help from looking at other modules such as [MMM-Ping](https://github.com/CFenner/MMM-Ping) and [MMM-ping](https://github.com/fewieden/MMM-ping).
