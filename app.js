#!/usr/bin/env node
/*
 Copyright 2019, Matthew Renodin

 This software may be distributed and modified according to the terms of
 the BSD 2-Clause license. Note that NO WARRANTY is provided.
 See "LICENSE_BSD2.txt" for details.

*/

const minimist = require('minimist')
const path = require('path')
var common = require('./Common')
var fs = require('fs')

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]


  var verbose
  var quiet
  var template
  var solution
  var plat
  var templatedir
  var initialized 	
  var builddir

  verbose = (!args.verbose) ? false : args.verbose
  quiet = (!args.quiet) ? true : args.quiet
  solution  = (!args.solution) ? false : args.solution
  templatedir = (!args.templatedir) ? process.cwd(): args.templatedir
  
  if(!args.template){
    logging.error("Template must be specified")
    console.log(common.ALL_TEMPLATES)
    return -1
  }
  else {
    template = args.template
  }	
  
  if(!args.plat) { 
    if( !common.TEMPLATES[template] ){
      console.log(common.TEMPLATES)
    }    
    else{
    	plat = common.TEMPLATES[template][0]
    }
  }
  else {
    if ( !common.TEMPLATES[template].includes(plat)){
      console.log("Template does not support that platform")
    } 
  }

  if(!args.task) { 
  }	

  console.log(templatedir)
  initialized = false
  
  if (fs.existsSync(templatedir + path.sep +'.template_config')) {
	initialized = true	     
  }

  try {
    fs.accessSync(process.cwd() + path.sep +'init', fs.constants.X_OK)
    templatedir = path.normalize(process.cwd() + '/' + template)
    if ( fs.existsSync (templatedir) ) 
    {
      templatedir = fs.mkdtempSync(templatedir)
    }
    else {
      fs.mkdirSync(templatedir)
    }
  }
  catch(err){
    console.error('no access: ', err.message)
    return -1	  
  }
  finally {
    if (!initialized){
      try {
        process.chdir(templatedir)
        fs.accessSync(process.cwd()+ path.sep + '..' + path.sep + 'init', fs.constants.X_OK)
        builddir = templatedir + "_build"
        fs.mkdirSync(builddir)
        common.init_directories(plat, template, initialized, templatedir, builddir)
      }
      catch(err){
	console.error('Failed to create the build directory', err.message)      
	return -1
      }
    }
  }
}

