/*
 *   Kharon, a small Greasemonkey/HTML5 script to rewrite some darknet
 *   links to a proxyfied version.
 *
 *   Copyright (C) 2011 evilaliv3 <giovanni.pellerano@evilaliv3.org>
 *                      hellais <art@baculo.org>
 *                      vecna <vecna@delirandom.net>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ==UserScript==
// @name          kharon.js
// @namespace     https://github.com/evilaliv3/kharon
// @description   Rewrite TOR/I2P links to their proxified version.
// @include       *
// ==/UserScript==


var tor                         = new Array();
tor['timestamp']                = 0;
tor['status']                   = 'unavailable';
tor['testurl']                  = 'https://6sxoyfb3h2nvok2d.onion';
tor['available']                = new Array(); 
tor['available']['regexp']      = /^((.*)(:\/\/)([a-zA-Z0-9]{16})).tor2web.org((\/.*)?)$/i;
tor['available']['rewrite']     = 'matches[1] + \'.onion\' + matches[5]';
tor['unavailable']              = new Array();
tor['unavailable']['regexp']    = /^((.*)(:\/\/)([a-zA-Z0-9]{16})).onion((\/.*)?)$/i;
tor['unavailable']['rewrite']   = 'matches[1] + \'.tor2web.org\' + matches[5]';

var i2p                         = new Array();
i2p['timestamp']                = 0;
i2p['status']                   = 'unavailable';
i2p['testurl']                  = '';
i2p['available']                = new Array();
i2p['available']['regexp']      = /^((.*)(:\/\/)(.*)).i2p.to((\/.*)?)$/i;
i2p['available']['rewrite']     = 'matches[1] + \'.i2p\' + matches[5]';
i2p['unavailable']              = new Array();
i2p['unavailable']['regexp']    = /^((.*)(:\/\/)(.*)).i2p((\/.*)?)$/i;
i2p['unavailable']['rewrite']   = 'matches[1] + \'.i2p.to\' + matches[5]';

var services = new Array(tor, i2p);

function test(index)
{
    var now = Math.round(new Date()/1000);
    var nextchecktime = sessionStorage.getItem('nextchecktime_' + index);
    if(nextchecktime == null)
        nextchecktime = 0;

    if(now > nextchecktime)
    {
        sessionStorage.setItem('nextchecktime_' + index, now + 600);

        var timeout = 100;
        var img = new Image();

        img.onerror = function () {
            if (!img) return;
            img = undefined;
            services[index]['status'] = 'available';
            callback(index);
        };

        img.onload = img.onerror;
        img.src = services[index]['testurl'];

        setTimeout(function () {
            if (!img) return;
            img = undefined;
            services[index]['status'] = 'unavailable';
            callback(index);
        }, timeout);
    } else {
        callback(index);
    }

}

function callback(index)
{
    var service = services[index];
    var status = service['status'];

    var nodes = document.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++)
    {
        for(var property in nodes[i])
        {
            var value = nodes[i].getAttribute(property);

            if (value && (matches = value.match(service[status]['regexp'])))
                nodes[i].setAttribute(property, eval(service[status]['rewrite']));
        }
    }
}

(
    function() {
        var nodes = document.getElementsByTagName("*");

        for(var j = 0; j < services.length; j++)
            test(j); 
    }
)();
