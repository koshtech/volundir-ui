#!/usr/bin/env ruby

require 'bundler/setup'
require 'webrick'
require 'logger'
require 'json'
require 'time'
require "ruby_fake_api"

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
# server.mount_proc '/api' do |req, res|
#   path = req.path.sub(%r{^/api/?}, '')
#   res['Content-Type'] = 'application/json'

#   case path
#   when 'fake'
#     store = RubyFakeApi::JsonFileStore.new(path: "db/fake_data/user.json")
#     results = store.read

#     puts "====> results: #{results}"

#     res.body = { response: results }.to_json
#   when 'hello'
#     res.body = { message: 'Hello from Ruby backend' }.to_json
#   when 'time'
#     res.body = { time: Time.now.iso8601 }.to_json
#   else
#     res.status = 404
#     res.body = { error: 'Not Found' }.to_json
#   end
# end

server.mount_proc '/api' do |req, res|
  res['Content-Type'] = 'application/json'

  segments = req.path.sub(%r{^/api/?}, '').split('/').reject(&:empty?)

  resource = segments[0] || 'fake'
  id       = segments[1]

  file_path = File.join('db/fake_data', "#{resource}.json")

  unless File.exist?(file_path)
    res.status = 404
    res.body = { error: "Resource '#{resource}' not found" }.to_json
    next
  end

  store = RubyFakeApi::JsonFileStore.new(path: file_path)
  data  = store.read || []

  case req.request_method
  when 'GET'
    if id
      item = data.find { |r| r['id'].to_s == id.to_s }
      if item
        res.body = { response: item }.to_json
      else
        res.status = 404
        res.body = { error: 'Record not found' }.to_json
      end
    else
      res.body = { response: data }.to_json
    end

  when 'POST'
    payload = JSON.parse(req.body || '{}')

    next_id = (data.map { |r| r['id'].to_i }.max || 0) + 1
    payload['id'] = next_id

    data << payload
    store.write(data)

    res.status = 201
    res.body = { response: payload }.to_json

  when 'PUT'
    unless id
      res.status = 400
      res.body = { error: 'ID required' }.to_json
      next
    end

    payload = JSON.parse(req.body || '{}')
    item = data.find { |r| r['id'].to_s == id.to_s }

    if item
      item.merge!(payload)
      store.write(data)
      res.body = { response: item }.to_json
    else
      res.status = 404
      res.body = { error: 'Record not found' }.to_json
    end

  when 'DELETE'
    before = data.size
    data.reject! { |r| r['id'].to_s == id.to_s }

    if data.size < before
      store.write(data)
      res.body = { response: 'Deleted' }.to_json
    else
      res.status = 404
      res.body = { error: 'Record not found' }.to_json
    end

  else
    res.status = 405
    res.body = { error: 'Method not allowed' }.to_json
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
