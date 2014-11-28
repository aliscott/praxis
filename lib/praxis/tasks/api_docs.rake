namespace :praxis do
  desc "Generate API docs (JSON definitions) for a Praxis App"
  task :api_docs => [:environment] do |t, args|
    require 'fileutils'

    Praxis::Blueprint.caching_enabled = false
    generator = RestfulDocGenerator.new(Dir.pwd)
  end

  desc "API Documenation Browser"
  desc "API Documentation Browser"
  task :doc_browser => [:api_docs] do
    public_folder =  File.expand_path("../../../", __FILE__) + "/api_browser/app"
    app = Rack::Builder.new do
      map "/docs" do # application JSON docs
        use Rack::Static, urls: [""], root: File.join(Dir.pwd, RestfulDocGenerator::API_DOCS_DIRNAME)
      end
      map "/" do # Assets mapping
        use Rack::Static, urls: [""], root: public_folder, index: "index.html"
      end

      run lambda { |env| [404, {'Content-Type' => 'text/plain'}, ['Not Found']] }
    end

    Rack::Server.start app: app, Port: 4567
  end
end
