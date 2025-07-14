#!/usr/bin/env ruby

require 'webrick'
require 'logger'

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

# Lida com arquivos estáticos normalmente
server.mount('/', WEBrick::HTTPServlet::FileHandler, DOC_ROOT)

# Lida com rotas SPA (qualquer path sem ponto, ou com PUT/DELETE/etc)
server.mount_proc('/') do |req, res|
  path = req.path

  log.info "[#{req.request_method}] #{path}"
  log.debug "Headers: #{req.header.inspect}"
  log.debug "Body: #{req.body}" unless req.body.nil? || req.body.empty?

  static_file = File.join(DOC_ROOT, path)

  # Se for um arquivo com extensão (ex: .js, .css, .png), não redireciona para index
  if path.match(/\.\w+$/) && File.exist?(static_file)
    # Deixe o WEBrick lidar com isso
    WEBrick::HTTPServlet::FileHandler.new(server, DOC_ROOT).service(req, res)
  else
    # SPA: devolve index.html
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
  puts "\nEncerrando servidor..."
  server.shutdown
end

puts "Servidor SPA disponível em http://localhost:#{PORT}"
server.start
