#
# Just runs all the rake files of the submodules
#
# Copyright (C) 2009 Nikolay V. Nemshilov aka St.
#

require 'rake'
require 'front_compiler'

BUILD_DIR = 'build'

task :default => :build

desc "All the submodules building"
task :build do
  @comp = FrontCompiler.new
  
  puts "Deleting the old builds"
  
  FileUtils.rm_rf BUILD_DIR
  FileUtils.mkdir_p BUILD_DIR
  
  puts "Building the modules\n\n"
  modules = ENV['MODULES'] ? ENV['MODULES'].split(',') : FileList['src/*'].collect{|e| e.gsub('src/', '') }
  modules.each do |package|
    puts " * #{package.capitalize}"
    
    # collecting the javascript files
    filenames = File.read("src/#{package}/init.js").match(/\[(.+?)\]/im)[1].scan(/('|")(.+?)\1/).collect{|e| e.last }
    
    # collecting the javascript sources
    source = filenames.collect do |name|
      File.read("src/#{package}/#{name}.js")
    end.join("\n\n")
    
    # adding the stylesheet file
    source << @comp.inline_css(File.read("src/#{package}/#{package}.css")) rescue nil
    
    # reading the header
    header = File.read("src/#{package}/header.js")
    
    # creating the builds
    minified = @comp.compact_js(source)
    packed   = minified.create_self_build
    
    # writting the builds
    [
      ['',     packed],
      ['-min', minified],
      ['-src', source]
      
    ].each do |entry|
      File.open("#{BUILD_DIR}/right-#{package.gsub('_', '-')}#{entry[0]}.js", "w") do |f|
        f.write header
        f.write entry[1]
      end
    end
  end
  
  puts "\n"
end