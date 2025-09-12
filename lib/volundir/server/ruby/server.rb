#!/usr/bin/env ruby

require 'webrick'
require 'logger'
# require 'ruby-fake-api'

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

server.mount('/', WEBrick::HTTPServlet::FileHandler, DOC_ROOT)

# API routing
server.mount_proc '/api/' do |req, res|
  path = req.path.sub('/api/', '')
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

# App routing
server.mount_proc('/') do |req, res|
  path = req.path

  log.info "[#{req.request_method}] #{path}"
  log.debug "Headers: #{req.header.inspect}"
  log.debug "Body: #{req.body}" unless req.body.nil? || req.body.empty?

  static_file = File.join(DOC_ROOT, path)

  if path.match(/\.\w+$/) && File.exist?(static_file)
    # sleep(1)
    WEBrick::HTTPServlet::FileHandler.new(server, DOC_ROOT).service(req, res)
  else
    index_path = File.join(DOC_ROOT, INDEX_FILE)
    if File.exist?(index_path)
      res.body = File.read(index_path)
      res['Content-Type'] = 'text/html'
      res.status = 200
    else
      res.status = 404
      res.body = "404 Not Found"
    end
  end
end

trap('INT') do
  puts "\Shutdown server..."
  server.shutdown
end

puts "Volundir Ruby Development Server running at http://localhost:#{PORT}"
server.start
