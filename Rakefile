#
# The modules building task
#

require 'rake'
require 'fileutils'
require 'front_compiler'
require 'util/build/rutil'

BUILD_DIR    = 'build'
BUILD_PREFIX = 'right'

$widgets = FileList['dist/*'].collect do |dirname|
  dirname.gsub('dist/', '')
end

options = ((ENV['OPTIONS'] || '').split('=').last || '').strip.split(/\s*,\s*/)

unless options.empty?
  $widgets.reject! do |name|
    !options.include?(name)
  end
end

$rutils = {};

######################################################################
#  Cleaning up the build directory
######################################################################
desc "Cleans up the build directory"
task :clean do
  puts ' * Nuking the build dir'
  FileUtils.rm_rf BUILD_DIR
  Dir.mkdir BUILD_DIR
end

######################################################################
#  Packs the widgets into source files
######################################################################
desc "Packs the widgets into source files"
task :pack do
  Rake::Task['clean'].invoke

  puts " * Packing the source code files"
  $widgets.each do |widget|
    puts "   - #{widget}"

    # parsing the init script of the list of files
    init  = File.read("src/#{widget}/__init__.js")
    files = ["lib/widget.js"]
    css   = []

    # parsing out the shared javascript files list
    init.gsub!(/include_shared_js\(([^\)]+)\)(;*)/m) do |match|
      $1.dup.scan(/('|")([\w\d\_\-\/]+)\1/).each do |m|
        files << "lib/#{m[1]}.js"
      end
      ''
    end

    # parsing out the shared css-files list
    init.gsub!(/include_shared_css\(([^\)]+)\)(;*)/m) do |match|
      $1.dup.scan(/('|")([\w\d\_\-\/]+)\1/).each do |m|
        css << "lib/css/#{m[1]}.css"
      end
      ''
    end

    # parsing out the list of widget own files
    files += init.scan(/('|")([\w\d\_\-\/]+)\1/).collect do |match|
      "src/#{widget}/#{match[1]}.js"
    end

    rutil = RUtil.new("dist/#{widget}/header.js", "dist/#{widget}/layout.js")
    rutil.pack(files) do |source|
      # inserting the initialization script
      id = source.index('*/')

      source = source[0,id+2] +
        "\n\n#{init.gsub(/include_module_files\([^\)]+\)(;*)/m, '')}" +
      source[id+2, source.size]

      # adding the inlined-css entry
      source + "\n\n" + FrontCompiler.new.inline_css(
        (css + ["src/#{widget}/#{widget}.css"]).collect do |filename|
          File.read(filename)
        end.join("\n")
      ).gsub(/([^\s])\*/, '\1 *')
    end
    rutil.write("#{BUILD_DIR}/#{BUILD_PREFIX}-#{widget.gsub('_', '-')}.js")

    $rutils[widget] = rutil
  end
end

######################################################################
#  Checks the source-code with jslint
######################################################################
desc "Checks the source-code with jslint"
task :check do
  Rake::Task['pack'].invoke
  puts " * Running the jslint check"

  $rutils.each do |widget, rutil|
    puts "   - #{widget}"
    rutil.check "dist/#{widget}/lint.js"
  end
end

######################################################################
#  Builds the widgets into minified files
######################################################################
desc "Builds the widgets into minified files"
task :build do
  Rake::Task['pack'].invoke
  puts " * Minifying the source code"

  $rutils.each do |widget, rutil|
    puts "   - #{widget}"
    rutil.compile
  end
end

######################################################################
#  Blindly pulls and merges stuff from a particular user
######################################################################
desc "Handle github pull requests"
task :pull do
  if username = ENV['LOGIN']
    puts " * Handling a pull request from #{username}"

    puts %Q{
      git remote rm #{username} &> /dev/null
      git remote add #{username} http://github.com/#{username}/rightjs-ui.git
      git fetch #{username}
      git merge #{username}/master
      git push
    }
  else
    puts "please specify the github username, like\n   rake pull LOGIN=boohoo"
  end
end

