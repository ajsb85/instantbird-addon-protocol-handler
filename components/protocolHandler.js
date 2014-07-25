/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {interfaces: Ci, utils: Cu, classes: Cc} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource:///modules/imServices.jsm");
Cu.import("resource:///modules/imStatusUtils.jsm");

function ProtocolCLH() { }
ProtocolCLH.prototype = {
  classDescription: "Instantbird Protocol Commandline Handler Component",
  classID:          Components.ID("{95cf1fd0-139d-11e4-9191-0800200c9a66}"),
  contractID:       "@instantbird.org/protocol/clh;1",
  QueryInterface:   XPCOMUtils.generateQI([Ci.nsICommandLineHandler]),

  /** nsICommandLineHandler **/
  handle: function(cmdLine) {
    let uri = cmdLine.findFlag("uri", false);
    if (uri == -1 || cmdLine.length <= uri + 1)
      return;
    let uriParam = cmdLine.getArgument(uri + 1).toLowerCase();

    // Remove the arguments since they've been handled.
    cmdLine.removeArguments(uri, uri + 1);

	 var ioService = Cc["@mozilla.org/network/io-service;1"]
                  .getService(Ci.nsIIOService);
    let aURI = ioService.newURI(uriParam, null, null);
    let protocolFlags = ioService.getProtocolFlags(aURI.scheme);
    let scheme = ioService.extractScheme(uriParam);
	let path = aURI.path;
	
	dump("protocolFlags: " + protocolFlags + "\n");
	dump("scheme: " + scheme + "\n");
	dump("path: " + path + "\n");
		
    // Only perform the default action (i.e. loading the buddy list) if
    // Instantbird is launched with a status flag.
    if (cmdLine.state != Ci.nsICommandLine.STATE_INITIAL_LAUNCH)
      cmdLine.preventDefault = true;
  },

  // Follow the guidelines in nsICommandLineHandler.idl for the help info
  // specifically, flag descriptions should start at character 24, and lines
  // should be wrapped at 72 characters with embedded newlines, and finally, the
  // string should end with a newline.
  helpInfo: "  -uri <URI scheme>    http://en.wikipedia.org/wiki/URI_scheme\n" +
            "                       Example: xmpp:alexandersalas@jabber.com\n" +
            "                       Example: irc://moznet/mozillazine\n"
};

var NSGetFactory = XPCOMUtils.generateNSGetFactory([ProtocolCLH]);
