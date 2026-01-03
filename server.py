#!/usr/bin/env python
from __future__ import print_function
import sys

if sys.version_info[0] == 2:
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    import BaseHTTPServer

    class CORSRequestHandler (SimpleHTTPRequestHandler):
        def end_headers (self):
            self.send_header('Access-Control-Allow-Origin', '*')
            SimpleHTTPRequestHandler.end_headers(self)

    if __name__ == '__main__':
        BaseHTTPServer.test(CORSRequestHandler, BaseHTTPServer.HTTPServer)
else:
    from http.server import SimpleHTTPRequestHandler
    import socketserver

    socketserver.TCPServer.allow_reuse_address = True

    class CORSRequestHandler (SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header("Access-Control-Allow-Origin", "*")
            super().end_headers()

        def do_OPTIONS(self):
            self.send_response(200)
            super().end_headers()

    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print("Service HTTP on port %d with CORS enabled"%(PORT,))
        httpd.serve_forever()

