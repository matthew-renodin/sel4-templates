/**
 *@class TemplateState
 *
 */

var path = require('path'),
    fs = require('fs');


class ObjectAllocator {
	constructor(){
		this.spec = {
			arch: ''
		}
	}
}
class Stash {
	constructor (arch, rt){
		this.arch = arch;
		this.rt = rt;
		this.objects = 	new ObjectAllocator();
		this.addr_spaces = {}
		this.cspaces = {}
        this.current_cspace = null
        this.current_addr_space = null 
		this.elfs = {}
        this.current_cap_symbols = []
        this.cap_symbols = {}
        this.current_region_symbols = []
        this.region_symbols = {}

	}
}


class 
TemplateState {
    constructor( current_task, solution_mode, arch, rt ) {
        this.tasks = {};
        this.additional_files = [];
        this.current_task = current_task;
        this.solution = solution_mode;
        this.stash = new Stash(arch, rt);
    }

}


module.exports = TemplateState
