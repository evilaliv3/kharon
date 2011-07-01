/*
 *   Kharon, a small Greasemonkey script to rewrite some darknet links to
 *   a proxyfied version.
 *
 *   Copyright (C) 2011 evilaliv3 <giovanni.pellerano@evilaliv3.org>
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

(
    function() {

        var tor = new Array();
        tor['regexp']    = /^((.*)(:\/\/)(.*)).onion((\/.*)?)$/i;
        tor['rewrite']   = "matches[1] + \".tor2web.org\" + matches[5]";
        
        var i2p = new Array();
        i2p['regexp']    = /^((.*)(:\/\/)(.*)).i2p((\/.*)?)$/i;
        i2p['rewrite']   = "matches[1] + \".i2p.to\" + matches[5]";
        
        var services = new Array(tor, i2p);
        
        var nodes = document.getElementsByTagName("*");

        for(var j = 0; j < services.length; j++) 
        {
            var service = services[j];

            for (var i = 0; i < nodes.length; i++)
            {
                for(var property in nodes[i])
                {
                    var value = nodes[i].getAttribute(property);

                    if (value && (matches = value.match(service['regexp'])))
                        nodes[i].setAttribute(property, eval(service['rewrite']));
                }
            }
        }
    }
)();




