#!/usr/bin/env node
/*
 *  Copyright 2019, Matthew Renodin
 *
 *   This software may be distributed and modified according to the terms of
 *    the BSD 2-Clause license. Note that NO WARRANTY is provided.
 *     See "LICENSE_BSD2.txt" for details.
 *
 */

const nunjucks = require('nunjucks'),
      fs = require('fs'),
      minimist = require('minimist'),
      path = require('path'),
      common = require('./Common'),
      context = require('./tools/Context'),
      templatestate = require('./tools/TemplateState')


async function print(str, file){
  fs.appendFileSync(file, str, function(err){console.error(error)})
  fs.appendFileSync(file, '\n', function(err){console.error(error)})
  return true
}

async function save_script_imports(args){
    console.log('Saving the script imports')
    let tools_dir = path.join(__dirname, 'tools')
  	if(args['input-files']) {
        print(__filename, args['input-files'])
    	try {
            fs.readdir(tools_dir, function(err, items) {
	        print(JSON.stringify(items),'somefile2')
            items = items.filter(item => item.endsWith('.py'))
		    for (i in items) {
               		print(path.join(tools_dir, items[i]), args['input-files']);
		    }
	        print(JSON.stringify(items),'somefile2')
            })
	    
    	}
        catch(err){
            console.log('init_template_directory: ', err.message)
        }
	}
	return args['input-files']
}

async function isFile(path) {
    try{
    	if (fs.existsSync(path)) {
            const stat = fs.lstatSync(path)
            if(stat.isFile() ){
	       return true
            }
	}
    }
    catch(err) {
	    console.error
    }
    return false
}


async function build_render_list(args) {
    await print( path.dirname(args['template-file']), 'somefile3')

    let data = {},
	dirname = path.dirname(args['template-file']),
	leaf = path.basename(args['template-file'])

	await print('1', 'error')
	let yaml_file = leaf.endsWith('yaml')? args['template-file']:  args['template-file']+'.yaml'
	await print('2', 'error')
	md_file = leaf.endsWith('md')? args['template-file']: args['template-file']+'.md'



	if(yaml_file && await isFile(yaml_file)){
		console.log('is yaml file')
 	}
    else if(md_file && await isFile(md_file)) {
        data['render'] = leaf
    }
   	
    return data
}

async function render_file(args, env, state, file) {
	const filename = path.join(args.out_dir, file),
		  templatedir = path.normalize(path.dirname(filename))
    let   in_stream,
          out_stream,
          template,
          input
        
    try {
		if ( !fs.existsSync (templatedir) ) {
			fs.mkdirSync(templatedir)
        }

        if(args.input_files) {
            const readStreamPath = path.join(path.split(args.templatefile)[0],file)
            in_stream = fs.createReadStream(readStreamPath);
            await print(readStreamPath, args.input_files)
        }
        if(args.output_file) {
            const writeStreamPath = filename
            out_stream = fs.createWriteStream(writeStreamPath)
            await print(writeStreamPath, args.output_files)
        }
        in_stream.on('readable', () => {
            input = in_stream.read()
        });
        in_stream.on('end', () => {
            template = new nunjucks.Template(input, env)
            out_stream.write(template.render(context.get_context(args, state)))
        });

	}
    catch(err){
        console.error('no access: ', err.message)
		return -1
	}
	finally {

	}
}

async function main(args){
  console.log('Starting sel4-template', args, process.env);
  await print(JSON.stringify(args), 'somefile')
  nunjucks.configure({ autoescape: true });
  console.log(nunjucks.renderString('Hello {{ username }}', { username: 'James' }));
  await save_script_imports(args)
  console.log('I waited my turn')
  
  let data = await build_render_list(args)
  await print(JSON.stringify(data), 'somedata');
  console.log('matthew:');
    

	//Build our rendering environment.
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.dirname(__filename)),
		{block_start_string:'/*-',
		block_end_string:'-*/',
		variable_start_string:'/*?',
	        variable_end_string:'?*/',
	        comment_start_string:'/*#',
		comment_end_string:'#*/'})
	await context.addFilters(env)

	state = new tutorialstate( args.task, args.solution, args.arch, args.rt )

	await render_file
	//env.filters.update(context.get_filters())


}


module.exports = () => {
  const args = minimist(process.argv.slice(2))
  main(args)
}

