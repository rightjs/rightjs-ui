#
# Just runs all the rake files of the submodules
#
# Copyright (C) 2009 Nikolay V. Nemshilov aka St.
#

require 'rake'

task :default => :build

desc "All the submodules building"
task :build do 
  FileList['src/**/Rakefile'].each do |filename|
    system "cd #{filename.gsub(/\/Rakefile$/, '')}; rake build"
  end
end