/**
 *@class Context
 *
 */

var path = require('path'),
    fs = require('fs');



class TemplateFilters {
	constructor(){
        
    }

    File (context, content, filename, kwargs) {
    	let args = context['args']
	    if (args.out_dir && !args.docsite) {
		    filename = path.join(args.out_dir, filename)
            //if( !fs.path.)
            console.log('filename: ', filename)
	    }
	    return context
    }

    ExternalFile(context, filename) {
        let state = context['state']
        state.additional_files.append(filename)
    }

    include_task(context, task_name, subtask) {
        let state = context['state']
        task = state.get_task(task_name)
        content = state.print_task(task, subtask)
        if(!task)
            throw Exception('No content found')
    }
    
    normalise_task_name(task_name) {

    }

    include_task_type_replace(context, task_name) {

    }

    
}


class Context {
    constructor() {
        this.TemplateFilters = new TemplateFilters();
	this.context = null;
    }
    async add_filters(env) {
        env.addFilter('File', this.TemplateFilters.File)
        env.addFilter('ExternalFile', this.TemplateFilters.ExternalFile)
        env.addFilter('include_task_type_replace', this.TemplateFilters.include_task_type_replace)
	    return	
    }
    
    async get_context (args, state) {
	this.context = {
		solution: args.solution,
		args: args,
		state: state,
		TaskConentType: TaskContentType,
		macros: macros,
		tab: '\t'
	}
	    
	return context
    }
}





module.exports = new Context()
