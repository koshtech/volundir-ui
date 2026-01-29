#!/usr/bin/env ruby

require 'webrick'
require 'logger'
require 'json'
require 'time'

PORT       = 3020
DOC_ROOT   = Dir.pwd
INDEX_FILE = 'index.html'
LOG_LEVEL  = :info

log = Logger.new($stdout)
log.level = LOG_LEVEL == :debug ? Logger::DEBUG : Logger::INFO

server = WEBrick::HTTPServer.new(
  Port: PORT,
  DocumentRoot: DOC_ROOT,
  AccessLog: [],
  Logger: WEBrick::Log.new(nil, 0)
)

# --------------------
# Static files
# --------------------
server.mount('/assets', WEBrick::HTTPServlet::FileHandler, DOC_ROOT)

# --------------------
# API routing
# --------------------
server.mount_proc '/api' do |req, res|
  path = req.path.sub(%r{^/api/?}, '')
  res['Content-Type'] = 'application/json'

  case path
  when 'hello'
    res.body = { message: 'Hello from Ruby backend' }.to_json
  when 'time'
    res.body = { time: Time.now.iso8601 }.to_json
  else
    res.status = 404
    res.body = { error: 'Not Found' }.to_json
  end
end

# --------------------
# App / Root routing
# --------------------
server.mount_proc '/' do |req, res|
  path = req.path

  log.info "[#{req.request_method}] #{path}"

  # Root → index.html
  if path == '/'
    index_path = File.join(DOC_ROOT, INDEX_FILE)

    if File.exist?(index_path)
      res.status = 200
      res['Content-Type'] = 'text/html'
      res.body = File.read(index_path)
    else
      res.status = 500
      res.body = 'index.html not found'
    end

    next
  end

  # real static file
  static_file = File.join(DOC_ROOT, path)

  if path.match?(/\.\w+$/) && File.file?(static_file)
    WEBrick::HTTPServlet::FileHandler
      .new(server, DOC_ROOT)
      .service(req, res)
    next
  end

  # any other case, return 404
  res.status = 404
  res['Content-Type'] = 'text/plain'
  res.body = '404 Not Found'
end

trap('INT') do
  puts "\nShutdown server..."
  server.shutdown
end

server.start
